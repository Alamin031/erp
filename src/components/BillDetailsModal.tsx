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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal">
          <div className="modal-overlay" onClick={onClose} />
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="modal-card" style={{ maxWidth: 760 }}>
            <div className="modal-header">
              <h2>Bill {bill.billNumber}</h2>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            <div className="modal-form">
              <div className="details-section">
                <div className="details-grid">
                  <div className="detail-item"><span className="detail-label">Vendor</span><span className="detail-value">{bill.vendorName}</span></div>
                  <div className="detail-item"><span className="detail-label">Amount</span><span className="detail-value">${bill.amount.toLocaleString()}</span></div>
                  <div className="detail-item"><span className="detail-label">Issued</span><span className="detail-value">{new Date(bill.billDate).toLocaleDateString()}</span></div>
                  <div className="detail-item"><span className="detail-label">Due</span><span className="detail-value">{new Date(bill.dueDate).toLocaleDateString()}</span></div>
                  <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value">{bill.status}</span></div>
                </div>
              </div>

              {bill.notes && <div className="details-section"><p className="details-title">Notes</p><div className="details-notes">{bill.notes}</div></div>}

              <div className="details-section">
                <p className="details-title">Attachments</p>
                {bill.attachments.length === 0 ? (
                  <div className="text-sm text-gray-400">No attachments</div>
                ) : (
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {bill.attachments.map((a) => (<li key={a}>{a}</li>))}
                  </ul>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
              <button className="btn btn-secondary" onClick={() => onDownload(bill)}><Download size={16} /> Download PDF</button>
              <button className="btn btn-secondary" onClick={() => onReminder(bill)}><Bell size={16} /> Send Reminder</button>
              {bill.status !== "Paid" && (
                <button className="btn btn-primary" onClick={() => onMarkPaid(bill.id)}><CheckCircle2 size={16} /> Mark as Paid</button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
