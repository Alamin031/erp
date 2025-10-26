"use client";

import { create } from "zustand";
import { nanoid } from "./utils";
import type { Transaction, Vendor, VatReturn, VatReturnInput, FilingInfo } from "@/types/vat";
import { csvExportReturn, pdfExportReturn } from "@/lib/vatExport";

interface Filters { query?: string; status?: string; dateFrom?: string; dateTo?: string }

interface VatState {
  vatRate: number;
  vatReturns: VatReturn[];
  transactions: Transaction[];
  vendors: Vendor[];
  selectedReturnId: string | null;
  filters: Filters;
  loading: boolean;
  error: string | null;
  // actions
  setSelectedReturn: (id: string | null) => void;
  loadDemoData: () => Promise<void>;
  createReturn: (payload: VatReturnInput) => void;
  updateReturn: (id: string, payload: VatReturnInput) => void;
  deleteReturn: (id: string) => void;
  markReady: (id: string) => void;
  markFiled: (id: string, filing: FilingInfo) => void;
  importTransactions: (rows: Partial<Transaction>[]) => void;
  matchTransaction: (txId: string) => void;
  autoReconcile: (returnId: string) => void;
  exportReturn: (id: string, format: "csv" | "pdf") => void;
}

export const useVat = create<VatState>((set, get) => ({
  vatRate: 0.2,
  vatReturns: [],
  transactions: [],
  vendors: [],
  selectedReturnId: null,
  filters: {},
  loading: false,
  error: null,

  setSelectedReturn: (id) => set({ selectedReturnId: id }),

  loadDemoData: async () => {
    try {
      set({ loading: true });
      const [returnsRes, txRes, vendorsRes] = await Promise.all([
        fetch("/data/demoVatReturns.json"),
        fetch("/data/demoTransactions.json"),
        fetch("/data/vendors.json"),
      ]);
      const [returns, txs, vendors] = await Promise.all([
        returnsRes.json(), txRes.json(), vendorsRes.json(),
      ]);
      set({ vatReturns: returns, transactions: txs, vendors, loading: false });
    } catch (e) {
      set({ loading: false, error: "Failed to load demo data" });
    }
  },

  createReturn: (payload) => {
    const id = nanoid();
    const now = new Date().toISOString();
    const vr: VatReturn = {
      id,
      status: "Draft",
      attachments: [],
      versions: [{ id: nanoid(), timestamp: now, snapshot: payload }],
      activity: [{ id: nanoid(), at: now, type: "create", message: "Return created" }],
      ...payload,
    };
    set({ vatReturns: [vr, ...get().vatReturns], selectedReturnId: id });
  },

  updateReturn: (id, payload) => {
    const now = new Date().toISOString();
    set({
      vatReturns: get().vatReturns.map(r => r.id === id ? {
        ...r,
        ...payload,
        versions: [...r.versions, { id: nanoid(), timestamp: now, snapshot: payload }],
        activity: [...r.activity, { id: nanoid(), at: now, type: "update", message: "Return updated" }],
      } : r)
    });
  },

  deleteReturn: (id) => {
    set({ vatReturns: get().vatReturns.filter(r => r.id !== id) });
  },

  markReady: (id) => {
    const now = new Date().toISOString();
    set({ vatReturns: get().vatReturns.map(r => r.id === id ? { ...r, status: "Ready", activity: [...r.activity, { id: nanoid(), at: now, type: "status", message: "Marked Ready" }] } : r) });
  },

  markFiled: (id, filing) => {
    const now = new Date().toISOString();
    set({ vatReturns: get().vatReturns.map(r => r.id === id ? { ...r, status: "Filed", activity: [...r.activity, { id: nanoid(), at: now, type: "filed", message: `Filed ${filing.reference || ''}` }] } : r) });
  },

  importTransactions: (rows) => {
    const existing = get().transactions;
    const mapped: Transaction[] = rows.map((r) => ({
      id: nanoid(),
      date: r.date || new Date().toISOString(),
      type: (r.type as any) || "Sale",
      vendorId: undefined,
      invoiceNumber: r.invoiceNumber || "",
      amount: Number(r.amount) || 0,
      vatAmount: Number(r.vatAmount) || 0,
      category: r.category || "",
      vatCategory: (r.vatCategory as any) || "VATable",
      matched: false,
    }));
    set({ transactions: [...mapped, ...existing] });
  },

  matchTransaction: (txId) => {
    set({ transactions: get().transactions.map(t => t.id === txId ? { ...t, matched: true } : t) });
  },

  autoReconcile: (returnId) => {
    const ret = get().vatReturns.find(r => r.id === returnId);
    if (!ret) return;
    const start = new Date(ret.periodStart).getTime();
    const end = new Date(ret.periodEnd).getTime();
    set({ transactions: get().transactions.map(t => {
      const ts = new Date(t.date).getTime();
      if (ts >= start && ts <= end && !t.matched) {
        return { ...t, matched: true };
      }
      return t;
    }) });
  },

  exportReturn: (id, format) => {
    const r = get().vatReturns.find(v => v.id === id);
    if (!r) return;
    const blob = format === "csv" ? csvExportReturn(r) : pdfExportReturn(r);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vat-return-${id}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
}));

// tiny id util (avoid extra deps)
export function ensureId(len = 10) { return Math.random().toString(36).slice(2, 2 + len); }
