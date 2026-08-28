# RE-SEARCH & SYSTEM REFINEMENT INSTRUCTIONS
**Target System:** PatientTriage.ai (Active Autonomous ED Safety Control Tower)  
**Target Recipient:** Antigravity AI Development Agent  
**Authors/Team:** Team Phoenix (Freya Jadhav, Team Leader — IIT Madras)  
**Event Context:** Accenture Innovation Challenge 2026  
**Document Version:** 1.0  

---

## 1. Executive Summary & Core Project Identity

### 1.1 Project Vision
**PatientTriage.ai** is designed as an **Active Autonomous Safety Control Tower** for Emergency Department (ED) waiting rooms. Developed to eliminate the life-threatening gap where patient triage is treated as a single, static snapshot upon arrival.

* **Core Philosophy:** *"Unknown ≠ Safe"* — Missing vitals, unmonitored elapsed waiting time, and aging clinical observations actively add an **Uncertainty Penalty** to a patient's risk score, rather than being treated as low risk.
* **Core Problem Statement:** Emergency department crowding increases 10-day patient mortality by ~30%. In systems like India's healthcare system (ranking 144th in emergency access), over 79% of healthcare workers cite triage bottlenecks as their primary operational barrier, with only ~12% of registrations capturing structured diagnostic data at intake. Arrival classification quickly degrades as unmonitored patients silently deteriorate in waiting rooms.

---

## 2. Current Technical Architecture & Prototype Base

### 2.1 System Stack & Deliverables
* **Backend:** FastAPI (`backend/main.py`) running on `http://localhost:8000` with 39 automated Pytest test cases.
* **Frontend:** React 19 web application running on `http://localhost:5173`.
* **Automation & Scripts:** 1-click startup scripts (`start.bat`, `start.ps1`).

### 2.2 System Pipeline & Component Layers
```
[ Ambient / Ingestion Layer ]
  ├── Optical RGB/NIR Cameras (Waiting Bay) ──> Real-time rPPG (Pulse, Resp Rate, SpO2)
  ├── Smart Kiosk / Mobile Check-in (Symptoms) ──> Multimodal Ingestion Engine
  └── HL7 FHIR Bridge ──> Baseline EHR / Historical Comorbidities & 108 Pre-Hospital Handoff
         │
         ▼
[ Real-Time Edge Processing Engine (Sub-15ms) ]
  ├── Tier 1: Deterministic Guardrails (Downgrade Block, Hard Red Flags)
  ├── Tier 2: Causal & Counterfactual Neural Engine (Trajectory & Septic Crash Forecasting)
  └── Tier 3: Attention Gap Optimizer (Decay Staleness + Coverage Allocation)
         │
         ▼
[ Multi-Surface Dispatch & Interface Layer ]
  ├── Surface A: Clinical Command Cockpit (Charge Nurse & Attending MD)
  ├── Surface B: Autonomous Pre-Order Dispatcher (Auxiliary Tech / Phlebotomy)
  └── Surface C: Patient-Facing "Smart Transparency" Companion (Mobile QR/SMS)
```

### 2.3 Mathematical Formulation: The Attention Gap Priority Score
$$\text{Priority Score} = w_r(\text{Risk Urgency}) + w_d(\Delta\text{Vital Velocity}) + w_s(\tau_{\text{staleness}}) - w_c(\text{Physician Attended}) + w_u(\text{Uncertainty})$$

* **Default Parameter Calibration:**
  * $w_r$ (Base Clinical Risk / Urgency): **$1.0$**
  * $w_d$ (Vital Velocity Spike / Degradation): **$+25 \text{ to } +40 \text{ pts}$**
  * $w_s$ (Evidence Staleness Penalty): **$+20 \text{ to } +35 \text{ pts}$**
  * $w_u$ (Uncertainty Penalty / Missing Data): **$+15 \text{ to } +25 \text{ pts}$**
  * $w_c$ (Clinical Coverage Offset): **$-35 \text{ pts}$** (discounts attended patients so unattended cases surface to top)

