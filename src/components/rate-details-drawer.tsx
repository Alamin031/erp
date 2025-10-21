"use client";

import { motion } from "framer-motion";
import { Rate, RateAuditLog } from "@/types/rates";
import { RateStatusBadge } from "./rate-status-badge";
import { RateHistory } from "./rate-history";

interface RateDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rate: Rate | null;
  logs: RateAuditLog[];
  onEdit?: (rate: Rate) => void;
}

export function RateDetailsDrawer({
  isOpen,
  onClose,
  rate,
  logs,
  onEdit,
}: RateDetailsDrawerProps) {
  if (!isOpen || !rate) return null;

  const rateLogs = logs.filter((log) => log.rateId === rate.id);

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{ zIndex: 1000 }}
      />
      <motion.div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "min(500px, 90vw)",
          height: "100vh",
          background: "var(--card-bg)",
          borderLeft: "1px solid var(--border)",
          zIndex: 1001,
          overflowY: "auto",
          boxShadow: "-4px 0 12px rgba(0,0,0,0.15)",
        }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px" }}>
            <div>
              <h2 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "700", color: "var(--foreground)" }}>
                {rate.name}
              </h2>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--secondary)" }}>{rate.code}</p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "var(--secondary)",
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Overview
            </h3>
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Room Type</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                  {rate.roomType}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Rate Type</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                  {rate.rateType}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Base Price</span>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--primary)" }}>
                  {rate.currency} ${rate.basePrice.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Effective Period</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                  {new Date(rate.effectiveFrom).toLocaleDateString()} -{" "}
                  {new Date(rate.effectiveTo).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Min/Max Stay</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                  {rate.minStay} / {rate.maxStay || "∞"} nights
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Channels</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                  {rate.channels.join(", ")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Status</span>
                <RateStatusBadge status={rate.status} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Priority</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                  {rate.priority}
                </span>
              </div>
            </div>
          </div>

          {rate.notes && (
            <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                Notes
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--secondary)", lineHeight: "1.6" }}>
                {rate.notes}
              </p>
            </div>
          )}

          <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Metadata
            </h3>
            <div style={{ display: "grid", gap: "8px", fontSize: "11px" }}>
              <div>
                <span style={{ color: "var(--secondary)" }}>Created by:</span> {rate.createdBy}
              </div>
              <div>
                <span style={{ color: "var(--secondary)" }}>Created at:</span>{" "}
                {new Date(rate.createdAt).toLocaleString()}
              </div>
              <div>
                <span style={{ color: "var(--secondary)" }}>Updated by:</span> {rate.updatedBy}
              </div>
              <div>
                <span style={{ color: "var(--secondary)" }}>Updated at:</span>{" "}
                {new Date(rate.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <RateHistory logs={rateLogs} />
          </div>

          <button
            onClick={() => onEdit?.(rate)}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "14px",
              fontWeight: "600",
              color: "white",
              background: "var(--primary)",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Edit Rate
          </button>
        </div>
      </motion.div>
    </>
  );
}
