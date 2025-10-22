"use client";

import { useMemo } from "react";
import { useUsers } from "@/store/useUsers";

interface Props {
  limit?: number;
  userId?: string;
}

const actionIcons: Record<string, string> = {
  user_created: "➕",
  user_updated: "✏️",
  user_deleted: "🗑️",
  user_deactivated: "↓",
  user_activated: "↑",
  role_assigned: "👤",
  password_reset: "🔑",
  mfa_reset: "🔐",
  impersonate_started: "👁️",
  added_to_group: "👥",
  removed_from_group: "👥",
  invite_sent: "📧",
  invite_accepted: "✓",
  role_created: "➕",
  role_updated: "✏️",
  role_deleted: "🗑️",
  permission_toggled: "⚙️",
  group_created: "➕",
  group_updated: "✏️",
  group_deleted: "🗑️",
};

const actionLabels: Record<string, string> = {
  user_created: "User Created",
  user_updated: "User Updated",
  user_deleted: "User Deleted",
  user_deactivated: "User Deactivated",
  user_activated: "User Activated",
  role_assigned: "Role Assigned",
  password_reset: "Password Reset",
  mfa_reset: "MFA Reset",
  impersonate_started: "Impersonation Started",
  added_to_group: "Added to Group",
  removed_from_group: "Removed from Group",
  invite_sent: "Invitation Sent",
  invite_accepted: "Invitation Accepted",
  role_created: "Role Created",
  role_updated: "Role Updated",
  role_deleted: "Role Deleted",
  permission_toggled: "Permission Toggled",
  group_created: "Group Created",
  group_updated: "Group Updated",
  group_deleted: "Group Deleted",
};

export function UserActivityLog({ limit = 20, userId }: Props) {
  const { activity, users } = useUsers();

  const logs = useMemo(() => {
    let filtered = [...activity];

    if (userId) {
      filtered = filtered.filter((a) => a.userId === userId);
    }

    return filtered
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }, [activity, userId, limit]);

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-secondary text-sm">
        No activity yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {logs.map((log) => {
        const user = users.find((u) => u.id === log.userId);
        const actionLabel = actionLabels[log.action] || log.action;
        const icon = actionIcons[log.action] || "📝";

        return (
          <div key={log.id} className="activity-item border-l-2 border-primary pl-3">
            <div className="flex items-start gap-2">
              <span className="text-lg mt-0.5">{icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{actionLabel}</span>
                  {user && (
                    <span className="text-secondary text-xs">
                      {user.name}
                    </span>
                  )}
                </div>
                {log.details && <p className="text-sm text-secondary mt-0.5">{log.details}</p>}
                <p className="text-xs text-secondary mt-1">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
