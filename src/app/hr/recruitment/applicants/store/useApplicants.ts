import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Applicant, ApplicantFilters, ApplicantStats } from '../types';

interface ApplicantsState {
  applicants: Applicant[];
  filters: ApplicantFilters;
  loading: boolean;
  error?: string;

  loadDemoData: () => Promise<void>;
  addApplicant: (a: Omit<Applicant,'id'|'createdAt'|'updatedAt'>) => void;
  updateApplicant: (id: string, updates: Partial<Applicant>) => void;
  deleteApplicant: (id: string) => void;
  assignRecruiter: (id: string, recruiterId: string) => void;
  updateStage: (id: string, stage: Applicant['stage']) => void;
  filterApplicants: (filters: Partial<ApplicantFilters>) => void;
  getStageStats: () => ApplicantStats;
}

function uid(prefix='app') { return `${prefix}-${Math.random().toString(36).slice(2,8)}-${Date.now().toString(36)}`; }

export const useApplicants = create<ApplicantsState>()(
  persist((set, get) => ({
    applicants: [],
    filters: { stage: 'all' },
    loading: false,

    async loadDemoData() {
      set({ loading: true });
      try {
        const apps = await fetch('/demo/demoApplicants.json').then(r=> r.json()).catch(()=>[]);
        const now = new Date().toISOString();
        const normalized = (apps||[]).map((a:any)=> ({ id: a.id || uid('app'), createdAt: a.createdAt || now, updatedAt: a.updatedAt, ...a }));
        set({ applicants: normalized, loading: false });
      } catch (e) { console.error(e); set({ loading: false, error: 'Failed to load demo applicants' }); }
    },

    addApplicant(a) {
      const now = new Date().toISOString();
      const app = { id: uid('app'), createdAt: now, updatedAt: now, ...a } as Applicant;
      set(state => ({ applicants: [app, ...state.applicants] }));
    },

    updateApplicant(id, updates) {
      const now = new Date().toISOString();
      set(state => ({ applicants: state.applicants.map(ap => ap.id === id ? { ...ap, ...updates, updatedAt: now } : ap) }));
    },

    deleteApplicant(id) {
      set(state => ({ applicants: state.applicants.filter(ap => ap.id !== id) }));
    },

    assignRecruiter(id, recruiterId) {
      set(state => ({ applicants: state.applicants.map(ap => ap.id === id ? { ...ap, recruiterId } : ap) }));
    },

    updateStage(id, stage) {
      set(state => ({ applicants: state.applicants.map(ap => ap.id === id ? { ...ap, stage } : ap) }));
    },

    filterApplicants(filters) {
      set({ filters: { ...get().filters, ...filters } });
    },

    getStageStats() {
      const apps = get().applicants;
      const total = apps.length;
      const shortlisted = apps.filter(a => a.stage === 'shortlisted').length;
      const interviewScheduled = apps.filter(a => a.stage === 'interview').length;
      const hired = apps.filter(a => a.stage === 'hired').length;
      const rejected = apps.filter(a => a.stage === 'rejected').length;
      const conversionRate = total ? Math.round((hired / total) * 100) : 0;
      return { total, shortlisted, interviewScheduled, hired, rejected, conversionRate } as ApplicantStats;
    }

  }), { name: 'applicants-store' })
);
