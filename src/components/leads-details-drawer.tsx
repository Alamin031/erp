"use client";

import { motion } from "framer-motion";
import { Lead } from "@/types/leads";
import { X } from "lucide-react";

interface LeadDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onEdit?: (lead: Lead) => void;
  onScheduleFollowUp?: (lead: Lead) => void;
  onMarkConverted?: (id: string) => void;
  onMarkLost?: (id: string) => void;
}

const stageColors: Record<string, string> = {
  New: "#6b7280",
  Contacted: "#2563eb",
  Qualified: "#f59e0b",
  Proposal: "#8b5cf6",
  "Closed Won": "#059669",
  "Closed Lost": "#dc3545",
};

export function LeadDetailsDrawer({
  isOpen,
  onClose,
  lead,
  onEdit,
  onScheduleFollowUp,
  onMarkConverted,
  onMarkLost,
}: LeadDetailsDrawerProps) {
  if (!isOpen || !lead) return null;

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <motion.div
        className="slide-over"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="slide-over-header">
          <h2 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
            {lead.name}
          </h2>
          <button className="slide-over-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="slide-over-content">
          <div className="details-section">
            <h3 className="details-title">Contact Information</h3>
            <div className="detail-item">
              <span className="detail-label">Company</span>
              <span className="detail-value">{lead.company}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value" style={{ wordBreak: 'break-word' }}>
                <a href={`mailto:${lead.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  {lead.email}
                </a>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">
                <a href={`tel:${lead.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  {lead.phone}
                </a>
              </span>
            </div>
          </div>

          <div className="details-section">
            <h3 className="details-title">Lead Details</h3>
            <div className="detail-item">
              <span className="detail-label">Lead ID</span>
              <span className="detail-value">{lead.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Source</span>
              <span className="detail-value">{lead.leadSource}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Stage</span>
              <div style={{ padding: "4px 8px", backgroundColor: `${stageColors[lead.stage]}20`, color: stageColors[lead.stage], borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                {lead.stage}
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <div style={{ padding: "4px 8px", backgroundColor: lead.status === "Converted" ? "rgba(5, 150, 105, 0.2)" : lead.status === "Lost" ? "rgba(220, 53, 69, 0.2)" : "rgba(37, 99, 235, 0.2)", color: lead.status === "Converted" ? "#059669" : lead.status === "Lost" ? "#dc3545" : "#2563eb", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                {lead.status}
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-label">Assigned To</span>
              <span className="detail-value">{lead.assignedToName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Potential Value</span>
              <span className="detail-value">${(lead.potentialValue / 1000).toFixed(0)}K</span>
            </div>
          </div>

          <div className="details-section">
            <h3 className="details-title">Timeline</h3>
            <div className="detail-item">
              <span className="detail-label">Created</span>
              <span className="detail-value">{new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>
            {lead.nextFollowUp && (
              <div className="detail-item">
                <span className="detail-label">Next Follow-up</span>
                <span className="detail-value">{new Date(lead.nextFollowUp).toLocaleDateString()}</span>
              </div>
            )}
            {lead.convertedAt && (
              <div className="detail-item">
                <span className="detail-label">Converted</span>
                <span className="detail-value">{new Date(lead.convertedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {lead.notes && (
            <div className="details-section">
              <h3 className="details-title">Notes</h3>
              <div className="details-notes">{lead.notes}</div>
            </div>
          )}

          {lead.interactionHistory && lead.interactionHistory.length > 0 && (
            <div className="details-section">
              <h3 className="details-title">Recent Interactions</h3>
              {lead.interactionHistory.slice(0, 3).map((interaction) => (
                <div key={interaction.id} className="details-notes" style={{ marginBottom: "8px" }}>
                  <div style={{ fontWeight: "600", marginBottom: "4px", textTransform: "capitalize" }}>
                    {interaction.type}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--secondary)" }}>
                    {new Date(interaction.date).toLocaleDateString()} - {interaction.notes}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="slide-over-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              onEdit?.(lead);
              onClose();
            }}
            style={{ width: "100%" }}
          >
            Edit Lead
          </button>
          {lead.status === "Active" && (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  onScheduleFollowUp?.(lead);
                  onClose();
                }}
                style={{ width: "100%" }}
              >
                Schedule Follow-up
              </button>
              {lead.stage !== "Closed Won" && (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if(confirm(`Mark ${lead.name} as converted?`)) {
                      onMarkConverted?.(lead.id);
                      onClose();
                    }
                  }}
                  style={{ width: "100%", borderColor: "#059669", color: "#059669" }}
                >
                  Mark as Converted
                </button>
              )}
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if(confirm(`Mark ${lead.name} as lost?`)) {
                    onMarkLost?.(lead.id);
                    onClose();
                  }
                }}
                style={{ width: "100%", borderColor: "#dc3545", color: "#dc3545" }}
              >
                Mark as Lost
              </button>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
