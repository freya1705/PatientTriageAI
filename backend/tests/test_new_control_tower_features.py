"""
Tests for Active Autonomous ED Control Tower Features:
- ED Replay / Simulation Timeline Steps
- Closed-Loop Clinical Reassessments & Safety Outcome
- Counterfactual Safety Trajectory Forecasts
- Standing Pre-Orders Approval & Dismissal
- Patient Transparency Companion & Live Safety Feed
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_simulation_timeline_and_step_apply():
    res = client.get("/api/simulation/timeline")
    assert res.status_code == 200
    data = res.json()
    assert data["total_steps"] == 7
    assert len(data["steps"]) == 7

    # Apply step 3 (acute deterioration)
    res_apply = client.post("/api/simulation/apply-step/3")
    assert res_apply.status_code == 200
    applied = res_apply.json()
    assert applied["status"] == "success"
    assert applied["applied_step"]["target_patient_id"] == "P-017"

def test_closed_loop_reassessment():
    # First elevate risk via deterioration simulation
    client.post("/api/patients/P-017/simulate-deterioration")

    req_payload = {
        "patient_id": "P-017",
        "new_spo2": 97,
        "new_hr": 78,
        "nurse_name": "RN Sarah Chen",
        "notes": "Bedside reassessment test"
    }
    res = client.post("/api/actions/reassess", json=req_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "safety_outcome" in data
    assert "time_to_intervention" in data["safety_outcome"]
    assert data["safety_outcome"]["time_to_intervention"] == "3m 42s"

def test_counterfactual_view():
    res = client.get("/api/actions/counterfactual/P-001")
    assert res.status_code == 200
    data = res.json()
    assert "counterfactual_projection" in data
    assert len(data["counterfactual_projection"]["inaction_trajectory"]) >= 3
    assert len(data["counterfactual_projection"]["intervention_trajectory"]) >= 3

def test_why_comparison():
    res = client.get("/api/actions/why-comparison/P-001/P-002")
    assert res.status_code == 200
    data = res.json()
    assert "candidate_1" in data
    assert "candidate_2" in data
    assert "verdict" in data

def test_preorders_lifecycle():
    res = client.get("/api/preorders/")
    assert res.status_code == 200
    data = res.json()
    assert data["total_preorders"] > 0
    orders = data["preorders"]
    test_ord_id = orders[0]["order_id"]

    # Approve order
    res_appr = client.post(f"/api/preorders/{test_ord_id}/approve", json={"action": "APPROVE", "clinician_name": "RN Sarah Chen"})
    assert res_appr.status_code == 200
    assert res_appr.json()["new_status"] == "APPROVED_AND_ROUTED"

    # Dismiss another order
    if len(orders) > 1:
        dismiss_ord_id = orders[1]["order_id"]
        res_dism = client.post(f"/api/preorders/{dismiss_ord_id}/dismiss", json={"action": "DISMISS", "dismiss_reason": "Order duplicated by MD"})
        assert res_dism.status_code == 200
        assert res_dism.json()["new_status"] == "DISMISSED"

def test_patient_portal_and_live_feed():
    res_portal = client.get("/api/portal/patient/P-001")
    assert res_portal.status_code == 200
    portal_data = res_portal.json()
    assert "care_phases" in portal_data
    assert len(portal_data["care_phases"]) == 4

    res_feed = client.get("/api/portal/feed/live-events")
    assert res_feed.status_code == 200
    feed_data = res_feed.json()
    assert len(feed_data["events"]) >= 5
