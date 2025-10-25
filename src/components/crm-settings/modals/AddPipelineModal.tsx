"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { useCRMSettings } from "@/store/useCRMSettings";
import { useToast } from "@/components/toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
  onEditingChange: (id: string | null) => void;
}

export function AddPipelineModal({ isOpen, onClose, editingId, onEditingChange }: Props) {
  const { pipelines, addPipeline, updatePipeline } = useCRMSettings();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [stages, setStages] = useState<string[]>(["Stage 1", "Stage 2", "Stage 3"]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingId) {
      const pipeline = pipelines.find((p) => p.id === editingId);
      if (pipeline) {
        setName(pipeline.name);
        setStages([...pipeline.stages]);
      }
    }
  }, [editingId, pipelines]);

  const handleClose = () => {
    setName("");
    setStages(["Stage 1", "Stage 2", "Stage 3"]);
    setError(null);
    onEditingChange(null);
    onClose();
  };

  const handleAddStage = () => {
    setStages([...stages, `Stage ${stages.length + 1}`]);
  };

  const handleRemoveStage = (index: number) => {
    if (stages.length > 1) {
      setStages(stages.filter((_, i) => i !== index));
    }
  };

  const handleStageChange = (index: number, value: string) => {
    const newStages = [...stages];
    newStages[index] = value;
    setStages(newStages);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Pipeline name is required");
      return;
    }
    if (stages.length === 0) {
      setError("At least one stage is required");
      return;
    }
    if (stages.some((s) => !s.trim())) {
      setError("All stages must have names");
      return;
    }

    try {
      if (editingId) {
        await updatePipeline(editingId, { name, stages });
        showToast("Pipeline updated successfully", "success");
      } else {
        await addPipeline({ name, stages });
        showToast("Pipeline created successfully", "success");
      }
      handleClose();
    } catch (error) {
      showToast("Failed to save pipeline", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleClose} />
      <div className="modal">
        <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="modal-header">
            <h2>{editingId ? "Edit Pipeline" : "Add Pipeline"}</h2>
            <button className="modal-close" onClick={handleClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-form">
            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  backgroundColor: "rgba(220, 53, 69, 0.1)",
                  color: "var(--danger)",
                  marginBottom: 16,
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label className="form-label" style={{ marginBottom: 8, display: "block", fontWeight: 500 }}>
                Pipeline Name
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g., Sales Pipeline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: 12, display: "block", fontWeight: 500 }}>
                Stages
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {stages.map((stage, index) => (
                  <div key={index} style={{ display: "flex", gap: 8 }}>
                    <input
                      className="form-input"
                      type="text"
                      value={stage}
                      onChange={(e) => handleStageChange(index, e.target.value)}
                      placeholder={`Stage ${index + 1}`}
                      style={{ flex: 1 }}
                    />
                    {stages.length > 1 && (
                      <button
                        onClick={() => handleRemoveStage(index)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          backgroundColor: "transparent",
                          color: "var(--danger)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddStage}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  backgroundColor: "transparent",
                  color: "var(--primary)",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                <Plus size={16} />
                Add Stage
              </button>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editingId ? "Update Pipeline" : "Create Pipeline"}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
