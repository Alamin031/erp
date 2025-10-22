"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/types/auth";
import {
  ExtendedUser,
  Role,
  Permission,
  Group,
  Invite,
  UserActivity,
} from "@/types/admin";

interface Filters {
  role: UserRole | "All";
  status: "active" | "disabled" | "pending_invite" | "All";
  mfaEnabled: "All" | "true" | "false";
  lastActiveDays?: number;
}

interface Pagination {
  page: number;
  pageSize: number;
}

interface UsersStore {
  users: ExtendedUser[];
  roles: Role[];
  permissions: Permission[];
  groups: Group[];
  invites: Invite[];
  activity: UserActivity[];
  filters: Filters;
  searchQuery: string;
  pagination: Pagination;
  selectedUserId: string | null;

  // Setters
  setUsers: (users: ExtendedUser[]) => void;
  setRoles: (roles: Role[]) => void;
  setPermissions: (permissions: Permission[]) => void;
  setGroups: (groups: Group[]) => void;
  setInvites: (invites: Invite[]) => void;
  setActivity: (activity: UserActivity[]) => void;
  setFilters: (filters: Filters) => void;
  setSearchQuery: (query: string) => void;
  setPagination: (page: number, pageSize: number) => void;
  setSelectedUserId: (id: string | null) => void;

  // User Actions
  loadDemoData: () => Promise<void>;
  createUser: (payload: Omit<ExtendedUser, "id" | "createdAt" | "updatedAt">) => void;
  updateUser: (id: string, payload: Partial<ExtendedUser>) => void;
  deleteUser: (id: string) => void;
  deactivateUser: (id: string) => void;
  activateUser: (id: string) => void;

  // Invite Actions
  inviteUser: (email: string, role: UserRole) => void;
  acceptInvite: (inviteId: string, userId: string) => void;

