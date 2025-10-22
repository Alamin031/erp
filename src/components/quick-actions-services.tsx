"use client";

import { useGuestServices } from "@/store/useGuestServices";
import { useToast } from "./toast";

interface QuickActionsProps {
  onAddRequest: () => void;
}

export function QuickActions({ onAddRequest }: QuickActionsProps) {
  const { requests } = useGuestServices();
  const { showToast } = useToast();

  const handleExportCSV = () => {
    const openRequests = requests.filter((r) => r.status !== "Resolved" && r.status !== "Cancelled");
    
    const headers = ["ID", "Guest", "Room", "Type", "Priority", "Status", "Assigned To"];
    const rows = openRequests.map((r) => [
      r.id,
      r.guestName,
      r.roomNumber,
      r.serviceType,
      r.priority,
      r.status,
      r.assignedStaffIds.length > 0 ? "Assigned" : "Unassigned",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `requests-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToast("CSV exported successfully", "success");
  };

  const handleRefresh = () => {
    showToast("Requests refreshed", "success");
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={onAddRequest}
        className="btn btn-primary"
        title="Add new service request"
      >
        + Add Request
      </button>
      <button
        onClick={handleExportCSV}
        className="btn btn-secondary"
        title="Export today's requests to CSV"
      >
        📥 Export CSV
      </button>
      <button
        onClick={handleRefresh}
        className="btn btn-secondary"
        title="Refresh request queue"
      >
        🔄 Refresh
      </button>
    </div>
  );
}
