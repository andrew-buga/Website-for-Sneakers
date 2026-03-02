import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`

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