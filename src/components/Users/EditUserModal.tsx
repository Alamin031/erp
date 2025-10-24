"use client";

import { useEffect, useState } from "react";
import { useUsers } from "@/store/useUsers";
import { useToast } from "@/components/toast";
import { ROLE_LABELS } from "@/types/auth";
import { UserRole } from "@/types/auth";
import { ExtendedUser } from "@/types/admin";

export function EditUserModal({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: ExtendedUser | null;
}) {
  const { updateUser } = useUsers();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "front_desk_agent" as UserRole,
    mfaEnabled: false,
    requirePasswordReset: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.roles[0],
        mfaEnabled: user.mfaEnabled || false,
        requirePasswordReset: user.requirePasswordReset || false,
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        roles: [formData.role],
        mfaEnabled: formData.mfaEnabled,
        requirePasswordReset: formData.requirePasswordReset,
      });

      showToast("User updated successfully", "success");
      onClose();
    } catch (error) {
      showToast("Failed to update user", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = Object.entries(ROLE_LABELS);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <div className="modal-card">
          <div className="modal-header">
            <h2>Edit User — {user.name}</h2>
            <button type="button" className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
              <div className="flex flex-col gap-2">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="flex flex-col gap-2">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="form-label">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="form-input"
                  required
                >
                  {roles.map(([role, label]) => (
                    <option key={role} value={role}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.mfaEnabled}
                  onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-white">Require MFA (Multi-Factor Authentication)</span>
              </label>
            </div>

            <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requirePasswordReset}
                  onChange={(e) => setFormData({ ...formData, requirePasswordReset: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-white">Require password reset on next login</span>
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
