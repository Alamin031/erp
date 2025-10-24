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
      <div className="modal-overlay" onClick={onClose} style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 10000
      }} />
      <div className="modal" style={{ 
        maxWidth: 500,
        width: 'calc(100% - 32px)',
        maxHeight: 'calc(100vh - 64px)',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10001,
        background: 'var(--card)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div className="modal-header" style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            margin: 0
          }}>Invite User</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            type="button"
            style={{
              padding: '6px',
              border: 'none',
              background: 'transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '20px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '24px',
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <label className="form-label" style={{
                marginBottom: '10px',
                display: 'block',
                fontSize: '13px',
                fontWeight: 500
              }}>Email Address *</label>
              <input
                className="form-input"
                type="email"
                placeholder="user@orionhotel.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 14px',
                  fontSize: '14px',
                  borderRadius: '8px'
                }}
              />
              <p className="text-xs text-secondary mt-1">Invitation link will be sent to this email</p>
            </div>

            <div>
              <label className="form-label" style={{
                marginBottom: '10px',
                display: 'block',
                fontSize: '13px',
                fontWeight: 500
              }}>Role *</label>
              <select
                className="form-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 14px',
                  fontSize: '14px',
                  borderRadius: '8px'
                }}
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
          </div>

          {/* Actions - Fixed at bottom */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            borderTop: '1px solid var(--border)',
            padding: '20px 24px',
            background: 'var(--card)',
            flexShrink: 0
          }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose} 
              disabled={isSubmitting}
              style={{
                minWidth: '120px',
                height: '44px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
              style={{
                minWidth: '140px',
                height: '44px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
