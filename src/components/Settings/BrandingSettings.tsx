"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/store/useSettings";
import { useToast } from "@/components/toast";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

export function BrandingSettings() {
  const { branding, updateBrandingSettings, resetToDefault, isSaving } =
    useSettings();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(branding);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData(branding);
    setIsDirty(false);
  }, [branding]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target?.result as string,
        }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await updateBrandingSettings(formData);
      showToast("Branding settings saved successfully", "success");
      setIsDirty(false);
    } catch (error) {
      showToast("Failed to save settings", "error");
    }
  };

  const handleReset = () => {
    if (confirm("Reset branding to defaults?")) {
      resetToDefault("branding");
      showToast("Branding reset to defaults", "success");
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
          Branding Settings
        </h3>
        <p className="text-sm text-[var(--secondary)] mb-6">
          Customize your system's appearance and branding elements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 space-y-6">
            <div>
              <label className="form-label block mb-3">Logo</label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center">
                {formData.logo && (
                  <div className="mb-4">
                    <img
                      src={formData.logo}
                      alt="Logo preview"
                      className="h-24 mx-auto mb-4"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "logo")}
                  className="hidden"
                />
                <label
                  htmlFor="logo"
                  className="cursor-pointer text-[var(--primary)] hover:text-[var(--primary)] hover:opacity-80"
                >
                  Click to upload logo
                </label>
              </div>
            </div>

            <div>
              <label className="form-label block mb-3">Favicon</label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center">
                {formData.favicon && (
                  <div className="mb-4">
                    <img
                      src={formData.favicon}
                      alt="Favicon preview"
                      className="h-12 mx-auto mb-4"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="favicon"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "favicon")}
                  className="hidden"
                />
                <label
                  htmlFor="favicon"
                  className="cursor-pointer text-[var(--primary)] hover:opacity-80"
                >
                  Click to upload favicon
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="w-16 h-10 rounded border border-[var(--border)] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    readOnly
                    className="flex-1 form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="w-16 h-10 rounded border border-[var(--border)] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    readOnly
                    className="flex-1 form-input"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label block mb-3">Login Page Background</label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center">
                {formData.loginBackground && (
                  <div className="mb-4">
                    <img
                      src={formData.loginBackground}
                      alt="Login background preview"
                      className="h-32 mx-auto mb-4 rounded"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="loginBg"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "loginBackground")}
                  className="hidden"
                />
                <label
                  htmlFor="loginBg"
                  className="cursor-pointer text-[var(--primary)] hover:opacity-80"
                >
                  Click to upload background
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-[var(--border)]">
              <motion.button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </motion.button>
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-[var(--sidebar-hover)] text-[var(--foreground)] rounded-lg font-medium hover:bg-opacity-80 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </motion.button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 sticky top-6">
            <h4 className="font-semibold text-[var(--foreground)] mb-4">
              Live Preview
            </h4>
            <div
              className="rounded-lg overflow-hidden border border-[var(--border)]"
              style={{ backgroundColor: formData.primaryColor }}
            >
              <div className="p-6 text-white">
                {formData.logo && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={formData.logo}
                      alt="Logo"
                      className="h-12"
                    />
                  </div>
                )}
                <h5 className="text-sm font-semibold mb-2">System Name</h5>
                <p className="text-xs opacity-75">
                  Login page theme preview
                </p>
              </div>
              <div
                className="p-6"
                style={{ backgroundColor: formData.secondaryColor }}
              >
                <p className="text-xs text-white opacity-75">
                  Secondary color accent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
