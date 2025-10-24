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
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[10000] animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] mx-4 max-h-[calc(100vh-80px)] bg-gradient-to-br from-[var(--card)] to-[var(--card)]/95 rounded-2xl border border-[var(--border)]/50 shadow-2xl z-[10001] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--border)]/50 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                Create New User
              </h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">Add a new team member to your organization</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[var(--background)]/80 rounded-xl transition-all duration-200 flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] text-xl w-9 h-9 flex-shrink-0 hover:rotate-90"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Content */}
          <div className="px-8 py-6 overflow-y-auto overflow-x-hidden flex-1">
            {/* Name Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Name
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-11 px-4 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--primary)]/40"
              />
            </div>

            {/* Email Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="email"
                placeholder="user@orionhotel.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-11 px-4 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--primary)]/40"
              />
            </div>

            {/* Phone Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone
              </label>
              <input
                type="tel"
                placeholder="+1-555-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 px-4 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--primary)]/40"
              />
            </div>

            {/* Role Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Role
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full h-11 px-4 pr-10 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 hover:border-[var(--primary)]/40 appearance-none cursor-pointer"
                >
                  {roles.map(([role, label]) => (
                    <option key={role} value={role}>
                      {label}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Checkbox Section */}
            <div className="pt-5 border-t border-[var(--border)]/50">
              <label className="flex items-start gap-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={formData.sendInvite}
                  onChange={(e) => setFormData({ ...formData, sendInvite: e.target.checked })}
                  className="w-5 h-5 mt-0.5 cursor-pointer rounded border-2 border-[var(--border)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0 transition-all duration-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      Send invitation email
                    </span>
                    <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs text-[var(--muted)] leading-relaxed block">
                    The user will receive an email with login instructions and a temporary password
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Actions - Fixed Footer */}
          <div className="flex gap-3 justify-end border-t border-[var(--border)]/50 px-8 py-5 bg-[var(--card)] flex-shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting} 
              className="min-w-[120px] h-11 px-5 text-sm font-semibold rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="min-w-[140px] h-11 px-6 text-sm font-semibold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
