"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ReservationFormInput } from "@/types/reservation";
import { useToast } from "./toast";

const reservationSchema = z.object({
  guestName: z.string().min(2, "Guest name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  roomType: z.enum(["Single", "Double", "Suite", "Deluxe"], {
    errorMap: () => ({ message: "Please select a room type" }),
  }),
  checkInDate: z.string().refine(date => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "Check-in date must be today or later"),
  checkOutDate: z.string(),
  numberOfGuests: z.number().min(1, "At least 1 guest required").max(6, "Maximum 6 guests"),
  notes: z.string().optional(),
}).refine(
  (data) => new Date(data.checkOutDate) > new Date(data.checkInDate),
  {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  }
);

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ReservationFormInput) => void;
}

export function ReservationForm({ isOpen, onClose, onSubmit }: ReservationFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReservationFormInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      numberOfGuests: 1,
      roomType: "Double",
    },
  });

  const onSubmitForm = async (data: ReservationFormInput) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      if (onSubmit) {
        onSubmit(data);
      }
      
      showToast("Reservation Added Successfully", "success");
      reset();
      onClose();
    } catch (error) {
      showToast("Failed to add reservation", "error");
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
          <h2>Add New Reservation</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
          <div className="form-group">
            <label className="form-label">Guest Name *</label>
            <input
              type="text"
              {...register("guestName")}
              className="form-input"
              placeholder="Enter guest name"
              disabled={isSubmitting}
            />
            {errors.guestName && <span className="form-error">{errors.guestName.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                {...register("email")}
                className="form-input"
                placeholder="guest@example.com"
                disabled={isSubmitting}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                {...register("phone")}
                className="form-input"
                placeholder="+1-555-0000"
                disabled={isSubmitting}
              />
              {errors.phone && <span className="form-error">{errors.phone.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Room Type *</label>
            <select
              {...register("roomType")}
              className="form-input"
              disabled={isSubmitting}
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
            </select>
            {errors.roomType && <span className="form-error">{errors.roomType.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Check-in Date *</label>
              <input
                type="date"
                {...register("checkInDate")}
                className="form-input"
                disabled={isSubmitting}
              />
              {errors.checkInDate && <span className="form-error">{errors.checkInDate.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Check-out Date *</label>
              <input
                type="date"
                {...register("checkOutDate")}
                className="form-input"
                disabled={isSubmitting}
              />
              {errors.checkOutDate && <span className="form-error">{errors.checkOutDate.message}</span>}
            </div>
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
            {errors.numberOfGuests && <span className="form-error">{errors.numberOfGuests.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Special Requests</label>
            <textarea
              {...register("notes")}
              className="form-input form-textarea"
              placeholder="Any special requests or notes..."
              rows={4}
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
              {isSubmitting ? "Adding..." : "Add Reservation"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
