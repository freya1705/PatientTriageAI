# PatientTriage.ai
### Closing the gap between triage and treatment

“Triage is a snapshot. Risk isn't.”

PatientTriage.ai is an AI-assisted monitoring system for patients who are waiting in the Emergency Department after their initial triage.

The main problem is simple:

A patient may look stable when they arrive, but their condition can change while they wait.

PatientTriage.ai continuously checks available patient data, looks for changes over time, checks whether the data is getting old or is missing, and helps nurses decide which patient needs attention first.

**AI recommends. Safety rules protect. Clinicians decide.**

---

### Prototype Information
* **Challenge:** Accenture Innovation Challenge 2026 — Round 2
* **Type:** Working prototype
* **Frontend:** React 19
* **Backend:** Python 3.13 + FastAPI
* **Healthcare standard:** HL7 FHIR
* **Testing:** 51/51 automated tests passing
* **Test scenarios:** 20 synthetic patient scenarios
* **Repository:** github.com/freya1705/PatientTriageAI

The prototype currently achieves 100% passing automated tests.

---

## 1. The Problem
### What happens after triage?

When a patient enters the Emergency Department, nurses perform an initial triage assessment.

This gives the hospital a snapshot of the patient's condition at that moment.

But patients may then spend hours waiting for a bed or doctor.

For example, an ESI Level 3 or 4 patient may wait around 2.5–4.5 hours.

During this time, the patient's condition can change.

They may develop:
* Low oxygen levels
* Increasing heart rate
* Signs of sepsis
* Internal bleeding
* Other signs of deterioration

The problem is not necessarily that hospitals have no patient data.

The problem is that someone may not notice quickly enough that the patient's condition has changed.

PatientTriage.ai is designed to help close this gap.

---

## 2. How PatientTriage.ai Works

PatientTriage.ai looks at four things:

### 1. Patient Risk
How serious was the patient's condition during the original triage?

### 2. Patient Deterioration
Are the patient's vital signs getting worse?

Instead of only looking at the latest value, the system looks at the change over time.

For example:
* Is SpO₂ falling?
* Is heart rate increasing?

### 3. Data Freshness
How recently were the patient's vital signs checked?

Old information should not be treated the same as fresh information.

### 4. Missing Information
If important data is missing or a monitor disconnects, the system does not assume that the patient is fine.

It marks the patient as uncertain and asks for a physical check.

This follows the principle:

> **Unknown does not mean safe.**

These are the three major safety ideas behind the system: tracking change over time, treating missing information as a risk, and giving priority to patients who are not currently being attended to.

---

## 3. Four Patient Statuses

The system gives every waiting patient one of four simple statuses.

| Status | What it means | What the nurse does |
| :--- | :--- | :--- |
| 🟢 **CONTINUE** | Patient is stable and data is recent | Continue monitoring |
| 🟡 **REASSESS** | Vitals are getting old or showing moderate change | Check the patient again |
| 🔴 **ESCALATE** | Serious warning sign or rapid deterioration | Immediately involve doctor/resuscitation team |
| ⚪ **UNCERTAIN** | Important data is missing or monitoring is disconnected | Physically verify the patient |

### CONTINUE
The patient's vital signs are within safe limits and the available data is recent.  
The patient can remain in the waiting area while being monitored.

### REASSESS
The patient's information needs another look.  
This can happen when:
* Vital signs are too old
* Heart rate has increased significantly
* Other moderate deterioration is detected

The system asks a nurse to perform a bedside reassessment.

### ESCALATE
A serious warning is detected.  
Examples include:
* SpO₂ below 85%
* Systolic blood pressure below 75 mmHg
* Rapid deterioration

The system immediately raises the priority and alerts the clinical team.

### UNCERTAIN
The system cannot confidently determine the patient's condition.  
Examples:
* Monitor disconnected
* Important vital missing
* Telemetry unavailable

Instead of assuming the patient is safe, the system asks for a physical nurse check.

The four operational states and their triggers/actions are defined in the prototype specification.

---

## 4. Patient Priority Score

PatientTriage.ai creates a priority score to help nurses decide who needs attention first.

The score considers:

$$\text{Priority Score} = \text{Risk} + \text{Deterioration} + \text{Old Data} + \text{Missing Data} - \text{Current Clinical Attention}$$

In simple terms:
* Higher original risk → higher priority
* Patient getting worse → higher priority
* Old vital signs → higher priority
* Missing information → higher priority
* Already being actively attended by a clinician → lower waiting-room priority

