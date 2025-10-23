export type StageName =
  | "Prospecting"
  | "Qualification"
  | "Proposal"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export interface Opportunity {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
  contactId?: string;
  contactName?: string;
  stage: StageName;
  source?: string;
  ownerId?: string;
  ownerName?: string;
  expectedCloseDate?: string;
  value: number;
  currency?: string;
  probability?: number;
  status?: "In Progress" | "Won" | "Lost";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityFilters {
  stage?: StageName | "All";
  ownerId?: string | "All";
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}
