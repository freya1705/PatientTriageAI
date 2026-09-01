# PatientTriage.ai: Business Proposal & Enterprise Strategy

> **Closing the Emergency Waiting-Room Surveillance Gap**  
> Accenture Innovation Challenge 2026 | Modeled 500-Bed Hospital ED Impact

| Gross Annual Value | Net Annual ROI | LWBS Revenue Recovery | Target ED Market |
| :---: | :---: | :---: | :---: |
| **$3.82M / yr** | **$3.58M / yr (14.9x)** | **+$1.12M / yr (30% drop)** | **5,500+ US/EU EDs** |

---

## 1. Executive Summary

Emergency departments face a critical surveillance blind spot: triage assesses risk at entry, but patients wait 2.5 to 4.5 hours unmonitored in the lounge. With nationwide nurse turnover at 26.8% and high patient volumes, silent decompensations (sepsis, hypoxia, internal hemorrhage) routinely go undetected until acute collapse.

PatientTriage.ai is an ambient decision-support copilot designed specifically for the waiting room. By combining continuous vital trajectory tracking, observation shelf-life decay, uncertainty scoring (Unknown $\neq$ Safe), and clinician attention discounting, the platform delivers a modeled **$3.82M in gross annual value** ($3.58M net ROI) per 500-bed facility.

---

## 2. Key Stakeholder Value

* **Triage Nurses (RNs):** Replaces overwhelming 40+ patient tracking lists with a prioritized "Next 5 Minutes" action queue, reducing alert fatigue and cognitive strain.
* **Emergency Physicians (MDs):** Provides instant visibility into which waiting patients have deteriorated since initial intake, enabling faster, targeted clinical interventions.
* **Chief Medical Officers (CMOs):** Minimizes waiting-room sentinel events and builds an append-only audit trail for clinical governance and malpractice defense.
* **Chief Financial Officers (CFOs):** Captures high ROI through reduced Left-Without-Being-Seen (LWBS) walkouts, fewer uncompensated ICU transfers, and lower nurse overtime.

---

## 3. Financial ROI & Impact Model (500-Bed Facility)

*Projections based on 65,000 annual ED visits, 500 beds, and an average $1,200 baseline ED revenue per visit:*

| Value Driver | Baseline Scenario | Post-Implementation Target | Annual Financial Impact |
| :--- | :--- | :--- | :--- |
| **1. LWBS Revenue Recovery** | 3,120 patients walk out (4.8%) | 30% reduction via proactive re-engagement | **+$1,123,200 / yr** |
| **2. Avoided ICU Escalations** | 145 waiting-room crashes/yr | 64% reduction (93 avoided stays @ $15k) | **+$1,395,000 / yr** |
| **3. Malpractice Risk Mitigation** | $1.2M annual liability allocation | 40% reduction via deterministic audit logs | **+$480,000 / yr** |
| **4. Staff Retention & Overtime** | 26.8% RN turnover (14 replacements) | 4 turnover events avoided + 15% overtime drop | **+$378,000 / yr** |
| **5. Throughput & Boarding** | 248 min average wait/boarding | 30-minute reduction via optimized dispatch | **+$445,000 / yr** |
| **Total Gross Annual Value** | | | **$3,821,200 / yr** |
| **Software License & Edge Hardware** | | Enterprise annual subscription + support | **-$240,000 / yr** |
| **Net Annual ROI** | | **14.9x Return on Investment** | **+$3,581,200 / yr** |

---

## 4. Enterprise Architecture & Integration

* **HL7 FHIR & SMART-on-FHIR Native:** Interfaces directly with existing Epic and Cerner systems via standard resources (`Encounter`, `Observation`) and CDS Hooks (`patient-view`), requiring zero rip-and-replace infrastructure changes.
* **Air-Gapped Edge Processing:** Runs locally on hospital servers with sub-15ms inference latency, zero cloud LLM latency dependencies, and no persistent PHI storage in the queue cache.
* **Alarm Fatigue Protection:** Compresses notifications into the top 3 high-yield actions for nurses, preventing alarm flooding while preserving critical escalation paths.

---

## 5. Regulatory Stance & Risk Governance

* **FDA CDS Compliance:** Positioned as non-device Clinical Decision Support under 21 U.S.C. § 360aaa-1. Licensed medical professionals retain full decision autonomy and override control.
* **Deterministic Guardrails:** Hard physiological thresholds ($\text{SpO}_2 < 85\%$, $\text{SBP} < 75\text{ mmHg}$) immediately bypass statistical layers to enforce patient safety floors.
* **Fail-Safe Operation:** If telemetry or network connectivity fails, the platform prompts manual rounding intervals with local deterministic alerts active.
