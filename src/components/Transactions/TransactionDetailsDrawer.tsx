"use client";

import type { CSSProperties } from 'react';
import { Transaction } from "@/types/transactions";
import { useTransactions } from "@/store/useTransactions";
import { X, Download } from "lucide-react";

interface Props {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TransactionDetailsDrawer({ transaction, isOpen, onClose, onEdit, onDelete }: Props) {
  if (!isOpen || !transaction) return null;

  const handleDownloadReceipt = () => {
    const receiptContent = `
TRANSACTION RECEIPT
==================

Transaction ID: ${transaction.id}
Date: ${transaction.date}
Type: ${transaction.type}
Entity: ${transaction.entity}
Security Type: ${transaction.securityType}

DETAILS
-------
Quantity: ${transaction.quantity.toLocaleString()}
Unit Price: $${transaction.unitPrice.toFixed(2)}
Total Amount: $${transaction.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}

Status: ${transaction.status}
Notes: ${transaction.notes || "N/A"}

APPROVAL HISTORY
----------------
${transaction.auditLog
  ?.map(
    (entry) => `
${entry.timestamp}: ${entry.action}
User: ${entry.user}
Details: ${entry.details}
`
  )
  .join("")}
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${transaction.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Executed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeBadgeColor = (type: string): string => {
    switch (type) {
      case "Issuance":
        return "bg-green-100 text-green-800";
      case "Exercise":
        return "bg-blue-100 text-blue-800";
      case "Transfer":
        return "bg-purple-100 text-purple-800";
      case "Cancellation":
        return "bg-red-100 text-red-800";
      case "Conversion":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <div className="slide-over">
        <div className="slide-over-header">
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--foreground)' }}>Transaction Details</h2>
          <button onClick={onClose} className="slide-over-close">
            <X size={24} style={{ color: 'var(--secondary)' }} />
          </button>
        </div>

        <div className="slide-over-content">
          {/* Basic Information */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Transaction Information
            </h3>
            <div style={{ display: 'block', background: 'var(--background)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)' }}>
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600, margin: 0 }}>ID</p>
                <p style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 600, margin: '6px 0 0 0' }}>{transaction.id}</p>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600, margin: 0 }}>Date</p>
                <p style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 600, margin: '6px 0 0 0' }}>{transaction.date}</p>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600, margin: 0 }}>Type</p>
                <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, marginTop: '6px', ...getTypeBadgeStyle(transaction.type) }}>
                  {transaction.type}
                </span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600, margin: 0 }}>Entity</p>
                <p style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 600, margin: '6px 0 0 0' }}>{transaction.entity}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600, margin: 0 }}>Status</p>
                <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, marginTop: '6px', ...getStatusBadgeStyle(transaction.status) }}>
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Financial Summary</h3>
            <div style={{ display: 'block', background: 'var(--background)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600, margin: 0 }}>Security Type</p>
                <p style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 600, margin: 0 }}>{transaction.securityType}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600, margin: 0 }}>Quantity</p>
                <p style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 600, margin: 0 }}>{transaction.quantity.toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600, margin: 0 }}>Unit Price</p>
                <p style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 600, margin: 0 }}>${transaction.unitPrice.toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 700, margin: 0 }}>Total Amount</p>
                <p style={{ fontSize: '18px', color: 'var(--foreground)', fontWeight: 700, margin: 0 }}>
                  ${transaction.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Approval Timeline */}
          {transaction.auditLog && transaction.auditLog.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Audit Timeline</h3>
              <div className="space-y-3">
                {transaction.auditLog.map((entry, idx) => (
                  <div key={entry.id} className="relative">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                        {idx < transaction.auditLog!.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-300 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="text-sm font-semibold text-gray-900">{entry.action}</p>
                        <p className="text-xs text-gray-600">{entry.timestamp}</p>
                        <p className="text-xs text-gray-700 mt-1">
                          <span className="font-medium">By:</span> {entry.user}
                        </p>
                        <p className="text-xs text-gray-700">{entry.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {transaction.documents && transaction.documents.length > 0 && (
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Attached Documents</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {transaction.documents.map((doc) => (
                  <div key={doc.id} style={{ background: 'var(--background)', borderRadius: '6px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 600, margin: 0 }}>{doc.name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--secondary)', margin: '4px 0 0 0' }}>{doc.type}</p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {transaction.notes && (
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Notes</h3>
              <div style={{ background: 'var(--background)', borderRadius: '6px', padding: '12px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '14px', color: 'var(--foreground)', margin: 0 }}>{transaction.notes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDownloadReceipt}
              style={{
                flex: 1,
                background: "var(--primary)",
                color: "white",
                padding: "10px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.2s, transform 0.2s",
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Download size={18} />
              Download Receipt
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(transaction.id)}
                style={{
                  flex: 1,
                  background: 'var(--success)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, transform 0.2s',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction.id)}
                style={{
                  flex: 1,
                  background: "var(--danger)",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s, transform 0.2s",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Delete
              </button>
            )}
          </div>

          {/* Metadata */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <p style={{ fontSize: '12px', color: 'var(--secondary)', margin: 0 }}>
              Created: <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{transaction.createdAt}</span>
            </p>
            <p style={{ fontSize: '12px', color: 'var(--secondary)', margin: '6px 0 0 0' }}>
              Updated: <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{transaction.updatedAt}</span>
            </p>
            {transaction.createdBy && (
              <p style={{ fontSize: '12px', color: 'var(--secondary)', margin: '6px 0 0 0' }}>
                Created By: <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{transaction.createdBy}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// helper functions to return inline styles for badges using CSS variables
function getStatusBadgeStyle(status: string) {
  let color = 'var(--secondary)';
  switch (status) {
    case 'Draft':
      color = 'var(--secondary)';
      break;
    case 'Approved':
      color = 'var(--success)';
      break;
    case 'Rejected':
      color = 'var(--danger)';
      break;
    case 'Pending':
      color = 'var(--warning)';
      break;
    case 'Executed':
      color = 'var(--primary)';
      break;
    default:
      color = 'var(--secondary)';
  }
  const bg = color.startsWith("var(") ? "rgba(255,255,255,0.03)" : `${color}20`;
  return {
    backgroundColor: bg,
    color: color,
  } as CSSProperties;
}

function getTypeBadgeStyle(type: string) {
  let color = 'var(--secondary)';
  switch (type) {
    case 'Issuance':
      color = 'var(--success)';
      break;
    case 'Exercise':
      color = 'var(--primary)';
      break;
    case 'Transfer':
      color = '#9f7aea';
      break;
    case 'Cancellation':
      color = 'var(--danger)';
      break;
    case 'Conversion':
      color = '#f59e0b';
      break;
    default:
      color = 'var(--secondary)';
  }
  const bg = color.startsWith("var(") ? "rgba(255,255,255,0.03)" : `${color}20`;
  return {
    backgroundColor: bg,
    color: color,
  } as CSSProperties;
}
