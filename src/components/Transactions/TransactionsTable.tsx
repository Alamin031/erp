"use client";

import { useMemo, useState } from "react";
import { Transaction } from "@/types/transactions";
import { useTransactions } from "@/store/useTransactions";
import { useToast } from "@/components/toast";
import { ChevronDown } from "lucide-react";

interface Props {
  items: Transaction[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

type SortField = "date" | "type" | "entity" | "quantity" | "totalAmount";
interface SortState {
  field: SortField;
  direction: "asc" | "desc";
}

export function TransactionsTable({ items, onView, onEdit, onDelete }: Props) {
  const { deleteTransaction } = useTransactions();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortState>({ field: "date", direction: "desc" });

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      if (sort.field === "date") {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();
        return sort.direction === "asc" ? aTime - bTime : bTime - aTime;
      }
      if (sort.field === "quantity" || sort.field === "totalAmount") {
        const aVal = sort.field === "quantity" ? a.quantity : a.totalAmount;
        const bVal = sort.field === "quantity" ? b.quantity : b.totalAmount;
        return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aStr = sort.field === "type" ? a.type : a.entity;
      const bStr = sort.field === "type" ? b.type : b.entity;
      return sort.direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
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

  const ariaSort = (field: SortField) =>
    sort.field === field ? (sort.direction === "asc" ? "ascending" : "descending") : "none";

  const escapeCsvField = (value: any) => {
    const str = value == null ? "" : String(value);
    // Prevent CSV injection by prefixing cells that start with = + - @ with a single quote
    const safeStart = /^[=+\-@]/.test(str) ? `'${str}` : str;
    // If field contains a quote, comma or newline, wrap in double quotes and escape internal quotes
    if (/[",\n]/.test(safeStart)) {
      return `"${safeStart.replace(/"/g, '""')}"`;
    }
    return safeStart;
  };

  const exportCSV = () => {
    const ids = Array.from(selected);
    const rows = items
      .filter((i) => ids.includes(i.id))
      .map((i) => [
        i.id,
        i.date,
        i.type,
        i.entity,
        i.quantity.toString(),
        i.totalAmount.toFixed(2),
        i.status,
      ]);

    const header = ["ID", "Date", "Type", "Entity", "Quantity", "Total Amount", "Status"];
    const csv = [
      header.join(","),
      ...rows.map((r) => r.map(escapeCsvField).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    // revoke after a short delay to ensure the download has started
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const deleteSelected = () => {
    if (confirm(`Delete ${selected.size} transaction(s)?`)) {
      Array.from(selected).forEach((id) => {
        deleteTransaction(id);
        onDelete(id);
      });
      showToast(`${selected.size} transaction(s) deleted`, "success");
      setSelected(new Set());
    }
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "Draft":
        return "bg-gray-700 text-gray-100";
      case "Approved":
        return "bg-green-600 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      case "Pending":
        return "bg-yellow-500 text-black";
      case "Executed":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-700 text-gray-100";
    }
  };

  const getTypeBadgeColor = (type: string): string => {
    switch (type) {
      case "Issuance":
        return "bg-green-600 text-white";
      case "Exercise":
        return "bg-blue-600 text-white";
      case "Transfer":
        return "bg-purple-600 text-white";
      case "Cancellation":
        return "bg-red-600 text-white";
      case "Conversion":
        return "bg-orange-500 text-black";
      default:
        return "bg-gray-700 text-gray-100";
    }
  };

  const confirmDelete = (id: string) => {
    if (confirm("Delete this transaction?")) {
      deleteTransaction(id);
      showToast("Transaction deleted", "success");
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
          <span className="text-blue-900 font-medium">{selected.size} selected</span>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Export CSV
            </button>
            <button
              onClick={deleteSelected}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}
      <div className="table-container border rounded-lg overflow-x-auto">
        <table className="reservations-table w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th style={{ width: 30 }} className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all transactions"
                  checked={selected.size > 0 && selected.size === sorted.length}
                  onChange={toggleAll}
                  className="cursor-pointer"
                />
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th
                scope="col"
                role="button"
                tabIndex={0}
                aria-sort={ariaSort("date")}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                onClick={() =>
                  setSort({
                    field: "date",
                    direction: sort.field === "date" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSort({
                      field: "date",
                      direction: sort.field === "date" && sort.direction === "asc" ? "desc" : "asc",
                    });
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  Date {sort.field === "date" && <ChevronDown size={16} />}
                </div>
              </th>
              <th
                scope="col"
                role="button"
                tabIndex={0}
                aria-sort={ariaSort("type")}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                onClick={() =>
                  setSort({
                    field: "type",
                    direction: sort.field === "type" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSort({
                      field: "type",
                      direction: sort.field === "type" && sort.direction === "asc" ? "desc" : "asc",
                    });
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  Type {sort.field === "type" && <ChevronDown size={16} />}
                </div>
              </th>
              <th
                scope="col"
                role="button"
                tabIndex={0}
                aria-sort={ariaSort("entity")}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                onClick={() =>
                  setSort({
                    field: "entity",
                    direction: sort.field === "entity" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSort({
                      field: "entity",
                      direction: sort.field === "entity" && sort.direction === "asc" ? "desc" : "asc",
                    });
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  Entity {sort.field === "entity" && <ChevronDown size={16} />}
                </div>
              </th>
              <th
                scope="col"
                role="button"
                tabIndex={0}
                aria-sort={ariaSort("quantity")}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                onClick={() =>
                  setSort({
                    field: "quantity",
                    direction: sort.field === "quantity" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSort({
                      field: "quantity",
                      direction: sort.field === "quantity" && sort.direction === "asc" ? "desc" : "asc",
                    });
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  Quantity {sort.field === "quantity" && <ChevronDown size={16} />}
                </div>
              </th>
              <th
                scope="col"
                role="button"
                tabIndex={0}
                aria-sort={ariaSort("totalAmount")}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                onClick={() =>
                  setSort({
                    field: "totalAmount",
                    direction: sort.field === "totalAmount" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSort({
                      field: "totalAmount",
                      direction: sort.field === "totalAmount" && sort.direction === "asc" ? "desc" : "asc",
                    });
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  Total Amount {sort.field === "totalAmount" && <ChevronDown size={16} />}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              sorted.map((txn) => (
                <tr key={txn.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select transaction ${txn.id}`}
                      checked={selected.has(txn.id)}
                      onChange={() => toggleSelect(txn.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{txn.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{txn.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center justify-center h-6 min-w-[84px] px-3 rounded-full text-xs font-medium ${
                        getTypeBadgeColor(txn.type)
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{txn.entity}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{txn.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                    ${txn.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center justify-center h-6 min-w-[72px] px-3 rounded-full text-xs font-medium ${
                        getStatusBadgeColor(txn.status)
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm flex gap-2">
                    <button
                      onClick={() => onView(txn.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200"
                      title="View Details"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(txn.id)}
                      className="text-green-600 hover:text-green-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-200"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(txn.id)}
                      className="text-red-600 hover:text-red-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-200"
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
