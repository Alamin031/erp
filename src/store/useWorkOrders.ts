"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WorkOrder, Technician, Asset, WorkOrderStatus, WorkOrderPriority } from "@/types/workorder";

interface Filters {
  status: WorkOrderStatus | "All";
  priority: WorkOrderPriority | "All";
  assetType: Asset["type"] | "All";
  technician: string | "All"; // techId
  dateFrom?: string;
  dateTo?: string;
  overdueOnly?: boolean;
}

interface Pagination { page: number; pageSize: number }

interface WorkOrdersStore {
  workOrders: WorkOrder[];
  technicians: Technician[];
  assets: Asset[];
  filters: Filters;
  pagination: Pagination;
  selectedWorkOrderId: string | null;

  setWorkOrders: (items: WorkOrder[]) => void;
  setTechnicians: (items: Technician[]) => void;
  setAssets: (items: Asset[]) => void;
  setFilters: (f: Filters) => void;
  setPagination: (page: number, pageSize: number) => void;
  setSelectedWorkOrderId: (id: string | null) => void;

  loadDemoData: () => Promise<void>;
  createWorkOrder: (payload: Omit<WorkOrder, "id" | "createdAt" | "logs" | "comments" | "status">) => void;
  updateWorkOrder: (id: string, payload: Partial<WorkOrder>) => void;
  assignTechnician: (id: string, techId: string) => void;
  startWorkOrder: (id: string) => void;
  pauseWorkOrder: (id: string) => void;
  completeWorkOrder: (id: string, details?: { note?: string }) => void;
  addComment: (id: string, comment: { author: string; message: string }) => void;
  bulkAssign: (ids: string[], techId: string) => void;
  filterWorkOrders: () => WorkOrder[];
  getOverdue: () => WorkOrder[];
}

