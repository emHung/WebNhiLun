"""Generate a standalone certificate rather than printing a dashboard."""
from io import BytesIO
from pathlib import Path
import os
from xml.sax.saxutils import escape

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF


def certificate_pdf(certificate, verification_url: str) -> bytes:
    output = BytesIO()
    font = "Helvetica"
    candidates = [os.getenv("PDF_FONT_PATH", ""), "C:/Windows/Fonts/arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
    path = next((Path(item) for item in candidates if item and Path(item).is_file()), None)
    if path:
        font = "CertificateFont"
        if font not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont(font, str(path)))
    else:
        raise RuntimeError("Configure PDF_FONT_PATH with a Unicode TrueType font.")
    page = canvas.Canvas(output, pagesize=landscape(A4))
    width, height = landscape(A4)
    page.setStrokeColorRGB(.02, .5, .38)
    page.setLineWidth(3)
    page.rect(25,25,width-50,height-50)
    style = ParagraphStyle("Certificate", fontName=font, fontSize=18, leading=27, alignment=1)
    def paragraph(text, y, size=18):
        style.fontSize = size
        content = Paragraph(escape(str(text)), style)
        _, content_height = content.wrap(width-110,150)
        content.drawOn(page,55,y-content_height)
    paragraph("CHỨNG NHẬN HOÀN THÀNH",height-55,26)
    paragraph(certificate["issuer"],height-110)
    paragraph("Trân trọng ghi nhận đóng góp của",height-165,16)
    paragraph(certificate["recipient_name"],height-205,24)
    paragraph(certificate["title"],height-260,20)
    paragraph(f"{certificate['hours']} giờ tình nguyện • Ngày cấp: {certificate['issue_date']}",height-340,16)
    paragraph(certificate["certificate_code"],95,12)
    widget = qr.QrCodeWidget(verification_url)
    x1,y1,x2,y2=widget.getBounds()
    drawing=Drawing(85,85,transform=[85/(x2-x1),0,0,85/(y2-y1),0,0])
    drawing.add(widget)
    renderPDF.draw(drawing,page,width-140,50)
    page.showPage()
    page.save()
    return output.getvalue()
