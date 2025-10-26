import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { ExpensesPageClient } from "./page-client";

export default async function ExpensesPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const userRole = (session.user as any).role;
  const allowed = ["super_admin","general_manager","finance_manager","employee"];
  if (!allowed.includes(userRole)) redirect('/unauthorized');

  return (
    <DashboardLayout>
      <ExpensesPageClient />
    </DashboardLayout>
  );
}
