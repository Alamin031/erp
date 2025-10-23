"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Shareholder,
  EquityClass,
  OwnershipChange,
  OwnershipSummary,
  EquityClassBreakdown,
  ShareholderOwnership,
  ActivityLogEntry,
  CapTableFilters,
} from "@/types/cap-table";

interface CapTableStore {
  shareholders: Shareholder[];
  equityClasses: EquityClass[];
  ownershipHistory: OwnershipChange[];
  activityLog: ActivityLogEntry[];
  filters: CapTableFilters;

  // Setters
  setShareholders: (items: Shareholder[]) => void;
  setEquityClasses: (items: EquityClass[]) => void;
  setOwnershipHistory: (items: OwnershipChange[]) => void;
  setActivityLog: (items: ActivityLogEntry[]) => void;
  setFilters: (f: CapTableFilters) => void;

  // Actions
  loadDemoData: () => Promise<void>;
  addShareholder: (payload: Omit<Shareholder, "id" | "ownershipPercentage" | "createdAt" | "updatedAt">) => void;
  editShareholder: (id: string, payload: Partial<Shareholder>) => void;
  removeShareholder: (id: string) => void;
  updateEquityClass: (id: string, payload: Partial<EquityClass>) => void;
  transferShares: (
    fromId: string,
    toId: string,
    quantity: number,
    equityType: string,
    notes?: string
  ) => void;

  // Selectors
  calculateOwnership: () => OwnershipSummary;
  getFilteredShareholders: () => Shareholder[];
  getEquityClassBreakdown: () => EquityClassBreakdown[];
  getShareholderOwnership: () => ShareholderOwnership[];
  getRecentActivityLog: (limit?: number) => ActivityLogEntry[];
}

