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
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end">
          {/* Overlay with blur and dark background */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md h-[100vh] bg-gray-900 shadow-2xl rounded-l-2xl flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950 rounded-tl-2xl">
              <h2 className="text-lg font-semibold text-white">Expense <span className="text-gray-400">{expense.id}</span></h2>
              <button
                className="p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onClose}
                type="button"
                aria-label="Close details"
              >
                <X size={20} className="text-gray-300" />
              </button>
            </div>
            {/* Content */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              <p className="text-base font-medium text-gray-200 mb-2">{expense.title}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-800 rounded-lg text-center">
                  <div className="text-xs text-gray-400 mb-1">Amount</div>
                  <div className="text-lg font-bold text-blue-400">{expense.currency} {expense.amount}</div>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg text-center">
                  <div className="text-xs text-gray-400 mb-1">Date</div>
                  <div className="text-lg font-bold text-green-400">{new Date(expense.date).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Receipts</h4>
                <div className="space-y-2">
                  {expense.receipts.map((r) => (
                    <div key={r.id} className="p-2 bg-gray-800 rounded flex items-center justify-between">
                      <div className="truncate text-gray-200">{r.filename}</div>
                      <a className="text-blue-500 hover:underline ml-2" href={r.url || "#"} target="_blank" rel="noreferrer">View</a>
                    </div>
                  ))}
                  {expense.receipts.length === 0 && <div className="text-sm text-gray-500">No receipts</div>}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Activity</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  {(expense.approvals || []).map((a, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center md:gap-2">
                      <span className="font-medium text-gray-300">{a.date}</span>
                      <span>— {a.by} —</span>
                      <span className={a.decision === 'Approved' ? 'text-green-400' : a.decision === 'Rejected' ? 'text-red-400' : ''}>{a.decision}</span>
                      {a.comment && <span className="italic text-gray-500">({a.comment})</span>}
                    </div>
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
