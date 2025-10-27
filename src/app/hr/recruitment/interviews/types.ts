export type InterviewType = 'phone' | 'video' | 'onsite';
export type InterviewStatus = 'scheduled' | 'completed' | 'no-show' | 'canceled' | 'rescheduled';

export interface Interviewer {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

export interface Interview {
  id: string;
  applicantId: string;
  jobId?: string;
  interviewers: string[]; // interviewer ids
  type: InterviewType;
  date: string; // ISO date
  startTime: string; // HH:MM
  durationMins: number;
  location?: string; // or video link
  round?: string;
  status?: InterviewStatus;
  notes?: string;
  timeline?: { id: string; type: string; text: string; at: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InterviewFilters {
  dateFrom?: string | null;
  dateTo?: string | null;
  jobId?: string | null;
  interviewerId?: string | null;
  type?: InterviewType | null;
  status?: InterviewStatus | 'all';
  query?: string | null;
}

export interface InterviewStats {
  today: number;
  weekCompleted: number;
  noShows: number;
  avgTimeToHireDays?: number;
}
