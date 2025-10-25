"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { useCRMSettings, CustomField } from "@/store/useCRMSettings";
import { useToast } from "@/components/toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
  onEditingChange: (id: string | null) => void;
}

export function AddCustomFieldModal({ isOpen, onClose, editingId, onEditingChange }: Props) {
  const { customFields, addCustomField, updateCustomField } = useCRMSettings();
  const { showToast } = useToast();
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<"text" | "date" | "dropdown" | "checkbox">("text");
  const [appliesToEntity, setAppliesToEntity] = useState<"lead" | "contact" | "deal">("lead");
  const [dropdownOptions, setDropdownOptions] = useState<string[]>(["Option 1", "Option 2"]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingId) {
      const field = customFields.find((f) => f.id === editingId);
      if (field) {
        setFieldName(field.name);
        setFieldType(field.type);
        setAppliesToEntity(field.appliesToEntity);
        if (field.options) {
          setDropdownOptions([...field.options]);
        }
      }
    }
  }, [editingId, customFields]);

  const handleClose = () => {
    setFieldName("");
    setFieldType("text");
    setAppliesToEntity("lead");
    setDropdownOptions(["Option 1", "Option 2"]);
    setError(null);
    onEditingChange(null);
    onClose();
  };

  const handleAddOption = () => {
    setDropdownOptions([...dropdownOptions, `Option ${dropdownOptions.length + 1}`]);
  };

  const handleRemoveOption = (index: number) => {
    if (dropdownOptions.length > 1) {
      setDropdownOptions(dropdownOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...dropdownOptions];
    newOptions[index] = value;
    setDropdownOptions(newOptions);
  };

  const handleSave = async () => {
    if (!fieldName.trim()) {
      setError("Field name is required");
      return;
    }
    if (fieldType === "dropdown" && dropdownOptions.some((o) => !o.trim())) {
      setError("All dropdown options must have values");
      return;
    }

    try {
      const fieldData: Omit<CustomField, "id"> = {
        name: fieldName,
        type: fieldType,
        appliesToEntity,
        ...(fieldType === "dropdown" && { options: dropdownOptions }),
      };

      if (editingId) {
        await updateCustomField(editingId, fieldData);
        showToast("Custom field updated successfully", "success");
      } else {
        await addCustomField(fieldData);
        showToast("Custom field created successfully", "success");
      }
      handleClose();
    } catch (error) {
      showToast("Failed to save custom field", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleClose} />
      <div className="modal">
        <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="modal-header">
            <h2>{editingId ? "Edit Custom Field" : "Add Custom Field"}</h2>
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
                Field Name
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g., Industry"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label className="form-label" style={{ marginBottom: 8, display: "block", fontWeight: 500 }}>
                  Field Type
                </label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--card-bg)",
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  <option value="text">Text</option>
                  <option value="date">Date</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 8, display: "block", fontWeight: 500 }}>
                  Applies To
                </label>
                <select
                  value={appliesToEntity}
                  onChange={(e) => setAppliesToEntity(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--card-bg)",
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  <option value="lead">Lead</option>
                  <option value="contact">Contact</option>
                  <option value="deal">Deal</option>
                </select>
              </div>
            </div>

            {fieldType === "dropdown" && (
              <div>
                <label className="form-label" style={{ marginBottom: 12, display: "block", fontWeight: 500 }}>
                  Dropdown Options
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                  {dropdownOptions.map((option, index) => (
                    <div key={index} style={{ display: "flex", gap: 8 }}>
                      <input
                        className="form-input"
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        style={{ flex: 1 }}
                      />
                      {dropdownOptions.length > 1 && (
                        <button
                          onClick={() => handleRemoveOption(index)}
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
                  onClick={handleAddOption}
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
                  Add Option
                </button>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              onClick={handleClose}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                color: "var(--foreground)",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#fff",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {editingId ? "Update Field" : "Create Field"}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
