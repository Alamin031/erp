"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCRMSettings } from "@/store/useCRMSettings";
import { useToast } from "@/components/toast";
import { Check } from "lucide-react";

const CURRENCY_OPTIONS = ["USD", "BDT", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"];

export function PreferencesTab() {
  const { preferences, updatePreference, isSaving } = useCRMSettings();
  const { showToast } = useToast();
  const [localPrefs, setLocalPrefs] = useState(preferences);

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleCurrencyChange = (value: string) => {
    setLocalPrefs((prev) => ({ ...prev, defaultCurrency: value }));
  };

  const handleSave = async () => {
    try {
      await updatePreference({
        enableEmailNotifications: localPrefs.enableEmailNotifications,
        autoAssignLeads: localPrefs.autoAssignLeads,
        showInactiveLeads: localPrefs.showInactiveLeads,
        defaultCurrency: localPrefs.defaultCurrency,
      });
      showToast("Preferences saved successfully", "success");
    } catch (error) {
      showToast("Failed to save preferences", "error");
    }
  };

  const isChanged =
    JSON.stringify(localPrefs) !== JSON.stringify(preferences);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ padding: "32px 0" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "24px" }}>CRM Preferences</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Email Notifications Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontWeight: 500, marginBottom: 4 }}>Enable Email Notifications</p>
                <p style={{ color: "var(--secondary)", fontSize: "14px" }}>Receive email alerts for important CRM events</p>
              </div>
              <button
                onClick={() => handleToggle("enableEmailNotifications", !localPrefs.enableEmailNotifications)}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  border: "none",
                  backgroundColor: localPrefs.enableEmailNotifications ? "var(--primary)" : "var(--border)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: localPrefs.enableEmailNotifications ? "flex-end" : "flex-start",
                  padding: "4px",
                }}
              >
                <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff" }} />
              </button>
            </div>

            {/* Auto-assign Leads Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontWeight: 500, marginBottom: 4 }}>Auto-assign Leads</p>
                <p style={{ color: "var(--secondary)", fontSize: "14px" }}>Automatically assign new leads to sales team members</p>
              </div>
              <button
                onClick={() => handleToggle("autoAssignLeads", !localPrefs.autoAssignLeads)}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  border: "none",
                  backgroundColor: localPrefs.autoAssignLeads ? "var(--primary)" : "var(--border)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: localPrefs.autoAssignLeads ? "flex-end" : "flex-start",
                  padding: "4px",
                }}
              >
                <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff" }} />
              </button>
            </div>

            {/* Show Inactive Leads Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontWeight: 500, marginBottom: 4 }}>Show Inactive Leads</p>
                <p style={{ color: "var(--secondary)", fontSize: "14px" }}>Display leads that haven't been contacted in 30 days</p>
              </div>
              <button
                onClick={() => handleToggle("showInactiveLeads", !localPrefs.showInactiveLeads)}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  border: "none",
                  backgroundColor: localPrefs.showInactiveLeads ? "var(--primary)" : "var(--border)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: localPrefs.showInactiveLeads ? "flex-end" : "flex-start",
                  padding: "4px",
                }}
              >
                <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff" }} />
              </button>
            </div>

            {/* Currency Dropdown */}
            <div>
              <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>Default Currency</label>
              <select
                value={localPrefs.defaultCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card-bg)",
                  color: "var(--foreground)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {CURRENCY_OPTIONS.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
            <button
              onClick={handleSave}
              disabled={!isChanged || isSaving}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: isChanged && !isSaving ? "var(--primary)" : "var(--border)",
                color: "#fff",
                fontWeight: 500,
                cursor: isChanged && !isSaving ? "pointer" : "not-allowed",
                transition: "background-color 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: !isChanged ? 0.5 : 1,
              }}
            >
              <Check size={16} />
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
