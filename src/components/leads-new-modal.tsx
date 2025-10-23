"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lead, SalesAgent, LeadSource, LeadStage } from "@/types/leads";
import { useToast } from "./toast";
import { X } from "lucide-react";

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  salesAgents: SalesAgent[];
  leadSources: LeadSource[];
  onSave?: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "interactionHistory">) => void;
}

const stages: LeadStage[] = ["New", "Contacted", "Qualified", "Proposal", "Closed Won", "Closed Lost"];

export function NewLeadModal({
  isOpen,
  onClose,
  lead,
  salesAgents,
  leadSources,
  onSave,
}: NewLeadModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Omit<Lead, "id" | "createdAt" | "updatedAt" | "interactionHistory">>({
    name: "",
    company: "",
    email: "",
    phone: "",
    leadSource: "",
    assignedTo: "",
    assignedToName: "",
    stage: "New" as LeadStage,
    potentialValue: 0,
    status: "Active",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        leadSource: lead.leadSource,
        assignedTo: lead.assignedTo,
        assignedToName: lead.assignedToName,
        stage: lead.stage,
        potentialValue: lead.potentialValue,
        status: lead.status,
        notes: lead.notes || "",
      });
    } else {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        leadSource: "",
        assignedTo: "",
        assignedToName: "",
        stage: "New",
        potentialValue: 0,
        status: "Active",
        notes: "",
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.leadSource) newErrors.leadSource = "Lead source is required";
    if (!formData.assignedTo) newErrors.assignedTo = "Must assign to a sales rep";
    if (formData.potentialValue <= 0) newErrors.potentialValue = "Value must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    onSave?.(formData);
    showToast(lead ? "Lead updated successfully" : "Lead created successfully", "success");
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }} />
      <motion.div
        className="modal"
        style={{ zIndex: 1001, maxHeight: "90vh", overflowY: "auto" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="modal-header">
          <h2>{lead ? "Edit Lead" : "Create New Lead"}</h2>
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
              <label className="form-label">Lead Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Smith"
              />
              {errors.name && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Company *</label>
              <input
                type="text"
                className="form-input"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="TechCorp Inc"
              />
              {errors.company && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.company}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@company.com"
              />
              {errors.email && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1-555-0000"
              />
              {errors.phone && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Lead Source *</label>
              <select
                className="form-input"
                value={formData.leadSource}
                onChange={(e) => setFormData(prev => ({ ...prev, leadSource: e.target.value }))}
              >
                <option value="">Select source...</option>
                {leadSources.map(source => (
                  <option key={source.id} value={source.displayName}>{source.displayName}</option>
                ))}
              </select>
              {errors.leadSource && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.leadSource}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Sales Rep *</label>
              <select
                className="form-input"
                value={formData.assignedTo}
                onChange={(e) => {
                  const agent = salesAgents.find(a => a.id === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    assignedTo: e.target.value,
                    assignedToName: agent?.name || ""
                  }));
                }}
              >
                <option value="">Select rep...</option>
                {salesAgents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
              {errors.assignedTo && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.assignedTo}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Stage</label>
              <select
                className="form-input"
                value={formData.stage}
                onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value as LeadStage }))}
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Potential Value ($) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.potentialValue}
                onChange={(e) => setFormData(prev => ({ ...prev, potentialValue: parseFloat(e.target.value) || 0 }))}
                placeholder="50000"
                min="0"
              />
              {errors.potentialValue && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.potentialValue}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this lead..."
                rows={3}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {lead ? "Update Lead" : "Create Lead"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
