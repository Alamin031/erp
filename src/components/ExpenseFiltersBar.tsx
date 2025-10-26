"use client";

import { ExpenseFilters } from "@/types/expenses";

interface Props {
  filters: ExpenseFilters;
  onChange: (f: ExpenseFilters) => void;
  onAdd: () => void;
}

export function ExpenseFiltersBar({ filters, onChange, onAdd }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <input placeholder="Search" value={filters.query} onChange={(e) => onChange({ ...filters, query: e.target.value })} className="form-input" />
        <select value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value as any })} className="form-input">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Manager Approved">Manager Approved</option>
          <option value="Finance Approved">Finance Approved</option>
          <option value="Reimbursed">Reimbursed</option>
        </select>
        <input type="date" value={filters.dateFrom} onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })} className="form-input" />
        <input type="date" value={filters.dateTo} onChange={(e) => onChange({ ...filters, dateTo: e.target.value })} className="form-input" />
        <div className="ml-auto flex gap-2">
          <button onClick={() => onChange({ query: "", status: "", dateFrom: "", dateTo: "", category: "", project: "" })} className="btn btn-secondary">Reset</button>
          <button onClick={onAdd} className="btn btn-primary">Add Expense</button>
        </div>
      </div>
    </div>
  );
}
