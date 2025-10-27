export type JobStatus = 'draft' | 'open' | 'closed' | 'expired' | 'filled';

export interface Job {
  id: string;
  title: string;
  department?: string;
  employmentType?: 'Full-time'|'Part-time'|'Contract'|'Internship';
  location?: string;
  salaryRange?: string;
  postingDate?: string; // ISO
  closingDate?: string; // ISO
  description?: string;
  requiredSkills?: string[];
  recruiterId?: string | null;
  status?: JobStatus;
  applicants?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Recruiter {
  id: string;
  name: string;
  avatarUrl?: string;
  department?: string;
}

export interface JobFilters {
  departments?: string[];
  status?: JobStatus | 'all';
  employmentType?: string | null;
  query?: string;
}

export interface JobStatsSummary {
  totalJobs: number;
  activePostings: number;
  filled: number;
  expired: number;
  applicantsThisMonth: number;
}
