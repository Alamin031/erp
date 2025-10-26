"use client";

import { Bill } from "@/types/bills";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Bell, Download } from "lucide-react";

interface Props {
  open: boolean;
  bill: Bill | null;
  onClose: () => void;
  onMarkPaid: (id: string) => void;
  onReminder: (bill: Bill) => void;
  onDownload: (bill: Bill) => void;
}

export function BillDetailsModal({ open, bill, onClose, onMarkPaid, onReminder, onDownload }: Props) {
  return (
    <AnimatePresence>
      {open && bill && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="relative bg-[#181A20] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-0 overflow-hidden border border-gray-700"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-[#1F2128]">
              <h2 className="text-xl font-semibold text-white">Bill <span className="text-blue-400">{bill.billNumber}</span></h2>
              <button className="hover:bg-gray-800 rounded-full p-1 transition" onClick={onClose} aria-label="Close"><X size={22} className="text-gray-300" /></button>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="block text-xs text-gray-400 uppercase tracking-wider">Vendor</span>
                    <span className="block text-base font-medium text-white">{bill.vendorName}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase tracking-wider">Amount</span>
                    <span className="block text-base font-medium text-green-400">${bill.amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase tracking-wider">Status</span>
                    <span className={`block text-base font-medium ${bill.status === 'Paid' ? 'text-green-400' : bill.status === 'Pending' ? 'text-yellow-400' : 'text-red-400'}`}>{bill.status}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="block text-xs text-gray-400 uppercase tracking-wider">Issued</span>
                    <span className="block text-base font-medium text-white">{new Date(bill.billDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase tracking-wider">Due</span>
                    <span className="block text-base font-medium text-white">{new Date(bill.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {bill.notes && (
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Notes</p>
                  <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-200 whitespace-pre-line">{bill.notes}</div>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Attachments</p>
                {bill.attachments.length === 0 ? (
                  <div className="text-sm text-gray-500">No attachments</div>
                ) : (
                  <ul className="list-disc list-inside text-sm text-gray-300 pl-4">
                    {bill.attachments.map((a) => (<li key={a}>{a}</li>))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 px-6 py-4 border-t border-gray-700 bg-[#1F2128] justify-end">
              <button className="btn btn-secondary w-full sm:w-auto" onClick={onClose}>Close</button>
              <button className="btn btn-secondary w-full sm:w-auto flex items-center gap-2" onClick={() => onDownload(bill)}><Download size={16} /> Download PDF</button>
              <button className="btn btn-secondary w-full sm:w-auto flex items-center gap-2" onClick={() => onReminder(bill)}><Bell size={16} /> Send Reminder</button>
              {bill.status !== "Paid" && (
                <button className="btn btn-primary w-full sm:w-auto flex items-center gap-2" onClick={() => onMarkPaid(bill.id)}><CheckCircle2 size={16} /> Mark as Paid</button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
