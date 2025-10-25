"use client";

import { useMemo } from "react";
import { useUsers } from "@/store/useUsers";
import { ROLE_LABELS } from "@/types/auth";
import { useToast } from "@/components/toast";

export function UserProfileDrawer({
  userId,
  isOpen,
  onClose,
  onEdit,
  onResetPassword,
  onImpersonate,
}: {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onResetPassword: () => void;
  onImpersonate: () => void;
}) {
  const { users, groups, activity, resetPassword, impersonateUser } = useUsers();
  const { showToast } = useToast();

  const user = useMemo(() => users.find((u) => u.id === userId) || null, [users, userId]);
  const userGroups = useMemo(
    () => groups.filter((g) => g.userIds.includes(userId || "")),
    [groups, userId]
  );
  const userActivity = useMemo(
    () => activity.filter((a) => a.userId === userId).slice(0, 10),
    [activity, userId]
  );

  if (!isOpen || !user) return null;

  const handleResetPassword = () => {
    if (confirm("Send password reset email to " + user.email + "?")) {
      resetPassword(user.id);
      showToast("Password reset email sent", "success");
    }
  };

  const handleImpersonate = () => {
    if (confirm(`Impersonate ${user.name}? You'll be logged in as this user.`)) {
      impersonateUser(user.id);
      showToast("Impersonation session started (simulated)", "info");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.3)", color: "#22c55e" };
      case "inactive":
        return { bg: "rgba(156, 163, 175, 0.1)", border: "rgba(156, 163, 175, 0.3)", color: "#9ca3af" };
      case "pending":
        return { bg: "rgba(251, 191, 36, 0.1)", border: "rgba(251, 191, 36, 0.3)", color: "#fbbf24" };
      case "suspended":
        return { bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.3)", color: "#ef4444" };
      default:
        return { bg: "rgba(156, 163, 175, 0.1)", border: "rgba(156, 163, 175, 0.3)", color: "#9ca3af" };
    }
  };

  const statusStyle = getStatusColor(user.status);

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over" role="dialog" aria-modal>
        <div className="slide-over-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={user.avatar || "https://via.placeholder.com/48"}
              alt={user.name}
              style={{ 
                width: "56px", 
                height: "56px", 
                borderRadius: "50%",
                border: "2px solid var(--border)",
                objectFit: "cover"
              }}
            />
            <div>
              <h2 className="slide-over-title" style={{ marginBottom: "4px" }}>{user.name}</h2>
              <p style={{ fontSize: "13px", color: "var(--secondary)", marginBottom: "4px" }}>{user.email}</p>
              <span style={{ 
                padding: "4px 12px", 
                borderRadius: "12px", 
                fontSize: "11px", 
                fontWeight: "600",
                background: statusStyle.bg,
                border: `1px solid ${statusStyle.border}`,
                color: statusStyle.color,
                textTransform: "capitalize"
              }}>
                {user.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
          <button className="slide-over-close" onClick={onClose}>✕</button>
        </div>
        <div className="slide-over-body">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Profile Details Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Profile Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "13px" }}>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "4px" }}>User ID</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{user.id}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "4px" }}>Email</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500", wordBreak: "break-all" }}>{user.email}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "4px" }}>Phone</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{user.phone || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "4px" }}>Member Since</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Roles & Permissions Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Roles & Permissions
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {user.roles.map((role) => (
                  <span
                    key={role}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: "rgba(59, 130, 246, 0.1)",
                      color: "#3b82f6",
                      border: "1px solid rgba(59, 130, 246, 0.3)"
                    }}
                  >
                    {ROLE_LABELS[role]}
                  </span>
                ))}
              </div>
            </div>

            {/* Group Memberships Card */}
            {userGroups.length > 0 && (
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Group Memberships
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {userGroups.map((group) => (
                    <span
                      key={group.id}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: "rgba(168, 85, 247, 0.1)",
                        color: "#a855f7",
                        border: "1px solid rgba(168, 85, 247, 0.3)"
                      }}
                    >
                      {group.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Session Information Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Session Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "13px" }}>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "4px" }}>Last Login</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                  </div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "4px" }}>Active Sessions</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      background: (user.activeSessions || 0) > 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(156, 163, 175, 0.1)",
                      color: (user.activeSessions || 0) > 0 ? "#22c55e" : "#9ca3af",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {user.activeSessions || 0}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "4px" }}>Last Active</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>
                    {user.lastActive ? new Date(user.lastActive).toLocaleString() : "—"}
                  </div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "4px" }}>2FA Status</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      background: user.mfaEnabled ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      color: user.mfaEnabled ? "#22c55e" : "#ef4444",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {user.mfaEnabled ? "✓ Enabled" : "✗ Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Security Settings
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--secondary)" }}>Password Reset Required:</span>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background: user.requirePasswordReset ? "rgba(251, 191, 36, 0.1)" : "rgba(34, 197, 94, 0.1)",
                    color: user.requirePasswordReset ? "#fbbf24" : "#22c55e",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {user.requirePasswordReset ? "Yes" : "No"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--secondary)" }}>Account Locked:</span>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background: String(user.status) === "suspended" ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                    color: String(user.status) === "suspended" ? "#ef4444" : "#22c55e",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {String(user.status) === "suspended" ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Timeline Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Recent Activity
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                {userActivity.length === 0 ? (
                  <div style={{ color: "var(--secondary)", fontSize: "13px" }}>No activity recorded yet</div>
                ) : (
                  userActivity.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        padding: "10px 12px",
                        background: "var(--background)",
                        borderRadius: "6px",
                        borderLeft: "3px solid var(--primary)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: "500" }}>{act.action}</span>
                        <span style={{ color: "var(--secondary)", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {new Date(act.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {act.details && (
                        <p style={{ color: "var(--secondary)", fontSize: "12px", margin: 0 }}>{act.details}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Quick Actions
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button className="btn btn-secondary" onClick={onEdit}>
                  <span style={{ marginRight: "8px" }}>✎</span> Edit Profile
                </button>
                <button className="btn btn-secondary" onClick={handleResetPassword}>
                  <span style={{ marginRight: "8px" }}>🔑</span> Reset Password
                </button>
                <button className="btn btn-secondary" onClick={handleImpersonate}>
                  <span style={{ marginRight: "8px" }}>👤</span> Impersonate User
                </button>
                {(user.activeSessions ?? 0) > 0 && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => showToast("Force logout (simulated)", "info")}
                  >
                    <span style={{ marginRight: "8px" }}>🚪</span> Force Logout All Sessions
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
