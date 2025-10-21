import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { ROLE_LABELS } from "@/types/auth";
import type { UserRole } from "@/types/auth";

// Dashboard components for each role
const SuperAdminDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">System Analytics</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Properties</div>
          <div className="stat-value">5</div>
          <div className="stat-change">+2 this quarter</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Users</div>
          <div className="stat-value">247</div>
          <div className="stat-change">+18 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">System Uptime</div>
          <div className="stat-value">99.98%</div>
          <div className="stat-change">↑ 0.02% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">API Calls</div>
          <div className="stat-value">2.4M</div>
          <div className="stat-change">+320K this month</div>
        </div>
      </div>
    </div>
    <div className="dashboard-section">
      <h2 className="section-title">Recent Activities</h2>
      <div className="activity-list">
        <div className="activity-item">New user created: John Manager (General Manager)</div>
        <div className="activity-item">System backup completed successfully</div>
        <div className="activity-item">New role permissions updated</div>
      </div>
    </div>
  </div>
);

const GeneralManagerDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Hotel Performance</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Occupancy Rate</div>
          <div className="stat-value">87%</div>
          <div className="stat-change">+5% vs last week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Revenue (MTD)</div>
          <div className="stat-value">$245.8K</div>
          <div className="stat-change">+12% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Guest Satisfaction</div>
          <div className="stat-value">4.7/5</div>
          <div className="stat-change">+0.2 vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Staff Count</div>
          <div className="stat-value">156</div>
          <div className="stat-change">+3 new hires</div>
        </div>
      </div>
    </div>
    <div className="dashboard-section">
      <h2 className="section-title">Key Metrics</h2>
      <div className="metrics-list">
        <div className="metric-item">
          <span>Average Daily Rate:</span>
          <span className="metric-value">$285</span>
        </div>
        <div className="metric-item">
          <span>Rooms Available:</span>
          <span className="metric-value">32/285</span>
        </div>
        <div className="metric-item">
          <span>Pending Reservations:</span>
          <span className="metric-value">18</span>
        </div>
      </div>
    </div>
  </div>
);

const FrontDeskDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Today's Check-ins</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Expected Arrivals</div>
          <div className="stat-value">24</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Checked In</div>
          <div className="stat-value">12</div>
        </div>
      </div>
    </div>
    <div className="dashboard-section">
      <h2 className="section-title">Today's Check-outs</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Expected Departures</div>
          <div className="stat-value">18</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Checked Out</div>
          <div className="stat-value">8</div>
        </div>
      </div>
    </div>
  </div>
);

const HousekeepingDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Room Status</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Occupied</div>
          <div className="stat-value">245</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Vacant & Dirty</div>
          <div className="stat-value">18</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Vacant & Clean</div>
          <div className="stat-value">22</div>
        </div>
      </div>
    </div>
    <div className="dashboard-section">
      <h2 className="section-title">Task Queue</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Pending Tasks</div>
          <div className="stat-value">8</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">5</div>
        </div>
      </div>
    </div>
  </div>
);

const FinanceDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Financial Summary</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">$847.2K</div>
          <div className="stat-change">+8% vs last period</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Outstanding AR</div>
          <div className="stat-value">$54.3K</div>
          <div className="stat-change">-12% vs last period</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Invoices Pending</div>
          <div className="stat-value">34</div>
        </div>
      </div>
    </div>
  </div>
);

const SalesDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Campaign Performance</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Active Campaigns</div>
          <div className="stat-value">7</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-value">12.4%</div>
          <div className="stat-change">+2.1% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bookings</div>
          <div className="stat-value">156</div>
          <div className="stat-change">+24 this month</div>
        </div>
      </div>
    </div>
  </div>
);

const ConciergeDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Guest Services</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Active Guests</div>
          <div className="stat-value">245</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Service Requests</div>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed Today</div>
          <div className="stat-value">28</div>
        </div>
      </div>
    </div>
  </div>
);

const MaintenanceDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Work Orders</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Open Orders</div>
          <div className="stat-value">14</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">6</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">89</div>
        </div>
      </div>
    </div>
  </div>
);

const dashboardComponents: Record<UserRole, () => React.ReactNode> = {
  super_admin: SuperAdminDashboard,
  general_manager: GeneralManagerDashboard,
  front_desk_manager: FrontDeskDashboard,
  front_desk_agent: FrontDeskDashboard,
  housekeeping_manager: HousekeepingDashboard,
  housekeeping_staff: HousekeepingDashboard,
  finance_manager: FinanceDashboard,
  sales_marketing: SalesDashboard,
  concierge: ConciergeDashboard,
  maintenance_manager: MaintenanceDashboard,
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const DashboardContent = dashboardComponents[user.role];

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">
            {ROLE_LABELS[user.role]} Dashboard
          </h1>
          <p className="dashboard-subtitle">Welcome back, {user.name}!</p>
        </div>
        <DashboardContent />
      </div>
    </DashboardLayout>
  );
}
