"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Lead,
  SalesAgent,
  LeadSource,
  LeadFilters,
  LeadActivityEntry,
  LeadStage,
} from "@/types/leads";

interface LeadsStore {
  leads: Lead[];
  salesAgents: SalesAgent[];
  leadSources: LeadSource[];
  filters: LeadFilters;
  activityLog: LeadActivityEntry[];

  // Setters
  setLeads: (items: Lead[]) => void;
  setSalesAgents: (items: SalesAgent[]) => void;
  setLeadSources: (items: LeadSource[]) => void;
  setFilters: (f: LeadFilters) => void;
  setActivityLog: (items: LeadActivityEntry[]) => void;

  // Actions
  loadDemoData: () => Promise<void>;
  addLead: (payload: Omit<Lead, "id" | "createdAt" | "updatedAt" | "interactionHistory">) => void;
  editLead: (id: string, payload: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  changeStage: (id: string, newStage: LeadStage) => void;
  assignAgent: (id: string, agentId: string, agentName: string) => void;
  markConverted: (id: string) => void;
  markLost: (id: string, reason: string) => void;
  scheduleFollowUp: (id: string, date: string) => void;

  // Selectors
  getFilteredLeads: () => Lead[];
  getStatistics: () => {
    totalLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    lostLeads: number;
    conversionRate: number;
    totalValue: number;
  };
  getLeadsByStage: () => Record<LeadStage, Lead[]>;
  getRecentActivity: (limit?: number) => LeadActivityEntry[];
}

export const useLeads = create<LeadsStore>()(
  persist(
    (set, get) => ({
      leads: [],
      salesAgents: [],
      leadSources: [],
      filters: {},
      activityLog: [],

      setLeads: (items) => set({ leads: items }),
      setSalesAgents: (items) => set({ salesAgents: items }),
      setLeadSources: (items) => set({ leadSources: items }),
      setFilters: (f) => set({ filters: f }),
      setActivityLog: (items) => set({ activityLog: items }),

      loadDemoData: async () => {
        try {
          const [leads, salesAgents, leadSources] = await Promise.all([
            fetch("/demo/demoLeads.json")
              .then((r) => r.json())
              .catch(() => []),
            fetch("/demo/demoSalesAgents.json")
              .then((r) => r.json())
              .catch(() => []),
            fetch("/demo/demoLeadSources.json")
              .then((r) => r.json())
              .catch(() => []),
          ]);

          set({
            leads,
            salesAgents,
            leadSources,
            activityLog: [
              {
                id: `ACT-INIT-1`,
                leadId: "SYSTEM",
                leadName: "System",
                timestamp: new Date().toISOString(),
                type: "created",
                details: `Loaded ${leads.length} leads and ${salesAgents.length} sales agents`,
                user: "System",
              },
            ],
          });
        } catch (e) {
          console.error("Failed to load demo data:", e);
        }
      },

      addLead: (payload) => {
        const id = `LEAD-${Date.now()}`;
        const lead: Lead = {
          ...payload,
          id,
          interactionHistory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          leads: [...state.leads, lead],
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              leadId: id,
              leadName: payload.name,
              timestamp: new Date().toISOString(),
              type: "created",
              details: `Lead created for ${payload.company}`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      editLead: (id, payload) => {
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, ...payload, updatedAt: new Date().toISOString() } : l
          ),
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              leadId: id,
              leadName: payload.name || get().leads.find((l) => l.id === id)?.name || "Unknown",
              timestamp: new Date().toISOString(),
              type: "updated",
              details: `Lead information updated`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      removeLead: (id) => {
        const lead = get().leads.find((l) => l.id === id);
        if (!lead) return;

        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              leadId: id,
              leadName: lead.name,
              timestamp: new Date().toISOString(),
              type: "created",
              details: `Lead deleted`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      changeStage: (id, newStage) => {
        const lead = get().leads.find((l) => l.id === id);
        if (!lead) return;

        const oldStage = lead.stage;

        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, stage: newStage, updatedAt: new Date().toISOString() } : l
          ),
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              leadId: id,
              leadName: lead.name,
              timestamp: new Date().toISOString(),
              type: "stage_changed",
              details: `Stage changed from ${oldStage} to ${newStage}`,
              oldValue: oldStage,
              newValue: newStage,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      assignAgent: (id, agentId, agentName) => {
        const lead = get().leads.find((l) => l.id === id);
        if (!lead) return;

        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? {
                  ...l,
                  assignedTo: agentId,
                  assignedToName: agentName,
                  updatedAt: new Date().toISOString(),
                }
              : l
          ),
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              leadId: id,
              leadName: lead.name,
              timestamp: new Date().toISOString(),
              type: "assigned",
              details: `Assigned to ${agentName}`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      markConverted: (id) => {
        const lead = get().leads.find((l) => l.id === id);
        if (!lead) return;

        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? {
                  ...l,
                  status: "Converted",
                  stage: "Closed Won",
                  convertedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : l
          ),
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              leadId: id,
              leadName: lead.name,
              timestamp: new Date().toISOString(),
              type: "converted",
              details: `Lead converted to customer`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      markLost: (id, reason) => {
        const lead = get().leads.find((l) => l.id === id);
        if (!lead) return;

        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? {
                  ...l,
                  status: "Lost",
                  stage: "Closed Lost",
                  lostAt: new Date().toISOString(),
                  lostReason: reason,
                  updatedAt: new Date().toISOString(),
                }
              : l
          ),
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              leadId: id,
              leadName: lead.name,
              timestamp: new Date().toISOString(),
              type: "lost",
              details: `Lead marked as lost: ${reason}`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      scheduleFollowUp: (id, date) => {
        const lead = get().leads.find((l) => l.id === id);
        if (!lead) return;

        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, nextFollowUp: date, updatedAt: new Date().toISOString() } : l
          ),
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              leadId: id,
              leadName: lead.name,
              timestamp: new Date().toISOString(),
              type: "follow_up_scheduled",
              details: `Follow-up scheduled for ${new Date(date).toLocaleDateString()}`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      getFilteredLeads: () => {
        const { leads, filters } = get();
        return leads.filter((lead) => {
          if (filters.stage && filters.stage !== "All" && lead.stage !== filters.stage) return false;
          if (filters.assignedTo && filters.assignedTo !== "All" && lead.assignedTo !== filters.assignedTo)
            return false;
          if (filters.leadSource && filters.leadSource !== "All" && lead.leadSource !== filters.leadSource)
            return false;
          if (filters.status && filters.status !== "All" && lead.status !== filters.status) return false;
          if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            if (!lead.name.toLowerCase().includes(q) && !lead.company.toLowerCase().includes(q))
              return false;
          }
          return true;
        });
      },

      getStatistics: () => {
        const { leads } = get();
        const totalLeads = leads.length;
        const qualifiedLeads = leads.filter((l) => ["Qualified", "Proposal"].includes(l.stage)).length;
        const convertedLeads = leads.filter((l) => l.status === "Converted").length;
        const lostLeads = leads.filter((l) => l.status === "Lost").length;
        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
        const totalValue = leads
          .filter((l) => l.status !== "Lost")
          .reduce((sum, l) => sum + l.potentialValue, 0);

        return {
          totalLeads,
          qualifiedLeads,
          convertedLeads,
          lostLeads,
          conversionRate,
          totalValue,
        };
      },

      getLeadsByStage: () => {
        const { leads } = get();
        const stages: LeadStage[] = ["New", "Contacted", "Qualified", "Proposal", "Closed Won", "Closed Lost"];
        const result = {} as Record<LeadStage, Lead[]>;

        stages.forEach((stage) => {
          result[stage] = leads.filter((l) => l.stage === stage);
        });

        return result;
      },

      getRecentActivity: (limit = 20) => {
        const { activityLog } = get();
        return activityLog.slice(0, limit);
      },
    }),
    { name: "leads-store" }
  )
);
