export type CampaignStatus = "Active" | "Completed" | "Draft";
export type CampaignChannel = "Facebook" | "Google" | "Email" | "Others";
export type CampaignGoal = "Brand Awareness" | "Conversions" | "Engagement";

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  startDate: string;
  endDate: string;
  budget: number;
  spend: number;
  goal: CampaignGoal;
  status: CampaignStatus;
  ctr: number;
  roi: number;
  impressions: number;
  clicks: number;
  conversions: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFilters {
  status: CampaignStatus | "";
  channel: CampaignChannel | "";
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
  roiFrom: number;
  roiTo: number;
}

export interface CampaignFormData {
  name: string;
  channel: CampaignChannel;
  startDate: string;
  endDate: string;
  budget: number;
  goal: CampaignGoal;
  description: string;
  status: CampaignStatus;
}
