"""
Official 4-Slide PowerPoint Generator for Accenture Innovation Challenge 2026
Updated with latest prototype innovations: Dynamic Risk, 108 EMS Telemetry, Attention Gap,
4 Workspaces, Attendant Away, Referral Scoring (RES), Closed-Loop Reassessments, and $3.82M ROI.
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
    C_PURPLE = RGBColor(168, 0, 255)         # #a800ff Accenture Purple Header
    C_PURPLE_LIGHT = RGBColor(243, 232, 255)   # #f3e8ff Subheading Background
    C_TEXT_DARK = RGBColor(15, 23, 42)       # #0f172a
    C_WHITE = RGBColor(255, 255, 255)
    C_MUTED = RGBColor(100, 116, 139)        # #64748b
    C_TEAL_HEADER = RGBColor(153, 246, 228)  # #99f6e4 Table Header Teal
    C_TEAL_ROW = RGBColor(240, 253, 250)     # #f0fdfa Table Row Light Teal

    def add_white_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_WHITE
        bg.line.fill.background()
        return bg

    def add_purple_banner(slide, text):
        banner = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.65), Inches(11.733), Inches(0.65))
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

    # Member Details Box
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
    pm3.text = "College: IIT Madras\nStream: Data Science and Applications\nYear of graduation: 2028\nProject: PatientTriage.ai — Active Autonomous ED Safety Control Tower"
    pm3.font.size = Pt(14)
    pm3.font.color.rgb = C_TEXT_DARK
    pm3.space_before = Pt(18)

    # ==========================================================
    # SLIDE 2: Describe the Problem Statement (200 words)
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_white_bg(s2)
    add_purple_banner(s2, "Describe the problem statement (200 words)")

    p_box = s2.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.6))
    tf_p = p_box.text_frame
    tf_p.word_wrap = True

    sub_p = tf_p.paragraphs[0]
    sub_p.text = "Patient Triage Doesn’t End at Arrival: The Emergency Waiting-Room Blind Spot"
    sub_p.font.size = Pt(15)
    sub_p.font.bold = True
    sub_p.font.color.rgb = C_TEXT_DARK

    body_p1 = tf_p.add_paragraph()
    body_p1.text = (
        "Emergency departments face severe operational strain, where triage is treated as a one-time static snapshot at the front door. "
        "However, “Triage is a snapshot. Risk isn't.”\n\n"
        "Once triaged, ESI Level 3/4 patients wait unmonitored for 2.5 to 4.5 hours. During this gap, physiological decline may remain undetected "
        "until sudden clinical collapse. In India (ranking 144th in emergency access) and globally, overcrowded waiting lounges lack continuous surveillance; "
        "79% of staff cite triage bottlenecks, and only 12.14% of registrations capture structured diagnostic data.\n\n"
        "Native EHR scores (Epic/Cerner) fail because they only monitor admitted inpatient beds and treat missing vitals as benign. "
        "When clinical attention is the scarce resource, two distinct decisions must be made:\n"
        "• Who needs attention first upon arrival?\n"
        "• Who is no longer safe to keep waiting?\n\n"
        "Traditional systems ignore this second life-critical question. Without continuous tracking of vital velocity, observation shelf-life (Safety Clocks), "
        "and physician coverage, unattended deteriorating patients stay buried—leading to preventable ICU transfers, high walkouts (LWBS), and waiting room mortality."
    )
    body_p1.font.size = Pt(11)
    body_p1.font.color.rgb = C_TEXT_DARK
    body_p1.space_before = Pt(6)

    # ==========================================================
    # SLIDE 3: Proposed Solution (200 words)
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_white_bg(s3)
    add_purple_banner(s3, "Proposed solution (200 words)")

    s_box = s3.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.733), Inches(2.7))
    tf_s = s_box.text_frame
    tf_s.word_wrap = True

    sub_s = tf_s.paragraphs[0]
    sub_s.text = "PatientTriage.ai: Active Autonomous Emergency Department Safety Control Tower"
    sub_s.font.size = Pt(13)
    sub_s.font.bold = True
    sub_s.font.color.rgb = C_TEXT_DARK

    body_s = tf_s.add_paragraph()
    body_s.text = (
        "Core Loop: Ingest Telemetry → Forecast Trajectory → Allocate Attention → Reassess (Closed-Loop)\n"
        "• 1. Continuous Surveillance & 108 EMS Telemetry: Tracks vital velocity (ΔSpO₂, ΔHR) and ingests pre-hospital ambulance telemetry via HL7 FHIR LOINC codes with 1-click Resus Bay pre-allocation.\n"
        "• 2. The Attention Gap & Attendant-Away Engine: Prioritizes unattended deteriorating patients over attended beds. Detects when a caregiver steps away, auto-injecting nurse spot-check tasks.\n"
        "• 3. 4 Clinical Workspaces: Provides Overview (Control Tower), Nurse Tasks ('Next 5 Mins'), ED Floor Map (chairs 1–20 halos), and Standing Lab Pre-Orders Hub (Troponin/Lactate auto-drafts saving 18m).\n"
        "• 4. Referral Scoring & Patient Companion: Evaluates 0–100% diversion (RES) to relieve tertiary ED crowding, while mobile QR trackers de-escalate anxiety to recover $1.12M in walkout revenue.\n"
        "• 5. Closed-Loop Reassessment: 1-click bedside vitals entry logs a 3m 42s Time to Intervention into an immutable audit ledger ($3.82M Net Hospital ROI; FDA Non-Device CDS compliant)."
    )
    body_s.font.size = Pt(9.5)
    body_s.font.color.rgb = C_TEXT_DARK
    body_s.space_before = Pt(3)

    # Comparison Table
    table_shape = s3.shapes.add_table(7, 2, Inches(0.8), Inches(4.2), Inches(11.733), Inches(2.9))
    tbl = table_shape.table
    tbl.columns[0].width = Inches(5.5)
    tbl.columns[1].width = Inches(6.233)

    table_data = [
        ("Traditional Triage Systems", "PatientTriage.ai Autonomous Control Tower"),
        ("Static Intake Snapshot (One-time score at door)", "Continuous Dynamic Risk (Tracks vital velocity ΔVitals/Δt)"),
        ("Missing Vitals Assumed Safe (False reassurance)", "Unknown ≠ Safe (Missing data triggers uncertainty penalty)"),
        ("Attended Cases Block Queue (Physician bottlenecks)", "Attention Gap Optimization (Elevates unmonitored waiting patients)"),
        ("No Pre-Hospital Awareness (Delayed bay allocation)", "108 EMS Telemetry Ingestion (1-click pre-allocated resus bays)"),
        ("Overwhelms Nurses with Alarms (Alarm fatigue)", "4 Focused Workspaces & 'Next 5 Mins' (Time-budgeted micro-tasks)"),
        ("High Walkout Rates (4.8% unmonitored LWBS)", "Patient QR Companion + RES Diversion ($3.82M net hospital ROI)")
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
            cell1.fill.fore_color.rgb = C_TEAL_HEADER
            cell2.fill.fore_color.rgb = C_TEAL_HEADER
        else:
            cell1.fill.fore_color.rgb = C_TEAL_ROW
            cell2.fill.fore_color.rgb = C_TEAL_ROW
            
        for cell, is_bold in [(cell1, row_idx == 0), (cell2, row_idx == 0)]:
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(9.5)
            p.font.bold = is_bold
            p.font.color.rgb = C_TEXT_DARK

    # ==========================================================
    # SLIDE 4: Video
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_white_bg(s4)
    add_purple_banner(s4, "Video")

    v_box = s4.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(11.733), Inches(3.5))
    tf_v = v_box.text_frame
    tf_v.word_wrap = True

    pv1 = tf_v.paragraphs[0]
    pv1.text = "https://drive.google.com/drive/folders/1qeAV4E03yaVNREZVVUIRtUZ2KoMC7Ptg?usp=sharing"
    pv1.font.size = Pt(16)
    pv1.font.bold = True
    pv1.font.color.rgb = RGBColor(37, 99, 235)  # #2563eb Blue link
    pv1.font.underline = True

    pv2 = tf_v.add_paragraph()
    pv2.text = (
        "\nGitHub Repository: https://github.com/freya1705/PatientTriageAI\n"
        "• Live Control Tower Prototype: http://localhost:5173\n"
        "• Demonstration Focus: 108 EMS Telemetry, Attention Gap Re-ranking, Floor Map, and Closed-Loop Reassessment (3m 42s Time to Intervention)\n"
        "• Verification: 51/51 automated pytest tests passed (100% pass rate)"
    )
    pv2.font.size = Pt(12)
    pv2.font.color.rgb = C_MUTED
    pv2.space_before = Pt(12)

    # Save to primary and alternate names to avoid file lock
    out_dir = os.path.dirname(os.path.dirname(__file__))
    primary_path = os.path.join(out_dir, "PatientTriage_AI_Accenture_Proposal_4Slides.pptx")
    prs.save(primary_path)
    print(f"[OK] Generated: {primary_path} (Size: {os.path.getsize(primary_path)} bytes)")
    
    try:
        alt_path = os.path.join(out_dir, "PatientTriage_AI_Business_Proposal.pptx")
        prs.save(alt_path)
        print(f"[OK] Updated: {alt_path} (Size: {os.path.getsize(alt_path)} bytes)")
    except Exception as e:
        print(f"[Note] Primary file saved as PatientTriage_AI_Accenture_Proposal_4Slides.pptx ({e})")

if __name__ == "__main__":
    create_4slide_deck()
