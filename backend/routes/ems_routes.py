"""
108 EMS Pre-Arrival Router for PatientTriage.ai
Handles ambulance en-route telemetry, pre-arrival risk calculation, and resus bay pre-allocation.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
import json

from ..services.risk_engine import calculate_triage_assessment
from ..services.audit_service import log_audit_event

router = APIRouter(prefix="/api/ems", tags=["EMS 108 Pre-Arrival"])

# In-memory / simulated active incoming EMS telemetry
MOCK_INCOMING_EMS = [
    {
        "id": "EMS-108-A42",
        "ambulance_unit": "108 Unit #42 (ALS Metro)",
        "eta_mins": 7,
        "patient_name": "Ramesh Kulkarni",
        "age": 58,
        "gender": "Male",
        "chief_complaint": "Acute crushing retrosternal chest pain radiating to left jaw; diaphoresis",
        "vitals": {
            "heart_rate": 118,
            "systolic_bp": 88,
            "diastolic_bp": 54,
            "spo2": 91,
            "resp_rate": 26,
            "temperature": 37.1
        },
        "paramedic_notes": "12-lead ECG transmitted: ST elevation in leads II, III, aVF (Inferior STEMI). IV 18G left AC, Aspirin 325mg given en route. O2 at 4L NC.",
        "pre_allocated_bay": "Resuscitation Bay 1",
        "status": "EN_ROUTE"
    },
    {
        "id": "EMS-108-B19",
        "ambulance_unit": "108 Unit #19 (BLS Suburban)",
        "eta_mins": 14,
        "patient_name": "Sunita Verma",
        "age": 34,
        "gender": "Female",
        "chief_complaint": "Motorcycle collision with moderate head trauma; transient LOC",
        "vitals": {
            "heart_rate": 96,
            "systolic_bp": 124,
            "diastolic_bp": 78,
            "spo2": 98,
            "resp_rate": 18,
            "temperature": 36.8
        },
        "paramedic_notes": "C-spine immobilized with rigid collar. GCS 14 (E4 V4 M6 - confused speech). Pupils equal and reactive.",
        "pre_allocated_bay": None,
        "status": "EN_ROUTE"
    }
]

class PreallocateBayRequest(BaseModel):
    ems_id: str = Field(..., description="Ambulance unit or run ID")
    bay_name: str = Field(..., description="Designated ED resuscitation or trauma bay")
    assigned_by: Optional[str] = "Charge Nurse (Control Tower)"

@router.get("/incoming")
def get_incoming_ems():
    """Returns active incoming 108 EMS telemetry with pre-computed acuity and safety recommendations."""
    results = []
    for ems in MOCK_INCOMING_EMS:
        assessment = calculate_triage_assessment(
            age=ems["age"],
            chief_complaint=ems["chief_complaint"],
            symptoms=["Chest Pain", "Diaphoresis", "Hypotension"] if "chest pain" in ems["chief_complaint"].lower() else ["Trauma", "LOC"],
            vitals=ems["vitals"],
            has_medical_history=True,
            medical_history=["CAD"] if "chest pain" in ems["chief_complaint"].lower() else []
        )
        results.append({
            **ems,
            "precomputed_triage_level": assessment["triage_level"],
            "precomputed_category": assessment["triage_category"],
            "risk_score": assessment["risk_score"],
            "recommended_action": "PREPARE RESUS BAY & CARDIAC TEAM" if assessment["triage_level"] <= 2 else "ASSIGN TREATMENT BAY"
        })
    return {"incoming_ambulances": results, "count": len(results)}

@router.post("/pre-allocate-bay")
def preallocate_bay(req: PreallocateBayRequest):
    """Pre-allocates an ED Resuscitation Bay before the ambulance arrives."""
    for ems in MOCK_INCOMING_EMS:
        if ems["id"] == req.ems_id:
            ems["pre_allocated_bay"] = req.bay_name
            log_audit_event(
                event_type="EMS_BAY_PRE_ALLOCATION",
                patient_id=req.ems_id,
                clinician_decision=f"Pre-allocated {req.bay_name} for 108 EMS {ems['ambulance_unit']}",
                clinician_role=req.assigned_by,
                outcome=f"Bay reserved. Team alerted {ems['eta_mins']} mins before arrival."
            )
            return {
                "success": True,
                "ems_id": req.ems_id,
                "bay_name": req.bay_name,
                "message": f"Successfully pre-allocated {req.bay_name} for {ems['ambulance_unit']}"
            }
    raise HTTPException(status_code=404, detail="EMS Unit not found")

@router.post("/fhir-bundle")
def ingest_fhir_ems_bundle(bundle: dict):
    """
    HL7 FHIR Pre-Arrival Handoff Bridge.
    Ingests standard FHIR Bundle with LOINC Observation codes from 108 ambulance telemetry.
    """
    resource_type = bundle.get("resourceType", "")
    if resource_type != "Bundle":
        raise HTTPException(status_code=400, detail="Invalid FHIR resource: Expected 'Bundle'")

    entries = bundle.get("entry", [])
    parsed_vitals = {}
    patient_name = "Emergency Patient"
    age = 45
    gender = "Unknown"
    chief_complaint = "In-transit emergency presentation"
    unit_id = f"EMS-108-FHIR-{len(MOCK_INCOMING_EMS)+1}"
    eta_mins = 10

    # LOINC code map
    loinc_map = {
        "8867-4": "heart_rate",
        "8480-6": "systolic_bp",
        "8462-4": "diastolic_bp",
        "2708-6": "spo2",
        "59408-5": "spo2",
        "9279-1": "resp_rate",
        "8310-5": "temperature"
    }

    for entry in entries:
        res = entry.get("resource", {})
        rtype = res.get("resourceType")
        if rtype == "Patient":
            names = res.get("name", [{}])
            given = names[0].get("given", [""])[0] if names[0].get("given") else ""
            family = names[0].get("family", "")
            patient_name = f"{given} {family}".strip() or patient_name
            gender = res.get("gender", gender).capitalize()
            birth_date = res.get("birthDate")
            if birth_date:
                try:
                    birth_year = int(birth_date.split("-")[0])
                    age = datetime.now().year - birth_year
                except Exception:
                    pass
        elif rtype == "Condition":
            chief_complaint = res.get("code", {}).get("text", chief_complaint)
        elif rtype == "Observation":
            codings = res.get("code", {}).get("coding", [])
            for c in codings:
                code = c.get("code")
                if code in loinc_map:
                    val = res.get("valueQuantity", {}).get("value")
                    if val is not None:
                        field_name = loinc_map[code]
                        if field_name == "temperature":
                            parsed_vitals[field_name] = float(val)
                        else:
                            parsed_vitals[field_name] = int(val)

    # Run pre-arrival risk calculation
    assessment = calculate_triage_assessment(
        age=age,
        chief_complaint=chief_complaint,
        symptoms=["In-transit emergency"],
        vitals=parsed_vitals,
        has_medical_history=True,
        medical_history=[]
    )

    new_record = {
        "id": unit_id,
        "ambulance_unit": f"108 Unit (FHIR Ingest #{len(MOCK_INCOMING_EMS)+1})",
        "eta_mins": eta_mins,
        "patient_name": patient_name,
        "age": age,
        "gender": gender,
        "chief_complaint": chief_complaint,
        "vitals": parsed_vitals,
        "paramedic_notes": f"HL7 FHIR Ingest: Inbound telemetry verified. SpO2 {parsed_vitals.get('spo2', 'N/A')}%, HR {parsed_vitals.get('heart_rate', 'N/A')} bpm.",
        "pre_allocated_bay": "Resuscitation Bay 1" if assessment["triage_level"] <= 2 else None,
        "status": "EN_ROUTE"
    }
    MOCK_INCOMING_EMS.append(new_record)

    log_audit_event(
        event_type="FHIR_EMS_PRE_ARRIVAL_INGEST",
        patient_id=unit_id,
        clinician_decision=f"Ingested FHIR Bundle for {patient_name} — Acuity Level {assessment['triage_level']}",
        clinician_role="HL7 FHIR Telemetry Bridge",
        outcome=f"Pre-computed risk: {assessment['risk_score']}%. Bay pre-allocation: {new_record['pre_allocated_bay'] or 'Queue'}"
    )

    return {
        "resourceType": "OperationOutcome",
        "issue": [
            {
                "severity": "information",
                "code": "informational",
                "diagnostics": f"Successfully ingested HL7 FHIR Bundle for {patient_name}. Assigned pre-arrival ID {unit_id}."
            }
        ],
        "parsed_ems_record": {
            **new_record,
            "precomputed_triage_level": assessment["triage_level"],
            "precomputed_category": assessment["triage_category"],
            "risk_score": assessment["risk_score"]
        }
    }

