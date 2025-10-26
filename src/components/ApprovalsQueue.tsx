"use client";

import { Expense } from "@/types/expenses";
import { useExpenses } from "@/store/useExpenses";
import { useToast } from "@/components/toast";

interface Props {
  onView: (e: Expense) => void;
}

export function ApprovalsQueue({ onView }: Props) {
  const { approvalsQueue, approveExpense } = useExpenses();
  const { showToast } = useToast();

  const handleDecision = (id: string, decision: string) => {
    approveExpense(id, decision, "Handled via queue");
    showToast(`Expense ${decision}`, "success");
  };

  return (
    <div className="rounded-xl shadow-md border border-gray-700 bg-gray-900 p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-100">Approvals Queue</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {approvalsQueue.length === 0 && <div className="text-sm text-gray-400">No pending approvals</div>}
        {approvalsQueue.map((e) => (
          <div key={e.id} className="p-3 border border-gray-700 rounded flex items-center justify-between bg-gray-800">
            <div>
              <div className="font-medium text-gray-100">{e.title}</div>
              <div className="text-sm text-gray-400">{e.submitterId} • {e.currency} {e.amount}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onView(e)} className="px-3 py-1 border border-gray-600 rounded text-gray-100 bg-gray-900 hover:bg-gray-800">View</button>
              <button onClick={() => handleDecision(e.id, "approve")} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
              <button onClick={() => handleDecision(e.id, "reject")} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
