"use client";

import { motion } from "framer-motion";
import { Campaign } from "@/types/campaigns";
import { CampaignStatusBadge } from "./campaign-status-badge";

interface CampaignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  onEdit?: (campaign: Campaign) => void;
  onExport?: (campaign: Campaign) => void;
}

export function CampaignDetailModal({
  isOpen,
  onClose,
  campaign,
  onEdit,
  onExport,
}: CampaignDetailModalProps) {
  if (!isOpen || !campaign) return null;

  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  const today = new Date();

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, (elapsedDays / totalDays) * 100);

  const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;
  const cpc = campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0;
  const cpa = campaign.conversions > 0 ? campaign.spend / campaign.conversions : 0;

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{ zIndex: 1000 }}
      />
      <motion.div
        className="modal"
        style={{ zIndex: 1001, maxHeight: "90vh", overflowY: "auto" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-header">
          <h2>{campaign.name}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Overview
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  Campaign Name
                </label>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "var(--foreground)" }}>
                  {campaign.name}
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  Channel
                </label>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "var(--foreground)" }}>
                  {campaign.channel}
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  Start Date
                </label>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "var(--foreground)" }}>
                  {startDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  End Date
                </label>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "var(--foreground)" }}>
                  {endDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  Budget
                </label>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "var(--foreground)" }}>
                  ${campaign.budget.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  Goal
                </label>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "var(--foreground)" }}>
                  {campaign.goal}
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  Status
                </label>
                <div style={{ marginTop: "2px" }}>
                  <CampaignStatusBadge status={campaign.status} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Performance Metrics
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  Impressions
                </label>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--foreground)" }}>
                  {campaign.impressions.toLocaleString()}
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  Clicks
                </label>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--foreground)" }}>
                  {campaign.clicks.toLocaleString()}
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  Conversions
                </label>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--foreground)" }}>
                  {campaign.conversions.toLocaleString()}
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  CTR
                </label>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#2563eb" }}>
                  {campaign.ctr.toFixed(2)}%
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  Conversion Rate
                </label>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#059669" }}>
                  {conversionRate.toFixed(2)}%
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  ROI
                </label>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#059669" }}>
                  +{campaign.roi.toFixed(0)}%
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  CPC
                </label>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--foreground)" }}>
                  ${cpc.toFixed(2)}
                </p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "4px", display: "block" }}>
                  CPA
                </label>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--foreground)" }}>
                  ${cpa.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Campaign Progress
            </h3>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px" }}>
                <span style={{ color: "var(--secondary)" }}>Duration Progress</span>
                <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                  {Math.round(progressPercent)}% ({elapsedDays} of {totalDays} days)
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "var(--border)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: "100%",
                    background: "#2563eb",
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px" }}>
                <span style={{ color: "var(--secondary)" }}>Budget Usage</span>
                <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                  ${campaign.spend.toLocaleString("en-US", { maximumFractionDigits: 2 })} / ${campaign.budget.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "var(--border)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, (campaign.spend / campaign.budget) * 100)}%`,
                    height: "100%",
                    background: campaign.spend > campaign.budget ? "#dc3545" : "#059669",
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Description
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--secondary)", lineHeight: "1.6" }}>
              {campaign.description || "No description provided"}
            </p>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onExport?.(campaign)}
            >
              Export
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onEdit?.(campaign)}
            >
              Edit Campaign
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
