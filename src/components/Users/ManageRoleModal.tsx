"use client";

import { useState, useEffect } from "react";
import { useUsers } from "@/store/useUsers";
import { Role } from "@/types/admin";
import { useToast } from "@/components/toast";

const ALL_PERMISSIONS = [
  { id: "users.view", label: "View Users", category: "Users" },
  { id: "users.create", label: "Create Users", category: "Users" },
  { id: "users.edit", label: "Edit Users", category: "Users" },
  { id: "users.delete", label: "Delete Users", category: "Users" },
  { id: "roles.view", label: "View Roles", category: "Roles" },
  { id: "roles.manage", label: "Manage Roles", category: "Roles" },
  { id: "finance.view", label: "View Finance", category: "Finance" },
  { id: "finance.manage", label: "Manage Finance", category: "Finance" },
  { id: "inventory.view", label: "View Inventory", category: "Inventory" },
  { id: "inventory.manage", label: "Manage Inventory", category: "Inventory" },
  { id: "reservations.view", label: "View Reservations", category: "Reservations" },
  { id: "reservations.manage", label: "Manage Reservations", category: "Reservations" },
  { id: "housekeeping.view", label: "View Housekeeping", category: "Housekeeping" },
  { id: "housekeeping.manage", label: "Manage Housekeeping", category: "Housekeeping" },
  { id: "maintenance.view", label: "View Maintenance", category: "Maintenance" },
  { id: "maintenance.manage", label: "Manage Maintenance", category: "Maintenance" },
  { id: "reports.view", label: "View Reports", category: "Reports" },
  { id: "reports.export", label: "Export Reports", category: "Reports" },
  { id: "settings.view", label: "View Settings", category: "Settings" },
  { id: "settings.manage", label: "Manage Settings", category: "Settings" },
];

export function ManageRoleModal({
  isOpen,
  onClose,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}) {
  const { updateRole } = useUsers();
  const { showToast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (role) {
      setSelectedPermissions(role.permissions || []);
    }
  }, [role]);

  if (!isOpen || !role) return null;

  const handleTogglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPermissions(ALL_PERMISSIONS.map((p) => p.id));
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  const handleSave = () => {
    updateRole(role.id, { ...role, permissions: selectedPermissions });
    showToast("Role permissions updated", "success");
    onClose();
  };

  // Group permissions by category
  const permissionsByCategory = ALL_PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, typeof ALL_PERMISSIONS>);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ zIndex: 1001 }}>
        <div className="modal-card" style={{ maxWidth: "750px", maxHeight: "90vh", overflow: "auto" }}>
          <div className="modal-header">
            <div>
              <h2>Manage Role — {role.name}</h2>
              {role.isSystem && (
                <span style={{
                  display: "inline-block",
                  marginTop: "4px",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "600",
                  background: "rgba(59, 130, 246, 0.1)",
                  color: "#3b82f6",
                  border: "1px solid rgba(59, 130, 246, 0.3)"
                }}>
                  System Role
                </span>
              )}
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {/* Role Info */}
            <div style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "20px"
            }}>
              <div style={{ fontSize: "13px", color: "var(--secondary)", marginBottom: "4px" }}>
                Description
              </div>
              <div style={{ fontSize: "14px", color: "var(--foreground)" }}>
                {role.description || "No description available"}
              </div>
            </div>

            {/* Permission Count */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px"
            }}>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                  Permissions ({selectedPermissions.length}/{ALL_PERMISSIONS.length})
                </h3>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSelectAll}
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  Select All
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleDeselectAll}
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  Deselect All
                </button>
              </div>
            </div>

            {/* Permissions by Category */}
            <div style={{
              maxHeight: "400px",
              overflowY: "auto",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "16px"
            }}>
              {Object.entries(permissionsByCategory).map(([category, perms]) => (
                <div key={category} style={{ marginBottom: "20px" }}>
                  <h4 style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--foreground)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "10px",
                    paddingBottom: "6px",
                    borderBottom: "1px solid var(--border)"
                  }}>
                    {category}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {perms.map((perm) => (
                      <label
                        key={perm.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          background: selectedPermissions.includes(perm.id)
                            ? "rgba(59, 130, 246, 0.1)"
                            : "var(--background)",
                          border: `1px solid ${
                            selectedPermissions.includes(perm.id)
                              ? "rgba(59, 130, 246, 0.3)"
                              : "var(--border)"
                          }`,
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => handleTogglePermission(perm.id)}
                          style={{ width: "16px", height: "16px", cursor: "pointer" }}
                        />
                        <span style={{
                          fontSize: "13px",
                          color: selectedPermissions.includes(perm.id)
                            ? "#3b82f6"
                            : "var(--foreground)"
                        }}>
                          {perm.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {role.isSystem && (
              <div style={{
                padding: "12px",
                background: "rgba(251, 191, 36, 0.1)",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#fbbf24",
                marginTop: "12px"
              }}>
                ⚠️ Note: This is a system role. Changes will affect all users with this role.
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Permissions
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
