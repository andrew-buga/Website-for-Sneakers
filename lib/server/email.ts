import { Resend } from "resend"

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? "Streater Store <onboarding@resend.dev>"
}

function emailLayout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#111111;padding:28px 40px;">
            <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Streater Store</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            ${body}
          </td>
        </tr>
        <tr>
          <td style="background:#f4f4f5;padding:24px 40px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">Streater Store &bull; You received this email because you have an account with us. If you did not request this, please ignore this email.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const resend = getResendClient()
  if (!resend) {
    console.warn("sendVerificationEmail: RESEND_API_KEY not configured, skipping.")
    return
  }

  const verifyUrl = `${getAppUrl()}/api/auth/verify-email?token=${token}`

  const body = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#111111;">Welcome, ${name}!</h1>
    <p style="margin:0 0 24px;font-size:16px;color:#6b7280;line-height:1.6;">Thanks for registering. Please verify your email address so you can start shopping.</p>
    <a href="${verifyUrl}" style="display:inline-block;background:#111111;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Verify Email Address</a>
    <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">This link expires in <strong>24 hours</strong>. If you did not create an account, you can safely ignore this email.</p>
    <p style="margin:16px 0 0;font-size:12px;color:#d1d5db;word-break:break-all;">Or copy this link: ${verifyUrl}</p>
  `

  await resend.emails.send({
    from: getFromAddress(),
    to: email,
    subject: "Verify your email address – Streater Store",
    html: emailLayout("Verify your email", body),
  })
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resend = getResendClient()
  if (!resend) {
    console.warn("sendPasswordResetEmail: RESEND_API_KEY not configured, skipping.")
    return
  }

  const resetUrl = `${getAppUrl()}/account/reset-password?token=${token}`

  const body = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#111111;">Reset your password</h1>
    <p style="margin:0 0 4px;font-size:16px;color:#6b7280;line-height:1.6;">Hi ${name},</p>
    <p style="margin:0 0 24px;font-size:16px;color:#6b7280;line-height:1.6;">We received a request to reset your Streater Store password. Click the button below to set a new password.</p>
    <a href="${resetUrl}" style="display:inline-block;background:#111111;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Reset Password</a>
    <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">This link expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.</p>
    <p style="margin:16px 0 0;font-size:12px;color:#d1d5db;word-break:break-all;">Or copy this link: ${resetUrl}</p>
  `

  await resend.emails.send({
    from: getFromAddress(),
    to: email,
    subject: "Reset your Streater Store password",
    html: emailLayout("Reset your password", body),
  })
}
