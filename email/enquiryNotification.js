import {
    BRAND,
    FONT_BODY,
    emailShell,
    eyebrow,
    heading,
    button,
    esc,
} from "./_shared";

/**
 * Internal notification sent to the store inbox when a customer submits a
 * product enquiry from their enquiry list. Every field is customer-supplied, so
 * all of it is escaped to prevent the layout being broken (or markup injected)
 * by hostile input. The Reply CTA deep-links to the customer's email; the route
 * also sets Reply-To so a plain "Reply" works.
 *
 * NOTE: enquiries carry NO pricing - this is a lead, not an order. The email
 * lists what the customer wants and how many, and the team quotes separately.
 */
export const enquiryNotification = ({
    ticketId,
    name,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    country,
    message,
    products = [],
}) => {
    const row = (label, value) => `
<tr>
  <td style="padding:0 0 18px;">
    <p style="margin:0 0 4px;font-family:${FONT_BODY};font-size:10px;font-weight:bold;letter-spacing:0;text-transform:uppercase;color:${BRAND.muted};">${esc(label)}</p>
    <p style="margin:0;font-family:${FONT_BODY};font-size:15px;line-height:22px;color:${BRAND.ink};white-space:pre-wrap;">${value}</p>
  </td>
</tr>`;

    const locationParts = [address, city, state, pincode, country]
        .map((p) => (p || "").trim())
        .filter(Boolean)
    const location = locationParts.length ? esc(locationParts.join(", ")) : "(Not provided)";

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
${eyebrow("Product Enquiry")}
${heading("New enquiry received")}
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:8px;">
  ${ticketId ? row("Reference", esc(ticketId)) : ""}
  ${row("From", `${esc(name)} &nbsp;·&nbsp; <a href="mailto:${esc(email)}" style="color:${BRAND.crimson};">${esc(email)}</a>`)}
  ${row("Mobile", esc(phone) || "-")}
  ${row("Location", location)}
  ${message ? row("Note", esc(message)) : ""}
</table>

<p style="margin:8px 0 8px;font-family:${FONT_BODY};font-size:10px;font-weight:bold;letter-spacing:0;text-transform:uppercase;color:${BRAND.muted};">Products requested (${products.length})</p>
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND.border};">
  ${itemRows}
</table>

<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:24px;">
  <tr>
    <td style="padding-top:8px;">
      ${button(`Reply to ${name}`, `mailto:${esc(email)}`)}
    </td>
  </tr>
</table>`;

    return emailShell({
        preheader: `New product enquiry from ${name}.`,
        title: "New product enquiry",
        bodyHtml,
    });
};