  // Role Actions
  createRole: (payload: Omit<Role, "id" | "createdAt" | "updatedAt">) => void;
  updateRole: (id: string, payload: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  togglePermission: (roleId: string, permissionId: string) => void;

  // Group Actions
  createGroup: (payload: Omit<Group, "id" | "createdAt" | "updatedAt">) => void;
  updateGroup: (id: string, payload: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  addUserToGroup: (groupId: string, userId: string) => void;
  removeUserFromGroup: (groupId: string, userId: string) => void;

  // Utility Actions
  resetPassword: (userId: string) => void;
  impersonateUser: (userId: string) => void;
  assignRole: (userId: string, role: UserRole) => void;
  resetMFA: (userId: string) => void;

  // Selectors
  getFilteredUsers: () => ExtendedUser[];
  getActiveUsers: () => ExtendedUser[];
  getAdmins: () => ExtendedUser[];
  getPendingInvites: () => Invite[];
  getUserById: (id: string) => ExtendedUser | null;
  getRoleById: (id: string) => Role | null;
  getPermissionById: (id: string) => Permission | null;
  getGroupById: (id: string) => Group | null;
  getUsersByRole: (role: UserRole) => ExtendedUser[];
  getActiveSessions: () => number;
}

export const useUsers = create<UsersStore>()(
  persist(
    (set, get) => ({
      users: [],
      roles: [],
      permissions: [],
      groups: [],
      invites: [],
      activity: [],
      filters: {
        role: "All",
        status: "All",
        mfaEnabled: "All",
      },
      searchQuery: "",
      pagination: { page: 1, pageSize: 10 },
      selectedUserId: null,

      setUsers: (users) => set({ users }),
      setRoles: (roles) => set({ roles }),
      setPermissions: (permissions) => set({ permissions }),
      setGroups: (groups) => set({ groups }),
      setInvites: (invites) => set({ invites }),
      setActivity: (activity) => set({ activity }),
      setFilters: (filters) => set({ filters }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setPagination: (page, pageSize) => set({ pagination: { page, pageSize } }),
      setSelectedUserId: (id) => set({ selectedUserId: id }),

      loadDemoData: async () => {
        const [users, roles, permissions, groups, invites] = await Promise.all([
          fetch("/data/demoUsers.json")
            .then((r) => r.json())
            .catch(() => []),
          fetch("/data/roles.json")
            .then((r) => r.json())
            .catch(() => []),
          fetch("/data/permissions.json")
            .then((r) => r.json())
            .catch(() => []),
          fetch("/data/groups.json")
            .then((r) => r.json())
            .catch(() => []),
          fetch("/data/invites.json")
            .then((r) => r.json())
            .catch(() => []),
        ]);
        set({ users, roles, permissions, groups, invites });
      },

      createUser: (payload) => {
        const now = new Date().toISOString();
        const user: ExtendedUser = {
          ...payload,
          id: `USR-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          users: [user, ...state.users],
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: user.id,
              action: "user_created",
              details: `User ${user.name} created with role ${user.roles[0]}`,
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      updateUser: (id, payload) => {
        const now = new Date().toISOString();
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...payload, updatedAt: now } : u
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: id,
              action: "user_updated",
              details: "User information updated",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      deleteUser: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: id,
              action: "user_deleted",
              details: "User account deleted",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      deactivateUser: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, status: "disabled" as const } : u
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: id,
              action: "user_deactivated",
              details: "User account deactivated",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      activateUser: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, status: "active" as const } : u
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: id,
              action: "user_activated",
              details: "User account activated",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      inviteUser: (email, role) => {
        const now = new Date().toISOString();
        const invite: Invite = {
          id: `INV-${Date.now()}`,
          email,
          role,
          status: "pending",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: now,
        };
        set((state) => ({
          invites: [invite, ...state.invites],
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: "system",
              action: "invite_sent",
              details: `Invitation sent to ${email}`,
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      acceptInvite: (inviteId, userId) => {
        const now = new Date().toISOString();
        set((state) => ({
          invites: state.invites.map((i) =>
            i.id === inviteId ? { ...i, status: "accepted" as const } : i
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId,
              action: "invite_accepted",
              details: "User accepted invitation",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      createRole: (payload) => {
        const now = new Date().toISOString();
        const role: Role = {
          ...payload,
          id: `ROLE-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          roles: [role, ...state.roles],
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: "system",
              action: "role_created",
              details: `Role ${role.name} created`,
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      updateRole: (id, payload) => {
        const now = new Date().toISOString();
        set((state) => ({
          roles: state.roles.map((r) =>
            r.id === id ? { ...r, ...payload, updatedAt: now } : r
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: "system",
              action: "role_updated",
              details: "Role configuration updated",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      deleteRole: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          roles: state.roles.filter((r) => r.id !== id),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: "system",
              action: "role_deleted",
              details: "Role deleted",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      togglePermission: (roleId, permissionId) => {
        const now = new Date().toISOString();
        set((state) => ({
          roles: state.roles.map((r) => {
            if (r.id === roleId) {
              const hasPermission = r.permissions.includes(permissionId);
              return {
                ...r,
                permissions: hasPermission
                  ? r.permissions.filter((p) => p !== permissionId)
                  : [...r.permissions, permissionId],
                updatedAt: now,
              };
            }
            return r;
          }),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: "system",
              action: "permission_toggled",
              details: `Permission ${permissionId} toggled for role ${roleId}`,
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      createGroup: (payload) => {
        const now = new Date().toISOString();
        const group: Group = {
          ...payload,
          id: `GROUP-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          groups: [group, ...state.groups],
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: "system",
              action: "group_created",
              details: `Group ${group.name} created`,
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      updateGroup: (id, payload) => {
        const now = new Date().toISOString();
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, ...payload, updatedAt: now } : g
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: "system",
              action: "group_updated",
              details: "Group updated",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      deleteGroup: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId: "system",
              action: "group_deleted",
              details: "Group deleted",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      addUserToGroup: (groupId, userId) => {
        const now = new Date().toISOString();
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId && !g.userIds.includes(userId)
              ? { ...g, userIds: [...g.userIds, userId], updatedAt: now }
              : g
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId,
              action: "added_to_group",
              details: `User added to group ${groupId}`,
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      removeUserFromGroup: (groupId, userId) => {
        const now = new Date().toISOString();
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? { ...g, userIds: g.userIds.filter((u) => u !== userId), updatedAt: now }
              : g
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId,
              action: "removed_from_group",
              details: `User removed from group ${groupId}`,
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      resetPassword: (userId) => {
        const now = new Date().toISOString();
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, requirePasswordReset: true, updatedAt: now } : u
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId,
              action: "password_reset",
              details: "Password reset requested",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      impersonateUser: (userId) => {
        const now = new Date().toISOString();
        set((state) => ({
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId,
              action: "impersonate_started",
              details: "Admin impersonation session started",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      assignRole: (userId, role) => {
        const now = new Date().toISOString();
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, roles: [role], updatedAt: now } : u
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId,
              action: "role_assigned",
              details: `Role ${role} assigned`,
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      resetMFA: (userId) => {
        const now = new Date().toISOString();
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, mfaEnabled: false, updatedAt: now } : u
          ),
          activity: [
            {
              id: `ACT-${Date.now()}`,
              userId,
              action: "mfa_reset",
              details: "MFA disabled",
              timestamp: now,
            },
            ...state.activity,
          ],
        }));
      },

      getFilteredUsers: () => {
        const { users, filters, searchQuery } = get();
        let filtered = [...users];

        if (filters.role !== "All") {
          filtered = filtered.filter((u) => u.roles.includes(filters.role as UserRole));
        }

        if (filters.status !== "All") {
          filtered = filtered.filter((u) => u.status === filters.status);
        }

        if (filters.mfaEnabled !== "All") {
          const mfaEnabled = filters.mfaEnabled === "true";
          filtered = filtered.filter((u) => u.mfaEnabled === mfaEnabled);
        }

        const q = searchQuery.toLowerCase().trim();
        if (q) {
          filtered = filtered.filter(
            (u) =>
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              (u.phone || "").includes(q)
          );
        }

        return filtered;
      },

      getActiveUsers: () => {
        return get().users.filter((u) => u.status === "active");
      },

      getAdmins: () => {
        return get().users.filter((u) => u.roles.includes("super_admin"));
      },

      getPendingInvites: () => {
        return get().invites.filter((i) => i.status === "pending");
      },

      getUserById: (id) => {
        return get().users.find((u) => u.id === id) || null;
      },

      getRoleById: (id) => {
        return get().roles.find((r) => r.id === id) || null;
      },

      getPermissionById: (id) => {
        return get().permissions.find((p) => p.id === id) || null;
      },

      getGroupById: (id) => {
        return get().groups.find((g) => g.id === id) || null;
      },

      getUsersByRole: (role) => {
        return get().users.filter((u) => u.roles.includes(role));
      },

      getActiveSessions: () => {
        return get().users.reduce((sum, u) => sum + (u.activeSessions || 0), 0);
      },
    }),
    { name: "users-store" }
  )
);
