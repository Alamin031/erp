"use client";

import { Reservation } from "@/types/reservation";

interface UpcomingReservationsProps {
  reservations: Reservation[];
  onViewAll?: () => void;
  onViewDetails?: (reservation: Reservation) => void;
}

export function UpcomingReservations({
  reservations,
  onViewAll,
  onViewDetails,
}: UpcomingReservationsProps) {
  const getUpcomingReservations = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return reservations
      .filter(
        res =>
          res.status === "Confirmed" &&
          new Date(res.checkInDate) >= today
      )
      .sort((a, b) => {
        const dateA = new Date(a.checkInDate).getTime();
        const dateB = new Date(b.checkInDate).getTime();
        return dateA - dateB;
      })
      .slice(0, 5);
  };

  const calculateDaysUntilCheckIn = (checkInDate: string) => {
    const checkIn = new Date(checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = checkIn.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const upcomingReservations = getUpcomingReservations();

  return (
    <div className="upcoming-reservations">
      <div className="upcoming-header">
        <h3>Next 5 Upcoming Reservations</h3>
      </div>

      {upcomingReservations.length > 0 ? (
        <div className="upcoming-cards">
          {upcomingReservations.map(reservation => {
            const daysUntilCheckIn = calculateDaysUntilCheckIn(reservation.checkInDate);

            return (
              <div
                key={reservation.id}
                className="upcoming-card"
                onClick={() => onViewDetails?.(reservation)}
                role="button"
                tabIndex={0}
              >
                <div className="card-header">
                  <h4 className="card-guest-name">{reservation.guestName}</h4>
                  <span className="status-badge" data-status={reservation.status.toLowerCase()}>
                    {reservation.status}
                  </span>
                </div>

                <div className="card-body">
                  <div className="card-item">
                    <span className="card-label">Room</span>
                    <span className="card-value">{reservation.roomType}</span>
                  </div>

                  <div className="card-item">
                    <span className="card-label">Check-in</span>
                    <span className="card-value">
                      {new Date(reservation.checkInDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="card-item">
                    <span className="card-label">In</span>
                    <span className="card-value days-badge">
                      {daysUntilCheckIn === 0
                        ? "Today"
                        : daysUntilCheckIn === 1
                        ? "Tomorrow"
                        : `${daysUntilCheckIn} days`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="upcoming-empty">
          <p>No upcoming confirmed reservations</p>
        </div>
      )}

      {upcomingReservations.length > 0 && onViewAll && (
        <button onClick={onViewAll} className="btn btn-secondary btn-block">
          View All Upcoming →
        </button>
      )}
    </div>
  );
}
