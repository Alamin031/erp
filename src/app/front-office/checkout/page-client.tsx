"use client";

import { useState, useMemo } from "react";
import { Reservation } from "@/types/reservation";
import { mockReservations } from "@/lib/mock-reservations";
import { CheckoutTable } from "@/components/checkout-table";
import { CheckoutModal } from "@/components/checkout-modal";
import { TodayDepartures } from "@/components/today-departures";
import { PaymentSummary } from "@/components/payment-summary";
import { CheckoutKPICards } from "@/components/checkout-kpi-cards";
import { ToastContainer, useToast } from "@/components/toast";

type CheckoutStatus = "today-departures" | "pending-payments" | "completed";

interface CheckedOutGuest {
  reservation: Reservation;
  roomNumber: string;
  checkOutTime: string;
  paymentMethod: string;
  additionalCharges: number;
  chargeDescription?: string;
  roomCondition: string;
  notes?: string;
  isPaid: boolean;
}

export function CheckoutPageClient() {
  const [activeTab, setActiveTab] = useState<CheckoutStatus>("today-departures");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [checkedOutGuests, setCheckedOutGuests] = useState<CheckedOutGuest[]>([]);
  const { toasts, showToast, removeToast } = useToast();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDepartures = useMemo(() => {
    return mockReservations.filter(
      res =>
        res.status === "Confirmed" &&
        new Date(res.checkOutDate).getTime() === today.getTime()
    );
  }, []);

  const pendingPayments = useMemo(() => {
    return checkedOutGuests.filter(cg => !cg.isPaid);
  }, [checkedOutGuests]);

  const completedCheckouts = useMemo(() => {
    return checkedOutGuests;
  }, [checkedOutGuests]);

  const reservationsForTable = useMemo(() => {
    if (activeTab === "today-departures") {
      return todayDepartures;
    } else if (activeTab === "pending-payments") {
      return pendingPayments.map(cg => cg.reservation);
    } else {
      return completedCheckouts.map(cg => cg.reservation);
    }
  }, [activeTab, todayDepartures, pendingPayments, completedCheckouts]);

  const handleCheckoutClick = (reservation: Reservation, roomNumber: string) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  const handleCheckoutConfirm = (data: any) => {
    if (selectedReservation) {
      setCheckedOutGuests(prev => [
        ...prev,
        {
          reservation: selectedReservation,
          roomNumber: data.roomNumber,
          checkOutTime: new Date().toISOString(),
          paymentMethod: data.paymentMethod,
          additionalCharges: data.additionalCharges || 0,
          chargeDescription: data.chargeDescription,
          roomCondition: data.roomCondition,
          notes: data.notes,
          isPaid: data.paymentMethod === "Cash" || data.paymentMethod === "Card",
        },
      ]);
      showToast("Guest Checked-out Successfully", "success");
    }
  };

  const tabCounts = {
    "today-departures": todayDepartures.length,
    "pending-payments": pendingPayments.length,
    "completed": completedCheckouts.length,
  };

  const checkedOutGuestsForSummary = completedCheckouts.map(cg => ({
    id: cg.reservation.id,
    guestName: cg.reservation.guestName,
    roomType: cg.reservation.roomType,
    checkInDate: cg.reservation.checkInDate,
    checkOutDate: cg.reservation.checkOutDate,
    paymentMethod: cg.paymentMethod,
    baseCharge: 100,
    additionalCharges: cg.additionalCharges,
    totalRevenue: 100 + cg.additionalCharges,
    isPaid: cg.isPaid,
  }));

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Check-out Management</h1>
          <p className="dashboard-subtitle">Process and manage guest check-outs</p>
        </div>

        <CheckoutKPICards
          totalDeparturestoday={todayDepartures.length}
          completedCheckouts={completedCheckouts.length}
          pendingCheckouts={todayDepartures.length - completedCheckouts.length}
        />

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "today-departures" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("today-departures")}
              >
                Today's Departures
                <span className="tab-count">{tabCounts["today-departures"]}</span>
              </button>
              <button
                className={`tab ${activeTab === "pending-payments" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("pending-payments")}
              >
                Pending Payments
                <span className="tab-count">{tabCounts["pending-payments"]}</span>
              </button>
              <button
                className={`tab ${activeTab === "completed" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("completed")}
              >
                Completed Check-outs
                <span className="tab-count">{tabCounts["completed"]}</span>
              </button>
            </div>

            {activeTab === "today-departures" && (
              <div>
                <h2 className="section-title" style={{ marginTop: "24px", marginBottom: "16px" }}>
                  Today's Departures - Quick Overview
                </h2>
                <TodayDepartures
                  reservations={todayDepartures}
                  checkedOutGuests={completedCheckouts.map(cg => cg.reservation.id)}
                  onCheckout={handleCheckoutClick}
                />

                <h2 className="section-title" style={{ marginTop: "32px", marginBottom: "16px" }}>
                  Checkout Details
                </h2>
                <CheckoutTable
                  reservations={todayDepartures}
                  onCheckout={handleCheckoutClick}
                />
              </div>
            )}

            {activeTab === "pending-payments" && (
              <div style={{ marginTop: "24px" }}>
                <h2 className="section-title" style={{ marginBottom: "16px" }}>
                  Pending Payments
                </h2>
                {pendingPayments.length > 0 ? (
                  <CheckoutTable
                    reservations={pendingPayments.map(cg => cg.reservation)}
                    onCheckout={handleCheckoutClick}
                  />
                ) : (
                  <div className="empty-state">
                    <p>No pending payments</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "completed" && (
              <div style={{ marginTop: "24px" }}>
                <h2 className="section-title" style={{ marginBottom: "24px" }}>
                  Payment & Financial Summary
                </h2>
                <PaymentSummary {...({ checkedOutGuests: checkedOutGuestsForSummary } as any)} />

                <h2 className="section-title" style={{ marginTop: "32px", marginBottom: "16px" }}>
                  Completed Check-outs
                </h2>
                {completedCheckouts.length > 0 ? (
                  <div className="table-container">
                    <table className="reservations-table">
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Guest Name</th>
                          <th>Room Number</th>
                          <th>Room Condition</th>
                          <th>Payment Method</th>
                          <th>Additional Charges</th>
                          <th>Check-out Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedCheckouts.map(guest => (
                          <tr key={guest.reservation.id}>
                            <td>
                              <span className="booking-id">
                                {guest.reservation.bookingId}
                              </span>
                            </td>
                            <td>{guest.reservation.guestName}</td>
                            <td>
                              <span className="days-badge">
                                Room {guest.roomNumber}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  backgroundColor:
                                    guest.roomCondition === "Good"
                                      ? "rgba(40, 167, 69, 0.1)"
                                      : guest.roomCondition === "Damaged"
                                      ? "rgba(220, 53, 69, 0.1)"
                                      : "rgba(255, 193, 7, 0.1)",
                                  color:
                                    guest.roomCondition === "Good"
                                      ? "#28a745"
                                      : guest.roomCondition === "Damaged"
                                      ? "#dc3545"
                                      : "#ffc107",
                                }}
                              >
                                {guest.roomCondition}
                              </span>
                            </td>
                            <td>{guest.paymentMethod}</td>
                            <td>
                              {guest.additionalCharges > 0 ? (
                                <span style={{ color: "var(--danger)", fontWeight: "600" }}>
                                  ${guest.additionalCharges.toFixed(2)}
                                </span>
                              ) : (
                                <span style={{ color: "var(--secondary)" }}>—</span>
                              )}
                            </td>
                            <td>
                              {new Date(guest.checkOutTime).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No completed check-outs yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        reservation={selectedReservation}
        roomNumber="TBD"
        onConfirm={handleCheckoutConfirm}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
