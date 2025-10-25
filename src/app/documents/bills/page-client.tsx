"use client";

import { useEffect, useMemo, useState } from "react";
import { useBillsStore } from "@/store/useBillsStore";
import { Bill } from "@/types/bills";
import { BillsTable } from "@/components/Bills/BillsTable";
import { BillDetailsDrawer } from "@/components/Bills/BillDetailsDrawer";
import { BillModal, type BillFormInput } from "@/components/Bills/BillModal";
import { BillsStatsCards } from "@/components/Bills/BillsStatsCards";
import { BillsCharts } from "@/components/Bills/BillsCharts";
import { useToast, ToastContainer } from "@/components/toast";
import { Plus, FileDown, FileSpreadsheet, Filter } from "lucide-react";

export function BillsPageClient() {
  const { bills, loading, loadDemoData, filterBills, setFilters, filters, addBill, updateBill, deleteBill, markAsPaid, getVendors } = useBillsStore();
  const { showToast, toasts, removeToast } = useToast();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "paid" | "analytics">("all");
  const [selected, setSelected] = useState<Bill | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Bill | null>(null);

  const [bulk, setBulk] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (bills.length === 0) {
      loadDemoData().catch(() => showToast("Failed to load bills", "error"));
    }
  }, [bills.length, loadDemoData, showToast]);

  const all = filterBills();
  const pending = useMemo(() => all.filter((b) => b.status !== "Paid"), [all]);
  const paid = useMemo(() => all.filter((b) => b.status === "Paid"), [all]);

  const handleAdd = () => { setEditing(null); setShowModal(true); };

  const handleSave = async (input: BillFormInput & { attachmentFile?: File | null }) => {
    try {
      if (editing) {
        let attach = editing.attachment;
        if (input.attachmentFile) {
          const dataUrl = await fileToDataUrl(input.attachmentFile);
          attach = { name: input.attachmentFile.name, type: input.attachmentFile.type, dataUrl };
        }
        updateBill(editing.id, { ...input, attachment: attach });
        showToast("Bill updated", "success");
      } else {
        let attachment = undefined as any;
        if (input.attachmentFile) {
          const dataUrl = await fileToDataUrl(input.attachmentFile);
          attachment = { name: input.attachmentFile.name, type: input.attachmentFile.type, dataUrl };
        }
        addBill({ ...input, attachment, vendorId: `v-${Date.now()}`, paidAmount: 0, balance: input.amount } as any);
        showToast("Bill added", "success");
      }
      setShowModal(false);
    } catch {
      showToast("Failed to save bill", "error");
    }
  };

  const exportCSV = () => {
    const headers = ["Bill ID", "Vendor", "Bill Date", "Due Date", "Amount", "Paid", "Balance", "Status"];
    const rows = all.map((b) => [b.billNumber, b.vendorName, new Date(b.billDate).toLocaleDateString(), new Date(b.dueDate).toLocaleDateString(), b.amount.toFixed(2), b.paidAmount.toFixed(2), b.balance.toFixed(2), b.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bills.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = all
      .map((b) => `<tr><td>${b.billNumber}</td><td>${b.vendorName}</td><td>${new Date(b.billDate).toLocaleDateString()}</td><td>${new Date(b.dueDate).toLocaleDateString()}</td><td>$${b.amount.toFixed(2)}</td><td>${b.status}</td></tr>`) 
      .join("");
    w.document.write(`<!DOCTYPE html><html><head><title>Bills</title><style>table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f5f5f5}</style></head><body><h3>Bills</h3><table><thead><tr><th>Bill ID</th><th>Vendor</th><th>Bill Date</th><th>Due Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  const markSelectedPaid = () => {
    bulk.forEach((id) => markAsPaid(id));
    setBulk(new Set());
    showToast("Selected bills marked as paid", "success");
  };

  const vendors = getVendors();

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Bills Management</h2>
          <div style={{ color: 'var(--secondary)' }}>Manage and track supplier bills and vendor invoices.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={exportPDF} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileDown size={16}/> Export PDF</button>
          <button className="btn btn-secondary" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileSpreadsheet size={16}/> Export Excel</button>
          <button className="btn btn-primary" onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Plus size={16}/> Add Bill</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, border: '1px solid var(--border)', borderRadius: 12, marginBottom: 16 }}>
        <Filter size={16} />
        <input value={filters.dateFrom} onChange={(e) => setFilters({ dateFrom: e.target.value })} type="date" className="form-input" />
        <input value={filters.dateTo} onChange={(e) => setFilters({ dateTo: e.target.value })} type="date" className="form-input" />
        <div style={{ position: 'relative' }}>
          <input list="vendors" value={filters.vendor} onChange={(e) => setFilters({ vendor: e.target.value })} className="form-input" placeholder="Vendor" />
          <datalist id="vendors">
            {vendors.map((v) => <option key={v} value={v} />)}
          </datalist>
        </div>
        <select value={filters.status} onChange={(e) => setFilters({ status: e.target.value as any })} className="form-input">
          <option value="">All Status</option>
          <option>Pending</option>
          <option>Paid</option>
          <option>Overdue</option>
          <option>Partial</option>
        </select>
        <input value={filters.search} onChange={(e) => setFilters({ search: e.target.value })} placeholder="Search vendor, bill, notes" className="form-input" />
        <button className="btn btn-secondary" onClick={() => setFilters({ vendor: "", status: "", dateFrom: "", dateTo: "", search: "" })}>Reset</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {(["all", "pending", "paid", "analytics"] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '8px 12px', borderRadius: 8, border: activeTab === t ? 'none' : '1px solid var(--border)', background: activeTab === t ? 'var(--primary)' : 'transparent', color: activeTab === t ? '#fff' : 'var(--foreground)', fontWeight: 700, textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 80, border: '1px solid var(--border)', borderRadius: 8, background: 'linear-gradient(90deg, var(--background), #f1f1f1, var(--background))', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          ))}
        </div>
      ) : activeTab === "all" ? (
        <BillsTable bills={all} onView={setSelected} onEdit={(b) => { setEditing(b); setShowModal(true); }} onDelete={(b) => { if (confirm('Delete bill?')) { deleteBill(b.id); showToast('Bill deleted', 'success'); } }} />
      ) : activeTab === "pending" ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700 }}>Unpaid Bills</div>
            <button className="btn btn-primary" disabled={bulk.size === 0} onClick={markSelectedPaid}>Mark as Paid</button>
          </div>
          <BillsTable bills={pending} selectable selectedIds={bulk} onToggleSelect={(id) => setBulk((s) => { const ns = new Set(s); ns.has(id) ? ns.delete(id) : ns.add(id); return ns; })} onSelectAll={(checked) => setBulk(checked ? new Set(pending.map((b) => b.id)) : new Set())} onView={setSelected} onEdit={(b) => { setEditing(b); setShowModal(true); }} onDelete={(b) => { if (confirm('Delete bill?')) { deleteBill(b.id); showToast('Bill deleted', 'success'); } }} />
        </div>
      ) : activeTab === "paid" ? (
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
                  {['Bill ID','Vendor','Paid Date','Amount','Payment Mode','Reference'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textTransform: 'uppercase', fontSize: 12, color: 'var(--secondary)', textAlign: h==='Amount' ? 'right':'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paid.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>{b.billNumber}</td>
                    <td style={{ padding: '12px 16px' }}>{b.vendorName}</td>
                    <td style={{ padding: '12px 16px' }}>{b.paidDate ? new Date(b.paidDate).toLocaleDateString() : '-'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>${b.amount.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>{b.paymentMode || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{b.paymentReference || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          <BillsStatsCards bills={all} />
          <BillsCharts bills={all} />
        </div>
      )}

      <BillDetailsDrawer bill={selected} onClose={() => setSelected(null)} onMarkAsPaid={(b) => { markAsPaid(b.id); setSelected(null); showToast('Bill marked as paid', 'success'); }} onDownload={(b) => { if (b.attachment) { const a = document.createElement('a'); a.href = b.attachment.dataUrl; a.download = b.attachment.name; a.click(); } else { showToast('No attachment', 'warning'); } }} onSendToAccounting={() => showToast('Sent to accounting', 'success')} />

      <BillModal open={showModal} initial={editing} onClose={() => setShowModal(false)} onSave={handleSave} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
