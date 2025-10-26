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
    { label: "Total Bills", value: totalBills, color: "bg-blue-100 text-blue-700", icon: <Receipt className="w-5 h-5" /> },
    { label: "Paid", value: totalPaid, color: "bg-green-100 text-green-700", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Pending", value: totalPending, color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-5 h-5" /> },
    { label: "Overdue", value: overdueBills, color: "bg-red-100 text-red-700", icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex items-center gap-3">
          <div className={`p-3 rounded-lg ${c.color}`}>{c.icon}</div>
          <div>
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
