"use client";

import { useMemo } from "react";
import { useTransactions } from "@/store/useTransactions";
import { Clock } from "lucide-react";

interface Props {
  limit?: number;
}

export function TransactionActivityLog({ limit = 15 }: Props) {
  const { transactions } = useTransactions();

  const activityItems = useMemo(() => {
    const items: Array<{
      id: string;
      timestamp: string;
      title: string;
      description: string;
      icon: string;
      color: string;
    }> = [];

    transactions.forEach((txn) => {
      if (txn.auditLog) {
        txn.auditLog.forEach((entry) => {
          items.push({
            id: entry.id,
            timestamp: entry.timestamp,
            title: `${entry.action}: ${txn.type}`,
            description: `${txn.entity} - ${txn.quantity.toLocaleString()} shares - By ${entry.user}`,
            icon: entry.action === "Approved" ? "✓" : entry.action === "Rejected" ? "✕" : "◆",
            color:
              entry.action === "Approved"
                ? "text-green-600"
                : entry.action === "Rejected"
                  ? "text-red-600"
                  : entry.action === "Executed"
                    ? "text-blue-600"
                    : "text-gray-600",
          });
        });
      }
    });

    return items
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }, [transactions, limit]);

  if (activityItems.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Clock className="mx-auto text-gray-400 mb-3" size={32} />
        <p className="text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activityItems.map((item, idx) => (
          <div key={item.id} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-sm font-bold ${item.color}`}>
                {item.icon}
              </div>
              {idx < activityItems.length - 1 && <div className="w-0.5 h-12 bg-gray-200 mt-2" />}
            </div>
            <div className="flex-1 pb-2">
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
