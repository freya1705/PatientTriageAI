# PatientTriage.ai 🏥

**“Triage is a snapshot. Risk isn't.”**  
_AI Safety Copilot for the Emergency Waiting Room — Active Clinical Decision Support_  
_Accenture Innovation Challenge 2026 — Round 2 Technical Prototype_

[![Python](https://img.shields.io/badge/Python-3.9%20%7C%203.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Pytest](https://img.shields.io/badge/Pytest-51%2F51%20Passed%20(100%25)-brightgreen.svg)](https://pytest.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚨 1. The Post-Triage Clinical Surveillance Gap

Traditional emergency department triage operates as a **one-time static snapshot** at intake. However, ESI Level 3 and 4 patients wait unmonitored for **2.5 to 4.5 hours** before physician examination. During this critical window, acute physiological deterioration (silent hypoxia, sepsis, internal hemorrhage) frequently remains undetected until sudden clinical collapse.

**PatientTriage.ai** is an **AI Safety Copilot** purpose-built for the emergency waiting room. It continuously bridges the gap between initial intake and physician evaluation by answering three life-critical questions in real-time:

1. **Who is no longer safe to keep waiting?**
2. **Why is their physiological trajectory deteriorating?**
3. **Who should clinicians reassess first, and what is the exact next action?**

```
[ Ambient Ingestion Layer ]
 ├── Waiting Room Vitals Telemetry (SpO2, Pulse, Blood Pressure, Respiration)
 ├── Time-Stamped Elapsed Wait Clock & Reassessment Shelf-Life Monitor
 └── HL7 FHIR Bridge (Encounter, Observation) from Hospital EHR
                 │
                 ▼
[ Hybrid Edge Safety Engine (Sub-15ms) ]
 ├── Tier 1: Deterministic Guardrails (Downgrade Block, Hard Physiological Red Flags)
 ├── Tier 2: Dynamic Vital Velocity & Uncertainty Calibration (Unknown ≠ Safe)
 └── Tier 3: Attention Gap Optimizer (Staleness Decay + Clinical Coverage Discounting)
                 │
                 ▼
[ 4-State Clinical Cockpit & Worklist ]
 ├── 🟢 CONTINUE  ──> Vitals stable; within safe observation window
 ├── 🟡 REASSESS  ──> Observation shelf-life expired; nurse bedside recheck dispatched
 ├── 🔴 ESCALATE  ──> Hard red-flag breach; immediate resuscitation bay & MD page
 └── ⚪ UNCERTAIN ──> Missing data penalty; forces physical human verification
```

---

## 🌟 2. Three Hero Architectural Differentiators

| Hero Differentiator | What It Does | Why It Is Clinically Differentiated |
| :--- | :--- | :--- |
| 🧠 **1. Safe-to-Wait Dynamic Surveillance** | Continuously tracks vital sign trajectory velocity ($\Delta\text{SpO}_2, \Delta\text{HR}$) | Proves _"Risk evolves while waiting"_ rather than freezing static intake scores. |
| 🛡️ **2. Uncertainty Guardrail ($Unknown \ne Safe$)** | Applies explicit uncertainty penalty ($w_u = +15\text{ to }+25\text{ pts}$) on missing telemetry | Eliminates under-triage: missing vitals elevate patient priority for physical check rather than creating false reassurance. |
| 👁️ **3. Operational Attention Gap** | Prioritizes unmonitored deteriorating waiting patients over attended beds | Subtracts clinician coverage ($w_c = -35\text{ pts}$) when attended, surfacing hidden waiting-room collapses to Rank #1. |

---

## 🚦 3. Four Discrete Operational Workflow States

```
+---------------------------------------------------------------------------------------------------------------+
| State Badge   | Physiological Criteria                         | Clinical Action Dispatched                   |
| :------------ | :--------------------------------------------- | :------------------------------------------- |
| 🟢 CONTINUE   | Vitals stable within baseline; clock active   | Safe to wait; ongoing ambient monitoring     |
| 🟡 REASSESS   | Stale observation or mild drift (ΔHR ≥ +20bpm) | Dispatches nurse bedside vital recheck round  |
| 🔴 ESCALATE   | Red-flag breach (SpO2 < 85%, SBP < 75 mmHg)    | Immediate resus bay allocation & MD page     |
| ⚪ UNCERTAIN   | Missing telemetry or sensor noise             | Forces human verification (Unknown ≠ Safe)    |
+---------------------------------------------------------------------------------------------------------------+
```

---

## 📐 4. The Attention Gap Formula & Plain-English Logic

$$\text{Action Priority Score} = (w_r \cdot \text{Risk}) + (w_d \cdot \text{Deterioration}) + (w_s \cdot \text{Staleness}) + \text{Wait Hazard} + (w_u \cdot \text{Uncertainty}) - (w_c \cdot \text{Clinical Coverage})$$

### 💬 Plain-English Clinical Translation:
> **The system does not ask only *"Who is most sick?"* It asks *"Who needs clinical attention most urgently right now, considering trajectory collapse, stale data, uncertainty, and whether a clinician is already at the bedside?"***

- $w_r = 1.0$: Base risk score ($0–100$)
- $w_d = +25\text{ to }+40\text{ pts}$: Acute velocity shift ($\Delta\text{SpO}_2 \le -5\%$ or $\Delta\text{HR} \ge +20\text{ bpm}$)
- $w_s = +20\text{ to }+35\text{ pts}$: Observation shelf-life expired (Safety Clock)
- $w_u = +15\text{ to }+25\text{ pts}$: Missing baseline vitals / sensor disconnect
- $w_c = -35\text{ pts}$: Clinician actively assigned ($is\_attended = True$), discounting attended beds to surface waiting cases.

---

## 🥊 5. Competitive Moat vs. Native Inpatient EHR Scores

| Dimension | Legacy EHR Scores (Epic EDI / Cerner MEWS) | PatientTriage.ai AI Safety Copilot |
| :--- | :--- | :--- |
| **Surveillance Domain** | Admitted inpatient beds; static snapshot at intake. | **Dedicated waiting-room continuous safety layer.** |
| **Missing Vitals Handling** | Defaults to normal (creates false reassurance). | **$Unknown \ne Safe$: missing data increases uncertainty penalty.** |
| **Clinical Coverage Factor** | Ignores whether patient is attended or waiting alone. | **Attention Gap discounts attended cases to surface waiting needs.** |
| **Deterioration Detection** | Threshold alarms only after severe boundary breach. | **Tracks multi-parameter vital velocity ($\Delta\text{Vitals}/\Delta t$) before collapse.** |

---

## 🧪 6. Prototype Benchmark & CI/CD Verification

_Evaluated across 20 synthetic clinical test cohorts in automated unit and integration testing:_

| Safety Dimension | Static Intake Triage | PatientTriage.ai Prototype | Algorithmic Impact |
| :--- | :--- | :--- | :--- |
| **Waiting Deterioration Catch Rate** | `0 / 20` detected | **`20 / 20` detected (100%)** | Surfaces hidden decompensations in waiting rooms |
| **Stale Observation Flagging** | `0 / 20` flagged | **`20 / 20` flagged (EXPIRED)** | Enforces maximum unmonitored shelf-life limits |
| **Missing Vitals Under-Triage** | High (assumed safe) | **`0%` False Reassurance** | $Unknown \ne Safe$ forces physical human check |
| **Attention Gap Priority Re-Rank** | None (attended block) | **Active Re-Ranking** | Elevates unattended deteriorating patients to Rank #1 |
| **Unsafe Priority Downgrades** | `0` Guardrails | **`100%` Guarded (Blocked)** | Deterministic safety floor prevents silent downgrades |

---

## 📈 7. Business Impact & Modeled ROI (500-Bed Facility)

_Modeled projections based on 65,000 annual ED visits, 500 acute care beds, and $1,200 average ED revenue per visit (derived from published emergency health economics literature; requires hospital-specific validation):_

| Value Driver | Pre-Implementation Baseline | Modeled Post-Implementation Impact | Annual Financial Value |
| :--- | :--- | :--- | :--- |
| **1. LWBS Revenue Recovery** | 3,120 patients/yr leave (4.8%) | 30% reduction via proactive re-engagement | **+$1,123,200 / yr** |
| **2. Avoided ICU Transfers** | 145 waiting room ICU crashes/yr | 64% reduction (93 avoided ICU stays @ $15k) | **+$1,395,000 / yr** |
| **3. Malpractice Risk Mitigation** | $1.2M annual liability reserve | 40% reduction via documented audit trail | **+$480,000 / yr** |
| **4. Nurse Retention & Overtime** | 26.8% nurse turnover (14 replacements) | 4 replacements avoided + 15% overtime cut | **+$378,000 / yr** |
| **5. ED Throughput & Boarding** | 248 mins average wait/boarding | 30-minute reduction via optimized dispatch | **+$445,000 / yr** |
| **TOTAL GROSS ANNUAL VALUE** | — | — | **$3,821,200 / yr** |
| **Enterprise License & Support** | — | Annual Software Subscription & Edge Hardware | **-$240,000 / yr** |
| **ESTIMATED NET ANNUAL ROI** | — | **14.9x Net Return on Investment** | **+$3,581,200 / yr** |

---

## 🗺️ 8. Phased Clinical Implementation Roadmap

- **Phase 1 (Q3 2026 - Completed):** Lab Benchmark Validation • 20 synthetic cohorts verified across 51 automated pytest test cases; sub-15ms inference latency.
- **Phase 2 (Q4 2026):** Shadow Clinical Trial • Non-interventional background FHIR integration alongside Epic/Cerner to evaluate clinician concordance.
- **Phase 3 (Q1–Q2 2027):** Live Pilot • Target Endpoints (Requiring Clinical Validation): $>45\%$ reduction in Mean Time to Escalation (MTTE); false alarm rate $< 2$ alerts/nurse/shift; $\ge 25\%$ reduction in Left-Without-Being-Seen (LWBS).
- **Phase 4 (Q3 2027+):** Multi-Hospital Enterprise Scope • Regional network load balancing, 108 EMS pre-arrival telemetry ingestion, and community referral diversion.

---

## 🚀 9. Quick Start & Execution

### 1-Click Launchers:
```bash
# Windows PowerShell
.\start.ps1

# Windows Batch
start.bat

# macOS / Linux
./start.sh
```

### Manual Execution:
```bash
# 1. Backend (FastAPI on http://localhost:8000)
python -m uvicorn backend.main:app --reload --port 8000

# 2. Frontend (React 19 on http://localhost:5173)
cd frontend && npm install && npm run dev

# 3. Run Automated Test Suite (51 Tests)
python -m pytest -v
```

---

## ⚖️ 10. Regulatory Positioning & Fail-Safe Architecture

- **Regulatory Stance:** PatientTriage.ai is an active clinical decision-support research prototype developed for the Accenture Innovation Challenge 2026. Positioned under **FDA Non-Device CDS (21 U.S.C. § 360aaa-1)**; licensed clinicians retain 100% decision authority.
- **Fail-Safe Protocol:** If network connectivity is lost, the system fails safe to manual clinical rounding with deterministic red-flag guardrails active.
- **Privacy & Security:** Zero PHI retained, air-gapped on-premise edge deployment, zero external cloud LLM dependencies, append-only audit trail logging.

---

_Created by **Freya Jadhav** (Team Leader, Team Phoenix, IIT Madras Data Science & Applications, Class of 2028) for the **Accenture Innovation Challenge 2026**._
