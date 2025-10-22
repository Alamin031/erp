"use client";

import { useGuests } from "@/store/useGuests";
import { useToast } from "./toast";

interface QuickActionsGuestsProps {
  onAddGuest: () => void;
}

export function QuickActionsGuests({ onAddGuest }: QuickActionsGuestsProps) {
  const { guests, bulkExport } = useGuests();
  const { showToast } = useToast();

  const handleExportCSV = () => {
    if (guests.length === 0) {
      showToast("No guests to export", "error");
      return;
    }
    bulkExport(guests.map((g) => g.id));
  };

  const handleMessageAllCheckedIn = () => {
    const checkedInCount = guests.filter((g) => g.status === "Checked-in").length;
    showToast(`Message ready to send to ${checkedInCount} guests`, "success");
  };

  const handleSyncPMS = () => {
    showToast("PMS sync completed", "success");
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
