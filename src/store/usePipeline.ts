import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Opportunity } from "@/types/opportunities";
import { StageName } from "@/types/opportunities";

interface Filters { ownerId?: string | 'All'; stage?: StageName | 'All'; dateFrom?: string; dateTo?: string }

interface PipelineStore {
  stages: StageName[];
  opportunities: Opportunity[];
  filters: Filters;
  activity: Array<{ id: string; text: string; timestamp: string }>;

  loadDemoData: () => Promise<void>;
  moveOpportunity: (id: string, newStage: StageName) => void;
  filterPipeline: (f: Filters) => void;
  calculateTotals: () => { total: number; totalValue: number; winRate: number; avgDealSize: number };
  calculateConversionRates: () => number[];
  getByStage: () => Record<StageName, Opportunity[]>;
  getTotals: () => { total: number; totalValue: number; winRate: number; avgDealSize: number };
  getConversionRates: () => number[];
}

export const usePipeline = create<PipelineStore>()(
  persist((set, get) => ({
    stages: ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"],
    opportunities: [],
    filters: {},
    activity: [],

    loadDemoData: async () => {
      try {
        const [opps, stages] = await Promise.all([
          fetch('/demo/demoOpportunities.json').then(r => r.json()).catch(() => []),
          fetch('/demo/stages.json').then(r => r.json()).catch(() => ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']),
        ]);
        set({ opportunities: opps, stages, activity: [{ id: `a-${Date.now()}`, text: `Loaded ${opps.length} opportunities`, timestamp: new Date().toISOString() }] });
      } catch (e) { console.error(e); }
    },

    moveOpportunity: (id, newStage) => {
      const opp = get().opportunities.find(o => o.id === id);
      if (!opp) return;
      const old = opp.stage;
      set(state => ({ opportunities: state.opportunities.map(o => o.id === id ? { ...o, stage: newStage, updatedAt: new Date().toISOString() } : o), activity: [{ id: `act-${Date.now()}`, text: `Deal '${opp.name}' moved from ${old} → ${newStage}`, timestamp: new Date().toISOString() }, ...state.activity] }));
    },

    filterPipeline: (f) => set({ filters: f }),

    calculateTotals: () => {
      const { opportunities } = get();
      const total = opportunities.length;
      const totalValue = opportunities.reduce((s, o) => s + (o.value || 0), 0);
      const won = opportunities.filter(o => o.stage === 'Closed Won').length;
      const winRate = total > 0 ? Math.round((won / total) * 100) : 0;
      const avgDealSize = total > 0 ? Math.round(totalValue / total) : 0;
      return { total, totalValue, winRate, avgDealSize };
    },

    calculateConversionRates: () => {
      const { opportunities, stages } = get();
      const rates: number[] = [];
      for (let i = 0; i < stages.length - 1; i++) {
        const s = stages[i];
        const next = stages[i + 1];
        const countS = opportunities.filter(o => o.stage === s).length;
        const countNext = opportunities.filter(o => o.stage === next).length;
        rates.push(countS > 0 ? (countNext / countS) * 100 : 0);
      }
      return rates;
    },

    getByStage: () => {
      const { opportunities, stages } = get();
      const res = {} as Record<StageName, Opportunity[]>;
      stages.forEach((s: StageName) => { res[s] = opportunities.filter(o => o.stage === s); });
      return res;
    },

    getTotals: () => get().calculateTotals(),
    getConversionRates: () => get().calculateConversionRates(),
  }), { name: 'pipeline-store' })
);
