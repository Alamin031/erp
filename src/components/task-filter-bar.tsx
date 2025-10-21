"use client";

import { useState } from "react";
import { Task, TaskPriority, TaskStatus, TaskType } from "@/types/task";
import { HousekeepingStaff } from "@/types/task";

interface FilterBarProps {
  tasks: Task[];
  staff: HousekeepingStaff[];
  onFilterChange?: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  status: TaskStatus | "";
  priority: TaskPriority | "";
  taskType: TaskType | "";
  assignedStaffId: string;
  dateFrom: string;
  dateTo: string;
}

export function FilterBar({ tasks, staff, onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: "",
    priority: "",
    taskType: "",
    assignedStaffId: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      status: "",
      priority: "",
      taskType: "",
      assignedStaffId: "",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "");

  return (
    <div className="filters-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "500",
              color: "var(--primary)",
              background: "transparent",
              border: "1px solid var(--primary)",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label className="form-label">Status</label>
          <select
            className="form-input"
            value={filters.status}
            onChange={e => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Priority</label>
          <select
            className="form-input"
            value={filters.priority}
            onChange={e => handleFilterChange("priority", e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Task Type</label>
          <select
            className="form-input"
            value={filters.taskType}
            onChange={e => handleFilterChange("taskType", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inspection">Inspection</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Assigned Staff</label>
          <select
            className="form-input"
            value={filters.assignedStaffId}
            onChange={e => handleFilterChange("assignedStaffId", e.target.value)}
          >
            <option value="">All Staff</option>
            {staff.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">From Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.dateFrom}
            onChange={e => handleFilterChange("dateFrom", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="form-label">To Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.dateTo}
            onChange={e => handleFilterChange("dateTo", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
