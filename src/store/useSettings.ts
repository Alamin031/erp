"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GeneralSettings {
  systemName: string;
  defaultLanguage: string;
  timeZone: string;
  currency: string;
  dateFormat: string;
  darkModeEnabled: boolean;
}

export interface BrandingSettings {
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  loginBackground: string;
}

export interface NotificationSettings {
  bookingAlerts: boolean;
  paymentConfirmations: boolean;
  systemUpdates: boolean;
  lowInventoryAlerts: boolean;
  smtpServer: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
}

export interface IntegrationSettings {
  paymentGateway: string;
  paymentApiKey: string;
  cloudStorage: string;
  cloudStorageKey: string;
  chatbotApiKey: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface RolePermissionsSettings {
  roles: Role[];
}

export interface SecuritySettings {
  passwordMinLength: number;
  requireSpecialChars: boolean;
  passwordExpireDays: number;
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  loginAttemptLimit: number;
}

export interface BackupRestoreSettings {
  lastBackupDate: string;
  lastBackupSize: string;
}

export interface AuditLog {
  id: string;
  date: string;
  action: string;
  user: string;
  details: string;
  ipAddress: string;
}

export interface AuditLogsSettings {
  logs: AuditLog[];
}

interface SettingsState {
  activeTab: string;
  isSaving: boolean;
  general: GeneralSettings;
  branding: BrandingSettings;
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
  rolePermissions: RolePermissionsSettings;
  security: SecuritySettings;
  backupRestore: BackupRestoreSettings;
  auditLogs: AuditLogsSettings;

  setActiveTab: (tab: string) => void;
  updateGeneralSettings: (data: Partial<GeneralSettings>) => Promise<void>;
  updateBrandingSettings: (data: Partial<BrandingSettings>) => Promise<void>;
  updateNotificationSettings: (data: Partial<NotificationSettings>) => Promise<void>;
  updateIntegrationSettings: (data: Partial<IntegrationSettings>) => Promise<void>;
  updateRolePermissions: (data: Partial<RolePermissionsSettings>) => Promise<void>;
  updateSecuritySettings: (data: Partial<SecuritySettings>) => Promise<void>;
  testIntegration: (type: string) => Promise<boolean>;
  testEmail: () => Promise<boolean>;
  resetToDefault: (section: string) => void;
  createBackup: () => Promise<void>;
  restoreFromBackup: (file: File) => Promise<void>;
  fetchAuditLogs: (filters?: { user?: string; startDate?: string; endDate?: string }) => Promise<void>;
  addRole: (role: Omit<Role, "id">) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
}

const defaultGeneralSettings: GeneralSettings = {
  systemName: "Hotel Management System",
  defaultLanguage: "en",
  timeZone: "UTC",
  currency: "USD",
  dateFormat: "MM/DD/YYYY",
  darkModeEnabled: true,
};

const defaultBrandingSettings: BrandingSettings = {
  logo: "",
  favicon: "",
  primaryColor: "#4a9eff",
  secondaryColor: "#a0a0a0",
  loginBackground: "",
};

const defaultNotificationSettings: NotificationSettings = {
  bookingAlerts: true,
  paymentConfirmations: true,
  systemUpdates: true,
  lowInventoryAlerts: true,
  smtpServer: "smtp.gmail.com",
  smtpPort: "587",
  smtpUsername: "",
  smtpPassword: "",
};

const defaultIntegrationSettings: IntegrationSettings = {
  paymentGateway: "stripe",
  paymentApiKey: "",
  cloudStorage: "aws",
  cloudStorageKey: "",
  chatbotApiKey: "",
};

const defaultSecuritySettings: SecuritySettings = {
  passwordMinLength: 8,
  requireSpecialChars: true,
  passwordExpireDays: 90,
  twoFactorEnabled: true,
  sessionTimeoutMinutes: 30,
  loginAttemptLimit: 5,
};

const defaultBackupRestoreSettings: BackupRestoreSettings = {
  lastBackupDate: "",
  lastBackupSize: "",
};

const defaultRolePermissionsSettings: RolePermissionsSettings = {
  roles: [
    {
      id: "1",
      name: "Super Admin",
      description: "Full system access",
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Admin",
      description: "Administrative access",
      permissions: ["users", "settings", "reports"],
    },
    {
      id: "3",
      name: "Manager",
      description: "Management access",
      permissions: ["reports", "bookings", "staff"],
    },
    {
      id: "4",
      name: "Staff",
      description: "Basic access",
      permissions: ["bookings", "guests"],
    },
  ],
};

const defaultAuditLogsSettings: AuditLogsSettings = {
  logs: [],
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      activeTab: "general",
      isSaving: false,
      general: defaultGeneralSettings,
      branding: defaultBrandingSettings,
      notifications: defaultNotificationSettings,
      integrations: defaultIntegrationSettings,
      rolePermissions: defaultRolePermissionsSettings,
      security: defaultSecuritySettings,
      backupRestore: defaultBackupRestoreSettings,
      auditLogs: defaultAuditLogsSettings,

      setActiveTab: (tab: string) => set({ activeTab: tab }),

      updateGeneralSettings: async (data: Partial<GeneralSettings>) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            general: { ...state.general, ...data },
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      updateBrandingSettings: async (data: Partial<BrandingSettings>) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            branding: { ...state.branding, ...data },
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      updateNotificationSettings: async (data: Partial<NotificationSettings>) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            notifications: { ...state.notifications, ...data },
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      updateIntegrationSettings: async (data: Partial<IntegrationSettings>) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            integrations: { ...state.integrations, ...data },
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      updateRolePermissions: async (data: Partial<RolePermissionsSettings>) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            rolePermissions: { ...state.rolePermissions, ...data },
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      updateSecuritySettings: async (data: Partial<SecuritySettings>) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            security: { ...state.security, ...data },
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      testIntegration: async (type: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return Math.random() > 0.3;
      },

      testEmail: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return true;
      },

