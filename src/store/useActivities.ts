import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Activity, ActivityType, ActivityFilters, ActivityLogEntry } from "@/types/activities";

interface ActivitiesStore {
  activities: Activity[];
  activityTypes: ActivityType[];
  filters: ActivityFilters;
  log: ActivityLogEntry[];

  loadDemoData: () => Promise<void>;
  addActivity: (payload: Omit<Activity, "id" | "createdAt" | "updatedAt">) => void;
  editActivity: (id: string, payload: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  markCompleted: (id: string) => void;
  filterActivities: (f: ActivityFilters) => void;
  getUpcoming: (limit?: number) => Activity[];
  getFiltered: () => Activity[];
  getStats: () => { total: number; callsToday: number; meetings: number; pendingFollowUps: number };
}

export const useActivities = create<ActivitiesStore>()(
  persist((set, get) => ({
    activities: [],
    activityTypes: ["Call", "Meeting", "Email", "Task"],
    filters: {},
    log: [],

    loadDemoData: async () => {
      try {
        const [activities] = await Promise.all([
          fetch('/demo/demoActivities.json').then(r => r.json()).catch(() => []),
        ]);
        set({ activities, log: [{ id: `log-${Date.now()}`, text: `Loaded ${activities.length} activities`, timestamp: new Date().toISOString() }] });
      } catch (e) { console.error('Failed to load activities demo', e); }
    },

    addActivity: (payload) => {
      const id = `ACT-${Date.now()}`;
      const activity: Activity = { ...payload, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Activity;
      set(state => ({ activities: [activity, ...state.activities], log: [{ id: `log-${Date.now()}`, text: `Activity created: ${activity.type} for ${activity.contactName || activity.companyName || activity.id}`, timestamp: new Date().toISOString() }, ...state.log] }));
    },

    editActivity: (id, payload) => {
      set(state => ({ activities: state.activities.map(a => a.id === id ? { ...a, ...payload, updatedAt: new Date().toISOString() } : a), log: [{ id: `log-${Date.now()}`, text: `Activity updated: ${id}`, timestamp: new Date().toISOString() }, ...state.log] }));
    },

    deleteActivity: (id) => {
      set(state => ({ activities: state.activities.filter(a => a.id !== id), log: [{ id: `log-${Date.now()}`, text: `Activity deleted: ${id}`, timestamp: new Date().toISOString() }, ...state.log] }));
    },

    markCompleted: (id) => {
      set(state => ({ activities: state.activities.map(a => a.id === id ? { ...a, status: 'Completed', updatedAt: new Date().toISOString() } : a), log: [{ id: `log-${Date.now()}`, text: `Activity completed: ${id}`, timestamp: new Date().toISOString() }, ...state.log] }));
    },

    filterActivities: (f) => set({ filters: f }),

    getUpcoming: (limit = 10) => {
      const now = new Date().toISOString();
      return get().activities.filter(a => a.dateTime >= now && a.status !== 'Completed').sort((a,b)=> new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).slice(0, limit);
    },

    getFiltered: () => {
      const { activities, filters } = get();
      return activities.filter(a => {
        if (filters.type && filters.type !== 'All' && a.type !== (filters.type as ActivityType)) return false;
        if (filters.ownerId && filters.ownerId !== 'All' && a.ownerId !== filters.ownerId) return false;
        if (filters.contactId && filters.contactId !== 'All' && a.contactId !== filters.contactId) return false;
        if (filters.companyId && filters.companyId !== 'All' && a.companyId !== filters.companyId) return false;
        if (filters.dateFrom && new Date(a.dateTime) < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && new Date(a.dateTime) > new Date(filters.dateTo)) return false;
        return true;
      }).sort((a,b)=> new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    },

    getStats: () => {
      const activities = get().activities;
      const total = activities.length;
      const today = new Date();
      const callsToday = activities.filter(a => a.type === 'Call' && new Date(a.dateTime).toDateString() === today.toDateString()).length;
      const meetings = activities.filter(a => a.type === 'Meeting').length;
      const pendingFollowUps = activities.filter(a => a.status === 'Pending' && a.followUp && new Date(a.followUp) >= today).length;
      return { total, callsToday, meetings, pendingFollowUps };
    },

  }), { name: 'activities-store' })
);
