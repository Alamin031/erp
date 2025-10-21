"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Campaign, CampaignFormData, CampaignChannel, CampaignGoal, CampaignStatus } from "@/types/campaigns";
import { useToast } from "./toast";

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: Campaign | null;
  onSave?: (campaign: Campaign) => void;
}

export function CampaignModal({
  isOpen,
  onClose,
  campaign,
  onSave,
}: CampaignModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    channel: "Facebook",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    budget: 0,
    goal: "Brand Awareness",
    description: "",
    status: "Draft",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        channel: campaign.channel,
        startDate: campaign.startDate.split("T")[0],
        endDate: campaign.endDate.split("T")[0],
        budget: campaign.budget,
        goal: campaign.goal,
        description: campaign.description,
        status: campaign.status,
      });
    }
  }, [campaign]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Campaign name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.budget <= 0) {
      newErrors.budget = "Budget must be greater than 0";
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    const newCampaign: Campaign = {
      id: campaign?.id || `CMP-${Date.now()}`,
      ...formData,
      spend: campaign?.spend || 0,
      ctr: campaign?.ctr || 0,
      roi: campaign?.roi || 0,
      impressions: campaign?.impressions || 0,
      clicks: campaign?.clicks || 0,
      conversions: campaign?.conversions || 0,
      createdAt: campaign?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave?.(newCampaign);
    showToast(
      campaign ? "Campaign updated successfully" : "Campaign created successfully",
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
          <h2>{campaign ? "Edit Campaign" : "Create New Campaign"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div className="form-group">
              <label className="form-label">Campaign Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Summer Promotion Campaign"
              />
              {errors.name && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Channel *</label>
              <select
                className="form-input"
                value={formData.channel}
                onChange={(e) => setFormData(prev => ({ ...prev, channel: e.target.value as CampaignChannel }))}
              >
                <option value="Facebook">Facebook</option>
                <option value="Google">Google</option>
                <option value="Email">Email</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
              {errors.startDate && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
              {errors.endDate && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.endDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Budget ($) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.budget && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.budget}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Goal *</label>
              <select
                className="form-input"
                value={formData.goal}
                onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value as CampaignGoal }))}
              >
                <option value="Brand Awareness">Brand Awareness</option>
                <option value="Conversions">Conversions</option>
                <option value="Engagement">Engagement</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Campaign description and details..."
                rows={4}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as CampaignStatus }))}
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
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
              {campaign ? "Update Campaign" : "Create Campaign"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
