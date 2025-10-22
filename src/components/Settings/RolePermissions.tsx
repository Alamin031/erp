"use client";

import { useState } from "react";
import { useSettings } from "@/store/useSettings";
import { useToast } from "@/components/toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { Role } from "@/store/useSettings";

const AVAILABLE_PERMISSIONS = [
  "users",
  "settings",
  "reports",
  "bookings",
  "staff",
  "inventory",
  "payments",
  "analytics",
];

export function RolePermissions() {
  const { rolePermissions, addRole, updateRole, deleteRole } = useSettings();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<Omit<Role, "id">>({
    name: "",
    description: "",
    permissions: [],
  });

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData(role);
    } else {
      setEditingRole(null);
      setFormData({ name: "", description: "", permissions: [] });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({ name: "", description: "", permissions: [] });
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSaveRole = () => {
    if (!formData.name.trim()) {
      showToast("Role name is required", "error");
      return;
    }

    if (editingRole) {
      updateRole(editingRole.id, formData);
      showToast("Role updated successfully", "success");
    } else {
      addRole(formData);
      showToast("Role created successfully", "success");
    }
    handleCloseModal();
  };

  const handleDeleteRole = (id: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      deleteRole(id);
      showToast("Role deleted successfully", "success");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Roles & Permissions
          </h3>
          <p className="text-sm text-[var(--secondary)]">
            Manage user roles and their permissions
          </p>
        </div>
        <motion.button
          onClick={() => handleOpenModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-opacity-90"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </motion.button>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                  Role Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                  Permissions
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rolePermissions.roles.map((role, index) => (
                <motion.tr
                  key={role.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-[var(--border)] hover:bg-[var(--sidebar-hover)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--foreground)]">
                      {role.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[var(--secondary)]">
                      {role.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.length > 0 ? (
                        role.permissions.slice(0, 3).map((perm) => (
                          <span
                            key={perm}
                            className="px-2 py-1 bg-[var(--primary)] bg-opacity-20 text-[var(--primary)] text-xs rounded"
                          >
                            {perm}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[var(--secondary)]">
                          No permissions
                        </span>
                      )}
                      {role.permissions.length > 3 && (
                        <span className="text-xs text-[var(--secondary)]">
                          +{role.permissions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleOpenModal(role)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-[var(--primary)] hover:bg-[var(--sidebar-hover)] rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteRole(role.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="modal-overlay"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="modal"
            >
              <div className="modal-header">
                <h2>{editingRole ? "Edit Role" : "Add New Role"}</h2>
                <button onClick={handleCloseModal} className="modal-close">
                  ✕
                </button>
              </div>

              <div className="modal-form">
                <div className="form-group">
                  <label className="form-label">Role Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="form-input"
                    placeholder="e.g., Manager"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="form-input"
                    placeholder="Role description"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label mb-3 block">Permissions</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {AVAILABLE_PERMISSIONS.map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center gap-3 p-2 rounded hover:bg-[var(--sidebar-hover)] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => handlePermissionToggle(permission)}
                          className="w-4 h-4"
                        />
                        <span className="capitalize text-[var(--foreground)]">
                          {permission}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="modal-actions mt-6 border-t border-[var(--border)] pt-6">
                  <motion.button
                    onClick={handleCloseModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--sidebar-hover)]"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSaveRole}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium"
                  >
                    {editingRole ? "Update Role" : "Create Role"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
