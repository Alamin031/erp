"use client";

import { useState } from "react";
import { useUsers } from "@/store/useUsers";
import { ROLE_LABELS } from "@/types/auth";

export function FiltersBar() {
  const { filters, setFilters } = useUsers();
  const [showFilters, setShowFilters] = useState(false);

  const roles = Object.keys(ROLE_LABELS) as Array<keyof typeof ROLE_LABELS>;
  const statuses = ["active", "disabled", "pending_invite"] as const;

  const handleRoleChange = (value: string) => {
    setFilters({ ...filters, role: value === "All" ? "All" : (value as any) });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value === "All" ? "All" : (value as any) });
  };

  const handleMFAChange = (value: string) => {
    setFilters({ ...filters, mfaEnabled: value as any });
  };

  const clearFilters = () => {
    setFilters({
      role: "All",
      status: "All",
      mfaEnabled: "All",
    });
  };

  const activeFilterCount = [
    filters.role !== "All",
    filters.status !== "All",
    filters.mfaEnabled !== "All",
  ].filter(Boolean).length;

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        className={`btn ${showFilters ? "btn-primary" : "btn-secondary"}`}
        onClick={() => setShowFilters(!showFilters)}
      >
        🔽 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      {showFilters && (
        <div className="flex gap-2 flex-wrap">
          <select
            value={filters.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="form-input text-sm"
          >
            <option value="All">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="form-input text-sm"
          >
            <option value="All">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </option>
            ))}
          </select>

          <select
            value={filters.mfaEnabled}
            onChange={(e) => handleMFAChange(e.target.value)}
            className="form-input text-sm"
          >
            <option value="All">All Users</option>
            <option value="true">MFA Enabled</option>
            <option value="false">MFA Disabled</option>
          </select>

          {activeFilterCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
