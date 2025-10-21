import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { InvoicingPageClient } from "./page-client";

export default async function InvoicingPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  const allowedRoles = ["super_admin", "general_manager", "finance_manager"];

  if (!allowedRoles.includes(userRole)) {
    redirect("/unauthorized");
  }

  return (
    <DashboardLayout>
      <InvoicingPageClient />
    </DashboardLayout>
  );
}
