"use client";

import { useState, useMemo } from "react";
import { Task, HousekeepingStaff } from "@/types/task";
import { FilterOptions } from "./task-filter-bar";

interface TaskTableProps {
  tasks: Task[];
  staff: HousekeepingStaff[];
  filters: FilterOptions;
  onTaskClick?: (task: Task) => void;
}

const ITEMS_PER_PAGE = 10;

export function TaskTable({
  tasks,
  staff,
  filters,
  onTaskClick,
}: TaskTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }

    if (filters.taskType) {
      filtered = filtered.filter(t => t.taskType === filters.taskType);
    }

    if (filters.assignedStaffId) {
      filtered = filtered.filter(t => t.assignedStaffId === filters.assignedStaffId);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(t => new Date(t.dueDate) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => new Date(t.dueDate) <= new Date(filters.dateTo));
    }

    return filtered;
  }, [tasks, filters]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "var(--danger)";
      case "Medium":
        return "var(--warning)";
      case "Low":
        return "var(--success)";
      default:
        return "var(--secondary)";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "var(--success)";
      case "In Progress":
        return "var(--primary)";
      case "Pending":
        return "var(--warning)";
      default:
        return "var(--secondary)";
    }
  };

  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || "Unassigned";
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Task Type</th>
              <th>Staff</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map(task => (
              <tr
                key={task.id}
                onClick={() => onTaskClick?.(task)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="booking-id" style={{ color: "var(--primary)" }}>
                    {task.roomNumber}
                  </span>
                </td>
                <td>{task.taskType}</td>
                <td>{getStaffName(task.assignedStaffId)}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor: `${getPriorityColor(task.priority)}20`,
                      color: getPriorityColor(task.priority),
                    }}
                  >
                    {task.priority}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor: `${getStatusColor(task.status)}20`,
                      color: getStatusColor(task.status),
                    }}
                  >
                    {task.status}
                  </span>
                </td>
                <td style={{ fontSize: "13px", color: "var(--secondary)" }}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td style={{ fontSize: "13px", color: "var(--secondary)", maxWidth: "200px" }}>
                  {task.description.substring(0, 30)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTasks.length > ITEMS_PER_PAGE && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <span style={{ fontSize: "14px", color: "var(--secondary)" }}>
            Page {currentPage} of {totalPages} ({filteredTasks.length} total)
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
