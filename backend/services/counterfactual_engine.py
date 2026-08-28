"""
Counterfactual Safety Engine for PatientTriage.ai
Calculates 'What if we do nothing?' vs 'What if reassessed/intervened now?'
"""

from typing import Dict, Any, List

def compute_counterfactual_trajectory(patient_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes a 20-minute counterfactual trajectory forecasting:
    - Path A: Inaction (Patient continues waiting unmonitored)
    - Path B: Immediate Reassessment & Clinical Intervention
    """
    current_risk = float(patient_dict.get("risk_score", 45.0))
    vital_status = patient_dict.get("trajectory_status", "STABLE")
    safety_status = patient_dict.get("safety_status", "VALID")
    spo2 = patient_dict.get("latest_vitals", {}).get("spo2", 95)
    hr = patient_dict.get("latest_vitals", {}).get("hr", 85)
    is_attended = patient_dict.get("is_attended", False)

    # Calculate degradation rate per 10 mins if unattended
    if vital_status in ["RAPID_DETERIORATION", "WORSENING"] or (spo2 and spo2 < 92):
        degradation_step = 7.5
        potential_concern = f"High probability of critical decompensation / acute respiratory failure within 30-40 mins (Current SpO₂: {spo2}%)."
        intervention_action = "Administer high-flow O₂ + immediate physician bed assignment."
    elif safety_status == "EXPIRED":
        degradation_step = 4.0
        potential_concern = "Accumulating clinical uncertainty; occult sepsis or silent hemorrhage may evolve unmonitored."
        intervention_action = "Acquire fresh repeat vitals to refresh safety validity window."
    else:
        degradation_step = 1.8
        potential_concern = "Gradual fatigue and prolonged waiting discomfort."
        intervention_action = "Routine waiting room surveillance."

    # Projected Inaction Path
    inaction_plus_10 = min(100.0, round(current_risk + degradation_step, 1))
    inaction_plus_20 = min(100.0, round(current_risk + (degradation_step * 2.1), 1))

    # Projected Intervention Path
    intervene_plus_5 = max(15.0, round(current_risk * 0.72, 1))
    intervene_plus_15 = max(10.0, round(current_risk * 0.55, 1))

    inaction_points = [
        {"time": "Now", "risk": current_risk, "spo2": spo2, "hr": hr},
        {"time": "+10 min", "risk": inaction_plus_10, "spo2": max(82, spo2 - 3) if spo2 else 92, "hr": min(145, hr + 12) if hr else 95},
        {"time": "+20 min", "risk": inaction_plus_20, "spo2": max(78, spo2 - 6) if spo2 else 89, "hr": min(160, hr + 22) if hr else 105}
    ]

    intervention_points = [
        {"time": "Now", "risk": current_risk, "spo2": spo2, "hr": hr},
        {"time": "+5 min", "risk": intervene_plus_5, "spo2": min(98, (spo2 or 92) + 4), "hr": max(72, (hr or 85) - 10)},
        {"time": "+15 min", "risk": intervene_plus_15, "spo2": min(99, (spo2 or 92) + 6), "hr": max(68, (hr or 85) - 16)}
    ]

    return {
        "current_risk": current_risk,
        "inaction_trajectory": inaction_points,
        "intervention_trajectory": intervention_points,
        "potential_concern": potential_concern,
        "recommended_intervention": intervention_action,
        "expected_risk_reduction_pct": round(((current_risk - intervene_plus_15) / max(1.0, current_risk)) * 100, 1),
        "expected_uncertainty_reduction": "Uncertainty drops from high to low (<15%) upon vital verification."
    }
