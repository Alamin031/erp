"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RateRule, RuleOperator, RuleCondition } from "@/types/rates";
import { useToast } from "./toast";

interface RateRulesBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  rules: RateRule[];
  onSaveRule?: (rule: RateRule) => void;
}

export function RateRulesBuilder({
  isOpen,
  onClose,
  rules,
  onSaveRule,
}: RateRulesBuilderProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    operator: "percentage_increase" as RuleOperator,
    value: 0,
    priority: rules.length + 1,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name.trim()) {
      showToast("Rule name is required", "error");
      return;
    }

    if (formData.value <= 0) {
      showToast("Rule value must be greater than 0", "error");
      return;
    }

    const newRule: RateRule = {
      id: `RULE-${Date.now()}`,
      ...formData,
      conditions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveRule?.(newRule);
    showToast("Rule created successfully", "success");
    onClose();
  };

  const operatorLabels: Record<RuleOperator, string> = {
    percentage_increase: "Percentage Increase",
    percentage_decrease: "Percentage Decrease",
    fixed_surcharge: "Fixed Surcharge",
    fixed_discount: "Fixed Discount",
    multiplier: "Multiplier",
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }} />
      <motion.div
        className="modal"
        style={{ zIndex: 1001 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-header">
          <h2>Create Pricing Rule</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Rule Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Weekend Surge"
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this rule does..."
                rows={2}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rule Type *</label>
              <select
                className="form-input"
                value={formData.operator}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, operator: e.target.value as RuleOperator }))
                }
              >
                {Object.entries(operatorLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Value *</label>
              <input
                type="number"
                className="form-input"
                value={formData.value}
                onChange={(e) => setFormData((prev) => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
                step={["percentage_increase", "percentage_decrease"].includes(formData.operator) ? "0.1" : "0.01"}
              />
              <small style={{ fontSize: "11px", color: "var(--secondary)", marginTop: "4px", display: "block" }}>
                {["percentage_increase", "percentage_decrease"].includes(formData.operator)
                  ? "Enter percentage (e.g., 20 for 20%)"
                  : ["fixed_surcharge", "fixed_discount"].includes(formData.operator)
                    ? "Enter amount in currency"
                    : "Enter multiplier (e.g., 1.1 for 10% increase)"}
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <input
                type="number"
                className="form-input"
                value={formData.priority}
                onChange={(e) => setFormData((prev) => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                min="1"
              />
              <small style={{ fontSize: "11px", color: "var(--secondary)", marginTop: "4px", display: "block" }}>
                Lower number = higher priority
              </small>
            </div>
          </div>

          <div style={{ marginBottom: "24px", padding: "16px", background: "var(--background)", borderRadius: "6px" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
              Rule Preview
            </h4>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--secondary)", lineHeight: "1.6" }}>
              {formData.name || "Unnamed rule"} -{" "}
              {["percentage_increase", "percentage_decrease"].includes(formData.operator)
                ? `${formData.operator === "percentage_increase" ? "+" : "-"}${formData.value}% adjustment`
                : ["fixed_surcharge", "fixed_discount"].includes(formData.operator)
                  ? `${formData.operator === "fixed_surcharge" ? "+" : "-"}$${formData.value.toFixed(2)}`
                  : `${formData.value}x multiplier`}
            </p>
          </div>

          <div style={{ marginBottom: "24px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
              Existing Rules
            </h4>
            {rules.length === 0 ? (
              <p style={{ margin: 0, fontSize: "12px", color: "var(--secondary)" }}>No rules created yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    style={{
                      padding: "8px",
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ fontWeight: "600", color: "var(--foreground)", marginBottom: "2px" }}>
                      {rule.name}
                    </div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px" }}>
                      Priority: {rule.priority}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Create Rule
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
