"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGuestServices } from "@/store/useGuestServices";
import { useToast } from "./toast";
import { addNoteSchema, AddNoteInput } from "@/lib/guest-services-validation";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  staffName?: string;
}

export function AddNoteModal({ isOpen, onClose, requestId, staffName = "Staff" }: AddNoteModalProps) {
  const { addNote } = useGuestServices();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddNoteInput>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: {
      note: "",
    },
  });

  const onSubmitForm = async (data: AddNoteInput) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      addNote(requestId, data.note, staffName);

      showToast("Note added successfully", "success");
      reset();
      onClose();
    } catch (error) {
      showToast("Failed to add note", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ zIndex: 1001 }}>
        <div className="modal-card" style={{ maxWidth: "600px" }}>
          <div className="modal-header">
            <h2>Add Note to Request</h2>
            <button className="modal-close" onClick={onClose} title="Close modal">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
            <div className="form-group">
              <label className="form-label">Note *</label>
              <textarea
                placeholder="Add any notes or updates about this request..."
                {...register("note")}
                className="form-input"
                rows={5}
                style={{ resize: "vertical", minHeight: "120px" }}
              />
              {errors.note && (
                <p className="form-error">{errors.note.message}</p>
              )}
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
                {isSubmitting ? "Adding..." : "Add Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
