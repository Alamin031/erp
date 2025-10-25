"use client";

import { motion } from "framer-motion";
import { Bill } from "@/types/bills";
import { Download, CheckCircle, Send } from "lucide-react";

interface Props {
  bill: Bill | null;
  onClose: () => void;
  onMarkAsPaid?: (bill: Bill) => void;
  onDownload?: (bill: Bill) => void;
  onSendToAccounting?: (bill: Bill) => void;
}

export function BillDetailsDrawer({ bill, onClose, onMarkAsPaid, onDownload, onSendToAccounting }: Props) {
  if (!bill) return null;

  const total = bill.lineItems?.reduce((s, li) => s + li.quantity * li.unitPrice * (1 + (li.taxRate || 0) / 100), 0) ?? bill.amount;

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <motion.aside
        className="slide-over"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        role="dialog"
        aria-modal
        style={{ maxWidth: 520 }}
      >
        <div className="slide-over-header">
          <div>
            <div style={{ fontSize: 12, color: "var(--secondary)" }}>Bill</div>
            <h3 style={{ margin: 0 }}>{bill.billNumber} • {bill.vendorName}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="slide-over-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Info label="Status" value={bill.status} />
            <Info label="Bill Date" value={new Date(bill.billDate).toLocaleDateString()} />
            <Info label="Due Date" value={new Date(bill.dueDate).toLocaleDateString()} />
            <Info label="Amount" value={`$${bill.amount.toFixed(2)}`} />
            <Info label="Paid" value={`$${bill.paidAmount.toFixed(2)}`} />
            <Info label="Balance" value={`$${bill.balance.toFixed(2)}`} />
          </div>

          <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 12px', background: 'var(--background)', fontWeight: 700 }}>Line Items</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: 10, fontSize: 12, textTransform: 'uppercase', color: 'var(--secondary)' }}>Item</th>
                    <th style={{ textAlign: 'right', padding: 10, fontSize: 12, textTransform: 'uppercase', color: 'var(--secondary)' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: 10, fontSize: 12, textTransform: 'uppercase', color: 'var(--secondary)' }}>Unit Price</th>
                    <th style={{ textAlign: 'right', padding: 10, fontSize: 12, textTransform: 'uppercase', color: 'var(--secondary)' }}>Tax</th>
                    <th style={{ textAlign: 'right', padding: 10, fontSize: 12, textTransform: 'uppercase', color: 'var(--secondary)' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(bill.lineItems ?? []).map((li) => (
                    <tr key={li.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 10 }}>{li.itemName}</td>
                      <td style={{ padding: 10, textAlign: 'right' }}>{li.quantity}</td>
                      <td style={{ padding: 10, textAlign: 'right' }}>${li.unitPrice.toFixed(2)}</td>
                      <td style={{ padding: 10, textAlign: 'right' }}>{li.taxRate ?? 0}%</td>
                      <td style={{ padding: 10, textAlign: 'right' }}>${(li.quantity * li.unitPrice * (1 + (li.taxRate || 0) / 100)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} style={{ padding: 10, textAlign: 'right', fontWeight: 700 }}>Total</td>
                    <td style={{ padding: 10, textAlign: 'right', fontWeight: 700 }}>${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {bill.attachment && (
            <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)' }}>Attachment</div>
                  <div style={{ fontWeight: 600 }}>{bill.attachment.name}</div>
                </div>
                <button className="btn btn-secondary" onClick={() => onDownload?.(bill)} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            {bill.status !== "Paid" && (
              <button className="btn btn-primary" onClick={() => onMarkAsPaid?.(bill)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} /> Mark as Paid
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => onSendToAccounting?.(bill)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Send size={16} /> Send to Accounting
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}
