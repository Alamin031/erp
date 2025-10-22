"use client";

import { useState } from "react";
import { Guest } from "@/types/guest";
import { useGuests } from "@/store/useGuests";
import { useToast } from "./toast";

interface GuestsTableProps {
  guests: Guest[];
  onViewClick: (guestId: string) => void;
  onEditClick: (guestId: string) => void;
  pagination: { page: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
}

const statusColors: Record<string, string> = {
  "Checked-in": "bg-green-100 text-green-800",
  "Checked-out": "bg-gray-100 text-gray-800",
  "Reserved": "bg-blue-100 text-blue-800",
  "Cancelled": "bg-red-100 text-red-800",
};

export function GuestsTable({
  guests,
  onViewClick,
  onEditClick,
  pagination,
  onPaginationChange,
}: GuestsTableProps) {
  const { deleteGuest } = useGuests();
  const { showToast } = useToast();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const totalPages = Math.ceil(guests.length / pagination.pageSize);
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  const pageGuests = guests.slice(start, end);

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
    if (selectedRows.size === pageGuests.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(pageGuests.map((g) => g.id)));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this guest?")) {
      deleteGuest(id);
      showToast("Guest deleted", "success");
      setSelectedRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (id: string) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-cyan-500"];
    return colors[id.charCodeAt(0) % colors.length];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-foreground">Guests</h2>
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
                  checked={selectedRows.size > 0 && selectedRows.size === pageGuests.length}
                  onChange={handleSelectAll}
                  title="Select all"
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th style={{ width: "40px" }}>Avatar</th>
              <th>Guest Name</th>
              <th>Room / Floor</th>
              <th>Contact</th>
              <th>Check-in</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageGuests.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-secondary">
                  No guests found
                </td>
              </tr>
            ) : (
              pageGuests.map((guest) => (
                <tr key={guest.id}>
                  <td style={{ width: "30px" }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(guest.id)}
                      onChange={() => handleSelectRow(guest.id)}
                      title="Select row"
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td style={{ width: "40px" }}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(guest.id)}`}
                    >
                      {getInitials(guest.firstName, guest.lastName)}
                    </div>
                  </td>
                  <td>
                    <p className="font-semibold text-sm">
                      {guest.firstName} {guest.lastName}
                    </p>
                  </td>
                  <td className="text-sm">
                    {guest.currentRoomNumber && (
                      <>
                        <p className="font-semibold text-primary">Room {guest.currentRoomNumber}</p>
                        <p className="text-xs text-secondary">Floor {guest.currentFloor}</p>
                      </>
                    )}
                  </td>
                  <td className="text-xs">
                    <p>{guest.email}</p>
                    <p className="text-secondary">{guest.phone}</p>
                  </td>
                  <td className="text-xs text-secondary">{formatDate(guest.checkInDate)}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[guest.status]}`}>
                      {guest.status}
                    </span>
                  </td>
                  <td className="text-xs">
                    <div className="flex gap-1">
                      {guest.tags.length > 0 ? (
                        guest.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-background rounded text-foreground">
                            {tag === "VIP" ? "⭐" : "•"}
                          </span>
                        ))
                      ) : (
                        <span className="text-secondary">—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => onViewClick(guest.id)}
                        className="action-btn"
                        title="View profile"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => onEditClick(guest.id)}
                        className="action-btn"
                        title="Edit guest"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="action-btn action-btn-danger"
                        title="Delete guest"
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
            onChange={(e) => onPaginationChange(1, parseInt(e.target.value))}
            className="form-input w-32 text-sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => onPaginationChange(Math.max(1, pagination.page - 1), pagination.pageSize)}
              disabled={pagination.page === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              ← Previous
            </button>
            <button
              onClick={() => onPaginationChange(Math.min(totalPages, pagination.page + 1), pagination.pageSize)}
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
