"use client";

import { useState } from "react";
import { useUsers } from "@/store/useUsers";
import { useToast } from "@/components/toast";

export function PermissionMatrix() {
  const { roles, permissions, togglePermission } = useUsers();
  const { showToast } = useToast();
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [changes, setChanges] = useState<{ roleId: string; permissionId: string }[]>([]);

  const groupedPermissions = permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.module]) acc[perm.module] = [];
      acc[perm.module].push(perm);
      return acc;
    },
    {} as Record<string, typeof permissions>
  );

  const modules = Object.keys(groupedPermissions).sort();

  const handleToggle = (roleId: string, permissionId: string) => {
    togglePermission(roleId, permissionId);
    setChanges((prev) => {
      const exists = prev.find((c) => c.roleId === roleId && c.permissionId === permissionId);
      if (exists) {
        return prev.filter((c) => !(c.roleId === roleId && c.permissionId === permissionId));
      }
      return [...prev, { roleId, permissionId }];
    });
  };

  const handleSaveChanges = () => {
    if (confirm("Apply these permission changes?")) {
      showToast("Permissions updated", "success");
      setChanges([]);
    }
  };

  return (
    <div className="dashboard-section">
      <h3 className="section-title">Permission Matrix</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-medium">Role / Module</th>
              {modules.map((module) => (
                <th key={module} className="text-center p-2 text-xs font-medium">
                  {module.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b hover:bg-background">
                <td className="p-2 font-medium">{role.name}</td>
                {modules.map((module) => {
                  const modulePerms = groupedPermissions[module];
                  const grantedCount = modulePerms.filter((p) =>
                    role.permissions.includes(p.id)
                  ).length;
                  const totalCount = modulePerms.length;

                  return (
                    <td key={module} className="text-center p-2">
                      <button
                        className="inline-flex items-center justify-center w-8 h-8 rounded text-xs font-medium transition cursor-pointer"
                        style={{
                          backgroundColor:
                            grantedCount > 0
                              ? grantedCount === totalCount
                                ? "#10b981"
                                : "#f59e0b"
                              : "#e5e7eb",
                          color: grantedCount > 0 ? "white" : "black",
                        }}
                        onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                        title={`${grantedCount}/${totalCount} permissions`}
                      >
                        {grantedCount}
                      </button>
                      {expandedRole === role.id && (
                        <div className="fixed bg-white border rounded shadow-lg p-3 max-h-64 overflow-y-auto z-50">
                          <h4 className="font-medium mb-2">{role.name} - {module}</h4>
                          {modulePerms.map((perm) => (
                            <label key={perm.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={role.permissions.includes(perm.id)}
                                onChange={() => handleToggle(role.id, perm.id)}
                              />
                              <span className="text-sm">{perm.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {changes.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex justify-between items-center">
          <span className="text-sm text-yellow-900">
            {changes.length} permission change{changes.length !== 1 ? "s" : ""} pending
          </span>
          <button className="btn btn-primary btn-sm" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
