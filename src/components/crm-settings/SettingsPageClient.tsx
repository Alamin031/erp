"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import { PreferencesTab } from "./PreferencesTab";
import { PipelinesTab } from "./PipelinesTab";
import { CustomFieldsTab } from "./CustomFieldsTab";
import { ToastContainer, useToast } from "@/components/toast";

type TabType = "preferences" | "pipelines" | "customFields";

interface TabConfig {
  id: TabType;
  label: string;
  component: React.ReactNode;
}

export function CRMSettingsPageClient() {
  const [activeTab, setActiveTab] = useState<TabType>("preferences");
  const { toasts, removeToast } = useToast();

  const tabs: TabConfig[] = [
    {
      id: "preferences",
      label: "Preferences",
      component: <PreferencesTab />,
    },
    {
      id: "pipelines",
      label: "Pipelines",
      component: <PipelinesTab />,
    },
    {
      id: "customFields",
      label: "Custom Fields",
      component: <CustomFieldsTab />,
    },
  ];

  return (
    <div className="dashboard-container" style={{ overflow: "hidden" }}>
      <div className="dashboard-header-content">
        <div className="page-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <Settings size={28} style={{ color: "var(--primary)" }} />
              <h2 className="dashboard-page-title">CRM Settings</h2>
            </div>
            <p className="dashboard-subtitle">Configure CRM preferences, pipelines, and custom fields.</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section" style={{ overflow: "hidden" }}>
          {/* Tab Navigation */}
          <div
            style={{
              display: "flex",
              gap: 8,
              borderBottom: "1px solid var(--border)",
              marginBottom: 32,
              overflow: "auto",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: activeTab === tab.id ? "var(--primary)" : "var(--secondary)",
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  cursor: "pointer",
                  borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "none",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                  position: "relative",
                  marginBottom: "-1px",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {tabs.map((tab) => {
              if (activeTab !== tab.id) return null;
              return (
                <div key={tab.id}>
                  {tab.component}
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
