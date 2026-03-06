import InfoPageLayout from "@/components/info-page-layout"

export default function PrivacyPolicyPage() {
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="How we store and process customer data.">
      <p>We store account and order data required to process purchases and support delivery. Personal data is never shared with third parties except for payment and shipping providers.</p>
      <p>Authentication data is protected with hashed passwords and secure cookies. Payment information is processed securely and never stored on our servers.</p>
      <p>Customers can request profile updates or account deletion through support contacts. Data removal requests are processed within 7 days.</p>
      <p>For privacy questions, contact us at official.andrew.buga@gmail.com.</p>
    </InfoPageLayout>
  )
}

