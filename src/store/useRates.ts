import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Rate, RateRule, PriceAdjustment, RateFilters, RateWithCalculatedPrice, RateAuditLog } from "@/types/rates";

interface RatesStore {
  rates: Rate[];
  rules: RateRule[];
  adjustmentQueue: PriceAdjustment[];
  auditLogs: RateAuditLog[];
  filters: RateFilters;
  selectedRate: Rate | null;
  calendarView: boolean;
  setRates: (rates: Rate[]) => void;
  setRules: (rules: RateRule[]) => void;
  setFilters: (filters: RateFilters) => void;
  setSelectedRate: (rate: Rate | null) => void;
  setCalendarView: (view: boolean) => void;
  addRate: (rate: Rate) => void;
  updateRate: (id: string, updates: Partial<Rate>) => void;
  deleteRate: (id: string) => void;
  cloneRate: (id: string, newRateData: Partial<Rate>) => void;
  addRule: (rule: RateRule) => void;
  updateRule: (id: string, updates: Partial<RateRule>) => void;
  deleteRule: (id: string) => void;
  addAdjustment: (adjustment: PriceAdjustment) => void;
  approveAdjustment: (id: string, approvedBy: string) => void;
  rejectAdjustment: (id: string, approvedBy: string) => void;
  filterRates: () => Rate[];
  getEffectiveRate: (
    roomType: string,
    date: Date,
    channel: string,
    occupancy?: number,
    lengthOfStay?: number,
    leadTime?: number
  ) => number;
  getApplicableRules: (rateId: string) => RateRule[];
  getRatesWithCalculations: (date: Date, channel: string) => RateWithCalculatedPrice[];
  exportRatesCSV: () => string;
  addAuditLog: (log: Omit<RateAuditLog, "id">) => void;
}

