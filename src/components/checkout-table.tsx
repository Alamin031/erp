"use client";

import { useState, useMemo } from "react";
import { Reservation } from "@/types/reservation";

interface CheckoutTableProps {
  reservations: Reservation[];
  onCheckout?: (reservation: Reservation, roomNumber: string) => void;
  onView?: (reservation: Reservation) => void;
}

const ITEMS_PER_PAGE = 10;

export function CheckoutTable({
  reservations,
  onCheckout,
  onView,
}: CheckoutTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRoomType, setFilterRoomType] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");

  const filteredReservations = useMemo(() => {
    let filtered = reservations;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        res =>
          res.guestName.toLowerCase().includes(query) ||
          res.bookingId.toLowerCase().includes(query)
      );
    }

    if (filterRoomType) {
      filtered = filtered.filter(res => res.roomType === filterRoomType);
    }

    if (filterPaymentStatus) {
      filtered = filtered.filter(res => res.paymentStatus === filterPaymentStatus);
    }

    return filtered;
  }, [reservations, searchQuery, filterRoomType, filterPaymentStatus]);

  const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReservations = filteredReservations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const roomTypes = Array.from(new Set(reservations.map(r => r.roomType)));
  const paymentStatuses = Array.from(new Set(reservations.map(r => r.paymentStatus)));

  if (filteredReservations.length === 0 && searchQuery === "" && filterRoomType === "" && filterPaymentStatus === "") {
    return (
      <div className="empty-state">
        <p>No departures today</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            className="form-input"
            placeholder="Search guest name or booking ID..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label className="form-label">Room Type</label>
            <select
              className="form-input"
              value={filterRoomType}
              onChange={e => {
                setFilterRoomType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Room Types</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Payment Status</label>
            <select
              className="form-input"
              value={filterPaymentStatus}
              onChange={e => {
                setFilterPaymentStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Payment Status</option>
              {paymentStatuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest Name</th>
              <th>Room Type</th>
              <th>Check-in Date</th>
              <th>Check-out Date</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.map(reservation => (
              <tr key={reservation.id}>
                <td>
                  <span className="booking-id">{reservation.bookingId}</span>
                </td>
                <td>{reservation.guestName}</td>
                <td>{reservation.roomType}</td>
                <td>{new Date(reservation.checkInDate).toLocaleDateString()}</td>
                <td>{new Date(reservation.checkOutDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className="status-badge"
                    data-status={reservation.paymentStatus.toLowerCase()}
                  >
                    {reservation.paymentStatus}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    {onView && (
                      <button
                        className="action-btn"
                        onClick={() => onView(reservation)}
                        title="View Details"
                      >
                        👁️
                      </button>
                    )}
                    {onCheckout && reservation.status !== "Cancelled" && (
                      <button
                        className="action-btn"
                        onClick={() => onCheckout(reservation, "TBD")}
                        title="Process Checkout"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReservations.length > ITEMS_PER_PAGE && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <span style={{ fontSize: "14px", color: "var(--secondary)" }}>
            Page {currentPage} of {totalPages}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn btn-secondary"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
