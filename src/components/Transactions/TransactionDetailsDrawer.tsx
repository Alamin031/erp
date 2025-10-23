"use client";

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
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Transaction Information
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-600 font-medium">ID</p>
                <p className="text-sm font-medium text-gray-900">{transaction.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Date</p>
                <p className="text-sm font-medium text-gray-900">{transaction.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Type</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(transaction.type)}`}>
                  {transaction.type}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Entity</p>
                <p className="text-sm font-medium text-gray-900">{transaction.entity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Financial Summary</h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between">
                <p className="text-xs text-gray-600 font-medium">Security Type</p>
                <p className="text-sm font-medium text-gray-900">{transaction.securityType}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-600 font-medium">Quantity</p>
                <p className="text-sm font-medium text-gray-900">{transaction.quantity.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-600 font-medium">Unit Price</p>
                <p className="text-sm font-medium text-gray-900">${transaction.unitPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between border-t pt-3">
                <p className="text-xs text-gray-600 font-bold">Total Amount</p>
                <p className="text-lg font-bold text-gray-900">
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
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Attached Documents</h3>
              <div className="space-y-2">
                {transaction.documents.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 rounded p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-600">{doc.type}</p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
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
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Notes</h3>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-sm text-gray-700">{transaction.notes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t pt-4 flex gap-2">
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download Receipt
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(transaction.id)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction.id)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-600">
              Created: <span className="font-medium">{transaction.createdAt}</span>
            </p>
            <p className="text-xs text-gray-600">
              Updated: <span className="font-medium">{transaction.updatedAt}</span>
            </p>
            {transaction.createdBy && (
              <p className="text-xs text-gray-600">
                Created By: <span className="font-medium">{transaction.createdBy}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
