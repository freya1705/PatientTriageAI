"""
Autonomous Standing Pre-Order Hub API Routes for PatientTriage.ai
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import json
from backend.database import get_db_connection
from backend.services.preorder_engine import generate_standing_preorders
from backend.services.audit_service import log_audit_event

router = APIRouter(prefix="/api/preorders", tags=["preorders"])

_PREORDER_STATUS_STORE: Dict[str, Dict[str, Any]] = {}

class PreorderActionRequest(BaseModel):
    action: str  # 'APPROVE' or 'DISMISS'
    clinician_name: Optional[str] = "RN Sarah Chen"
    dismiss_reason: Optional[str] = None

@router.get("/")
def list_all_preorders():
    """
    Scans active waiting patients and returns all generated auto-drafted pre-orders.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients")
    rows = cursor.fetchall()

    all_orders = []
    for r in rows:
        p_dict = dict(r)
        cursor.execute("SELECT * FROM vital_records WHERE patient_id = ? ORDER BY timestamp_mins ASC", (p_dict["id"],))
        v_rows = cursor.fetchall()
        vital_history = [dict(v) for v in v_rows]
        latest_v = vital_history[-1] if vital_history else {}

        eval_payload = {
            **p_dict,
            "latest_vitals": {
                "spo2": latest_v.get("spo2"),
                "hr": latest_v.get("heart_rate"),
                "sbp": latest_v.get("systolic_bp"),
                "rr": latest_v.get("resp_rate"),
                "temp": latest_v.get("temperature")
            }
        }
        patient_orders = generate_standing_preorders(eval_payload)
        for ord_item in patient_orders:
            ord_id = ord_item["order_id"]
            if ord_id in _PREORDER_STATUS_STORE:
                ord_item.update(_PREORDER_STATUS_STORE[ord_id])
            ord_item["patient_name"] = p_dict["name"]
            ord_item["triage_level"] = p_dict["triage_level"]
            all_orders.append(ord_item)

    conn.close()

    # Sort so auto-drafted STAT orders are on top
    all_orders.sort(key=lambda x: (x.get("status") != "AUTO_DRAFTED", "STAT" not in x.get("priority", "")))

    return {
        "total_preorders": len(all_orders),
        "pending_drafts_count": sum(1 for o in all_orders if o.get("status") == "AUTO_DRAFTED"),
        "preorders": all_orders
    }

@router.post("/{order_id}/approve")
def approve_preorder(order_id: str, req: PreorderActionRequest):
    """Approves an auto-drafted standing pre-order and routes it to auxiliary staff."""
    conn = get_db_connection()

    _PREORDER_STATUS_STORE[order_id] = {
        "status": "APPROVED_AND_ROUTED",
        "approved_by": req.clinician_name,
        "action_timestamp": "Just Now"
    }

    patient_id = order_id.split("-")[1] if "-" in order_id else "UNKNOWN"
    log_audit_event(
        event_type="PREORDER_APPROVED",
        patient_id=patient_id,
        ai_recommendation=f"Auto-Drafted Standing Pre-Order {order_id}",
        clinician_decision="Approved & Routed to Auxiliary Tech",
        clinician_role=req.clinician_name,
        outcome="Order dispatched to tech queue.",
        conn=conn
    )
    conn.close()

    return {
        "status": "success",
        "order_id": order_id,
        "new_status": "APPROVED_AND_ROUTED",
        "message": f"Pre-order {order_id} approved by {req.clinician_name} and routed to auxiliary staff."
    }

@router.post("/{order_id}/dismiss")
def dismiss_preorder(order_id: str, req: PreorderActionRequest):
    """Dismisses an auto-drafted pre-order with mandatory rationale."""
    if not req.dismiss_reason:
        raise HTTPException(status_code=400, detail="Mandatory justification reason required to dismiss standing pre-order")

    conn = get_db_connection()

    _PREORDER_STATUS_STORE[order_id] = {
        "status": "DISMISSED",
        "dismissed_by": req.clinician_name,
        "dismiss_reason": req.dismiss_reason,
        "action_timestamp": "Just Now"
    }

    patient_id = order_id.split("-")[1] if "-" in order_id else "UNKNOWN"
    log_audit_event(
        event_type="PREORDER_DISMISSED",
        patient_id=patient_id,
        ai_recommendation=f"Auto-Drafted Standing Pre-Order {order_id}",
        clinician_decision="Dismissed",
        clinician_role=req.clinician_name,
        override_reason=req.dismiss_reason,
        outcome="Order cancelled by clinician.",
        conn=conn
    )
    conn.close()

    return {
        "status": "success",
        "order_id": order_id,
        "new_status": "DISMISSED",
        "message": f"Pre-order {order_id} dismissed."
    }