export const useRates = create<RatesStore>()(
  persist(
    (set, get) => ({
      rates: [],
      rules: [],
      adjustmentQueue: [],
      auditLogs: [],
      filters: {
        roomType: [],
        rateType: [],
        channel: [],
        status: [],
        dateFrom: "",
        dateTo: "",
        priceFrom: 0,
        priceTo: 10000,
        searchQuery: "",
      },
      selectedRate: null,
      calendarView: false,

      setRates: (rates) => set({ rates }),
      setRules: (rules) => set({ rules }),
      setFilters: (filters) => set({ filters }),
      setSelectedRate: (rate) => set({ selectedRate: rate }),
      setCalendarView: (view) => set({ calendarView: view }),

      addRate: (rate) => {
        set((state) => ({
          rates: [...state.rates, rate],
        }));
        get().addAuditLog({
          rateId: rate.id,
          action: "create",
          performedBy: rate.createdBy,
          timestamp: new Date().toISOString(),
        });
      },

      updateRate: (id, updates) => {
        set((state) => ({
          rates: state.rates.map((rate) =>
            rate.id === id
              ? {
                  ...rate,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : rate
          ),
        }));
        get().addAuditLog({
          rateId: id,
          action: "update",
          changedFields: Object.entries(updates).reduce(
            (acc, [key, value]) => {
              const oldRate = get().rates.find((r) => r.id === id);
              if (oldRate) {
                acc[key] = { from: (oldRate as any)[key], to: value };
              }
              return acc;
            },
            {} as Record<string, { from: any; to: any }>
          ),
          performedBy: (updates as any).updatedBy || "system",
          timestamp: new Date().toISOString(),
        });
      },

      deleteRate: (id) => {
        set((state) => ({
          rates: state.rates.filter((rate) => rate.id !== id),
        }));
        get().addAuditLog({
          rateId: id,
          action: "delete",
          performedBy: "system",
          timestamp: new Date().toISOString(),
        });
      },

      cloneRate: (id, newRateData) => {
        const sourceRate = get().rates.find((r) => r.id === id);
        if (sourceRate) {
          const clonedRate: Rate = {
            ...sourceRate,
            id: `R-${Date.now()}`,
            ...newRateData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          get().addRate(clonedRate);
        }
      },

      addRule: (rule) => {
        set((state) => ({
          rules: [...state.rules, rule],
        }));
      },

      updateRule: (id, updates) => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            rule.id === id
              ? {
                  ...rule,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : rule
          ),
        }));
      },

      deleteRule: (id) => {
        set((state) => ({
          rules: state.rules.filter((rule) => rule.id !== id),
        }));
      },

      addAdjustment: (adjustment) => {
        set((state) => ({
          adjustmentQueue: [...state.adjustmentQueue, adjustment],
        }));
      },

      approveAdjustment: (id, approvedBy) => {
        set((state) => ({
          adjustmentQueue: state.adjustmentQueue.map((adj) =>
            adj.id === id
              ? {
                  ...adj,
                  approvalStatus: "Approved" as const,
                  approvedBy,
                  updatedAt: new Date().toISOString(),
                }
              : adj
          ),
        }));
        get().addAuditLog({
          rateId: "",
          action: "approve",
          performedBy: approvedBy,
          timestamp: new Date().toISOString(),
        });
      },

      rejectAdjustment: (id, approvedBy) => {
        set((state) => ({
          adjustmentQueue: state.adjustmentQueue.map((adj) =>
            adj.id === id
              ? {
                  ...adj,
                  approvalStatus: "Rejected" as const,
                  approvedBy,
                  updatedAt: new Date().toISOString(),
                }
              : adj
          ),
        }));
      },

      filterRates: () => {
        const { rates, filters } = get();
        let filtered = rates;

        if (filters.roomType.length > 0) {
          filtered = filtered.filter((r) => filters.roomType.includes(r.roomType));
        }

        if (filters.rateType.length > 0) {
          filtered = filtered.filter((r) => filters.rateType.includes(r.rateType));
        }

        if (filters.channel.length > 0) {
          filtered = filtered.filter((r) =>
            r.channels.some((c) => filters.channel.includes(c as any))
          );
        }

        if (filters.status.length > 0) {
          filtered = filtered.filter((r) => filters.status.includes(r.status));
        }

        if (filters.dateFrom) {
          filtered = filtered.filter(
            (r) => new Date(r.effectiveFrom) >= new Date(filters.dateFrom)
          );
        }

        if (filters.dateTo) {
          filtered = filtered.filter(
            (r) => new Date(r.effectiveTo) <= new Date(filters.dateTo)
          );
        }

        if (filters.priceFrom || filters.priceTo) {
          filtered = filtered.filter(
            (r) => r.basePrice >= filters.priceFrom && r.basePrice <= filters.priceTo
          );
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.name.toLowerCase().includes(query) ||
              r.code.toLowerCase().includes(query) ||
              r.roomType.toLowerCase().includes(query)
          );
        }

        return filtered;
      },

      getEffectiveRate: (roomType, date, channel, occupancy = 70, lengthOfStay = 1, leadTime = 14) => {
        const applicableRates = get()
          .rates.filter(
            (r) =>
              r.roomType === roomType &&
              r.status === "Active" &&
              new Date(r.effectiveFrom) <= date &&
              new Date(r.effectiveTo) >= date &&
              (r.channels.includes(channel as any) || r.channels.includes("All"))
          )
          .sort((a, b) => b.priority - a.priority);

        if (applicableRates.length === 0) {
          return 0;
        }

        const baseRate = applicableRates[0];
        let finalPrice = baseRate.basePrice;
        const applicableRules = get().getApplicableRules(baseRate.id);

        for (const rule of applicableRules) {
          let shouldApply = true;

          if (rule.conditions && rule.conditions.length > 0) {
            shouldApply = rule.conditions.every((condition) => {
              switch (condition.type) {
                case "occupancy":
                  return condition.operator === "greater_than"
                    ? occupancy > (condition.value as number)
                    : occupancy < (condition.value as number);
                case "length_of_stay":
                  return condition.operator === "greater_than"
                    ? lengthOfStay > (condition.value as number)
                    : lengthOfStay < (condition.value as number);
                case "lead_time":
                  return condition.operator === "greater_than"
                    ? leadTime > (condition.value as number)
                    : leadTime < (condition.value as number);
                default:
                  return true;
              }
            });
          }

          if (shouldApply) {
            switch (rule.operator) {
              case "percentage_increase":
                finalPrice += finalPrice * (rule.value / 100);
                break;
              case "percentage_decrease":
                finalPrice -= finalPrice * (rule.value / 100);
                break;
              case "fixed_surcharge":
                finalPrice += rule.value;
                break;
              case "fixed_discount":
                finalPrice -= rule.value;
                break;
              case "multiplier":
                const multiplier = rule.channelMultipliers?.[channel as any] || 1;
                finalPrice *= multiplier;
                break;
            }
          }
        }

        return Math.max(0, Math.round(finalPrice * 100) / 100);
      },

      getApplicableRules: (rateId) => {
        const rate = get().rates.find((r) => r.id === rateId);
        if (!rate || !rate.rules) return [];

        return get()
          .rules.filter((r) => rate.rules?.includes(r.id))
          .sort((a, b) => a.priority - b.priority);
      },

      getRatesWithCalculations: (date, channel) => {
        const { rates } = get();
        const roomTypes = [...new Set(rates.map((r) => r.roomType))];

        return roomTypes.map((roomType) => {
          const rate = rates.find(
            (r) =>
              r.roomType === roomType &&
              new Date(r.effectiveFrom) <= date &&
              new Date(r.effectiveTo) >= date
          );

          if (!rate) {
            return {
              id: `${roomType}-${date}`,
              code: roomType,
              name: roomType,
              roomType,
              rateType: "Base",
              channels: [],
              effectiveFrom: date.toISOString().split("T")[0],
              effectiveTo: date.toISOString().split("T")[0],
              basePrice: 0,
              currency: "USD",
              priority: 0,
              status: "Expired" as const,
              createdBy: "",
              createdAt: "",
              updatedBy: "",
              updatedAt: "",
              calculatedPrice: 0,
              appliedRules: [],
            };
          }

          return {
            ...rate,
            calculatedPrice: get().getEffectiveRate(roomType, date, channel),
            appliedRules: get().getApplicableRules(rate.id).map((r) => r.name),
          };
        });
      },

      exportRatesCSV: () => {
        const rates = get().filterRates();

        const headers = [
          "Rate ID",
          "Code",
          "Name",
          "Room Type",
          "Rate Type",
          "Channels",
          "Effective From",
          "Effective To",
          "Base Price",
          "Currency",
          "Min Stay",
          "Max Stay",
          "Priority",
          "Status",
          "Notes",
        ];

        const rows = rates.map((rate) => [
          rate.id,
          rate.code,
          rate.name,
          rate.roomType,
          rate.rateType,
          rate.channels.join("; "),
          new Date(rate.effectiveFrom).toLocaleDateString(),
          new Date(rate.effectiveTo).toLocaleDateString(),
          rate.basePrice.toFixed(2),
          rate.currency,
          rate.minStay || "",
          rate.maxStay || "",
          rate.priority,
          rate.status,
          rate.notes || "",
        ]);

        const csvContent = [
          headers.join(","),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        return csvContent;
      },

      addAuditLog: (log) => {
        set((state) => ({
          auditLogs: [
            ...state.auditLogs,
            {
              id: `LOG-${Date.now()}`,
              ...log,
            },
          ],
        }));
      },
    }),
    {
      name: "rates-store",
    }
  )
);
