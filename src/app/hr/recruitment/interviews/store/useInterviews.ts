import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Interview, Interviewer, InterviewFilters, InterviewStats } from '../types';

interface InterviewsState {
  interviews: Interview[];
  interviewers: Interviewer[];
  filters: InterviewFilters;
  selectedInterviewId?: string | null;
  loading: boolean;
  error?: string;

  loadDemoData: () => Promise<void>;
  scheduleInterview: (payload: Omit<Interview,'id'|'createdAt'|'updatedAt'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  cancelInterview: (id: string, reason?: string) => void;
  rescheduleInterview: (id: string, date: string, startTime: string) => void;
  markCompleted: (id: string, notes?: string) => void;
  addFeedback: (id: string, feedback: any) => void;
  filterInterviews: (filters: Partial<InterviewFilters>) => void;
  getInterviewsByDate: (date: string) => Interview[];
  detectConflicts: (interviewerId: string, date: string, startTime: string, durationMins: number) => boolean;
}

function uid(prefix='int') { return `${prefix}-${Math.random().toString(36).slice(2,8)}-${Date.now().toString(36)}`; }

export const useInterviews = create<InterviewsState>()(
  persist((set, get) => ({
    interviews: [],
    interviewers: [],
    filters: {},
    selectedInterviewId: null,
    loading: false,

    async loadDemoData() {
      set({ loading: true });
      try {
        const [ints, interviewers] = await Promise.all([
          fetch('/demo/demoInterviews.json').then(r=> r.json()).catch(()=>[]),
          fetch('/demo/demoInterviewers.json').then(r=> r.json()).catch(()=>[]),
        ]);
        const now = new Date().toISOString();
        const normalized = (ints||[]).map((i:any)=> ({ id: i.id || uid('int'), createdAt: i.createdAt || now, updatedAt: i.updatedAt, timeline: i.timeline||[], ...i }));
        set({ interviews: normalized, interviewers: interviewers || [], loading: false });
      } catch (e) { console.error(e); set({ loading: false, error: 'Failed to load demo interviews' }); }
    },

    scheduleInterview(payload) {
      const now = new Date().toISOString();
      const interview = { id: uid('int'), createdAt: now, updatedAt: now, timeline: [{ id: uid('t'), type: 'created', text: 'Scheduled', at: now }], ...payload } as Interview;
      set(state => ({ interviews: [interview, ...state.interviews] }));
    },

    updateInterview(id, updates) {
      const now = new Date().toISOString();
      set(state => ({ interviews: state.interviews.map(i => i.id === id ? { ...i, ...updates, updatedAt: now, timeline: [{ id: uid('t'), type: 'updated', text: 'Updated', at: now }, ...(i.timeline || [])] } : i) }));
    },

    cancelInterview(id, reason) {
      const now = new Date().toISOString();
      set(state => ({ interviews: state.interviews.map(i => i.id === id ? { ...i, status: 'canceled', updatedAt: now, timeline: [{ id: uid('t'), type: 'canceled', text: reason || 'Canceled', at: now }, ...(i.timeline || [])] } : i) }));
    },

    rescheduleInterview(id, date, startTime) {
      const now = new Date().toISOString();
      set(state => ({ interviews: state.interviews.map(i => i.id === id ? { ...i, date, startTime, status: 'rescheduled', updatedAt: now, timeline: [{ id: uid('t'), type: 'rescheduled', text: `Rescheduled to ${date} ${startTime}`, at: now }, ...(i.timeline || [])] } : i) }));
    },

    markCompleted(id, notes) {
      const now = new Date().toISOString();
      set(state => ({ interviews: state.interviews.map(i => i.id === id ? { ...i, status: 'completed', updatedAt: now, timeline: [{ id: uid('t'), type: 'completed', text: notes || 'Completed', at: now }, ...(i.timeline || [])] } : i) }));
    },

    addFeedback(id, feedback) {
      const now = new Date().toISOString();
      set(state => ({ interviews: state.interviews.map(i => i.id === id ? { ...i, timeline: [{ id: uid('t'), type: 'feedback', text: JSON.stringify(feedback), at: now }, ...(i.timeline || [])] } : i) }));
    },

    filterInterviews(filters) { set({ filters: { ...get().filters, ...filters } }); },

    getInterviewsByDate(date) {
      return get().interviews.filter(i => i.date === date).sort((a,b)=> a.startTime.localeCompare(b.startTime));
    },

    detectConflicts(interviewerId, date, startTime, durationMins) {
      const toMin = (t: string) => { const [h,m] = t.split(':').map(Number); return h*60 + m; };
      const s = toMin(startTime);
      const e = s + durationMins;
      return get().interviews.some(i => i.date === date && (i.interviewers || []).includes(interviewerId) && (() => { const is = toMin(i.startTime); const ie = is + (i.durationMins||30); return Math.max(is, s) < Math.min(ie, e); })());
    }

  }), { name: 'interviews-store' })
);