### 2.4 Present Interface Modes
1. **Mode 1: Control Tower:** Displays 3 Hero Metrics (Patients Waiting, Attention Needed, Shortest Safety Window), Status Ribbons (Low Risk to Escalate/Uncertain), Top 3 Priority Cards, and a side-by-side *"Why #1?"* score waterfall decomposition modal.
2. **Mode 2: Nurse Action View ("Your Next 5 Minutes"):** Translates risk scores into time-budgeted micro-tasks (e.g., 90s Bedside Reassessment, 60s Lactate Screen, 45s ECG confirmation).
3. **Mode 3: Floor & Pressure Map:** Spatial ED layout (Waiting Lounge chairs 1–20, Triage Kiosks, Resus Bays) with pulsating status halos (🟢, 🟡, 🟠, 🔴) flagging unattended deteriorating patients.
4. **Mode 4: Autonomous Standing Pre-Order Hub:** Auto-drafts actionable diagnostic orders (Troponin, ECG, Lactate) before doctor assignment with 1-click approve/route or mandatory justification dismissal.
5. **Mode 5: Patient-Facing "Smart Transparency" Companion:** Zero-install mobile QR/SMS interface showing progress phases and delay context to prevent Leave-Without-Being-Seen (LWBS) walkouts.
6. **Built-in ED Replay Simulator:** Traces a 90-minute shift across 7 steps (P-017 morning baseline $\rightarrow$ unmonitored wait $\rightarrow$ staleness expiry $\rightarrow$ acute SpO2/HR deterioration $\rightarrow$ rank #1 surge $\rightarrow$ bedside O2 titration $\rightarrow$ closed-loop stabilization in 3m 42s).

---

## 3. Medical Industry Research & Real-World Gap Analysis

Recent empirical research into emergency department workflows (analyzing public hospital benchmarks such as AIIMS Delhi, AIIMS Rishikesh, and the Indian 108 Emergency Medical Response System) revealed critical operational friction points:

| Industry Reality & Gap | Existing Workflow Failure | PatientTriage.ai Solution & Synergy |
| :--- | :--- | :--- |
| **1. Unmonitored Waiting & Attendant Absence** | Triage sends patients to crowded waiting areas. Attendants frequently leave the patient unattended to queue for billing, registration, or pharmacy. Patients in cardiac/respiratory arrest go unnoticed. | **"Attendant-Independent" Ambient Surveillance:** Optical rPPG cameras continuously measure vital signs without wearable sensors. The *Attention Gap Optimizer* flags unmonitored deterioration even when family members are away. |
| **2. Emergency Workplace Violence & Communication Opacity** | Patients perceive ED queues as "first-come, first-serve." Opacity regarding triage color-coding (Red/Yellow/Green) causes anger when critical patients skip ahead, driving workplace violence against doctors. | **"Smart Transparency" Mobile Companion:** Provides live, de-escalating context to waiting patients via mobile web/QR code, explaining why higher-acuity cases are prioritized and providing clear diagnostic progress phases. |
| **3. Sequential Administrative Bottlenecks** | Workflow is strictly linear: Triage $\rightarrow$ Wait $\rightarrow$ Doctor Consult $\rightarrow$ Doctor writes test order $\rightarrow$ Attendant pays at billing $\rightarrow$ Labs/CT. Emergency doctors are overwhelmed by manual admin entry. | **Autonomous Pre-Order Hub:** Auto-drafts standing diagnostic protocols (ECG, Troponin, Lactate) immediately upon triage ingestion, allowing 1-click nurse/phlebotomist execution before full physician assignment. |
| **4. Tertiary Overcrowding & Referral Friction** | Overburdened tertiary emergency centers struggle to identify which stable patients can be safely redirected to secondary care facilities via forward/backward referral systems. | **Referral Eligibility Forecasting:** Uses counterfactual modeling to predict patient stability over 20–40 minute horizons, identifying low-risk candidates for safe secondary referral. |
| **5. Pre-Hospital Transit Information Loss** | 108 Ambulance EMTs collect vital pre-hospital data during transit, but this data is lost or manually re-entered at hospital intake desk. | **HL7 FHIR Pre-Arrival Handoff Bridge:** Ingests 108 EMT telemetry *en route* to pre-calculate baseline risk scores before the patient physically arrives at the ED doors. |

---

## 4. Antigravity Agent Directives & Implementation Backlog

The **Antigravity AI Agent** must execute the following structured tasks to refine, localize, and upgrade the PatientTriage.ai codebase:

### Task 1: Pre-Arrival 108 EMS Integration (FHIR Bridge Upgrade)
* **Objective:** Ingest pre-hospital ambulance telemetry before ED entry.
* **Instructions for Antigravity:**
  1. Extend `backend/main.py` (or create `backend/fhir_bridge.py`) to parse incoming HL7 FHIR `Observation` and `Encounter` payloads from 108 EMS ambulances.
  2. Implement pre-arrival risk score calculation so the Control Tower displays an "IN-TRANSIT / ARRIVING SOON" queue ribbon.
  3. Pre-assign resuscitation or triage bays if pre-arrival Vital Velocity ($\Delta \text{SpO}_2$, $\Delta \text{HR}$) exceeds red-flag thresholds.

### Task 2: "Attendant-Independent" Waiting Room Surveillance & Alerting
* **Objective:** Safeguard unattended patients whose family members leave for pharmacy/billing.
* **Instructions for Antigravity:**
  1. Update `Mode 3: Floor & Pressure Map` in the React frontend to visually distinguish between "Attended by Family/Staff" vs. "Unattended Sitting Alone".
  2. Implement an automated staleness escalation rule: If an unattended patient's Safety Clock reaches `EXPIRED` status, trigger an urgent micro-task in `Mode 2: Nurse Action View` (e.g., *"30s Spot Check: Patient unattended at Chair 14"*).

### Task 3: Workplace Violence Prevention & Patient Transparency UI
* **Objective:** De-escalate waiting room anxiety through clear, empathetic queue explanations.
* **Instructions for Antigravity:**
  1. Refine `Mode 5: Patient Companion` UI (`frontend/src/components/PatientCompanion.jsx` or equivalent).
  2. Add an interactive **"Why is the queue moving?"** drawer that explains acuity-based triage without disclosing confidential PHI of other patients.
  3. Include estimated time-to-next-reassessment and live status updates (e.g., *"Pre-Lab Troponin Dispatched — Results Pending"*).

### Task 4: Autonomous Pre-Order Hub Workflow Optimization
* **Objective:** Eliminate sequential bottlenecks by enabling early pre-lab approvals.
* **Instructions for Antigravity:**
  1. Expand `Mode 4: Autonomous Standing Pre-Order Hub` backend logic to auto-generate diagnostic bundles based on intake chief complaints (e.g., Chest Pain $\rightarrow$ ECG + Troponin; Fever/Confusion $\rightarrow$ Lactate + Blood Cultures).
  2. Ensure compliance with Non-Device CDS guidelines by maintaining a mandatory 1-click clinical approval step or a single-field justification dialog for orders dismissed by clinicians.

### Task 5: Secondary Referral Eligibility Engine (Counterfactual Expansion)
* **Objective:** Support tertiary hospital load-balancing (forward/backward referral).
* **Instructions for Antigravity:**
  1. Modify the Counterfactual Safety forecasting module in `backend/` to compute a continuous **Referral Eligibility Score (RES)** (0–100%).
  2. Display a "Referral Candidate" badge in the Control Tower for patients with high stability predictions ($>90\%$), low vital velocity, and zero hard red flags over a 45-minute observation window.

### Task 6: Test Suite Expansion & Code Quality Verification
* **Objective:** Maintain sub-15ms edge processing latency and 100% test coverage for safety guardrails.
* **Instructions for Antigravity:**
  1. Expand the automated Pytest suite in `backend/tests/` (or `pytest -v`) from 39 to $\ge 50$ test cases covering new FHIR endpoints, RES calculations, and staleness edge cases.
  2. Verify that 1-click execution scripts (`start.bat`, `start.ps1`) launch smoothly without dependency errors.

---

## 5. Verification & Acceptance Criteria for Antigravity

Before marking implementation complete, the Antigravity Agent must verify:
- [ ] Backend passes all `pytest` test suites (`python -m pytest -v`).
- [ ] FastAPI backend starts on port 8000 without warnings or unhandled exceptions.
- [ ] React 19 frontend compiles with zero build errors on port 5173.
- [ ] The 5 Core UI Modes render cleanly with updated Indian healthcare workflow integrations.
- [ ] The 90-minute ED Replay Simulation operates seamlessly, correctly reflecting pre-arrival and attendant-independent safety alerts.
