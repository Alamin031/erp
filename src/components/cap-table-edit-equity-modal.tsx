"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EquityClass } from "@/types/cap-table";
import { useToast } from "./toast";
import { X } from "lucide-react";

interface EditEquityModalProps {
  isOpen: boolean;
  onClose: () => void;
  equityClass?: EquityClass | null;
  onSave?: (equityClass: Partial<EquityClass>) => void;
}

export function EditEquityModal({
  isOpen,
  onClose,
  equityClass,
  onSave,
}: EditEquityModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    authorizedShares: 0,
    issuedShares: 0,
    pricePerShare: 0,
    description: "",
    votingRights: 100,
    liquidationPreference: 1,
    conversionRatio: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (equityClass) {
      setFormData({
        name: equityClass.name,
        authorizedShares: equityClass.authorizedShares,
        issuedShares: equityClass.issuedShares,
        pricePerShare: equityClass.pricePerShare,
        description: equityClass.description || "",
        votingRights: equityClass.votingRights || 100,
        liquidationPreference: equityClass.liquidationPreference || 1,
        conversionRatio: equityClass.conversionRatio || 1,
      });
    }
    setErrors({});
  }, [equityClass, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.authorizedShares <= 0) {
      newErrors.authorizedShares = "Authorized shares must be greater than 0";
    }

    if (formData.issuedShares < 0) {
      newErrors.issuedShares = "Issued shares cannot be negative";
    }

    if (formData.issuedShares > formData.authorizedShares) {
      newErrors.issuedShares = "Issued shares cannot exceed authorized shares";
    }

    if (formData.pricePerShare < 0) {
      newErrors.pricePerShare = "Price per share cannot be negative";
    }

    if (formData.votingRights < 0 || formData.votingRights > 100) {
      newErrors.votingRights = "Voting rights must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    onSave?.({
      name: formData.name as any,
      authorizedShares: formData.authorizedShares,
      issuedShares: formData.issuedShares,
      pricePerShare: formData.pricePerShare,
      description: formData.description,
      votingRights: formData.votingRights,
      liquidationPreference: formData.liquidationPreference,
      conversionRatio: formData.conversionRatio,
    });

    showToast("Equity class updated successfully", "success");
    onClose();
  };

  const remaining = formData.authorizedShares - formData.issuedShares;
  const valueAuthorized = formData.authorizedShares * formData.pricePerShare;
  const valueIssued = formData.issuedShares * formData.pricePerShare;

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{ zIndex: 1000 }}
      />
      <motion.div
        className="modal"
        style={{ zIndex: 1001 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-card" style={{ maxHeight: "90vh", overflowY: "auto" }}>
          <div className="modal-header">
            <h2>Edit Equity Class: {formData.name}</h2>
            <button
              className="modal-close"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--secondary)",
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-form">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div className="form-group">
              <label className="form-label">Equity Class Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                disabled
                style={{ opacity: 0.6 }}
              />
              <span style={{ fontSize: "11px", color: "var(--secondary)" }}>Cannot be changed</span>
            </div>

            <div className="form-group">
              <label className="form-label">Price per Share ($) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.pricePerShare}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerShare: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.pricePerShare && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.pricePerShare}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Authorized Shares *</label>
              <input
                type="number"
                className="form-input"
                value={formData.authorizedShares}
                onChange={(e) => setFormData(prev => ({ ...prev, authorizedShares: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="1"
              />
              {errors.authorizedShares && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.authorizedShares}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Issued Shares *</label>
              <input
                type="number"
                className="form-input"
                value={formData.issuedShares}
                onChange={(e) => setFormData(prev => ({ ...prev, issuedShares: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
              />
              {errors.issuedShares && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.issuedShares}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Voting Rights (%)</label>
              <input
                type="number"
                className="form-input"
                value={formData.votingRights}
                onChange={(e) => setFormData(prev => ({ ...prev, votingRights: parseFloat(e.target.value) || 0 }))}
                placeholder="100"
                min="0"
                max="100"
              />
              {errors.votingRights && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.votingRights}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Liquidation Preference (Multiple)</label>
              <input
                type="number"
                className="form-input"
                value={formData.liquidationPreference}
                onChange={(e) => setFormData(prev => ({ ...prev, liquidationPreference: parseFloat(e.target.value) || 1 }))}
                placeholder="1"
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Conversion Ratio</label>
              <input
                type="number"
                className="form-input"
                value={formData.conversionRatio}
                onChange={(e) => setFormData(prev => ({ ...prev, conversionRatio: parseFloat(e.target.value) || 1 }))}
                placeholder="1"
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Series A preferred shares..."
                rows={3}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
              </div>
            </div>

            <div style={{ background: "var(--background)", padding: "16px", borderRadius: "8px", marginBottom: "24px", border: "1px solid var(--border)" }}>
            <h4 style={{ margin: "0 0 16px 0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
              Auto-Calculated Totals
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", fontSize: "12px" }}>
              <div>
                <span style={{ color: "var(--secondary)" }}>Remaining Shares</span>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginTop: "4px" }}>
                  {remaining.toLocaleString()}
                </div>
              </div>
              <div>
                <span style={{ color: "var(--secondary)" }}>Value (Authorized)</span>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginTop: "4px" }}>
                  ${valueAuthorized.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span style={{ color: "var(--secondary)" }}>Value (Issued)</span>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginTop: "4px" }}>
                  ${valueIssued.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
