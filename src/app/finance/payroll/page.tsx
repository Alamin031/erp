import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { PayrollPageClient } from "./page-client";
import { redirect } from "next/navigation";

export default async function PayrollPage() {
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
      <div className="dashboard-container">
        <PayrollPageClient />
      </div>
    </DashboardLayout>
  );
}
