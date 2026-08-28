"""
Autonomous Standing Pre-Order Hub Engine for PatientTriage.ai
Drafts 1-click clinical standing pre-orders based on chief complaint, vital velocity, and demographic risk.
"""

from typing import Dict, Any, List

def generate_standing_preorders(patient_dict: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Evaluates patient parameters to generate auto-drafted standing orders for nursing & auxiliary staff.
    """
    preorders = []
    cc = (patient_dict.get("chief_complaint") or "").lower()
    vitals = patient_dict.get("latest_vitals", {}) or {}
    spo2 = vitals.get("spo2", 98)
    hr = vitals.get("hr", 75)
    rr = vitals.get("rr", 16)
    sbp = vitals.get("sbp", 120)
    temp = vitals.get("temp", 37.0)
    age = patient_dict.get("age", 40)
    pid = patient_dict.get("id", "P-001")

    # 1. Cardiac / Chest Tightness Protocol
    if any(k in cc for k in ["chest", "cardiac", "angina", "pressure", "palpitation", "tightness"]) or (hr and hr > 115):
        preorders.append({
            "order_id": f"ORD-{pid}-01",
            "patient_id": pid,
            "title": "High-Sensitivity Troponin + 12-Lead ECG",
            "type": "CARDIAC_PROTOCOL",
            "priority": "STAT (Within 10m)",
            "rationale": f"Detected {cc} with heart rate {hr} bpm. Rapid diagnostic rule-out for acute coronary syndrome.",
            "target_team": "Nursing / Auxiliary Tech",
            "status": "AUTO_DRAFTED",
            "suggested_actions": ["Approve & Route to Tech", "Dismiss with Reason"]
        })

    # 2. Sepsis / Lactate Protocol
    if (temp and temp >= 38.3) or (hr and hr > 105 and rr and rr > 20) or "fever" in cc or "sepsis" in cc or "infection" in cc:
        preorders.append({
            "order_id": f"ORD-{pid}-02",
            "patient_id": pid,
            "title": "Point-of-Care Blood Lactate + Blood Cultures",
            "type": "SEPSIS_SCREEN",
            "priority": "STAT (Within 15m)",
            "rationale": f"Persistent tachycardia ({hr} bpm) and systemic inflammatory markers. Early screening for septic hypoperfusion.",
            "target_team": "Phlebotomy / Lab Tech",
            "status": "AUTO_DRAFTED",
            "suggested_actions": ["Approve & Route to Tech", "Dismiss with Reason"]
        })

    # 3. Respiratory Protocol
    if (spo2 and spo2 < 93) or any(k in cc for k in ["sob", "breath", "dyspnea", "asthma", "wheeze", "pneumonia"]):
        preorders.append({
            "order_id": f"ORD-{pid}-03",
            "patient_id": pid,
            "title": "Continuous Pulse Oximetry + Portable CXR",
            "type": "RESPIRATORY_SURVEILLANCE",
            "priority": "URGENT (Within 20m)",
            "rationale": f"SpO₂ reading at {spo2}% with respiratory distress. Objective thoracic imaging required.",
            "target_team": "Radiology Tech / RN",
            "status": "AUTO_DRAFTED",
            "suggested_actions": ["Approve & Route to Tech", "Dismiss with Reason"]
        })

    # 4. Acute Abdomen / Hemorrhage Protocol
    if any(k in cc for k in ["abdomen", "abdominal", "belly", "bleed", "hemorrhage", "melena"]) or (sbp and sbp < 95):
        preorders.append({
            "order_id": f"ORD-{pid}-04",
            "patient_id": pid,
            "title": "Type & Screen + Bedside Hemoglobin (Hgb)",
            "type": "ACUTE_ABDOMEN_HEMO",
            "priority": "URGENT (Within 25m)",
            "rationale": f"Severe abdominal presentation with SBP {sbp} mmHg. Rule out internal occult hemorrhage.",
            "target_team": "Lab / Nursing Staff",
            "status": "AUTO_DRAFTED",
            "suggested_actions": ["Approve & Route to Tech", "Dismiss with Reason"]
        })

    # Default general intake pre-order if no specialized trigger
    if not preorders:
        preorders.append({
            "order_id": f"ORD-{pid}-05",
            "patient_id": pid,
            "title": "Baseline Metabolic Panel + Repeat Vitals",
            "type": "STANDARD_INTAKE",
            "priority": "ROUTINE",
            "rationale": f"Standard initial emergency intake panel for {cc}.",
            "target_team": "Triage RN",
            "status": "AUTO_DRAFTED",
            "suggested_actions": ["Approve & Route to Tech", "Dismiss with Reason"]
        })

    return preorders
