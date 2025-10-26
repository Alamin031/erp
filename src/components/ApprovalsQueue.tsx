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
    <div className="bg-white rounded-xl shadow-md border p-4">
      <h3 className="text-lg font-semibold mb-3">Approvals Queue</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {approvalsQueue.length === 0 && <div className="text-sm text-gray-500">No pending approvals</div>}
        {approvalsQueue.map((e) => (
          <div key={e.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-gray-500">{e.submitterId} • {e.currency} {e.amount}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onView(e)} className="px-3 py-1 border rounded">View</button>
              <button onClick={() => handleDecision(e.id, "approve")} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              <button onClick={() => handleDecision(e.id, "reject")} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
