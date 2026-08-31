# PatientTriage.ai: Business Proposal & Enterprise Strategy 🏥

**“Triage is a snapshot. Risk isn't.”**  
_Closing the Emergency Waiting-Room Clinical Surveillance Gap_  
_Accenture Innovation Challenge 2026 — Round 2 Business Case & Enterprise Strategy_

---

## 📊 Executive Financial & Clinical Highlights

| Metric | Modeled Value (500-Bed Facility) | Impact Context |
| :--- | :--- | :--- |
| **Gross Annual Value** | **$3,821,200 / yr** | Across 5 core clinical & operational value drivers |
| **Enterprise Software & Support** | **-$240,000 / yr** | Annual hospital subscription & edge hardware support |
| **Estimated Net Annual ROI** | **+$3,581,200 / yr (14.9x ROI)** | Net enterprise return per facility |
| **LWBS Revenue Recovery** | **+$1,123,200 / yr** | 30% reduction in Left-Without-Being-Seen patients |
| **Avoided ICU Transfers** | **+$1,395,000 / yr** | 64% reduction in waiting-room cardiac arrests / crashes |
| **Target Addressable Market** | **5,500+ US/EU EDs ($4.2B TAM)** | Growing acute tertiary networks globally |

---

## 🚨 1. The Clinical & Operational Problem Framing

Emergency department (ED) crowding is an escalating global crisis with over 140M annual visits in the US alone. Following the COVID-19 pandemic, emergency nursing turnover has reached a critical peak of **26.8%**, creating severe staffing bottlenecks.

Traditional emergency triage operates on an outdated premise: **a single static snapshot taken at intake**. Once assigned an ESI Level 3 or 4 acuity score, patients wait unmonitored for **2.5 to 4.5 hours**. During this unmonitored surveillance gap:
1. **Silent Physiological Collapse:** Sepsis, occult internal hemorrhage, and silent hypoxia worsen without clinical detection.
2. **The 'Missing Data Is Safe' Fallacy:** In legacy EHR systems (Epic, Cerner), missing vital signs default to normal parameters, artificially depressing risk scores and creating catastrophic false reassurance.
3. **The Attention Bottleneck:** Attended patients in hospital beds tie up static queues, while unattended deteriorating patients in waiting lounges remain buried.

---

## 💡 2. Solution Design & The 3 Hero Differentiators

**PatientTriage.ai** is an **AI Safety Copilot** purpose-built for the emergency waiting room. It does not replace clinicians or diagnose conditions; it continuously calculates deterioration trajectory, evidence validity, uncertainty, and clinician coverage to answer: **"Who needs attention first, and why?"**

### The 3 Core Architectural Differentiators:
1. **Safe-to-Wait Dynamic Surveillance:** Continuously monitors vital trajectory velocity ($\Delta\text{SpO}_2, \Delta\text{HR}$) to detect subtle decompensation before overt clinical collapse.
2. **Uncertainty Guardrail ($Unknown \ne Safe$):** Missing or stale physiological telemetry applies an explicit uncertainty penalty ($w_u = +15\text{ to }+25\text{ pts}$), elevating unmonitored patients for human physical verification.
3. **Operational Attention Gap:** Deprioritizes attended patients ($-w_c = -35\text{ pts}$) when a clinician is assigned ($is\_attended = True$), directly surfacing unmonitored deteriorating patients to Rank #1 of the Action Queue.

---

## 🚦 3. Four Discrete Operational Workflow States

```
+---------------------------------------------------------------------------------------------------------------+
| State Badge   | Physiological Definition                       | Clinical Action & Dispatch                   |
| :------------ | :--------------------------------------------- | :------------------------------------------- |
| 🟢 CONTINUE   | Vitals stable within baseline; clock active   | Safe to wait; ongoing ambient monitoring     |
| 🟡 REASSESS   | Stale observation or mild drift (ΔHR ≥ +20bpm) | Dispatches nurse bedside vital recheck round  |
| 🔴 ESCALATE   | Red-flag breach (SpO2 < 85%, SBP < 75 mmHg)    | Immediate resus bay allocation & MD page     |
| ⚪ UNCERTAIN   | Missing telemetry or sensor noise             | Forces human verification (Unknown ≠ Safe)    |
+---------------------------------------------------------------------------------------------------------------+
```

---

## 👥 4. Target Stakeholders & Value Propositions

