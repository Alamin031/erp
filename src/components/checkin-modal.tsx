"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Reservation } from "@/types/reservation";
import { useToast } from "./toast";

const checkinSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  numberOfGuests: z
    .number()
    .min(1, "At least 1 guest required")
    .max(6, "Maximum 6 guests"),
  checkInTime: z.string().min(1, "Check-in time is required"),
  idPassportFile: z
    .instanceof(FileList)
    .optional()
    .refine(
      files => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    ),
  notes: z.string().optional(),
});

type CheckinFormInput = z.infer<typeof checkinSchema>;

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation?: Reservation | null;
  onConfirm?: (data: CheckinFormInput) => void;
}

const ROOM_NUMBERS = Array.from({ length: 50 }, (_, i) => `${i + 101}`);

export function CheckinModal({
  isOpen,
  onClose,
  reservation,
  onConfirm,
}: CheckinModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CheckinFormInput>({
    resolver: zodResolver(checkinSchema),
    defaultValues: {
      guestName: reservation?.guestName || "",
      numberOfGuests: reservation?.numberOfGuests || 1,
      checkInTime: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  });

  const idPassportFile = watch("idPassportFile");

  const onSubmitForm = async (data: CheckinFormInput) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (onConfirm) {
        onConfirm(data);
      }

      showToast("Guest Checked-in Successfully", "success");
      reset();
      onClose();
    } catch (error) {
      showToast("Failed to check in guest", "error");
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
          <h2>Check-in Guest</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
          <div className="form-group">
            <label className="form-label">Guest Name *</label>
            <input
              type="text"
              {...register("guestName")}
              className="form-input"
              placeholder="Guest name"
              disabled={true}
              style={{ backgroundColor: "var(--border)", cursor: "not-allowed" }}
            />
            {errors.guestName && (
              <span className="form-error">{errors.guestName.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Room Number *</label>
              <select
                {...register("roomNumber")}
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="">Select a room</option>
                {ROOM_NUMBERS.map(room => (
                  <option key={room} value={room}>
                    Room {room}
                  </option>
                ))}
              </select>
              {errors.roomNumber && (
                <span className="form-error">{errors.roomNumber.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Number of Guests *</label>
              <input
                type="number"
                {...register("numberOfGuests", { valueAsNumber: true })}
                className="form-input"
                min="1"
                max="6"
                disabled={isSubmitting}
              />
              {errors.numberOfGuests && (
                <span className="form-error">
                  {errors.numberOfGuests.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Check-in Time *</label>
              <input
                type="time"
                {...register("checkInTime")}
                className="form-input"
                disabled={isSubmitting}
              />
              {errors.checkInTime && (
                <span className="form-error">{errors.checkInTime.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">ID / Passport Upload</label>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                }}
              >
                <input
                  type="file"
                  {...register("idPassportFile")}
                  className="form-input"
                  accept="image/*,.pdf"
                  disabled={isSubmitting}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                  }}
                />
              </div>
              {idPassportFile && idPassportFile.length > 0 && (
                <span style={{ fontSize: "12px", color: "var(--success)" }}>
                  ✓ {idPassportFile[0].name}
                </span>
              )}
              {errors.idPassportFile && (
                <span className="form-error">
                  {errors.idPassportFile.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Remarks</label>
            <textarea
              {...register("notes")}
              className="form-input form-textarea"
              placeholder="Any special notes or remarks..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm Check-in"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
