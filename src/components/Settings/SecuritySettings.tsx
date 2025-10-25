"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/store/useSettings";
import { useToast } from "@/components/toast";
import { motion } from "framer-motion";
import { Lock, AlertTriangle } from "lucide-react";

export function SecuritySettings() {
  const { security, updateSecuritySettings, isSaving } = useSettings();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(security);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData(security);
    setIsDirty(false);
  }, [security]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value)
          : value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateSecuritySettings(formData);
      showToast("Security settings saved successfully", "success");
      setIsDirty(false);
    } catch (error) {
      showToast("Failed to save settings", "error");
    }
  };

  const handleEnforcePasswordReset = () => {
    if (
      confirm(
        "This will force all users to reset their passwords on next login. Continue?"
      )
    ) {
      showToast(
        "Password reset enforced for all users",
        "success"
      );
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
          Security Settings
        </h3>
        <p className="text-sm text-[var(--secondary)] mb-6">
          Configure password policies and authentication security
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Password Policy
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Minimum Password Length</label>
                <input
                  type="number"
                  name="passwordMinLength"
                  value={formData.passwordMinLength}
                  onChange={handleChange}
                  min="6"
                  max="20"
                  className="form-input"
                />
                <p className="text-xs text-[var(--secondary)] mt-2">
                  Minimum: 6 characters
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Password Expiry (Days)</label>
                <input
                  type="number"
                  name="passwordExpireDays"
                  value={formData.passwordExpireDays}
                  onChange={handleChange}
                  min="0"
                  max="365"
                  className="form-input"
                />
                <p className="text-xs text-[var(--secondary)] mt-2">
                  Set to 0 to disable expiry
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer mt-6">
              <input
                type="checkbox"
                name="requireSpecialChars"
                checked={formData.requireSpecialChars}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-medium text-[var(--foreground)]">
                  Require Special Characters
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Passwords must include special characters (!@#$%^&*)
                </p>
              </div>
            </label>
          </div>

          <div className="border-t border-[var(--border)] pt-6">
            <h4 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Two-Factor Authentication
            </h4>

            <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="twoFactorEnabled"
                checked={formData.twoFactorEnabled}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-medium text-[var(--foreground)]">
                  Enable 2FA for All Users
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Require users to use 2FA for enhanced security
                </p>
              </div>
            </label>
          </div>

          <div className="border-t border-[var(--border)] pt-6">
            <h4 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Session Management
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Session Timeout (Minutes)</label>
                <input
                  type="number"
                  name="sessionTimeoutMinutes"
                  value={formData.sessionTimeoutMinutes}
                  onChange={handleChange}
                  min="5"
                  max="480"
                  className="form-input"
                />
                <p className="text-xs text-[var(--secondary)] mt-2">
                  Auto-logout after inactivity
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Login Attempt Limit</label>
                <input
                  type="number"
                  name="loginAttemptLimit"
                  value={formData.loginAttemptLimit}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="form-input"
                />
                <p className="text-xs text-[var(--secondary)] mt-2">
                  Failed attempts before lockout
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-6">
            <div className="bg-orange-500 border border-orange-500 rounded-lg p-4 mb-6 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white font-medium">
                Enforcing password reset will require all users to create new passwords on their next login.
              </p>
            </div>

            <motion.button
              onClick={handleEnforcePasswordReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Enforce Password Reset for All Users
            </motion.button>
          </div>

          <div className="flex gap-3 pt-6 border-t border-[var(--border)]">
            <motion.button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              whileHover={{ scale: isDirty && !isSaving ? 1.02 : 1 }}
              whileTap={{ scale: isDirty && !isSaving ? 0.98 : 1 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
