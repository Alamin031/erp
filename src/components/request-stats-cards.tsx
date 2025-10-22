"use client";

import { useGuestServices } from "@/store/useGuestServices";

export function RequestStatsCards() {
  const { getStats } = useGuestServices();
  const stats = getStats();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Analytics</h3>
      
      <div className="stat-card">
        <div className="stat-label">Requests per Type</div>
        <div className="stat-value text-base">See Queue</div>
        <div className="stat-change text-xs">Organized by priority</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Avg Response Time</div>
        <div className="stat-value">{stats.avgResponseTime}</div>
        <div className="stat-change">minutes</div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 stat-card">
          <div className="stat-label">Open</div>
          <div className="stat-value text-primary text-2xl">{stats.openRequests}</div>
        </div>
        <div className="flex-1 stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value text-warning text-2xl">{stats.inProgress}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Resolved Today</div>
        <div className="stat-value text-success text-2xl">{stats.resolvedToday}</div>
      </div>
    </div>
  );
}
