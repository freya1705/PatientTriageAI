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
        topMargin=26,
        bottomMargin=26
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
        fontSize=9.0,
        leading=11.2,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=4,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'CustomBody',
        fontName='Helvetica',
        fontSize=7.1,
        leading=9.1,
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
    story.append(Paragraph("“Triage is a snapshot. Risk isn't.” — Closing the Gap Between Triage and Treatment", tagline_style))
    story.append(Paragraph("<b>AI recommends. Safety rules protect. Clinicians decide.</b>", core_principle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0284c7'), spaceAfter=4))

    # Meta Table
    meta_data = [
        [
            Paragraph("<b>Challenge</b><br/>Accenture Challenge Round 2 Prototype", table_cell),
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

    # 1. The Problem
    story.append(Paragraph("1. The Problem: What Happens After Triage?", h1_style))
    story.append(Paragraph(
        "When a patient enters the Emergency Department, nurses perform an initial triage assessment. This gives the hospital a snapshot of the patient's condition at that moment. "
        "But patients may then spend hours waiting for a bed or doctor. For example, an ESI Level 3 or 4 patient may wait around 2.5–4.5 hours. "
        "During this time, the patient's condition can change (low oxygen, increasing heart rate, sepsis, internal bleeding). "
        "The problem is that someone may not notice quickly enough that condition has changed. <b>PatientTriage.ai is designed to help close this gap.</b>",
        body_style
    ))

    # 2. How PatientTriage.ai Works
    story.append(Paragraph("2. How PatientTriage.ai Works", h1_style))
    story.append(Paragraph("• <b>1. Patient Risk:</b> How serious was the patient's condition during the original triage?", bullet_style))
    story.append(Paragraph("• <b>2. Patient Deterioration:</b> Are vital signs getting worse? The system tracks change over time (&Delta;SpO₂ falling, &Delta;HR increasing).", bullet_style))
    story.append(Paragraph("• <b>3. Data Freshness:</b> How recently were vital signs checked? Old information is flagged so it is not treated as fresh.", bullet_style))
    story.append(Paragraph("• <b>4. Missing Information (<i>Unknown does not mean safe</i>):</b> If data is missing or a monitor disconnects, the system does not assume stability. It marks the patient as uncertain and requests a physical check.", bullet_style))

    # 3. Four Patient Statuses
    story.append(Paragraph("3. Four Patient Statuses", h1_style))
    state_data = [
        [Paragraph("<b>Status</b>", table_cell_bold), Paragraph("<b>What it means</b>", table_cell_bold), Paragraph("<b>What the nurse does</b>", table_cell_bold)],
        [Paragraph("<font color='#059669'><b>🟢 CONTINUE</b></font>", table_cell), Paragraph("Patient is stable and data is recent.", table_cell), Paragraph("Continue monitoring in waiting lounge.", table_cell)],
        [Paragraph("<font color='#d97706'><b>🟡 REASSESS</b></font>", table_cell), Paragraph("Vitals are getting old or showing moderate change (&Delta;HR &ge; +20 bpm).", table_cell), Paragraph("Check the patient again (targeted bedside refresh).", table_cell)],
        [Paragraph("<font color='#dc2626'><b>🔴 ESCALATE</b></font>", table_cell), Paragraph("Serious warning sign (SpO₂ &lt; 85%, SBP &lt; 75 mmHg) or rapid collapse.", table_cell), Paragraph("Immediately involve doctor / resuscitation team.", table_cell)],
        [Paragraph("<font color='#475569'><b>⚪ UNCERTAIN</b></font>", table_cell), Paragraph("Important data is missing or monitoring is disconnected.", table_cell), Paragraph("Physically verify the patient (Unknown &ne; Safe).", table_cell)]
    ]
    state_table = Table(state_data, colWidths=[1.3 * inch, 3.0 * inch, 3.3 * inch])
    state_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 1.8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.8),
    ]))
    story.append(state_table)
    story.append(Spacer(1, 2))

    # 4. Patient Priority Score
    story.append(Paragraph("4. Patient Priority Score & Operational Logic", h1_style))
    story.append(Paragraph(
        "<b>Priority Score</b> = Risk + Deterioration + Old Data + Missing Data &minus; Current Clinical Attention",
        code_style
    ))
    story.append(Paragraph(
        "<b>In simple terms:</b> Higher original risk &rarr; higher priority • Patient getting worse &rarr; higher priority • Old vital signs &rarr; higher priority • Missing info &rarr; higher priority • Already attended by clinician &rarr; lower waiting-room priority.<br/>"
        "<b>Ranges:</b> Base Risk (ESI w_r = 1.0) • Deterioration (+25 to +40) • Staleness (+20 to +35) • Uncertainty (+15 to +25) • Clinical Coverage (&minus;35 when attended).<br/>"
        "<i>Why this matters: A normal list keeps static order. PatientTriage.ai moves deteriorating patients higher in the queue as needs change.</i>",
        body_style
    ))

    story.append(PageBreak())

    # ================= PAGE 2 =================
    # 5. Main Dashboard & Nurse Workflow
    story.append(Paragraph("5. Main Dashboard & Focused Action Queue", h1_style))
    story.append(Paragraph(
        "The prototype is designed around a simple nurse workflow showing patient name/ID, current status, latest vitals, trajectory change, data age, missing data, priority rank, and recommended action. "
        "The nurse can instantly answer: <b>“Who do I need to check right now?”</b> without manually scanning a 40-patient list.",
        body_style
    ))

    # 6. What Makes PatientTriage.ai Different?
    story.append(Paragraph("6. What Makes PatientTriage.ai Different?", h1_style))
    story.append(Paragraph("• <b>1. It looks at change, not just the latest number:</b> Rapid heart rate spikes or oxygen desaturation trends matter before critical collapse.", bullet_style))
    story.append(Paragraph("• <b>2. Missing data is treated as a warning:</b> Unmonitored or disconnected patients trigger an UNCERTAIN state and a request for physical verification.", bullet_style))
    story.append(Paragraph("• <b>3. It focuses on patients who may be overlooked:</b> Clinician coverage discounting surfaces unattended waiting patients to the top.", bullet_style))

    # 7. Safety First & Fail-Safe Operation
    story.append(Paragraph("7. Safety First: Deterministic Rules & Fail-Safe Architecture", h1_style))
    story.append(Paragraph("• <b>Decision Support Only:</b> PatientTriage.ai does not replace clinicians; licensed medical professionals retain 100% decision authority.", bullet_style))
    story.append(Paragraph("• <b>Fixed Safety Thresholds:</b> Critical conditions (SpO₂ &lt; 85%, SBP &lt; 75 mmHg) directly trigger an escalation without being masked by an AI score.", bullet_style))
    story.append(Paragraph("• <b>Fail-Safe Behavior:</b> If network connectivity or telemetry fails, the system prompts manual rounding while local alerts remain active.", bullet_style))

    # 8. Prototype Testing
    story.append(Paragraph("8. Prototype Testing (20 Synthetic Scenarios & 51 CI/CD Tests)", h1_style))
    story.append(Paragraph("<i>Tested using 20 synthetic patient scenarios and 51 automated backend pytest tests (100% pass rate):</i>", body_style))
    
    test_data = [
        [Paragraph("<b>Test Area</b>", table_cell_bold), Paragraph("<b>Prototype Result</b>", table_cell_bold), Paragraph("<b>Verification Summary</b>", table_cell_bold)],
        [Paragraph("Waiting-room deterioration detection", table_cell), Paragraph("<b>20 / 20 detected</b>", table_cell), Paragraph("Trajectory velocity flags silent collapse early.", table_cell)],
        [Paragraph("Old / stale observation detection", table_cell), Paragraph("<b>20 / 20 detected</b>", table_cell), Paragraph("Eliminates unmonitored blind spots.", table_cell)],
        [Paragraph("Missing vital protection", table_cell), Paragraph("<b>No false reassurance</b>", table_cell), Paragraph("Forces human verification via uncertainty scoring.", table_cell)],
        [Paragraph("Patient prioritization", table_cell), Paragraph("<b>Dynamic Re-Ranking</b>", table_cell), Paragraph("Prioritizes unmonitored patients over attended beds.", table_cell)],
        [Paragraph("Unsafe priority downgrade", table_cell), Paragraph("<b>100% Protected</b>", table_cell), Paragraph("Hard deterministic floor blocks unsafe score drops.", table_cell)],
    ]
    test_table = Table(test_data, colWidths=[2.3 * inch, 1.8 * inch, 3.5 * inch])
    test_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 1.8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.8),
    ]))
    story.append(test_table)
    story.append(Spacer(1, 1))
    story.append(Paragraph("<i>Important note: These are synthetic prototype test results, not results from a real hospital deployment. The next step is real-world clinical validation.</i>", body_style))

    # 9. Technology Stack & Edge Architecture
    story.append(Paragraph("9. Technology Stack & Edge Processing", h1_style))
    story.append(Paragraph("• <b>Frontend:</b> React 19 for the nurse-facing clinical cockpit • <b>Backend:</b> Python 3.13 + FastAPI for patient monitoring & prioritization logic.", bullet_style))
    story.append(Paragraph("• <b>Integration & Processing:</b> HL7 FHIR standard resources (<code>Encounter</code>, <code>Observation</code>); air-gapped on-premise edge processing with sub-15ms inference.", bullet_style))

    # 10. Future Roadmap
    story.append(Paragraph("10. Future Roadmap", h1_style))
    story.append(Paragraph("• <b>Phase 1 (Completed - Q3 2026):</b> Prototype developed, safety rules implemented, 51 automated tests passed.", bullet_style))
    story.append(Paragraph("• <b>Phase 2 (Q4 2026):</b> Hospital shadow testing alongside existing EHRs without making clinical decisions to compare recommendations.", bullet_style))
    story.append(Paragraph("• <b>Phase 3 (Q1–Q2 2027):</b> Live ED pilot targeting &gt;45% reduction in Mean Time to Escalation and &ge;25% reduction in Left Without Being Seen.", bullet_style))
    story.append(Paragraph("• <b>Phase 4 (Q3 2027+):</b> Multi-hospital expansion, ambulance telemetry, and community diversion support.", bullet_style))

    # 11. Quick Start
    story.append(Paragraph("11. Quick Start & Execution", h1_style))
    story.append(Paragraph("<code>git clone https://github.com/freya1705/PatientTriageAI.git && cd PatientTriageAI && python -m pytest -v && .\\start.ps1</code>", code_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] README PDF built successfully: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")

if __name__ == "__main__":
    build_readme_pdf()
