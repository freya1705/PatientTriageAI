# 🎬 PatientTriage.ai — Official Prototype Demonstration Video Script
**Accenture Innovation Challenge 2026 — Round 2 Video Submission**  
**Target Duration:** 2 Minutes 45 Seconds (165 Seconds)  
**Target Output Format:** MP4 / MOV (H.264 / AAC, 1080p/720p, < 20 MB)  
**Participant:** Freya Jadhav (`freya1705`)

---

## ⏱️ Video Structure & Scene-by-Scene Rundown

| Scene | Time | Focus Area | Key Visual / Action on Screen |
|---|---|---|---|
| **Scene 1** | `0:00 – 0:20` | **The Hook & ED Control Tower** | 3 Giant Hero Numbers (47 Waiting, 6 Attention, 13m Window) + Status Ribbon |
| **Scene 2** | `0:20 – 0:50` | **The Replay Demo: Dynamic Risk & Surge to #1** | Press `▶ START SIMULATION` → P-017 drops SpO₂ 96%→91% and surges #17 → #1 |
| **Scene 3** | `0:50 – 1:20` | **Explainability & Counterfactual Safety** | "Why #1?" Breakdown + "What If We Do Nothing?" Trajectory Modal |
| **Scene 4** | `1:20 – 1:50` | **Closed-Loop Action & Safety Outcome** | Click `[ REASSESS ]` → Risk drops 67→38 → Safety Outcome Screen (Time to Intervention 3m 42s) |
| **Scene 5** | `1:50 – 2:20` | **Multi-Views: Nurse View & Floor Map** | Nurse Action View ("Next 5 Mins") & ED Pressure Map with Chairs/Bays |
| **Scene 6** | `2:20 – 2:45` | **Patient Companion & Executive Outro** | Mobile QR Smart Transparency Portal + ROI ($3.82M Annual Net Impact) |

---

## 🎙️ Complete Word-for-Word Video Script

---

### 📍 Scene 1: The Problem & The ED Control Tower (`0:00 – 0:20`)
- **Visual on Screen:**  
  Start on the **ED Safety Control Tower** (`http://localhost:5173`). Highlight the **3 Giant Hero Metrics**: `47 Patients Waiting`, `6 Requiring Attention`, `13 min Shortest Safety Window`, and the live state ribbon.
- **Presenter Action:**  
  Cursor hovers over the 3 numbers and the live status ribbon showing `12 LOW RISK | 21 STABLE | 7 WATCH | 4 REASSESS | 2 ESCALATE | 1 UNCERTAIN`.
- **Voiceover (Audio Track):**  
  > *"Welcome to PatientTriage.ai. In emergency medicine today, triage is treated as a one-time snapshot at the front door. But patients wait for hours, and risk continuously changes.*  
  >  
  > *Traditional EHRs leave the waiting room as a dangerous blind spot. PatientTriage.ai transforms the emergency department into an **Active Autonomous Safety Control Tower** that continuously decides: who needs attention, why, and what action should happen next."*

---

### 📍 Scene 2: 🎬 ED Replay Mode — Dynamic Risk in Action (`0:20 – 0:50`)
- **Visual on Screen:**  
  Point to Patient **`P-017`** sitting at position **#17** in the morning census (`🟢 Stable, ESI 3, Risk 18`).
- **Presenter Action (KEY DEMO SEQUENCE):**  
  👉 Click the **`▶ START SIMULATION`** button on the Replay Simulation Bar.  
  👉 Watch the clock advance from `10:00 AM → 11:21 AM`.  
  👉 The Safety Clock for `P-017` counts down to `EXPIRED`.  
  👉 Vital drop occurs: SpO₂ falls from $96\% \rightarrow 91\%$, Heart Rate jumps $92 \rightarrow 117\text{ bpm}$.  
  👉 Watch `P-017` dynamically surge in real time from **#17 → #9 → #4 → #1** in the Live Action Queue!  
  👉 Screen flashes `🔴 REASSESS NOW`.
- **Voiceover (Audio Track):**  
  > *"Here is the platform in live action. At 10:00 AM, Patient P-017 arrives with mild viral symptoms, triaged at Level 3, sitting at position #17.*  
  >  
  > *Watch what happens as we run our live ED Replay. As waiting time accumulates, the patient's Safety Clock expires. Suddenly, ambient sensors detect an acute drop in oxygen saturation from 96% down to 91%.*  
  >  
  > *Instead of remaining buried at #17, our Attention Gap engine instantly re-ranks P-017 straight to **Rank #1** — outranking attended trauma cases who already have doctors at their bedside."*

---

### 📍 Scene 3: Explainability & "Counterfactual Safety" (`0:50 – 1:20`)
- **Visual on Screen:**  
  Click **`Why #1 vs #2?`** button, then click **`🔮 Forecast`** on Patient `P-017`.
