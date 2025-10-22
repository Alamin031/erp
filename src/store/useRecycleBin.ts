"use client";

import { create } from "zustand";
import {
  RecycledRecord,
  AuditLog,
  RetentionPolicy,
  FilterPreset,
  RecycleStats,
  ModuleType,
  RetentionStatusType,
  StorageType,
} from "@/types/recycle";

interface RecycleFilters {
  modules?: ModuleType[];
  dateRange?: { from: string; to: string };
  deletedBy?: string[];
  retentionStatus?: RetentionStatusType[];
  storageType?: StorageType[];
  keyword?: string;
  olderThanDays?: number;
}

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface SortParams {
  sortBy: "deletedAt" | "title" | "module";
  sortOrder: "asc" | "desc";
}

interface RecycleBinStore {
  records: RecycledRecord[];
  auditLogs: AuditLog[];
  policies: RetentionPolicy[];
  filterPresets: FilterPreset[];
  filters: RecycleFilters;
  pagination: PaginationParams;
  sort: SortParams;
  selectedRecordIds: string[];
  stats: RecycleStats;
  isLoading: boolean;

  // Setters
  setRecords: (records: RecycledRecord[]) => void;
  setAuditLogs: (logs: AuditLog[]) => void;
  setPolicies: (policies: RetentionPolicy[]) => void;
  setFilters: (filters: RecycleFilters) => void;
  setPagination: (page: number, pageSize: number) => void;
  setSort: (sortBy: SortParams["sortBy"], sortOrder: SortParams["sortOrder"]) => void;
  setSelectedRecordIds: (ids: string[]) => void;
  toggleRecordSelection: (id: string) => void;
  selectAll: (recordIds: string[]) => void;
  clearSelection: () => void;

  // Data loading
  loadDemoData: () => Promise<void>;

  // Actions
  restoreRecord: (id: string, note: string) => Promise<void>;
  archiveRecord: (id: string, target: string, note: string) => Promise<void>;
  deleteRecordPermanently: (id: string, note: string) => Promise<void>;
  bulkRestore: (ids: string[], note: string) => Promise<void>;
  bulkArchive: (ids: string[], target: string, note: string) => Promise<void>;
  bulkDelete: (ids: string[], note: string) => Promise<void>;
  placeHold: (id: string, reason: string) => Promise<void>;
  removeHold: (id: string) => Promise<void>;

  // Filtering & sorting
  getFilteredRecords: () => RecycledRecord[];
  getPagedRecords: () => RecycledRecord[];

  // Policy management
  updateRetentionPolicy: (policyId: string, policy: Partial<RetentionPolicy>) => Promise<void>;
  getRecordsEligibleForAction: (action: "archive" | "purge") => RecycledRecord[];

  // Filter presets
  saveFilterPreset: (name: string, userId: string) => void;
  loadFilterPreset: (presetId: string) => void;
  deleteFilterPreset: (presetId: string) => void;
}

const calculateStats = (records: RecycledRecord[]): RecycleStats => {
  return {
    totalDeleted: records.length,
    eligibleForPurge: records.filter((r) => r.retentionStatus === "eligible_for_purge").length,
    archived: records.filter((r) => r.currentStorage === "archived").length,
    restorable: records.filter((r) => !r.isProtected && r.retentionStatus !== "archived").length,
    totalStorageSize: records.reduce((sum, r) => sum + (r.size || 0), 0),
    protectedRecords: records.filter((r) => r.isProtected).length,
  };
};

