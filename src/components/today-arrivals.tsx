"use client";

import { useMemo } from "react";
import { Reservation } from "@/types/reservation";
import { motion, Variants } from "framer-motion";

interface TodayArrivalsProps {
  reservations: Reservation[];
  onCheckIn?: (reservation: Reservation) => void;
}

export function TodayArrivals({ reservations, onCheckIn }: TodayArrivalsProps) {
  const todayArrivals = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return reservations
      .filter(
        res =>
          res.status === "Confirmed" &&
          new Date(res.checkInDate).getTime() === today.getTime()
      )
      .sort((a, b) => a.guestName.localeCompare(b.guestName));
  }, [reservations]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (todayArrivals.length === 0) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <p style={{ color: "var(--secondary)", margin: 0 }}>
          No arrivals scheduled for today
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="upcoming-cards"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {todayArrivals.map(reservation => (
        <motion.div
          key={reservation.id}
          className="upcoming-card"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="card-header">
            <h4 className="card-guest-name">{reservation.guestName}</h4>
            <span
              className="status-badge"
              data-status={reservation.status.toLowerCase()}
            >
              {reservation.status}
            </span>
          </div>

          <div className="card-body">
            <div className="card-item">
              <span className="card-label">Room Type</span>
              <span className="card-value">{reservation.roomType}</span>
            </div>

            <div className="card-item">
              <span className="card-label">Guests</span>
              <span className="card-value">{reservation.numberOfGuests}</span>
            </div>

            <div className="card-item">
              <span className="card-label">Phone</span>
              <span className="card-value" style={{ fontSize: "12px" }}>
                {reservation.phone}
              </span>
            </div>

            {reservation.notes && (
              <div className="card-item">
                <span className="card-label">Notes</span>
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
                  {reservation.notes}
                </span>
              </div>
            )}
          </div>

          {onCheckIn && (
            <button
              onClick={() => onCheckIn(reservation)}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "8px" }}
            >
              Check-in Now
            </button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