- **Presenter Action:**  
  Show the **Score Decomposition Matrix** (Deterioration $+32$, Staleness $+18$, Waiting Hazard $+12$, Uncertainty $+8$, Coverage $+0 \rightarrow 70\text{ pts}$).  
  Open the **Counterfactual Safety Modal** showing Path A (Inaction $\rightarrow$ risk climbing to 81, potential septic crash in 40 mins) vs Path B (Immediate Intervention $\rightarrow$ risk dropping to 38).
- **Voiceover (Audio Track):**  
  > *"Why did the system escalate P-017? With one click, clinicians see the exact mathematical waterfall.*  
  >  
  > *Even more powerful is our **Counterfactual Safety Engine**. PatientTriage doesn't just ask 'Who is risky?' — it asks: **'Who becomes unsafe if we keep waiting?'**  
  > If unattended for 20 more minutes, P-017 faces a projected risk score of 81 with imminent respiratory failure. But with immediate intervention, uncertainty collapses and risk drops to 38."*

---

### 📍 Scene 4: Closed-Loop Action & Safety Outcome (`1:20 – 1:50`)
- **Visual on Screen:**  
  Click the **`[ REASSESS ]`** button on Patient `P-017`.
- **Presenter Action:**  
  Show the in-flight reassessment apply: SpO₂ recovers to $97\%$, Heart Rate normalizes to $78\text{ bpm}$, Risk drops from $84 \rightarrow 38$, and the patient smoothly exits the emergency intervention queue.  
  The **Safety Outcome Modal** appears, displaying:  
  `✓ Action Completed | Time to Intervention: 3m 42s | Risk Reduction: -46 pts | Audit Ledger Updated`.
- **Voiceover (Audio Track):**  
  > *"When the triage nurse clicks **[ REASSESS ]**, the system closes the clinical loop. Supplemental oxygen is administered, repeat vitals are verified, and risk is immediately recalculated from 84 down to 38.*  
  >  
  > *The Safety Outcome is recorded in our tamper-evident audit ledger, documenting a **3-minute 42-second Time to Intervention**."*

---

### 📍 Scene 5: Nurse View ("Next 5 Minutes") & ED Pressure Map (`1:50 – 2:20`)
- **Visual on Screen:**  
  Toggle to **`🩺 Nurse View (Next 5 Mins)`**, then toggle to **`🗺️ ED Floor Pressure Map`**, then **`🧪 Pre-Orders Hub`**.
- **Presenter Action:**  
  Show the time-budgeted micro-tasks (`P-017 — 90s`, `P-001 — 60s`, `P-007 — 45s`).  
  Switch to the Pressure Map showing Waiting Room Chairs 1–20 vs Treatment Bays with live color-coded status halos (🟢, 🟡, 🟠, 🔴).  
  Show the **Autonomous Pre-Orders Hub** auto-drafting Troponin/ECG and Lactate orders with 1-click approval.
- **Voiceover (Audio Track):**  
  > *"PatientTriage is built for hospital realities. In **Nurse View**, AI converts abstract numbers into an actionable 5-minute task schedule.*  
  >  
  > *In the **ED Pressure Map**, charge nurses visualize every waiting room chair and treatment bay in real time.*  
  >  
  > *And through our **Standing Pre-Order Hub**, diagnostic orders like Troponin and Lactate are auto-drafted before physician assignment, cutting diagnostic turnaround by 18 minutes."*

---

### 📍 Scene 6: Patient Transparency Companion & ROI Closing (`2:20 – 2:45`)
- **Visual on Screen:**  
  Open the **Patient Transparency Companion** mobile simulator (QR / SMS view).  
  Show the transparent care progress tracker (`Triage` $\rightarrow$ `Pre-Labs` $\rightarrow$ `Surveillance` $\rightarrow$ `Care Bay`), contextual safety messaging, and the **$3.82M Annual Net ROI** summary.
- **Presenter Action:**  
  Close on the master landing page with Freya Jadhav contributor badge and GitHub link.
- **Voiceover (Audio Track):**  
  > *"Finally, our **Patient Transparency Companion** gives waiting patients live status updates directly on their phones via triage QR code — eliminating anxiety and recovering $1.12M in lost walkout revenue.*  
  >  
  > *Together with avoided ICU transfers and diagnostic fast-tracking, PatientTriage delivers **$3.82M in annual net value** for a 50,000-visit emergency department.*  
  >  
  > *Triage is a snapshot. Risk isn't.  
  > Thank you — explore our open-source prototype on GitHub."*

---

## 🎯 Recording Checklist for Freya:
1. **Screen Resolution:** 1920x1080 (16:9).
2. **Browser:** Chrome full-screen (`F11`) at `http://localhost:5173`.
3. **Cursor Movement:** Smooth, deliberate cursor pacing with 1–2 second pauses during key simulation transitions.
4. **Audio:** Clear microphone recording matching the voiceover lines above.
5. **Output:** MP4 under 20 MB (compressed with HandBrake or ffmpeg if necessary).
