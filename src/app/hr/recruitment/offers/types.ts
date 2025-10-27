export type OfferStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired' | 'withdrawn';

export interface OfferTimelineItem {
  id: string;
  status: string;
  text: string;
  at: string; // ISO
}

export interface OfferAttachment {
  id: string;
  name: string;
  url?: string; // data URL for demo or link
  mime?: string;
}

export interface Offer {
  id: string;
  applicantId: string;
  jobId?: string;
  templateId?: string;
  baseSalary?: number;
  bonuses?: string;
  benefits?: string;
  joiningDate?: string; // ISO
  expiryDate?: string; // ISO
  notes?: string;
  attachments?: OfferAttachment[];
  status: OfferStatus;
  sentAt?: string;
  createdAt?: string;
  updatedAt?: string;
  timeline?: OfferTimelineItem[];
}

export interface OfferFilters {
  status?: OfferStatus | 'all';
  query?: string;
  applicantId?: string | null;
}
