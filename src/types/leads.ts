export type LeadStage = "New" | "Contacted" | "Qualified" | "Proposal" | "Closed Won" | "Closed Lost";
export type LeadStatus = "Active" | "Converted" | "Lost";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  leadSource: string;
  assignedTo: string;
  assignedToName: string;
  stage: LeadStage;
  potentialValue: number;
  status: LeadStatus;
  nextFollowUp?: string;
  notes?: string;
  interactionHistory: Interaction[];
  createdAt: string;
  updatedAt: string;
  convertedAt?: string;
  lostAt?: string;
  lostReason?: string;
}

export interface Interaction {
  id: string;
  type: "call" | "email" | "meeting" | "note";
  date: string;
  notes: string;
  duration?: number;
  attendees?: string[];
}

export interface SalesAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  leadsCount: number;
  conversionRate: number;
  totalValue: number;
  status: "active" | "inactive";
}

export interface LeadSource {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  leadCount?: number;
}

export interface LeadFilters {
  stage?: LeadStage | "All";
  assignedTo?: string | "All";
  leadSource?: string | "All";
  status?: LeadStatus | "All";
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface LeadActivityEntry {
  id: string;
  leadId: string;
  leadName: string;
  timestamp: string;
  type: "created" | "updated" | "stage_changed" | "converted" | "lost" | "assigned" | "follow_up_scheduled";
  details: string;
  user: string;
  oldValue?: string;
  newValue?: string;
}
