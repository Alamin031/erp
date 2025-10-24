"use client";

import { useUsers } from "@/store/useUsers";

export function RolesPermissionsPanel() {
  const { roles, users } = useUsers();

  const getRoleUserCount = (roleId: string) => {
    return users.filter((u) => u.roles.some((r) => r)).length;
  };

  return (
    <div className="dashboard-section">
      <h3 className="section-title mb-4">Roles & Permissions</h3>
      <div className="space-y-3">
        {roles.map((role) => (
          <div 
            key={role.id} 
            className="border border-gray-700/50 rounded-lg p-4 hover:border-gray-600 hover:bg-gray-800/40 transition-all bg-gray-800/30"
          >
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="font-bold text-white text-base">{role.name}</h4>
                  {role.isSystem && (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded border border-blue-500/40 font-medium">
                      System
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-1.5 line-clamp-2">
                  {role.description || "No description"}
                </p>
                <p className="text-xs text-gray-500">
                  {role.permissions.length} permissions • {getRoleUserCount(role.id)} users
                </p>
              </div>
              <button className="btn btn-secondary text-sm px-5 py-2 whitespace-nowrap font-medium min-w-[100px] rounded-lg">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary w-full mt-5 text-sm font-semibold py-3 rounded-lg">
        + Create Custom Role
      </button>
    </div>
  );
}
