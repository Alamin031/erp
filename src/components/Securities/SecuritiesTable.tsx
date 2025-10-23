"use client";

import { useMemo, useState } from "react";
import { Security } from "@/types/securities";
import { useSecurities } from "@/store/useSecurities";
import { useToast } from "@/components/toast";
import { ChevronDown } from "lucide-react";

interface Props {
  items: Security[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddTransaction: (id: string) => void;
}

type SortField = "holderName" | "shares" | "value" | "issueDate";
interface SortState {
  field: SortField;
  direction: "asc" | "desc";
}

export function SecuritiesTable({ items, onView, onEdit, onDelete, onAddTransaction }: Props) {
  const { deleteSecurity } = useSecurities();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortState>({ field: "issueDate", direction: "desc" });

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      let aVal: any = a[sort.field];
      let bVal: any = b[sort.field];

      if (sort.field === "shares") {
        return sort.direction === "asc" ? (a.shares || 0) - (b.shares || 0) : (b.shares || 0) - (a.shares || 0);
      }
      if (sort.field === "value") {
        return sort.direction === "asc" ? (a.value || 0) - (b.value || 0) : (b.value || 0) - (a.value || 0);
      }
      if (sort.field === "issueDate" || sort.field === "holderName") {
        const aStr = aVal?.toString() || "";
        const bStr = bVal?.toString() || "";
        return sort.direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      }
      return 0;
    });
    return copy;
  }, [items, sort]);

  const toggleAll = () => {
    if (selected.size === sorted.length) setSelected(new Set());
    else setSelected(new Set(sorted.map((i) => i.id)));
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const exportCSV = () => {
    const ids = Array.from(selected);
    const rows = items
      .filter((i) => ids.includes(i.id))
      .map((i) => [
        i.id,
        i.holderName,
        i.type,
        i.shares.toString(),
        (i.shares * i.value).toFixed(2),
        i.issueDate,
        i.status,
      ]);
    const csv = [
      "ID,Holder Name,Type,Shares,Value,Issue Date,Status",
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `securities-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "Issued":
        return "bg-yellow-100 text-yellow-800";
      case "Active":
        return "bg-green-100 text-green-800";
      case "Vested":
        return "bg-blue-100 text-blue-800";
      case "Transferred":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const confirmDelete = (id: string) => {
    if (confirm("Delete this security?")) {
      deleteSecurity(id);
      showToast("Security deleted", "success");
      setSelected((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
      onDelete(id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {selected.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-blue-900">{selected.size} selected</span>
          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Export CSV
          </button>
        </div>
      )}
      <div className="table-container border rounded-lg overflow-x-auto">
        <table className="reservations-table w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th style={{ width: 30 }} className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size > 0 && selected.size === sorted.length}
                  onChange={toggleAll}
                  className="cursor-pointer"
                />
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setSort({
                    field: "holderName",
                    direction: sort.field === "holderName" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                <div className="flex items-center gap-2">
                  Holder Name {sort.field === "holderName" && <ChevronDown size={16} />}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setSort({
                    field: "shares",
                    direction: sort.field === "shares" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                <div className="flex items-center gap-2">
                  Shares {sort.field === "shares" && <ChevronDown size={16} />}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setSort({
                    field: "value",
                    direction: sort.field === "value" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                <div className="flex items-center gap-2">
                  Value {sort.field === "value" && <ChevronDown size={16} />}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setSort({
                    field: "issueDate",
                    direction: sort.field === "issueDate" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                <div className="flex items-center gap-2">
                  Issue Date {sort.field === "issueDate" && <ChevronDown size={16} />}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No securities found
                </td>
              </tr>
            ) : (
              sorted.map((security) => (
                <tr key={security.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(security.id)}
                      onChange={() => toggleSelect(security.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{security.holderName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {security.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{security.shares.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ${(security.shares * security.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{security.issueDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(security.status)}`}>
                      {security.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm flex gap-2">
                    <button
                      onClick={() => onView(security.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      title="View Details"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(security.id)}
                      className="text-green-600 hover:text-green-800 font-medium"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onAddTransaction(security.id)}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                      title="Add Transaction"
                    >
                      Transaction
                    </button>
                    <button
                      onClick={() => confirmDelete(security.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
