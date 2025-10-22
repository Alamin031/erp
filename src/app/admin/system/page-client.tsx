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

  return (
    <div className="flex h-full bg-[var(--background)]">
      <SettingsSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8">
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
