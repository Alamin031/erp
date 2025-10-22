import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";

export default async function ShopeeSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  const allowedRoles = ["super_admin", "general_manager"];

  if (!allowedRoles.includes(userRole)) {
    redirect("/unauthorized");
  }

  return (
    <DashboardLayout>
      <div style={{ padding: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px" }}>Shopee Settings</h1>
        <div style={{ background: "#fff", borderRadius: "8px", padding: "24px", border: "1px solid #eef2f6" }}>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Shopee settings configuration is under development.</p>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "12px" }}>Configure Shopee API credentials, sync settings, and integration preferences.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
