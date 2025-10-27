export type ApplicantStage = 'applied' | 'shortlisted' | 'interview' | 'hired' | 'rejected';

export interface Applicant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  jobId?: string;
  source?: string;
  resumeUrl?: string;
  appliedDate?: string; // ISO
  recruiterId?: string | null;
  stage?: ApplicantStage;
  status?: 'active' | 'archived';
  notes?: string[];
  attachments?: { name: string; url: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicantFilters {
  jobId?: string | null;
  recruiterId?: string | null;
  stage?: ApplicantStage | 'all';
  source?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  query?: string | null;
}

export interface ApplicantStats {
  total: number;
  shortlisted: number;
  interviewScheduled: number;
  hired: number;
  rejected: number;
  conversionRate: number; // percent
}
