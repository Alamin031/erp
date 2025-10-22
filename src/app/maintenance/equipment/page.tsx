import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { EquipmentPageClient } from "./page-client";

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
          <p className="dashboard-subtitle">Track, maintain, and manage equipment inventory</p>
        </div>

        <div className="dashboard-grid">
          <EquipmentPageClient />
        </div>
      </div>
    </DashboardLayout>
  );
}
