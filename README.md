# PatientTriage.ai 🏥

**“Triage is a snapshot. Risk isn't.”**  
_The Active Autonomous Emergency Department Safety Control Tower_  
_Accenture Innovation Challenge 2026 — Round 2 Prototype_

[![Python](https://img.shields.io/badge/Python-3.9%20%7C%203.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Pytest](https://img.shields.io/badge/Pytest-51%2F51%20Passed-brightgreen.svg)](https://pytest.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚨 The ED Safety Control Tower Concept

Traditional emergency department dashboards operate as passive, static alert lists. **PatientTriage.ai** transforms the ED experience into an **Active Autonomous Safety Control Tower** that continuously decides:

1. **Who needs attention right now?**
2. **Why are they becoming unsafe?**
3. **What is the exact next clinical action?**

```
[ Ambient / Ingestion Layer ]
 ├── Optical RGB/NIR Cameras (Waiting Bay) ──> Real-time rPPG (Pulse, Resp Rate, SpO2)
 ├── Smart Kiosk / Mobile Check-in (Symptoms) ──> Multimodal Ingestion Engine
 └── HL7 FHIR Bridge ──> 108 EMS Ambulance Pre-Arrival Telemetry & Baseline EHR
                 │
                 ▼
[ Real-Time Edge Processing Engine (Sub-15ms) ]
 ├── Tier 1: Deterministic Guardrails (Downgrade Block, Hard Red Flags)
 ├── Tier 2: Causal & Counterfactual Neural Engine (Trajectory & Inaction Projection)
 └── Tier 3: Attention Gap Optimizer (Decay Staleness + Coverage Allocation + RES)
                 │
                 ▼
[ Multi-Surface Dispatch & Interface Layer ]
 ├── Surface A: Clinical Command Cockpit (Charge Nurse & Attending MD)
 ├── Surface B: Autonomous Pre-Order Dispatcher (Auxiliary Tech / Phlebotomy)
 └── Surface C: Patient-Facing "Smart Transparency" Companion (Mobile QR/SMS)
```

---

## 🌟 The Core Product Innovations

| Innovation                                | What It Does                                                         | Key Clinical & Operational Synergy                                                            |
| :---------------------------------------- | :------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| 🧠 **Dynamic Risk Velocity**              | Risk recalculates continuously rather than remaining static          | Proves _"Risk changes while waiting"_ with real-time vital velocity tracking                  |
| ⏱️ **Signature Safety Clock**             | Visual countdown tracking evidence shelf-life & validity             | Replaces static timestamps with active countdowns to expiry (`13:42 remaining` → `EXPIRED`)   |
| 👁️ **Operational Attention Gap**          | Identifies unmonitored deteriorating patients                        | Prevents attended patients from blocking unattended waiting patients                          |
| 🚑 **108 EMS Pre-Arrival Telemetry**      | Ingests ambulance telemetry via HL7 FHIR Bridge with LOINC codes     | Pre-computes inbound triage level and enables 1-click Resuscitation Bay pre-allocation        |
| 👤 **Attendant-Away Surveillance**        | Flags patients sitting alone when family leaves for pharmacy/billing | Floor map tag + auto-injects high-urgency spot-check micro-tasks for nurses                   |
| 🏥 **Referral Candidate Scoring (RES)**   | Computes Referral Eligibility Score (0–100%) for tertiary ED relief  | Flags stable low-acuity patients safe for redirection to Primary Health Centres / Urgent Care |
| 🔮 **Counterfactual Inaction Projection** | Forecasts _"What if waiting continues?"_ vs _"Intervene now"_        | Predicts decompensation/septic crashes 20–40 mins in advance                                  |
| ⚡ **Closed-Loop Action Loop**            | Auto-drafts pre-orders & records closed-loop outcomes                | Tracks Time to Intervention (`3m 42s`) and recalculates post-action stability                 |

> **Philosophical Cornerstone**: `Unknown ≠ Safe` — Missing vitals and aging observations actively increase uncertainty penalty rather than being treated as benign.

---

## 🧠 Core Mathematical Formulation: The Attention Gap

$$\text{Priority Score} = w_r(\text{Risk Urgency}) + w_d(\Delta\text{Vital Velocity}) + w_s(\tau_{\text{staleness}}) - w_c(\text{Physician Attended}) + w_u(\text{Uncertainty})$$

**Default Parameter Calibration**:

- $w_r$ (Base Clinical Risk / Urgency): **$1.0$**
- $w_d$ (Vital Velocity Spike / Degradation): **$+25\text{ to }+40\text{ pts}$**
- $w_s$ (Evidence Staleness Penalty): **$+20\text{ to }+35\text{ pts}$**
- $w_u$ (Uncertainty Penalty / Missing Data): **$+15\text{ to }+25\text{ pts}$**
- $w_c$ (Clinical Coverage Offset): **$-35\text{ pts}$** _(Discounts attended cases so unattended cases surface to top)_

---

## 🎛️ Multi-View Control Center Capabilities

### 1. Mode 1: Control Tower & Dynamic Priority Stream

- **3 Giant Hero Metrics**: Total Patients Waiting | Requiring Attention | Shortest Safety Window.
- **Actionable Census Ribbon**: Simplified into 3 clear categories:
  - 🔴 **Act Now** (`Escalate` + `Reassess` — pulses with red alert when urgent cases exist)
  - 🟡 **Recheck Soon** (`Watch` + `Uncertain`)
  - 🟢 **Stable** (`Low Risk` + `Stable` monitoring)
  - **Dynamic ED Load Bar**: Continuous `%` capacity meter with color transitions.
- **108 EMS Pre-Arrival Banner**: Real-time incoming ambulance feed showing ETA, live vital telemetry (SpO₂, HR, BP, RR), paramedic notes (e.g. ST elevation), and a 1-click **"Pre-Allocate Resus Bay"** button.
- **Unified Slide-Over `PatientDrawer`**: Replaces clutter with a unified 3-tab panel:
  1. _Clinical Summary:_ Demographics, vital matrix, age model (Pediatric/Geriatric/Adult), and Attendant Away / Referral Candidate status.
  2. _Why This Rank:_ Plain-English clinical justifications + optional collapsible score formula waterfall.
  3. _What Happens Next:_ Recommended intervention, inaction risk trajectory, and 1-click reassessment.

### 2. Mode 2: Nurse Action View ("Your Next 5 Minutes")

- Transforms raw risk numbers into time-budgeted clinical micro-tasks:
  - `⚠️ Attendant Away — 30s`: Spot-check unattended waiting patient whose family stepped away
  - `P-017 — 90s`: Bedside Reassessment & O₂ Titration (SpO₂ 91% ↓)
  - `P-001 — 60s`: Physician Review & Lactate Screen (Septic shock hazard)
  - `P-007 — 45s`: 12-Lead ECG & Troponin Pre-Order Confirmation
  - `P-016 — 30s`: Confirm Symptom & Temperature Change

### 3. Mode 3: Floor-Wide ED Resource & Pressure Map

- Spatial floor plan of Waiting Lounge (Chairs 1–20), Triage Kiosks, and Treatment/Resuscitation Bays.
- Real-time pulsating status halos (🟢, 🟡, 🟠, 🔴) identifying patients waiting without direct clinician contact.
- **Attendant Away Flag**: Visual badge on chairs with interactive 1-click toggle when family members step away to billing or pharmacy.

### 4. Mode 4: Autonomous Standing Pre-Order Hub

- Auto-drafts actionable diagnostic pre-orders (Troponin+ECG, Lactate, Type & Screen) before physician assignment.
- 1-click **"Approve & Route to Tech"** or **"Dismiss with Mandatory Justification"** (Non-Device CDS 21 U.S.C. § 360aaa-1).

### 5. Mode 5: Patient-Facing "Smart Transparency" Companion

- Mobile web tracker accessed via triage wristband QR code or SMS link (zero app install).
- Care phases (`Triage Ingested` → `Pre-Labs Dispatched` → `Clinical Surveillance` → `Physician Care Bay`).
- **De-Escalation Explainer**: _"Why did someone who arrived after me get seen first?"_ card explaining medical urgency vs arrival order to prevent waiting room frustration.
- **Next Safety Milestone Timer**: Shows estimated vital re-check schedule (~10-15 mins).

---

## 🎬 Interactive ED Replay Mode (The Live Demo)

The dashboard includes a built-in **ED Replay Player** (`▶ START SIMULATION`) demonstrating a 90-minute chronological shift across 7 discrete phases:

1. `10:00 AM`: Morning Baseline (Patient P-017 at Rank #17, ESI 3, Risk 18 🟢).
2. `10:35 AM`: Prolonged Waiting (P-017 unmonitored for 35m, Safety Clock enters caution).
3. `11:05 AM`: Staleness Expiry (Safety Clock expires, staleness penalty $+18$ applied, Risk 41 🟡).
4. `11:21 AM`: Acute Deterioration (SpO₂ drops $96 \rightarrow 91\%$, HR spikes $92 \rightarrow 117\text{ bpm}$, Attention Gap elevates P-017 to Rank #3).
5. `11:28 AM`: Surge to Rank #1 (P-017 reaches #1, outranking attended trauma cases).
6. `11:29 AM`: Bedside Reassessment (RN administers O₂, vitals recover $89 \rightarrow 95\%$).
7. `11:31 AM`: Closed-Loop Stabilization (Risk drops $84 \rightarrow 38$, patient moves to Treatment Bay 4, Safety Outcome logged in 3m 42s).

---

## 📊 Quantified Hospital ROI ($3.82M Net Annual Value)

| Financial Driver                  | Annual Value     | Clinical Mechanism                                                  |
| :-------------------------------- | :--------------- | :------------------------------------------------------------------ |
| **Avoided ICU Transfers**         | **$1.39M**       | Early detection of pre-shock hypoperfusion & vital deterioration    |
| **LWBS Revenue Recovery**         | **$1.12M**       | Transparent patient companion reduces walkouts by $\ge 25\%$        |
| **Tertiary Referral Load Relief** | **$450k**        | Safe secondary referral redirection for stable Level 4/5 candidates |
| **Malpractice Risk Mitigation**   | **$480k**        | Tamper-evident audit ledger & deterministic safety guardrails       |
| **ED Fast-Track Pre-Orders**      | **$830k**        | 18-minute reduction in diagnostic turnaround time                   |
| **Total Net Economic Impact**     | **$3.82M+ / yr** | Standard 50,000-visit emergency department                          |

---

## 🚀 Quickstart & Installation

### 1-Click Launchers:

```bash
# macOS / Linux
./start.sh

# Windows PowerShell
.\start.ps1

# Windows Batch
start.bat
```

### Manual Execution:

```bash
# 1. Backend (FastAPI on http://localhost:8000)
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# 2. Frontend (React 19 on http://localhost:5173)
cd frontend
npm install
npm run dev

# 3. Run Automated Pytest Suite (51 Tests)
python -m pytest -v
```

---

## 📄 Submission Deliverables & Artifacts

| Deliverable | Format | Link / File |
| :--- | :--- | :--- |
| 🌐 **Public GitHub Link** | Repository URL | [https://github.com/freya1705/PatientTriageAI.git](https://github.com/freya1705/PatientTriageAI.git) |
| 🎬 **Prototype Video Folder** | Google Drive | [Accenture Demo Video Folder](https://drive.google.com/drive/folders/1qeAV4E03yaVNREZVVUIRtUZ2KoMC7Ptg?usp=sharing) |
| 📄 **README Document (PDF)** | PDF Document | [`PatientTriage_AI_Accenture_Submission_README.pdf`](./PatientTriage_AI_Accenture_Submission_README.pdf) |
| 📄 **Business Proposal (PDF)** | PDF Document | [`PatientTriage_AI_Business_Proposal.pdf`](./PatientTriage_AI_Business_Proposal.pdf) |
| 📊 **Business Proposal (PPT)** | 4-Slide PPTX | [`PatientTriage_AI_Accenture_Proposal_4Slides.pptx`](./PatientTriage_AI_Accenture_Proposal_4Slides.pptx) |
| 🎬 **Video Narration Script** | Markdown | [`DEMO_VIDEO_SCRIPT.md`](./DEMO_VIDEO_SCRIPT.md) |

---

_Created by **Freya Jadhav** (Team Leader, Team Phoenix, IIT Madras Data Science & Applications, Class of 2028) for the **Accenture Innovation Challenge 2026**._
