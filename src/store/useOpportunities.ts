import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Opportunity, StageName, OpportunityFilters } from "@/types/opportunities";

interface OpportunitiesStore {
  opportunities: Opportunity[];
  stages: StageName[];
  filters: OpportunityFilters;
  activityLog: Array<{ id: string; oppId: string; oppName: string; timestamp: string; type: string; details: string; user: string }>;

  setOpportunities: (items: Opportunity[]) => void;
  setStages: (s: StageName[]) => void;
  setFilters: (f: OpportunityFilters) => void;
  setActivityLog: (items: any[]) => void;

  loadDemoData: () => Promise<void>;
  addOpportunity: (payload: Omit<Opportunity, "id" | "createdAt" | "updatedAt">) => void;
  editOpportunity: (id: string, payload: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  moveOpportunity: (id: string, stage: StageName) => void;
  filterOpportunities: (f: OpportunityFilters) => void;

  getFiltered: () => Opportunity[];
  getByStage: () => Record<StageName, Opportunity[]>;
  getStats: () => { total: number; won: number; lost: number; totalValue: number };
  getRecentActivity: (limit?: number) => any[];
}

export const useOpportunities = create<OpportunitiesStore>()(
  persist((set, get) => ({
    opportunities: [],
    stages: ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"],
    filters: {},
    activityLog: [],

    setOpportunities: (items) => set({ opportunities: items }),
    setStages: (s) => set({ stages: s }),
    setFilters: (f) => set({ filters: f }),
    setActivityLog: (items) => set({ activityLog: items }),

    loadDemoData: async () => {
      try {
        const [opps, stages] = await Promise.all([
          fetch('/demo/demoOpportunities.json').then(r => r.json()).catch(() => []),
          fetch('/demo/stages.json').then(r => r.json()).catch(() => ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]),
        ]);

        set({ opportunities: opps, stages, activityLog: [{ id: `ACT-INIT-${Date.now()}`, oppId: 'SYSTEM', oppName: 'System', timestamp: new Date().toISOString(), type: 'loaded', details: `Loaded ${opps.length} opportunities`, user: 'System' }] });
      } catch (e) {
        console.error('Failed to load demo opportunities', e);
      }
    },

    addOpportunity: (payload) => {
      const id = `OPP-${Date.now()}`;
      const opp: Opportunity = { ...payload, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Opportunity;
      set(state => ({ opportunities: [opp, ...state.opportunities], activityLog: [{ id: `ACT-${Date.now()}`, oppId: id, oppName: opp.name, timestamp: new Date().toISOString(), type: 'created', details: 'Opportunity created', user: 'System' }, ...state.activityLog] }));
    },

    editOpportunity: (id, payload) => {
      set(state => ({ opportunities: state.opportunities.map(o => o.id === id ? { ...o, ...payload, updatedAt: new Date().toISOString() } : o), activityLog: [{ id: `ACT-${Date.now()}`, oppId: id, oppName: payload.name || state.opportunities.find(x => x.id === id)?.name || 'Unknown', timestamp: new Date().toISOString(), type: 'updated', details: 'Opportunity updated', user: 'System' }, ...state.activityLog] }));
    },

    deleteOpportunity: (id) => {
      const opp = get().opportunities.find(o => o.id === id);
      if (!opp) return;
      // Prevent deletion if closed
      if (opp.stage === 'Closed Won' || opp.stage === 'Closed Lost') return;
      set(state => ({ opportunities: state.opportunities.filter(o => o.id !== id), activityLog: [{ id: `ACT-${Date.now()}`, oppId: id, oppName: opp.name, timestamp: new Date().toISOString(), type: 'deleted', details: 'Opportunity deleted', user: 'System' }, ...state.activityLog] }));
    },

    moveOpportunity: (id, stage) => {
      const opp = get().opportunities.find(o => o.id === id);
      if (!opp) return;
      const old = opp.stage;
      set(state => ({ opportunities: state.opportunities.map(o => o.id === id ? { ...o, stage, updatedAt: new Date().toISOString() } : o), activityLog: [{ id: `ACT-${Date.now()}`, oppId: id, oppName: opp.name, timestamp: new Date().toISOString(), type: 'stage_changed', details: `Stage ${old} -> ${stage}`, user: 'System' }, ...state.activityLog] }));
    },

    filterOpportunities: (f) => set({ filters: f }),

    getFiltered: () => {
      const { opportunities, filters } = get();
      return opportunities.filter(o => {
        if (filters.stage && filters.stage !== 'All' && o.stage !== filters.stage) return false;
        if (filters.ownerId && filters.ownerId !== 'All' && o.ownerId !== filters.ownerId) return false;
        if (filters.dateFrom && new Date(o.expectedCloseDate || '') < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && new Date(o.expectedCloseDate || '') > new Date(filters.dateTo)) return false;
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          if (!o.name.toLowerCase().includes(q) && !(o.companyName || '').toLowerCase().includes(q)) return false;
        }
        return true;
      }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    getByStage: () => {
      const { opportunities, stages } = get();
      const res = {} as Record<StageName, Opportunity[]>;
      stages.forEach((s: any) => { res[s] = opportunities.filter(o => o.stage === s); });
      return res;
    },

    getStats: () => {
      const { opportunities } = get();
      const total = opportunities.length;
      const won = opportunities.filter(o => o.stage === 'Closed Won' || o.status === 'Won').length;
      const lost = opportunities.filter(o => o.stage === 'Closed Lost' || o.status === 'Lost').length;
      const totalValue = opportunities.reduce((sum, o) => sum + (o.value || 0), 0);
      return { total, won, lost, totalValue };
    },

    getRecentActivity: (limit = 20) => get().activityLog.slice(0, limit),

  }), { name: 'opportunities-store' })
);
