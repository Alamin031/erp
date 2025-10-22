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

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over" role="dialog" aria-modal>
        <div className="slide-over-header">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || "https://via.placeholder.com/48"}
              alt={user.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="slide-over-title">{user.name}</h2>
              <p className="text-secondary text-sm">{user.email}</p>
            </div>
          </div>
          <button className="slide-over-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="slide-over-body">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Profile Details */}
              <div className="dashboard-section">
                <h3 className="section-title">Profile Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-secondary">User ID</div>
                    <div className="font-medium text-xs">{user.id}</div>
                  </div>
                  <div>
                    <div className="text-secondary">Email</div>
                    <div className="font-medium">{user.email}</div>
                  </div>
                  <div>
                    <div className="text-secondary">Phone</div>
                    <div className="font-medium">{user.phone || "—"}</div>
                  </div>
                  <div>
                    <div className="text-secondary">Status</div>
                    <div className="font-medium capitalize">{user.status.replace(/_/g, " ")}</div>
                  </div>
                </div>
              </div>

              {/* Roles & Permissions */}
              <div className="dashboard-section">
                <h3 className="section-title">Roles & Permissions</h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-800"
                    >
                      {ROLE_LABELS[role]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Group Memberships */}
              {userGroups.length > 0 && (
                <div className="dashboard-section">
                  <h3 className="section-title">Group Memberships</h3>
                  <div className="flex flex-wrap gap-2">
                    {userGroups.map((group) => (
                      <span
                        key={group.id}
                        className="px-3 py-1 rounded text-sm bg-purple-100 text-purple-800"
                      >
                        {group.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Info */}
              <div className="dashboard-section">
                <h3 className="section-title">Session Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-secondary">Last Login</div>
                    <div className="font-medium text-xs">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                    </div>
                  </div>
                  <div>
                    <div className="text-secondary">Active Sessions</div>
                    <div className="font-medium">{user.activeSessions || 0}</div>
                  </div>
                  <div>
                    <div className="text-secondary">Last Active</div>
                    <div className="font-medium text-xs">
                      {user.lastActive ? new Date(user.lastActive).toLocaleString() : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-secondary">MFA Status</div>
                    <div className={`font-medium ${user.mfaEnabled ? "text-green-600" : "text-red-600"}`}>
                      {user.mfaEnabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="dashboard-section">
                <h3 className="section-title">Recent Activity</h3>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto text-sm">
                  {userActivity.length === 0 ? (
                    <div className="text-secondary">No activity yet</div>
                  ) : (
                    userActivity.map((act) => (
                      <div
                        key={act.id}
                        className="activity-item border-l-2 border-primary pl-3"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{act.action}</span>
                          <span className="text-secondary text-xs">
                            {new Date(act.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {act.details && <p className="text-secondary text-xs mt-1">{act.details}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Actions Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="dashboard-section">
                <h3 className="section-title">Actions</h3>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-secondary text-sm" onClick={onEdit}>
                    ✎ Edit Profile
                  </button>
                  <button className="btn btn-secondary text-sm" onClick={handleResetPassword}>
                    🔑 Reset Password
                  </button>
                  <button className="btn btn-secondary text-sm" onClick={handleImpersonate}>
                    👤 Impersonate
                  </button>
                  {user.activeSessions > 0 && (
                    <button
                      className="btn btn-secondary text-sm"
                      onClick={() => showToast("Force logout (simulated)", "info")}
                    >
                      🚪 Force Logout
                    </button>
                  )}
                </div>
              </div>

              {/* Security Settings */}
              <div className="dashboard-section">
                <h3 className="section-title">Security</h3>
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span>Password Reset Required:</span>
                    <span className="font-medium">
                      {user.requirePasswordReset ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>2FA Enabled:</span>
                    <span className="font-medium">
                      {user.mfaEnabled ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
