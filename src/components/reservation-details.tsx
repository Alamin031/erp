"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reservation } from "@/types/reservation";

interface ReservationDetailsProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (reservation: Reservation) => void;
  onCancel?: (id: string) => void;
}

const slideOverVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export function ReservationDetails({
  reservation,
  isOpen,
  onClose,
  onEdit,
  onCancel,
}: ReservationDetailsProps) {
  const [isActionLoading, setIsActionLoading] = useState(false);

  if (!reservation) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(reservation);
    }
  };

  const handleCancel = async () => {
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (onCancel) {
        onCancel(reservation.id);
      }
      onClose();
    } finally {
      setIsActionLoading(false);
    }
  };

  const calculateDaysUntilCheckIn = () => {
    const checkIn = new Date(reservation.checkInDate);
    const today = new Date();
    const diffTime = checkIn.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateNumberOfNights = () => {
    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilCheckIn = calculateDaysUntilCheckIn();
  const numberOfNights = calculateNumberOfNights();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="slide-over-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="slide-over"
            variants={slideOverVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="slide-over-header">
              <h2>Reservation Details</h2>
              <button className="slide-over-close" onClick={onClose}>✕</button>
            </div>

            <div className="slide-over-content">
              <div className="details-section">
                <h3 className="details-title">Guest Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Guest Name</span>
                    <span className="detail-value">{reservation.guestName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Booking ID</span>
                    <span className="detail-value">{reservation.bookingId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{reservation.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{reservation.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Number of Guests</span>
                    <span className="detail-value">{reservation.numberOfGuests}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3 className="details-title">Room & Dates</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Room Type</span>
                    <span className="detail-value">{reservation.roomType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Check-in</span>
                    <span className="detail-value">
                      {new Date(reservation.checkInDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Check-out</span>
                    <span className="detail-value">
                      {new Date(reservation.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{numberOfNights} night{numberOfNights !== 1 ? 's' : ''}</span>
                  </div>
                  {daysUntilCheckIn > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">Check-in in</span>
                      <span className="detail-value">{daysUntilCheckIn} day{daysUntilCheckIn !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="details-section">
                <h3 className="details-title">Status & Payment</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Reservation Status</span>
                    <div className="status-badge" data-status={reservation.status.toLowerCase()}>
                      {reservation.status}
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment Status</span>
                    <div className="status-badge" data-status={reservation.paymentStatus.toLowerCase()}>
                      {reservation.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>

              {reservation.notes && (
                <div className="details-section">
                  <h3 className="details-title">Special Requests</h3>
                  <p className="details-notes">{reservation.notes}</p>
                </div>
              )}
            </div>

            <div className="slide-over-actions">
              {reservation.status === "Confirmed" && (
                <button
                  onClick={handleEdit}
                  className="btn btn-primary"
                  disabled={isActionLoading}
                >
                  Edit Reservation
                </button>
              )}
              {reservation.status !== "Cancelled" && (
                <button
                  onClick={handleCancel}
                  className="btn btn-danger"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? "Cancelling..." : "Cancel Reservation"}
                </button>
              )}
              <button onClick={onClose} className="btn btn-secondary">
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
