import { UserRole } from "./auth";

export type UserStatus = "active" | "disabled" | "pending_invite";
export type PermissionAction = "create" | "read" | "update" | "delete";
export type InviteStatus = "pending" | "accepted" | "expired";

export interface Permission {
  id: string;
  name: string;
  module: string; // e.g., "users", "equipment", "finance"
  action: PermissionAction;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  color?: string;
  permissions: string[]; // permission IDs
  isSystem?: boolean; // Cannot be deleted if true
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  userIds: string[];
  roleOverride?: string; // Optional role override for all group members
  createdAt: string;
  updatedAt: string;
}

export interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  roles: UserRole[]; // Support multiple roles
  groups: string[]; // Group IDs
  status: UserStatus;
  mfaEnabled?: boolean;
  requirePasswordReset?: boolean;
  lastLogin?: string;
  lastActive?: string;
  activeSessions?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Invite {
  id: string;
  email: string;
  role: UserRole;
  status: InviteStatus;
  token?: string;
  expiresAt?: string;
  createdAt: string;
  createdBy?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string; // e.g., "user_created", "role_changed", "password_reset"
  details?: string;
  performedBy?: string; // Admin who performed the action
  timestamp: string;
  ipAddress?: string;
}

export interface RolePermissionDiff {
  roleId: string;
  added: string[]; // permission IDs
  removed: string[]; // permission IDs
}
