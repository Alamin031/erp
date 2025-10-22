"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/store/useSettings";
import { useToast } from "@/components/toast";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

export function NotificationSettings() {
  const { notifications, updateNotificationSettings, testEmail, isSaving } =
    useSettings();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(notifications);
  const [isDirty, setIsDirty] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setFormData(notifications);
    setIsDirty(false);
  }, [notifications]);

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
      await updateNotificationSettings(formData);
      showToast("Notification settings saved successfully", "success");
      setIsDirty(false);
    } catch (error) {
      showToast("Failed to save settings", "error");
    }
  };

  const handleTestEmail = async () => {
    setIsTesting(true);
    try {
      const success = await testEmail();
      if (success) {
        showToast("Test email sent successfully", "success");
      } else {
        showToast("Failed to send test email", "error");
      }
    } catch (error) {
      showToast("Error testing email", "error");
    } finally {
      setIsTesting(false);
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
          Notification Settings
        </h3>
        <p className="text-sm text-[var(--secondary)] mb-6">
          Configure email alerts and notification preferences
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 space-y-8">
        <div>
          <h4 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Notification Types
          </h4>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="bookingAlerts"
                checked={formData.bookingAlerts}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-medium text-[var(--foreground)]">
                  Booking Alerts
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Notify about new bookings and reservations
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="paymentConfirmations"
                checked={formData.paymentConfirmations}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-medium text-[var(--foreground)]">
                  Payment Confirmations
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Send payment confirmation emails
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="systemUpdates"
                checked={formData.systemUpdates}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-medium text-[var(--foreground)]">
                  System Updates
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Receive system maintenance and update notifications
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="lowInventoryAlerts"
                checked={formData.lowInventoryAlerts}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-medium text-[var(--foreground)]">
                  Low Inventory Alerts
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Alert when inventory falls below thresholds
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-8">
          <h4 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            SMTP Configuration
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">SMTP Server</label>
              <input
                type="text"
                name="smtpServer"
                value={formData.smtpServer}
                onChange={handleChange}
                className="form-input"
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Port</label>
              <input
                type="text"
                name="smtpPort"
                value={formData.smtpPort}
                onChange={handleChange}
                className="form-input"
                placeholder="587"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="email"
                name="smtpUsername"
                value={formData.smtpUsername}
                onChange={handleChange}
                className="form-input"
                placeholder="your-email@gmail.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="smtpPassword"
                value={formData.smtpPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-[var(--border)]">
            <motion.button
              onClick={handleTestEmail}
              disabled={isTesting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-[var(--sidebar-hover)] text-[var(--foreground)] rounded-lg font-medium hover:bg-opacity-80 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isTesting ? "Testing..." : "Test Email"}
            </motion.button>

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
