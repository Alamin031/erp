"use client";

import { useState } from "react";
import { useGuestServices } from "@/store/useGuestServices";
import { useToast } from "./toast";
import { ServiceRequest } from "@/types/guest-services";

interface ServiceRequestTableProps {
  onViewClick: (requestId: string) => void;
  onAssignClick: (requestId: string) => void;
  requests?: ServiceRequest[];
}

const priorityIcons: Record<string, string> = {
  Urgent: "🔴",
  High: "🟠",
  Normal: "🟡",
  Low: "🟢",
};

const statusColors: Record<string, string> = {
  Open: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-100 text-gray-800",
};

export function ServiceRequestTable({ onViewClick, onAssignClick }: ServiceRequestTableProps) {
  const { getFilteredRequests, deleteRequest, startRequest, staff, pagination, setPagination } = useGuestServices();
  const { showToast } = useToast();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const allRequests = getFilteredRequests();
  const totalPages = Math.ceil(allRequests.length / pagination.pageSize);

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === allRequests.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(allRequests.map((r) => r.id)));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      deleteRequest(id);
      showToast("Request deleted", "success");
      setSelectedRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleQuickStart = (id: string) => {
    const request = allRequests.find((r) => r.id === id);
    if (request && request.assignedStaffIds.length > 0) {
      startRequest(id, request.assignedStaffIds[0]);
      showToast("Request started", "success");
    } else {
      showToast("Please assign staff first", "error");
    }
  };

  const getAssignedStaffNames = (staffIds: string[]) => {
    return staff
      .filter((s) => staffIds.includes(s.id))
      .map((s) => s.name)
      .join(", ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-foreground">Service Requests</h2>
        <div className="text-sm text-secondary">
          Page {pagination.page} of {Math.max(1, totalPages)}
        </div>
      </div>

      <div className="table-container border rounded-lg">
        <table className="reservations-table">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>
                <input
                  type="checkbox"
                  checked={selectedRows.size > 0 && selectedRows.size === allRequests.length}
                  onChange={handleSelectAll}
                  title="Select all"
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th>ID</th>
              <th>Guest / Room</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Requested At</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allRequests.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-secondary">
                  No requests found
                </td>
              </tr>
            ) : (
              allRequests.map((request) => (
                <tr key={request.id}>
                  <td style={{ width: "30px" }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(request.id)}
                      onChange={() => handleSelectRow(request.id)}
                      title="Select row"
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>
                    <span className="booking-id cursor-pointer hover:text-primary" onClick={() => onViewClick(request.id)}>
                      {request.id}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p className="font-semibold text-sm">{request.guestName}</p>
                      <p className="text-xs text-secondary">Room {request.roomNumber}</p>
                    </div>
                  </td>
                  <td className="text-sm">{request.serviceType}</td>
                  <td>
                    <span className="text-lg">{priorityIcons[request.priority]}</span>
                  </td>
                  <td className="text-xs text-secondary">{formatDate(request.requestedAt)}</td>
                  <td>
                    <span className="text-xs">
                      {getAssignedStaffNames(request.assignedStaffIds) || "—"}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => onViewClick(request.id)}
                        className="action-btn"
                        title="View details"
                      >
                        👁️
                      </button>
                      {request.status === "Open" && (
                        <>
                          <button
                            onClick={() => onAssignClick(request.id)}
                            className="action-btn"
                            title="Assign staff"
                          >
                            👤
                          </button>
                          {request.assignedStaffIds.length > 0 && (
                            <button
                              onClick={() => handleQuickStart(request.id)}
                              className="action-btn"
                              title="Start request"
                            >
                              ▶️
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="action-btn action-btn-danger"
                        title="Delete request"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <select
            value={pagination.pageSize}
            onChange={(e) => setPagination(1, parseInt(e.target.value))}
            className="form-input w-32 text-sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setPagination(Math.max(1, pagination.page - 1), pagination.pageSize)}
              disabled={pagination.page === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              ← Previous
            </button>
            <button
              onClick={() => setPagination(Math.min(totalPages, pagination.page + 1), pagination.pageSize)}
              disabled={pagination.page === totalPages}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
