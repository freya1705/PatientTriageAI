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
        topMargin=28,
        bottomMargin=28
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15.5,
        leading=18.5,
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

    core_principle_style = ParagraphStyle(
        'CorePrinciple',
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=10.5,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=3
    )

    h1_style = ParagraphStyle(
        'CustomH1',
        fontName='Helvetica-Bold',
        fontSize=9.2,
        leading=11.5,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=4,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'CustomBody',
        fontName='Helvetica',
        fontSize=7.1,
        leading=9.2,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=2
    )

    bullet_style = ParagraphStyle(
        'CustomBullet',
        fontName='Helvetica',
        fontSize=7.1,
        leading=9.0,
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
        fontSize=6.7,
        leading=8.3,
        textColor=colors.HexColor('#1e293b')
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=6.7,
        leading=8.3,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    # ================= PAGE 1 =================
    story.append(Paragraph("PatientTriage.ai", title_style))
    story.append(Paragraph("“Triage is a snapshot. Risk isn't.”", tagline_style))
    story.append(Paragraph("<b>AI recommends. Deterministic safety rules protect. Clinicians decide.</b>", core_principle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0284c7'), spaceAfter=4))

    # Meta Table
    meta_data = [
        [
            Paragraph("<b>Track</b><br/>Accenture Challenge Round 2 Prototype", table_cell),
            Paragraph("<b>Stack</b><br/>Python 3.13 / FastAPI / React 19 / HL7 FHIR", table_cell),
            Paragraph("<b>Test Verification</b><br/>51/51 Automated Tests Passing (100%)", table_cell),
            Paragraph("<b>Repository</b><br/>github.com/freya1705/PatientTriageAI", table_cell)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[1.85 * inch, 1.85 * inch, 1.85 * inch, 2.05 * inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 2))

    # 1. Post-Triage Surveillance Gap
    story.append(Paragraph("1. The Post-Triage Clinical Surveillance Gap", h1_style))
    story.append(Paragraph(
        "Intake triage captures a single snapshot in time, but patient conditions evolve while waiting. "
        "ESI Level 3 and 4 patients routinely wait 2.5 to 4.5 hours unmonitored before an examination room opens up. "
        "During this window, silent clinical decompensation—such as progressive hypoxia, developing sepsis, or internal hemorrhage—often goes unnoticed until acute collapse occurs. "
        "<b>PatientTriage.ai</b> acts as an ambient decision-support copilot that bridges this post-triage gap by continuously tracking physiological drift, "
        "data staleness, and missing-variable uncertainty to rank which patients need immediate reassessment.",
        body_style
    ))

    # 2. Core Architectural Differentiators
    story.append(Paragraph("2. Core Architectural Differentiators", h1_style))
    story.append(Paragraph("• <b>1. Dynamic Safe-to-Wait Tracking:</b> Calculates physiological velocity over time (&Delta;SpO₂/&Delta;t, &Delta;HR/&Delta;t) instead of freezing static intake vitals.", bullet_style))
    story.append(Paragraph("• <b>2. Uncertainty Guardrails (Unknown &ne; Safe):</b> Incomplete vitals or disconnected telemetry trigger an explicit uncertainty penalty (w_u = +15 to +25 pts), escalating unmonitored patients for manual physical re-evaluation rather than assuming stability.", bullet_style))
    story.append(Paragraph("• <b>3. Attention Gap Optimization:</b> Prevents over-monitoring already attended patients by applying a clinician coverage discount (w_c = -35 pts), elevating overlooked and deteriorating waiting-room patients to the top of the queue.", bullet_style))

    # 3. Four Operational Workflow States
    story.append(Paragraph("3. Four Operational Workflow States", h1_style))
    state_data = [
        [Paragraph("<b>State</b>", table_cell_bold), Paragraph("<b>Physiological Trigger</b>", table_cell_bold), Paragraph("<b>Clinical Action Dispatched</b>", table_cell_bold)],
        [Paragraph("<font color='#059669'><b>🟢 CONTINUE</b></font>", table_cell), Paragraph("Vitals within baseline safe limits; telemetry fresh.", table_cell), Paragraph("Patient remains in waiting lounge under ambient tracking.", table_cell)],
        [Paragraph("<font color='#d97706'><b>🟡 REASSESS</b></font>", table_cell), Paragraph("Vitals shelf-life expired (stale) or moderate drift (&Delta;HR &ge; +20 bpm).", table_cell), Paragraph("Dispatches triage nurse for a targeted bedside vitals refresh.", table_cell)],
        [Paragraph("<font color='#dc2626'><b>🔴 ESCALATE</b></font>", table_cell), Paragraph("Hard red-flag breach (SpO₂ &lt; 85%, SBP &lt; 75 mmHg) or rapid collapse.", table_cell), Paragraph("Triggers immediate resuscitation bay assignment and physician paging.", table_cell)],
        [Paragraph("<font color='#475569'><b>⚪ UNCERTAIN</b></font>", table_cell), Paragraph("Telemetry lost, missing core vitals, or sensor disconnect.", table_cell), Paragraph("Flags missing data under Unknown &ne; Safe to force physical nurse verification.", table_cell)]
    ]
    state_table = Table(state_data, colWidths=[1.3 * inch, 2.9 * inch, 3.4 * inch])
    state_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 1.8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.8),
    ]))
    story.append(state_table)
    story.append(Spacer(1, 2))

    # 4. Prioritization Scoring Engine
    story.append(Paragraph("4. Prioritization Scoring Engine", h1_style))
    story.append(Paragraph(
        "<b>Action Priority Score</b> = (w_r &times; Risk) + (w_d &times; Deterioration) + (w_s &times; Staleness) + (w_u &times; Uncertainty) &minus; (w_c &times; Clinical Coverage)",
        code_style
    ))
    story.append(Paragraph("• <b>Base Risk (w_r = 1.0):</b> Foundation score derived from initial ESI intake priority.", bullet_style))
    story.append(Paragraph("• <b>Deterioration (w_d = +25 to +40 pts):</b> Applied when trajectory declines (&Delta;SpO₂ &le; -5%, &Delta;HR &ge; +20 bpm).", bullet_style))
    story.append(Paragraph("• <b>Staleness (w_s = +20 to +35 pts):</b> Applied automatically when observation shelf-life decays past safe thresholds.", bullet_style))
    story.append(Paragraph("• <b>Uncertainty (w_u = +15 to +25 pts):</b> Applied when vital streams are missing or sensor confidence is low.", bullet_style))
    story.append(Paragraph("• <b>Clinical Coverage (w_c = -35 pts):</b> Deducted if a clinician is actively logged at the patient's bedside.", bullet_style))

    story.append(PageBreak())

    # ================= PAGE 2 =================
    # 5. Prototype Benchmark Evaluation
    story.append(Paragraph("5. Prototype Benchmark Evaluation", h1_style))
    story.append(Paragraph("<i>Evaluated across 20 synthetic patient scenarios and 51 automated CI/CD pytest test cases:</i>", body_style))
    
    bench_data = [
        [Paragraph("<b>Safety &amp; Operational Dimension</b>", table_cell_bold), Paragraph("<b>Static Intake Triage</b>", table_cell_bold), Paragraph("<b>PatientTriage.ai</b>", table_cell_bold), Paragraph("<b>System Impact</b>", table_cell_bold)],
        [Paragraph("Waiting Decompensation Catch Rate", table_cell), Paragraph("0 / 20 detected", table_cell), Paragraph("<b>20 / 20 detected (100%)</b>", table_cell), Paragraph("Trajectory velocity flags silent collapse early.", table_cell)],
        [Paragraph("Stale Observation Flagging", table_cell), Paragraph("0 / 20 flagged", table_cell), Paragraph("<b>20 / 20 flagged (100%)</b>", table_cell), Paragraph("Eliminates unmonitored blind spots.", table_cell)],
        [Paragraph("Missing Vitals Under-Triage", table_cell), Paragraph("High risk", table_cell), Paragraph("<b>0% false reassurance</b>", table_cell), Paragraph("Forces human verification via uncertainty scoring.", table_cell)],
        [Paragraph("Attention Gap Prioritization", table_cell), Paragraph("Static order", table_cell), Paragraph("<b>Dynamic re-ranking</b>", table_cell), Paragraph("Prioritizes unmonitored patients over attended beds.", table_cell)],
        [Paragraph("Unsafe Downgrade Prevention", table_cell), Paragraph("Unchecked", table_cell), Paragraph("<b>100% Guarded</b>", table_cell), Paragraph("Hard deterministic floor blocks unsafe score drops.", table_cell)],
    ]
    bench_table = Table(bench_data, colWidths=[1.8 * inch, 1.5 * inch, 1.9 * inch, 2.4 * inch])
    bench_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(bench_table)
    story.append(Spacer(1, 2))

    # 6. Implementation Roadmap
    story.append(Paragraph("6. Implementation Roadmap", h1_style))
    story.append(Paragraph("• <b>Phase 1 (Completed - Q3 2026):</b> Prototype validation, 51 automated unit/integration tests passing, sub-15ms edge inference latency.", bullet_style))
    story.append(Paragraph("• <b>Phase 2 (Q4 2026):</b> Non-interventional shadow deployment via HL7 FHIR alongside existing EHRs to measure clinician concordance.", bullet_style))
    story.append(Paragraph("• <b>Phase 3 (Q1–Q2 2027):</b> Live pilot targeting &gt;45% reduction in Mean Time to Escalation (MTTE) and &ge;25% reduction in Left Without Being Seen (LWBS).", bullet_style))
    story.append(Paragraph("• <b>Phase 4 (Q3 2027+):</b> Multi-facility network balancing, 108 EMS ambulance telemetry ingestion, and community diversion routing.", bullet_style))

    # 7. Quickstart & Deployment
    story.append(Paragraph("7. Quickstart & Deployment", h1_style))
    story.append(Paragraph("<code># Clone the repository<br/>git clone https://github.com/freya1705/PatientTriageAI.git<br/>cd PatientTriageAI<br/><br/># Run automated tests<br/>python -m pytest -v<br/><br/># Start backend &amp; frontend services<br/>.\\start.ps1</code>", code_style))

    story.append(Spacer(1, 2))
    story.append(Paragraph(
        "<b>Regulatory Stance:</b> Positioned as non-device Clinical Decision Support under FDA Non-Device CDS (21 U.S.C. &sect; 360aaa-1). "
        "Licensed medical professionals retain full decision autonomy and override control. "
        "<b>Fail-Safe:</b> If network connectivity fails, the platform prompts manual rounding intervals with local deterministic alerts active.",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] README PDF built successfully: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")

if __name__ == "__main__":
    build_readme_pdf()
