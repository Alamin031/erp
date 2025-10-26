"use client";

import type { Transaction, VatReturn } from "@/types/vat";
import { useMemo, useState } from "react";

interface Props { returns: VatReturn[]; transactions: Transaction[] }

export function ComplianceChecklist({ returns, transactions }: Props) {
  const [checks, setChecks] = useState<{[k:string]: boolean}>({ docs: false, reconciled: false, thresholds: false });
  const warnings = useMemo(() => {
    const overdue = returns.some(r => r.status !== 'Filed' && new Date(r.periodEnd).getTime() < Date.now() - 1000*60*60*24*30);
    const largeAdj = returns.some(r => Math.abs(r.adjustments) > (r.outputVat + r.inputVat) * 0.2);
    return { overdue, largeAdj };
  }, [returns]);
  return (
    <div className="bg-[#18181b] rounded-2xl shadow-lg border border-gray-700 p-4 md:p-6 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg text-gray-100 flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#60a5fa" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          Compliance Checklist
        </h3>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 text-sm text-gray-200 cursor-pointer">
          <input type="checkbox" checked={checks.docs} onChange={e=>setChecks(s=>({...s, docs:e.target.checked}))} className="accent-blue-500 w-4 h-4 rounded focus:ring-2 focus:ring-blue-400" />
          Documents attached
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-200 cursor-pointer">
          <input type="checkbox" checked={checks.reconciled} onChange={e=>setChecks(s=>({...s, reconciled:e.target.checked}))} className="accent-blue-500 w-4 h-4 rounded focus:ring-2 focus:ring-blue-400" />
          Reconciliation complete
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-200 cursor-pointer">
          <input type="checkbox" checked={checks.thresholds} onChange={e=>setChecks(s=>({...s, thresholds:e.target.checked}))} className="accent-blue-500 w-4 h-4 rounded focus:ring-2 focus:ring-blue-400" />
          Threshold checks ok
        </label>
      </div>
      {warnings.overdue && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-900/30 border border-red-700 rounded px-3 py-2 mt-2">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="#f87171" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <span>Warning: Overdue filings detected</span>
        </div>
      )}
      {warnings.largeAdj && (
        <div className="flex items-center gap-2 text-xs text-yellow-300 bg-yellow-900/30 border border-yellow-700 rounded px-3 py-2 mt-2">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="#facc15" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <span>Notice: Large adjustments present</span>
        </div>
      )}
    </div>
  );
}
