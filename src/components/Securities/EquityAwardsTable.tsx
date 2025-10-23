"use client";

import { useMemo, useState } from "react";
import { EquityAward } from "@/types/securities";
import { useSecurities } from "@/store/useSecurities";
import { useToast } from "@/components/toast";
import { ChevronDown } from "lucide-react";

interface Props {
  items: EquityAward[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewHistory: (id: string) => void;
}

type SortField = "employeeName" | "quantity" | "vestingDate";
interface SortState {
  field: SortField;
  direction: "asc" | "desc";
}

export function EquityAwardsTable({ items, onEdit, onDelete, onViewHistory }: Props) {
  const { deleteEquityAward } = useSecurities();
  const { showToast } = useToast();
  const [sort, setSort] = useState<SortState>({ field: "vestingDate", direction: "desc" });

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      if (sort.field === "quantity") {
        return sort.direction === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity;
      }
      if (sort.field === "vestingDate") {
        const aTime = new Date(a.vestingDate).getTime();
        const bTime = new Date(b.vestingDate).getTime();
        return sort.direction === "asc" ? aTime - bTime : bTime - aTime;
      }
      return sort.direction === "asc"
        ? a.employeeName.localeCompare(b.employeeName)
        : b.employeeName.localeCompare(a.employeeName);
    });
    return copy;
  }, [items, sort]);

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "Vested":
        return "bg-green-100 text-green-800";
      case "Revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAwardBadgeColor = (awardType: string): string => {
    switch (awardType) {
      case "RSU":
        return "bg-purple-100 text-purple-800";
      case "Bonus":
        return "bg-orange-100 text-orange-800";
      case "Performance":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const confirmDelete = (id: string) => {
    if (confirm("Delete this equity award?")) {
      deleteEquityAward(id);
      showToast("Equity award deleted", "success");
      onDelete(id);
    }
  };

  return (
    <div className="table-container border rounded-lg overflow-x-auto">
      <table className="reservations-table w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() =>
                setSort({
                  field: "employeeName",
                  direction: sort.field === "employeeName" && sort.direction === "asc" ? "desc" : "asc",
                })
              }
            >
              <div className="flex items-center gap-2">
                Employee {sort.field === "employeeName" && <ChevronDown size={16} />}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Award Type</th>
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() =>
                setSort({
                  field: "quantity",
                  direction: sort.field === "quantity" && sort.direction === "asc" ? "desc" : "asc",
                })
              }
            >
              <div className="flex items-center gap-2">
                Quantity {sort.field === "quantity" && <ChevronDown size={16} />}
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() =>
                setSort({
                  field: "vestingDate",
                  direction: sort.field === "vestingDate" && sort.direction === "asc" ? "desc" : "asc",
                })
              }
            >
              <div className="flex items-center gap-2">
                Vesting Date {sort.field === "vestingDate" && <ChevronDown size={16} />}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No equity awards found
              </td>
            </tr>
          ) : (
            sorted.map((award) => (
              <tr key={award.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{award.employeeName}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAwardBadgeColor(award.awardType)}`}>
                    {award.awardType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{award.quantity.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{award.vestingDate}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(award.status)}`}>
                    {award.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm flex gap-2">
                  <button
                    onClick={() => onViewHistory(award.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    title="View History"
                  >
                    History
                  </button>
                  <button
                    onClick={() => onEdit(award.id)}
                    className="text-green-600 hover:text-green-800 font-medium"
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(award.id)}
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
  );
}
