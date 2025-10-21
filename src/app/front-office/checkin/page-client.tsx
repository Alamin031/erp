"use client";

import { useState, useMemo } from "react";
import { Reservation } from "@/types/reservation";
import { mockReservations } from "@/lib/mock-reservations";
import { CheckinTable } from "@/components/checkin-table";
import { CheckinModal } from "@/components/checkin-modal";
import { TodayArrivals } from "@/components/today-arrivals";
import { ToastContainer, useToast } from "@/components/toast";

type CheckinStatus = "today-arrivals" | "checked-in" | "pending";

interface CheckedInGuest {
  reservation: Reservation;
  checkedInAt: string;
  roomNumber: string;
}

export function CheckinPageClient() {
  const [activeTab, setActiveTab] = useState<CheckinStatus>("today-arrivals");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [checkedInGuests, setCheckedInGuests] = useState<CheckedInGuest[]>([]);
  const { toasts, showToast, removeToast } = useToast();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayArrivals = useMemo(() => {
    return mockReservations.filter(
      res =>
        res.status === "Confirmed" &&
        new Date(res.checkInDate).getTime() === today.getTime()
    );
  }, []);

  const pendingCheckIns = useMemo(() => {
    return mockReservations.filter(
      res =>
        res.status === "Confirmed" &&
        new Date(res.checkInDate) <= today &&
        !checkedInGuests.some(cg => cg.reservation.id === res.id)
    );
  }, [checkedInGuests]);

  const reservationsForTable = useMemo(() => {
    if (activeTab === "today-arrivals") {
      return todayArrivals;
    } else if (activeTab === "pending") {
      return pendingCheckIns;
    } else {
      return checkedInGuests.map(cg => cg.reservation);
    }
  }, [activeTab, todayArrivals, pendingCheckIns, checkedInGuests]);

  const handleCheckInClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  const handleCheckInConfirm = (data: any) => {
    if (selectedReservation) {
      setCheckedInGuests(prev => [
        ...prev,
        {
          reservation: selectedReservation,
          checkedInAt: new Date().toISOString(),
          roomNumber: data.roomNumber,
        },
      ]);
    }
  };

  const tabCounts = {
    "today-arrivals": todayArrivals.length,
    "pending": pendingCheckIns.length,
    "checked-in": checkedInGuests.length,
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Check-in Management</h1>
          <p className="dashboard-subtitle">Process and manage guest check-ins</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "today-arrivals" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("today-arrivals")}
              >
                Today's Arrivals
                <span className="tab-count">{tabCounts["today-arrivals"]}</span>
              </button>
              <button
                className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending Check-ins
                <span className="tab-count">{tabCounts["pending"]}</span>
              </button>
              <button
                className={`tab ${activeTab === "checked-in" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("checked-in")}
              >
                Checked-in Guests
                <span className="tab-count">{tabCounts["checked-in"]}</span>
              </button>
            </div>

            {activeTab === "today-arrivals" && (
              <div>
                <h2 className="section-title" style={{ marginTop: "24px", marginBottom: "16px" }}>
                  Today's Arrivals - Quick Overview
                </h2>
                <TodayArrivals
                  reservations={todayArrivals}
                  onCheckIn={handleCheckInClick}
                />

                <h2 className="section-title" style={{ marginTop: "32px", marginBottom: "16px" }}>
                  Check-in Details
                </h2>
                <CheckinTable
                  reservations={todayArrivals}
                  onCheckIn={handleCheckInClick}
                />
              </div>
            )}

            {activeTab === "pending" && (
              <div style={{ marginTop: "24px" }}>
                <h2 className="section-title" style={{ marginBottom: "16px" }}>
                  Pending Check-ins
                </h2>
                <CheckinTable
                  reservations={pendingCheckIns}
                  onCheckIn={handleCheckInClick}
                  status="pending"
                />
              </div>
            )}

            {activeTab === "checked-in" && (
              <div style={{ marginTop: "24px" }}>
                <h2 className="section-title" style={{ marginBottom: "16px" }}>
                  Checked-in Guests
                </h2>
                {checkedInGuests.length > 0 ? (
                  <div className="table-container">
                    <table className="reservations-table">
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Guest Name</th>
                          <th>Room Type</th>
                          <th>Assigned Room</th>
                          <th>Check-in Time</th>
                          <th>Check-out Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {checkedInGuests.map(guest => (
                          <tr key={guest.reservation.id}>
                            <td>
                              <span className="booking-id">
                                {guest.reservation.bookingId}
                              </span>
                            </td>
                            <td>{guest.reservation.guestName}</td>
                            <td>{guest.reservation.roomType}</td>
                            <td>
                              <span className="days-badge">
                                Room {guest.roomNumber}
                              </span>
                            </td>
                            <td>
                              {new Date(guest.checkedInAt).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td>
                              {new Date(
                                guest.reservation.checkOutDate
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No guests checked in yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CheckinModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        reservation={selectedReservation}
        onConfirm={handleCheckInConfirm}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
