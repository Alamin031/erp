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
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          <button className="slide-over-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="slide-over-body">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              {/* Profile Details */}
              <div className="dashboard-section">
                <h3 className="section-title">Profile Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400 mb-1">User ID</div>
                    <div className="font-medium text-white">{user.id}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Email</div>
                    <div className="font-medium text-white">{user.email}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Phone</div>
                    <div className="font-medium text-white">{user.phone || "—"}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Status</div>
                    <div className="font-medium text-white capitalize">{user.status.replace(/_/g, " ")}</div>
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
                      className="px-3 py-1.5 rounded-md text-sm bg-blue-900/30 text-blue-300 border border-blue-500/30"
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
                        className="px-3 py-1.5 rounded-md text-sm bg-purple-900/30 text-purple-300 border border-purple-500/30"
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
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400 mb-1">Last Login</div>
                    <div className="font-medium text-white">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Active Sessions</div>
                    <div className="font-medium text-white">{user.activeSessions || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Last Active</div>
                    <div className="font-medium text-white">
                      {user.lastActive ? new Date(user.lastActive).toLocaleString() : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">MFA Status</div>
                    <div className={`font-medium ${user.mfaEnabled ? "text-green-400" : "text-red-400"}`}>
                      {user.mfaEnabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="dashboard-section">
                <h3 className="section-title">Recent Activity</h3>
                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto text-sm">
                  {userActivity.length === 0 ? (
                    <div className="text-gray-400">No activity yet</div>
                  ) : (
                    userActivity.map((act) => (
                      <div
                        key={act.id}
                        className="border-l-2 border-primary pl-3 py-1"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-white">{act.action}</span>
                          <span className="text-gray-400 text-xs whitespace-nowrap ml-2">
                            {new Date(act.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {act.details && <p className="text-gray-400 text-xs mt-1">{act.details}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Actions Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="dashboard-section">
                <h3 className="section-title">Actions</h3>
                <div className="flex flex-col gap-3">
                  <button className="btn btn-secondary text-sm w-full justify-start" onClick={onEdit}>
                    <span className="mr-2">✎</span> Edit Profile
                  </button>
                  <button className="btn btn-secondary text-sm w-full justify-start" onClick={handleResetPassword}>
                    <span className="mr-2">🔑</span> Reset Password
                  </button>
                  <button className="btn btn-secondary text-sm w-full justify-start" onClick={handleImpersonate}>
                    <span className="mr-2">👤</span> Impersonate
                  </button>
                  {(user.activeSessions ?? 0) > 0 && (
                    <button
                      className="btn btn-secondary text-sm w-full justify-start"
                      onClick={() => showToast("Force logout (simulated)", "info")}
                    >
                      <span className="mr-2">🚪</span> Force Logout
                    </button>
                  )}
                </div>
              </div>

              {/* Security Settings */}
              <div className="dashboard-section">
                <h3 className="section-title">Security</h3>
                <div className="text-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Password Reset Required:</span>
                    <span className="font-medium text-white">
                      {user.requirePasswordReset ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">2FA Enabled:</span>
                    <span className="font-medium text-white">
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
