"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCRMSettings } from "@/store/useCRMSettings";
import { useToast } from "@/components/toast";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { AddCustomFieldModal } from "./modals/AddCustomFieldModal";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

const ENTITY_LABELS: Record<string, string> = {
  lead: "Lead",
  contact: "Contact",
  deal: "Deal",
};

const TYPE_LABELS: Record<string, string> = {
  text: "Text",
  date: "Date",
  dropdown: "Dropdown",
  checkbox: "Checkbox",
};

export function CustomFieldsTab() {
  const { customFields, deleteCustomField } = useCRMSettings();
  const { showToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteCustomField(deleteConfirmId);
      showToast("Custom field deleted successfully", "success");
      setDeleteConfirmId(null);
    } catch (error) {
      showToast("Failed to delete custom field", "error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
      <div style={{ padding: "32px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Custom Fields</h3>
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
            Add Custom Field
          </button>
        </div>

        {customFields.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
            <p>No custom fields yet. Add your first custom field to extend your CRM.</p>
          </div>
        ) : (
          <div style={{ borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--card-bg)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--background)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: "14px" }}>Field Name</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: "14px" }}>Type</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: "14px" }}>Applies To</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: "14px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customFields.map((field) => (
                  <motion.tr
                    key={field.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>{field.name}</td>
                    <td style={{ padding: "12px 16px", color: "var(--secondary)" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: 4,
                          backgroundColor: "var(--border)",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {TYPE_LABELS[field.type] || field.type}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--secondary)" }}>
                      {ENTITY_LABELS[field.appliesToEntity] || field.appliesToEntity}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setSelectedFieldId(field.id)}
                          style={{
                            padding: "6px",
                            borderRadius: 6,
                            border: "none",
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
                          onClick={() => setDeleteConfirmId(field.id)}
                          style={{
                            padding: "6px",
                            borderRadius: 6,
                            border: "none",
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
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AddCustomFieldModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          editingId={selectedFieldId}
          onEditingChange={setSelectedFieldId}
        />

        <ConfirmDeleteModal
          isOpen={!!deleteConfirmId}
          title="Delete Custom Field"
          message="Are you sure you want to delete this custom field? This action cannot be undone and will affect all associated records."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirmId(null)}
        />
      </div>
    </motion.div>
  );
}
