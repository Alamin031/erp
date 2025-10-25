"use client";

import { useState } from "react";
import { Guest } from "@/types/guest";
import { useGuests } from "@/store/useGuests";
import { ActivityLogGuests } from "./activity-log-guests";
import { EditGuestModal } from "./edit-guest-modal";

interface GuestProfileDrawerProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string, type: "success" | "error" | "info") => void;
}

export function GuestProfileDrawer({ guest, isOpen, onClose, onShowToast }: GuestProfileDrawerProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { updateGuest } = useGuests();

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    if (onShowToast) {
      onShowToast(message, type);
    } else {
      console.log(`[${type}] ${message}`);
    }
  };

  if (!isOpen || !guest) return null;

  const formatDate = (date?: string) => (date ? new Date(date).toLocaleString() : "—");

  const handleMessage = () => {
    showToast("Message composer opened for guest", "info");
  };

  const handlePrint = () => {
    showToast("Printing guest profile...", "info");
    setTimeout(() => window.print(), 300);
  };

  const handleAddNote = () => {
    showToast("Note added successfully", "success");
  };

  const handleLinkReservation = () => {
    showToast("Guest linked to reservation", "success");
  };

  const handleCheckout = () => {
    updateGuest(guest.id, { status: "Checked-out", checkOutDate: new Date().toISOString(), paymentStatus: "Paid" });
    showToast("Guest checked out successfully", "success");
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Checked-in": return { bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.3)", color: "#22c55e" };
      case "Reserved": return { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", color: "#3b82f6" };
      case "Checked-out": return { bg: "rgba(156, 163, 175, 0.1)", border: "rgba(156, 163, 175, 0.3)", color: "#9ca3af" };
      default: return { bg: "rgba(156, 163, 175, 0.1)", border: "rgba(156, 163, 175, 0.3)", color: "#9ca3af" };
    }
  };

  const statusStyle = getStatusColor(guest.status);

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over" role="dialog" aria-modal="true" aria-labelledby="guest-drawer-title">
        <div className="slide-over-header">
          <div>
            <h2 id="guest-drawer-title" className="slide-over-title">
              {guest.firstName} {guest.lastName}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <span style={{ 
                padding: "4px 12px", 
                borderRadius: "12px", 
                fontSize: "11px", 
                fontWeight: "600",
                background: statusStyle.bg,
                border: `1px solid ${statusStyle.border}`,
                color: statusStyle.color
              }}>
                {guest.status}
              </span>
              <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
                {guest.currentRoomNumber ? `Room ${guest.currentRoomNumber}` : "No room assigned"}
              </span>
            </div>
          </div>
          <button className="slide-over-close" onClick={onClose} title="Close drawer">✕</button>
        </div>

        <div className="slide-over-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Contact & Details Card */}
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Contact & Details
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "13px" }}>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Email</div>
                    <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{guest.email}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Phone</div>
                    <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{guest.phone}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Nationality</div>
                    <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{guest.nationality}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Language</div>
                    <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{guest.preferredLanguage}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Payment Status</div>
                    <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{guest.paymentStatus}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Passport</div>
                    <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{guest.passportNumber}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Check-in</div>
                    <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{formatDate(guest.checkInDate)}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Check-out</div>
                    <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{formatDate(guest.checkOutDate)}</div>
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              {guest.tags.length > 0 && (
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Tags
                  </h3>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {guest.tags.map(tag => (
                      <span 
                        key={tag} 
                        style={{ 
                          padding: "6px 12px", 
                          background: "var(--background)", 
                          borderRadius: "6px", 
                          border: "1px solid var(--border)",
                          fontSize: "12px",
                          color: "var(--foreground)",
                          fontWeight: "500"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences Card */}
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Preferences & Special Requests
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "13px" }}>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "6px" }}>Guest Preferences</div>
                    <ul style={{ margin: 0, paddingLeft: "16px", color: "var(--foreground)" }}>
                      {guest.preferences.preferredFloor !== undefined && (
                        <li style={{ marginBottom: "4px" }}>Floor: {guest.preferences.preferredFloor}</li>
                      )}
                      {guest.preferences.bedPreference && (
                        <li style={{ marginBottom: "4px" }}>Bed: {guest.preferences.bedPreference}</li>
                      )}
                      {guest.preferences.allergies && <li style={{ marginBottom: "4px", color: "#ef4444" }}>⚠️ Allergies: {guest.preferences.allergies}</li>}
                      {guest.preferences.specialRequests && <li style={{ marginBottom: "4px" }}>Requests: {guest.preferences.specialRequests}</li>}
                      {!guest.preferences.preferredFloor && !guest.preferences.bedPreference && !guest.preferences.allergies && !guest.preferences.specialRequests && (
                        <li style={{ color: "var(--secondary)" }}>No preferences recorded</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "6px" }}>Emergency Contact</div>
                    <div style={{ color: "var(--foreground)", fontWeight: "600" }}>{guest.emergencyContact.name}</div>
                    <div style={{ color: "var(--secondary)", fontSize: "12px", marginTop: "2px" }}>{guest.emergencyContact.relationship}</div>
                    <div style={{ color: "var(--foreground)", fontWeight: "500", marginTop: "4px" }}>{guest.emergencyContact.phone}</div>
                  </div>
                </div>
                {guest.notes && (
                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "4px" }}>Additional Notes</div>
                    <div style={{ color: "var(--foreground)", fontSize: "13px" }}>{guest.notes}</div>
                  </div>
                )}
              </div>

              {/* Quick Actions Card */}
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Quick Actions
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button className="btn btn-secondary" onClick={() => setIsEditOpen(true)}>✎ Edit Profile</button>
                  <button className="btn btn-secondary" onClick={handleMessage}>💬 Message Guest</button>
                  <button className="btn btn-secondary" onClick={handlePrint}>🖨️ Print Profile</button>
                  <button className="btn btn-secondary" onClick={handleAddNote}>📝 Add Note</button>
                  <button className="btn btn-secondary" onClick={handleLinkReservation}>🔗 Link to Reservation</button>
                  {guest.status === "Checked-in" && (
                    <button className="btn btn-primary" onClick={handleCheckout}>✓ Initiate Check-out</button>
                  )}
                </div>
              </div>

              {/* Activity Timeline Card */}
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Activity Timeline
                </h3>
                <ActivityLogGuests guestId={guest.id} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <EditGuestModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} guest={guest} />
    </>
  );
}