export const useRecycleBin = create<RecycleBinStore>((set, get) => ({
  records: [],
  auditLogs: [],
  policies: [],
  filterPresets: [],
  filters: {},
  pagination: { page: 1, pageSize: 25 },
  sort: { sortBy: "deletedAt", sortOrder: "desc" },
  selectedRecordIds: [],
  stats: {
    totalDeleted: 0,
    eligibleForPurge: 0,
    archived: 0,
    restorable: 0,
    totalStorageSize: 0,
    protectedRecords: 0,
  },
  isLoading: false,

  setRecords: (records) => {
    set({
      records,
      stats: calculateStats(records),
    });
  },

  setAuditLogs: (logs) => set({ auditLogs: logs }),

  setPolicies: (policies) => set({ policies }),

  setFilters: (filters) => set({ filters, pagination: { page: 1, pageSize: 25 } }),

  setPagination: (page, pageSize) => set({ pagination: { page, pageSize } }),

  setSort: (sortBy, sortOrder) => set({ sort: { sortBy, sortOrder } }),

  setSelectedRecordIds: (ids) => set({ selectedRecordIds: ids }),

  toggleRecordSelection: (id) => {
    set((state) => ({
      selectedRecordIds: state.selectedRecordIds.includes(id)
        ? state.selectedRecordIds.filter((i) => i !== id)
        : [...state.selectedRecordIds, id],
    }));
  },

  selectAll: (recordIds) => set({ selectedRecordIds: recordIds }),

  clearSelection: () => set({ selectedRecordIds: [] }),

  loadDemoData: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/demo/demoRecycle.json");
      const data = await response.json();
      set({
        records: data.records || [],
        policies: data.policies || [],
        auditLogs: data.auditLogs || [],
        stats: calculateStats(data.records || []),
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load demo data:", error);
      set({ isLoading: false });
    }
  },

  restoreRecord: async (id, note) => {
    const record = get().records.find((r) => r.id === id);
    if (!record) return;

    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: "current-user",
          userName: "Current User",
          action: "restore",
          recordId: record.recordId,
          recordModule: record.module,
          details: `Restored ${record.module}: ${record.title}. Note: ${note}`,
          affectedRecordCount: 1,
        },
        ...state.auditLogs,
      ],
    }));

    set((state) => ({
      stats: calculateStats(state.records),
    }));
  },

  archiveRecord: async (id, target, note) => {
    const record = get().records.find((r) => r.id === id);
    if (!record) return;

    const updatedRecord = {
      ...record,
      currentStorage: "archived" as StorageType,
      archivedAt: new Date().toISOString(),
      archivedBy: "Current User",
      auditNotes: note,
    };

    set((state) => ({
      records: state.records.map((r) => (r.id === id ? updatedRecord : r)),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: "current-user",
          userName: "Current User",
          action: "archive",
          recordId: record.recordId,
          recordModule: record.module,
          details: `Archived to ${target}: ${record.title}. Note: ${note}`,
          affectedRecordCount: 1,
        },
        ...state.auditLogs,
      ],
    }));

    set((state) => ({
      stats: calculateStats(state.records),
    }));
  },

  deleteRecordPermanently: async (id, note) => {
    const record = get().records.find((r) => r.id === id);
    if (!record) return;

    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: "current-user",
          userName: "Current User",
          action: "delete",
          recordId: record.recordId,
          recordModule: record.module,
          details: `Permanently deleted ${record.module}: ${record.title}. Note: ${note}`,
          affectedRecordCount: 1,
        },
        ...state.auditLogs,
      ],
    }));

    set((state) => ({
      stats: calculateStats(state.records),
    }));
  },

  bulkRestore: async (ids, note) => {
    const recordsToRestore = get().records.filter((r) => ids.includes(r.id));
    set((state) => ({
      records: state.records.filter((r) => !ids.includes(r.id)),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: "current-user",
          userName: "Current User",
          action: "restore",
          details: `Bulk restored ${ids.length} records. Note: ${note}`,
          affectedRecordCount: ids.length,
        },
        ...state.auditLogs,
      ],
      selectedRecordIds: [],
    }));

    set((state) => ({
      stats: calculateStats(state.records),
    }));
  },

  bulkArchive: async (ids, target, note) => {
    set((state) => ({
      records: state.records.map((r) =>
        ids.includes(r.id)
          ? {
              ...r,
              currentStorage: "archived" as StorageType,
              archivedAt: new Date().toISOString(),
              archivedBy: "Current User",
              auditNotes: note,
            }
          : r
      ),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: "current-user",
          userName: "Current User",
          action: "archive",
          details: `Bulk archived ${ids.length} records to ${target}. Note: ${note}`,
          affectedRecordCount: ids.length,
        },
        ...state.auditLogs,
      ],
      selectedRecordIds: [],
    }));

    set((state) => ({
      stats: calculateStats(state.records),
    }));
  },

  bulkDelete: async (ids, note) => {
    set((state) => ({
      records: state.records.filter((r) => !ids.includes(r.id)),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: "current-user",
          userName: "Current User",
          action: "delete",
          details: `Bulk permanently deleted ${ids.length} records. Note: ${note}`,
          affectedRecordCount: ids.length,
        },
        ...state.auditLogs,
      ],
      selectedRecordIds: [],
    }));

    set((state) => ({
      stats: calculateStats(state.records),
    }));
  },

  placeHold: async (id, reason) => {
    set((state) => ({
      records: state.records.map((r) => (r.id === id ? { ...r, onHold: true } : r)),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: "current-user",
          userName: "Current User",
          action: "hold_placed",
          recordId: id,
          details: `Hold placed: ${reason}`,
        },
        ...state.auditLogs,
      ],
    }));
  },

  removeHold: async (id) => {
    set((state) => ({
      records: state.records.map((r) => (r.id === id ? { ...r, onHold: false } : r)),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: "current-user",
          userName: "Current User",
          action: "hold_removed",
          recordId: id,
          details: "Hold removed",
        },
        ...state.auditLogs,
      ],
    }));
  },

  getFilteredRecords: () => {
    const { records, filters } = get();
    let filtered = [...records];

    if (filters.modules && filters.modules.length > 0) {
      filtered = filtered.filter((r) => filters.modules!.includes(r.module));
    }

    if (filters.dateRange) {
      const from = new Date(filters.dateRange.from);
      const to = new Date(filters.dateRange.to);
      filtered = filtered.filter((r) => {
        const date = new Date(r.deletedAt);
        return date >= from && date <= to;
      });
    }

    if (filters.deletedBy && filters.deletedBy.length > 0) {
      filtered = filtered.filter((r) => filters.deletedBy!.includes(r.deletedBy));
    }

    if (filters.retentionStatus && filters.retentionStatus.length > 0) {
      filtered = filtered.filter((r) => filters.retentionStatus!.includes(r.retentionStatus));
    }

    if (filters.storageType && filters.storageType.length > 0) {
      filtered = filtered.filter((r) => filters.storageType!.includes(r.currentStorage));
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(kw) ||
          r.recordId.toLowerCase().includes(kw) ||
          r.module.toLowerCase().includes(kw)
      );
    }

    if (filters.olderThanDays) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - filters.olderThanDays);
      filtered = filtered.filter((r) => new Date(r.deletedAt) < cutoff);
    }

    // Apply sorting
    const { sort } = get();
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sort.sortBy === "deletedAt") {
        comparison = new Date(a.deletedAt).getTime() - new Date(b.deletedAt).getTime();
      } else if (sort.sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sort.sortBy === "module") {
        comparison = a.module.localeCompare(b.module);
      }

      return sort.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  },

  getPagedRecords: () => {
    const filtered = get().getFilteredRecords();
    const { pagination } = get();
    const start = (pagination.page - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  },

  updateRetentionPolicy: async (policyId, policy) => {
    set((state) => ({
      policies: state.policies.map((p) =>
        p.id === policyId ? { ...p, ...policy, updatedAt: new Date().toISOString() } : p
      ),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: "current-user",
          userName: "Current User",
          action: "policy_change",
          details: `Updated retention policy: ${policyId}`,
        },
        ...state.auditLogs,
      ],
    }));
  },

  getRecordsEligibleForAction: (action) => {
    const records = get().records;
    if (action === "archive") {
      return records.filter(
        (r) => r.currentStorage === "active" && !r.onHold && !r.isProtected
      );
    } else if (action === "purge") {
      return records.filter((r) => r.retentionStatus === "eligible_for_purge" && !r.onHold);
    }
    return [];
  },

  saveFilterPreset: (name, userId) => {
    const { filters } = get();
    const preset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      userId,
      filters,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      filterPresets: [...state.filterPresets, preset],
    }));
  },

  loadFilterPreset: (presetId) => {
    const preset = get().filterPresets.find((p) => p.id === presetId);
    if (preset) {
      set({ filters: preset.filters, pagination: { page: 1, pageSize: 25 } });
    }
  },

  deleteFilterPreset: (presetId) => {
    set((state) => ({
      filterPresets: state.filterPresets.filter((p) => p.id !== presetId),
    }));
  },
}));
