export type ActivityType = "Call" | "Meeting" | "Email" | "Task";

export type ActivityStatus = "Pending" | "Completed" | "Overdue";

export interface Activity {
  id: string;
  type: ActivityType;
  contactId?: string;
  contactName?: string;
  companyId?: string;
  companyName?: string;
  ownerId?: string;
  ownerName?: string;
  dateTime: string; // ISO
  followUp?: string; // ISO
  notes?: string;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityFilters {
  type?: ActivityType | "All";
  ownerId?: string | "All";
  contactId?: string | "All";
  companyId?: string | "All";
  dateFrom?: string;
  dateTo?: string;
}

export interface ActivityLogEntry {
  id: string;
  text: string;
  timestamp: string;
}
