import nodemailer from 'nodemailer';
import { formatCurrency } from '@/lib/shipping';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false, // port 587 uses STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  color?: string | null;
  size?: string | null;
}

interface SendOrderConfirmationParams {
  to: string;
  orderNumber: string;
  firstName: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: {
    street: string;
    apartment?: string | null;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
}

export async function sendOrderConfirmationEmail(
  params: SendOrderConfirmationParams,
) {
  const {
    to,
    orderNumber,
    firstName,
    items,
    subtotal,
    shippingCost,
    tax,
    total,
    shippingAddress,
  } = params;

  const brand = process.env.FROM_NAME ?? 'VerseTwoFits';
  const from = `${brand} <${process.env.FROM_EMAIL}>`;
  const primary = '#303d32';
  const light = '#f5f5f0';

  const itemRows = items
    .map((item) => {
      const variant = [item.color, item.size].filter(Boolean).join(' · ');
      return `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
            ${
              item.image
                ? `<img src="${item.image}" alt="${item.name}" width="60" height="60"
                     style="border-radius: 6px; object-fit: cover; display: block; margin-right: 0;" />`
                : `<div style="width:60px;height:60px;background:#e5e7eb;border-radius:6px;"></div>`
            }
          </td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
            <p style="margin:0; font-weight:600; color:#111827;">${item.name}</p>
            ${variant ? `<p style="margin:4px 0 0; font-size:13px; color:#6b7280;">${variant}</p>` : ''}
            <p style="margin:4px 0 0; font-size:13px; color:#6b7280;">Qty: ${item.quantity}</p>
          </td>
          <td style="padding: 14px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top; text-align:right; font-weight:600; color:#111827; white-space:nowrap;">
            ${formatCurrency(item.price * item.quantity)}
          </td>
        </tr>
      `;
    })
    .join('');

  const addressLine2 = shippingAddress.apartment
    ? `<br/>${shippingAddress.apartment}`
    : '';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed – ${brand}</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f0; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:${primary}; border-radius:12px 12px 0 0; padding: 36px 40px;">
              <h1 style="margin:0; color:#ffffff; font-size:26px; letter-spacing:2px; text-transform:uppercase;">
                ${brand}
              </h1>
            </td>
          </tr>

          <!-- Confirmation banner -->
          <tr>
            <td style="background:#ffffff; padding: 40px 40px 28px;">
              <p style="margin:0 0 8px; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Order Confirmed</p>
              <h2 style="margin:0 0 16px; font-size:28px; color:#111827; font-weight:700;">
                Thank you, ${firstName}!
              </h2>
              <p style="margin:0; font-size:15px; color:#4b5563; line-height:1.6;">
                We've received your order and it's now being processed. You'll receive
                shipping and tracking information as soon as your order is dispatched.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px; background:${light}; border-radius:8px; padding:0;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Order number</p>
                    <p style="margin:6px 0 0; font-size:18px; font-weight:700; color:${primary}; font-family:monospace; letter-spacing:1px;">
                      ${orderNumber}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="background:#ffffff; padding: 0 40px 28px;">
              <h3 style="margin:0 0 16px; font-size:16px; font-weight:600; color:#111827; border-top:1px solid #e5e7eb; padding-top:24px;">
                Your Items
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="background:#ffffff; padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0; color:#6b7280; font-size:14px;">Subtotal</td>
                  <td style="padding:6px 0; color:#111827; font-size:14px; text-align:right;">${formatCurrency(subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#6b7280; font-size:14px;">Shipping</td>
                  <td style="padding:6px 0; color:#111827; font-size:14px; text-align:right;">${formatCurrency(shippingCost)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#6b7280; font-size:14px;">Tax</td>
                  <td style="padding:6px 0; color:#111827; font-size:14px; text-align:right;">${formatCurrency(tax)}</td>
                </tr>
                <tr>
                  <td style="padding:16px 0 0; font-size:16px; font-weight:700; color:#111827; border-top:2px solid #111827;">
                    Total Paid
                  </td>
                  <td style="padding:16px 0 0; font-size:16px; font-weight:700; color:${primary}; border-top:2px solid #111827; text-align:right;">
                    ${formatCurrency(total)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping address -->
          <tr>
            <td style="background:#ffffff; padding: 0 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:${light}; border-radius:8px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 10px; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">
                      Shipping to
                    </p>
                    <p style="margin:0; font-size:14px; color:#111827; line-height:1.7;">
                      ${shippingAddress.street}${addressLine2}<br/>
                      ${shippingAddress.city}, ${shippingAddress.province} ${shippingAddress.postalCode}<br/>
                      ${shippingAddress.country}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:${primary}; border-radius:0 0 12px 12px; padding: 28px 40px;">
              <p style="margin:0 0 8px; font-size:13px; color:rgba(255,255,255,0.7);">
                Questions? Reply to this email or contact us anytime.
              </p>
              <p style="margin:0; font-size:12px; color:rgba(255,255,255,0.4);">
                © ${new Date().getFullYear()} ${brand}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();

  await transporter.sendMail({
    from,
    to,
    subject: `Order Confirmed – ${orderNumber} | ${brand}`,
    html,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string,
) {
  const brand = process.env.FROM_NAME ?? 'VerseTwoFits';
  const from = `${brand} <${process.env.FROM_EMAIL}>`;
  const primary = '#303d32';
  const light = '#f5f5f0';
  const firstName = name?.split(' ')[0] ?? 'there';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password – ${brand}</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f0; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:${primary}; border-radius:12px 12px 0 0; padding: 36px 40px;">
              <h1 style="margin:0; color:#ffffff; font-size:26px; letter-spacing:2px; text-transform:uppercase;">
                ${brand}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff; padding: 40px 40px 36px;">
              <p style="margin:0 0 8px; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Password Reset</p>
              <h2 style="margin:0 0 16px; font-size:26px; color:#111827; font-weight:700;">
                Hi ${firstName},
              </h2>
              <p style="margin:0 0 24px; font-size:15px; color:#4b5563; line-height:1.6;">
                We received a request to reset the password for your ${brand} account.
                Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <a href="${resetUrl}"
                       style="display:inline-block; background:${primary}; color:#ffffff; font-size:15px; font-weight:600;
                              text-decoration:none; padding:14px 36px; border-radius:8px; letter-spacing:0.5px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback URL -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:${light}; border-radius:8px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">
                      Or copy this link into your browser
                    </p>
                    <p style="margin:0; font-size:12px; color:${primary}; word-break:break-all; font-family:monospace;">
                      ${resetUrl}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0; font-size:13px; color:#9ca3af; line-height:1.6;">
                If you did not request a password reset, you can safely ignore this email —
                your password will not change.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:${primary}; border-radius:0 0 12px 12px; padding: 28px 40px;">
              <p style="margin:0 0 8px; font-size:13px; color:rgba(255,255,255,0.7);">
                Questions? Reply to this email or contact us anytime.
              </p>
              <p style="margin:0; font-size:12px; color:rgba(255,255,255,0.4);">
                © ${new Date().getFullYear()} ${brand}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();

  await transporter.sendMail({
    from,
    to,
    subject: `Reset your password – ${brand}`,
    html,
  });
}
