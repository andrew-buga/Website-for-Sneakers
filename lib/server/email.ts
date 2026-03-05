import { Resend } from "resend"

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const resend = getResendClient()
  if (!resend) return

  const verifyUrl = `${getAppUrl()}/api/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: "Nike Store <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #111;">Welcome, ${name}!</h1>
        <p>Thanks for registering. Please verify your email address by clicking the button below.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">This link expires in 24 hours.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resend = getResendClient()
  if (!resend) return

  const resetUrl = `${getAppUrl()}/account/reset-password?token=${token}`

  await resend.emails.send({
    from: "Nike Store <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #111;">Hi ${name},</h1>
        <p>We received a request to reset your password. Click the button below to set a new one.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">This link expires in 1 hour. If you did not request this, you can ignore this message.</p>
      </div>
    `,
  })
}
