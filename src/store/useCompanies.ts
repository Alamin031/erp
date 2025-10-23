import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Company, Industry, CompanyFilters } from "@/types/companies";

interface CompaniesStore {
  companies: Company[];
  industries: Industry[];
  filters: CompanyFilters;
  activityLog: Array<{ id: string; companyId: string; companyName: string; timestamp: string; type: string; details: string; user: string }>;

  setCompanies: (items: Company[]) => void;
  setIndustries: (items: Industry[]) => void;
  setFilters: (f: CompanyFilters) => void;
  setActivityLog: (items: any[]) => void;

  loadDemoData: () => Promise<void>;
  addCompany: (payload: Omit<Company, "id" | "createdAt" | "updatedAt">) => void;
  editCompany: (id: string, payload: Partial<Company>) => void;
  removeCompany: (id: string) => void;
  filterCompanies: (f: CompanyFilters) => void;
  linkContact: (companyId: string, contactId: string) => void;
  unlinkContact: (companyId: string, contactId: string) => void;

  getFilteredCompanies: () => Company[];
  getStatistics: () => { total: number; activeClients: number; prospects: number; avgEmployees: number };
  getRecentActivity: (limit?: number) => any[];
}

export const useCompanies = create<CompaniesStore>()(
  persist((set, get) => ({
    companies: [],
    industries: [],
    filters: {},
    activityLog: [],

    setCompanies: (items) => set({ companies: items }),
    setIndustries: (items) => set({ industries: items }),
    setFilters: (f) => set({ filters: f }),
    setActivityLog: (items) => set({ activityLog: items }),

    loadDemoData: async () => {
      try {
        const [companies, industries] = await Promise.all([
          fetch('/demo/demoCompanies.json').then(r => r.json()).catch(() => []),
          fetch('/demo/industries.json').then(r => r.json()).catch(() => []),
        ]);

        set({
          companies,
          industries,
          activityLog: [
            {
              id: `ACT-INIT-${Date.now()}`,
              companyId: 'SYSTEM',
              companyName: 'System',
              timestamp: new Date().toISOString(),
              type: 'created',
              details: `Loaded ${companies.length} companies and ${industries.length} industries`,
              user: 'System',
            },
          ],
        });
      } catch (e) {
        console.error('Failed to load demo companies', e);
      }
    },

    addCompany: (payload) => {
      const exists = get().companies.find(c => c.name.toLowerCase() === payload.name.toLowerCase());
      if (exists) return;
      const id = `COMP-${Date.now()}`;
      const company: Company = { ...payload, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Company;
      set(state => ({
        companies: [company, ...state.companies],
        activityLog: [
          { id: `ACT-${Date.now()}`, companyId: id, companyName: company.name, timestamp: new Date().toISOString(), type: 'created', details: 'Company created', user: 'System' },
          ...state.activityLog,
        ],
      }));
    },

    editCompany: (id, payload) => {
      set(state => ({
        companies: state.companies.map(c => c.id === id ? { ...c, ...payload, updatedAt: new Date().toISOString() } : c),
        activityLog: [
          { id: `ACT-${Date.now()}`, companyId: id, companyName: payload.name || state.companies.find(x => x.id === id)?.name || 'Unknown', timestamp: new Date().toISOString(), type: 'updated', details: 'Company updated', user: 'System' },
          ...state.activityLog,
        ],
      }));
    },

    removeCompany: (id) => {
      const comp = get().companies.find(c => c.id === id);
      if (!comp) return;
      set(state => ({ companies: state.companies.filter(c => c.id !== id), activityLog: [{ id: `ACT-${Date.now()}`, companyId: id, companyName: comp.name, timestamp: new Date().toISOString(), type: 'deleted', details: 'Company removed', user: 'System' }, ...state.activityLog] }));
    },

    filterCompanies: (f) => set({ filters: f }),

    linkContact: (companyId, contactId) => {
      set(state => ({ companies: state.companies.map(c => c.id === companyId ? { ...c, contacts: Array.from(new Set([...(c.contacts || []), contactId])) } : c) }));
    },

    unlinkContact: (companyId, contactId) => {
      set(state => ({ companies: state.companies.map(c => c.id === companyId ? { ...c, contacts: (c.contacts || []).filter(id => id !== contactId) } : c) }));
    },

    getFilteredCompanies: () => {
      const { companies, filters } = get();
      return companies.filter(c => {
        if (filters.industry && filters.industry !== 'All' && c.industry !== filters.industry) return false;
        if (filters.size && filters.size !== 'All' && c.size !== filters.size) return false;
        if (filters.country && filters.country !== 'All' && c.country !== filters.country) return false;
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          if (!c.name.toLowerCase().includes(q) && !(c.industry || '').toLowerCase().includes(q)) return false;
        }
        return true;
      }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    getStatistics: () => {
      const { companies } = get();
      const total = companies.length;
      const activeClients = companies.filter(c => c.status === 'Active').length;
      const prospects = companies.filter(c => c.status === 'Prospect').length;
      // average employees - parse from size if size contains a number like "1-50"
      const sizes = companies.map(c => {
        const s = c.size || '';
        const match = s.match(/(\d+)/g);
        if (!match) return 0;
        const nums = match.map(Number);
        return nums.reduce((a,b) => a+b,0)/nums.length;
      });
      const avgEmployees = sizes.length ? Math.round(sizes.reduce((a,b)=>a+b,0)/sizes.length) : 0;
      return { total, activeClients, prospects, avgEmployees };
    },

    getRecentActivity: (limit = 20) => get().activityLog.slice(0, limit),
  }), { name: 'companies-store' })
);
