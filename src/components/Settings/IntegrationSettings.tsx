"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/store/useSettings";
import { useToast } from "@/components/toast";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

interface IntegrationTest {
  [key: string]: "idle" | "testing" | "success" | "failed";
}

const integrations = [
  {
    id: "payment",
    name: "Payment Gateway",
    description: "Stripe, PayPal, bKash",
    icon: "💳",
    fields: [
      { name: "paymentGateway", label: "Provider", type: "select" },
      { name: "paymentApiKey", label: "API Key", type: "password" },
    ],
  },
  {
    id: "storage",
    name: "Cloud Storage",
    description: "AWS S3, Cloudinary",
    icon: "☁️",
    fields: [
      { name: "cloudStorage", label: "Provider", type: "select" },
      { name: "cloudStorageKey", label: "API Key", type: "password" },
    ],
  },
  {
    id: "chatbot",
    name: "Chatbot Integration",
    description: "CRM and customer support",
    icon: "💬",
    fields: [
      { name: "chatbotApiKey", label: "API Key", type: "password" },
    ],
  },
];

export function IntegrationSettings() {
  const { integrations: settings, updateIntegrationSettings, testIntegration, isSaving } =
    useSettings();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(settings);
  const [isDirty, setIsDirty] = useState(false);
  const [testStatus, setTestStatus] = useState<IntegrationTest>({
    payment: "idle",
    storage: "idle",
    chatbot: "idle",
  });

  useEffect(() => {
    setFormData(settings);
    setIsDirty(false);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateIntegrationSettings(formData);
      showToast("Integration settings saved successfully", "success");
      setIsDirty(false);
    } catch (error) {
      showToast("Failed to save settings", "error");
    }
  };

  const handleTestIntegration = async (integrationId: string) => {
    setTestStatus((prev) => ({ ...prev, [integrationId]: "testing" }));
    try {
      const success = await testIntegration(integrationId);
      setTestStatus((prev) => ({
        ...prev,
        [integrationId]: success ? "success" : "failed",
      }));
      showToast(
        success
          ? `${integrationId} integration connected successfully`
          : `Failed to connect ${integrationId} integration`,
        success ? "success" : "error"
      );
      setTimeout(() => {
        setTestStatus((prev) => ({ ...prev, [integrationId]: "idle" }));
      }, 2000);
    } catch (error) {
      setTestStatus((prev) => ({ ...prev, [integrationId]: "failed" }));
      showToast("Error testing integration", "error");
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
          Integration Settings
        </h3>
        <p className="text-sm text-[var(--secondary)] mb-6">
          Connect external services and APIs to your system
        </p>
      </div>

      <div className="space-y-6">
        {integrations.map((integration) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--foreground)]">
                    {integration.name}
                  </h4>
                  <p className="text-sm text-[var(--secondary)]">
                    {integration.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {testStatus[integration.id] === "testing" && (
                  <Loader className="w-5 h-5 text-[var(--primary)] animate-spin" />
                )}
                {testStatus[integration.id] === "success" && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {testStatus[integration.id] === "failed" && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {integration.fields.map((field) => (
                <div key={field.name} className="form-group">
                  <label className="form-label">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name as keyof typeof formData] || ""}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Select provider</option>
                      {field.name === "paymentGateway" && (
                        <>
                          <option value="stripe">Stripe</option>
                          <option value="paypal">PayPal</option>
                          <option value="bkash">bKash</option>
                        </>
                      )}
                      {field.name === "cloudStorage" && (
                        <>
                          <option value="aws">AWS S3</option>
                          <option value="cloudinary">Cloudinary</option>
                          <option value="gcs">Google Cloud Storage</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData] || ""}
                      onChange={handleChange}
                      className="form-input"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <motion.button
              onClick={() => handleTestIntegration(integration.id)}
              disabled={testStatus[integration.id] === "testing"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-[var(--sidebar-hover)] text-[var(--foreground)] rounded-lg font-medium hover:bg-opacity-80 transition-colors disabled:opacity-50"
            >
              {testStatus[integration.id] === "testing"
                ? "Testing..."
                : "Test Connection"}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3 pt-6">
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
    </motion.div>
  );
}
