"use client";

import { useState } from "react";
import { Guest } from "@/types/guest";
import { useGuests } from "@/store/useGuests";
import { ActivityLogGuests } from "./activity-log-guests";
import { EditGuestModal } from "./edit-guest-modal";
import { useToast } from "./toast";

interface GuestProfileDrawerProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GuestProfileDrawer({ guest, isOpen, onClose }: GuestProfileDrawerProps) {
  const { showToast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { updateGuest } = useGuests();

  if (!isOpen || !guest) return null;

  const formatDate = (date?: string) => (date ? new Date(date).toLocaleString() : "—");

  const handleMessage = () => {
    showToast("Message composer opened (demo)", "info");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddNote = () => {
    showToast("Add note saved (demo)", "success");
  };

  const handleLinkReservation = () => {
    showToast("Linked to reservation (demo)", "success");
  };

  const handleCheckout = () => {
    updateGuest(guest.id, { status: "Checked-out", checkOutDate: new Date().toISOString(), paymentStatus: "Paid" });
    showToast("Guest checked out", "success");
    onClose();
  };

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over" role="dialog" aria-modal="true" aria-labelledby="guest-drawer-title">
        <div className="slide-over-header">
          <h2 id="guest-drawer-title" className="slide-over-title">
            {guest.firstName} {guest.lastName}
          </h2>
          <button className="slide-over-close" onClick={onClose} title="Close drawer">✕</button>
        </div>

        <div className="slide-over-body">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="dashboard-section">
                <h3 className="section-title">Contact & Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-secondary">Email</div><div className="font-medium">{guest.email}</div></div>
                  <div><div className="text-secondary">Phone</div><div className="font-medium">{guest.phone}</div></div>
                  <div><div className="text-secondary">Nationality</div><div className="font-medium">{guest.nationality}</div></div>
                  <div><div className="text-secondary">Language</div><div className="font-medium">{guest.preferredLanguage}</div></div>
                  <div><div className="text-secondary">Status</div><div className="font-medium">{guest.status}</div></div>
                  <div><div className="text-secondary">Payment</div><div className="font-medium">{guest.paymentStatus}</div></div>
                  <div><div className="text-secondary">Room</div><div className="font-medium">{guest.currentRoomNumber || "—"}</div></div>
                  <div><div className="text-secondary">Check-in</div><div className="font-medium">{formatDate(guest.checkInDate)}</div></div>
                  <div><div className="text-secondary">Check-out</div><div className="font-medium">{formatDate(guest.checkOutDate)}</div></div>
                </div>
              </div>

              <div className="dashboard-section">
                <h3 className="section-title">Preferences & Notes</h3>
                <div className="text-sm grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-secondary">Preferences</div>
                    <ul className="list-disc ml-4">
                      {guest.preferences.preferredFloor !== undefined && (
                        <li>Preferred floor: {guest.preferences.preferredFloor}</li>
                      )}
                      {guest.preferences.bedPreference && (
                        <li>Bed: {guest.preferences.bedPreference}</li>
                      )}
                      {guest.preferences.allergies && <li>Allergies: {guest.preferences.allergies}</li>}
                      {guest.preferences.specialRequests && <li>Requests: {guest.preferences.specialRequests}</li>}
                    </ul>
                  </div>
                  <div>
                    <div className="text-secondary">Emergency Contact</div>
                    <div className="font-medium">{guest.emergencyContact.name}</div>
                    <div className="text-secondary">{guest.emergencyContact.relationship}</div>
                    <div className="font-medium">{guest.emergencyContact.phone}</div>
                  </div>
                </div>
                {guest.notes && (
                  <div className="mt-3 text-sm">
                    <div className="text-secondary">Notes</div>
                    <div>{guest.notes}</div>
                  </div>
                )}
              </div>

              <div className="dashboard-section">
                <h3 className="section-title">Activity Timeline</h3>
                <ActivityLogGuests guestId={guest.id} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="dashboard-section">
                <h3 className="section-title">Quick Actions</h3>
                <div className="flex flex-col gap-2">
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

              <div className="dashboard-section">
                <h3 className="section-title">Tags</h3>
                <div className="flex gap-2 flex-wrap text-xs">
                  {guest.tags.length > 0 ? (
                    guest.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-background rounded border border-border">{tag}</span>
                    ))
                  ) : (
                    <span className="text-secondary">No tags</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <EditGuestModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} guest={guest} />
    </>
  );
}
