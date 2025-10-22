"use client";

import { useUsers } from "@/store/useUsers";

export function RolesPermissionsPanel() {
  const { roles, users } = useUsers();

  const getRoleUserCount = (roleId: string) => {
    return users.filter((u) => u.roles.some((r) => r)).length;
  };

  return (
    <div className="dashboard-section">
      <h3 className="section-title">Roles & Permissions</h3>
      <div className="space-y-3">
        {roles.map((role) => (
          <div key={role.id} className="border rounded p-3 hover:bg-background transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{role.name}</h4>
                  {role.isSystem && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      System
                    </span>
                  )}
                </div>
                <p className="text-sm text-secondary mt-1">{role.description || "No description"}</p>
                <p className="text-xs text-secondary mt-2">
                  {role.permissions.length} permissions • {getRoleUserCount(role.id)} users
                </p>
              </div>
              <button className="btn btn-secondary btn-sm">Manage</button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary w-full mt-4">+ Create Custom Role</button>
    </div>
  );
}
