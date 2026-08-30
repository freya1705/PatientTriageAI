"""
Official 4-Slide PowerPoint Generator for Accenture Innovation Challenge 2026
Generates PatientTriage_AI_Business_Proposal.pptx following Accenture's exact 4-slide structure.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_4slide_deck():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Exact Accenture Template Colors
    C_PURPLE = RGBColor(168, 0, 255)       # #a800ff Accenture Purple Header
    C_PURPLE_LIGHT = RGBColor(243, 232, 255) # #f3e8ff Subheading Background
    C_TEXT_DARK = RGBColor(15, 23, 42)     # #0f172a
    C_WHITE = RGBColor(255, 255, 255)
    C_MUTED = RGBColor(100, 116, 139)      # #64748b
    C_TEAL_BG = RGBColor(204, 251, 241)    # #ccfbf1 Table Light Teal
    C_TEAL_DARK = RGBColor(15, 118, 110)   # #0f766e Table Text

    def add_white_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_WHITE
        bg.line.fill.background()
        return bg

    def add_purple_banner(slide, text):
        banner = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(0.65))
        banner.fill.solid()
        banner.fill.fore_color.rgb = C_PURPLE
        banner.line.fill.background()
        
        tf = banner.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f" {text}"
        p.font.size = Pt(20)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.alignment = PP_ALIGN.LEFT
        return banner

    # ==========================================================
    # SLIDE 1: Team Details
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_white_bg(s1)

    # Title: Team details
    t1 = s1.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(0.8))
    tf1 = t1.text_frame
    p1 = tf1.paragraphs[0]
    p1.text = "Team details"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = C_TEXT_DARK

    # Team Name Banner
    t_banner = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.45))
    t_banner.fill.solid()
    t_banner.fill.fore_color.rgb = C_PURPLE_LIGHT
    t_banner.line.fill.background()
    tf_tb = t_banner.text_frame
    p_tb = tf_tb.paragraphs[0]
    p_tb.text = " TEAM NAME: Phoenix"
    p_tb.font.size = Pt(13)
    p_tb.font.bold = True
    p_tb.font.color.rgb = C_PURPLE

    # Member Details Box (Right of Photo)
    m_box = s1.shapes.add_textbox(Inches(3.2), Inches(2.3), Inches(9.0), Inches(4.5))
    tf_m = m_box.text_frame
    tf_m.word_wrap = True

    pm1 = tf_m.paragraphs[0]
    pm1.text = "Freya Jadhav"
    pm1.font.size = Pt(32)
    pm1.font.bold = True
    pm1.font.color.rgb = C_PURPLE

    pm2 = tf_m.add_paragraph()
    pm2.text = "(Team Leader)"
    pm2.font.size = Pt(28)
    pm2.font.bold = True
    pm2.font.color.rgb = C_PURPLE

    pm3 = tf_m.add_paragraph()
    pm3.text = "College: IIT Madras\nStream: Data Science and Applications\nYear of graduation: 2028"
    pm3.font.size = Pt(14)
    pm3.font.color.rgb = C_TEXT_DARK
    pm3.space_before = Pt(18)

    # ==========================================================
    # SLIDE 2: Describe the Problem Statement (200 words)
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_white_bg(s2)
    add_purple_banner(s2, "Describe the problem statement (200 words)")

    p_box = s2.shapes.add_textbox(Inches(0.8), Inches(1.7), Inches(11.733), Inches(5.3))
    tf_p = p_box.text_frame
    tf_p.word_wrap = True

    sub_p = tf_p.paragraphs[0]
    sub_p.text = "Patient Triage Doesn’t End at Arrival: The Waiting-Room Surveillance Gap"
    sub_p.font.size = Pt(16)
    sub_p.font.bold = True
    sub_p.font.color.rgb = C_TEXT_DARK

    body_p1 = tf_p.add_paragraph()
    body_p1.text = (
        "Emergency departments face acute operational strain during mass-casualty surges and peak hours. "
        "Globally, emergency crowding increases 10-day patient mortality by ~30%, with 90% of emergency medical "
        "condition deaths preventable through timely prioritization. In India, ranking 144th in emergency access, "
        "over 79% of healthcare workers report triage bottlenecks as their primary operational barrier, compounded by "
        "the fact that only 12.14% of registrations capture structured diagnostic data at intake.\n\n"
        "The fundamental failure of current emergency workflows is that triage is treated as a one-time static snapshot "
        "at the front door. However, arrival classification quickly degrades: patients initially categorized as lower "
        "risk can silently deteriorate, exceed clinically safe reassessment windows, or experience internal "
        "decompensation while waiting unmonitored.\n\n"
        "When clinical staff are overwhelmed, data is incomplete, and clinical attention becomes the scarce resource, "
        "two distinct decisions must be made:\n"
        "• Who needs attention first upon arrival?\n"
        "• Who is no longer safe to keep waiting?\n\n"
        "Current systems fail to monitor this second, life-critical question, resulting in dangerous unmonitored delays, "
        "alert fatigue, and preventable patient mortality."
    )
    body_p1.font.size = Pt(11.5)
    body_p1.font.color.rgb = C_TEXT_DARK
    body_p1.space_before = Pt(8)

    # ==========================================================
    # SLIDE 3: Proposed Solution (200 words)
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_white_bg(s3)
    add_purple_banner(s3, "Proposed solution (200 words)")

    s_box = s3.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.733), Inches(2.6))
    tf_s = s_box.text_frame
    tf_s.word_wrap = True

    sub_s = tf_s.paragraphs[0]
    sub_s.text = "Core Loop: Arrive → Prioritize → Wait → Monitor → Reprioritize"
    sub_s.font.size = Pt(13)
    sub_s.font.bold = True
    sub_s.font.color.rgb = C_TEXT_DARK

    body_s = tf_s.add_paragraph()
    body_s.text = (
        "Step 1: Rapid Arrival Prioritization. Uses intake symptoms, vitals, complaint, and injury type to assign immediate priority. "
        "Supports standard hospital triage (ESI 1–5) and switches instantly to mass-casualty disaster mode (Red/Yellow/Green/Black).\n"
        "Step 2: Continuous Waiting-Room Safety. Continuously monitors patients while they wait using automated timers (elapsed wait time and overdue review windows) "
        "and new vitals entered during regular checks—without needing expensive wearable sensors.\n"
        "Step 3: Workflow Automation vs. Human Authority. Automated by System: Tracks waiting timers, flags missing vitals, triggers hospital escalation ladders, and ranks urgent tasks. "
        "Decided by Doctors: Medical diagnosis, treatment plans, prescriptions, and 100% final override authority.\n"
        "Step 4: Live Action Queue & Safety Guardrail. Surfaces a clean Top-3 Action Queue for staff instead of noisy alarms. "
        "Follows the core rule: Uncertainty ≠ Low Risk—missing critical vitals blocks a safe rating and triggers immediate human review."
    )
    body_s.font.size = Pt(10)
    body_s.font.color.rgb = C_TEXT_DARK
    body_s.space_before = Pt(4)

    # Comparison Table
    table_shape = s3.shapes.add_table(7, 2, Inches(0.8), Inches(4.3), Inches(11.733), Inches(2.7))
    tbl = table_shape.table
    tbl.columns[0].width = Inches(5.5)
    tbl.columns[1].width = Inches(6.233)

    table_data = [
        ("Most systems", "PatientTriage.ai"),
        ("Assess patients at arrival", "Continues monitoring while they wait"),
        ("Give a fixed risk score", "Updates priority when risk changes"),
        ("Track queues", "Treats long waiting time as a safety signal"),
        ("May struggle with missing data", "Flags uncertainty for human review"),
        ("Generate many alerts", "Shows only the Top-3 actions first"),
        ("Depend heavily on hospital systems", "Standalone-first and integration-ready")
    ]

    for row_idx, (col1, col2) in enumerate(table_data):
        cell1 = tbl.cell(row_idx, 0)
        cell2 = tbl.cell(row_idx, 1)
        
        cell1.text = col1
        cell2.text = col2
        
        # Background fill
        cell1.fill.solid()
        cell2.fill.solid()
        if row_idx == 0:
            cell1.fill.fore_color.rgb = RGBColor(153, 246, 228)  # #99f6e4 Header Teal
            cell2.fill.fore_color.rgb = RGBColor(153, 246, 228)
        else:
            cell1.fill.fore_color.rgb = RGBColor(240, 253, 250)  # #f0fdfa Light Teal Row
            cell2.fill.fore_color.rgb = RGBColor(240, 253, 250)
            
        for cell, is_bold in [(cell1, row_idx == 0), (cell2, row_idx == 0)]:
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(10)
            p.font.bold = is_bold
            p.font.color.rgb = C_TEXT_DARK

    # ==========================================================
    # SLIDE 4: Video
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_white_bg(s4)
    add_purple_banner(s4, "Video")

    v_box = s4.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(11.733), Inches(3.0))
    tf_v = v_box.text_frame
    tf_v.word_wrap = True

    pv1 = tf_v.paragraphs[0]
    pv1.text = "https://drive.google.com/drive/folders/1qeAV4E03yaVNREZVVUIRtUZ2KoMC7Ptg?usp=sharing"
    pv1.font.size = Pt(16)
    pv1.font.bold = True
    pv1.font.color.rgb = RGBColor(37, 99, 235)  # #2563eb Blue link
    pv1.font.underline = True

    pv2 = tf_v.add_paragraph()
    pv2.text = "\nGitHub Repository: https://github.com/freya1705/PatientTriageAI"
    pv2.font.size = Pt(14)
    pv2.font.color.rgb = C_MUTED
    pv2.space_before = Pt(14)

    # Save
    pptx_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "PatientTriage_AI_Business_Proposal.pptx")
    prs.save(pptx_path)
    print(f"[OK] Generated official 4-slide Accenture PPTX: {pptx_path} (Size: {os.path.getsize(pptx_path)} bytes)")

if __name__ == "__main__":
    create_4slide_deck()
