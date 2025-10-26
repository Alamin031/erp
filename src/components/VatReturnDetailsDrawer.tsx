"use client";

import { motion } from "framer-motion";
import type { VatReturn, FilingInfo } from "@/types/vat";

interface Props {
  open: boolean;
  vatReturn?: VatReturn;
  onClose: () => void;
  onMarkReady: () => void;
  onMarkFiled: (info: FilingInfo) => void;
}

export function VatReturnDetailsDrawer({ open, vatReturn, onClose, onMarkReady, onMarkFiled }: Props) {
  if (!open || !vatReturn) return null;
  return (
    <div className="drawer" role="dialog" aria-modal="true">
      <motion.div className="drawer-panel" initial={{ x: 400 }} animate={{ x: 0 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Return Details</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div><div className="text-sm text-gray-500">Period</div><div>{vatReturn.periodStart} → {vatReturn.periodEnd}</div></div>
            <div><div className="text-sm text-gray-500">Status</div><div>{vatReturn.status}</div></div>
            <div><div className="text-sm text-gray-500">Output VAT</div><div>{vatReturn.outputVat.toFixed(2)}</div></div>
            <div><div className="text-sm text-gray-500">Input VAT</div><div>{vatReturn.inputVat.toFixed(2)}</div></div>
          </div>

          <div>
            <h4 className="font-medium mt-3 mb-1">Activity</h4>
            <ul className="list-disc pl-5 text-sm">
              {vatReturn.activity.map(a => (
                <li key={a.id}>{new Date(a.at).toLocaleString()} — {a.message}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <button className="btn-secondary" onClick={onMarkReady}>Mark Ready</button>
            <button className="btn-primary" onClick={() => onMarkFiled({ filedAt: new Date().toISOString() })}>Mark Filed</button>
          </div>
        </div>
      </motion.div>
      <div className="drawer-backdrop" onClick={onClose} />
    </div>
  );
}
