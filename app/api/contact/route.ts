import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, subject, message } = body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (message.trim().length < 10) {
    return NextResponse.json(
      { error: "Message must be at least 10 characters" },
      { status: 400 },
    );
  }

  const brand = process.env.FROM_NAME ?? "VerseTwoFits";
  const fromAddress = `${brand} <${process.env.FROM_EMAIL}>`;
  const storeInbox = process.env.SMTP_USER ?? process.env.FROM_EMAIL ?? "";
  const primary = "#303d32";

  // ── Notification email to the store ──────────────────────────────────────
  await transporter.sendMail({
    from: fromAddress,
    to: storeInbox,
    replyTo: `${name.trim()} <${email.trim()}>`,
    subject: `[Contact Form] ${subject.trim()} — from ${name.trim()}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f0;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td align="center" style="background:${primary};border-radius:12px 12px 0 0;padding:32px 40px;">
            <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:2px;text-transform:uppercase;">${brand}</h1>
            <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.6);letter-spacing:1px;text-transform:uppercase;">New Contact Form Submission</p>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:36px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;border-radius:10px;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;width:100px;">From</td>
                      <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">${name.trim()}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Email</td>
                      <td style="padding:6px 0;font-size:14px;color:${primary};">
                        <a href="mailto:${email.trim()}" style="color:${primary};text-decoration:none;">${email.trim()}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Subject</td>
                      <td style="padding:6px 0;font-size:14px;color:#111827;">${subject.trim()}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <h3 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#111827;text-transform:uppercase;letter-spacing:1px;">Message</h3>
            <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message.trim()}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
              <tr>
                <td align="center">
                  <a href="mailto:${email.trim()}" style="display:inline-block;background:${primary};color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;">
                    Reply to ${name.trim().split(" ")[0]}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="background:${primary};border-radius:0 0 12px 12px;padding:22px 40px;">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);">
              © ${new Date().getFullYear()} ${brand}. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  });

  // ── Confirmation email to the sender ─────────────────────────────────────
  const firstName = name.trim().split(" ")[0];
  await transporter.sendMail({
    from: fromAddress,
    to: email.trim(),
    subject: `We got your message — ${brand}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f0;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td align="center" style="background:${primary};border-radius:12px 12px 0 0;padding:36px 40px;">
            <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:2px;text-transform:uppercase;">${brand}</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:40px 40px 36px;">
            <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Message Received</p>
            <h2 style="margin:0 0 16px;font-size:26px;color:#111827;font-weight:700;">Thanks, ${firstName}!</h2>
            <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.6;">
              We've received your message and will get back to you within
              <strong style="color:#111827;">1–2 business days</strong>.
              In the meantime, feel free to browse our latest drops.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;border-radius:8px;margin-bottom:28px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 6px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Your subject</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${subject.trim()}</p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${process.env.NEXTAUTH_URL ?? "https://versetwofit.com"}/products"
                     style="display:inline-block;background:${primary};color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;">
                    Shop New Arrivals
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="background:${primary};border-radius:0 0 12px 12px;padding:28px 40px;">
            <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.7);">
              Questions? Reply to this email and we'll help you out.
            </p>
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);">
              © ${new Date().getFullYear()} ${brand}. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  });

  return NextResponse.json({ message: "Message sent successfully" });
}
