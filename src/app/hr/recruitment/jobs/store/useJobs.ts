import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Job, Recruiter, JobFilters, JobStatsSummary } from '../types';

interface JobsState {
  jobs: Job[];
  recruiters: Recruiter[];
  filters: JobFilters;
  loading: boolean;
  error?: string;

  loadDemoData: () => Promise<void>;
  createJob: (job: Omit<Job,'id'|'createdAt'|'updatedAt'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  assignRecruiter: (id: string, recruiterId: string) => void;
  filterJobs: (filters: Partial<JobFilters>) => void;
  getStats: () => JobStatsSummary;
}

function uid(prefix='job') { return `${prefix}-${Math.random().toString(36).slice(2,8)}-${Date.now().toString(36)}`; }

export const useJobs = create<JobsState>()(
  persist((set, get) => ({
    jobs: [],
    recruiters: [],
    filters: { status: 'all' },
    loading: false,

    async loadDemoData() {
      set({ loading: true });
      try {
        const [jobs, recruiters] = await Promise.all([
          fetch('/demo/demoJobs.json').then(r=> r.json()).catch(()=>[]),
          fetch('/demo/recruiters.json').then(r=> r.json()).catch(()=>[]),
        ]);
        const now = new Date().toISOString();
        const jobsNorm = (jobs||[]).map((j:any)=> ({ id: j.id || uid('job'), createdAt: j.createdAt || now, updatedAt: j.updatedAt, applicants: j.applicants||0, ...j }));
        set({ jobs: jobsNorm, recruiters: recruiters || [], loading: false });
      } catch (e) { console.error(e); set({ loading: false, error: 'Failed to load demo jobs' }); }
    },

    createJob(job) {
      const now = new Date().toISOString();
      const j = { id: uid('job'), createdAt: now, updatedAt: now, applicants: 0, ...job } as Job;
      set(state => ({ jobs: [j, ...state.jobs] }));
    },

    updateJob(id, updates) {
      const now = new Date().toISOString();
      set(state => ({ jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates, updatedAt: now } : j) }));
    },

    deleteJob(id) {
      set(state => ({ jobs: state.jobs.filter(j => j.id !== id) }));
    },

    assignRecruiter(id, recruiterId) {
      set(state => ({ jobs: state.jobs.map(j => j.id === id ? { ...j, recruiterId } : j) }));
    },

    filterJobs(filters) {
      set({ filters: { ...get().filters, ...filters } });
    },

    getStats() {
      const jobs = get().jobs;
      const totalJobs = jobs.length;
      const activePostings = jobs.filter(j => j.status === 'open').length;
      const filled = jobs.filter(j => j.status === 'filled').length;
      const expired = jobs.filter(j => j.status === 'expired').length;
      const applicantsThisMonth = jobs.reduce((acc, j) => acc + (j.applicants||0), 0);
      return { totalJobs, activePostings, filled, expired, applicantsThisMonth };
    }

  }), { name: 'jobs-store' })
);
