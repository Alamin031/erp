"use client";

import { useState, useMemo } from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { Expense } from "@/types/expenses";

interface Props {
  expenses: Expense[];
  onView: (e: Expense) => void;
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpensesTable({ expenses, onView, onEdit, onDelete }: Props) {
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const copy = [...expenses];
    copy.sort((a, b) => {
      let v = 0;
      if (sortField === "date") v = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortField === "amount") v = a.amount - b.amount;
      return sortDir === "asc" ? v : -v;
    });
    return copy;
  }, [expenses, sortField, sortDir]);

  return (
  <div className="rounded-xl shadow-md border border-gray-700 bg-gray-900 overflow-hidden">
  <div className="p-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Expenses</h3>
          <div className="flex items-center gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="px-2 py-1 border rounded bg-gray-900 text-gray-100 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
            >
              <option value="date" className="bg-gray-900 text-gray-100">Date</option>
              <option value="amount" className="bg-gray-900 text-gray-100">Amount</option>
            </select>
            <button onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))} className="px-2 py-1 border rounded">{sortDir}</button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
  <table className="w-full text-sm text-gray-100">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Project</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ex) => (
              <tr key={ex.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="p-3 font-medium">{ex.id}</td>
                <td className="p-3">{ex.submitterId}</td>
                <td className="p-3">{ex.category}</td>
                <td className="p-3 text-right">{ex.currency} {ex.amount.toLocaleString()}</td>
                <td className="p-3">{new Date(ex.date).toLocaleDateString()}</td>
                <td className="p-3">{ex.project || "—"}</td>
                <td className="p-3">{ex.status}</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onView(ex)} className="p-2 hover:bg-blue-900 rounded"><Eye size={16} /></button>
                    <button onClick={() => onEdit(ex)} className="p-2 hover:bg-yellow-900 rounded"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(ex.id)} className="p-2 hover:bg-red-900 rounded"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  {expenses.length === 0 && <div className="p-6 text-center text-gray-400">No expenses yet. Add one to get started.</div>}
    </div>
  );
}
