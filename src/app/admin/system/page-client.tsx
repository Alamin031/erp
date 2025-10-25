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
    <div className="flex gap-6 w-full">
      <div className="w-80 shrink-0">
        <SettingsSidebar />
      </div>

      <div className="flex-1 min-w-0">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {renderContent()}
        </motion.div>
      </div>

      <SaveIndicator />
    </div>
  );
}
