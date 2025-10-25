"use client";

import { useState } from "react";
import { useGuestServices } from "@/store/useGuestServices";
import { useToast } from "./toast";
import { Priority } from "@/types/guest-services";

interface RequestDetailsDrawerProps {
  requestId: string | null;
  onClose: () => void;
  onAssignClick: () => void;
  onAddNoteClick: () => void;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Open: { bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" },
  "In Progress": { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6", border: "rgba(59, 130, 246, 0.3)" },
  Resolved: { bg: "rgba(34, 197, 94, 0.1)", text: "#22c55e", border: "rgba(34, 197, 94, 0.3)" },
  Cancelled: { bg: "rgba(156, 163, 175, 0.1)", text: "#9ca3af", border: "rgba(156, 163, 175, 0.3)" },
};

const priorityColors: Record<string, string> = {
  Urgent: "🔴",
  High: "🟠",
  Normal: "🟡",
  Low: "🟢",
};

export function RequestDetailsDrawer({
  requestId,
  onClose,
  onAssignClick,
  onAddNoteClick,
}: RequestDetailsDrawerProps) {
  const { requests, startRequest, resolveRequest, updatePriority, staff } = useGuestServices();
  const { showToast } = useToast();
  const [isResolvingPrompt, setIsResolvingPrompt] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");

  const request = requestId ? requests.find((r) => r.id === requestId) : null;

  if (!requestId || !request) {
    return null;
  }

  const assignedStaffNames = staff
    .filter((s) => request.assignedStaffIds.includes(s.id))
    .map((s) => s.name)
    .join(", ");

  const handleStartRequest = () => {
    startRequest(requestId, request.assignedStaffIds[0] || "system");
    showToast("Request marked as In Progress", "success");
  };

  const handleResolveRequest = () => {
    resolveRequest(requestId, resolutionNote);
    setResolutionNote("");
    setIsResolvingPrompt(false);
    showToast("Request marked as Resolved", "success");
  };

  const handlePriorityChange = (newPriority: Priority) => {
    updatePriority(requestId, newPriority);
    showToast(`Priority changed to ${newPriority}`, "success");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      {requestId && (
        <div className="slide-over-overlay" onClick={onClose} />
      )}
      <div className="slide-over">
        <div className="slide-over-header" style={{ background: "var(--card-bg)", borderBottom: "2px solid var(--border)" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)", marginBottom: "4px" }}>{request.id}</h2>
            <p style={{ fontSize: "13px", color: "var(--secondary)" }}>{request.serviceType}</p>
          </div>
          <button className="slide-over-close" onClick={onClose} title="Close drawer">
            ✕
          </button>
        </div>

        <div className="slide-over-content" style={{ padding: "24px" }}>
          {/* Status Section */}
          <div style={{ marginBottom: "24px", padding: "16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Status</h3>
            <div className="flex gap-3 items-center">
              <span style={{ 
                padding: "6px 14px", 
                borderRadius: "6px", 
                fontSize: "13px", 
                fontWeight: "600",
                background: statusColors[request.status].bg,
                color: statusColors[request.status].text,
                border: `1px solid ${statusColors[request.status].border}`
              }}>
                {request.status}
              </span>
              <span style={{ fontSize: "24px" }}>{priorityColors[request.priority]}</span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>{request.priority}</span>
            </div>
          </div>

          {/* Guest Information */}
          <div style={{ marginBottom: "24px", padding: "16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Guest Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <div>
                <span style={{ display: "block", fontSize: "11px", color: "var(--secondary)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Guest Name</span>
                <span style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>{request.guestName}</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "11px", color: "var(--secondary)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Room Number</span>
                <span style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>{request.roomNumber}</span>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div style={{ marginBottom: "24px", padding: "16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Request Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <span style={{ display: "block", fontSize: "11px", color: "var(--secondary)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Service Type</span>
                <span style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--foreground)" }}>{request.serviceType}</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "11px", color: "var(--secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Priority</span>
                <div className="flex gap-2">
                  {(["Low", "Normal", "High", "Urgent"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background: request.priority === p ? "var(--primary)" : "var(--card-bg)",
                        color: request.priority === p ? "white" : "var(--foreground)",
                        border: request.priority === p ? "none" : "1px solid var(--border)"
                      }}
                      className={request.priority === p ? "" : "hover:border-primary"}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "11px", color: "var(--secondary)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Requested At</span>
                <span style={{ display: "block", fontSize: "12px", color: "var(--foreground)" }}>{formatDate(request.requestedAt)}</span>
              </div>
              {request.eta && (
                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "var(--secondary)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Expected Time</span>
                  <span style={{ display: "block", fontSize: "12px", color: "var(--foreground)" }}>{formatDate(request.eta)}</span>
                </div>
              )}
              {request.completedAt && (
                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "var(--secondary)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Completed At</span>
                  <span style={{ display: "block", fontSize: "12px", color: "var(--foreground)" }}>{formatDate(request.completedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Assignment */}
          <div style={{ marginBottom: "24px", padding: "16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Assignment</h3>
            <div style={{ padding: "12px", background: "var(--card-bg)", borderRadius: "6px", border: "1px solid var(--border)" }}>
              {assignedStaffNames ? (
                <p style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: "500" }}>👤 {assignedStaffNames}</p>
              ) : (
                <p style={{ fontSize: "13px", color: "var(--secondary)", fontStyle: "italic" }}>Not assigned</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: "24px", padding: "16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Notes</h3>
            <div style={{ padding: "12px", background: "var(--card-bg)", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "13px", color: "var(--foreground)", lineHeight: "1.6" }}>
              {request.notes}
            </div>
          </div>

          {/* Activity Timeline */}
          <div style={{ marginBottom: "24px", padding: "16px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Activity Timeline</h3>
            <div className="flex flex-col gap-3">
              {request.activityLog.map((log) => (
                <div key={log.id} className="flex gap-3" style={{ padding: "10px", background: "var(--card-bg)", borderRadius: "6px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "20px" }}>📝</div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)", textTransform: "capitalize", marginBottom: "2px" }}>
                      {log.action.replace(/_/g, " ")}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--secondary)" }}>{new Date(log.timestamp).toLocaleString()}</p>
                    {log.details && (
                      <p style={{ fontSize: "12px", color: "var(--foreground)", marginTop: "6px" }}>{log.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="slide-over-actions" style={{ padding: "20px", background: "var(--card-bg)", borderTop: "2px solid var(--border)", display: "flex", flexDirection: "column", gap: "10px" }}>
          {request.status === "Open" && (
            <>
              <button
                onClick={onAssignClick}
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                👤 Assign Staff
              </button>
              {request.assignedStaffIds.length > 0 && (
                <button
                  onClick={handleStartRequest}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  ▶️ Start Request
                </button>
              )}
            </>
          )}

          {request.status === "In Progress" && (
            <button
              onClick={() => setIsResolvingPrompt(true)}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              ✓ Resolve Request
            </button>
          )}

          {isResolvingPrompt && (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px" }}>
              <label className="form-label" style={{ marginBottom: "8px" }}>Resolution Notes (Optional)</label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Describe how the request was resolved..."
                className="form-input"
                rows={3}
                style={{ width: "100%", fontSize: "13px", resize: "vertical", minHeight: "80px" }}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setIsResolvingPrompt(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveRequest}
                  className="btn btn-primary flex-1"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          <button
            onClick={onAddNoteClick}
            className="btn btn-secondary"
            style={{ width: "100%" }}
          >
            💬 Add Note
          </button>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ width: "100%" }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
