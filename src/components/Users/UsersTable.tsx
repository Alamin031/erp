"use client";

import { useMemo, useState } from "react";
import { ExtendedUser } from "@/types/admin";
import { useUsers } from "@/store/useUsers";
import { ROLE_LABELS } from "@/types/auth";
import { useToast } from "@/components/toast";

interface Props {
  users: ExtendedUser[];
  pagination: { page: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onResetPassword: (id: string) => void;
  onImpersonate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
}

type SortField = "name" | "role" | "lastActive";
interface SortState {
  field: SortField;
  direction: "asc" | "desc";
}

export function UsersTable({
  users,
  pagination,
  onPaginationChange,
  onView,
  onEdit,
  onResetPassword,
  onImpersonate,
  onDeactivate,
  onDelete,
}: Props) {
  const { deleteUser, deactivateUser, activateUser } = useUsers();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortState>({ field: "name", direction: "asc" });

  const sorted = useMemo(() => {
    const copy = [...users];
    copy.sort((a, b) => {
      if (sort.field === "name") {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        return sort.direction === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
      }

      if (sort.field === "role") {
        const aRole = a.roles[0] || "";
        const bRole = b.roles[0] || "";
        return sort.direction === "asc"
          ? aRole.localeCompare(bRole)
          : bRole.localeCompare(aRole);
      }

      if (sort.field === "lastActive") {
        const aTime = a.lastActive ? new Date(a.lastActive).getTime() : 0;
        const bTime = b.lastActive ? new Date(b.lastActive).getTime() : 0;
        return sort.direction === "asc" ? aTime - bTime : bTime - aTime;
      }

      return 0;
    });
    return copy;
  }, [users, sort]);

  const totalPages = Math.ceil(sorted.length / pagination.pageSize) || 1;
  const start = (pagination.page - 1) * pagination.pageSize;
  const pageItems = sorted.slice(start, start + pagination.pageSize);

  const toggleAll = () => {
    if (selected.size === pageItems.length) setSelected(new Set());
    else setSelected(new Set(pageItems.map((u) => u.id)));
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "disabled":
        return "bg-red-100 text-red-800";
      case "pending_invite":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const confirmDelete = (id: string) => {
    if (confirm("Delete this user? This action cannot be undone.")) {
      deleteUser(id);
      showToast("User deleted", "success");
    }
  };

  const confirmDeactivate = (id: string, status: string) => {
    if (status === "disabled") {
      activateUser(id);
      showToast("User activated", "success");
    } else {
      if (confirm("Deactivate this user?")) {
        deactivateUser(id);
        showToast("User deactivated", "success");
      }
    }
  };

  const bulkActivate = () => {
    Array.from(selected).forEach((id) => {
      const user = users.find((u) => u.id === id);
      if (user?.status === "disabled") activateUser(id);
    });
    showToast("Users activated", "success");
    setSelected(new Set());
  };

  const bulkDeactivate = () => {
    Array.from(selected).forEach((id) => {
      const user = users.find((u) => u.id === id);
      if (user?.status === "active") deactivateUser(id);
    });
    showToast("Users deactivated", "success");
    setSelected(new Set());
  };

  const exportCSV = () => {
    const ids = Array.from(selected);
    const rows = users
      .filter((u) => ids.includes(u.id))
      .map((u) => [
        u.id,
        u.name,
        u.email,
        u.roles.join(", "),
        u.lastActive || "—",
        u.status,
      ]);
    const csv = [
      "ID,Name,Email,Roles,Last Active,Status",
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="table-container border rounded-lg">
        <table className="reservations-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}>
                <input
                  type="checkbox"
                  checked={selected.size > 0 && selected.size === pageItems.length}
                  onChange={toggleAll}
                />
              </th>
              <th>Avatar</th>
              <th>
                <button
                  className="underline-offset-2 hover:underline"
                  onClick={() =>
                    setSort((s) => ({
                      field: "name",
                      direction: s.field === "name" && s.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Name {sort.field === "name" ? (sort.direction === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th>Email</th>
              <th>
                <button
                  className="underline-offset-2 hover:underline"
                  onClick={() =>
                    setSort((s) => ({
                      field: "role",
                      direction: s.field === "role" && s.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Role {sort.field === "role" ? (sort.direction === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th>
                <button
                  className="underline-offset-2 hover:underline"
                  onClick={() =>
                    setSort((s) => ({
                      field: "lastActive",
                      direction:
                        s.field === "lastActive" && s.direction === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  Last Active {sort.field === "lastActive" ? (sort.direction === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-secondary">
                  No users found
                </td>
              </tr>
            ) : (
              pageItems.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(user.id)}
                      onChange={() =>
                        setSelected((prev) => {
                          const s = new Set(prev);
                          s.has(user.id) ? s.delete(user.id) : s.add(user.id);
                          return s;
                        })
                      }
                    />
                  </td>
                  <td>
                    <img
                      src={user.avatar || "https://via.placeholder.com/32"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </td>
                  <td className="font-medium">{user.name}</td>
                  <td className="text-sm text-secondary">{user.email}</td>
                  <td className="text-sm">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="inline-block px-2 py-0.5 rounded text-xs mr-1 bg-blue-100 text-blue-800"
                      >
                        {ROLE_LABELS[role]}
                      </span>
                    ))}
                  </td>
                  <td className="text-xs text-secondary">
                    {user.lastActive ? new Date(user.lastActive).toLocaleString() : "—"}
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                      {user.status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions text-sm">
                      <button className="action-btn" title="View" onClick={() => onView(user.id)}>
                        👁️
                      </button>
                      <button className="action-btn" title="Edit" onClick={() => onEdit(user.id)}>
                        ✎
                      </button>
                      <button
                        className="action-btn"
                        title="Reset Password"
                        onClick={() => onResetPassword(user.id)}
                      >
                        🔑
                      </button>
                      <button
                        className="action-btn"
                        title="Impersonate"
                        onClick={() => onImpersonate(user.id)}
                      >
                        👤
                      </button>
                      <button
                        className="action-btn action-btn-danger"
                        title={user.status === "disabled" ? "Activate" : "Deactivate"}
                        onClick={() => confirmDeactivate(user.id, user.status)}
                      >
                        {user.status === "disabled" ? "↑" : "↓"}
                      </button>
                      <button
                        className="action-btn action-btn-danger"
                        title="Delete"
                        onClick={() => confirmDelete(user.id)}
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

      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            className="btn btn-secondary btn-sm"
            disabled={selected.size === 0}
            onClick={bulkActivate}
          >
            Activate ({selected.size})
          </button>
          <button
            className="btn btn-secondary btn-sm"
            disabled={selected.size === 0}
            onClick={bulkDeactivate}
          >
            Deactivate ({selected.size})
          </button>
          <button
            className="btn btn-secondary btn-sm"
            disabled={selected.size === 0}
            onClick={exportCSV}
          >
            Export
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-secondary"
            disabled={pagination.page === 1}
            onClick={() => onPaginationChange(Math.max(1, pagination.page - 1), pagination.pageSize)}
          >
            ← Prev
          </button>
          <button
            className="btn btn-secondary"
            disabled={start + pagination.pageSize >= sorted.length}
            onClick={() => onPaginationChange(pagination.page + 1, pagination.pageSize)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
