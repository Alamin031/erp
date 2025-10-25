"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCRMSettings } from "@/store/useCRMSettings";
import { useToast } from "@/components/toast";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { AddPipelineModal } from "./modals/AddPipelineModal";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

export function PipelinesTab() {
  const { pipelines, deletePipeline } = useCRMSettings();
  const { showToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await deletePipeline(deleteConfirmId);
      showToast("Pipeline deleted successfully", "success");
      setDeleteConfirmId(null);
    } catch (error) {
      showToast("Failed to delete pipeline", "error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
      <div style={{ padding: "32px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Sales Pipelines</h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#fff",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
            Add Pipeline
          </button>
        </div>

        {pipelines.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
            <p>No pipelines yet. Create your first pipeline to get started.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {pipelines.map((pipeline) => (
              <motion.div
                key={pipeline.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                style={{
                  padding: "16px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card-bg)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, marginBottom: 4 }}>{pipeline.name}</h4>
                  <p style={{ color: "var(--secondary)", fontSize: "14px", marginBottom: 8 }}>
                    {pipeline.stages.length} stages: {pipeline.stages.join(" → ")}
                  </p>
                  <p style={{ color: "var(--secondary)", fontSize: "12px" }}>
                    Created {new Date(pipeline.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                  <button
                    onClick={() => setSelectedPipelineId(pipeline.id)}
                    style={{
                      padding: "8px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      backgroundColor: "transparent",
                      color: "var(--foreground)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(pipeline.id)}
                    style={{
                      padding: "8px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      backgroundColor: "transparent",
                      color: "var(--danger)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AddPipelineModal
          isOpen={isAddModalOpen || !!selectedPipelineId}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedPipelineId(null);
          }}
          editingId={selectedPipelineId}
          onEditingChange={setSelectedPipelineId}
        />

        <ConfirmDeleteModal
          isOpen={!!deleteConfirmId}
          title="Delete Pipeline"
          message="Are you sure you want to delete this pipeline? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirmId(null)}
        />
      </div>
    </motion.div>
  );
}