| Stakeholder | Primary Pain Point | PatientTriage.ai Value Proposition |
| :--- | :--- | :--- |
| **Triage Nurses (RNs)** | Overwhelmed tracking 40+ waiting patients; fear of silent collapse; alarm fatigue. | **'Next 5 Mins' Worklist** surfaces the top 3 actionable tasks with 1-click Bedside Reassessment. |
| **Emergency MDs** | Blind to which waiting patient has deteriorated since intake. | **Attention Gap Queue** dispatches physicians to the highest unmet clinical risk. |
| **Chief Medical Officers** | Delayed diagnosis lawsuits, sentinel waiting room deaths. | **100% Downgrade Guardrails** & append-only tamper-evident audit ledger for malpractice defense. |
| **Hospital CFOs** | Uncompensated ICU boarding, LWBS revenue leakage, nurse turnover. | **Delivers modeled $3.58M net annual ROI (14.9x return on license).** |

---

## 💰 5. Business Case & Financial Impact Model (500-Bed Facility)

_Modeled projections based on 65,000 annual ED visits, 500 acute care beds, and $1,200 average ED revenue per visit (Derived from published emergency medicine health economics literature; requires hospital-specific validation):_

| Value Driver | Pre-Implementation Baseline | Modeled Post-Implementation Impact | Annual Financial Value |
| :--- | :--- | :--- | :--- |
| **1. LWBS Revenue Recovery** | 3,120 patients/yr leave (4.8%) | 30% reduction via proactive re-engagement | **+$1,123,200 / yr** |
| **2. Avoided ICU Transfers** | 145 waiting room ICU crashes/yr | 64% reduction (93 avoided ICU stays @ $15k) | **+$1,395,000 / yr** |
| **3. Malpractice Risk Mitigation** | $1.2M annual liability reserve | 40% reduction via documented audit trail | **+$480,000 / yr** |
| **4. Nurse Retention & Overtime** | 26.8% nurse turnover (14 replacements) | 4 replacements avoided + 15% overtime cut | **+$378,000 / yr** |
| **5. ED Throughput & Boarding** | 248 mins average wait/boarding | 30-minute reduction via optimized dispatch | **+$445,000 / yr** |
| **TOTAL GROSS ANNUAL VALUE** | — | — | **$3,821,200 / yr** |
| **Enterprise License & Support** | — | Annual Software Subscription & Edge Hardware | **-$240,000 / yr** |
| **ESTIMATED NET ANNUAL ROI** | — | **14.9x Net Return on Investment** | **+$3,581,200 / yr** |

---

## 🔌 6. Technical Architecture & HL7 FHIR Interoperability

- **Interoperability:** Ingests HL7 FHIR standard resources (`Encounter`, `Observation`) via SMART-on-FHIR and CDS Hooks (`patient-view`, `order-select`). Seamlessly integrates alongside Epic and Cerner installations without modifying core EHR data.
- **Air-Gapped Edge Processing:** Runs on local hospital infrastructure with sub-15ms inference latency, zero external cloud LLM dependencies, and zero persistent PHI in the ranking cache.
- **Fail-Safe Protocol:** If local edge hardware or network connection is disrupted, the system defaults to a high-contrast fallback banner: `SYSTEM OFFLINE: REVERT TO MANUAL CLINICAL ROUNDING`, maintaining deterministic safety red flags.

---

## 🗺️ 7. Phased Enterprise Roadmap

- **Phase 1 (Q3 2026 - Completed):** Lab Benchmark Validation • 20 synthetic cohorts verified across 51 automated pytest unit/integration test cases; sub-15ms inference latency.
- **Phase 2 (Q4 2026):** Shadow Clinical Trial • Non-interventional background FHIR integration alongside Epic/Cerner to evaluate clinician concordance and alert specificity.
- **Phase 3 (Q1–Q2 2027):** Live Pilot • Target Endpoints: $>45\%$ reduction in Mean Time to Escalation (MTTE); false alarm rate $< 2$ non-actionable alerts/nurse/shift; $\ge 25\%$ reduction in Left-Without-Being-Seen (LWBS).
- **Phase 4 (Q3 2027+):** Multi-Hospital Enterprise Scope • Regional hospital network load balancing, 108 EMS pre-arrival telemetry ingestion, and community referral diversion.

---

## ⚖️ 8. Risk Management, Fail-Safe Behavior & Regulatory Positioning

- **AI Hallucination Risk:** Mitigated by strict 3-tier architecture where deterministic physiological red-flags override all statistical models.
- **Clinician Alarm Fatigue:** Mitigated by queue compression surfacing only top actionable tasks in the 'Next 5 Mins' queue, preventing alarm flooding.
- **Regulatory Classification:** Positioned as Clinical Decision Support under **FDA Non-Device CDS (21 U.S.C. § 360aaa-1)**; licensed clinicians retain 100% final override authority.
- **Data Privacy (HIPAA / GDPR Aligned):** Air-gapped on local hospital network with append-only tamper-evident audit logging.

---

_Created by **Freya Jadhav** (Team Leader, Team Phoenix, IIT Madras Data Science & Applications, Class of 2028) for the **Accenture Innovation Challenge 2026**._
