import os
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_RIGHT, TA_LEFT
from datetime import datetime
import random
import string

def generate_government_report(data: dict) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=0.8 * inch,
        leftMargin=0.8 * inch,
        topMargin=0.8 * inch,
        bottomMargin=0.8 * inch
    )
    
    styles = getSampleStyleSheet()
    
    # ------------------ CUSTOM STYLES ------------------
    style_heading_main = ParagraphStyle(
        'GovHeadingMain',
        parent=styles['Heading1'],
        alignment=TA_CENTER,
        fontSize=15,
        spaceAfter=2,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#000000')
    )
    style_heading_sub = ParagraphStyle(
        'GovHeadingSub',
        parent=styles['Heading2'],
        alignment=TA_CENTER,
        fontSize=12,
        spaceAfter=15,
        fontName='Helvetica-Bold'
    )
    style_body = ParagraphStyle(
        'GovBody',
        parent=styles['Normal'],
        alignment=TA_JUSTIFY,
        fontSize=11,
        spaceBefore=6,
        spaceAfter=6,
        leading=16, # Line spacing
        fontName='Helvetica'
    )
    style_right = ParagraphStyle(
        'GovRight',
        parent=styles['Normal'],
        alignment=TA_RIGHT,
        fontSize=11,
        fontName='Helvetica-Bold'
    )
    style_bold = ParagraphStyle(
        'GovBold',
        parent=styles['Normal'],
        fontSize=11,
        fontName='Helvetica-Bold'
    )
    style_subject = ParagraphStyle(
        'GovSubject',
        parent=styles['Normal'],
        alignment=TA_JUSTIFY,
        fontSize=11,
        fontName='Helvetica-Bold',
        leftIndent=0.5*inch,
        rightIndent=0.5*inch,
        spaceBefore=10,
        spaceAfter=15
    )
    style_table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        alignment=TA_CENTER,
        fontSize=10,
        fontName='Helvetica-Bold'
    )
    style_table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        alignment=TA_LEFT,
        fontSize=10,
        fontName='Helvetica'
    )
    
    elements = []
    
    # Extract data
    now = datetime.now()
    default_id = f"BIS/REC/{now.strftime('%Y%m')}/" + "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    report_id = data.get("id", default_id)
    date_str = data.get("date", now.strftime("%d %B, %Y"))
    time_str = now.strftime("%H:%M:%S")
    department = data.get("dept", "Central Public Works Department (CPWD)")
    product_title = data.get("title", "Specified Goods")
    compliance_status = data.get("compliance", "Fully Compliant")
    standards = data.get("standards", [])
    summary_text = data.get("summary", "Technical assessment successfully completed using AI-driven NLP engine.")
    
    # ------------------ HEADER ------------------
    elements.append(Paragraph("GOVERNMENT OF INDIA", style_heading_main))
    elements.append(Paragraph("MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION", style_heading_sub))
    elements.append(Paragraph("BUREAU OF INDIAN STANDARDS (BIS)", style_heading_sub))
    elements.append(HRFlowable(width="100%", color=colors.black, thickness=1.5, spaceAfter=15, spaceBefore=0))
    
    # ------------------ FILE NO & DATE ------------------
    data_ref_date = [
        [Paragraph(f"<b>File No:</b> {report_id}", styles['Normal']), Paragraph(f"New Delhi, Dated: {date_str}", style_right)],
        [Paragraph(f"<b>System Ref:</b> AI-REC-SYS-V2.1", styles['Normal']), Paragraph(f"Time: {time_str}", style_right)]
    ]
    table_ref_date = Table(data_ref_date, colWidths=[3.5 * inch, 3.4 * inch])
    table_ref_date.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(table_ref_date)
    elements.append(Spacer(1, 0.3 * inch))
    
    # ------------------ MEMORANDUM TEXT ------------------
    elements.append(Paragraph("<u><b>OFFICE MEMORANDUM / TECHNICAL COMPLIANCE REPORT</b></u>", ParagraphStyle('OrderStyle', parent=styles['Normal'], alignment=TA_CENTER, fontName='Helvetica-Bold', fontSize=13)))
    elements.append(Spacer(1, 0.2 * inch))
    
    # ------------------ SUBJECT ------------------
    subject_text = f"<b>Subject:</b> Technical compliance assessment, applicability of Indian Standards (IS), and Mandatory Clauses for the procurement of <b>{product_title}</b> - Regarding."
    elements.append(Paragraph(subject_text, style_subject))
    
    # ------------------ BODY PARAGRAPHS ------------------
    p1 = f"The undersigned is directed to refer to the procurement/tender requirements submitted by the <b>{department}</b> regarding the acquisition of <b>{product_title}</b>."
    elements.append(Paragraph(p1, style_body))
    
    p2 = f"<b>2.</b> An automated technical assessment has been rigorously carried out by the BIS AI Recommendation Engine. The evaluation cross-referenced the provided technical specifications against the National Standards Repository."
    elements.append(Paragraph(p2, style_body))

    # ------------------ PROJECT DETAILS TABLE ------------------
    details_data = [
        [Paragraph("<b>Requisitioning Department</b>", style_table_cell), Paragraph(f"{department}", style_table_cell)],
        [Paragraph("<b>Category of Procurement</b>", style_table_cell), Paragraph(f"{product_title}", style_table_cell)],
        [Paragraph("<b>Overall Compliance Status</b>", style_table_cell), Paragraph(f"<b>{compliance_status}</b>", style_table_cell)],
        [Paragraph("<b>Analysis Remarks</b>", style_table_cell), Paragraph(f"{summary_text}", style_table_cell)],
    ]
    details_table = Table(details_data, colWidths=[2.5 * inch, 4.4 * inch])
    details_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('BACKGROUND', (0,0), (0,-1), colors.lightgrey),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(details_table)
    elements.append(Spacer(1, 0.2 * inch))

    p3 = "<b>3. ANNEXURE-I (Mandatory Standards):</b> Based on the technical parameters identified, the following Indian Standards (IS) have been mapped as highly relevant. These must be explicitly mentioned in the tender specifications:"
    elements.append(Paragraph(p3, style_body))
    
    # ------------------ STANDARDS TABLE ------------------
    if standards:
        std_data = [[
            Paragraph("<b>S.No</b>", style_table_header), 
            Paragraph("<b>IS Number</b>", style_table_header), 
            Paragraph("<b>Standard Title / Description</b>", style_table_header),
            Paragraph("<b>Match Score</b>", style_table_header)
        ]]
        for idx, std in enumerate(standards):
            is_num = std.get("is_number", "N/A")
            std_title = std.get("title", "N/A")
            match_score = f"{std.get('match_score', 95)}%"
            
            std_data.append([
                Paragraph(str(idx+1), style_table_cell), 
                Paragraph(is_num, ParagraphStyle('', parent=style_table_cell, fontName='Helvetica-Bold')), 
                Paragraph(std_title, style_table_cell),
                Paragraph(match_score, style_table_cell)
            ])
            
        std_table = Table(std_data, colWidths=[0.5*inch, 1.5*inch, 4.0*inch, 0.9*inch])
        std_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0B3558')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('GRID', (0,0), (-1,-1), 0.5, colors.black),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('ALIGN', (0,0), (0,-1), 'CENTER'),
            ('ALIGN', (3,0), (3,-1), 'CENTER'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 8),
        ]))
        elements.append(std_table)
    else:
        elements.append(Paragraph("<i>No specific mandatory standards were found for the provided description.</i>", style_body))
        
    elements.append(Spacer(1, 0.2 * inch))

    p4 = "<b>4. Mandatory Procurement Clauses:</b>"
    elements.append(Paragraph(p4, style_body))
    clause_text = "<i>'All goods/materials supplied shall strictly conform to the latest amendments of the relevant Indian Standards (IS) as listed in Annexure-I. The vendor must provide valid BIS Certification Marks License (wherever applicable under mandatory Quality Control Orders) before the award of the contract.'</i>"
    elements.append(Paragraph(clause_text, ParagraphStyle('Clause', parent=styles['Normal'], alignment=TA_JUSTIFY, leftIndent=0.5*inch, rightIndent=0.5*inch, fontName='Helvetica-Oblique', fontSize=10)))
    elements.append(Spacer(1, 0.1 * inch))
    
    p5 = "<b>5.</b> All concerned procuring entities/nodal officers are instructed to ensure strict adherence to these technical specifications to maintain public safety and quality assurance."
    elements.append(Paragraph(p5, style_body))
    
    p6 = "<b>6.</b> This report is system-generated and issued with the approval of the Competent Authority."
    elements.append(Paragraph(p6, style_body))
    elements.append(Spacer(1, 0.4 * inch))
    
    # ------------------ SIGNATURE BLOCK ------------------
    sig_data = [
        ["", Paragraph("(Digitally Signed)", style_right)],
        ["", Paragraph("<b>Authorized Signatory</b>", style_right)],
        ["", Paragraph("Directorate of Standardization", style_right)],
        ["", Paragraph("BIS AI Recommendation Engine", style_right)],
        ["", Paragraph("Govt. of India", style_right)]
    ]
    sig_table = Table(sig_data, colWidths=[3.5 * inch, 3.4 * inch])
    sig_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(sig_table)
    elements.append(Spacer(1, 0.4 * inch))
    
    # ------------------ DISTRIBUTION (COPY TO) ------------------
    elements.append(HRFlowable(width="100%", color=colors.black, thickness=0.5, spaceAfter=10, spaceBefore=0))
    elements.append(Paragraph("<b>Copy forwarded for information and necessary action to:</b>", style_bold))
    elements.append(Paragraph(f"1. The Secretary / Head of Procurement, <b>{department}</b>", styles['Normal']))
    elements.append(Paragraph("2. All Head of Departments (HODs) / Nodal Officers concerned.", styles['Normal']))
    elements.append(Paragraph("3. Deputy Director General (Standardization), BIS HQ.", styles['Normal']))
    elements.append(Paragraph("4. IT Cell / NIC for uploading on the Central Public Procurement Portal (CPPP).", styles['Normal']))
    elements.append(Paragraph("5. Guard File / System Audit Trail.", styles['Normal']))
    
    # Generate Watermark by using Canvas
    def add_footer(canvas, doc):
        canvas.saveState()
        # Footer
        canvas.setFont('Helvetica', 8)
        canvas.drawCentredString(A4[0] / 2.0, 0.5 * inch, f"System Generated Document | Verification ID: {report_id} | Page {doc.page}")
        # Watermark
        canvas.setFont('Helvetica-Bold', 60)
        canvas.setFillGray(0.9)
        canvas.translate(A4[0]/2, A4[1]/2)
        canvas.rotate(45)
        canvas.drawCentredString(0, 0, "GOVERNMENT OF INDIA")
        canvas.restoreState()

    doc.build(elements, onFirstPage=add_footer, onLaterPages=add_footer)
    buffer.seek(0)
    return buffer
