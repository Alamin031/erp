export type WorkOrderStatus = "Open" | "In Progress" | "Paused" | "Completed";
export type WorkOrderPriority = "Low" | "Medium" | "High" | "Critical";

export interface Asset {
  id: string;
  type: "Room" | "HVAC" | "Electrical" | "Plumbing" | "Elevator" | "Other";
  name: string;
  roomNumber?: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
}

export interface WorkOrderComment {
  id: string;
  timestamp: string;
  author: string;
  message: string;
}

export interface WorkOrderLogEntry {
  id: string;
  timestamp: string;
  message: string;
  actor: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  assetId?: string;
  assetName?: string;
  assetType?: Asset["type"];
  requestedBy: string; // staff or guest name/id
  priority: WorkOrderPriority;
  createdAt: string;
  dueAt?: string; // SLA deadline
  assignedTechId?: string;
  assignedTechName?: string;
  status: WorkOrderStatus;
  attachments?: string[]; // image URLs
  comments: WorkOrderComment[];
  logs: WorkOrderLogEntry[];
  startedAt?: string;
  completedAt?: string;
}
