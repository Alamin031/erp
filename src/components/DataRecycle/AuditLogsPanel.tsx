"use client";

import { useState } from "react";
import { useRecycleBin } from "@/store/useRecycleBin";
import { Download, ChevronDown, ChevronUp } from "lucide-react";

interface AuditLogsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACTION_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  restore: { bg: "bg-green-100", text: "text-green-800", label: "Restored" },
  archive: { bg: "bg-blue-100", text: "text-blue-800", label: "Archived" },
  delete: { bg: "bg-red-100", text: "text-red-800", label: "Deleted" },
  policy_change: { bg: "bg-purple-100", text: "text-purple-800", label: "Policy Changed" },
  hold_placed: { bg: "bg-amber-100", text: "text-amber-800", label: "Hold Placed" },
  hold_removed: { bg: "bg-gray-100", text: "text-gray-800", label: "Hold Removed" },
};

export function AuditLogsPanel({ isOpen, onClose }: AuditLogsPanelProps) {
  const { auditLogs } = useRecycleBin();

  const [filterUser, setFilterUser] = useState<string>("");
  const [filterAction, setFilterAction] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    if (filterUser && !log.userName.toLowerCase().includes(filterUser.toLowerCase())) {
      return false;
    }
    if (filterAction && log.action !== filterAction) {
      return false;
    }
    return true;
  });

  const uniqueUsers = Array.from(new Set(auditLogs.map((log) => log.userName)));
  const uniqueActions = Array.from(new Set(auditLogs.map((log) => log.action)));

  const handleExport = () => {
    const csv = [
      ["Date", "User", "Action", "Record ID", "Module", "Details"],
      ...filteredLogs.map((log) => [
        new Date(log.timestamp).toLocaleString(),
        log.userName,
        log.action,
        log.recordId || "",
        log.recordModule || "",
        log.details,
      ]),
    ]
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
          )
          .join(",")
      )
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
    );
    element.setAttribute(
      "download",
      `audit_logs_${new Date().toISOString().split("T")[0]}.csv`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[var(--card-bg)] rounded-lg border border-[var(--border)] shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 border-b border-[var(--border)] bg-[var(--card-bg)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Audit Logs
              </h2>
              <p className="text-sm text-[var(--secondary)] mt-1">
                All actions performed in the recycle bin
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white rounded-lg font-medium transition-opacity"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
                Filter by User
              </label>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="">All Users</option>
                {uniqueUsers.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
                Filter by Action
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="">All Actions</option>
                {uniqueActions.map((action) => (
                  <option key={action} value={action}>
                    {ACTION_COLORS[action]?.label || action}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--secondary)]">No audit logs found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => {
                const colors = ACTION_COLORS[log.action] || {
                  bg: "bg-gray-100",
                  text: "text-gray-800",
                  label: log.action,
                };
                const isExpanded = expandedId === log.id;

                return (
                  <div
                    key={log.id}
                    className="border border-[var(--border)] rounded-lg overflow-hidden hover:border-[var(--primary)] transition-colors"
                  >
                    {/* Summary */}
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : log.id)
                      }
                      className="w-full text-left px-4 py-3 hover:bg-[var(--background)] transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 flex items-center gap-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} flex-shrink-0`}
                        >
                          {colors.label}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            {log.userName}
                          </p>
                          <p className="text-xs text-[var(--secondary)] truncate">
                            {log.details}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-[var(--secondary)]">
                            {formatDate(log.timestamp)}
                          </p>
                        </div>
                      </div>
                      {(log.recordId || log.affectedRecordCount) && (
                        <div className="flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[var(--secondary)]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--secondary)]" />
                          )}
                        </div>
                      )}
                    </button>

                    {/* Details */}
                    {isExpanded && (log.recordId || log.affectedRecordCount) && (
                      <div className="border-t border-[var(--border)] px-4 py-3 bg-[var(--background)] text-sm">
                        <dl className="space-y-2">
                          {log.recordId && (
                            <div className="flex gap-2">
                              <dt className="text-[var(--secondary)] min-w-fit">
                                Record ID:
                              </dt>
                              <dd className="text-[var(--foreground)] font-mono">
                                {log.recordId}
                              </dd>
                            </div>
                          )}
                          {log.recordModule && (
                            <div className="flex gap-2">
                              <dt className="text-[var(--secondary)] min-w-fit">
                                Module:
                              </dt>
                              <dd className="text-[var(--foreground)]">
                                {log.recordModule}
                              </dd>
                            </div>
                          )}
                          {log.affectedRecordCount && (
                            <div className="flex gap-2">
                              <dt className="text-[var(--secondary)] min-w-fit">
                                Records Affected:
                              </dt>
                              <dd className="text-[var(--foreground)]">
                                {log.affectedRecordCount}
                              </dd>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <dt className="text-[var(--secondary)] min-w-fit">
                              Details:
                            </dt>
                            <dd className="text-[var(--foreground)]">
                              {log.details}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-[var(--border)] px-6 py-4 bg-[var(--card-bg)] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--background)] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
