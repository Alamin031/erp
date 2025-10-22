"use client";

import { useState } from "react";
import { useUsers } from "@/store/useUsers";
import { useToast } from "@/components/toast";

export function GroupsPanel() {
  const { groups, users, updateGroup, deleteGroup } = useUsers();
  const { showToast } = useToast();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const handleRemoveUser = (groupId: string, userId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      updateGroup(groupId, {
        userIds: group.userIds.filter((id) => id !== userId),
      });
      showToast("User removed from group", "success");
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm("Delete this group?")) {
      deleteGroup(groupId);
      showToast("Group deleted", "success");
    }
  };

  return (
    <div className="dashboard-section">
      <h3 className="section-title">User Groups</h3>

      <div className="space-y-3">
        {groups.map((group) => {
          const groupUsers = users.filter((u) => group.userIds.includes(u.id));
          return (
            <div
              key={group.id}
              className="border rounded p-3 hover:bg-background transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 cursor-pointer" onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}>
                  <h4 className="font-medium">{group.name}</h4>
                  <p className="text-sm text-secondary mt-1">
                    {group.description || "No description"}
                  </p>
                  <p className="text-xs text-secondary mt-2">
                    {groupUsers.length} member{groupUsers.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  Delete
                </button>
              </div>

              {expandedGroup === group.id && (
                <div className="mt-4 pt-4 border-t">
                  <h5 className="text-sm font-medium mb-2">Members</h5>
                  <div className="space-y-2">
                    {groupUsers.length === 0 ? (
                      <p className="text-sm text-secondary">No members</p>
                    ) : (
                      groupUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex justify-between items-center text-sm p-2 rounded hover:bg-background"
                        >
                          <span>{user.name}</span>
                          <button
                            className="text-xs text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveUser(group.id, user.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn btn-primary w-full mt-4">+ Create Group</button>
    </div>
  );
}
