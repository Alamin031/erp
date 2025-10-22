import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { GuestServices } from "@/components/guest-services";
import { redirect } from "next/navigation";

async function loadDemoData() {
  try {
    const [requestsRes, staffRes] = await Promise.all([
      fetch(new URL("public/demo/demoRequests.json", process.cwd()), { cache: "no-store" }),
      fetch(new URL("public/demo/staff.json", process.cwd()), { cache: "no-store" }),
    ]);

    const requests = requestsRes.ok ? await requestsRes.json() : [];
    const staff = staffRes.ok ? await staffRes.json() : [];

    return { requests, staff };
  } catch {
    return { requests: [], staff: [] };
  }
}

export default async function ServicesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  const allowedRoles = ["super_admin", "general_manager", "concierge"];

  if (!allowedRoles.includes(userRole)) {
    redirect("/unauthorized");
  }

  const { requests, staff } = await loadDemoData();

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Guest Services</h1>
          <p className="dashboard-subtitle">Manage guest requests and services</p>
        </div>

        <GuestServices initialRequests={requests} initialStaff={staff} />
      </div>
    </DashboardLayout>
  );
}
