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
    <div className="card space-y-2">
      <div className="flex items-center justify-between mb-1"><h3 className="font-semibold">Compliance Checklist</h3></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={checks.docs} onChange={e=>setChecks(s=>({...s, docs:e.target.checked}))}/> Documents attached</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={checks.reconciled} onChange={e=>setChecks(s=>({...s, reconciled:e.target.checked}))}/> Reconciliation complete</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={checks.thresholds} onChange={e=>setChecks(s=>({...s, thresholds:e.target.checked}))}/> Threshold checks ok</label>
      {warnings.overdue && <div className="text-xs text-red-600">Warning: Overdue filings detected</div>}
      {warnings.largeAdj && <div className="text-xs text-yellow-700">Notice: Large adjustments present</div>}
    </div>
  );
}
