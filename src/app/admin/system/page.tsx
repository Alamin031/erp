import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SystemSettingsPageClient } from "./page-client";

export default async function SystemPage() {
  const session = await getSession();

  if (!session || (session.user as any).role !== "super_admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      <div className="bg-[var(--card-bg)] border-b border-[var(--border)] px-8 py-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          System Settings
        </h1>
        <p className="text-[var(--secondary)] mt-1">
          Configure system-wide preferences and options
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <SystemSettingsPageClient />
      </div>
    </div>
  );
}
