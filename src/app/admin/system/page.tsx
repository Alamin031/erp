import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { SystemSettingsPageClient } from "./page-client";

export default async function SystemPage() {
  const session = await getSession();

  if (!session || (session.user as any).role !== "super_admin") {
    redirect("/unauthorized");
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">System Settings</h1>
          <p className="dashboard-subtitle">Configure system-wide preferences and options</p>
        </div>

        <div className="dashboard-grid">
          <SystemSettingsPageClient />
        </div>
      </div>
    </DashboardLayout>
  );
}