The prototype's scoring model uses the following ranges:
* **Base Risk:** based on initial ESI priority
* **Deterioration:** +25 to +40
* **Staleness:** +20 to +35
* **Uncertainty:** +15 to +25
* **Clinical Coverage:** −35 when a clinician is actively with the patient

### Why this matters

A normal waiting list may keep patients in the same order.

PatientTriage.ai can change the order when something changes.

For example:

Patient A arrived first but is stable.  
Patient B arrived later but their oxygen level is falling.  
The system can move Patient B higher in the queue because Patient B now needs attention sooner.

---

## 5. Main Dashboard

The prototype is designed around a simple nurse workflow.

The dashboard shows:
* Patient name/ID
* Current status
* Latest vital signs
* Changes in vital signs
* How old the observations are
* Missing data
* Priority
* Recommended action

The nurse should be able to quickly answer:

> **“Who do I need to check right now?”**

Instead of forcing the nurse to manually review a long list of patients, the system creates a focused action queue.

---

## 6. What Makes PatientTriage.ai Different?

### 1. It looks at change, not just the latest number
A patient's current heart rate may still appear acceptable.  
But if it has been increasing quickly, that change matters.  
PatientTriage.ai tracks this movement over time.

### 2. Missing data is treated as a warning
If a monitor stops sending data, the system does not assume the patient is stable.  
It creates an UNCERTAIN state and asks for physical verification.

### 3. It focuses on patients who may be overlooked
If a patient is already being attended to by a clinician, the system reduces their priority.  
This allows the queue to focus more on patients who are waiting without attention.

These are the prototype's core architectural differentiators.

---

## 7. Safety First

PatientTriage.ai is not designed to replace doctors or nurses.  
It is a decision-support tool.  
The final decision always remains with the medical professional.

### Safety rules
Some serious conditions should never be hidden behind an AI score.  
Therefore, the prototype includes fixed safety thresholds.  
For example:
* SpO₂ < 85%
* SBP < 75 mmHg

These conditions can directly trigger an escalation.

### What if the system fails?
If network connectivity or telemetry fails:
* The system does not silently stop working.
* It asks staff to perform manual checks.
* Local safety alerts remain active.

This ensures that system failure does not become patient safety failure.

---

## 8. Prototype Testing

We tested the prototype using:
* 20 synthetic patient scenarios
* 51 automated tests
* **51/51 tests passed**

### Results

| Test Area | Result |
| :--- | :--- |
| **Waiting-room deterioration detection** | 20/20 detected |
| **Old/stale observation detection** | 20/20 detected |
| **Missing vital protection** | No false reassurance |
| **Patient prioritization** | Dynamic |
| **Unsafe priority downgrade** | Protected |

The prototype evaluation reports 100% detection in the tested deterioration and stale-observation scenarios and a deterministic guard against unsafe score reductions.

> **Important note:** These are synthetic prototype test results, not results from a real hospital deployment. The next step is real-world clinical validation.

---

## 9. Technology

### Frontend
**React 19**  
Used to build the nurse-facing dashboard.

### Backend
**Python 3.13 + FastAPI**  
Used for the patient monitoring and prioritization logic.

### Healthcare Integration
**HL7 FHIR**  
Designed to support integration with hospital systems.  
The enterprise proposal describes use of standard FHIR resources such as `Encounter` and `Observation`.

### Processing
The prototype is designed for local/edge processing.  
This allows fast processing without depending on cloud AI latency.

---

## 10. Future Roadmap

### Phase 1 — Prototype (Completed — Q3 2026)
* Prototype developed
* Safety rules implemented
* 51 automated tests passed
* Prototype validation completed

### Phase 2 — Hospital Shadow Testing (Q4 2026)
Run the system alongside existing hospital systems without making clinical decisions.  
The goal is to compare its recommendations with actual clinician decisions.

### Phase 3 — Live Pilot (Q1–Q2 2027)
Pilot the system in a real Emergency Department.  
**Target:**
* 45% reduction in Mean Time to Escalation
* ≥25% reduction in Left Without Being Seen

### Phase 4 — Expansion (Q3 2027+)
Explore:
* Multiple hospitals
* Ambulance telemetry
* Better coordination across facilities
* Community diversion support

---

## 11. Quick Start

```bash
git clone https://github.com/freya1705/PatientTriageAI.git
cd PatientTriageAI
python -m pytest -v
.\start.ps1
```

The prototype repository, automated test command and startup command are documented in the original README.
