"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lead, LeadStage } from "@/types/leads";
import { MoreVertical, Edit2, ArrowRight, Eye } from "lucide-react";

interface PipelineStageBoardProps {
  leadsByStage: Record<LeadStage, Lead[]>;
  onEdit?: (lead: Lead) => void;
  onViewDetails?: (lead: Lead) => void;
  onChangeStage?: (leadId: string, newStage: LeadStage) => void;
}

const stageConfig: Record<LeadStage, { color: string; bgColor: string; order: number }> = {
  New: { color: "#6b7280", bgColor: "rgba(107, 114, 128, 0.1)", order: 0 },
  Contacted: { color: "#2563eb", bgColor: "rgba(37, 99, 235, 0.1)", order: 1 },
  Qualified: { color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.1)", order: 2 },
  Proposal: { color: "#8b5cf6", bgColor: "rgba(139, 92, 246, 0.1)", order: 3 },
  "Closed Won": { color: "#059669", bgColor: "rgba(5, 150, 105, 0.1)", order: 4 },
  "Closed Lost": { color: "#dc3545", bgColor: "rgba(220, 53, 69, 0.1)", order: 5 },
};

const stages: LeadStage[] = ["New", "Contacted", "Qualified", "Proposal", "Closed Won", "Closed Lost"];

export function PipelineStageBoard({
  leadsByStage,
  onEdit,
  onViewDetails,
  onChangeStage,
}: PipelineStageBoardProps) {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragSourceStage, setDragSourceStage] = useState<LeadStage | null>(null);

  const handleDragStart = (lead: Lead, stage: LeadStage) => {
    setDraggedLead(lead);
    setDragSourceStage(stage);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnStage = (targetStage: LeadStage) => {
    if (draggedLead && dragSourceStage && dragSourceStage !== targetStage) {
      onChangeStage?.(draggedLead.id, targetStage);
      setDraggedLead(null);
      setDragSourceStage(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "32px",
        overflowX: "auto",
      }}
    >
      <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
        Sales Pipeline
      </h3>

      <motion.div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(300px, 1fr)",
          gap: "16px",
        }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {stages.map((stage) => {
          const config = stageConfig[stage];
          const stageLeads = leadsByStage[stage] || [];

          return (
            <motion.div
              key={stage}
              variants={columnVariants}
              style={{
                background: "var(--background)",
                border: `2px solid ${config.color}`,
                borderRadius: "8px",
                padding: "16px",
              }}
              onDragOver={handleDragOver}
              onDrop={() => handleDropOnStage(stage)}
            >
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: config.color,
                    }}
                  />
                  <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                    {stage}
                  </h4>
                </div>
                <div style={{ fontSize: "12px", color: "var(--secondary)" }}>
                  {stageLeads.length} lead{stageLeads.length !== 1 ? "s" : ""}
                </div>
              </div>

              <motion.div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
                variants={containerVariants}
              >
                {stageLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    variants={cardVariants}
                    draggable
                    onDragStart={() => handleDragStart(lead, stage)}
                    style={{
                      background: config.bgColor,
                      border: `1px solid ${config.color}`,
                      borderRadius: "6px",
                      padding: "12px",
                      cursor: "grab",
                      transition: "all 0.2s",
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: `0 4px 12px ${config.color}30`,
                    }}
                  >
                    <div style={{ marginBottom: "8px" }}>
                      <h5
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--foreground)",
                          marginBottom: "2px",
                        }}
                      >
                        {lead.name}
                      </h5>
                      <p style={{ margin: 0, fontSize: "12px", color: "var(--secondary)" }}>
                        {lead.company}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                        paddingBottom: "8px",
                        borderBottom: `1px solid ${config.color}40`,
                      }}
                    >
                      <span style={{ fontSize: "13px", fontWeight: "600", color: config.color }}>
                        ${(lead.potentialValue / 1000).toFixed(0)}K
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--secondary)" }}>
                        {lead.assignedToName}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => onViewDetails?.(lead)}
                        style={{
                          flex: 1,
                          padding: "4px 8px",
                          fontSize: "11px",
                          color: "var(--primary)",
                          background: "transparent",
                          border: "1px solid var(--primary)40",
                          borderRadius: "4px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        <Eye size={12} />
                        View
                      </button>
                      <button
                        onClick={() => onEdit?.(lead)}
                        style={{
                          padding: "4px 8px",
                          fontSize: "11px",
                          color: "var(--primary)",
                          background: "transparent",
                          border: "1px solid var(--primary)40",
                          borderRadius: "4px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
