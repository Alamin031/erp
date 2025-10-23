"use client";

import { useMemo, useState } from "react";
import { StockOption } from "@/types/securities";
import { useSecurities } from "@/store/useSecurities";
import { useToast } from "@/components/toast";
import { ChevronDown } from "lucide-react";

interface Props {
  items: StockOption[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

type SortField = "employeeName" | "quantity" | "grantDate";
interface SortState {
  field: SortField;
  direction: "asc" | "desc";
}

export function StockOptionsTable({ items, onEdit, onDelete }: Props) {
  const { deleteStockOption } = useSecurities();
  const { showToast } = useToast();
  const [sort, setSort] = useState<SortState>({ field: "grantDate", direction: "desc" });

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      if (sort.field === "quantity") {
        return sort.direction === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity;
      }
      if (sort.field === "grantDate") {
        const aTime = new Date(a.grantDate).getTime();
        const bTime = new Date(b.grantDate).getTime();
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
      case "Active":
        return "bg-green-100 text-green-800";
      case "Vested":
        return "bg-blue-100 text-blue-800";
      case "Exercised":
        return "bg-purple-100 text-purple-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateVestingProgress = (option: StockOption): number => {
    const vested = option.vestingSchedule?.vestedShares || 0;
    const total = option.vestingSchedule?.totalShares || option.quantity;
    return total > 0 ? (vested / total) * 100 : 0;
  };

  const confirmDelete = (id: string) => {
    if (confirm("Delete this stock option?")) {
      deleteStockOption(id);
      showToast("Stock option deleted", "success");
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
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() =>
                setSort({
                  field: "grantDate",
                  direction: sort.field === "grantDate" && sort.direction === "asc" ? "desc" : "asc",
                })
              }
            >
              <div className="flex items-center gap-2">
                Grant Date {sort.field === "grantDate" && <ChevronDown size={16} />}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vesting Period</th>
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
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Strike Price</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vesting Progress</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                No stock options found
              </td>
            </tr>
          ) : (
            sorted.map((option) => {
              const vestingProgress = calculateVestingProgress(option);
              return (
                <tr key={option.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{option.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{option.grantDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{option.vestingPeriod} months</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{option.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">${option.strikePrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${vestingProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{vestingProgress.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(option.status)}`}>
                      {option.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm flex gap-2">
                    <button
                      onClick={() => onEdit(option.id)}
                      className="text-green-600 hover:text-green-800 font-medium"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(option.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
