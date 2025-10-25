"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/store/useSettings";
import { useToast } from "@/components/toast";
import { motion } from "framer-motion";

export function GeneralSettings() {
  const { general, updateGeneralSettings, isSaving } = useSettings();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(general);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData(general);
    setIsDirty(false);
  }, [general]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateGeneralSettings(formData);
      showToast("General settings saved successfully", "success");
      setIsDirty(false);
    } catch (error) {
      showToast("Failed to save settings", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          General Settings
        </h3>
        <p className="text-sm text-[var(--secondary)] mb-6">
          Configure basic system settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-[var(--foreground)]">System Identity</h4>
            <p className="text-sm text-[var(--secondary)]">Name and primary appearance options for your instance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="form-group">
              <label className="form-label">System Name</label>
              <input
                type="text"
                name="systemName"
                value={formData.systemName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter system name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dark Mode</label>
              <label className="flex items-center gap-3 p-3 rounded-md border border-[var(--border)] cursor-pointer hover:bg-[var(--sidebar-hover)]">
                <input
                  type="checkbox"
                  name="darkModeEnabled"
                  checked={formData.darkModeEnabled}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-sm text-[var(--secondary)]">Enable dark theme by default</span>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-[var(--foreground)]">Localization</h4>
            <p className="text-sm text-[var(--secondary)]">Language, time and regional formats.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="form-group">
              <label className="form-label">Default Language</label>
              <select
                name="defaultLanguage"
                value={formData.defaultLanguage}
                onChange={handleChange}
                className="form-input"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Time Zone</label>
              <select
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                className="form-input"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="MST">Mountain Time (MST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="GMT">GMT</option>
                <option value="IST">India Standard Time (IST)</option>
                <option value="AEST">Australian Eastern Time (AEST)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="form-input"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="INR">INR (₹)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CAD">CAD ($)</option>
                <option value="CHF">CHF (₣)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date Format</label>
              <select
                name="dateFormat"
                value={formData.dateFormat}
                onChange={handleChange}
                className="form-input"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              </select>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 -mx-1 md:-mx-2 lg:-mx-4 bg-gradient-to-t from-[var(--background)] to-transparent pt-2">
          <div className="flex justify-end border-t border-[var(--border)] bg-[var(--card-bg)]/80 backdrop-blur rounded-b-xl px-4 md:px-6 py-4">
            <motion.button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
