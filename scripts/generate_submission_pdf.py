"""
Publication-Grade PDF Generator for PatientTriage.ai
Generates PatientTriage_AI_Accenture_Submission_README.pdf (Exactly 2 Pages)
Accenture Innovation Challenge 2026 — Round 2 Technical Submission
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
            self.drawString(36, 11 * 72 - 24, "PatientTriage.ai — Technical Submission README")
            self.drawRightString(8.5 * 72 - 36, 11 * 72 - 24, "Accenture Innovation Challenge 2026")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(36, 11 * 72 - 28, 8.5 * 72 - 36, 11 * 72 - 28)

        # Footer (all pages)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 36, 18, page_text)
        self.drawString(36, 18, "Confidential — Prototype Submission Document • Evaluated across 20 Synthetic Test Scenarios • 51 Automated CI/CD Tests")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(36, 26, 8.5 * 72 - 36, 26)

        self.restoreState()

def build_readme_pdf():
    root_dir = os.path.dirname(os.path.dirname(__file__))
    pdf_path = os.path.join(root_dir, "PatientTriage_AI_Accenture_Submission_README.pdf")
    
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
        fontSize=16,
        leading=19,
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
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=5,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'CustomBody',
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.4,
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

    callout_style = ParagraphStyle(
        'CalloutText',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#0369a1'),
        spaceAfter=2
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
    story.append(Paragraph("PatientTriage.ai", title_style))
    story.append(Paragraph("“Triage is a snapshot. Risk isn't.”", tagline_style))
    story.append(Paragraph("AI Safety Copilot for the Emergency Waiting Room • Active Clinical Decision Support • Accenture Challenge 2026", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0284c7'), spaceAfter=4))

    # Meta Table
    meta_data = [
        [
            Paragraph("<b>COMPETITION TRACK</b><br/>Round 2 Technical Prototype", table_cell),
            Paragraph("<b>CORE STACK</b><br/>Python 3.13 / FastAPI / React 19", table_cell),
            Paragraph("<b>VERIFICATION</b><br/>51/51 Tests Passed (100%)", table_cell),
            Paragraph("<b>REPOSITORY</b><br/>github.com/freya1705/PatientTriageAI", table_cell)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[1.85 * inch, 1.85 * inch, 1.85 * inch, 2.05 * inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 2))

    # 1. Post-Triage Surveillance Gap
    story.append(Paragraph("1. The Post-Triage Clinical Surveillance Gap", h1_style))
    story.append(Paragraph(
        "Traditional emergency department triage operates as a static, one-time snapshot at the front door. However, ESI Level 3/4 patients wait 2.5 to 4.5 hours unmonitored before physician evaluation. "
        "During this critical gap, acute physiological decompensation (silent hypoxia, sepsis, shock) frequently goes undetected. "
        "<b>PatientTriage.ai</b> is an <b>AI Safety Copilot</b> that continuously surveils waiting patients to answer: "
        "<b>1. Who is becoming unsafe? • 2. Why are they deteriorating? • 3. Who should clinicians reassess first?</b>",
        body_style
    ))

    # 2. Three Hero Differentiators
    story.append(Paragraph("2. Three Core Architectural Differentiators", h1_style))
    story.append(Paragraph("• <b>1. Safe-to-Wait Dynamic Surveillance:</b> Tracks physiological trajectory velocity (&Delta;SpO₂, &Delta;HR) over time rather than freezing static intake numbers.", bullet_style))
    story.append(Paragraph("• <b>2. Uncertainty Guardrail (<i>Unknown ≠ Safe</i>):</b> Legacy systems treat missing vitals as benign. PatientTriage.ai applies an explicit uncertainty penalty (w_u = +15 to +25 pts), elevating unmonitored patients to force physical bedside verification.", bullet_style))
    story.append(Paragraph("• <b>3. Attention Gap Optimization:</b> Traditional queues sort by raw severity, letting attended bedded patients block waiting rooms. PatientTriage.ai discounts attended cases (w_c = -35 pts) to elevate unmonitored deteriorating patients to Rank #1.", bullet_style))

    # 3. Four Discrete Workflow States
    story.append(Paragraph("3. Four Discrete Operational Workflow States", h1_style))
    state_data = [
        [Paragraph("<b>Badge & State</b>", table_cell_bold), Paragraph("<b>Physiological Definition</b>", table_cell_bold), Paragraph("<b>Clinical Action & System Dispatch</b>", table_cell_bold)],
        [Paragraph("<font color='#059669'><b>🟢 CONTINUE</b></font>", table_cell), Paragraph("Vitals stable within baseline limits; observation shelf-life active.", table_cell), Paragraph("Safe to continue waiting; ongoing ambient telemetry surveillance.", table_cell)],
        [Paragraph("<font color='#d97706'><b>🟡 REASSESS</b></font>", table_cell), Paragraph("Observation shelf-life expired (stale data) or moderate drift (&Delta;HR &ge; +20 bpm).", table_cell), Paragraph("Dispatches nurse bedside check to refresh vitals and re-evaluate trajectory.", table_cell)],
        [Paragraph("<font color='#dc2626'><b>🔴 ESCALATE</b></font>", table_cell), Paragraph("Deterministic red-flag breach (SpO₂ &lt; 85%, SBP &lt; 75 mmHg) or rapid collapse.", table_cell), Paragraph("Immediate resuscitation bay allocation and physician/trauma notification.", table_cell)],
        [Paragraph("<font color='#475569'><b>⚪ UNCERTAIN</b></font>", table_cell), Paragraph("Incomplete vital telemetry, high sensor noise, or missing intake parameters.", table_cell), Paragraph("Forces human vital capture under <i>Unknown ≠ Safe</i> to prevent under-triage.", table_cell)]
    ]
    state_table = Table(state_data, colWidths=[1.3 * inch, 2.9 * inch, 3.4 * inch])
    state_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(state_table)
    story.append(Spacer(1, 2))

    # 4. 3-Tier System Architecture
    story.append(Paragraph("4. System Architecture & Technical Moat", h1_style))
    arch_data = [
        [Paragraph("<b>Tier</b>", table_cell_bold), Paragraph("<b>Core Responsibility & Algorithmic Scope</b>", table_cell_bold), Paragraph("<b>Module Implementation</b>", table_cell_bold)],
        [Paragraph("<b>Tier 1: Deterministic Guardrails</b>", table_cell), Paragraph("Hard clinical red-flags (SpO₂ &lt; 85%, SBP &lt; 75 mmHg, stroke signs) and downgrade safety blocking. Bypasses statistical layers to prevent catastrophic failure.", table_cell), Paragraph("<code>safety_guardrails.py</code><br/><code>downgrade_guard.py</code>", code_style)],
        [Paragraph("<b>Tier 2: Trajectory & Attention Engine</b>", table_cell), Paragraph("Continuous vital velocity calculation, confidence decay, uncertainty penalty calibration, and Attention Gap prioritization formula.", table_cell), Paragraph("<code>risk_engine.py</code><br/><code>attention_gap_engine.py</code>", code_style)],
        [Paragraph("<b>Tier 3: Multi-Surface Clinical Cockpit</b>", table_cell), Paragraph("Ranked Action Queue ('Next 5 Mins'), 1-click Bedside Reassessment, and tamper-evident append-only audit trail.", table_cell), Paragraph("<code>NurseWorklist.jsx</code><br/><code>ActionQueue.jsx</code>", code_style)],
    ]
    arch_table = Table(arch_data, colWidths=[1.6 * inch, 4.4 * inch, 1.6 * inch])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(arch_table)

    story.append(PageBreak())

    # ================= PAGE 2 =================
    # 5. Attention Gap Formula
    story.append(Paragraph("5. Attention Gap Formula & Plain-English Operational Logic", h1_style))
    story.append(Paragraph(
        "<b>Action Priority Score</b> = (w_r &times; Risk) + (w_d &times; Deterioration) + (w_s &times; Staleness) + Wait Hazard + (w_u &times; Uncertainty) &minus; (w_c &times; Clinical Coverage)",
        code_style
    ))
    story.append(Paragraph(
        "<b>Operational Translation:</b> The system does not ask only <i>'Who is most sick?'</i> It asks <i>'Who needs clinical attention most urgently right now, considering trajectory collapse, stale data, uncertainty, and whether a clinician is already at the bedside?'</i><br/>"
        "<b>Calibrations:</b> w_r = 1.0 (base risk) • w_d = +25 to +40 pts (&Delta;SpO₂ &le; -5%, &Delta;HR &ge; +20 bpm) • w_s = +20 to +35 pts (safety clock expiry) • w_u = +15 to +25 pts (missing vitals) • w_c = -35 pts (attended discounting).",
        body_style
    ))

    # 6. Competitive Moat vs Native EHRs
    story.append(Paragraph("6. Competitive Moat vs. Legacy EHR Scores (Epic EDI / Cerner MEWS)", h1_style))
    moat_data = [
        [Paragraph("<b>Evaluation Dimension</b>", table_cell_bold), Paragraph("<b>Legacy EHR Scores (Epic EDI / Cerner MEWS)</b>", table_cell_bold), Paragraph("<b>PatientTriage.ai AI Safety Copilot</b>", table_cell_bold)],
        [Paragraph("<b>Surveillance Domain</b>", table_cell), Paragraph("Admitted inpatient beds; static snapshot at intake.", table_cell), Paragraph("<b>Dedicated waiting-room surveillance layer.</b>", table_cell)],
        [Paragraph("<b>Missing Vitals Handling</b>", table_cell), Paragraph("Defaults to normal (creates false reassurance).", table_cell), Paragraph("<b><i>Unknown ≠ Safe</i>: increases uncertainty penalty.</b>", table_cell)],
        [Paragraph("<b>Clinical Coverage Factor</b>", table_cell), Paragraph("Ignores whether patient is attended or waiting alone.", table_cell), Paragraph("<b>Attention Gap discounts attended cases to surface waiting needs.</b>", table_cell)],
        [Paragraph("<b>Deterioration Detection</b>", table_cell), Paragraph("Threshold alarms only when vitals breach limits.", table_cell), Paragraph("<b>Tracks trajectory velocity (&Delta;Vitals/&Delta;t) before collapse.</b>", table_cell)],
    ]
    moat_table = Table(moat_data, colWidths=[1.5 * inch, 2.9 * inch, 3.2 * inch])
    moat_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(moat_table)
    story.append(Spacer(1, 2))

    # 7. Prototype Benchmark Evaluation
    story.append(Paragraph("7. Prototype Benchmark Evaluation (20 Synthetic Test Cohorts & 51 CI/CD Tests)", h1_style))
    story.append(Paragraph("<i>Note: Evaluated across 20 synthetic clinical scenarios in automated unit/integration testing to verify algorithmic logic and guardrails:</i>", body_style))
    
    bench_data = [
        [Paragraph("<b>Safety Dimension</b>", table_cell_bold), Paragraph("<b>Static Intake Triage</b>", table_cell_bold), Paragraph("<b>PatientTriage.ai Prototype</b>", table_cell_bold), Paragraph("<b>Algorithmic Impact</b>", table_cell_bold)],
        [Paragraph("Waiting Deterioration Catch Rate", table_cell), Paragraph("0 / 20 detected", table_cell), Paragraph("<b>20 / 20 detected (100%)</b>", table_cell), Paragraph("Surfaces hidden decompensation", table_cell)],
        [Paragraph("Stale Observation Flagging", table_cell), Paragraph("0 / 20 flagged", table_cell), Paragraph("<b>20 / 20 flagged (EXPIRED)</b>", table_cell), Paragraph("Zero unmonitored stale waits", table_cell)],
        [Paragraph("Missing Vitals Under-Triage", table_cell), Paragraph("High (assumed safe)", table_cell), Paragraph("<b>0% False Reassurance</b>", table_cell), Paragraph("Forces physical human recheck", table_cell)],
        [Paragraph("Attention Gap Priority Re-Rank", table_cell), Paragraph("None (attended block)", table_cell), Paragraph("<b>Active Queue Re-Ranking</b>", table_cell), Paragraph("Optimizes scarce nurse attention", table_cell)],
        [Paragraph("Unsafe Downgrade Prevention", table_cell), Paragraph("0 Guardrails", table_cell), Paragraph("<b>100% Guarded (Blocked)</b>", table_cell), Paragraph("Deterministic safety floor", table_cell)],
    ]
    bench_table = Table(bench_data, colWidths=[1.8 * inch, 1.6 * inch, 2.0 * inch, 2.2 * inch])
    bench_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(bench_table)
    story.append(Spacer(1, 2))

    # 8. Phased Clinical Implementation Roadmap
    story.append(Paragraph("8. Phased Clinical Implementation Roadmap & Trial Endpoints", h1_style))
    story.append(Paragraph("• <b>Phase 1 (Q3 2026 - Completed):</b> Lab Benchmark Validation • 20 synthetic cohorts verified across 51 automated pytest test cases; sub-15ms inference latency.", bullet_style))
    story.append(Paragraph("• <b>Phase 2 (Q4 2026):</b> Shadow Clinical Trial • Non-interventional background FHIR integration alongside Epic/Cerner to evaluate clinician concordance.", bullet_style))
    story.append(Paragraph("• <b>Phase 3 (Q1–Q2 2027):</b> Live Pilot • Target Endpoints (Requiring Clinical Validation): &gt;45% reduction in Mean Time to Escalation (MTTE); false alarm rate &lt; 2 alerts/nurse/shift; &ge;25% reduction in Left-Without-Being-Seen (LWBS).", bullet_style))
    story.append(Paragraph("• <b>Phase 4 (Q3 2027+):</b> Multi-Hospital Enterprise Scope • Regional load balancing, 108 EMS ambulance telemetry ingestion, and community referral diversion.", bullet_style))

    # 9. Quick Start & Regulatory / Fail-Safe Notice
    story.append(Paragraph("9. Quick Start & Regulatory / Fail-Safe Architecture", h1_style))
    story.append(Paragraph("<code># Execution: .\\start.ps1 | Test Suite: python -m pytest -v (51 Passed) | UI Cockpit: http://localhost:5173</code>", code_style))
    story.append(Paragraph(
        "<b>Regulatory Classification:</b> PatientTriage.ai is an active clinical decision-support research prototype developed for the Accenture Innovation Challenge 2026. "
        "Positioned under FDA Non-Device CDS guidance (21 U.S.C. &sect; 360aaa-1); licensed clinicians retain 100% decision authority. "
        "<b>Fail-Safe Protocol:</b> If network connection drops, the system defaults safe and prompts manual rounding with deterministic safety guardrails active.",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] README PDF built successfully: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")

if __name__ == "__main__":
    build_readme_pdf()
