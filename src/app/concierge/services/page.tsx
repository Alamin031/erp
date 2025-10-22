"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { GuestServices } from "@/components/guest-services";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [demoData, setDemoData] = useState({ requests: [], staff: [] });

  useEffect(() => {
    async function init() {
      const sessionData = await getSession();

      if (!sessionData) {
        router.push("/login");
        return;
      }

      const userRole = (sessionData.user as any).role;
      const allowedRoles = ["super_admin", "general_manager", "concierge"];

      if (!allowedRoles.includes(userRole)) {
        router.push("/unauthorized");
        return;
      }

      setSession(sessionData);

      try {
        const [requestsRes, staffRes] = await Promise.all([
          fetch("/demo/demoRequests.json"),
          fetch("/demo/staff.json"),
        ]);

        const requests = requestsRes.ok ? await requestsRes.json() : [];
        const staff = staffRes.ok ? await staffRes.json() : [];

        setDemoData({ requests, staff });
      } catch (error) {
        console.error("Failed to load demo data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="dashboard-container">
          <div className="text-center py-12">
            <p className="text-secondary">Loading Guest Services...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Guest Services</h1>
          <p className="dashboard-subtitle">Manage guest requests and services</p>
        </div>

        <GuestServices initialRequests={demoData.requests} initialStaff={demoData.staff} />
      </div>
    </DashboardLayout>
  );
}
