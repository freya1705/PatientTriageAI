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
            self.drawString(36, 11 * 72 - 24, "PatientTriage.ai — Business Proposal & Enterprise Strategy")
            self.drawRightString(8.5 * 72 - 36, 11 * 72 - 24, "Accenture Innovation Challenge 2026")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(36, 11 * 72 - 28, 8.5 * 72 - 36, 11 * 72 - 28)

        # Footer (all pages)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 36, 18, page_text)
        self.drawString(36, 18, "Confidential — Executive Business Proposal • Modeled 500-Bed Hospital Impact • PatientTriage.ai")
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
        topMargin=28,
        bottomMargin=28
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
        fontSize=7.8,
        leading=10,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=4
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
    story.append(Paragraph("Accenture Innovation Challenge 2026 | Modeled 500-Bed Hospital ED Impact", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0284c7'), spaceAfter=4))

    # Meta Table (ROI Highlights)
    roi_meta_data = [
        [
            Paragraph("<b>Gross Annual Value</b><br/><font color='#0369a1'><b>$3.82M / yr</b></font>", table_cell),
            Paragraph("<b>Net Annual ROI</b><br/><font color='#059669'><b>$3.58M / yr (14.9x)</b></font>", table_cell),
            Paragraph("<b>LWBS Revenue Recovery</b><br/><font color='#0f172a'><b>+$1.12M / yr (30% drop)</b></font>", table_cell),
            Paragraph("<b>Target ED Market</b><br/><font color='#0f172a'><b>5,500+ US/EU EDs</b></font>", table_cell)
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

    # 1. Executive Summary
    story.append(Paragraph("1. Executive Summary", h1_style))
    story.append(Paragraph(
        "Emergency departments face a critical surveillance blind spot: triage assesses risk at entry, but patients wait 2.5 to 4.5 hours unmonitored in the lounge. "
        "With nationwide nurse turnover at 26.8% and high patient volumes, silent decompensations (sepsis, hypoxia, internal hemorrhage) routinely go undetected until acute collapse. "
        "<b>PatientTriage.ai</b> is an ambient decision-support copilot designed specifically for the waiting room. "
        "By combining continuous vital trajectory tracking, observation shelf-life decay, uncertainty scoring (Unknown &ne; Safe), and clinician attention discounting, "
        "the platform delivers a modeled <b>$3.82M in gross annual value</b> ($3.58M net ROI) per 500-bed facility.",
        body_style
    ))

    # 2. Key Stakeholder Value
    story.append(Paragraph("2. Key Stakeholder Value", h1_style))
    story.append(Paragraph("• <b>Triage Nurses (RNs):</b> Replaces overwhelming 40+ patient tracking lists with a prioritized 'Next 5 Minutes' action queue, reducing alert fatigue and cognitive strain.", bullet_style))
    story.append(Paragraph("• <b>Emergency Physicians (MDs):</b> Provides instant visibility into which waiting patients have deteriorated since initial intake, enabling faster, targeted clinical interventions.", bullet_style))
    story.append(Paragraph("• <b>Chief Medical Officers (CMOs):</b> Minimizes waiting-room sentinel events and builds an append-only audit trail for clinical governance and malpractice defense.", bullet_style))
    story.append(Paragraph("• <b>Chief Financial Officers (CFOs):</b> Captures high ROI through reduced Left-Without-Being-Seen (LWBS) walkouts, fewer uncompensated ICU transfers, and lower nurse overtime.", bullet_style))

    # Stakeholder Table
    stake_data = [
        [Paragraph("<b>Stakeholder</b>", table_cell_bold), Paragraph("<b>Primary Clinical / Financial Pain Point</b>", table_cell_bold), Paragraph("<b>PatientTriage.ai Value Proposition</b>", table_cell_bold)],
        [Paragraph("<b>Triage Nurses (RNs)</b>", table_cell), Paragraph("Overwhelmed tracking 40+ waiting patients; fear of silent deterioration.", table_cell), Paragraph("Nurse Tasks ('Next 5 Mins') view with 1-click Bedside Reassessment.", table_cell)],
        [Paragraph("<b>Emergency MDs</b>", table_cell), Paragraph("Blind to which waiting patient has worsened since initial intake.", table_cell), Paragraph("Attention Gap Queue dispatches doctors to highest unmet clinical need.", table_cell)],
        [Paragraph("<b>Chief Medical Officers</b>", table_cell), Paragraph("Delayed diagnosis lawsuits, sentinel events in waiting lounges.", table_cell), Paragraph("100% Downgrade Guardrails & append-only audit trail for malpractice defense.", table_cell)],
        [Paragraph("<b>Hospital CFOs</b>", table_cell), Paragraph("Uncompensated ICU boarding, LWBS revenue leakage, nurse turnover.", table_cell), Paragraph("Delivers measurable $3.58M annual net ROI per 500-bed hospital facility.", table_cell)],
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
    # 3. Financial ROI & Impact Model
    story.append(Paragraph("3. Financial ROI & Impact Model (500-Bed Facility)", h1_style))
    story.append(Paragraph(
        "<i>Projections based on 65,000 annual ED visits, 500 beds, and an average $1,200 baseline ED revenue per visit:</i>",
        body_style
    ))

    fin_data = [
        [Paragraph("<b>Value Driver</b>", table_cell_bold), Paragraph("<b>Baseline Scenario</b>", table_cell_bold), Paragraph("<b>Post-Implementation Target</b>", table_cell_bold), Paragraph("<b>Annual Financial Impact</b>", table_cell_bold)],
        [Paragraph("<b>1. LWBS Revenue Recovery</b>", table_cell), Paragraph("3,120 patients walk out (4.8%)", table_cell), Paragraph("30% reduction via proactive re-engagement", table_cell), Paragraph("<b>+$1,123,200 / yr</b>", table_cell)],
        [Paragraph("<b>2. Avoided ICU Escalations</b>", table_cell), Paragraph("145 waiting-room crashes/yr", table_cell), Paragraph("64% reduction (93 avoided stays @ $15k)", table_cell), Paragraph("<b>+$1,395,000 / yr</b>", table_cell)],
        [Paragraph("<b>3. Malpractice Risk Mitigation</b>", table_cell), Paragraph("$1.2M annual liability allocation", table_cell), Paragraph("40% reduction via deterministic audit logs", table_cell), Paragraph("<b>+$480,000 / yr</b>", table_cell)],
        [Paragraph("<b>4. Staff Retention & Overtime</b>", table_cell), Paragraph("26.8% RN turnover (14 replacements)", table_cell), Paragraph("4 turnover events avoided + 15% overtime drop", table_cell), Paragraph("<b>+$378,000 / yr</b>", table_cell)],
        [Paragraph("<b>5. Throughput & Boarding</b>", table_cell), Paragraph("248 min average wait/boarding", table_cell), Paragraph("30-minute reduction via optimized dispatch", table_cell), Paragraph("<b>+$445,000 / yr</b>", table_cell)],
        [Paragraph("<b>Total Gross Annual Value</b>", table_cell_bold), Paragraph("—", table_cell), Paragraph("—", table_cell), Paragraph("<font color='#0369a1'><b>$3,821,200 / yr</b></font>", table_cell_bold)],
        [Paragraph("<b>Software License & Edge Hardware</b>", table_cell), Paragraph("—", table_cell), Paragraph("Enterprise annual subscription + support", table_cell), Paragraph("<font color='#dc2626'><b>-$240,000 / yr</b></font>", table_cell)],
        [Paragraph("<b>Net Annual ROI</b>", table_cell_bold), Paragraph("—", table_cell), Paragraph("<b>14.9x Return on Investment</b>", table_cell_bold), Paragraph("<font color='#059669'><b>+$3,581,200 / yr</b></font>", table_cell_bold)]
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

    # 4. Enterprise Architecture & Integration
    story.append(Paragraph("4. Enterprise Architecture & Integration", h1_style))
    story.append(Paragraph("• <b>HL7 FHIR & SMART-on-FHIR Native:</b> Interfaces directly with existing Epic and Cerner systems via standard resources (<code>Encounter</code>, <code>Observation</code>) and CDS Hooks (<code>patient-view</code>), requiring zero rip-and-replace infrastructure changes.", bullet_style))
    story.append(Paragraph("• <b>Air-Gapped Edge Processing:</b> Runs locally on hospital servers with sub-15ms inference latency, zero cloud LLM latency dependencies, and no persistent PHI storage in the queue cache.", bullet_style))
    story.append(Paragraph("• <b>Alarm Fatigue Protection:</b> Compresses notifications into the top 3 high-yield actions for nurses, preventing alarm flooding while preserving critical escalation paths.", bullet_style))

    # 5. Regulatory Stance & Risk Governance
    story.append(Paragraph("5. Regulatory Stance & Risk Governance", h1_style))
    story.append(Paragraph("• <b>FDA CDS Compliance:</b> Positioned as non-device Clinical Decision Support under 21 U.S.C. &sect; 360aaa-1. Licensed medical professionals retain full decision autonomy and override control.", bullet_style))
    story.append(Paragraph("• <b>Deterministic Guardrails:</b> Hard physiological thresholds (SpO₂ &lt; 85%, SBP &lt; 75 mmHg) immediately bypass statistical layers to enforce patient safety floors.", bullet_style))
    story.append(Paragraph("• <b>Fail-Safe Operation:</b> If telemetry or network connectivity fails, the platform prompts manual rounding intervals with local deterministic alerts active.", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] Business Proposal PDF built successfully: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")

if __name__ == "__main__":
    build_business_proposal_pdf()
