"use client";

import { useEffect, useState } from "react";
import { useExpenses } from "@/store/useExpenses";
import { ExpensesTable } from "@/components/ExpensesTable";
import { ExpenseFormModal } from "@/components/ExpenseFormModal";
import { ExpenseDetailsDrawer } from "@/components/ExpenseDetailsDrawer";
import { ApprovalsQueue } from "@/components/ApprovalsQueue";
import { ExpenseFiltersBar } from "@/components/ExpenseFiltersBar";
import { UploadReceipt } from "@/components/UploadReceipt";
import { ReimbursementForm } from "@/components/ReimbursementForm";
import { ExpenseAnalyticsChart } from "@/components/ExpenseAnalyticsChart";
import { BulkImport } from "@/components/BulkImport";
import { CSVExportButton } from "@/components/CSVExportButton";
import { ToastContainer, useToast } from "@/components/toast";

export function ExpensesPageClient() {
  const { expenses, loadDemoData, createExpense, updateExpense, deleteExpense, filterExpenses, getAnalytics, categories } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [viewing, setViewing] = useState<any>(null);
  const [showReimburse, setShowReimburse] = useState(false);
  const { toasts, removeToast, showToast } = useToast();

  useEffect(() => { if (expenses.length === 0) loadDemoData().catch(()=>showToast('Failed to load demo', 'error')); }, [expenses.length, loadDemoData, showToast]);

  const handleSave = (data: any) => {
    createExpense(data);
    showToast('Expense submitted', 'success');
    setShowForm(false);
  };

  const analytics = getAnalytics();

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen bg-gray-950 text-gray-100">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Expenses</h1>
        <p className="text-gray-400">Track employee expenses, approvals and reimbursements</p>
      </div>


      {/* Filter bar full width, above main content */}
      <div className="bg-gray-900 rounded-xl shadow-md border border-gray-800 p-4 mb-6 w-full">
        <ExpenseFiltersBar filters={{ query: "", status: "", dateFrom: "", dateTo: "", category: "", project: "" }} onChange={() => {}} onAdd={() => setShowForm(true)} />
      </div>

      {/* Table: full width, horizontal scroll on small screens */}
      <div className="bg-gray-900 rounded-xl shadow-md border border-gray-800 p-0 overflow-x-auto w-full mb-6">
        <div className="min-w-[600px] w-full">
          <ExpensesTable expenses={filterExpenses()} onView={(e)=>setViewing(e)} onEdit={(e)=>{setEditing(e); setShowForm(true);}} onDelete={(id)=>{ if (confirm('Delete?')) { deleteExpense(id); showToast('Deleted', 'success'); } }} />
        </div>
      </div>

      {/* Bulk import and export: stack on mobile, row on md+ */}
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 mb-6 w-full">
        <div className="flex-1 bg-gray-900 rounded-xl shadow-md border border-gray-800 p-4">
          <BulkImport onImport={(rows)=>{ showToast('Imported rows: '+rows.length, 'success'); }} />
        </div>
        <div className="flex items-end">
          <CSVExportButton items={expenses} />
        </div>
      </div>

      {/* Sidebar: approvals and analytics, responsive and fills row on large screens */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex-1 flex flex-col lg:flex-row gap-6 w-full">
          <div className="flex-1 bg-gray-900 rounded-xl shadow-md border border-gray-800 p-4">
            <ApprovalsQueue onView={(e)=>setViewing(e)} />
          </div>
          <div className="flex-1 bg-gray-900 rounded-xl shadow-md border border-gray-800 p-4">
            <ExpenseAnalyticsChart expenses={expenses} />
          </div>
        </div>
      </div>

      <ExpenseFormModal open={showForm} onClose={() => setShowForm(false)} onSave={handleSave} defaultValues={editing || undefined} />
      <ExpenseDetailsDrawer open={!!viewing} expense={viewing} onClose={() => setViewing(null)} />
      <ReimbursementForm open={showReimburse} onClose={() => setShowReimburse(false)} onSubmit={(info)=>{ /* mark reimburse */ showToast('Reimbursed', 'success'); }} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
