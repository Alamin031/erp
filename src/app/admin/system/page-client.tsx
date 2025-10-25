"use client";

import { useSettings } from "@/store/useSettings";
import { SettingsSidebar } from "@/components/Settings/SettingsSidebar";
import { GeneralSettings } from "@/components/Settings/GeneralSettings";
import { BrandingSettings } from "@/components/Settings/BrandingSettings";
import { NotificationSettings } from "@/components/Settings/NotificationSettings";
import { IntegrationSettings } from "@/components/Settings/IntegrationSettings";
import { RolePermissions } from "@/components/Settings/RolePermissions";
import { SecuritySettings } from "@/components/Settings/SecuritySettings";
import { BackupRestore } from "@/components/Settings/BackupRestore";
import { AuditLogs } from "@/components/Settings/AuditLogs";
import { SaveIndicator } from "@/components/Settings/SaveIndicator";
import { settingsItems } from "@/components/Settings/constants";
import { motion } from "framer-motion";

export function SystemSettingsPageClient() {
  const { activeTab } = useSettings();

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "branding":
        return <BrandingSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "integrations":
        return <IntegrationSettings />;
      case "roles":
        return <RolePermissions />;
      case "security":
        return <SecuritySettings />;
      case "backup":
        return <BackupRestore />;
      case "audit":
        return <AuditLogs />;
      default:
        return <GeneralSettings />;
    }
  };

  const current = settingsItems.find((i) => i.id === (activeTab as any));

  return (
    <div className="relative flex w-full gap-8 px-4 md:px-6 lg:px-8 py-6">
      <div className="w-80 shrink-0">
        <SettingsSidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card-bg)]/80 to-transparent backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-[var(--secondary)]">Settings / {current?.label ?? "General"}</p>
                <h2 className="text-3xl font-semibold leading-tight text-[var(--foreground)]">{current?.label ?? "General"}</h2>
                {current?.description && (
                  <p className="text-sm text-[var(--secondary)]">{current.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>

      <SaveIndicator />
    </div>
  );
}
