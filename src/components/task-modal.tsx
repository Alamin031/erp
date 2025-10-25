"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Task, HousekeepingStaff } from "@/types/task";
import { useToast } from "./toast";

const taskSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  taskType: z.enum(["Cleaning", "Maintenance", "Inspection"], {
    message: "Please select a task type",
  }),
  assignedStaffId: z.string().min(1, "Please assign staff"),
  priority: z.enum(["Low", "Medium", "High"], {
    message: "Please select priority",
  }),
  description: z.string().min(5, "Description must be at least 5 characters"),
  dueDate: z.string().min(1, "Due date is required"),
  dueTime: z.string().min(1, "Due time is required"),
});

type TaskFormInput = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: HousekeepingStaff[];
  task?: Task | null;
  prefilledRoom?: string;
  onSubmit?: (data: TaskFormInput) => void;
}

export function TaskModal({
  isOpen,
  onClose,
  staff,
  task,
  prefilledRoom,
  onSubmit,
}: TaskModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      roomNumber: prefilledRoom || task?.roomNumber || "",
      taskType: task?.taskType || "Cleaning",
      assignedStaffId: task?.assignedStaffId || "",
      priority: task?.priority || "Medium",
      description: task?.description || "",
      dueDate: task?.dueDate || "",
      dueTime: task?.dueTime || "",
    },
  });

  const onSubmitForm = async (data: TaskFormInput) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      if (onSubmit) {
        onSubmit(data);
      }

      showToast(
        task ? "Task Updated Successfully" : "Task Created Successfully",
        "success"
      );
      reset();
      onClose();
    } catch (error) {
      showToast("Failed to save task", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
          style={{ maxWidth: "700px" }}
        >
          <div className="modal-header">
            <h2>{task ? "Edit Task" : "Create New Task"}</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Room Number *</label>
              <input
                type="text"
                {...register("roomNumber")}
                className="form-input"
                placeholder="e.g., 101"
                disabled={isSubmitting}
              />
              {errors.roomNumber && (
                <span className="form-error">{errors.roomNumber.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Task Type *</label>
              <select
                {...register("taskType")}
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inspection">Inspection</option>
              </select>
              {errors.taskType && (
                <span className="form-error">{errors.taskType.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Assigned Staff *</label>
              <select
                {...register("assignedStaffId")}
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="">Select staff member</option>
                {staff.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {errors.assignedStaffId && (
                <span className="form-error">
                  {errors.assignedStaffId.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Priority *</label>
              <select
                {...register("priority")}
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && (
                <span className="form-error">{errors.priority.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              {...register("description")}
              className="form-input form-textarea"
              placeholder="Describe the task..."
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description && (
              <span className="form-error">{errors.description.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input
                type="date"
                {...register("dueDate")}
                className="form-input"
                disabled={isSubmitting}
              />
              {errors.dueDate && (
                <span className="form-error">{errors.dueDate.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Due Time *</label>
              <input
                type="time"
                {...register("dueTime")}
                className="form-input"
                disabled={isSubmitting}
              />
              {errors.dueTime && (
                <span className="form-error">{errors.dueTime.message}</span>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
              style={{ minWidth: "100px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ minWidth: "120px" }}
            >
              {isSubmitting ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
        </motion.div>
      </div>
    </>
  );
}
