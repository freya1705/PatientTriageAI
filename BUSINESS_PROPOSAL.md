# PatientTriage.ai: Business Proposal & Enterprise Strategy
### Closing the Emergency Waiting-Room Surveillance Gap

**Accenture Innovation Challenge 2026**

---

### Our idea in one sentence
> **PatientTriage.ai helps Emergency Department staff notice which waiting patients may be getting worse and need attention first.**

---

## 1. The Business Problem

Emergency Departments are extremely busy.

Triage helps doctors and nurses understand a patient's condition when they arrive.

But triage is only a snapshot.

A patient may then wait for hours.

During that waiting period:
* Their condition can change.
* Their vital signs can become abnormal.
* Their monitoring data can become old.
* A monitor can disconnect.
* Staff may not immediately notice the change.

This creates a surveillance gap between triage and treatment.

PatientTriage.ai is designed to help hospitals manage this gap.

The proposal models patients waiting around **2.5–4.5 hours** and identifies deterioration, stale observations and missing data as the main operational problem.

---

## 2. Our Solution

PatientTriage.ai works like an extra safety layer for the waiting room.

It continuously looks at available patient information and answers three simple questions:

1. **Is the patient getting worse?**  
   It checks changes in vital signs over time.

2. **Is the information still reliable?**  
   It checks how old the latest observations are.

3. **Do we know enough about the patient?**  
   If important information is missing, the system asks staff to physically verify the patient.

Then it creates a simple list: **Who needs attention first?**

---

## 3. Value for Hospital Staff

### For Nurses
Nurses may need to keep track of many waiting patients at the same time.

PatientTriage.ai gives them a focused **“Next 5 Minutes” queue**.

Instead of manually deciding which patient to check first, the system highlights the patients needing attention.  
The business proposal specifically positions this as a way to reduce the burden of tracking 40+ waiting patients.

### For Emergency Doctors
Doctors can quickly see:
* Which patients have deteriorated
* Which patients need reassessment
* Which patients have serious warning signs
* Which patients are currently not being attended to

This helps doctors focus their attention where it is needed most.

### For Hospital Leadership
Hospital leadership benefits from:
* Better waiting-room visibility
* Fewer missed deterioration events
* Better documentation
* Improved patient flow
* Potential reduction in staff workload

### For Finance Teams
If fewer patients leave without being seen and fewer serious deteriorations happen in the waiting area, the hospital may reduce financial losses.

The proposal models value from reduced LWBS, avoided ICU escalations, lower liability exposure, staff retention/overtime and improved throughput.

---

## 4. Business Impact

For a modeled 500-bed hospital facility, the proposal uses:
* 65,000 annual ED visits
* $1,200 average baseline ED revenue per visit

The model estimates:

| Metric | Modeled Value |
| :--- | :--- |
| **Gross Annual Value** | **$3.82M per year** |
| **Net Annual Value** | **$3.58M per year** |
| **Estimated ROI** | **14.9×** |
| **LWBS Revenue Recovery** | **+$1.12M/year** |

> *Note: These figures are projections from the business model, not actual hospital results.*

---

## 5. Where Does the Value Come From?

| Area | Expected Impact | Modeled Annual Value |
| :--- | :--- | :--- |
| **Fewer patients leaving without being seen** | 30% reduction | $1.12M |
| **Fewer waiting-room ICU escalations** | 93 avoided stays | $1.40M |
| **Lower malpractice risk** | 40% reduction | $480K |
| **Staff retention & overtime** | Lower turnover + overtime | $378K |
| **Better throughput** | 30-minute improvement | $445K |
| **Total Gross Value** | | **$3.82M** |

After the modeled $240K annual software + hardware cost, the proposal estimates approximately **$3.58M net annual value**.

---

## 6. How Hospitals Could Use It

PatientTriage.ai is designed to work alongside existing hospital systems, rather than requiring hospitals to replace them.

