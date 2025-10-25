"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Room } from "@/types/room";
import { motion } from "framer-motion";
import { useToast } from "./toast";

const maintenanceSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  issue: z.string().min(5, "Issue description must be at least 5 characters"),
  assignedTo: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  eta: z.string().optional(),
  notes: z.string().optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface MaintenanceTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onSubmit?: (data: MaintenanceFormData) => void;
  prefilledRoom?: string;
}

export function MaintenanceTaskModal({
  isOpen,
  onClose,
  rooms,
  onSubmit,
  prefilledRoom,
}: MaintenanceTaskModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      roomNumber: prefilledRoom || "",
      priority: "Medium",
    },
  });

  const selectedRoomNumber = watch("roomNumber");
  const selectedRoom = rooms.find(r => r.roomNumber === selectedRoomNumber);

  const onSubmitForm = async (data: MaintenanceFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (onSubmit) {
        onSubmit(data);
      }

      showToast("Maintenance task created successfully", "success");
      reset();
      onClose();
    } catch (error) {
      showToast("Failed to create maintenance task", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "var(--danger)";
      case "High":
        return "#ff6b6b";
      case "Medium":
        return "var(--warning)";
      case "Low":
        return "var(--success)";
      default:
        return "var(--secondary)";
    }
  };

  if (!isOpen) return null;

  const availableRooms = rooms.filter(r => r.status !== "Under Maintenance");

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <motion.div
          className="modal-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: "650px" }}
        >
          <div className="modal-header">
            <h2>Add Maintenance Task</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
            <div className="form-group">
              <label className="form-label">Room Number *</label>
              <select
                {...register("roomNumber")}
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="">Select a room</option>
                {availableRooms.map(room => (
                  <option key={room.id} value={room.roomNumber}>
                    Room {room.roomNumber} - {room.type} ({room.status})
                  </option>
                ))}
              </select>
              {errors.roomNumber && (
                <span className="form-error">{errors.roomNumber.message}</span>
              )}
            </div>

            {selectedRoom && (
              <div
                style={{
                  padding: "12px",
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  fontSize: "13px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "var(--secondary)" }}>Floor:</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {selectedRoom.floor}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "var(--secondary)" }}>Room Type:</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {selectedRoom.type}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--secondary)" }}>Current Status:</span>
                  <span style={{ fontWeight: "600", color: "var(--primary)" }}>
                    {selectedRoom.status}
                  </span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Issue Description *</label>
              <textarea
                {...register("issue")}
                className="form-input form-textarea"
                placeholder="Describe the maintenance issue..."
                rows={3}
                disabled={isSubmitting}
              />
              {errors.issue && (
                <span className="form-error">{errors.issue.message}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority *</label>
                <select
                  {...register("priority")}
                  className="form-input"
                  disabled={isSubmitting}
                  style={{
                    borderLeft: `4px solid ${getPriorityColor(watch("priority"))}`,
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                {errors.priority && (
                  <span className="form-error">{errors.priority.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Completion Time</label>
                <input
                  type="datetime-local"
                  {...register("eta")}
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned To</label>
              <select
                {...register("assignedTo")}
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="">Unassigned</option>
                <option value="John Maintenance">John Maintenance</option>
                <option value="Sarah Tech">Sarah Tech</option>
                <option value="Mike Repair">Mike Repair</option>
                <option value="Lisa Electrician">Lisa Electrician</option>
                <option value="Tom Plumber">Tom Plumber</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea
                {...register("notes")}
                className="form-input form-textarea"
                placeholder="Any additional information..."
                rows={2}
                disabled={isSubmitting}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