export const useCapTable = create<CapTableStore>()(
  persist(
    (set, get) => ({
      shareholders: [],
      equityClasses: [],
      ownershipHistory: [],
      activityLog: [],
      filters: { equityType: "All" },

      setShareholders: (items) => set({ shareholders: items }),
      setEquityClasses: (items) => set({ equityClasses: items }),
      setOwnershipHistory: (items) => set({ ownershipHistory: items }),
      setActivityLog: (items) => set({ activityLog: items }),
      setFilters: (f) => set({ filters: f }),

      loadDemoData: async () => {
        try {
          const [shareholders, equityClasses, ownershipHistory] = await Promise.all([
            fetch("/demo/demoCapTableShareholders.json")
              .then((r) => r.json())
              .catch(() => []),
            fetch("/demo/demoEquityClasses.json")
              .then((r) => r.json())
              .catch(() => []),
            fetch("/demo/demoOwnershipHistory.json")
              .then((r) => r.json())
              .catch(() => []),
          ]);

          // Generate initial activity log entries from loaded data
          const initialActivityLog: ActivityLogEntry[] = [
            {
              id: `ACT-INIT-1`,
              timestamp: new Date().toISOString(),
              type: "Added",
              entity: "Shareholder",
              entityName: "Demo Data Loaded",
              details: `Loaded ${shareholders.length} shareholders and ${equityClasses.length} equity classes`,
              user: "System",
            },
          ];

          set({
            shareholders,
            equityClasses,
            ownershipHistory,
            activityLog: initialActivityLog,
          });
        } catch (e) {
          console.error("Failed to load demo data:", e);
        }
      },

      addShareholder: (payload) => {
        const id = `SH-${Date.now()}`;
        const ownership = get().calculateOwnership();
        const totalShares = ownership.totalSharesOutstanding;
        const ownershipPercentage = totalShares > 0 ? (payload.sharesHeld / (totalShares + payload.sharesHeld)) * 100 : 100;

        const shareholder: Shareholder = {
          ...payload,
          id,
          ownershipPercentage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          shareholders: [...state.shareholders, shareholder],
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: "Added",
              entity: "Shareholder",
              entityName: payload.name,
              details: `Added shareholder ${payload.name} with ${payload.sharesHeld} shares`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      editShareholder: (id, payload) => {
        set((state) => ({
          shareholders: state.shareholders.map((s) =>
            s.id === id ? { ...s, ...payload, updatedAt: new Date().toISOString() } : s
          ),
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: "Updated",
              entity: "Shareholder",
              entityName: payload.name || "Unknown",
              details: `Updated shareholder ${payload.name || ""}`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      removeShareholder: (id) => {
        const { shareholders } = get();
        const shareholder = shareholders.find((s) => s.id === id);
        if (!shareholder) return;

        set((state) => ({
          shareholders: state.shareholders.filter((s) => s.id !== id),
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: "Deleted",
              entity: "Shareholder",
              entityName: shareholder.name,
              details: `Deleted shareholder ${shareholder.name}`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      updateEquityClass: (id, payload) => {
        set((state) => ({
          equityClasses: state.equityClasses.map((e) =>
            e.id === id ? { ...e, ...payload, lastUpdated: new Date().toISOString() } : e
          ),
          activityLog: [
            {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: "Updated",
              entity: "EquityClass",
              entityName: payload.name || "Unknown",
              details: `Updated equity class ${payload.name}`,
              user: "System",
            },
            ...state.activityLog,
          ],
        }));
      },

      transferShares: (fromId, toId, quantity, equityType, notes) => {
        set((state) => {
          const updatedShareholders = state.shareholders.map((s) => {
            if (s.id === fromId) {
              return { ...s, sharesHeld: Math.max(0, s.sharesHeld - quantity) };
            }
            if (s.id === toId) {
              return { ...s, sharesHeld: s.sharesHeld + quantity };
            }
            return s;
          });

          const ownershipChange: OwnershipChange = {
            id: `OWN-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "Transfer",
            shareholderId: toId,
            shareholderName:
              state.shareholders.find((s) => s.id === toId)?.name || "Unknown",
            sharesQuantity: quantity,
            equityClass: equityType as any,
            details: notes || `Transferred ${quantity} shares`,
            user: "System",
          };

          return {
            shareholders: updatedShareholders,
            ownershipHistory: [...state.ownershipHistory, ownershipChange],
            activityLog: [
              {
                id: `ACT-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: "Transferred",
                entity: "Shares",
                entityName: equityType,
                details: `Transferred ${quantity} shares to ${state.shareholders.find((s) => s.id === toId)?.name}`,
                user: "System",
              },
              ...state.activityLog,
            ],
          };
        });
      },

      calculateOwnership: () => {
        const { shareholders, equityClasses } = get();
        const totalShares = shareholders.reduce((sum, s) => sum + s.sharesHeld, 0);
        const authorizedShares = equityClasses.reduce((sum, e) => sum + e.authorizedShares, 0);

        const byEquityClass: EquityClassBreakdown[] = equityClasses.map((ec) => {
          const classHolders = shareholders.filter((s) => s.equityType === ec.name);
          const issuedInClass = classHolders.reduce((sum, s) => sum + s.sharesHeld, 0);
          const percentageOfTotal = totalShares > 0 ? (issuedInClass / totalShares) * 100 : 0;

          return {
            class: ec.name,
            authorizedShares: ec.authorizedShares,
            issuedShares: issuedInClass,
            percentageOfTotal,
            holdersCount: classHolders.length,
          };
        });

        const byHolder: ShareholderOwnership[] = shareholders.map((s) => ({
          shareholderId: s.id,
          shareholderName: s.name,
          equityType: s.equityType,
          sharesHeld: s.sharesHeld,
          ownershipPercentage: totalShares > 0 ? (s.sharesHeld / totalShares) * 100 : 0,
        }));

        return {
          totalShareholders: shareholders.length,
          totalSharesOutstanding: totalShares,
          authorizedShares,
          fullyDilutedOwnership: 100, // Simplified for now
          byEquityClass,
          byHolder,
        };
      },

      getFilteredShareholders: () => {
        const { shareholders, filters } = get();
        return shareholders.filter((s) => {
          if (filters.equityType && filters.equityType !== "All" && s.equityType !== filters.equityType) return false;
          if (filters.searchTerm && !s.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
          return true;
        });
      },

      getEquityClassBreakdown: () => {
        return get().calculateOwnership().byEquityClass;
      },

      getShareholderOwnership: () => {
        return get().calculateOwnership().byHolder;
      },

      getRecentActivityLog: (limit = 20) => {
        const { activityLog } = get();
        return activityLog.slice(0, limit);
      },
    }),
    { name: "cap-table-store" }
  )
);
