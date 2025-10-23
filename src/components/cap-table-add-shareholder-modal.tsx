"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shareholder, EquityClassType } from "@/types/cap-table";
import { useToast } from "./toast";
import { X } from "lucide-react";

interface AddShareholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareholder?: Shareholder | null;
  onSave?: (shareholder: Omit<Shareholder, "id" | "ownershipPercentage" | "createdAt" | "updatedAt">) => void;
}

export function AddShareholderModal({
  isOpen,
  onClose,
  shareholder,
  onSave,
}: AddShareholderModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sharesHeld: 0,
    equityType: "Common" as EquityClassType,
    joinDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (shareholder) {
      setFormData({
        name: shareholder.name,
        email: shareholder.email || "",
        sharesHeld: shareholder.sharesHeld,
        equityType: shareholder.equityType,
        joinDate: shareholder.joinDate.split("T")[0],
        notes: shareholder.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        sharesHeld: 0,
        equityType: "Common",
        joinDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
    setErrors({});
  }, [shareholder, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.sharesHeld <= 0) {
      newErrors.sharesHeld = "Shares must be greater than 0";
    }

    if (!formData.joinDate) {
      newErrors.joinDate = "Join date is required";
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
      name: formData.name,
      email: formData.email || undefined,
      sharesHeld: formData.sharesHeld,
      equityType: formData.equityType,
      joinDate: formData.joinDate,
      notes: formData.notes || undefined,
    });

    showToast(
      shareholder ? "Shareholder updated successfully" : "Shareholder added successfully",
      "success"
    );
    onClose();
  };

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
        <div className="modal-header">
          <h2>{shareholder ? "Edit Shareholder" : "Add New Shareholder"}</h2>
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
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., John Smith"
              />
              {errors.name && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g., john@company.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Share Quantity *</label>
              <input
                type="number"
                className="form-input"
                value={formData.sharesHeld}
                onChange={(e) => setFormData(prev => ({ ...prev, sharesHeld: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="1"
              />
              {errors.sharesHeld && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.sharesHeld}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Equity Type *</label>
              <select
                className="form-input"
                value={formData.equityType}
                onChange={(e) => setFormData(prev => ({ ...prev, equityType: e.target.value as EquityClassType }))}
              >
                <option value="Common">Common</option>
                <option value="Preferred">Preferred</option>
                <option value="Options">Options</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ownership Start Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.joinDate}
                onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
              />
              {errors.joinDate && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.joinDate}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Optional Notes</label>
              <textarea
                className="form-input"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="e.g., Co-founder and CEO..."
                rows={3}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
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
              {shareholder ? "Update Shareholder" : "Add Shareholder"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
