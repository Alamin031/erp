"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SalesAgent, Lead } from "@/types/leads";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dateISO: string) => void;
  salesAgents: SalesAgent[];
  lead?: Lead;
}

export function FollowUpScheduler({ isOpen, onClose, onConfirm, salesAgents, lead }: Props) {
  const [datetime, setDatetime] = useState("");
  const [agentId, setAgentId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setDatetime("");
      setAgentId(lead?.assignedTo || "");
    }
  }, [isOpen, lead]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <motion.div
          className="modal-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="followup-title"
        >
          <div className="modal-header">
            <h2 id="followup-title">Schedule Follow-up</h2>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
          <div className="modal-form">
            <div className="form-group">
              <label className="form-label">Lead</label>
              <input className="form-input" value={lead?.name || ""} disabled style={{ background: 'var(--background)', cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Follow-up Date & Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                placeholder="Select date and time"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Assign Reminder To</label>
              <select className="form-input" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                <option value="">Select agent...</option>
                {salesAgents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!datetime) {
                    alert("Please select a date and time");
                    return;
                  }
                  const iso = new Date(datetime).toISOString();
                  onConfirm(iso);
                }}
                disabled={!datetime}
              >
                Schedule
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
