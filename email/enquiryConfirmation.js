import {
    BRAND,
    FONT_BODY,
    FONT_DISPLAY,
    emailShell,
    eyebrow,
    heading,
    paragraph,
    firstName,
    esc,
} from "./_shared";

/**
 * Auto-acknowledgement sent to the customer who submitted a product enquiry.
 * Confirms we received it and gives them a reference number to quote in any
 * follow-up. Every interpolated field is customer-supplied, so all of it is
 * escaped. Best-effort send — the enquiry is already persisted, so a mail
 * failure must never block the submission.
 *
 * Deliberately price-free: the customer is told the team will get back with
 * availability and pricing, matching the enquiry (not checkout) model.
 */
export const enquiryConfirmation = ({ ticketId, name, products = [] }) => {
    const refCard = `
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
  <tr>
    <td align="center" style="background-color:${BRAND.warm};border:1px solid ${BRAND.border};border-radius:12px;padding:20px 24px;">
      <p style="margin:0 0 6px;font-family:${FONT_BODY};font-size:11px;font-weight:bold;letter-spacing:0;text-transform:uppercase;color:${BRAND.muted};">Your enquiry reference</p>
      <p style="margin:0;font-family:${FONT_DISPLAY};font-size:26px;letter-spacing:1px;color:${BRAND.oxblood};">${esc(ticketId)}</p>
    </td>
  </tr>
</table>`;

    const itemRows = products
        .map(
            (p) => `
<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};font-family:${FONT_BODY};font-size:14px;line-height:20px;color:${BRAND.ink};">
    ${esc(p.name)}${p.size || p.color ? `<span style="color:${BRAND.muted};"> · ${esc([p.size, p.color].filter(Boolean).join(" / "))}</span>` : ""}
  </td>
  <td align="right" style="padding:10px 0;border-bottom:1px solid ${BRAND.border};font-family:${FONT_BODY};font-size:14px;font-weight:bold;color:${BRAND.ink};white-space:nowrap;">
    Qty ${esc(String(p.qty))}
  </td>
</tr>`
        )
        .join("");

    const bodyHtml = `
${eyebrow("Enquiry received")}
${heading("Thanks for your enquiry")}
${paragraph(`Hi ${firstName(name)},`)}
${paragraph("We've received your enquiry and our team will get back to you shortly with availability and pricing for the items below. Please keep the reference number handy — just reply to this email and we'll pick up right where you left off.")}
${refCard}

<p style="margin:8px 0 8px;font-family:${FONT_BODY};font-size:10px;font-weight:bold;letter-spacing:0;text-transform:uppercase;color:${BRAND.muted};">Products you enquired about (${products.length})</p>
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND.border};">
  ${itemRows}
</table>`;

    return emailShell({
        preheader: `We've received your enquiry — reference ${ticketId}.`,
        title: "We've received your enquiry",
        bodyHtml,
    });
};
