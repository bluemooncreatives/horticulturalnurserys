import {
    emailShell,
    eyebrow,
    heading,
    paragraph,
    button,
    firstName,
    siteUrl,
} from "./_shared";

/**
 * Warm welcome sent once an account's email has been verified. Confirms the
 * account is active and points the new customer to the shop.
 *
 * @param {object} [opts]
 * @param {string} [opts.name]
 */
export const welcomeEmail = (opts = {}) => {
    const { name } = opts;

    const bodyHtml = `
${eyebrow("Welcome")}
${heading("You're all set!")}
${paragraph(`Hi ${firstName(name)},`)}
${paragraph("Your email is verified and your account with Horticultural Development Centre is ready. Thank you for joining us.")}
${paragraph("Browse what's in season at the nursery — ornamental plants, seasonal flowers, lawn grass, manure, pots and garden implements. And if you're planning a garden rather than buying for one, write to us and we'll arrange a site visit.")}
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:8px 0;">
  <tr><td align="center">${button("Browse the catalogue", `${siteUrl()}/shop`)}</td></tr>
</table>`;

    return emailShell({
        preheader: "Your Horticultural Development Centre account is verified and ready.",
        title: "Welcome to Horticultural Development Centre",
        bodyHtml,
    });
};
