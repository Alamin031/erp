"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rate, RateType, Channel, RateStatus } from "@/types/rates";
import { useToast } from "./toast";

interface RateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  rate?: Rate | null;
  mode?: "add" | "edit" | "clone";
  roomTypes: string[];
  onSave?: (rate: Rate) => void;
}

export function RateFormModal({
  isOpen,
  onClose,
  rate,
  mode = "add",
  roomTypes,
  onSave,
}: RateFormModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    roomType: "",
    rateType: "Base" as RateType,
    channels: ["All"] as Channel[],
    effectiveFrom: new Date().toISOString().split("T")[0],
    effectiveTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    basePrice: 0,
    currency: "USD",
    minStay: 1,
    maxStay: undefined as number | undefined,
    priority: 1,
    status: "Draft" as RateStatus,
    notes: "",
  });

  const [blackoutDates, setBlackoutDates] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (rate) {
      setFormData({
        code: rate.code,
        name: rate.name,
        roomType: rate.roomType,
        rateType: rate.rateType,
        channels: rate.channels,
        effectiveFrom: rate.effectiveFrom.split("T")[0],
        effectiveTo: rate.effectiveTo.split("T")[0],
        basePrice: rate.basePrice,
        currency: rate.currency,
        minStay: rate.minStay,
        maxStay: rate.maxStay,
        priority: rate.priority,
        status: rate.status,
        notes: rate.notes || "",
      });
      setBlackoutDates(rate.blackoutDates || []);
    }
  }, [rate]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) newErrors.code = "Rate code is required";
    if (!formData.name.trim()) newErrors.name = "Rate name is required";
    if (!formData.roomType) newErrors.roomType = "Room type is required";
    if (formData.basePrice <= 0) newErrors.basePrice = "Price must be greater than 0";
    if (new Date(formData.effectiveFrom) >= new Date(formData.effectiveTo)) {
      newErrors.effectiveTo = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    const newRate: Rate = {
      id: rate?.id || `R-${Date.now()}`,
      ...formData,
      maxStay: formData.maxStay || undefined,
      blackoutDates,
      rules: rate?.rules || [],
      createdBy: rate?.createdBy || "current_user",
      createdAt: rate?.createdAt || new Date().toISOString(),
      updatedBy: "current_user",
      updatedAt: new Date().toISOString(),
    };

    onSave?.(newRate);
    showToast(
      mode === "add"
        ? "Rate created successfully"
        : mode === "clone"
          ? "Rate cloned successfully"
          : "Rate updated successfully",
      "success"
    );
    onClose();
  };

  const handleChannelToggle = (channel: Channel) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleAddBlackoutDate = (date: string) => {
    if (date && !blackoutDates.includes(date)) {
      setBlackoutDates([...blackoutDates, date]);
    }
  };

  const handleRemoveBlackoutDate = (date: string) => {
    setBlackoutDates(blackoutDates.filter((d) => d !== date));
  };

  const rateTypes: RateType[] = ["Base", "Seasonal", "Promo", "Corporate", "Package"];
  const availableChannels: Channel[] = ["All", "OTA", "Direct", "Corporate"];

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }} />
      <motion.div
        className="modal"
        style={{ zIndex: 1001, maxHeight: "90vh", overflowY: "auto" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-header">
          <h2>
            {mode === "add" ? "Create New Rate" : mode === "clone" ? "Clone Rate" : "Edit Rate"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div className="form-group">
              <label className="form-label">Rate Code *</label>
              <input
                type="text"
                className="form-input"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                placeholder="e.g., STD-BASE"
              />
              {errors.code && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.code}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Rate Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Standard Room Base Rate"
              />
              {errors.name && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Room Type *</label>
              <select
                className="form-input"
                value={formData.roomType}
                onChange={(e) => setFormData((prev) => ({ ...prev, roomType: e.target.value }))}
              >
                <option value="">Select room type</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.roomType && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.roomType}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Rate Type *</label>
              <select
                className="form-input"
                value={formData.rateType}
                onChange={(e) => setFormData((prev) => ({ ...prev, rateType: e.target.value as RateType }))}
              >
                {rateTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Base Price ($) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.basePrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.basePrice && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.basePrice}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                className="form-input"
                value={formData.currency}
                onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Effective From *</label>
              <input
                type="date"
                className="form-input"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData((prev) => ({ ...prev, effectiveFrom: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Effective To *</label>
              <input
                type="date"
                className="form-input"
                value={formData.effectiveTo}
                onChange={(e) => setFormData((prev) => ({ ...prev, effectiveTo: e.target.value }))}
              />
              {errors.effectiveTo && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.effectiveTo}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Min Stay (nights)</label>
              <input
                type="number"
                className="form-input"
                value={formData.minStay}
                onChange={(e) => setFormData((prev) => ({ ...prev, minStay: parseInt(e.target.value) || 1 }))}
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Stay (nights)</label>
              <input
                type="number"
                className="form-input"
                value={formData.maxStay || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, maxStay: e.target.value ? parseInt(e.target.value) : undefined }))}
                min="1"
                placeholder="Unlimited"
              />
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
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as RateStatus }))}
              >
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Distribution Channels
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "12px" }}>
              {availableChannels.map((channel) => (
                <label key={channel} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.channels.includes(channel)}
                    onChange={() => handleChannelToggle(channel)}
                    style={{ cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "13px", color: "var(--foreground)" }}>{channel}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Blackout Dates
            </h4>
            {blackoutDates.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                {blackoutDates.map((date) => (
                  <div
                    key={date}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px",
                      background: "var(--background)",
                      borderRadius: "4px",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "var(--foreground)" }}>
                      {new Date(date).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleRemoveBlackoutDate(date)}
                      style={{
                        padding: "2px 6px",
                        fontSize: "12px",
                        color: "#dc3545",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="date"
                className="form-input"
                id="blackoutDateInput"
                placeholder="Select date"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("blackoutDateInput") as HTMLInputElement;
                  if (input.value) {
                    handleAddBlackoutDate(input.value);
                    input.value = "";
                  }
                }}
                style={{
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "white",
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add Date
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Internal Memo</label>
            <textarea
              className="form-input"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Internal notes..."
              rows={3}
              style={{ resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              {mode === "add" ? "Create Rate" : mode === "clone" ? "Clone Rate" : "Update Rate"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
