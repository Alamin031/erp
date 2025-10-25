"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/app/dashboard-layout";
import { ReservationForm } from "@/components/reservation-form";
import { ReservationDetails } from "@/components/reservation-details";
import { UpcomingReservations } from "@/components/upcoming-reservations";
import { ToastContainer, useToast } from "@/components/toast";
import { Reservation, ReservationFormInput, ReservationStatus } from "@/types/reservation";
import { mockReservations } from "@/lib/mock-reservations";

type TabType = "all" | "upcoming" | "cancelled";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "">("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const filteredReservations = useMemo(() => {
    let filtered = [...reservations];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case "upcoming":
        filtered = filtered.filter(
          res =>
            res.status === "Confirmed" &&
            new Date(res.checkInDate) >= today
        );
        break;
      case "cancelled":
        filtered = filtered.filter(res => res.status === "Cancelled");
        break;
      default:
        break;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        res =>
          res.guestName.toLowerCase().includes(query) ||
          res.bookingId.toLowerCase().includes(query) ||
          res.email.toLowerCase().includes(query)
      );
    }

    if (dateFrom) {
      filtered = filtered.filter(
        res => new Date(res.checkInDate) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(
        res => new Date(res.checkOutDate) <= new Date(dateTo)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(res => res.status === statusFilter);
    }

    if (roomTypeFilter) {
      filtered = filtered.filter(res => res.roomType === roomTypeFilter);
    }

    return filtered;
  }, [reservations, activeTab, searchQuery, dateFrom, dateTo, statusFilter, roomTypeFilter]);

  const handleAddReservation = (data: ReservationFormInput, id?: string) => {
    if (id) {
      // Update existing reservation
      setReservations(
        reservations.map(res =>
          res.id === id ? { ...res, ...data } : res
        )
      );
      showToast("Reservation updated successfully", "success");
    } else {
      // Add new reservation
      const newReservation: Reservation = {
        id: String(reservations.length + 1),
        bookingId: `BK-${String(reservations.length + 1).padStart(3, "0")}`,
        ...data,
        status: "Pending" as const,
        paymentStatus: "Pending" as const,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setReservations([...reservations, newReservation]);
      showToast("Reservation added successfully", "success");
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsFormOpen(true);
  };

  const handleDeleteReservation = (id: string) => {
    setReservations(reservations.filter(res => res.id !== id));
    setIsDetailsOpen(false);
    showToast("Reservation cancelled successfully", "success");
  };

  const handleCancelReservation = (id: string) => {
    setReservations(
      reservations.map(res =>
        res.id === id ? { ...res, status: "Cancelled" as const } : res
      )
    );
    setIsDetailsOpen(false);
    showToast("Reservation cancelled successfully", "success");
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsOpen(true);
  };

  const getTabCount = (tab: TabType) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (tab) {
      case "upcoming":
        return reservations.filter(
          res =>
            res.status === "Confirmed" &&
            new Date(res.checkInDate) >= today
        ).length;
      case "cancelled":
        return reservations.filter(res => res.status === "Cancelled").length;
      default:
        return reservations.length;
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <div className="page-header">
            <div>
              <h1 className="dashboard-page-title">Reservations</h1>
              <p className="dashboard-subtitle">Manage room reservations and bookings</p>
            </div>
            <button
              onClick={() => {
                setEditingReservation(null);
                setIsFormOpen(true);
              }}
              className="btn btn-primary"
            >
              + Add New Reservation
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <UpcomingReservations
              reservations={reservations}
              onViewAll={() => {
                setActiveTab("upcoming");
                setSearchQuery("");
                setDateFrom("");
                setDateTo("");
                setStatusFilter("");
                setRoomTypeFilter("");
              }}
              onViewDetails={handleViewDetails}
            />
          </div>

          <div className="dashboard-section">
            <div className="tabs">
              {(["all", "upcoming", "cancelled"] as const).map(tab => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "all" && `All Reservations`}
                  {tab === "upcoming" && `Upcoming Reservations`}
                  {tab === "cancelled" && `Cancelled Reservations`}
                  <span className="tab-count">{getTabCount(tab)}</span>
                </button>
              ))}
            </div>

            <div className="filters-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by guest name, booking ID, or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="filters-row">
                <div className="filter-group">
                  <label className="form-label">Date From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="filter-group">
                  <label className="form-label">Date To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="filter-group">
                  <label className="form-label">Status</label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as ReservationStatus | "")}
                    className="form-input"
                  >
                    <option value="">All Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="form-label">Room Type</label>
                  <select
                    value={roomTypeFilter}
                    onChange={e => setRoomTypeFilter(e.target.value)}
                    className="form-input"
                  >
                    <option value="">All Types</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>

                {(searchQuery || dateFrom || dateTo || statusFilter || roomTypeFilter) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setDateFrom("");
                      setDateTo("");
                      setStatusFilter("");
                      setRoomTypeFilter("");
                    }}
                    className="btn btn-secondary"
                    style={{ height: "fit-content" }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="table-container">
              {filteredReservations.length > 0 ? (
                <table className="reservations-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Guest Name</th>
                      <th>Room Type</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map(reservation => (
                      <tr key={reservation.id}>
                        <td className="booking-id">{reservation.bookingId}</td>
                        <td>{reservation.guestName}</td>
                        <td>{reservation.roomType}</td>
                        <td>{new Date(reservation.checkInDate).toLocaleDateString()}</td>
                        <td>{new Date(reservation.checkOutDate).toLocaleDateString()}</td>
                        <td>
                          <span
                            className="status-badge"
                            data-status={reservation.status.toLowerCase()}
                          >
                            {reservation.status}
                          </span>
                        </td>
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
                            <button
                              onClick={() => handleViewDetails(reservation)}
                              className="action-btn"
                              title="View"
                            >
                              👁️
                            </button>
                            {reservation.status !== "Cancelled" && (
                              <>
                                <button
                                  onClick={() => handleEditReservation(reservation)}
                                  className="action-btn"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteReservation(reservation.id)}
                              className="action-btn action-btn-danger"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>No reservations found matching your filters.</p>
                  {searchQuery && <p>Try adjusting your search criteria.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReservationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingReservation(null);
        }}
        onSubmit={handleAddReservation}
        reservation={editingReservation}
      />

      <ReservationDetails
        reservation={selectedReservation}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedReservation(null);
        }}
        onCancel={handleCancelReservation}
      />
    </DashboardLayout>
  );
}
