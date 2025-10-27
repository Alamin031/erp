import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Onboarding, OnboardingFilters, Mentor } from '../types';

interface OnboardingState {
  onboardings: Onboarding[];
  mentors: Mentor[];
  selectedId?: string | null;
  filters: OnboardingFilters;
  loading: boolean;

  loadDemoData: () => Promise<void>;
  addOnboarding: (payload: Partial<Onboarding>) => void;
  updateOnboarding: (id: string, payload: Partial<Onboarding>) => void;
  assignMentor: (id: string, mentorId: string) => void;
  markTaskDone: (id: string, taskId: string, done: boolean) => void;
  markCompleted: (id: string) => void;
  archiveOnboarding: (id: string) => void;
  selectOnboarding: (id?: string | null) => void;
  filterOnboardings: (filters: Partial<OnboardingFilters>) => void;
  computeProgress: (id: string) => number;
}

function uid(prefix = 'ob') { return `${prefix}-${Math.random().toString(36).slice(2,8)}-${Date.now().toString(36)}`; }

export const useOnboarding = create<OnboardingState>()(
  persist((set, get) => ({
    onboardings: [],
    mentors: [],
    selectedId: null,
    filters: { status: 'all' },
    loading: false,

    async loadDemoData() {
      set({ loading: true });
      try {
        const [ons, mentors] = await Promise.all([
          fetch('/demo/demoOnboardings.json').then(r=> r.json()).catch(()=>[]),
          fetch('/demo/mentors.json').then(r=> r.json()).catch(()=>[]),
        ]);
        const now = new Date().toISOString();
        const onboardings = (ons || []).map((o:any) => ({ id: o.id || uid('ob'), createdAt: o.createdAt || now, updatedAt: o.updatedAt || now, timeline: o.timeline || [], ...o }));
        set({ onboardings, mentors: mentors || [], loading: false });
      } catch (e) { console.error(e); set({ loading: false }); }
    },

    addOnboarding(payload) {
      const now = new Date().toISOString();
      const defaultTasks = payload.tasks && payload.tasks.length ? payload.tasks : [
        { id: uid('t'), title: 'Welcome Email', done: false },
        { id: uid('t'), title: 'Equipment Setup', done: false },
        { id: uid('t'), title: 'Policy Briefing', done: false },
      ];
      const ob: Onboarding = { id: uid('ob'), createdAt: now, updatedAt: now, status: 'not_started', timeline: [{ id: uid('tl'), text: 'Onboarding created', at: now }], tasks: defaultTasks, ...payload } as Onboarding;
      set(state => ({ onboardings: [ob, ...state.onboardings] }));
    },

    updateOnboarding(id, payload) {
      const now = new Date().toISOString();
      set(state => ({ onboardings: state.onboardings.map(o => o.id === id ? { ...o, ...payload, updatedAt: now, timeline: [...(o.timeline||[]), { id: uid('tl'), text: 'Onboarding updated', at: now }] } : o) }));
    },

    assignMentor(id, mentorId) {
      const now = new Date().toISOString();
      set(state => ({ onboardings: state.onboardings.map(o => o.id === id ? { ...o, mentorId, updatedAt: now, timeline: [...(o.timeline||[]), { id: uid('tl'), text: `Mentor assigned: ${mentorId}`, at: now }] } : o) }));
    },

    markTaskDone(id, taskId, done) {
      const now = new Date().toISOString();
      set(state => ({ onboardings: state.onboardings.map(o => {
        if (o.id !== id) return o;
        const tasks = (o.tasks || []).map(t => t.id === taskId ? { ...t, done } : t);
        const completedCount = tasks.filter(t=> t.done).length;
        const status = completedCount === (tasks.length || 1) ? 'completed' : (completedCount>0 ? 'in_progress' : 'not_started');
        return { ...o, tasks, status, updatedAt: now, timeline: [...(o.timeline||[]), { id: uid('tl'), text: `Task ${done ? 'completed' : 'marked pending'}: ${taskId}`, at: now }] };
      }) }));
    },

    markCompleted(id) {
      const now = new Date().toISOString();
      set(state => ({ onboardings: state.onboardings.map(o => o.id === id ? { ...o, status: 'completed', updatedAt: now, timeline: [...(o.timeline||[]), { id: uid('tl'), text: 'Onboarding completed', at: now }] } : o) }));
    },

    archiveOnboarding(id) {
      const now = new Date().toISOString();
      set(state => ({ onboardings: state.onboardings.map(o => o.id === id ? { ...o, status: 'archived', updatedAt: now, timeline: [...(o.timeline||[]), { id: uid('tl'), text: 'Onboarding archived', at: now }] } : o) }));
    },

    selectOnboarding(id) { set({ selectedId: id || null }); },

    filterOnboardings(filters) { set({ filters: { ...get().filters, ...filters } }); },

    computeProgress(id) {
      const o = get().onboardings.find(x=> x.id === id);
      if (!o) return 0;
      const total = o.tasks.length || 1;
      const done = o.tasks.filter(t=> t.done).length;
      return Math.round((done / total) * 100);
    }

  }), { name: 'onboarding-store' })
);