export const useWorkOrders = create<WorkOrdersStore>()(
  persist(
    (set, get) => ({
      workOrders: [],
      technicians: [],
      assets: [],
      filters: { status: "All", priority: "All", assetType: "All", technician: "All", overdueOnly: false },
      pagination: { page: 1, pageSize: 10 },
      selectedWorkOrderId: null,

      setWorkOrders: (items) => set({ workOrders: items }),
      setTechnicians: (items) => set({ technicians: items }),
      setAssets: (items) => set({ assets: items }),
      setFilters: (f) => set({ filters: f }),
      setPagination: (page, pageSize) => set({ pagination: { page, pageSize } }),
      setSelectedWorkOrderId: (id) => set({ selectedWorkOrderId: id }),

      loadDemoData: async () => {
        const [wo, techs, assets] = await Promise.all([
          fetch("/demo/demoWorkOrders.json").then(r => r.json()).catch(() => []),
          fetch("/demo/technicians.json").then(r => r.json()).catch(() => []),
          fetch("/demo/assets.json").then(r => r.json()).catch(() => []),
        ]);
        set({ workOrders: wo, technicians: techs, assets });
      },

      createWorkOrder: (payload) => {
        const id = `WO-${Date.now()}`;
        const tech = get().technicians.find(t => t.id === payload.assignedTechId);
        const now = new Date().toISOString();
        const wo: WorkOrder = {
          id,
          title: payload.title,
          description: payload.description,
          assetId: payload.assetId,
          assetName: payload.assetName,
          assetType: payload.assetType,
          requestedBy: payload.requestedBy,
          priority: payload.priority,
          createdAt: now,
          dueAt: payload.dueAt,
          assignedTechId: payload.assignedTechId,
          assignedTechName: tech?.name,
          status: "Open",
          attachments: payload.attachments || [],
          comments: [],
          logs: [
            { id: "log-1", timestamp: now, message: "Work order created", actor: "System" },
          ],
        };
        set(state => ({ workOrders: [wo, ...state.workOrders] }));
      },

      updateWorkOrder: (id, payload) => {
        set(state => ({
          workOrders: state.workOrders.map(w => w.id === id ? { ...w, ...payload, logs: [
            ...w.logs,
            { id: `log-${w.logs.length + 1}` , timestamp: new Date().toISOString(), message: "Work order updated", actor: "System"},
          ] } : w),
        }));
      },

      assignTechnician: (id, techId) => {
        const tech = get().technicians.find(t => t.id === techId);
        set(state => ({
          workOrders: state.workOrders.map(w => w.id === id ? { ...w, assignedTechId: techId, assignedTechName: tech?.name, logs: [
            ...w.logs,
            { id: `log-${w.logs.length + 1}` , timestamp: new Date().toISOString(), message: `Assigned to ${tech?.name || techId}` , actor: "System"},
          ] } : w),
        }));
      },

      startWorkOrder: (id) => {
        set(state => ({
          workOrders: state.workOrders.map(w => w.id === id ? { ...w, status: "In Progress", startedAt: new Date().toISOString(), logs: [
            ...w.logs,
            { id: `log-${w.logs.length + 1}`, timestamp: new Date().toISOString(), message: "Started", actor: "System"},
          ] } : w),
        }));
      },

      pauseWorkOrder: (id) => {
        set(state => ({
          workOrders: state.workOrders.map(w => w.id === id ? { ...w, status: "Paused", logs: [
            ...w.logs,
            { id: `log-${w.logs.length + 1}`, timestamp: new Date().toISOString(), message: "Paused", actor: "System"},
          ] } : w),
        }));
      },

      completeWorkOrder: (id, details) => {
        set(state => ({
          workOrders: state.workOrders.map(w => w.id === id ? { ...w, status: "Completed", completedAt: new Date().toISOString(), logs: [
            ...w.logs,
            { id: `log-${w.logs.length + 1}`, timestamp: new Date().toISOString(), message: `Completed${details?.note ? `: ${details.note}` : ""}` , actor: "System"},
          ] } : w),
        }));
      },

      addComment: (id, comment) => {
        set(state => ({
          workOrders: state.workOrders.map(w => w.id === id ? { ...w, comments: [
            ...w.comments,
            { id: `c-${w.comments.length + 1}`, timestamp: new Date().toISOString(), author: comment.author, message: comment.message },
          ], logs: [
            ...w.logs,
            { id: `log-${w.logs.length + 1}`, timestamp: new Date().toISOString(), message: `Comment added by ${comment.author}`, actor: comment.author },
          ] } : w),
        }));
      },

      bulkAssign: (ids, techId) => {
        const tech = get().technicians.find(t => t.id === techId);
        set(state => ({
          workOrders: state.workOrders.map(w => ids.includes(w.id) ? { ...w, assignedTechId: techId, assignedTechName: tech?.name, logs: [
            ...w.logs,
            { id: `log-${w.logs.length + 1}`, timestamp: new Date().toISOString(), message: `Bulk assigned to ${tech?.name || techId}`, actor: "System" },
          ] } : w),
        }));
      },

      filterWorkOrders: () => {
        const { workOrders, filters } = get();
        let list = [...workOrders];
        if (filters.status !== "All") list = list.filter(w => w.status === filters.status);
        if (filters.priority !== "All") list = list.filter(w => w.priority === filters.priority);
        if (filters.assetType !== "All") list = list.filter(w => w.assetType === filters.assetType);
        if (filters.technician !== "All") list = list.filter(w => w.assignedTechId === filters.technician);
        if (filters.dateFrom) list = list.filter(w => new Date(w.createdAt) >= new Date(filters.dateFrom!));
        if (filters.dateTo) list = list.filter(w => new Date(w.createdAt) <= new Date(filters.dateTo!));
        if (filters.overdueOnly) list = list.filter(w => !!w.dueAt && new Date(w.dueAt) < new Date() && w.status !== "Completed");
        return list;
      },

      getOverdue: () => {
        return get().workOrders.filter(w => !!w.dueAt && new Date(w.dueAt) < new Date() && w.status !== "Completed");
      },
    }),
    { name: "workorders-store" }
  )
);
