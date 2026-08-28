# 🎬 PatientTriage.ai — Official Prototype Demonstration Video Script

**Accenture Innovation Challenge 2026 — Round 2 Video Submission**  
**Target Duration:** 2 Minutes 40 Seconds (160 Seconds)  
**Target Output Format:** MP4 / MOV (H.264 / AAC, 1080p, < 20 MB)  
**Presenter & Participant:** **Freya Jadhav** (`freya1705`)  
**Repository:** [https://github.com/freya1705/PatientTriageAI](https://github.com/freya1705/PatientTriageAI)

---

## ⏱️ Video Structure & Scene-by-Scene Rundown

| Scene       | Time          | Focus Area                           | Key Visual / Action on Screen                                                                    |
| :---------- | :------------ | :----------------------------------- | :----------------------------------------------------------------------------------------------- |
| **Scene 1** | `0:00 – 0:25` | **The Hook & Clinical Problem**      | Open **My Worklist** (`http://localhost:5173`) & highlight the compact status ribbon.            |
| **Scene 2** | `0:25 – 0:55` | **"What Changed?" & "I'm On It"**    | Point to `P-017` in `🔴 ACTION NOW`, click `[ I'M ON IT ]` (shows "Being handled by RN Sarah").  |
| **Scene 3** | `0:55 – 1:30` | **The Closed-Loop Reassessment**     | Click `[ REASSESS NOW ]` → enter vitals → `[ SAVE ]` → P-017 stabilizes and leaves urgent queue! |
| **Scene 4** | `1:30 – 1:55` | **Human-Readable Explainability**    | Click `[ Why? ]` (4 plain-English bullets) + `[ 🔮 What If Waiting Continues? ]`.                |
| **Scene 5** | `1:55 – 2:20` | **Charge Nurse Command Center & QR** | Switch to **Command Center** (Floor Pressure Map) & flash **Patient QR Companion**.              |
| **Scene 6** | `2:20 – 2:40` | **Hospital ROI & Executive Outro**   | $3.82M Net Annual Value breakdown & GitHub repository outro.                                     |

---

## 🎙️ Complete Word-for-Word Video Script & Director Notes

---

### 📍 Scene 1: The Problem & "My Worklist" (`0:00 – 0:25`)

- **Screen View:** Full-screen browser on **`http://localhost:5173`** (Default page: **MY WORKLIST**).
- **Director Action:** Mouse slowly highlights the status ribbon: `WAITING 20 | ACTION NEEDED 4 | EXPIRING 3 | ESCALATE 1`.
- **Voiceover (Audio Track):**
  > _"Welcome to PatientTriage.ai. In emergency departments today, triage is treated as a one-time snapshot at the front door. But patients wait for hours, and risk continuously changes._
  >
  > _Most AI dashboards overwhelm clinicians with raw risk scores and complex formulas. PatientTriage.ai does the exact opposite: **we don't make the nurse find the signal — we bring the signal to the nurse.**"_

---

### 📍 Scene 2: "What Changed?" & Staff Coordination (`0:25 – 0:55`)

- **Screen View:** Focus on the top card under **`🔴 ACTION REQUIRED NOW`** (Patient `P-017 — Harold Jenkins`).
- **Director Action:**
  1. 👉 Point to **`WHAT CHANGED`**: `SpO₂ 96% → 91% (↓ 5%) • HR 92 → 117 bpm (↑ 25 bpm)`.
  2. 👉 Point to **`SAFETY WINDOW`**: `12 min remaining`.
  3. 👉 Click the **`[ I'M ON IT ]`** button.
  4. 👉 Watch the card badge instantly update to `🟡 Being handled by RN Sarah Chen`.
- **Voiceover (Audio Track):**
  > \*"On the nurse's screen, the information hierarchy is crystal clear.  
  > In 3 seconds, Nurse Sarah sees:  
  > **Who needs her:** Patient P-017.  
  > **What changed:** Oxygen saturation dropped from 96% down to 91%, with a 25 bpm heart rate spike.
  >
  > With one click on **[ I'M ON IT ]**, Sarah claims the patient — instantly notifying other nurses to prevent duplicate work."\*

---

### 📍 Scene 3: The Killer Feature — Closed-Loop Reassessment (`0:55 – 1:30`)

- **Screen View:** Reassessment Modal & Post-Reassessment summary.
- **Director Action:**
  1. 👉 Click the red **`[ REASSESS NOW ]`** button on `P-017`.
  2. 👉 Show the clean bedside form populated with verified recovery vitals (`SpO₂: 95%`, `HR: 101 bpm`, `BP: 124/78 mmHg`).
  3. 👉 Click **`[ SAVE REASSESSMENT ]`**.
  4. 👉 The **Safety Outcome Screen** appears: `✓ Reassessment Complete | Time to Intervention: 3m 42s | Risk dropped 84 → 38`.
  5. 👉 Click **`[ Acknowledge & Continue ]`**.
  6. 👉 Watch `P-017` **automatically disappear from the urgent queue**, and the status ribbon update to `ACTION NEEDED 3`.
- **Voiceover (Audio Track):**
  > \*"When Sarah clicks **[ REASSESS NOW ]**, she enters verified vitals after administering oxygen.
  >
  > Once saved, the system recalculates in real-time: risk drops from 84 down to 38. The patient stabilizes into **WATCH** state and automatically moves out of the urgent action queue.
  >
  > This is a complete **closed-loop clinical workflow**: Detection $\rightarrow$ Recommendation $\rightarrow$ Human Action $\rightarrow$ Verification $\rightarrow$ Recalculation."\*

---

### 📍 Scene 4: Unified Patient Drawer & Decision Support (`1:30 – 1:55`)

- **Screen View:** Next card `P-014` (`🟠 RECHECK SOON`).
- **Director Action:**
  1. 👉 Click the **`[ Why? ]`** button on `P-014` to slide out the **Unified Patient Drawer**.
  2. 👉 Show **Tab 1 (Clinical Summary)** with age calibration model (Pediatric/Geriatric/Adult), live vitals, and Companion/Referral status.
  3. 👉 Show **Tab 2 (Why This Rank)** with plain-English clinical reasons (no math jargon needed).
  4. 👉 Show **Tab 3 (What Happens Next)** with inaction trajectory projection and 1-click reassessment.
- **Voiceover (Audio Track):**
  > \*"Nurses never have to guess why a patient was prioritized. Clicking **[ Why? ]** slides out a clean 3-tab Patient Drawer showing plain-English risk factors, age-specific shock calibrations, and what happens if care is delayed.
  >
  > No math jargon or clunky popups — just immediate, actionable clinical decision support."\*

---

### 📍 Scene 5: Command Center, 108 EMS & Patient Companion (`1:55 – 2:20`)

- **Screen View:** Click **`Command Center`** on left rail, then click **`Patient QR Companion`** topbar button.
- **Director Action:**
  1. 👉 Point to the top **108 EMS Inbound Telemetry Banner** (live ETA, incoming STEMI vitals, and 1-click Resus Bay pre-allocation).
  2. 👉 Show the **ED Floor Pressure Map** with live color-coded status halos for Waiting Room Chairs 1–20 and **`⚠️ Attendant Away`** flags.
  3. 👉 Show the **`🏥 Referral Candidate (RES 88%)`** badges for safe community clinic redirection.
  4. 👉 Click **`Patient QR Companion`** to open the mobile phone care tracker with the **"Why is the queue moving?"** de-escalation card.
- **Voiceover (Audio Track):**
  > \*"For charge nurses, the **Command Center** ingests en-route 108 ambulance telemetry with 1-click resus bay pre-allocation, tracks unattended patients across the waiting lounge, and flags safe referral candidates.
  >
  > Meanwhile, our **Patient Transparency Companion** de-escalates waiting room tension by explaining triage priority in plain language directly on patient phones."\*

---

### 📍 Scene 6: Measurable Hospital ROI & Outro (`2:20 – 2:40`)

- **Screen View:** Navigate back to **My Worklist** or the main landing page with GitHub link and author badge.
- **Director Action:** Cursor rests on the Freya Jadhav contributor badge.
- **Voiceover (Audio Track):**
  > \*"By eliminating silent waiting room deterioration and recovering lost walkout revenue, PatientTriage.ai delivers **$3.82M in annual net value** for a standard 50,000-visit emergency department.
  >
  > Compliant with FDA Non-Device CDS standards, the system keeps clinicians in 100% control.
  >
  > Triage is a snapshot. Risk isn't.  
  > I'm Freya Jadhav — thank you for exploring PatientTriage.ai."\*

---

## 🎬 5 Tips for a Smooth Recording:

1. **Screen Setup:** Full screen in Google Chrome (`F11` or Hide Bookmarks bar), 1080p resolution.
2. **Audio:** Use a clean, quiet environment or headset microphone.
3. **Cursor Pacing:** Move the cursor deliberately and pause for 1 second on buttons before clicking.
4. **Recording Tools:** OBS Studio, Windows Game Bar (`Win + Alt + R`), or Loom.
5. **File Size:** Target MP4 H.264 under 20 MB (a 2m 40s recording at 1080p typically exports at ~10–14 MB).
