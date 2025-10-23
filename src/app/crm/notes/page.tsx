import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import NotesClientPage from './page-client';

export default async function NotesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  const allowedRoles = ["super_admin"];

  if (!allowedRoles.includes(userRole)) {
    redirect("/unauthorized");
  }

  return (
    <DashboardLayout>
      <div style={{ padding: "24px" }}>
        <NotesClientPage />
      </div>
    </DashboardLayout>
  );
}
