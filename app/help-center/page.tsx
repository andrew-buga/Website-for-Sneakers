import InfoPageLayout from "@/components/info-page-layout"

export default function HelpCenterPage() {
  return (
    <InfoPageLayout title="Help Center" subtitle="Support for orders, account, and delivery.">
      <p>For account issues, visit your profile page to review your details and set a default delivery address. You can update your email, phone, and shipping info at any time.</p>
      <p>For checkout problems, double-check selected size, stock status, and delivery information. If payment fails, try another method or contact support.</p>
      <p>Order tracking is available in your account. For lost packages or delays, contact support with your order ID.</p>
      <p>For any unresolved issue, use the contact page and include your order id if available. Our team responds within 24 hours on business days.</p>
    </InfoPageLayout>
  )
}
