"use client";

import { Bill } from "@/types/bills";
import { Clock } from "lucide-react";

interface Props {
  bills: Bill[];
}

export function RecentTransactions({ bills }: Props) {
  const paid = bills
    .filter((b) => b.status === "Paid")
    .sort((a, b) => new Date(b.paymentDate || b.updatedAt).getTime() - new Date(a.paymentDate || a.updatedAt).getTime())
    .slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {paid.length === 0 && <p className="text-gray-500 text-sm">No recent payments</p>}
        {paid.map((b) => (
          <div key={b.id} className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-green-100 text-green-700 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Paid Tk {b.amount.toLocaleString()} to <span className="font-semibold">{b.vendorName}</span>
              </p>
              <p className="text-xs text-gray-500">{new Date(b.paymentDate || b.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
