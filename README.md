# PatientTriage.ai

> **"Triage is a snapshot. Risk isn't."**  
> AI recommends. Deterministic safety rules protect. Clinicians decide.

| Parameter | Specification |
| :--- | :--- |
| **Track** | Accenture Innovation Challenge 2026 — Round 2 Technical Prototype |
| **Stack** | Python 3.13 / FastAPI / React 19 / HL7 FHIR |
| **Test Verification** | 51/51 Automated Tests Passing (100% CI/CD Pass Rate) |
| **Repository** | github.com/freya1705/PatientTriageAI |

---

## 1. The Post-Triage Clinical Surveillance Gap

Intake triage captures a single snapshot in time, but patient conditions evolve while waiting. ESI Level 3 and 4 patients routinely wait 2.5 to 4.5 hours unmonitored before an examination room opens up. During this window, silent clinical decompensation—such as progressive hypoxia, developing sepsis, or internal hemorrhage—often goes unnoticed until acute collapse occurs.

PatientTriage.ai acts as an ambient decision-support copilot that bridges this post-triage gap by continuously tracking physiological drift, data staleness, and missing-variable uncertainty to rank which patients need immediate reassessment.

---

## 2. Core Architectural Differentiators

1. **Dynamic Safe-to-Wait Tracking:** Calculates physiological velocity over time ($\Delta\text{SpO}_2/\Delta t$, $\Delta\text{HR}/\Delta t$) instead of freezing static intake vitals.
2. **Uncertainty Guardrails (Unknown $\neq$ Safe):** Incomplete vitals or disconnected telemetry trigger an explicit uncertainty penalty ($w_u = +15\text{ to }+25\text{ pts}$), escalating unmonitored patients for manual physical re-evaluation rather than assuming stability.
3. **Attention Gap Optimization:** Prevents over-monitoring already attended patients by applying a clinician coverage discount ($w_c = -35\text{ pts}$), elevating overlooked and deteriorating waiting-room patients to the top of the queue.

---

## 3. Four Operational Workflow States

| State | Physiological Trigger | Clinical Action |
| :--- | :--- | :--- |
| **CONTINUE** | Vitals within baseline safe limits; telemetry fresh. | Patient remains in waiting lounge under ambient tracking. |
| **REASSESS** | Vitals shelf-life expired (stale) or moderate drift ($\Delta\text{HR} \ge +20\text{ bpm}$). | Dispatches triage nurse for a targeted bedside vitals refresh. |
| **ESCALATE** | Hard red-flag breach ($\text{SpO}_2 < 85\%$, $\text{SBP} < 75\text{ mmHg}$) or rapid collapse. | Triggers immediate resuscitation bay assignment and physician paging. |
| **UNCERTAIN** | Telemetry lost, missing core vitals, or sensor disconnect. | Flags missing data under Unknown $\neq$ Safe to force physical nurse verification. |

---

## 4. Prioritization Scoring Engine

$$\text{Action Priority Score} = (w_r \cdot \text{Risk}) + (w_d \cdot \text{Deterioration}) + (w_s \cdot \text{Staleness}) + (w_u \cdot \text{Uncertainty}) - (w_c \cdot \text{Clinical Coverage})$$

* **Base Risk ($w_r = 1.0$):** Foundation score derived from initial ESI intake priority.
* **Deterioration ($w_d = +25\text{ to }+40\text{ pts}$):** Applied when trajectory declines ($\Delta\text{SpO}_2 \le -5\%$, $\Delta\text{HR} \ge +20\text{ bpm}$).
* **Staleness ($w_s = +20\text{ to }+35\text{ pts}$):** Applied automatically when observation shelf-life decays past safe thresholds.
* **Uncertainty ($w_u = +15\text{ to }+25\text{ pts}$):** Applied when vital streams are missing or sensor confidence is low.
* **Clinical Coverage ($w_c = -35\text{ pts}$):** Deducted if a clinician is actively logged at the patient's bedside.

---

## 5. Prototype Benchmark Evaluation

*Evaluated across 20 synthetic patient scenarios and 51 automated CI/CD pytest test cases.*

| Safety & Operational Dimension | Static Intake Triage | PatientTriage.ai | System Impact |
| :--- | :--- | :--- | :--- |
| **Waiting Decompensation Catch Rate** | 0/20 detected | 20/20 detected (100%) | Trajectory velocity flags silent collapse early. |
| **Stale Observation Flagging** | 0/20 flagged | 20/20 flagged (100%) | Eliminates unmonitored blind spots. |
| **Missing Vitals Under-Triage** | High risk | 0% false reassurance | Forces human verification via uncertainty scoring. |
| **Attention Gap Prioritization** | Static order | Dynamic re-ranking | Prioritizes unmonitored patients over attended beds. |
| **Unsafe Downgrade Prevention** | Unchecked | 100% Guarded | Hard deterministic floor blocks unsafe score drops. |

---

## 6. Implementation Roadmap

* **Phase 1 (Completed - Q3 2026):** Prototype validation, 51 automated unit/integration tests passing, sub-15ms edge inference latency.
* **Phase 2 (Q4 2026):** Non-interventional shadow deployment via HL7 FHIR alongside existing EHRs to measure clinician concordance.
* **Phase 3 (Q1–Q2 2027):** Live pilot targeting $>45\%$ reduction in Mean Time to Escalation (MTTE) and $\ge 25\%$ reduction in Left Without Being Seen (LWBS).
* **Phase 4 (Q3 2027+):** Multi-facility network balancing, 108 EMS ambulance telemetry ingestion, and community diversion routing.

---

## 7. Quickstart & Deployment

### Local Setup
```bash
# Clone the repository
git clone https://github.com/freya1705/PatientTriageAI.git
cd PatientTriageAI

# Run automated tests
python -m pytest -v

# Start backend & frontend services
./start.ps1
```
