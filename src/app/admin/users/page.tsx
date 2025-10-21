import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await getSession();

  if (!session || (session.user as any).role !== "super_admin") {
    redirect("/unauthorized");
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">User Management</h1>
          <p className="dashboard-subtitle">Manage system users and permissions</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h2 className="section-title">Users</h2>
            <div style={{ padding: "20px", textAlign: "center", color: "var(--secondary)" }}>
              <p>User management interface coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
