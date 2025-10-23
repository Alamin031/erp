"use client";

import { useMemo } from "react";
import { useWorkOrders } from "@/store/useWorkOrders";

export function WorkOrderStatsCards() {
  const { workOrders } = useWorkOrders();
  const stats = useMemo(() => {
    const nowStr = new Date().toDateString();
    const open = workOrders.filter(w => w.status === "Open").length;
    const overdue = workOrders.filter(w => w.dueAt && new Date(w.dueAt) < new Date() && w.status !== "Completed").length;
    const inProg = workOrders.filter(w => w.status === "In Progress").length;
    const completedToday = workOrders.filter(w => w.completedAt && new Date(w.completedAt).toDateString() === nowStr).length;
    return { open, overdue, inProg, completedToday };
  }, [workOrders]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="dashboard-section"><div className="stat-label">Open Work Orders</div><div className="stat-value" style={{ color: "var(--primary)" }}>{stats.open}</div></div>
      <div className="dashboard-section"><div className="stat-label">Overdue (SLA)</div><div className="stat-value" style={{ color: "var(--danger)" }}>{stats.overdue}</div></div>
      <div className="dashboard-section"><div className="stat-label">In Progress</div><div className="stat-value" style={{ color: "var(--warning)" }}>{stats.inProg}</div></div>
      <div className="dashboard-section"><div className="stat-label">Completed Today</div><div className="stat-value" style={{ color: "var(--success)" }}>{stats.completedToday}</div></div>
    </div>
  );
}
