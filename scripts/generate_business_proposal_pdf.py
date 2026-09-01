"""
Publication-Grade Business Proposal PDF Generator for PatientTriage.ai
Generates PatientTriage_AI_Business_Proposal.pdf (Exactly 2 Pages)
Accenture Innovation Challenge 2026 — Round 2 Business Case
Clean, executive layout following Document 2 specifications
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
            self.drawString(36, 11 * 72 - 24, "PatientTriage.ai — Business Proposal & Enterprise Strategy")
            self.drawRightString(8.5 * 72 - 36, 11 * 72 - 24, "Accenture Innovation Challenge 2026")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(36, 11 * 72 - 28, 8.5 * 72 - 36, 11 * 72 - 28)

        # Footer (all pages)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 36, 18, page_text)
        self.drawString(36, 18, "Confidential — Executive Business Proposal • Modeled 500-Bed Hospital ED Impact • PatientTriage.ai")
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

    core_idea_style = ParagraphStyle(
        'CoreIdea',
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
    story.append(Paragraph("PatientTriage.ai: Business Proposal & Enterprise Strategy", title_style))
    story.append(Paragraph("“Closing the Emergency Waiting-Room Surveillance Gap”", tagline_style))
    story.append(Paragraph("<b>Our Idea: PatientTriage.ai helps Emergency Department staff notice which waiting patients may be getting worse and need attention first.</b>", core_idea_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0284c7'), spaceAfter=4))

    # Meta Table (ROI Highlights)
    roi_meta_data = [
        [
            Paragraph("<b>Gross Annual Value</b><br/><font color='#0369a1'><b>$3.82M / yr</b></font>", table_cell),
            Paragraph("<b>Net Annual ROI</b><br/><font color='#059669'><b>$3.58M / yr (14.9x)</b></font>", table_cell),
            Paragraph("<b>LWBS Recovery</b><br/><font color='#0f172a'><b>+$1.12M / yr (30% drop)</b></font>", table_cell),
            Paragraph("<b>Target Market</b><br/><font color='#0f172a'><b>5,500+ US/EU EDs</b></font>", table_cell)
        ]
    ]
    roi_meta_table = Table(roi_meta_data, colWidths=[1.85 * inch, 1.85 * inch, 1.85 * inch, 2.05 * inch])
    roi_meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(roi_meta_table)
    story.append(Spacer(1, 2))

    # 1. The Business Problem
    story.append(Paragraph("1. The Business Problem", h1_style))
    story.append(Paragraph(
        "Emergency Departments are extremely busy. Triage helps doctors and nurses understand a patient's condition when they arrive, but triage is only a snapshot. "
        "A patient may then wait for 2.5–4.5 hours unmonitored. During that period, condition can change, vital signs can become abnormal, data can become old, or a monitor can disconnect. "
        "Staff may not immediately notice the change, creating a dangerous surveillance gap between triage and treatment. <b>PatientTriage.ai is designed to help hospitals manage this gap.</b>",
        body_style
    ))

    # 2. Our Solution
    story.append(Paragraph("2. Our Solution: Extra Safety Layer for the Waiting Room", h1_style))
    story.append(Paragraph(
        "PatientTriage.ai continuously looks at available patient information and answers three simple questions:<br/>"
        "• <b>1. Is the patient getting worse?</b> Checks changes in vital signs over time (&Delta;SpO₂, &Delta;HR).<br/>"
        "• <b>2. Is the information still reliable?</b> Checks how old the latest observations are (shelf-life expiration).<br/>"
        "• <b>3. Do we know enough about the patient?</b> If important information is missing, it asks staff to physically verify the patient (<i>Unknown &ne; Safe</i>).<br/>"
        "Then it creates a simple focused list: <b>Who needs attention first?</b>",
        body_style
    ))

    # 3. Simple User Flow Diagram
    story.append(Paragraph("3. Simple User Flow & Decision Architecture", h1_style))
    story.append(Paragraph(
        "<code>Patient Arrives ──► Intake Triage ──► Waiting Lounge ──► Continuous Check ──► 4 States (🟢/🟡/🔴/⚪) ──► Priority Queue ──► Clinician Decides</code>",
        code_style
    ))
    story.append(Paragraph("<i>The system supports the clinician. It does not replace the clinician. Medical professionals retain 100% decision authority.</i>", body_style))

    # 4. Value for Hospital Staff
    story.append(Paragraph("4. Value for Hospital Staff & Leadership", h1_style))
    stake_data = [
        [Paragraph("<b>Role</b>", table_cell_bold), Paragraph("<b>Current Problem</b>", table_cell_bold), Paragraph("<b>PatientTriage.ai Value Delivery</b>", table_cell_bold)],
        [Paragraph("<b>Triage Nurses (RNs)</b>", table_cell), Paragraph("Overwhelmed tracking 40+ waiting patients; alarm fatigue.", table_cell), Paragraph("Focused 'Next 5 Minutes' queue highlights patients needing immediate attention.", table_cell)],
        [Paragraph("<b>Emergency Doctors</b>", table_cell), Paragraph("Blind to which waiting patients deteriorated since intake.", table_cell), Paragraph("Instant visibility into who has deteriorated, needs reassessment, or has warning signs.", table_cell)],
        [Paragraph("<b>Hospital Leadership</b>", table_cell), Paragraph("Delayed diagnosis risks, sentinel waiting lounge events.", table_cell), Paragraph("Better waiting-room visibility, fewer missed deteriorations, better clinical audit trail.", table_cell)],
        [Paragraph("<b>Finance Teams</b>", table_cell), Paragraph("LWBS walkout revenue losses, uncompensated ICU transfers.", table_cell), Paragraph("Captures modeled $3.58M net annual value from recovered walkouts & fewer ICU crashes.", table_cell)],
    ]
    stake_table = Table(stake_data, colWidths=[1.4 * inch, 2.9 * inch, 3.3 * inch])
    stake_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 1.8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.8),
    ]))
    story.append(stake_table)

    story.append(PageBreak())

    # ================= PAGE 2 =================
    # 5. Financial ROI & Impact Model
    story.append(Paragraph("5. Business Impact & Value Breakdown (Modeled 500-Bed Facility)", h1_style))
    story.append(Paragraph(
        "<i>Model based on 65,000 annual ED visits, 500 beds, and $1,200 average baseline ED revenue per visit (projections from business model, not actual hospital results):</i>",
        body_style
    ))

    fin_data = [
        [Paragraph("<b>Area of Value</b>", table_cell_bold), Paragraph("<b>Expected Operational Impact</b>", table_cell_bold), Paragraph("<b>Modeled Annual Value</b>", table_cell_bold)],
        [Paragraph("<b>1. Fewer patients leaving without being seen (LWBS)</b>", table_cell), Paragraph("30% reduction via proactive re-engagement", table_cell), Paragraph("<b>$1,123,200 / yr</b>", table_cell)],
        [Paragraph("<b>2. Fewer waiting-room ICU escalations</b>", table_cell), Paragraph("93 avoided stays (@ $15k per stay)", table_cell), Paragraph("<b>$1,395,000 / yr</b>", table_cell)],
        [Paragraph("<b>3. Lower malpractice liability risk</b>", table_cell), Paragraph("40% reduction via deterministic audit logs", table_cell), Paragraph("<b>$480,000 / yr</b>", table_cell)],
        [Paragraph("<b>4. Staff retention & overtime savings</b>", table_cell), Paragraph("Lower nurse turnover + 15% overtime reduction", table_cell), Paragraph("<b>$378,000 / yr</b>", table_cell)],
        [Paragraph("<b>5. Better ED throughput & boarding</b>", table_cell), Paragraph("30-minute improvement via optimized dispatch", table_cell), Paragraph("<b>$445,000 / yr</b>", table_cell)],
        [Paragraph("<b>Total Gross Annual Value</b>", table_cell_bold), Paragraph("—", table_cell), Paragraph("<font color='#0369a1'><b>$3,821,200 / yr</b></font>", table_cell_bold)],
        [Paragraph("<b>Modeled Software & Hardware Subscription</b>", table_cell), Paragraph("Enterprise annual software license + support", table_cell), Paragraph("<font color='#dc2626'><b>-$240,000 / yr</b></font>", table_cell)],
        [Paragraph("<b>Net Estimated Annual Value (14.9x ROI)</b>", table_cell_bold), Paragraph("<b>Net Return on Investment</b>", table_cell_bold), Paragraph("<font color='#059669'><b>+$3,581,200 / yr</b></font>", table_cell_bold)]
    ]
    fin_table = Table(fin_data, colWidths=[2.8 * inch, 2.8 * inch, 2.0 * inch])
    fin_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#f8fafc')),
        ('BACKGROUND', (0, 8), (-1, 8), colors.HexColor('#ecfdf5')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 1.8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.8),
    ]))
    story.append(fin_table)
    story.append(Spacer(1, 2))

    # 6. Integration, Safety & Failure Handling
    story.append(Paragraph("6. Hospital Integration, Safety Rules & Fail-Safe Design", h1_style))
    story.append(Paragraph("• <b>HL7 FHIR Integration:</b> Works alongside existing Electronic Health Record (EHR) systems using standard data such as Patient Encounters and Vital Observations. Local edge processing avoids cloud AI latency.", bullet_style))
    story.append(Paragraph("• <b>Safety & Fixed Thresholds:</b> Serious conditions (SpO₂ &lt; 85%, SBP &lt; 75 mmHg) directly trigger an escalation without being masked by a statistical score.", bullet_style))
    story.append(Paragraph("• <b>Fail-Safe Behavior:</b> If network connectivity or telemetry fails, the system prompts staff to perform manual checks while local safety alerts remain active.", bullet_style))

    # 7. Target Market & Phased Implementation
    story.append(Paragraph("7. Target Market & Implementation Roadmap", h1_style))
    story.append(Paragraph("• <b>Target Market:</b> 5,500+ Emergency Departments across US & Europe with high patient volumes and long wait times.", bullet_style))
    story.append(Paragraph("• <b>Stage 1 — Prototype (Completed - Q3 2026):</b> Built and tested with 51 automated tests passing.", bullet_style))
    story.append(Paragraph("• <b>Stage 2 — Shadow Deployment (Q4 2026):</b> Run alongside existing hospital processes to compare recommendations with clinician decisions.", bullet_style))
    story.append(Paragraph("• <b>Stage 3 — Pilot (Q1–Q2 2027):</b> Deploy in ED setting to measure time to escalation, wait times, LWBS, and alert usefulness.", bullet_style))
    story.append(Paragraph("• <b>Stage 4 — Scale (Q3 2027+):</b> Expand to more hospitals, ambulance telemetry, and regional patient flow coordination.", bullet_style))

    # 8. Closing
    story.append(Spacer(1, 1))
    story.append(Paragraph(
        "<b>Final Proposition:</b> PatientTriage.ai is not another triage system. It is a waiting-room monitoring and prioritization layer that works after triage and before treatment, answering: <i>“Who has changed, and who needs attention now?”</i><br/>"
        "<b>Because a patient being stable at 2:00 PM does not mean they will still be stable at 4:00 PM. Triage is a snapshot. Risk isn't.</b>",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] Business Proposal PDF built successfully: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")

if __name__ == "__main__":
    build_business_proposal_pdf()
