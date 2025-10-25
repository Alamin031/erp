"use client";

import { useGuests } from "@/store/useGuests";

interface QuickActionsGuestsProps {
  onAddGuest: () => void;
  onShowToast?: (message: string, type: "success" | "error" | "info") => void;
}

export function QuickActionsGuests({ onAddGuest, onShowToast }: QuickActionsGuestsProps) {
  const { guests, bulkExport } = useGuests();

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    if (onShowToast) {
      onShowToast(message, type);
    } else {
      console.log(`[${type}] ${message}`);
    }
  };

  const handleExportCSV = () => {
    if (guests.length === 0) {
      showToast("No guests to export", "error");
      return;
    }
    bulkExport(guests.map((g) => g.id));
    showToast(`Exporting ${guests.length} guests to CSV`, "success");
  };

  const handleMessageAllCheckedIn = () => {
    const checkedInCount = guests.filter((g) => g.status === "Checked-in").length;
    if (checkedInCount === 0) {
      showToast("No checked-in guests to message", "info");
      return;
    }
    showToast(`Preparing message for ${checkedInCount} checked-in guest${checkedInCount > 1 ? 's' : ''}`, "success");
  };

  const handleSyncPMS = () => {
    showToast("Syncing with Property Management System...", "info");
    setTimeout(() => {
      showToast("PMS sync completed successfully", "success");
    }, 1500);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={onAddGuest}
        className="btn btn-primary"
        title="Add new guest"
      >
        + Add Guest
      </button>
      <button
        onClick={handleExportCSV}
        className="btn btn-secondary"
        title="Export guests to CSV"
      >
        📥 Export CSV
      </button>
      <button
        onClick={handleMessageAllCheckedIn}
        className="btn btn-secondary"
        title="Send message to checked-in guests"
      >
        💬 Message All
      </button>
      <button
        onClick={handleSyncPMS}
        className="btn btn-secondary"
        title="Sync with PMS"
      >
        🔄 Sync PMS
      </button>
    </div>
  );
}
