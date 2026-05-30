from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    ListFlowable,
    ListItem,
    Table,
    TableStyle,
)


OUTPUT = Path("/workspace/output/phase-summary-reference.pdf")


def bullet_list(items, style):
    return ListFlowable(
        [ListItem(Paragraph(item, style)) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=14,
    )


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        title="Its Ala - Rollout and Revenue Optimization Summary",
    )

    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "TitleCustom",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#0f1824"),
        spaceAfter=10,
    )
    subtitle = ParagraphStyle(
        "Subtitle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#5d6d83"),
        spaceAfter=14,
    )
    h1 = ParagraphStyle(
        "H1",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        textColor=colors.HexColor("#111111"),
        spaceBefore=8,
        spaceAfter=8,
    )
    body = ParagraphStyle(
        "BodyCustom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=15,
        textColor=colors.HexColor("#222222"),
        spaceAfter=6,
    )
    small = ParagraphStyle(
        "Small",
        parent=body,
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#5d6d83"),
    )
    bullet = ParagraphStyle(
        "BulletCustom",
        parent=body,
        leftIndent=0,
        spaceAfter=3,
    )

    story = []
    story.append(Paragraph("Its Ala Rollout and Revenue Optimization Summary", title))
    story.append(
        Paragraph(
            "Reference summary generated from the final rollout outline and the follow-up revenue optimization response. "
            "This captures the confirmed production state, the next operational priorities, and the measurement layer that matters most.",
            subtitle,
        )
    )

    status_rows = [
        ["Area", "Current confirmed state"],
        ["Public site", "Live in production at www.itsala.com with the public offer and intake surface visible."],
        ["Admin / lead ops", "Built in code; requires authenticated internal confirmation."],
        ["Client workspaces", "Built in code; requires end-to-end internal confirmation."],
        ["Upstream", "Built in code as a separate internal operator console; requires internal confirmation."],
    ]
    status_table = Table(status_rows, colWidths=[42 * mm, 125 * mm])
    status_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f1824")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("LEADING", (0, 0), (-1, -1), 12),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f7f5f1")),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d6dbe3")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.append(status_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Rollout Outline From Here", h1))
    story.append(
        Paragraph(
            "The operating sequence from the current state is: <b>Confirm -> Stabilize -> Operationalize</b>. "
            "The site is no longer in a pure build phase. The main job now is proving that each internal layer works in production and then tightening the operating model around it.",
            body,
        )
    )
    story.append(
        bullet_list(
            [
                "<b>Phase A: Production Confirmation</b> - confirm the public funnel, admin, email, client workspace flow, and Upstream workflow in the live environment.",
                "<b>Phase B: Stabilization</b> - lock environment variables, clean up edge cases, and verify persistence so no important behavior depends on guesswork.",
                "<b>Phase C: Operationalization</b> - define the real cadence for lead review, client delivery updates, and Upstream signal handling.",
            ],
            bullet,
        )
    )

    story.append(Paragraph("What Done Looks Like", h1))
    story.append(
        bullet_list(
            [
                "Public site reliably collects inquiries.",
                "Inquiries become leads and can be reviewed inside admin.",
                "Qualified leads can become client workspaces.",
                "Clients can view a clear project workspace.",
                "Upstream captures, ranks, and routes operator intelligence.",
                "Auth, email, storage, and environment behavior are stable.",
            ],
            bullet,
        )
    )

    story.append(Paragraph("Revenue Optimization Layer", h1))
    story.append(
        Paragraph(
            "The next optimization question is no longer whether the site exists. It is whether the system reveals where revenue is leaking. "
            "The key commercial path is: visitor -> booked -> showed -> proposal_sent -> objection -> won/lost.",
            body,
        )
    )
    story.append(
        bullet_list(
            [
                "After visiting Itsala, do they book?",
                "After booking, do they show?",
                "After showing, do they get a proposal?",
                "After proposal, do they hesitate?",
                "After hesitation, what objection appears?",
            ],
            bullet,
        )
    )

    story.append(Paragraph("Recommended Funnel Fields", h1))
    story.append(
        bullet_list(
            [
                "<b>Status path:</b> new, booked, no_show, showed, proposal_sent, objection, won, lost",
                "<b>Timestamps:</b> bookedAt, showedAt, proposalSentAt, decisionAt",
                "<b>Commercial context:</b> objectionType, objectionNotes, lostReason, dealValueEstimate, dealValueClosed",
            ],
            bullet,
        )
    )

    story.append(Paragraph("Objection Taxonomy", h1))
    story.append(
        bullet_list(
            [
                "price",
                "timing",
                "trust",
                "internal buy-in",
                "unclear scope",
                "no urgency",
                "competitor",
                "no response",
                "other",
            ],
            bullet,
        )
    )

    story.append(Paragraph("Minimum Useful Metrics", h1))
    story.append(
        bullet_list(
            [
                "total leads",
                "booking rate",
                "show rate",
                "proposal rate",
                "close rate",
                "top 3 objections",
                "stalled proposals",
            ],
            bullet,
        )
    )

    story.append(Paragraph("Why This Matters", h1))
    story.append(
        Paragraph(
            "The current system mostly answers operational questions: did a lead come in, what happened, and where is the project now. "
            "The next layer makes it answer revenue questions: where does movement stall, what objection appears most often, and what needs to change in the site, the call, or the proposal. "
            "That is where compounding value lives.",
            body,
        )
    )

    story.append(Paragraph("Recommended Next Deliverable", h1))
    story.append(
        Paragraph(
            "The strongest next artifact is a production confirmation and revenue QA sheet with exact URLs, actions, expected results, pass/fail markers, and notes. "
            "That turns the completed build into an actual operating checklist.",
            small,
        )
    )

    doc.build(story)


if __name__ == "__main__":
    main()
