import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";

export default async function EquipmentPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  const allowedRoles = ["super_admin", "general_manager", "maintenance_manager"];

  if (!allowedRoles.includes(userRole)) {
    redirect("/unauthorized");
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Equipment Management</h1>
          <p className="dashboard-subtitle">Track and maintain equipment</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h2 className="section-title">Equipment Inventory</h2>
            <div style={{ padding: "20px", textAlign: "center", color: "var(--secondary)" }}>
              <p>Equipment interface coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
