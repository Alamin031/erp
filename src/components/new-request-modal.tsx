"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGuestServices } from "@/store/useGuestServices";
import { useToast } from "./toast";
import { newServiceRequestSchema, NewServiceRequestInput } from "@/lib/guest-services-validation";

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewRequestModal({ isOpen, onClose }: NewRequestModalProps) {
  const { addRequest, staff } = useGuestServices();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewServiceRequestInput>({
    resolver: zodResolver(newServiceRequestSchema),
    defaultValues: {
      guestName: "",
      roomNumber: "",
      serviceType: "Room Service",
      priority: "Normal",
      notes: "",
      eta: "",
      assignedStaffIds: [],
    },
  });

  const onSubmitForm = async (data: NewServiceRequestInput) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      addRequest({
        guestName: data.guestName,
        roomNumber: data.roomNumber,
        serviceType: data.serviceType,
        priority: data.priority,
        status: "Open",
        requestedAt: new Date().toISOString(),
        eta: data.eta || new Date(Date.now() + 30 * 60000).toISOString(),
        assignedStaffIds: data.assignedStaffIds || [],
        notes: data.notes,
        attachmentUrl: data.attachmentUrl || undefined,
      });

      showToast("Service request created successfully", "success");
      reset();
      onClose();
    } catch (error) {
      showToast("Failed to create request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <div className="modal-header">
          <h2>Create New Service Request</h2>
          <button className="modal-close" onClick={onClose} title="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
          <div className="form-row">
            <div>
              <label className="form-label">Guest Name *</label>
              <input
                type="text"
                placeholder="Enter guest name"
                {...register("guestName")}
                className="form-input w-full"
              />
              {errors.guestName && (
                <p className="form-error">{errors.guestName.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Room Number *</label>
              <input
                type="text"
                placeholder="e.g., 205"
                {...register("roomNumber")}
                className="form-input w-full"
              />
              {errors.roomNumber && (
                <p className="form-error">{errors.roomNumber.message}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Service Type *</label>
              <select
                {...register("serviceType")}
                className="form-input w-full"
              >
                <option value="Room Service">Room Service</option>
                <option value="Housekeeping Request">Housekeeping Request</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Wake-up Call">Wake-up Call</option>
                <option value="Laundry">Laundry</option>
                <option value="Other">Other</option>
              </select>
              {errors.serviceType && (
                <p className="form-error">{errors.serviceType.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Priority *</label>
              <select
                {...register("priority")}
                className="form-input w-full"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              {errors.priority && (
                <p className="form-error">{errors.priority.message}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Expected Time (Optional)</label>
              <input
                type="datetime-local"
                {...register("eta")}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="form-label">Assign Staff (Optional)</label>
              <select
                multiple
                {...register("assignedStaffIds")}
                className="form-input w-full"
                size={3}
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {!s.isAvailable ? "(Busy)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Notes & Details *</label>
            <textarea
              placeholder="Describe the service request in detail..."
              {...register("notes")}
              className="form-textarea w-full"
            />
            {errors.notes && (
              <p className="form-error">{errors.notes.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Attachment URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("attachmentUrl")}
              className="form-input w-full"
            />
            {errors.attachmentUrl && (
              <p className="form-error">{errors.attachmentUrl.message}</p>
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
              {isSubmitting ? "Creating..." : "Create Request"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