      resetToDefault: (section: string) => {
        set((state) => {
          const updates: Partial<SettingsState> = {};
          switch (section) {
            case "general":
              updates.general = defaultGeneralSettings;
              break;
            case "branding":
              updates.branding = defaultBrandingSettings;
              break;
            case "notifications":
              updates.notifications = defaultNotificationSettings;
              break;
            case "integrations":
              updates.integrations = defaultIntegrationSettings;
              break;
            case "security":
              updates.security = defaultSecuritySettings;
              break;
            case "rolePermissions":
              updates.rolePermissions = defaultRolePermissionsSettings;
              break;
          }
          return updates;
        });
      },

      createBackup: async () => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const now = new Date();
          set((state) => ({
            backupRestore: {
              lastBackupDate: now.toISOString(),
              lastBackupSize: "125.5 MB",
            },
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      restoreFromBackup: async (file: File) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          set({ isSaving: false });
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      fetchAuditLogs: async (filters?: {
        user?: string;
        startDate?: string;
        endDate?: string;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockLogs: AuditLog[] = [
          {
            id: "1",
            date: new Date(Date.now() - 3600000).toISOString(),
            action: "User Created",
            user: "admin@system.com",
            details: "Created new user: John Doe",
            ipAddress: "192.168.1.100",
          },
          {
            id: "2",
            date: new Date(Date.now() - 7200000).toISOString(),
            action: "Settings Updated",
            user: "admin@system.com",
            details: "Updated general settings",
            ipAddress: "192.168.1.100",
          },
          {
            id: "3",
            date: new Date(Date.now() - 86400000).toISOString(),
            action: "Backup Created",
            user: "system",
            details: "Automatic backup completed",
            ipAddress: "127.0.0.1",
          },
          {
            id: "4",
            date: new Date(Date.now() - 86400000 - 3600000).toISOString(),
            action: "Permission Changed",
            user: "admin@system.com",
            details: "Changed user role: Jane Smith to Manager",
            ipAddress: "192.168.1.101",
          },
          {
            id: "5",
            date: new Date(Date.now() - 172800000).toISOString(),
            action: "Login Failed",
            user: "unknown",
            details: "Failed login attempt",
            ipAddress: "10.0.0.50",
          },
        ];
        set((state) => ({
          auditLogs: { logs: mockLogs },
        }));
      },

      addRole: (role: Omit<Role, "id">) => {
        set((state) => ({
          rolePermissions: {
            roles: [
              ...state.rolePermissions.roles,
              {
                ...role,
                id: Date.now().toString(),
              },
            ],
          },
        }));
      },

      updateRole: (id: string, role: Partial<Role>) => {
        set((state) => ({
          rolePermissions: {
            roles: state.rolePermissions.roles.map((r) =>
              r.id === id ? { ...r, ...role } : r
            ),
          },
        }));
      },

      deleteRole: (id: string) => {
        set((state) => ({
          rolePermissions: {
            roles: state.rolePermissions.roles.filter((r) => r.id !== id),
          },
        }));
      },
    }),
    {
      name: "settings-store",
    }
  )
);
