"use client";

import { Room } from "@/types/room";
import { motion } from "framer-motion";
import { useToast } from "./toast";
import { useRoomStatus } from "@/store/useRoomStatus";

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room | null;
  onRefresh?: () => void;
}

export function RoomDetailsModal({
  isOpen,
  onClose,
  room,
  onRefresh,
}: RoomDetailsModalProps) {
  const { showToast } = useToast();
  const { markClean, setMaintenance, checkOut } = useRoomStatus();

  if (!isOpen || !room) return null;

  const handleMarkClean = () => {
    markClean(room.id);
    showToast("Room marked as clean", "success");
    onRefresh?.();
    onClose();
  };

  const handleSendMaintenance = () => {
    setMaintenance(room.id, "General maintenance", "Maintenance Staff");
    showToast("Room sent to maintenance", "success");
    onRefresh?.();
    onClose();
  };

  const handleCheckOut = () => {
    checkOut(room.id);
    showToast("Guest checked out successfully", "success");
    onRefresh?.();
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Clean":
        return "var(--success)";
      case "Occupied":
        return "var(--primary)";
      case "Needs Cleaning":
        return "var(--warning)";
      case "Under Maintenance":
        return "var(--danger)";
      default:
        return "var(--secondary)";
    }
  };

  const maintenanceStatusColor =
    room.maintenanceStatus?.status === "Completed"
      ? "var(--success)"
      : room.maintenanceStatus?.status === "In Progress"
      ? "var(--primary)"
      : "var(--warning)";

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-header">
          <h2>Room {room.roomNumber} Details</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="details-section">
              <p className="details-title">Room Number</p>
              <p style={{ fontSize: "18px", fontWeight: "700", color: "var(--primary)" }}>
                {room.roomNumber}
              </p>
            </div>

            <div className="details-section">
              <p className="details-title">Floor</p>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
                Floor {room.floor}
              </p>
            </div>

            <div className="details-section">
              <p className="details-title">Room Type</p>
              <p style={{ fontSize: "14px", color: "var(--foreground)" }}>
                {room.type}
              </p>
            </div>

            <div className="details-section">
              <p className="details-title">Current Status</p>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  backgroundColor: `${getStatusColor(room.status)}20`,
                  color: getStatusColor(room.status),
                }}
              >
                {room.status}
              </span>
            </div>
          </div>

          <div className="details-section" style={{ marginTop: "24px" }}>
            <p className="details-title">Cleanliness Information</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "var(--background)", borderRadius: "4px" }}>
                <span style={{ color: "var(--secondary)", fontSize: "13px" }}>Last Cleaned</span>
                <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                  {room.lastCleaned
                    ? new Date(room.lastCleaned).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "var(--background)", borderRadius: "4px" }}>
                <span style={{ color: "var(--secondary)", fontSize: "13px" }}>Cleaned By</span>
                <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                  {room.lastCleanedBy || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {room.currentGuest && (
            <div className="details-section" style={{ marginTop: "24px" }}>
              <p className="details-title">Current Guest</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "var(--background)", borderRadius: "4px" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "13px" }}>Name</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {room.currentGuest.name}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "var(--background)", borderRadius: "4px" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "13px" }}>Check-in</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {new Date(room.currentGuest.checkInDate).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "var(--background)", borderRadius: "4px" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "13px" }}>Check-out</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {new Date(room.currentGuest.checkOutDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {room.maintenanceStatus && (
            <div className="details-section" style={{ marginTop: "24px" }}>
              <p className="details-title">Maintenance Status</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "var(--background)", borderRadius: "4px" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "13px" }}>Issue</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {room.maintenanceStatus.issue}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "var(--background)", borderRadius: "4px" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "13px" }}>Assigned Staff</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {room.maintenanceStatus.assignedTo || "Unassigned"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "var(--background)", borderRadius: "4px" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "13px" }}>Status</span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: maintenanceStatusColor,
                      textTransform: "capitalize",
                    }}
                  >
                    {room.maintenanceStatus.status}
                  </span>
                </div>
                {room.maintenanceStatus.eta && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "var(--background)", borderRadius: "4px" }}>
                    <span style={{ color: "var(--secondary)", fontSize: "13px" }}>ETA</span>
                    <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                      {new Date(room.maintenanceStatus.eta).toLocaleTimeString(
                        "en-GB",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="modal-actions" style={{ marginTop: "32px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>

            <div style={{ display: "flex", gap: "8px" }}>
              {room.status !== "Clean" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleMarkClean}
                >
                  Mark as Clean
                </button>
              )}

              {room.status !== "Under Maintenance" && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSendMaintenance}
                >
                  Send to Maintenance
                </button>
              )}

              {room.status === "Occupied" && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCheckOut}
                >
                  Check-out Guest
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
