"use client";

import { useEffect, useMemo, useState } from "react";
import { useBillsStore } from "@/store/useBillsStore";
import { Bill, BillStatus } from "@/types/bills";
import { ToastContainer, useToast } from "@/components/toast";
import { BillSummaryCards } from "@/components/bill-summary-cards";
import { BillsFilterBar } from "@/components/bills-filter-bar";
import { UploadBillDrawer } from "@/components/upload-bill-drawer";
import { BillsTable } from "@/components/bills-table";
import { AddEditBillModal } from "@/components/bills-modal";
import { BillAnalyticsChart } from "@/components/bill-analytics-chart";
import { RecentTransactions } from "@/components/recent-transactions";
import { VendorList } from "@/components/vendor-list";
import { BillDetailsModal } from "@/components/BillDetailsModal";

export function BillsPageClient() {
  const { bills, vendors, filters, setFilters, loadDemoData, addBill, updateBill, deleteBill, markAsPaid, filterBills, getBillStats } = useBillsStore();
  const { toasts, removeToast, showToast } = useToast();

  const [showUpload, setShowUpload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Bill | null>(null);
  const [viewing, setViewing] = useState<Bill | null>(null);

  useEffect(() => {
    if (bills.length === 0) {
      loadDemoData().catch(() => showToast("Failed to load demo data", "error"));
    }
  }, [bills.length, loadDemoData, showToast]);

  const visible = useMemo(() => filterBills(), [filters, bills, filterBills]);
  const stats = useMemo(() => getBillStats(), [bills, getBillStats]);

  const handleSaveQuick = (payload: { vendorName: string; billNumber: string; amount: number; attachments: string[] }) => {
    const now = new Date().toISOString();
    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      billNumber: payload.billNumber || `BILL-${Date.now()}`,
      vendorName: payload.vendorName,
      billDate: now,
      dueDate: new Date(Date.now() + 14*24*60*60*1000).toISOString(),
      amount: payload.amount,
      status: "Pending",
      attachments: payload.attachments,
      lineItems: [],
      createdAt: now,
      updatedAt: now,
    };
    addBill(newBill);
    showToast("Bill uploaded", "success");
  };

  const handleEditSave = (bill: Bill) => {
    const exists = bills.find((b) => b.id === bill.id);
    if (exists) {
      updateBill(bill.id, bill);
      showToast("Bill updated", "success");
    } else {
      addBill(bill);
      showToast("Bill created", "success");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this bill?")) {
      deleteBill(id);
      showToast("Bill deleted", "success");
    }
  };

  const markPaid = (id: string) => {
    markAsPaid(id, "Bank Transfer", `REF-${Math.floor(Math.random()*1e6)}`);
    showToast("Marked as paid", "success");
  };

  const onDownload = (bill: Bill) => {
    showToast("Download started", "success");
  };

  const onReminder = (bill: Bill) => {
    showToast(`Reminder sent to ${bill.vendorName}`, "success");
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
        <p className="text-gray-500">Manage and track supplier bills and vendor invoices</p>
      </div>

      <BillSummaryCards totalBills={stats.totalBills} totalPaid={stats.totalPaid} totalPending={stats.totalPending} overdueBills={stats.overdueBills} />

      <BillsFilterBar bills={bills} filters={filters} onChange={setFilters} onUploadClick={() => setShowUpload(true)} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        <div className="xl:col-span-2">
          <BillsTable
            bills={visible}
            onView={(b) => setViewing(b)}
            onEdit={(b) => { setEditing(b); setShowModal(true); }}
            onDelete={handleDelete}
            filters={{ vendor: filters.vendor, status: filters.status as BillStatus }}
            onFilterChange={(f) => setFilters({ ...filters, ...f })}
          />
        </div>
        <div className="space-y-5">
          <BillAnalyticsChart bills={bills} />
          <RecentTransactions bills={bills} />
          <VendorList vendors={vendors} />
        </div>
      </div>

      <UploadBillDrawer open={showUpload} onClose={() => setShowUpload(false)} onSave={handleSaveQuick} />

      <AddEditBillModal isOpen={showModal} onClose={() => { setShowModal(false); setEditing(null); }} bill={editing} onSave={handleEditSave} />

      <BillDetailsModal open={!!viewing} bill={viewing} onClose={() => setViewing(null)} onMarkPaid={markPaid} onReminder={onReminder} onDownload={onDownload} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
