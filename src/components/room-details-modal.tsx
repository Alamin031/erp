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
      <div className="modal">
        <motion.div
          className="modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ maxWidth: "800px" }}
        >
          <div className="modal-header">
            <h2>Room {room.roomNumber} Details</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="modal-form">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="details-section">
                <p className="details-title">Room Number</p>
                <p style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary)", margin: "8px 0 0 0" }}>
                  {room.roomNumber}
                </p>
              </div>

              <div className="details-section">
                <p className="details-title">Floor</p>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "var(--foreground)", margin: "8px 0 0 0" }}>
                  Floor {room.floor}
                </p>
              </div>

              <div className="details-section">
                <p className="details-title">Room Type</p>
                <p style={{ fontSize: "16px", color: "var(--foreground)", fontWeight: "500", margin: "8px 0 0 0" }}>
                  {room.type}
                </p>
              </div>

              <div className="details-section">
                <p className="details-title">Current Status</p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "700",
                    backgroundColor: `${getStatusColor(room.status)}20`,
                    color: getStatusColor(room.status),
                    border: `1px solid ${getStatusColor(room.status)}40`,
                  }}
                >
                  {room.status}
                </span>
              </div>
            </div>

            <div className="details-section" style={{ marginTop: "28px" }}>
              <p className="details-title">Cleanliness Information</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "14px", fontWeight: "500" }}>Last Cleaned</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)", fontSize: "14px" }}>
                    {room.lastCleaned
                      ? new Date(room.lastCleaned).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "14px", fontWeight: "500" }}>Cleaned By</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)", fontSize: "14px" }}>
                    {room.lastCleanedBy || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

          {room.currentGuest && (
            <div className="details-section" style={{ marginTop: "28px" }}>
              <p className="details-title">Current Guest</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "14px", fontWeight: "500" }}>Name</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)", fontSize: "14px" }}>
                    {room.currentGuest.name}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "14px", fontWeight: "500" }}>Check-in</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)", fontSize: "14px" }}>
                    {new Date(room.currentGuest.checkInDate).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "14px", fontWeight: "500" }}>Check-out</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)", fontSize: "14px" }}>
                    {new Date(room.currentGuest.checkOutDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {room.maintenanceStatus && (
            <div className="details-section" style={{ marginTop: "28px" }}>
              <p className="details-title">Maintenance Status</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "14px", fontWeight: "500" }}>Issue</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)", fontSize: "14px" }}>
                    {room.maintenanceStatus.issue}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "14px", fontWeight: "500" }}>Assigned Staff</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)", fontSize: "14px" }}>
                    {room.maintenanceStatus.assignedTo || "Unassigned"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--secondary)", fontSize: "14px", fontWeight: "500" }}>Status</span>
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: maintenanceStatusColor,
                      textTransform: "capitalize",
                    }}
                  >
                    {room.maintenanceStatus.status}
                  </span>
                </div>
                {room.maintenanceStatus.eta && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--secondary)", fontSize: "14px", fontWeight: "500" }}>ETA</span>
                    <span style={{ fontWeight: "600", color: "var(--foreground)", fontSize: "14px" }}>
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
              style={{ minWidth: "100px" }}
            >
              Close
            </button>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {room.status !== "Clean" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleMarkClean}
                  style={{ minWidth: "120px" }}
                >
                  Mark as Clean
                </button>
              )}

              {room.status !== "Under Maintenance" && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSendMaintenance}
                  style={{ minWidth: "150px" }}
                >
                  Send to Maintenance
                </button>
              )}

              {room.status === "Occupied" && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCheckOut}
                  style={{ minWidth: "120px" }}
                >
                  Check-out Guest
                </button>
              )}
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
