"use client";

import { useState } from "react";
import { useLeads } from "@/store/useLeads";

export function LeadsSearchBar() {
  const { filters, setFilters } = useLeads();
  const [q, setQ] = useState(filters.searchQuery || "");

  return (
    <div className="search-bar">
      <input
        className="form-input"
        placeholder="Quick search by lead name or company..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setFilters({ ...filters, searchQuery: q });
        }}
        aria-label="Search leads"
      />
      <button
        className="btn btn-secondary"
        onClick={() => setFilters({ ...filters, searchQuery: q })}
        aria-label="Apply search"
      >
        Search
      </button>
    </div>
  );
}
