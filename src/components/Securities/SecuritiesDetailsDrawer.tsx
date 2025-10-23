"use client";

import { Security } from "@/types/securities";
import { useSecurities } from "@/store/useSecurities";
import { X } from "lucide-react";

interface Props {
  security: Security | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SecuritiesDetailsDrawer({ security, isOpen, onClose }: Props) {
  if (!isOpen || !security) return null;

  const vestingProgress = security.vestingSchedule
    ? (security.vestingSchedule.vestedShares / security.vestingSchedule.totalShares) * 100
    : 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Security Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Basic Information</h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-600 font-medium">ID</p>
                <p className="text-sm font-medium text-gray-900">{security.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Holder Name</p>
                <p className="text-sm font-medium text-gray-900">{security.holderName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Type</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  {security.type}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Status</p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  {security.status}
                </span>
              </div>
            </div>
          </div>

          {/* Share Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Share Information</h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between">
                <p className="text-xs text-gray-600 font-medium">Shares</p>
                <p className="text-sm font-medium text-gray-900">{security.shares.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-600 font-medium">Value per Share</p>
                <p className="text-sm font-medium text-gray-900">${security.value.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-600 font-medium">Total Value</p>
                <p className="text-sm font-bold text-gray-900">${(security.shares * security.value).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-600 font-medium">Issue Date</p>
                <p className="text-sm font-medium text-gray-900">{security.issueDate}</p>
              </div>
            </div>
          </div>

          {/* Vesting Schedule */}
          {security.vestingSchedule && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Vesting Schedule</h3>
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <p className="text-xs text-gray-600 font-medium">Vested Shares</p>
                  <p className="text-sm font-medium text-gray-900">
                    {security.vestingSchedule.vestedShares.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-600 font-medium">Total Shares</p>
                  <p className="text-sm font-medium text-gray-900">
                    {security.vestingSchedule.totalShares.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-2">Vesting Progress</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${vestingProgress}%` }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{vestingProgress.toFixed(1)}% vested</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-600 font-medium">Start Date</p>
                  <p className="text-sm font-medium text-gray-900">{security.vestingSchedule.vestingStartDate}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-600 font-medium">End Date</p>
                  <p className="text-sm font-medium text-gray-900">{security.vestingSchedule.vestingEndDate}</p>
                </div>
                {security.vestingSchedule.cliffMonths && (
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-600 font-medium">Cliff Period</p>
                    <p className="text-sm font-medium text-gray-900">{security.vestingSchedule.cliffMonths} months</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transaction History */}
          {security.transactions && security.transactions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Transaction History</h3>
              <div className="space-y-2">
                {security.transactions.map((tx) => (
                  <div key={tx.id} className="bg-gray-50 rounded p-3">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{tx.type}</p>
                      <p className="text-xs text-gray-600">{tx.date}</p>
                    </div>
                    <p className="text-xs text-gray-700">Quantity: {tx.quantity.toLocaleString()}</p>
                    {tx.notes && <p className="text-xs text-gray-600 mt-1">{tx.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {security.documents && security.documents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Documents</h3>
              <div className="space-y-2">
                {security.documents.map((doc) => (
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
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-600">
              Created: <span className="font-medium">{security.createdAt}</span>
            </p>
            <p className="text-xs text-gray-600">
              Updated: <span className="font-medium">{security.updatedAt}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
