"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Equipment, EquipmentHistoryEntry, Supplier } from "@/types/equipment";

interface Filters {
  category: string | "All";
  location: string | "All";
  status: Equipment["status"] | "All";
  supplierId: string | "All";
  warrantyWindow: "All" | "30" | "90";
  lowStockOnly?: boolean;
}

interface Pagination { page: number; pageSize: number }

interface EquipmentStore {
  equipment: Equipment[];
  history: EquipmentHistoryEntry[];
  suppliers: Supplier[];
  filters: Filters;
  searchQuery: string;
  pagination: Pagination;
  selectedEquipmentId: string | null;

  // Setters
  setEquipment: (items: Equipment[]) => void;
  setHistory: (items: EquipmentHistoryEntry[]) => void;
  setSuppliers: (items: Supplier[]) => void;
  setFilters: (f: Filters) => void;
  setSearchQuery: (q: string) => void;
  setPagination: (page: number, pageSize: number) => void;
  setSelectedEquipmentId: (id: string | null) => void;

  // Actions
  loadDemoData: () => Promise<void>;
  addEquipment: (payload: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => void;
  updateEquipment: (id: string, payload: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  adjustStock: (id: string, delta: number, reason: string, user?: string) => void;
  assignEquipment: (id: string, assignee: string, user?: string) => void;
  linkWorkOrder: (id: string, workOrderId: string, user?: string) => void;
  markRetired: (id: string, details?: string, user?: string) => void;

  // Selectors
  filterEquipment: () => Equipment[];
  getLowStockItems: () => Equipment[];
}

export const useEquipment = create<EquipmentStore>()(
  persist(
    (set, get) => ({
      equipment: [],
      history: [],
      suppliers: [],
      filters: { category: "All", location: "All", status: "All", supplierId: "All", warrantyWindow: "All", lowStockOnly: false },
      searchQuery: "",
      pagination: { page: 1, pageSize: 12 },
      selectedEquipmentId: null,

      setEquipment: (items) => set({ equipment: items }),
      setHistory: (items) => set({ history: items }),
      setSuppliers: (items) => set({ suppliers: items }),
      setFilters: (f) => set({ filters: f }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setPagination: (page, pageSize) => set({ pagination: { page, pageSize } }),
      setSelectedEquipmentId: (id) => set({ selectedEquipmentId: id }),

      loadDemoData: async () => {
        const [eq, h, s] = await Promise.all([
          fetch("/demo/demoEquipment.json").then(r=>r.json()).catch(()=>[]),
          fetch("/demo/equipmentHistory.json").then(r=>r.json()).catch(()=>[]),
          fetch("/demo/suppliers.json").then(r=>r.json()).catch(()=>[]),
        ]);
        set({ equipment: eq, history: h, suppliers: s });
      },

      addEquipment: (payload) => {
        const id = `EQ-${Date.now()}`;
        const now = new Date().toISOString();
        const sku = payload.sku && payload.sku.trim() ? payload.sku : id;
        const item: Equipment = { ...payload, id, sku, createdAt: now, updatedAt: now } as Equipment;
        // Prevent duplicate serial numbers
        if (item.serialNumber && get().equipment.some(e => e.serialNumber === item.serialNumber)) {
          throw new Error("Duplicate serial number");
        }
        set(state => ({ equipment: [item, ...state.equipment], history: [
          { id: `h-${Date.now()}`, equipmentId: id, timestamp: now, type: "create", user: "System", details: "Equipment added" },
          ...state.history,
        ] }));
      },

      updateEquipment: (id, payload) => {
        const now = new Date().toISOString();
        set(state => ({
          equipment: state.equipment.map(e => e.id === id ? { ...e, ...payload, updatedAt: now } : e),
          history: [ { id: `h-${Date.now()}`, equipmentId: id, timestamp: now, type: "update", user: "System", details: "Equipment updated" }, ...state.history ],
        }));
      },

      deleteEquipment: (id) => {
        const now = new Date().toISOString();
        set(state => ({ equipment: state.equipment.filter(e => e.id !== id), history: [ { id: `h-${Date.now()}`, equipmentId: id, timestamp: now, type: "update", user: "System", details: "Equipment deleted" }, ...state.history ] }));
      },

      adjustStock: (id, delta, reason, user="System") => {
        set(state => ({
          equipment: state.equipment.map(e => e.id === id ? { ...e, quantity: Math.max(0, e.quantity + delta) } : e),
          history: [
            { id: `h-${Date.now()}`, equipmentId: id, timestamp: new Date().toISOString(), type: "adjust", user, details: `Stock ${delta>=0?"increased":"decreased"} by ${Math.abs(delta)} (${reason})` },
            ...state.history,
          ],
        }));
      },

      assignEquipment: (id, assignee, user="System") => {
        set(state => ({
          equipment: state.equipment.map(e => e.id === id ? { ...e, assignedTo: assignee, status: "In Use" } : e),
          history: [ { id: `h-${Date.now()}`, equipmentId: id, timestamp: new Date().toISOString(), type: "assign", user, details: `Assigned to ${assignee}` }, ...state.history ],
        }));
      },

      linkWorkOrder: (id, workOrderId, user="System") => {
        set(state => ({
          equipment: state.equipment.map(e => e.id === id ? { ...e, linkedWorkOrderIds: Array.from(new Set([...(e.linkedWorkOrderIds||[]), workOrderId])) } : e),
          history: [ { id: `h-${Date.now()}`, equipmentId: id, timestamp: new Date().toISOString(), type: "link-wo", user, details: `Linked WO ${workOrderId}` }, ...state.history ],
        }));
      },

      markRetired: (id, details="Retired", user="System") => {
        set(state => ({
          equipment: state.equipment.map(e => e.id === id ? { ...e, status: "Retired" } : e),
          history: [ { id: `h-${Date.now()}`, equipmentId: id, timestamp: new Date().toISOString(), type: "retire", user, details }, ...state.history ],
        }));
      },

      filterEquipment: () => {
        const { equipment, filters, searchQuery } = get();
        let list = [...equipment];
        if (filters.category !== "All") list = list.filter(e => e.category === filters.category);
        if (filters.location !== "All") list = list.filter(e => e.location === filters.location);
        if (filters.status !== "All") list = list.filter(e => e.status === filters.status);
        if (filters.supplierId !== "All") list = list.filter(e => e.supplierId === filters.supplierId);
        if (filters.warrantyWindow !== "All") {
          const days = Number(filters.warrantyWindow);
          const cutoff = new Date(Date.now() + days*24*60*60*1000);
          list = list.filter(e => e.warrantyExpiry && new Date(e.warrantyExpiry) <= cutoff);
        }
        if (filters.lowStockOnly) list = list.filter(e => e.quantity <= e.minStock);
        const q = searchQuery.toLowerCase().trim();
        if (q) {
          list = list.filter(e =>
            e.name.toLowerCase().includes(q) ||
            (e.sku||"").toLowerCase().includes(q) ||
            (e.serialNumber||"").toLowerCase().includes(q) ||
            (e.category||"").toLowerCase().includes(q)
          );
        }
        return list;
      },

      getLowStockItems: () => {
        return get().equipment.filter(e => e.quantity <= e.minStock);
      },
    }),
    { name: "equipment-store" }
  )
);
