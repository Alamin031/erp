"use client";

import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ isOpen, title, message, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onCancel} />
      <div className="modal">
        <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="modal-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <AlertCircle size={24} style={{ color: "var(--danger)" }} />
              <h2>{title}</h2>
            </div>
            <button className="modal-close" onClick={onCancel}>
              <X size={20} />
            </button>
          </div>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ color: "var(--secondary)" }}>{message}</p>
          </div>
          <div className="modal-footer">
            <button
              onClick={onCancel}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                color: "var(--foreground)",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "var(--danger)",
                color: "#fff",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
