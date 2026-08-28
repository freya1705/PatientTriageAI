"""
Unit and Integration Tests for Newly Added Control Tower & Research-Driven Features:
1. Attendant Away Toggle & Surveillance
2. 108 EMS Pre-Arrival Telemetry & Resus Bay Pre-Allocation
3. Referral Candidate Eligibility for Crowded ED Relieving
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database import init_db, get_db_connection
from backend.services.attention_gap_engine import compute_referral_eligibility

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    init_db(seed_if_empty=True)

def test_attendant_status_toggle():
    """Test toggling the attendant_away flag for a patient."""
    # 1. Toggle to True
    res = client.post("/api/patients/P-001/toggle-attendant")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["patient_id"] == "P-001"
    assert data["attendant_away"] is True

    # Verify in patient list
    list_res = client.get("/api/patients")
    assert list_res.status_code == 200
    p1 = next(p for p in list_res.json() if p["id"] == "P-001")
    assert p1["attendant_away"] is True

    # 2. Toggle back to False
    res2 = client.post("/api/patients/P-001/toggle-attendant")
    assert res2.status_code == 200
    assert res2.json()["attendant_away"] is False

def test_ems_incoming_telemetry():
    """Test 108 EMS inbound ambulance feed with pre-computed acuity."""
    res = client.get("/api/ems/incoming")
    assert res.status_code == 200
    data = res.json()
    assert "incoming_ambulances" in data
    assert len(data["incoming_ambulances"]) >= 2

    unit1 = data["incoming_ambulances"][0]
    assert "precomputed_triage_level" in unit1
    assert unit1["precomputed_triage_level"] in [1, 2] # STEMI chest pain is high acuity
    assert "ETA: " not in unit1["id"]

def test_ems_bay_preallocation():
    """Test pre-allocating an ED resuscitation bay for an incoming ambulance."""
    payload = {
        "ems_id": "EMS-108-A42",
        "bay_name": "Resuscitation Bay 1",
        "assigned_by": "Charge Nurse Sarah Chen"
    }
    res = client.post("/api/ems/pre-allocate-bay", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["bay_name"] == "Resuscitation Bay 1"

def test_ems_bay_preallocation_invalid_unit():
    """Test pre-allocating bay for non-existent unit raises 404."""
    payload = {
        "ems_id": "EMS-NONEXISTENT",
        "bay_name": "Resus 1"
    }
    res = client.post("/api/ems/pre-allocate-bay", json=payload)
    assert res.status_code == 404

def test_referral_eligibility_positive():
    """Test stable low-acuity patient is flagged as referral eligible."""
    patient = {
        "id": "P-TEST",
        "triage_level": 4,
        "risk_score": 18.0,
        "deterioration_score": 0.0,
        "trajectory_status": "STABLE",
        "is_uncertain": False,
        "age": 28,
        "pain_score": 2
    }
    res = compute_referral_eligibility(patient)
    assert res["referral_eligible"] is True
    assert "Primary Health Centre" in res["referral_facility"]

def test_referral_eligibility_negative_high_risk():
    """Test high-risk patient is NOT eligible for referral."""
    patient = {
        "id": "P-TEST",
        "triage_level": 2,
        "risk_score": 78.0,
        "deterioration_score": 0.0,
        "trajectory_status": "STABLE",
        "is_uncertain": False,
        "age": 45,
        "pain_score": 8
    }
    res = compute_referral_eligibility(patient)
    assert res["referral_eligible"] is False

def test_referral_eligibility_negative_deteriorating():
    """Test deteriorating patient is NOT eligible for referral even if level 4."""
    patient = {
        "id": "P-TEST",
        "triage_level": 4,
        "risk_score": 22.0,
        "deterioration_score": 25.0,
        "trajectory_status": "WORSENING",
        "is_uncertain": False,
        "age": 30,
        "pain_score": 3
    }
    res = compute_referral_eligibility(patient)
    assert res["referral_eligible"] is False

def test_referral_eligibility_negative_infant():
    """Test infant under 2 is excluded from community referral for safety."""
    patient = {
        "id": "P-TEST",
        "triage_level": 4,
        "risk_score": 15.0,
        "deterioration_score": 0.0,
        "trajectory_status": "STABLE",
        "is_uncertain": False,
        "age": 1,
        "pain_score": 2
    }
    res = compute_referral_eligibility(patient)
    assert res["referral_eligible"] is False

def test_referral_flag_in_live_queue():
    """Test that referral eligibility metadata is included in live queue response."""
    res = client.get("/api/queue/live")
    assert res.status_code == 200
    data = res.json()
    assert "all_patients" in data
    # At least one low-acuity patient should be eligible
    eligible_patients = [p for p in data["all_patients"] if p.get("referral_eligible") is True]
    assert len(eligible_patients) >= 1
    assert eligible_patients[0]["referral_facility"] is not None
    assert "referral_eligibility_score" in eligible_patients[0]
    assert 0 <= eligible_patients[0]["referral_eligibility_score"] <= 100

def test_referral_eligibility_continuous_score():
    """Test that continuous RES score is bounded 0-100%."""
    patient = {
        "id": "P-TEST-RES",
        "triage_level": 5,
        "risk_score": 10.0,
        "deterioration_score": 0.0,
        "trajectory_status": "STABLE",
        "is_uncertain": False,
        "age": 22,
        "pain_score": 1
    }
    res = compute_referral_eligibility(patient)
    assert res["referral_eligible"] is True
    assert 80.0 <= res["referral_eligibility_score"] <= 100.0

def test_fhir_bundle_ingestion():
    """Test HL7 FHIR Bundle ingestion with standard LOINC vitals."""
    fhir_bundle = {
        "resourceType": "Bundle",
        "type": "collection",
        "entry": [
            {
                "resource": {
                    "resourceType": "Patient",
                    "name": [{"given": ["Aarav"], "family": "Patel"}],
                    "gender": "male",
                    "birthDate": "1980-05-12"
                }
            },
            {
                "resource": {
                    "resourceType": "Condition",
                    "code": {"text": "Severe palpitation and shortness of breath"}
                }
            },
            {
                "resource": {
                    "resourceType": "Observation",
                    "code": {"coding": [{"system": "http://loinc.org", "code": "8867-4"}]},
                    "valueQuantity": {"value": 125, "unit": "beats/minute"}
                }
            },
            {
                "resource": {
                    "resourceType": "Observation",
                    "code": {"coding": [{"system": "http://loinc.org", "code": "2708-6"}]},
                    "valueQuantity": {"value": 92, "unit": "%"}
                }
            },
            {
                "resource": {
                    "resourceType": "Observation",
                    "code": {"coding": [{"system": "http://loinc.org", "code": "8480-6"}]},
                    "valueQuantity": {"value": 95, "unit": "mmHg"}
                }
            }
        ]
    }
    res = client.post("/api/ems/fhir-bundle", json=fhir_bundle)
    assert res.status_code == 200
    data = res.json()
    assert data["resourceType"] == "OperationOutcome"
    assert "parsed_ems_record" in data
    rec = data["parsed_ems_record"]
    assert rec["patient_name"] == "Aarav Patel"
    assert rec["vitals"]["spo2"] == 92
    assert rec["vitals"]["heart_rate"] == 125
    assert rec["precomputed_triage_level"] in [1, 2, 3] # Urgent in-transit triage Level
    assert rec["risk_score"] > 0

def test_fhir_bundle_invalid_resource():
    """Test FHIR ingestion rejects non-Bundle resource type."""
    res = client.post("/api/ems/fhir-bundle", json={"resourceType": "Observation"})
    assert res.status_code == 400
    assert "Expected 'Bundle'" in res.json()["detail"]