The proposal describes integration through **HL7 FHIR**. This can allow the system to work with existing Electronic Health Record systems using standard healthcare data such as:
* Patient encounters
* Vital observations

The proposed architecture also uses local processing to reduce dependence on cloud latency.

---

## 7. Simple User Flow

* **Step 1 — Patient arrives:** The patient completes normal hospital triage.
* **Step 2 — Patient waits:** The patient enters the waiting area.
* **Step 3 — Patient data is monitored:** PatientTriage.ai receives available vital information.
* **Step 4 — System checks for change:** It looks for deterioration, old data, missing data, and serious warning signs.
* **Step 5 — Patient gets a status:** `CONTINUE` / `REASSESS` / `ESCALATE` / `UNCERTAIN`.
* **Step 6 — Nurse sees the priority queue:** The most important patients appear first.
* **Step 7 — Clinician makes the decision:** The nurse or doctor checks the patient and decides what to do.

> **The system supports the clinician. It does not replace the clinician.**

---

## 8. Why Hospitals Need This

Existing triage systems are useful, but they mainly answer:  
*“How sick is this patient right now?”*

PatientTriage.ai adds another question:  
*“Has this patient changed since we last checked?”*

That difference is the core idea.

---

## 9. Safety and Responsibility

PatientTriage.ai is designed with a human-in-the-loop approach.

The system does not independently diagnose patients or make final treatment decisions. Medical professionals retain:
* Decision-making authority
* Override control
* Responsibility for clinical action

The system also uses fixed physiological safety thresholds so serious warning signs cannot simply be hidden by a statistical score.

---

## 10. Failure Handling

Technology can fail. PatientTriage.ai therefore has a fail-safe approach.

If network connectivity fails, telemetry stops, or patient data becomes unavailable:
* The system prompts staff to perform manual checks.
* Local safety rules remain active.

The goal is simple: **If technology becomes unavailable, patient monitoring should continue.**

---

## 11. Target Market

The proposal identifies a target market of **5,500+ Emergency Departments across the US and Europe**.

The initial customer would be hospitals with:
* High Emergency Department volume
* Long waiting times
* Large numbers of waiting patients
* Existing EHR infrastructure
* A need to improve patient monitoring and flow

---

## 12. Implementation Plan

* **Stage 1 — Prototype (Completed):** Build and test the system.
* **Stage 2 — Shadow Deployment (Q4 2026):** Run PatientTriage.ai alongside the existing hospital process without making clinical decisions to check agreement.
* **Stage 3 — Pilot (Q1–Q2 2027):** Deploy in a limited Emergency Department setting. Measure time to escalation, waiting time, LWBS, staff workload, and alert usefulness.
* **Stage 4 — Scale (Q3 2027+):** After successful validation, expand to more hospitals, ambulance data, and broader patient-flow coordination.

The roadmap targets shadow deployment in Q4 2026, a live pilot in Q1–Q2 2027, and wider expansion from Q3 2027 onward.

---

## 13. Success Metrics

* **Patient Safety:** Faster detection of deterioration, fewer missed warning signs.
* **Hospital Operations:** Lower waiting time, faster escalation, better patient prioritization.
* **Patient Experience:** Fewer patients leaving without being seen.
* **Staff Experience:** Less manual tracking, less unnecessary alerting, clearer priorities.
* **Business:** Lower avoidable costs, better revenue recovery, stronger hospital efficiency.

---

## 14. Final Value Proposition

PatientTriage.ai is not another triage system. It is a waiting-room monitoring and prioritization layer that works after triage and before treatment.

It helps answer the question that traditional triage cannot answer on its own:  
> **“Who has changed, and who needs attention now?”**

Our approach is simple:  
$$\text{Monitor} \longrightarrow \text{Detect Change} \longrightarrow \text{Prioritize} \longrightarrow \text{Alert} \longrightarrow \text{Clinician Decides}$$

---

## 15. Closing

Because a patient being stable at 2:00 PM does not mean they will still be stable at 4:00 PM.

> **Triage is a snapshot. Risk isn't.**
