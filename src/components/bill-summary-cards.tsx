"use client";

import { Receipt, DollarSign, Clock, AlertTriangle } from "lucide-react";

interface Props {
  totalBills: number;
  totalPaid: number;
  totalPending: number;
  overdueBills: number;
}

export function BillSummaryCards({ totalBills, totalPaid, totalPending, overdueBills }: Props) {
  const cards = [
    { label: "Total Bills", value: totalBills, color: "bg-blue-900/30 text-blue-300", icon: <Receipt className="w-5 h-5" /> },
    { label: "Paid", value: totalPaid, color: "bg-green-900/30 text-green-300", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Pending", value: totalPending, color: "bg-yellow-900/30 text-yellow-200", icon: <Clock className="w-5 h-5" /> },
    { label: "Overdue", value: overdueBills, color: "bg-red-900/30 text-red-300", icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-4 flex items-center gap-3">
          <div className={`p-3 rounded-lg ${c.color}`}>{c.icon}</div>
          <div>
            <p className="text-sm text-gray-400">{c.label}</p>
            <p className="text-2xl font-semibold text-gray-100">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
