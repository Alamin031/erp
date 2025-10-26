"use client";

import { useEffect, useMemo, useState } from "react";
import { VatDashboard } from "@/components/VatDashboard";
import { VatReturnsTable } from "@/components/VatReturnsTable";
import { VatReturnFormModal } from "@/components/VatReturnFormModal";
import { VatReturnDetailsDrawer } from "@/components/VatReturnDetailsDrawer";
import { VatReconciliation } from "@/components/VatReconciliation";
import { TransactionMatcher } from "@/components/TransactionMatcher";
import { UploadVatInvoice } from "../../../components/UploadVatInvoice";
import { InputOutputRegisters } from "@/components/InputOutputRegisters";
import { VatAnalyticsChart } from "@/components/VatAnalyticsChart";
import { ComplianceChecklist } from "@/components/ComplianceChecklist";
import { CsvImportButton } from "../../../components/CsvImportButton";
import { ExportPdfButton } from "@/components/ExportPdfButton";
import { useVat } from "@/store/useVat";

export function VatPageClient() {
  const {
    vatReturns,
    transactions,
    vendors,
    selectedReturnId,
    setSelectedReturn,
    loadDemoData,
    createReturn,
    updateReturn,
    markReady,
    markFiled,
    autoReconcile,
    exportReturn,
  } = useVat();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showMatcher, setShowMatcher] = useState(false);
  const selectedReturn = useMemo(() => vatReturns.find(v => v.id === selectedReturnId) || null, [vatReturns, selectedReturnId]);

  useEffect(() => {
    if (vatReturns.length === 0 || transactions.length === 0 || vendors.length === 0) {
      loadDemoData().catch(() => {/* ignore for demo */});
    }
  }, [vatReturns.length, transactions.length, vendors.length, loadDemoData]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">VAT</h1>
        <p className="text-gray-500">Create, track and file VAT returns with reconciliation and compliance reporting.</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-2">
        <CsvImportButton />
        <UploadVatInvoice />
        <ExportPdfButton onExport={() => { if (selectedReturnId) exportReturn(selectedReturnId, "pdf"); }} />
      </div>

      <VatDashboard onCreateReturn={() => { setEditingId(null); setShowForm(true); }} onReconcile={() => setShowMatcher(true)} onUpload={() => {}} onExport={() => { if (selectedReturnId) exportReturn(selectedReturnId, "csv"); }} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Table full width */}
        <div className="col-span-1 xl:col-span-4 space-y-4">
          <VatReturnsTable
            returns={vatReturns}
            onCreate={() => { setEditingId(null); setShowForm(true); }}
            onEdit={(id) => { setEditingId(id); setShowForm(true); }}
            onView={(id) => setSelectedReturn(id)}
            onExport={(id, format) => exportReturn(id, format)}
          />
          <VatReconciliation returnId={selectedReturnId || undefined} onAutoMatch={() => { if (selectedReturnId) autoReconcile(selectedReturnId); }} onOpenMatcher={() => setShowMatcher(true)} />
        </div>
        {/* Analytics, checklist, and registers below table, full width */}
        <div className="col-span-1 xl:col-span-4 space-y-4">
          <VatAnalyticsChart returns={vatReturns} transactions={transactions} />
          <ComplianceChecklist returns={vatReturns} transactions={transactions} />
          <InputOutputRegisters transactions={transactions} vendors={vendors} />
        </div>
      </div>

      <VatReturnFormModal
        open={showForm}
        returnId={editingId || undefined}
        onClose={() => setShowForm(false)}
        onSubmit={(data) => {
          if (editingId) updateReturn(editingId, data); else createReturn(data);
          setShowForm(false);
        }}
      />

      <VatReturnDetailsDrawer
        open={!!selectedReturn}
        vatReturn={selectedReturn || undefined}
        onClose={() => setSelectedReturn(null)}
        onMarkReady={() => { if (selectedReturn) markReady(selectedReturn.id); }}
        onMarkFiled={(info) => { if (selectedReturn) markFiled(selectedReturn.id, info); }}
      />

      <TransactionMatcher open={showMatcher} onClose={() => setShowMatcher(false)} />
    </div>
  );
}
