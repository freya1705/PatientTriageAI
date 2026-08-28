# PatientTriage.ai — Frontend Architecture 🏥

The frontend is a **React 19** application bundled with **Vite** and styled with **TailwindCSS**, designed for sub-second real-time responsiveness in emergency department clinical environments.

---

## 🏗️ Core Component Architecture

- **`src/components/PatientDrawer.jsx`**: Unified 3-tab slide-over clinical explainability panel:
  - _Tab 1 (Clinical Summary):_ Patient demographics, vital matrix with abnormal flags, age-specific shock models (Pediatric / Geriatric / Adult), attendant status, and referral eligibility.
  - _Tab 2 (Why This Rank):_ Plain-English clinical justifications and collapsible math formula breakdown ($w_r, w_d, w_s, w_u, w_c$).
  - _Tab 3 (What Happens Next):_ Recommended next action, counterfactual inaction risk projection, and 1-click reassessment form.
- **`src/components/EDControlTowerHeader.jsx`**: Top-level control tower status strip:
  - 3 Actionable census groups: 🔴 **Act Now** (pulsing badge), 🟡 **Recheck Soon**, 🟢 **Stable**.
  - **Dynamic ED Capacity Load Bar** showing realtime bed/chair saturation percentage.
  - **108 EMS Pre-Arrival Inbound Telemetry Banner** displaying ambulance unit, ETA, pre-computed acuity, live vitals, and 1-click Resus Bay pre-allocation.
- **`src/components/EDPressureMap.jsx`**: Spatial waiting lounge and treatment bay grid with real-time pulsating halos and interactive **`⚠️ Attendant Away`** toggles.
- **`src/components/ActionQueue.jsx`**: Real-time sorted priority list featuring **`🏥 Referral Candidate`** badges, Safety Clock countdowns, and quick-action triggers.
- **`src/components/NurseNext5Minutes.jsx`**: Time-budgeted micro-task queue for bedside nurses, automatically prioritizing unattended patient spot-checks.
- **`src/components/PatientTransparencyCompanion.jsx`**: Mobile-optimized zero-install companion featuring care milestones, vital re-check schedule, and the **"Why is the queue moving?"** plain-language de-escalation card.

---

## 🚀 Development & Build

```bash
# Start local development server (http://localhost:5173)
npm run dev

# Compile optimized production bundle
npm run build
```
