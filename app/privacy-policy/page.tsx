import InfoPageLayout from "@/components/info-page-layout"

export default function PrivacyPolicyPage() {
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="How we store and process customer data.">
      <p>We store account and order data required to process purchases and support delivery.</p>
      <p>Authentication data is protected with hashed passwords and secure cookies.</p>
      <p>Customers can request profile updates or account deletion through support contacts.</p>
    </InfoPageLayout>
  )
}

