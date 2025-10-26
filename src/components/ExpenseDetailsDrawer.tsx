"use client";

import { Expense } from "@/types/expenses";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
}

export function ExpenseDetailsDrawer({ open, expense, onClose }: Props) {
  if (!open || !expense) return null;

  return (
    <AnimatePresence>
      {open && expense && (
        <div className="modal">
          <div className="modal-overlay" onClick={onClose} />
          <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="slide-over">
            <div className="slide-over-header">
              <h2>Expense {expense.id}</h2>
              <button className="slide-over-close" onClick={onClose}><X size={18} /></button>
            </div>
            <div className="slide-over-content">
              <p className="text-sm text-gray-500">{expense.title}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="p-3 border rounded">Amount<br /><strong>{expense.currency} {expense.amount}</strong></div>
                <div className="p-3 border rounded">Date<br /><strong>{new Date(expense.date).toLocaleDateString()}</strong></div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold">Receipts</h4>
                <div className="mt-2 space-y-2">
                  {expense.receipts.map((r) => (
                    <div key={r.id} className="p-2 border rounded flex items-center justify-between">
                      <div>{r.filename}</div>
                      <a className="text-blue-600" href={r.url || "#"} target="_blank" rel="noreferrer">View</a>
                    </div>
                  ))}
                  {expense.receipts.length === 0 && <div className="text-sm text-gray-500">No receipts</div>}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold">Activity</h4>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  {(expense.approvals || []).map((a, idx) => (
                    <div key={idx}>{a.date} — {a.by} — {a.decision} {a.comment ? `(${a.comment})` : ""}</div>
                  ))}
                  {(!expense.approvals || expense.approvals.length === 0) && <div className="text-sm text-gray-500">No activity yet</div>}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
