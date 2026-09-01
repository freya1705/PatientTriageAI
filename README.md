# PatientTriage.ai
### Closing the gap between triage and treatment

> **“Triage is a snapshot. Risk isn't.”**  
> AI recommends. Safety rules protect. Clinicians decide.

| Parameter | Specification |
| :--- | :--- |
| **Challenge** | Accenture Innovation Challenge 2026 — Round 2 |
| **Type** | Working Prototype |
| **Frontend** | React 19 |
| **Backend** | Python 3.13 + FastAPI |
| **Healthcare Standard** | HL7 FHIR |
| **Testing** | 51/51 automated tests passing (100% CI/CD Pass Rate) |
| **Test Scenarios** | 20 synthetic patient scenarios |
| **Repository** | [github.com/freya1705/PatientTriageAI](https://github.com/freya1705/PatientTriageAI) |

---

## 1. The Problem
### What happens after triage?

When a patient enters the Emergency Department, nurses perform an initial triage assessment. This gives the hospital a snapshot of the patient's condition at that moment.

But patients may then spend hours waiting for a bed or doctor. For example, an ESI Level 3 or 4 patient may wait around **2.5–4.5 hours**.

During this time, the patient's condition can change. They may develop:
* Low oxygen levels
* Increasing heart rate
* Signs of sepsis
* Internal bleeding
* Other signs of deterioration

The problem is not necessarily that hospitals have no patient data. The problem is that someone may not notice quickly enough that the patient's condition has changed.

**PatientTriage.ai is designed to help close this gap.**

---

## 2. How PatientTriage.ai Works

PatientTriage.ai looks at four things:

1. **Patient Risk:** How serious was the patient's condition during the original triage?
2. **Patient Deterioration:** Are the patient's vital signs getting worse? Instead of only looking at the latest value, the system looks at the change over time (e.g., Is SpO₂ falling? Is heart rate increasing?).
3. **Data Freshness:** How recently were the patient's vital signs checked? Old information should not be treated the same as fresh information.
4. **Missing Information:** If important data is missing or a monitor disconnects, the system does not assume that the patient is fine. It marks the patient as uncertain and asks for a physical check.

> **Core Principle: Unknown does not mean safe.**

These are the three major safety ideas behind the system: tracking change over time, treating missing information as a risk, and giving priority to patients who are not currently being attended to.

---

## 3. Four Patient Statuses

The system gives every waiting patient one of four simple statuses:

| Status | What it means | What the nurse does |
| :--- | :--- | :--- |
| 🟢 **CONTINUE** | Patient is stable and data is recent | Continue monitoring |
| 🟡 **REASSESS** | Vitals are getting old or showing moderate change | Check the patient again |
| 🔴 **ESCALATE** | Serious warning sign or rapid deterioration | Immediately involve doctor/resuscitation team |
| ⚪ **UNCERTAIN** | Important data is missing or monitoring is disconnected | Physically verify the patient |

* **CONTINUE:** The patient's vital signs are within safe limits and the available data is recent. The patient can remain in the waiting area while being monitored.
* **REASSESS:** The patient's information needs another look (e.g., vital signs are too old, heart rate increased significantly, or moderate deterioration detected). The system asks a nurse to perform a bedside reassessment.
* **ESCALATE:** A serious warning is detected (e.g., SpO₂ below 85%, Systolic BP below 75 mmHg, rapid collapse). The system immediately raises priority and alerts the clinical team.
* **UNCERTAIN:** The system cannot confidently determine condition (e.g., monitor disconnected, important vital missing). Instead of assuming the patient is safe, the system asks for a physical nurse check.

---

## 4. Patient Priority Score

PatientTriage.ai creates a priority score to help nurses decide who needs attention first:

$$\text{Priority Score} = \text{Risk} + \text{Deterioration} + \text{Old Data} + \text{Missing Data} - \text{Current Clinical Attention}$$

In simple terms:
* Higher original risk → higher priority
* Patient getting worse → higher priority
* Old vital signs → higher priority
* Missing information → higher priority
* Already being actively attended by a clinician → lower waiting-room priority

### Parameter Calibration Ranges:
* **Base Risk:** based on initial ESI priority ($w_r = 1.0$)
* **Deterioration:** $+25\text{ to }+40$
* **Staleness:** $+20\text{ to }+35$
* **Uncertainty:** $+15\text{ to }+25$
* **Clinical Coverage:** $-35$ when a clinician is actively with the patient

### Why this matters
A normal waiting list may keep patients in the same order. PatientTriage.ai can change the order when something changes. For example: Patient A arrived first but is stable. Patient B arrived later but their oxygen level is falling. The system moves Patient B higher in the queue because Patient B needs attention sooner.

---

## 5. Main Dashboard

The prototype is designed around a simple nurse workflow:
* Patient name/ID
* Current status
* Latest vital signs & changes over time
* Observation age (how old the data is)
* Missing data indicators
* Dynamic priority rank
* Recommended action

The nurse can quickly answer: **“Who do I need to check right now?”** Instead of forcing the nurse to manually review a long list, the system creates a focused action queue.

---

## 6. What Makes PatientTriage.ai Different?

1. **It looks at change, not just the latest number:** If heart rate has been increasing quickly, that trajectory matters. PatientTriage.ai tracks movement over time.
2. **Missing data is treated as a warning:** If a monitor stops sending data, the system creates an UNCERTAIN state and asks for physical verification.
3. **It focuses on patients who may be overlooked:** If a patient is already being attended to by a clinician, the system reduces their priority so attention focuses on unattended waiting patients.

---

## 7. Safety First

PatientTriage.ai is not designed to replace doctors or nurses. It is a decision-support tool. The final decision always remains with the medical professional.

* **Fixed Safety Thresholds:** Serious conditions directly trigger an escalation (e.g., $\text{SpO}_2 < 85\%$, $\text{SBP} < 75\text{ mmHg}$) without being hidden behind an AI score.
* **Fail-Safe Operation:** If network connectivity or telemetry fails, the system asks staff to perform manual checks while local safety alerts remain active.

---

## 8. Prototype Testing

We tested the prototype using:
* 20 synthetic patient scenarios
* 51 automated tests
* **51/51 tests passed (100%)**

| Test Area | Result |
| :--- | :--- |
| **Waiting-room deterioration detection** | 20/20 detected |
| **Old/stale observation detection** | 20/20 detected |
| **Missing vital protection** | No false reassurance |
| **Patient prioritization** | Dynamic |
| **Unsafe priority downgrade** | Protected |

> **Important note:** These are synthetic prototype test results, not results from a real hospital deployment. The next step is real-world clinical validation.

---

## 9. Technology

* **Frontend:** React 19 (nurse-facing dashboard).
* **Backend:** Python 3.13 + FastAPI (patient monitoring & prioritization logic).
* **Healthcare Integration:** HL7 FHIR (standard resources such as `Encounter` and `Observation`).
* **Processing:** Local/edge processing for fast performance without cloud AI latency.

---

## 10. Future Roadmap

* **Phase 1 — Prototype (Completed - Q3 2026):** Prototype developed, safety rules implemented, 51 automated tests passed, validation completed.
* **Phase 2 — Hospital Shadow Testing (Q4 2026):** Run alongside existing hospital systems without making clinical decisions to compare recommendations with clinician choices.
* **Phase 3 — Live Pilot (Q1–Q2 2027):** Pilot in real ED targeting $>45\%$ reduction in Mean Time to Escalation and $\ge 25\%$ reduction in Left Without Being Seen.
* **Phase 4 — Expansion (Q3 2027+):** Multiple hospitals, ambulance telemetry, better facility coordination, community diversion support.

---

## 11. Quick Start

```bash
git clone https://github.com/freya1705/PatientTriageAI.git
cd PatientTriageAI
python -m pytest -v
.\start.ps1
```
