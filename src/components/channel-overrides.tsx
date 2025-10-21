"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Channel, ChannelOverride } from "@/types/rates";
import { useToast } from "./toast";

interface ChannelOverridesProps {
  isOpen: boolean;
  onClose: () => void;
  rateId: string;
  rateName: string;
  basePrice: number;
  onSave?: (override: ChannelOverride) => void;
}

export function ChannelOverrides({
  isOpen,
  onClose,
  rateId,
  rateName,
  basePrice,
  onSave,
}: ChannelOverridesProps) {
  const { showToast } = useToast();
  const [selectedChannel, setSelectedChannel] = useState<Channel>("OTA");
  const [multiplier, setMultiplier] = useState(1);
  const [overridePrice, setOverridePrice] = useState<number | undefined>();

  if (!isOpen) return null;

  const channels: Channel[] = ["All", "OTA", "Direct", "Corporate"];
  const calculatedPrice = overridePrice || basePrice * multiplier;

  const handleSave = () => {
    if (multiplier <= 0 && !overridePrice) {
      showToast("Please enter valid multiplier or override price", "error");
      return;
    }

    const override: ChannelOverride = {
      rateId,
      channel: selectedChannel,
      multiplier,
      overridePrice,
    };

    onSave?.(override);
    showToast(`Channel override saved for ${selectedChannel}`, "success");
    onClose();
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
          <h2>Channel Price Overrides</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
              Rate Details
            </h4>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--secondary)", marginBottom: "4px" }}>Rate Name</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                  {rateName}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--secondary)", marginBottom: "4px" }}>Base Price</div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--primary)" }}>
                  ${basePrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label className="form-label">Select Channel</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {channels.map((channel) => (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel)}
                  style={{
                    padding: "12px",
                    border: selectedChannel === channel ? "2px solid var(--primary)" : "1px solid var(--border)",
                    borderRadius: "6px",
                    background: selectedChannel === channel ? "var(--primary)15" : "var(--card-bg)",
                    color: "var(--foreground)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
              Price Override Method
            </h4>

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label className="form-label">Multiplier</label>
              <input
                type="number"
                className="form-input"
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value) || 1)}
                placeholder="1.0"
                step="0.01"
                min="0"
              />
              <small style={{ fontSize: "11px", color: "var(--secondary)", marginTop: "4px", display: "block" }}>
                e.g., 0.95 = 5% discount, 1.1 = 10% markup
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Or Override Price (Optional)</label>
              <input
                type="number"
                className="form-input"
                value={overridePrice || ""}
                onChange={(e) => setOverridePrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Leave empty to use multiplier"
                step="0.01"
                min="0"
              />
              <small style={{ fontSize: "11px", color: "var(--secondary)", marginTop: "4px", display: "block" }}>
                If set, this will override the base price × multiplier
              </small>
            </div>
          </div>

          <div style={{ marginBottom: "24px", padding: "16px", background: "var(--background)", borderRadius: "6px", borderLeft: "4px solid var(--primary)" }}>
            <div style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "8px" }}>
              Calculated Price for {selectedChannel}:
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary)" }}>
              ${calculatedPrice.toFixed(2)}
            </div>
            <div style={{ fontSize: "11px", color: "var(--secondary)", marginTop: "4px" }}>
              {overridePrice
                ? "Using override price"
                : `Using base price × ${multiplier.toFixed(2)} multiplier`}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save Override
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
