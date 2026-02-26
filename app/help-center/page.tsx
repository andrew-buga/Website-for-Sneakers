import InfoPageLayout from "@/components/info-page-layout"

export default function HelpCenterPage() {
  return (
    <InfoPageLayout title="Help Center" subtitle="Support for orders, account, and delivery.">
      <p>For account issues, open your profile page and verify your details and default delivery address.</p>
      <p>For checkout issues, ensure selected size, stock availability, and delivery data are complete.</p>
      <p>For any unresolved issue, use the contact page and include your order id if available.</p>
    </InfoPageLayout>
  )
}
