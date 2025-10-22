"use client";

import { useState } from "react";
import { useUsers } from "@/store/useUsers";
import { useToast } from "@/components/toast";
import { ROLE_LABELS } from "@/types/auth";
import { UserRole } from "@/types/auth";

export function InviteUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { inviteUser } = useUsers();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "front_desk_agent" as UserRole,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.email.trim()) {
        showToast("Email is required", "error");
        return;
      }

      inviteUser(formData.email, formData.role);
      showToast(`Invitation sent to ${formData.email}`, "success");
      setFormData({ email: "", role: "front_desk_agent" });
      onClose();
    } catch (error) {
      showToast("Failed to send invitation", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = Object.entries(ROLE_LABELS);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h2>Invite User</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div>
            <label className="form-label">Email Address *</label>
            <input
              className="form-input"
              type="email"
              placeholder="user@orionhotel.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <p className="text-xs text-secondary mt-1">Invitation link will be sent to this email</p>
          </div>

          <div>
            <label className="form-label">Role *</label>
            <select
              className="form-input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            >
              {roles.map(([role, label]) => (
                <option key={role} value={role}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
            <p className="text-blue-900">
              💡 The user will receive an email with a secure invitation link. They'll need to set
              their password on first login.
            </p>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
