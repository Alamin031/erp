"use client";

import { useSettings } from "@/store/useSettings";
import { motion } from "framer-motion";
import {
  Cog,
  Palette,
  Bell,
  Link2,
  Shield,
  Users,
  Database,
  FileText,
} from "lucide-react";

interface SettingsItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const settingsItems: SettingsItem[] = [
  {
    id: "general",
    label: "General",
    icon: <Cog className="w-5 h-5" />,
    description: "System configuration",
  },
  {
    id: "branding",
    label: "Branding",
    icon: <Palette className="w-5 h-5" />,
    description: "Logo, colors & themes",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    description: "Email & alerts",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: <Link2 className="w-5 h-5" />,
    description: "External APIs",
  },
  {
    id: "roles",
    label: "Roles & Permissions",
    icon: <Users className="w-5 h-5" />,
    description: "Access control",
  },
  {
    id: "security",
    label: "Security",
    icon: <Shield className="w-5 h-5" />,
    description: "Password & 2FA",
  },
  {
    id: "backup",
    label: "Backup & Restore",
    icon: <Database className="w-5 h-5" />,
    description: "Data backup",
  },
  {
    id: "audit",
    label: "Audit Logs",
    icon: <FileText className="w-5 h-5" />,
    description: "Activity history",
  },
];

export function SettingsSidebar() {
  const { activeTab, setActiveTab } = useSettings();

  return (
    <aside className="w-80 bg-[var(--card-bg)] border-r border-[var(--border)] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">
          Settings
        </h2>
        <nav className="space-y-2">
          {settingsItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === item.id
                  ? "bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] border border-[var(--primary)] border-opacity-30"
                  : "text-[var(--foreground)] hover:bg-[var(--sidebar-hover)]"
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="text-[var(--secondary)]">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-[var(--secondary)]">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
