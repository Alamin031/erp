export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue' | 'archived';

export interface OnboardingTask {
  id: string;
  title: string;
  dueDate?: string; // ISO
  done?: boolean;
}

export interface OnboardingTimelineItem {
  id: string;
  text: string;
  at: string; // ISO
}

export interface Onboarding {
  id: string;
  employeeName: string;
  employeeId?: string | null; // if linked to applicant
  department?: string;
  startDate?: string; // ISO
  mentorId?: string | null;
  tasks: OnboardingTask[];
  notes?: string;
  attachments?: { id: string; name: string; url?: string; mime?: string }[];
  status: OnboardingStatus;
  createdAt?: string;
  updatedAt?: string;
  timeline?: OnboardingTimelineItem[];
}

export interface Mentor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface OnboardingFilters {
  status?: OnboardingStatus | 'all';
  query?: string;
  department?: string | null;
}
