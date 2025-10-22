export type ServiceType = "Room Service" | "Housekeeping Request" | "Maintenance" | "Wake-up Call" | "Laundry" | "Other";
export type Priority = "Low" | "Normal" | "High" | "Urgent";
export type RequestStatus = "Open" | "In Progress" | "Resolved" | "Cancelled";

export interface ServiceRequest {
  id: string;
  guestName: string;
  roomNumber: string;
  serviceType: ServiceType;
  priority: Priority;
  status: RequestStatus;
  requestedAt: string;
  eta?: string;
  completedAt?: string;
  assignedStaffIds: string[];
  notes: string;
  attachmentUrl?: string;
  activityLog: ActivityEntry[];
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  isAvailable: boolean;
  currentAssignments: number;
}

export interface GuestServicesFilters {
  status: RequestStatus | "All";
  priority: Priority | "All";
  serviceType: ServiceType | "All";
  assignedStaff: string | "All";
  dateFrom: string;
  dateTo: string;
}

export interface RequestStats {
  openRequests: number;
  inProgress: number;
  resolvedToday: number;
  avgResponseTime: number;
}
