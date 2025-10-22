"use client";

import { useState } from "react";
import { useUsers } from "@/store/useUsers";
import { useToast } from "@/components/toast";
import { ROLE_LABELS } from "@/types/auth";
import { UserRole } from "@/types/auth";

export function NewUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createUser } = useUsers();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "front_desk_agent" as UserRole,
    sendInvite: true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name.trim() || !formData.email.trim()) {
        showToast("Name and email are required", "error");
        return;
      }

      const now = new Date().toISOString();
      createUser({
        email: formData.email,
        name: formData.name,
        phone: formData.phone || undefined,
        roles: [formData.role],
        groups: [],
        status: formData.sendInvite ? "pending_invite" : "active",
        mfaEnabled: false,
        requirePasswordReset: formData.sendInvite,
        lastLogin: undefined,
        lastActive: undefined,
        activeSessions: 0,
        tags: [],
        createdAt: now,
        updatedAt: now,
      });

      showToast(`User ${formData.name} created successfully`, "success");
      setFormData({ name: "", email: "", phone: "", role: "front_desk_agent", sendInvite: true });
      onClose();
    } catch (error) {
      showToast("Failed to create user", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = Object.entries(ROLE_LABELS);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <h2>Create New User</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div>
              <label className="form-label">Name *</label>
              <input
                className="form-input"
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input
                className="form-input"
                type="email"
                placeholder="user@orionhotel.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                type="tel"
                placeholder="+1-555-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
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
          </div>

          <div className="form-row">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendInvite}
                onChange={(e) => setFormData({ ...formData, sendInvite: e.target.checked })}
              />
              <span className="text-sm">Send invitation email</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
