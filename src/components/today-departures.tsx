"use client";

import { useMemo } from "react";
import { Reservation } from "@/types/reservation";
import { motion } from "framer-motion";

interface TodayDeparturesProps {
  reservations: Reservation[];
  checkedOutGuests?: string[];
  onCheckout?: (reservation: Reservation, roomNumber: string) => void;
}

export function TodayDepartures({
  reservations,
  checkedOutGuests = [],
  onCheckout,
}: TodayDeparturesProps) {
  const todayDepartures = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return reservations
      .filter(
        res =>
          res.status === "Confirmed" &&
          new Date(res.checkOutDate).getTime() === today.getTime() &&
          !checkedOutGuests.includes(res.id)
      )
      .sort((a, b) => a.guestName.localeCompare(b.guestName));
  }, [reservations, checkedOutGuests]);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  if (todayDepartures.length === 0) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <p style={{ color: "var(--secondary)", margin: 0 }}>
          No departures scheduled for today
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
      {todayDepartures.map(reservation => (
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
              data-status={reservation.paymentStatus.toLowerCase()}
            >
              {reservation.paymentStatus}
            </span>
          </div>

          <div className="card-body">
            <div className="card-item">
              <span className="card-label">Room Type</span>
              <span className="card-value">{reservation.roomType}</span>
            </div>

            <div className="card-item">
              <span className="card-label">Check-out Date</span>
              <span className="card-value">
                {new Date(reservation.checkOutDate).toLocaleDateString()}
              </span>
            </div>

            <div className="card-item">
              <span className="card-label">Phone</span>
              <span className="card-value" style={{ fontSize: "12px" }}>
                {reservation.phone}
              </span>
            </div>

            <div className="card-item">
              <span className="card-label">Email</span>
              <span className="card-value" style={{ fontSize: "12px" }}>
                {reservation.email}
              </span>
            </div>
          </div>

          {onCheckout && (
            <button
              onClick={() => onCheckout(reservation, "TBD")}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "8px" }}
            >
              Process Check-out
            </button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
