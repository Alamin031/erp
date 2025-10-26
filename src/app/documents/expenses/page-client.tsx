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
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Expenses</h1>
        <p className="text-gray-500">Track employee expenses, approvals and reimbursements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <ExpenseFiltersBar filters={{ query: "", status: "", dateFrom: "", dateTo: "", category: "", project: "" }} onChange={() => {}} onAdd={() => setShowForm(true)} />

          <ExpensesTable expenses={filterExpenses()} onView={(e)=>setViewing(e)} onEdit={(e)=>{setEditing(e); setShowForm(true);}} onDelete={(id)=>{ if (confirm('Delete?')) { deleteExpense(id); showToast('Deleted', 'success'); } }} />

          <div className="flex justify-between items-center mt-2">
            <BulkImport onImport={(rows)=>{ showToast('Imported rows: '+rows.length, 'success'); }} />
            <CSVExportButton items={expenses} />
          </div>
        </div>

        <div className="space-y-4">
          <ApprovalsQueue onView={(e)=>setViewing(e)} />
          <ExpenseAnalyticsChart expenses={expenses} />
        </div>
      </div>

      <ExpenseFormModal open={showForm} onClose={() => setShowForm(false)} onSave={handleSave} defaultValues={editing || undefined} />
      <ExpenseDetailsDrawer open={!!viewing} expense={viewing} onClose={() => setViewing(null)} />
      <ReimbursementForm open={showReimburse} onClose={() => setShowReimburse(false)} onSubmit={(info)=>{ /* mark reimburse */ showToast('Reimbursed', 'success'); }} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
