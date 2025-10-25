import { ReactNode } from "react";
import { Cog, Palette, Bell, Link2, Shield, Users, Database, FileText } from "lucide-react";

export interface SettingsItem {
  id:
    | "general"
    | "branding"
    | "notifications"
    | "integrations"
    | "roles"
    | "security"
    | "backup"
    | "audit";
  label: string;
  icon: ReactNode;
  description: string;
}

export const settingsItems: SettingsItem[] = [
  { id: "general", label: "General", icon: <Cog className="w-5 h-5" />, description: "System configuration" },
  { id: "branding", label: "Branding", icon: <Palette className="w-5 h-5" />, description: "Logo, colors & themes" },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" />, description: "Email & alerts" },
  { id: "integrations", label: "Integrations", icon: <Link2 className="w-5 h-5" />, description: "External APIs" },
  { id: "roles", label: "Roles & Permissions", icon: <Users className="w-5 h-5" />, description: "Access control" },
  { id: "security", label: "Security", icon: <Shield className="w-5 h-5" />, description: "Password & 2FA" },
  { id: "backup", label: "Backup & Restore", icon: <Database className="w-5 h-5" />, description: "Data backup" },
  { id: "audit", label: "Audit Logs", icon: <FileText className="w-5 h-5" />, description: "Activity history" },
];