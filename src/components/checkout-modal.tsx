"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Reservation } from "@/types/reservation";
import { useToast } from "./toast";

const checkoutSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  paymentMethod: z.enum(["Cash", "Card", "Online"], {
    message: "Please select a payment method",
  }),
  additionalCharges: z.number().min(0, "Charges cannot be negative").optional(),
  chargeDescription: z.string().optional(),
  roomCondition: z.enum(["Good", "Needs Cleaning", "Damaged"], {
    message: "Please select room condition",
  }),
  notes: z.string().optional(),
});

type CheckoutFormInput = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation?: Reservation | null;
  roomNumber?: string;
  onConfirm?: (data: CheckoutFormInput) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  reservation,
  roomNumber = "N/A",
  onConfirm,
}: CheckoutModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      guestName: reservation?.guestName || "",
      roomNumber: roomNumber,
      checkInDate: reservation?.checkInDate || "",
      checkOutDate: reservation?.checkOutDate || "",
      paymentMethod: "Card",
      additionalCharges: 0,
      roomCondition: "Good",
    },
  });

  const additionalCharges = watch("additionalCharges") || 0;

  const onSubmitForm = async (data: CheckoutFormInput) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (onConfirm) {
        onConfirm(data);
      }

      showToast("Guest Checked-out Successfully", "success");
      reset();
      onClose();
    } catch (error) {
      showToast("Failed to check out guest", "error");
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
          <h2>Process Check-out</h2>
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
              <input
                type="text"
                {...register("roomNumber")}
                className="form-input"
                disabled={true}
                style={{ backgroundColor: "var(--border)", cursor: "not-allowed" }}
              />
              {errors.roomNumber && (
                <span className="form-error">{errors.roomNumber.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Room Condition *</label>
              <select
                {...register("roomCondition")}
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="Good">Good</option>
                <option value="Needs Cleaning">Needs Cleaning</option>
                <option value="Damaged">Damaged</option>
              </select>
              {errors.roomCondition && (
                <span className="form-error">{errors.roomCondition.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Check-in Date *</label>
              <input
                type="date"
                {...register("checkInDate")}
                className="form-input"
                disabled={true}
                style={{ backgroundColor: "var(--border)", cursor: "not-allowed" }}
              />
              {errors.checkInDate && (
                <span className="form-error">{errors.checkInDate.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Check-out Date *</label>
              <input
                type="date"
                {...register("checkOutDate")}
                className="form-input"
                disabled={true}
                style={{ backgroundColor: "var(--border)", cursor: "not-allowed" }}
              />
              {errors.checkOutDate && (
                <span className="form-error">{errors.checkOutDate.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Method *</label>
              <select
                {...register("paymentMethod")}
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
              {errors.paymentMethod && (
                <span className="form-error">{errors.paymentMethod.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Additional Charges ($)</label>
              <input
                type="number"
                {...register("additionalCharges", { valueAsNumber: true })}
                className="form-input"
                min="0"
                step="0.01"
                placeholder="0.00"
                disabled={isSubmitting}
              />
              {additionalCharges > 0 && (
                <span style={{ fontSize: "12px", color: "var(--warning)" }}>
                  Extra charges: ${additionalCharges.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Charge Description</label>
            <input
              type="text"
              {...register("chargeDescription")}
              className="form-input"
              placeholder="e.g., Mini-bar, Late checkout, Damages"
              disabled={isSubmitting}
            />
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
              {isSubmitting ? "Processing..." : "Confirm Check-out"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
