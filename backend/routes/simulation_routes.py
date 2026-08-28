"""
ED Replay & Simulation Routes for PatientTriage.ai
Simulates chronological progression of the Emergency Department waiting room across time ticks (10:00 AM -> 11:31 AM).
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
import json
from datetime import datetime, timezone
from backend.database import get_db_connection
from backend.routes.patient_routes import evaluate_patient_dynamic_state
from backend.services.audit_service import log_audit_event

router = APIRouter(prefix="/api/simulation", tags=["simulation"])

SIMULATION_TIMELINE_STEPS = [
    {
        "step_index": 0,
        "time_str": "10:00 AM",
        "clock_minutes": 0,
        "phase_name": "BASELINE_MORNING_CENSUS",
        "description": "Baseline ED waiting room census. All benchmark patients at standard initial triage scores.",
        "target_patient_id": "P-017",
        "target_status": "L3 Urgent (Risk: 18 - 🟢 Stable)",
        "target_rank": 17,
        "vitals_delta": "SpO₂ 96%, HR 92 bpm, BP 122/78",
        "live_event_msg": "🟢 ED census stable at 20 patients. Baseline monitoring active.",
        "spo2": 96,
        "hr": 92,
        "sbp": 122,
        "is_attended": False,
        "elapsed_mins": 5
    },
    {
        "step_index": 1,
        "time_str": "10:35 AM",
        "clock_minutes": 35,
        "phase_name": "PROLONGED_WAITING",
        "description": "Patient P-017 has waited 35 mins without reassessment. Safety Clock enters yellow caution zone.",
        "target_patient_id": "P-017",
        "target_status": "L3 Urgent (Risk: 27 - 🟢 Stable / Watch)",
        "target_rank": 12,
        "vitals_delta": "SpO₂ 95%, HR 98 bpm (Mild tachycardia)",
        "live_event_msg": "⏱️ P-017 waiting time exceeded 30m. Evidence shelf-life degrading.",
        "spo2": 95,
        "hr": 98,
        "sbp": 120,
        "is_attended": False,
        "elapsed_mins": 35
    },
    {
        "step_index": 2,
        "time_str": "11:05 AM",
        "clock_minutes": 65,
        "phase_name": "EVIDENCE_STALENESS_EXPIRED",
        "description": "Evidence shelf-life exceeded. Safety status flips to EXPIRED; uncertainty penalty applied.",
        "target_patient_id": "P-017",
        "target_status": "L3 Urgent (Risk: 41 - 🟡 WATCH)",
        "target_rank": 7,
        "vitals_delta": "SpO₂ 94%, HR 105 bpm (Unmonitored)",
        "live_event_msg": "🟠 P-017 Safety Clock EXPIRED (65m unmonitored). Staleness penalty +18 added.",
        "spo2": 94,
        "hr": 105,
        "sbp": 118,
        "is_attended": False,
        "elapsed_mins": 65
    },
    {
        "step_index": 3,
        "time_str": "11:21 AM",
        "clock_minutes": 81,
        "phase_name": "ACUTE_PHYSIOLOGICAL_DETERIORATION",
        "description": "Sudden drop in oxygen saturation (96% -> 91%) and surge in heart rate (92 -> 117 bpm).",
        "target_patient_id": "P-017",
        "target_status": "L2 Escalation (Risk: 67 - 🟠 REASSESS NOW)",
        "target_rank": 3,
        "vitals_delta": "SpO₂ 91% (↓ 5%), HR 117 bpm (↑ 25 bpm)",
        "live_event_msg": "🔴 RAPID DETERIORATION detected on P-017 (SpO₂ ↓ 5%). Attention Gap elevating card to Top 3!",
        "spo2": 91,
        "hr": 117,
        "sbp": 112,
        "is_attended": False,
        "elapsed_mins": 81
    },
    {
        "step_index": 4,
        "time_str": "11:28 AM",
        "clock_minutes": 88,
        "phase_name": "SURGE_TO_RANK_ONE",
        "description": "Patient P-017 reaches Rank #1 in Live Action Queue, outranking attended critical trauma patients.",
        "target_patient_id": "P-017",
        "target_status": "L2 Immediate (Risk: 84 - 🔴 ESCALATE TO BAY)",
        "target_rank": 1,
        "vitals_delta": "SpO₂ 89% (↓ 7%), HR 124 bpm, RR 28 /min",
        "live_event_msg": "🚨 P-017 SURGED TO RANK #1: Unattended deteriorating viral pneumonia outranks attended cases!",
        "spo2": 89,
        "hr": 124,
        "sbp": 108,
        "is_attended": False,
        "elapsed_mins": 88
    },
    {
        "step_index": 5,
        "time_str": "11:29 AM",
        "clock_minutes": 89,
        "phase_name": "CLINICIAN_CLOSED_LOOP_REASSESSMENT",
        "description": "Triage nurse initiates bedside reassessment, administers supplemental O₂ and starts IV fluids.",
        "target_patient_id": "P-017",
        "target_status": "REASSESSMENT IN PROGRESS (Administering 4L O₂)",
        "target_rank": 1,
        "vitals_delta": "SpO₂ rising: 89% -> 95%, HR recovering: 124 -> 101 bpm",
        "live_event_msg": "👩⚕️ Nurse Sarah Chen administering bedside O₂ to P-017. Pre-order Troponin/CXR auto-approved.",
        "spo2": 95,
        "hr": 101,
        "sbp": 116,
        "is_attended": True,
        "elapsed_mins": 89
    },
    {
        "step_index": 6,
        "time_str": "11:31 AM",
        "clock_minutes": 91,
        "phase_name": "STABILIZATION_AND_CLOSED_LOOP_RESOLUTION",
        "description": "Patient stabilized. Risk recalculated (84 -> 38). Patient leaves emergency queue to Treatment Bay 4.",
        "target_patient_id": "P-017",
        "target_status": "🟢 STABILIZED (Risk: 38 - CONTINUE MONITORING)",
        "target_rank": 14,
        "vitals_delta": "SpO₂ 96%, HR 94 bpm, BP 120/76 (Treatment Bay 4)",
        "live_event_msg": "✓ Closed-Loop Complete: P-017 stabilized in 3m 42s. Safety Outcome recorded to Audit Ledger.",
        "spo2": 96,
        "hr": 94,
        "sbp": 120,
        "is_attended": True,
        "elapsed_mins": 91
    }
]

@router.get("/timeline")
def get_simulation_timeline():
    """Returns the pre-defined 7-phase simulation timeline steps."""
    return {
        "total_steps": len(SIMULATION_TIMELINE_STEPS),
        "steps": SIMULATION_TIMELINE_STEPS
    }

@router.post("/apply-step/{step_index}")
def apply_simulation_step(step_index: int):
    """
    Applies the specified simulation step to the live database so that the UI reflects the real-time shift.
    """
    if step_index < 0 or step_index >= len(SIMULATION_TIMELINE_STEPS):
        raise HTTPException(status_code=400, detail="Invalid simulation step index")

    step = SIMULATION_TIMELINE_STEPS[step_index]
    target_id = step["target_patient_id"]

    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch target patient
    cursor.execute("SELECT * FROM patients WHERE id = ?", (target_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Target simulation patient not found")

    # Insert fresh vital record
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("""
        INSERT INTO vital_records (patient_id, timestamp_mins, heart_rate, systolic_bp, diastolic_bp, spo2, resp_rate, temperature, recorded_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        target_id,
        step["clock_minutes"],
        step["hr"],
        step["sbp"],
        78,
        step["spo2"],
        22 if step["spo2"] < 93 else 18,
        37.8,
        "Simulation Engine",
        now_iso
    ))

    # Update patient elapsed time and attended status
    cursor.execute("""
        UPDATE patients
        SET is_attended = ?,
            total_waiting_mins = ?,
            elapsed_since_vital = ?,
            updated_at = ?
        WHERE id = ?
    """, (
        1 if step["is_attended"] else 0,
        step["elapsed_mins"],
        0 if step_index >= 3 else 35,
        now_iso,
        target_id
    ))

    # Fetch vital history
    cursor.execute("SELECT * FROM vital_records WHERE patient_id = ? ORDER BY timestamp_mins ASC", (target_id,))
    v_rows = cursor.fetchall()
    vital_history = [dict(v) for v in v_rows]

    # Fetch updated patient dict
    cursor.execute("SELECT * FROM patients WHERE id = ?", (target_id,))
    updated_row = cursor.fetchone()
    updated_p_dict = dict(updated_row)
    updated_p_dict["symptoms"] = json.loads(updated_p_dict["symptoms"]) if updated_p_dict["symptoms"] else []
    updated_p_dict["medical_history"] = json.loads(updated_p_dict["medical_history"]) if updated_p_dict["medical_history"] else []

    eval_state = evaluate_patient_dynamic_state(updated_p_dict, vital_history)

    # Log to audit trail
    log_audit_event(
        event_type="SIMULATION_STEP_ADVANCE",
        patient_id=target_id,
        ai_recommendation=f"Replay Step {step_index} ({step['time_str']}): {step['phase_name']}",
        clinician_decision=step["vitals_delta"],
        clinician_role="Simulation Controller",
        outcome=step["live_event_msg"],
        conn=conn
    )

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "applied_step": step,
        "updated_evaluation": eval_state
    }
