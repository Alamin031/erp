"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Campaign } from "@/types/campaigns";
import { useToast } from "./toast";

interface CampaignExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  onExport?: (data: string, format: string, filename: string) => void;
}

export function CampaignExportModal({
  isOpen,
  onClose,
  campaign,
  onExport,
}: CampaignExportModalProps) {
  const { showToast } = useToast();
  const [format, setFormat] = useState<"csv" | "json" | "pdf">("csv");
  const [filename, setFilename] = useState(`campaign_export_${Date.now()}`);

  if (!isOpen || !campaign) return null;

  const generateCSV = (campaign: Campaign): string => {
    const headers = [
      "Campaign ID",
      "Name",
      "Channel",
      "Status",
      "Goal",
      "Start Date",
      "End Date",
      "Budget",
      "Spend",
      "Impressions",
      "Clicks",
      "Conversions",
      "CTR (%)",
      "ROI (%)",
      "Description",
    ];

    const row = [
      campaign.id,
      campaign.name,
      campaign.channel,
      campaign.status,
      campaign.goal,
      new Date(campaign.startDate).toLocaleDateString(),
      new Date(campaign.endDate).toLocaleDateString(),
      campaign.budget.toFixed(2),
      campaign.spend.toFixed(2),
      campaign.impressions,
      campaign.clicks,
      campaign.conversions,
      campaign.ctr.toFixed(2),
      campaign.roi.toFixed(2),
      campaign.description,
    ];

    return [headers.join(","), row.map((cell) => `"${cell}"`).join(",")].join("\n");
  };

  const generateJSON = (campaign: Campaign): string => {
    return JSON.stringify(campaign, null, 2);
  };

  const generatePDF = (campaign: Campaign): string => {
    const conversionRate =
      campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;
    const cpc = campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0;
    const cpa = campaign.conversions > 0 ? campaign.spend / campaign.conversions : 0;

    const pdfContent = `
CAMPAIGN REPORT
${campaign.name}

OVERVIEW
Campaign ID: ${campaign.id}
Channel: ${campaign.channel}
Status: ${campaign.status}
Goal: ${campaign.goal}
Date Range: ${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}

BUDGET & SPEND
Total Budget: $${campaign.budget.toFixed(2)}
Total Spend: $${campaign.spend.toFixed(2)}
Remaining: $${(campaign.budget - campaign.spend).toFixed(2)}
Budget Usage: ${((campaign.spend / campaign.budget) * 100).toFixed(1)}%

PERFORMANCE METRICS
Impressions: ${campaign.impressions.toLocaleString()}
Clicks: ${campaign.clicks.toLocaleString()}
Conversions: ${campaign.conversions.toLocaleString()}
CTR: ${campaign.ctr.toFixed(2)}%
Conversion Rate: ${conversionRate.toFixed(2)}%
ROI: ${campaign.roi.toFixed(0)}%

EFFICIENCY METRICS
Cost Per Click (CPC): $${cpc.toFixed(2)}
Cost Per Acquisition (CPA): $${cpa.toFixed(2)}

DESCRIPTION
${campaign.description}

Generated: ${new Date().toLocaleString()}
    `.trim();

    return pdfContent;
  };

  const handleExport = () => {
    if (!filename.trim()) {
      showToast("Please enter a filename", "error");
      return;
    }

    let data = "";

    if (format === "csv") {
      data = generateCSV(campaign);
    } else if (format === "json") {
      data = generateJSON(campaign);
    } else if (format === "pdf") {
      data = generatePDF(campaign);
    }

    const finalFilename = `${filename}.${format}`;
    onExport?.(data, format, finalFilename);

    const blob = new Blob([data], {
      type: format === "csv" ? "text/csv" : format === "json" ? "application/json" : "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Campaign exported as ${format.toUpperCase()}`, "success");
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
          <h2>Export Campaign</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div style={{ marginBottom: "24px" }}>
            <label className="form-label">Campaign Name</label>
            <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--secondary)" }}>
              {campaign.name}
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label className="form-label">Export Format</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {(["csv", "json", "pdf"] as const).map((f) => (
                <div
                  key={f}
                  onClick={() => setFormat(f)}
                  style={{
                    padding: "12px",
                    border: format === f ? "2px solid var(--primary)" : "1px solid var(--border)",
                    borderRadius: "6px",
                    background: format === f ? "var(--primary)15" : "var(--card-bg)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                    {f.toUpperCase()}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--secondary)" }}>
                    {f === "csv" && "Spreadsheet format"}
                    {f === "json" && "Data format"}
                    {f === "pdf" && "Document format"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label className="form-label">Filename</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                className="form-input"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="campaign_export"
              />
              <span style={{ color: "var(--secondary)", whiteSpace: "nowrap" }}>
                .{format}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "24px", padding: "16px", background: "var(--background)", borderRadius: "6px" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
              Export Data Summary
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" }}>
              <div>
                <span style={{ color: "var(--secondary)" }}>Format:</span> {format.toUpperCase()}
              </div>
              <div>
                <span style={{ color: "var(--secondary)" }}>Filename:</span> {filename}.{format}
              </div>
              <div>
                <span style={{ color: "var(--secondary)" }}>Campaign:</span> {campaign.name}
              </div>
              <div>
                <span style={{ color: "var(--secondary)" }}>Records:</span> 1 campaign
              </div>
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
              onClick={handleExport}
            >
              Export Campaign
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
