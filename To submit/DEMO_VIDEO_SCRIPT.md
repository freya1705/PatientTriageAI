# 🎬 PatientTriage.ai — Official Hackathon Demo Video Script

**Accenture Innovation Challenge 2026 — Round 2 Video Submission**  
**Target Duration:** 2 Minutes 45 Seconds (165 Seconds)  
**Target Output Format:** MP4 / MOV (H.264 / AAC, 1080p, < 20 MB)  
**Presenter & Participant:** **Freya Jadhav** (Team Leader, IIT Madras, `freya1705`)  
**Team Name:** **Phoenix**  
**Repository:** [https://github.com/freya1705/PatientTriageAI](https://github.com/freya1705/PatientTriageAI)

---

## ⏱️ Video Structure & Scene-by-Scene Rundown

| Timestamp | Scene Focus | Key Visual / Action on Screen |
| :--- | :--- | :--- |
| `0:00 – 0:15` | **The Hook** | Screen: **Patients Census** (`http://localhost:5173`). Highlight core question: *"Who is no longer safe to wait?"* |
| `0:15 – 0:35` | **The 3-State Model** | Point to `🔴 ACT NOW`, `🟡 RECHECK`, and `🟢 SAFE TO WAIT` summary indicators. |
| `0:35 – 0:55` | **Triggering the AI Signal** | Click **`⚡ Demo: Drop SpO₂`** at top right. Tyler Brooks' SpO₂ drops and jumps to Rank #1. |
| `0:55 – 1:15` | **Ranked Worklist & Ownership** | Go to **My Worklist**. Point to `#1 Tyler Brooks (Criticality: HIGH)`. Click **`[ I'm on it ]`** $\rightarrow$ `🟢 CLAIMED`. |
| `1:15 – 1:35` | **Explainability & Signal** | Click **`[ Details ]`**. Show `SpO₂ 96% → 91% (↓5%)`, `HR 92 → 127 bpm`, and `SIGNAL STRENGTH: HIGH`. |
| `1:35 – 1:55` | **Bedside Reassessment** | Click **`[ REASSESS NOW ]`**. Enter vitals (`SpO₂: 97`, `HR: 101`, `BP: 94`, `Temp: 37.1`). Click **`[ SAVE REASSESSMENT ]`**. |
| `1:55 – 2:15` | **Closed-Loop Escalation** | Outcome modal shows **`ESCALATION RECOMMENDATION`** $\rightarrow$ Click **`[ ASSIGN & NOTIFY ]`** $\rightarrow$ `✓ Assigned to Dr. Sarah Chen & Acknowledged`. |
| `2:15 – 2:35` | **Tamper-Evident Audit Trail** | Click **`📜 Audit`** on sidebar. Show chronological record of detection, bedside vitals, handoff, and doctor acknowledgment. |
| `2:35 – 2:50` | **Winning Outro** | Return to dashboard. Closing statement: *"Detect deterioration. Prioritize risk. Route the response."* |

---

## 🎙️ Word-for-Word Video Script & Director Notes

---

### 📍 Scene 1: The Hook (`0:00 – 0:15`)
- **Screen View:** Browser on `http://localhost:5173` $\rightarrow$ click **`Patients`** on sidebar.
- **Director Action:** Mouse slowly scans the waiting room census.
- **Voiceover (Audio Track):**
  > _"In a crowded emergency department, the most dangerous patient isn't always the patient who arrived most critically ill._
  >
  > _It's the patient whose condition is deteriorating while they wait._
  >
  > _PatientTriage.ai continuously monitors the waiting room to answer one question: **Who is no longer safe to wait?**"_

---

### 📍 Scene 2: The 3-State Safety Model (`0:15 – 0:35`)
- **Screen View:** Focus on top summary indicators on **`Patients`** / **`Worklist`**.
- **Director Action:** Mouse highlights `🔴 ACT NOW`, `🟡 RECHECK`, and `🟢 SAFE TO WAIT`.
- **Voiceover (Audio Track):**
  > _"Here we have a live emergency department waiting room. Every patient has an acuity level, current safety state, and recommended action._
  >
  > _Instead of asking nurses to manually scan 20 patients, PatientTriage.ai continuously watches for meaningful changes in risk._
  >
  > _Patients are automatically grouped into three actionable states: **Act Now**, **Recheck**, and **Safe to Wait**."_

---

### 📍 Scene 3: Trigger the Demo (`0:35 – 0:55`)
- **Screen View:** Top header.
- **Director Action:**
  1. 👉 Click the red **`[ ⚡ Demo: Drop SpO₂ ]`** button.
  2. 👉 Show the toast notification and watch the queue reorder dynamically.
- **Voiceover (Audio Track):**
  > _"Now let's simulate a patient deteriorating while waiting._
  >
  > _Tyler Brooks' oxygen saturation drops and his heart rate rises._
  >
  > _PatientTriage.ai detects the change and immediately identifies a high-priority safety signal."_

---

### 📍 Scene 4: Ranked Worklist & Claiming Alert (`0:55 – 1:15`)
- **Screen View:** Click **`Worklist`** on left sidebar.
- **Director Action:**
  1. 👉 Point to **`🔴 ACT NOW`** $\rightarrow$ `#1 Tyler Brooks (Criticality: HIGH)`.
  2. 👉 Click **`[ I'm on it ]`** $\rightarrow$ Watch badge update to `🟢 CLAIMED — RN Sarah Chen`.
- **Voiceover (Audio Track):**
  > _"The patient is automatically promoted into the nurse's worklist._
  >
  > _But we don't just generate another notification. We prioritize the patients who need attention first._
  >
  > _Tyler is ranked Number 1 based on the trajectory of his deterioration._
  >
  > _With one click on **'I'm on it'**, Nurse Sarah claims the alert — preventing duplicate work across the department."_

---

### 📍 Scene 5: Explainability & Clinical Decision Support (`1:15 – 1:35`)
- **Screen View:** Click **`[ Details ]`** on Tyler's row to slide out the **Patient Drawer**.
- **Director Action:**
  1. 👉 Point to `SpO₂ 96% → 91% (↓ 5%) • HR 92 → 127 bpm (↑ 35 bpm)`.
  2. 👉 Point to `SIGNAL STRENGTH: HIGH (SpO₂ decline + tachycardia)`.
- **Voiceover (Audio Track):**
  > _"The nurse can immediately see why the patient was escalated._
  >
  > _The AI doesn't just say 'high risk.' It shows the exact physiological velocity shift that triggered the alert: a 5% oxygen drop and acute tachycardia following blunt trauma._
  >
  > _The signal strength is high, and the system recommends immediate bedside verification."_

---

### 📍 Scene 6: Bedside Reassessment (`1:35 – 1:55`)
- **Screen View:** Reassessment Modal.
- **Director Action:**
  1. 👉 Click **`[ REASSESS NOW ]`**.
  2. 👉 Show pre-filled bedside vitals after supplemental oxygen (`SpO₂: 97%`, `HR: 101 bpm`, `BP: 94/62`, `Temp: 37.1°C`).
  3. 👉 Click **`[ SAVE REASSESSMENT ]`**.
- **Voiceover (Audio Track):**
  > _"The nurse then performs a bedside reassessment and administers supplemental oxygen._
  >
  > _Sarah records the verified recovery vitals and clicks **Save Reassessment**."_

---

### 📍 Scene 7: Closed-Loop Escalation & Clinical Ownership (`1:55 – 2:15`)
- **Screen View:** Safety Outcome Modal with **`ESCALATION RECOMMENDATION`**.
- **Director Action:**
  1. 👉 Point to `🔴 HIGH PRIORITY` $\rightarrow$ `Route to: ED Physician — Trauma Team (Dr. Sarah Chen)`.
  2. 👉 Point to `Response target: ≤ 5 min`.
  3. 👉 Click **`[ ASSIGN & NOTIFY CLINICIAN ]`**.
  4. 👉 Watch badge confirm `✓ Assigned to Dr. Sarah Chen` and `✓ Acknowledged (SLA Locked)`.
- **Voiceover (Audio Track):**
  > _"This is where PatientTriage.ai goes beyond detection._
  >
  > _If the patient remains concerning, the system recommends the next responsible clinical owner._
  >
  > _The nurse assigns the case to Dr. Sarah Chen on the ED Trauma Team with a 5-minute response target._
  >
  > _With one click on **Assign & Notify**, clinical ownership is established, acknowledged, and locked._
  >
  > _**We don't just detect deterioration. We make sure someone owns the response.**"_

---

### 📍 Scene 8: Immutable Audit Trail & Regulatory Governance (`2:15 – 2:35`)
- **Screen View:** Click **`📜 Audit`** on left navigation.
- **Director Action:** Mouse highlights the newest chronological audit records.
- **Voiceover (Audio Track):**
  > _"Every alert, claim, bedside reassessment, escalation, and physician acknowledgement is recorded in an immutable audit ledger._
  >
  > _This creates a complete human-in-the-loop governance record — so hospitals can answer not only what the AI detected, but also who responded and when."_

---

### 📍 Scene 9: Outro & Winning Close (`2:35 – 2:50`)
- **Screen View:** Return to **My Worklist** (`http://localhost:5173`).
- **Director Action:** Final panoramic view of the quiet, safe queue (`ACT NOW: 2, SAFE TO WAIT: 13`).
- **Voiceover (Audio Track):**
  > _"PatientTriage.ai doesn't replace nurses or doctors._
  >
  > _It makes sure deterioration doesn't disappear into the waiting room._
  >
  > _**Detect deterioration. Prioritize risk. Route the response.**_
  >
  > _PatientTriage.ai — keeping patients safe while they wait. Thank you."_
