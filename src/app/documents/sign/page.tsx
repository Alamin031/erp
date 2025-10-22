import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { SignPageClient } from "./page-client";

export default async function SignPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <SignPageClient />
    </DashboardLayout>
  );
}
