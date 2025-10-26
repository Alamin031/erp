"use client";

import { Vendor } from "@/types/bills";
import { Building2 } from "lucide-react";

interface Props {
  vendors: Vendor[];
}

export function VendorList({ vendors }: Props) {
  const sorted = [...vendors].sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));

  return (
    <div className="bg-gray-900 rounded-xl shadow-md border border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-gray-100 mb-3">Vendors</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {sorted.map((v) => (
          <div key={v.id} className="flex items-center justify-between p-3 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/30 text-blue-300 rounded-lg"><Building2 className="w-4 h-4" /></div>
              <div>
                <p className="text-sm font-semibold text-gray-100">{v.name}</p>
                <p className="text-xs text-gray-400">Last txn: {v.lastTransactionDate ? new Date(v.lastTransactionDate).toLocaleDateString() : "—"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-100">Tk {(v.totalAmount || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-400">{v.totalBills || 0} bills</p>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <p className="text-sm text-gray-500">No vendors</p>}
      </div>
    </div>
  );
}
