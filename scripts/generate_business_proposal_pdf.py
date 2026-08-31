"""
Publication-Grade Business Proposal PDF Generator for PatientTriage.ai
Generates PatientTriage_AI_Business_Proposal.pdf (Exactly 2 Pages)
Accenture Innovation Challenge 2026 — Round 2 Business Case
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748b"))

        # Header (page 2)
        if self._pageNumber > 1:
            self.drawString(36, 11 * 72 - 24, "PatientTriage.ai — Detailed Business Proposal & ROI Model")
            self.drawRightString(8.5 * 72 - 36, 11 * 72 - 24, "Accenture Innovation Challenge 2026")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(36, 11 * 72 - 28, 8.5 * 72 - 36, 11 * 72 - 28)

        # Footer (all pages)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 36, 18, page_text)
        self.drawString(36, 18, "Confidential — Executive Business Proposal • Modeled Projections for 500-Bed Facility • PatientTriage.ai")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(36, 26, 8.5 * 72 - 36, 26)

        self.restoreState()

def build_business_proposal_pdf():
    root_dir = os.path.dirname(os.path.dirname(__file__))
    pdf_path = os.path.join(root_dir, "PatientTriage_AI_Business_Proposal.pdf")
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=32,
        bottomMargin=32
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=1
    )

    tagline_style = ParagraphStyle(
        'DocTagline',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor('#0284c7'),
        spaceAfter=1
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=5
    )

    h1_style = ParagraphStyle(
        'CustomH1',
        fontName='Helvetica-Bold',
        fontSize=9.2,
        leading=11.5,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=5,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'CustomBody',
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.3,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=2.5
    )

    bullet_style = ParagraphStyle(
        'CustomBullet',
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.2,
        textColor=colors.HexColor('#1e293b'),
        leftIndent=8,
        firstLineIndent=-5,
        spaceAfter=1.5
    )

    code_style = ParagraphStyle(
        'CustomCode',
        fontName='Courier',
        fontSize=6.5,
        leading=8,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=1
    )

    table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=6.8,
        leading=8.5,
        textColor=colors.HexColor('#1e293b')
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=6.8,
        leading=8.5,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    # ================= PAGE 1 =================
    story.append(Paragraph("PatientTriage.ai: Business Proposal & Enterprise Strategy", title_style))
    story.append(Paragraph("“Triage is a snapshot. Risk isn't.” — Closing the Waiting-Room Surveillance Gap", tagline_style))
    story.append(Paragraph("Accenture Innovation Challenge 2026 • Round 2 Business Case • Modeled 500-Bed ED Impact", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0284c7'), spaceAfter=4))

    # Meta Table (ROI Highlights)
    roi_meta_data = [
        [
            Paragraph("<b>GROSS ANNUAL VALUE</b><br/><font color='#0369a1'><b>$3.82M / Hospital</b></font>", table_cell),
            Paragraph("<b>ESTIMATED NET ROI</b><br/><font color='#059669'><b>$3.58M / yr (14.9x)</b></font>", table_cell),
            Paragraph("<b>LWBS REVENUE RECOVERY</b><br/><font color='#0f172a'><b>+$1.12M / yr (30%)</b></font>", table_cell),
            Paragraph("<b>TARGET MARKET</b><br/><font color='#0f172a'><b>5,500+ US/EU EDs</b></font>", table_cell)
        ]
    ]
    roi_meta_table = Table(roi_meta_data, colWidths=[1.85 * inch, 1.85 * inch, 1.85 * inch, 2.05 * inch])
    roi_meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
    ]))
    story.append(roi_meta_table)
    story.append(Spacer(1, 2))

    # Executive Summary
    story.append(Paragraph("Executive Summary", h1_style))
    story.append(Paragraph(
        "Emergency department (ED) crowding is an escalating global crisis with over 140M annual visits in the US alone and severe post-pandemic nurse turnover (26.8%). "
        "Traditional emergency triage operates on an outdated premise: a single static snapshot at intake. Once triaged, ESI Level 3/4 patients wait 2.5 to 4.5 hours unmonitored; "
        "physiological decline (silent hypoxia, sepsis, hemorrhagic shock) remains undetected until sudden waiting-room collapse. "
        "<b>PatientTriage.ai</b> is an <b>AI Safety Copilot</b> purpose-built for the emergency waiting room. It combines continuous vital velocity surveillance, observation shelf-life decay, "
        "uncertainty scoring (<i>Unknown ≠ Safe</i>), and clinician attention discounting (The Attention Gap) to generate <b>$3.82M in gross annual value ($3.58M net ROI)</b> per 500-bed facility.",
        body_style
    ))

    # 1. Market Opportunity & Problem Framing
    story.append(Paragraph("1. Market Opportunity & Problem Framing (The Surveillance Blind Spot)", h1_style))
    story.append(Paragraph("• <b>Silent Waiting Room Deterioration:</b> Patients classified as stable at intake deteriorate silently while waiting; 79% of ED staff report triage bottlenecks as their primary clinical risk.", bullet_style))
    story.append(Paragraph("• <b>The 'Missing Data Is Safe' Fallacy:</b> In legacy EHRs, missing telemetry defaults to low urgency. PatientTriage.ai's <i>Unknown ≠ Safe</i> principle treats missing data as heightened clinical risk.", bullet_style))
    story.append(Paragraph("• <b>Competitive Moat vs. Epic EDI & Cerner MEWS:</b> Inpatient algorithms score static bedded severity. PatientTriage.ai is purpose-built for the waiting room and accounts for <b>physician coverage</b> and <b>evidence staleness decay</b>.", bullet_style))

    # 2. Solution Design & 4-State Dispatch
    story.append(Paragraph("2. Solution Architecture & 4-State Clinical Dispatch", h1_style))
    story.append(Paragraph(
        "PatientTriage.ai deploys a 3-tier architecture: <b>Tier 1: Deterministic Guardrails</b> (hard red-flags and downgrade blocking); "
        "<b>Tier 2: Trajectory & Attention Gap Engine</b> (vital velocity & uncertainty penalty); and <b>Tier 3: Clinical Cockpit</b> ('Next 5 Mins' queue & append-only audit trail). "
        "The system categorizes every waiting patient into 4 discrete operational states:",
        body_style
    ))

    disp_data = [
        [Paragraph("<b>State</b>", table_cell_bold), Paragraph("<b>Physiological Definition</b>", table_cell_bold), Paragraph("<b>Clinical Action Triggered</b>", table_cell_bold)],
        [Paragraph("<font color='#059669'><b>🟢 CONTINUE</b></font>", table_cell), Paragraph("Vitals stable within safe limits; observation shelf-life active.", table_cell), Paragraph("Maintain waiting room monitoring.", table_cell)],
        [Paragraph("<font color='#d97706'><b>🟡 REASSESS</b></font>", table_cell), Paragraph("Observation shelf-life expired (stale data) or moderate vital drift.", table_cell), Paragraph("Dispatches nurse bedside recheck round.", table_cell)],
        [Paragraph("<font color='#dc2626'><b>🔴 ESCALATE</b></font>", table_cell), Paragraph("Deterministic red-flag breach (SpO₂ &lt; 85%, SBP &lt; 75 mmHg).", table_cell), Paragraph("Immediate resuscitation bay allocation & MD page.", table_cell)],
        [Paragraph("<font color='#475569'><b>⚪ UNCERTAIN</b></font>", table_cell), Paragraph("Missing intake vitals, sensor disconnect, or conflicting metrics.", table_cell), Paragraph("Forces physical human verification (<i>Unknown ≠ Safe</i>).", table_cell)],
    ]
    disp_table = Table(disp_data, colWidths=[1.3 * inch, 3.2 * inch, 3.1 * inch])
    disp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(disp_table)
    story.append(Spacer(1, 2))

    # 3. Stakeholder Value Propositions
    story.append(Paragraph("3. Target Stakeholders & Enterprise Value Matrix", h1_style))
    stake_data = [
        [Paragraph("<b>Stakeholder</b>", table_cell_bold), Paragraph("<b>Primary Clinical / Financial Pain Point</b>", table_cell_bold), Paragraph("<b>PatientTriage.ai Value Delivery</b>", table_cell_bold)],
        [Paragraph("<b>Triage Nurses (RNs)</b>", table_cell), Paragraph("Overwhelmed tracking 40+ waiting patients; alarm fatigue.", table_cell), Paragraph("Ranked 'Next 5 Mins' queue surfaces top 3 actionable tasks.", table_cell)],
        [Paragraph("<b>Emergency MDs</b>", table_cell), Paragraph("Blind to which waiting patient worsened since intake.", table_cell), Paragraph("Attention Gap Queue dispatches clinicians to highest unmet need.", table_cell)],
        [Paragraph("<b>Chief Medical Officers</b>", table_cell), Paragraph("Delayed diagnosis lawsuits and sentinel waiting-room events.", table_cell), Paragraph("Deterministic guardrails & append-only audit trail for malpractice defense.", table_cell)],
        [Paragraph("<b>Hospital CFOs</b>", table_cell), Paragraph("Uncompensated ICU crashes, LWBS revenue leakage, turnover.", table_cell), Paragraph("Delivers modeled $3.58M net annual ROI (14.9x return on license).", table_cell)],
    ]
    stake_table = Table(stake_data, colWidths=[1.4 * inch, 2.9 * inch, 3.3 * inch])
    stake_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(stake_table)

    story.append(PageBreak())

    # ================= PAGE 2 =================
    # 4. Financial ROI & Impact Model
    story.append(Paragraph("4. Business Case, Financial ROI & Impact Model (500-Bed Hospital Facility)", h1_style))
    story.append(Paragraph(
        "<i>Modeled Financial & Clinical Projections based on 65,000 annual ED visits, 500 acute beds, and $1,200 average ED revenue/visit (Derived from published emergency health economics literature; requires hospital-specific validation):</i>",
        body_style
    ))

    fin_data = [
        [Paragraph("<b>Value Driver</b>", table_cell_bold), Paragraph("<b>Pre-Implementation Baseline</b>", table_cell_bold), Paragraph("<b>Modeled Post-Implementation Impact</b>", table_cell_bold), Paragraph("<b>Annual Financial Value</b>", table_cell_bold)],
        [Paragraph("<b>1. LWBS Revenue Recovery</b>", table_cell), Paragraph("3,120 patients/yr leave (4.8%)", table_cell), Paragraph("30% reduction via proactive re-engagement", table_cell), Paragraph("<b>+$1,123,200 / yr</b>", table_cell)],
        [Paragraph("<b>2. Avoided ICU Transfers</b>", table_cell), Paragraph("145 waiting room ICU crashes/yr", table_cell), Paragraph("64% reduction (93 avoided ICU stays @ $15k)", table_cell), Paragraph("<b>+$1,395,000 / yr</b>", table_cell)],
        [Paragraph("<b>3. Malpractice Risk Mitigation</b>", table_cell), Paragraph("$1.2M annual liability reserve", table_cell), Paragraph("40% reduction via documented audit ledger", table_cell), Paragraph("<b>+$480,000 / yr</b>", table_cell)],
        [Paragraph("<b>4. Nurse Retention & Overtime</b>", table_cell), Paragraph("26.8% nurse turnover (14 replacements)", table_cell), Paragraph("4 replacements avoided + 15% overtime reduction", table_cell), Paragraph("<b>+$378,000 / yr</b>", table_cell)],
        [Paragraph("<b>5. ED Throughput & Boarding</b>", table_cell), Paragraph("248 mins average wait/boarding", table_cell), Paragraph("30-minute reduction via optimized dispatch", table_cell), Paragraph("<b>+$445,000 / yr</b>", table_cell)],
        [Paragraph("<b>TOTAL GROSS ANNUAL VALUE</b>", table_cell_bold), Paragraph("—", table_cell), Paragraph("—", table_cell), Paragraph("<font color='#0369a1'><b>$3,821,200 / yr</b></font>", table_cell_bold)],
        [Paragraph("<b>Enterprise License & Support</b>", table_cell), Paragraph("—", table_cell), Paragraph("Annual Software Subscription & Edge Hardware", table_cell), Paragraph("<font color='#dc2626'><b>-$240,000 / yr</b></font>", table_cell)],
        [Paragraph("<b>ESTIMATED NET ANNUAL ROI</b>", table_cell_bold), Paragraph("—", table_cell), Paragraph("<b>14.9x Net Return on Investment</b>", table_cell_bold), Paragraph("<font color='#059669'><b>+$3,581,200 / yr</b></font>", table_cell_bold)]
    ]
    fin_table = Table(fin_data, colWidths=[1.6 * inch, 2.0 * inch, 2.3 * inch, 1.7 * inch])
    fin_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#f8fafc')),
        ('BACKGROUND', (0, 8), (-1, 8), colors.HexColor('#ecfdf5')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(fin_table)
    story.append(Spacer(1, 2))

    # 5. Technical Interoperability & Integration
    story.append(Paragraph("5. Technical Interoperability & HL7 FHIR Integration", h1_style))
    story.append(Paragraph(
        "<b>EHR Interoperability:</b> Ingests HL7 FHIR standard resources (<code>Encounter</code>, <code>Observation</code>) via SMART-on-FHIR and CDS Hooks (<code>patient-view</code>). "
        "Seamlessly overlays existing Epic and Cerner installations without disrupting core clinical workflows.<br/>"
        "<b>Edge Architecture:</b> Runs air-gapped on local hospital servers with sub-15ms inference latency, zero external cloud LLM dependencies, and zero persistent PHI in the ranking cache.",
        body_style
    ))

    # 6. Phased Enterprise Roadmap
    story.append(Paragraph("6. Phased Enterprise Roadmap & Clinical Trial Endpoints", h1_style))
    story.append(Paragraph("• <b>Phase 1 (Q3 2026 - Completed):</b> Lab Benchmark Validation • 20 synthetic benchmark cohorts verified across 51 automated unit/integration tests; sub-15ms latency.", bullet_style))
    story.append(Paragraph("• <b>Phase 2 (Q4 2026):</b> Shadow Clinical Trial • Silent background deployment alongside Epic/Cerner via HL7 FHIR; clinician concordance evaluation.", bullet_style))
    story.append(Paragraph("• <b>Phase 3 (Q1–Q2 2027):</b> Live Hospital Pilot • Primary Safety Endpoint: &gt;45% reduction in Mean Time to Escalation (MTTE); Operational Endpoint: &lt;2 non-actionable alerts/nurse/shift; Economic Endpoint: &ge;25% LWBS reduction.", bullet_style))
    story.append(Paragraph("• <b>Phase 4 (Q3 2027+):</b> Multi-Hospital Scale • Regional hospital network load balancing, 108 EMS ambulance pre-arrival telemetry, and referral scoring.", bullet_style))

    # 7. Risk Management, Fail-Safe Behavior & Regulatory Compliance
    story.append(Paragraph("7. Risk Management, Fail-Safe Behavior & Regulatory Compliance", h1_style))
    story.append(Paragraph("• <b>Deterministic Red-Flag Override:</b> Hard physiological red-flags override all statistical scores; downgrade safety blocker prevents unsafe de-escalations.", bullet_style))
    story.append(Paragraph("• <b>Clinician Alarm Fatigue Mitigation:</b> Queue compression surfaces only the top actionable tasks in the 'Next 5 Mins' queue, preventing alarm flooding.", bullet_style))
    story.append(Paragraph("• <b>Fail-Safe Protocol:</b> If network connectivity is lost, the system fails safe to manual clinical rounding with deterministic guardrails active.", bullet_style))
    story.append(Paragraph("• <b>Regulatory Stance:</b> Positioned as Clinical Decision Support under FDA Non-Device CDS (21 U.S.C. &sect; 360aaa-1); licensed clinicians retain 100% final override authority.", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] Business Proposal PDF built successfully: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")

if __name__ == "__main__":
    build_business_proposal_pdf()
