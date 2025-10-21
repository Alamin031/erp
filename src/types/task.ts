export type TaskType = "Cleaning" | "Maintenance" | "Inspection";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";
export type StaffStatus = "Active" | "Off Duty" | "On Break";

export interface Task {
  id: string;
  roomNumber: string;
  taskType: TaskType;
  assignedStaffId: string;
  priority: TaskPriority;
  description: string;
  dueDate: string;
  dueTime: string;
  status: TaskStatus;
  photoUrl?: string;
  createdAt: string;
  completedAt?: string;
  assignedAt?: string;
}

export interface HousekeepingStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: StaffStatus;
  tasksAssigned: number;
  tasksCompleted: number;
  averageTimePerTask: number;
}

export interface ActivityLog {
  id: string;
  taskId: string;
  action: "created" | "assigned" | "updated" | "completed" | "reopened";
  staffId: string;
  staffName: string;
  roomNumber: string;
  timestamp: string;
  details?: string;
}

export interface RoomStatus {
  roomNumber: string;
  status: "Clean" | "In Progress" | "Dirty";
  lastCleaned?: string;
}
