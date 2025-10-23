"use client";

import { useLeads } from "@/store/useLeads";
import { LeadStage, LeadStatus } from "@/types/leads";

export function LeadsFiltersBar() {
  const { filters, setFilters, salesAgents, leadSources } = useLeads();

  const handleChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const stages: (LeadStage | "All")[] = [
    "All",
    "New",
    "Contacted",
    "Qualified",
    "Proposal",
    "Closed Won",
    "Closed Lost",
  ];

  const statuses: (LeadStatus | "All")[] = ["All", "Active", "Converted", "Lost"];

  return (
    <div className="filters-row">
      <div className="filter-group">
        <label className="form-label">Stage</label>
        <select
          className="form-input"
          value={filters.stage || "All"}
          onChange={(e) => handleChange("stage", e.target.value as LeadStage | "All")}
        >
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="form-label">Assigned Sales Rep</label>
        <select
          className="form-input"
          value={filters.assignedTo || "All"}
          onChange={(e) => handleChange("assignedTo", e.target.value)}
        >
          <option value="All">All</option>
          {salesAgents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="form-label">Lead Source</label>
        <select
          className="form-input"
          value={filters.leadSource || "All"}
          onChange={(e) => handleChange("leadSource", e.target.value)}
        >
          <option value="All">All</option>
          {leadSources.map((s) => (
            <option key={s.id} value={s.displayName}>
              {s.displayName}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="form-label">Status</label>
        <select
          className="form-input"
          value={filters.status || "All"}
          onChange={(e) => handleChange("status", e.target.value as LeadStatus | "All")}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="form-label">From</label>
        <input
          type="date"
          className="form-input"
          value={filters.dateFrom || ""}
          onChange={(e) => handleChange("dateFrom", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="form-label">To</label>
        <input
          type="date"
          className="form-input"
          value={filters.dateTo || ""}
          onChange={(e) => handleChange("dateTo", e.target.value)}
        />
      </div>
    </div>
  );
}
