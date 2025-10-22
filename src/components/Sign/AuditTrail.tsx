"use client";

import { Document } from "@/types/document";
import { Download } from "lucide-react";

interface AuditTrailProps {
  document: Document;
}

const ACTION_COLORS: Record<string, string> = {
  created: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  viewed: "bg-cyan-100 text-cyan-800",
  signed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-emerald-100 text-emerald-800",
  expired: "bg-orange-100 text-orange-800",
  resent: "bg-indigo-100 text-indigo-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export function AuditTrail({ document }: AuditTrailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleExportAudit = () => {
    const csv = [
      ["Timestamp", "User", "Action", "Details"],
      ...document.auditTrail.map((entry) => [
        formatDate(entry.timestamp),
        entry.userName,
        entry.action,
        entry.details,
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
    element.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
    element.setAttribute("download", `audit_trail_${document.id}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--foreground)]">
          Audit Trail ({document.auditTrail.length})
        </h3>
        <button
          onClick={handleExportAudit}
          className="flex items-center gap-1 px-3 py-1 text-xs bg-[var(--primary)] hover:opacity-90 text-white rounded transition-opacity"
        >
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>

      <div className="space-y-2">
        {document.auditTrail.map((entry, idx) => (
          <div
            key={entry.id}
            className="p-3 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${ACTION_COLORS[entry.action] || "bg-gray-300"}`} />
                {idx < document.auditTrail.length - 1 && (
                  <div className="w-0.5 h-8 bg-[var(--border)]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-[var(--foreground)] text-sm">
                      {entry.userName}
                    </p>
                    <p className="text-xs text-[var(--secondary)]">
                      {formatDate(entry.timestamp)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full capitalize whitespace-nowrap ${
                      ACTION_COLORS[entry.action] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {entry.action.replace(/_/g, " ")}
                  </span>
                </div>

                <p className="text-sm text-[var(--foreground)] mt-1">
                  {entry.details}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {document.auditTrail.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[var(--secondary)]">
            No audit entries yet
          </p>
        </div>
      )}
    </div>
  );
}
