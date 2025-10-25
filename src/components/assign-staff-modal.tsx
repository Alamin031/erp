"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGuestServices } from "@/store/useGuestServices";
import { useToast } from "./toast";
import { assignStaffSchema, AssignStaffInput } from "@/lib/guest-services-validation";

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
}

export function AssignStaffModal({ isOpen, onClose, requestId }: AssignStaffModalProps) {
  const { assignRequest, staff } = useGuestServices();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AssignStaffInput>({
    resolver: zodResolver(assignStaffSchema),
    defaultValues: {
      staffIds: [],
      eta: "",
    },
  });

  const onSubmitForm = async (data: AssignStaffInput) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      assignRequest(requestId, data.staffIds);

      showToast("Staff assigned successfully", "success");
      reset();
      onClose();
    } catch (error) {
      showToast("Failed to assign staff", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableStaff = staff.filter((s) => s.isAvailable || s.currentAssignments < 5);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ zIndex: 1001 }}>
        <div className="modal-card" style={{ maxWidth: "650px", maxHeight: "90vh", overflow: "auto" }}>
          <div className="modal-header">
            <h2>Assign Staff to Request</h2>
            <button className="modal-close" onClick={onClose} title="Close modal">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
            <div className="form-group">
              <label className="form-label">Select Staff Members *</label>
              <select
                multiple
                {...register("staffIds")}
                className="form-input"
                style={{ minHeight: "200px", padding: "8px" }}
                title="Hold Ctrl/Cmd to select multiple staff members"
              >
                {availableStaff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - {s.role} ({s.currentAssignments} current)
                  </option>
                ))}
              </select>
              {errors.staffIds && (
                <p className="form-error">{errors.staffIds.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Expected Time of Completion (Optional)</label>
              <input
                type="datetime-local"
                {...register("eta")}
                className="form-input"
              />
            </div>

            <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "var(--secondary)", borderRadius: "6px", background: "var(--background)", padding: "12px", border: "1px solid var(--border)" }}>
              <span>💡</span>
              <p style={{ margin: 0 }}>Hold Ctrl (or Cmd on Mac) and click to select multiple staff members</p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Assigning..." : "Assign Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
