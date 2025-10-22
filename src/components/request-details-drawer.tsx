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

const statusColors: Record<string, string> = {
  Open: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-100 text-gray-800",
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

  const request = requests.find((r) => r.id === requestId);

  if (!requestId || !request) return null;

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
        <div className="slide-over-header">
          <div>
            <h2>{request.id}</h2>
            <p className="text-sm text-secondary mt-1">{request.serviceType}</p>
          </div>
          <button className="slide-over-close" onClick={onClose} title="Close drawer">
            ✕
          </button>
        </div>

        <div className="slide-over-content">
          {/* Status Section */}
          <div className="details-section">
            <h3 className="details-title">Status</h3>
            <div className="flex gap-2 items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[request.status]}`}>
                {request.status}
              </span>
              <span className="text-xl">{priorityColors[request.priority]}</span>
            </div>
          </div>

          {/* Guest Information */}
          <div className="details-section">
            <h3 className="details-title">Guest Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Guest Name</span>
                <span className="detail-value">{request.guestName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Room Number</span>
                <span className="detail-value">{request.roomNumber}</span>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="details-section">
            <h3 className="details-title">Request Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Service Type</span>
                <span className="detail-value">{request.serviceType}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Priority</span>
                <div className="flex gap-2">
                  {(["Low", "Normal", "High", "Urgent"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      className={`px-2 py-1 text-xs rounded cursor-pointer transition ${
                        request.priority === p
                          ? "bg-primary text-white"
                          : "bg-background border border-border hover:border-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Requested At</span>
                <span className="detail-value text-xs">{formatDate(request.requestedAt)}</span>
              </div>
              {request.eta && (
                <div className="detail-item">
                  <span className="detail-label">Expected Time</span>
                  <span className="detail-value text-xs">{formatDate(request.eta)}</span>
                </div>
              )}
              {request.completedAt && (
                <div className="detail-item">
                  <span className="detail-label">Completed At</span>
                  <span className="detail-value text-xs">{formatDate(request.completedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Assignment */}
          <div className="details-section">
            <h3 className="details-title">Assignment</h3>
            <div className="bg-background p-3 rounded-lg">
              {assignedStaffNames ? (
                <p className="text-sm text-foreground">{assignedStaffNames}</p>
              ) : (
                <p className="text-sm text-secondary italic">Not assigned</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="details-section">
            <h3 className="details-title">Notes</h3>
            <div className="details-notes">{request.notes}</div>
          </div>

          {/* Activity Timeline */}
          <div className="details-section">
            <h3 className="details-title">Activity Timeline</h3>
            <div className="flex flex-col gap-2">
              {request.activityLog.map((log) => (
                <div key={log.id} className="flex gap-3 p-2 bg-background rounded-lg">
                  <div className="text-2xl">📝</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground capitalize">
                      {log.action.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-secondary">{new Date(log.timestamp).toLocaleString()}</p>
                    {log.details && (
                      <p className="text-xs text-foreground mt-1">{log.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="slide-over-actions">
          {request.status === "Open" && (
            <>
              <button
                onClick={onAssignClick}
                className="btn btn-primary"
              >
                👤 Assign Staff
              </button>
              {request.assignedStaffIds.length > 0 && (
                <button
                  onClick={handleStartRequest}
                  className="btn btn-primary"
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
            >
              ✓ Resolve Request
            </button>
          )}

          {isResolvingPrompt && (
            <div className="border-t border-border pt-4">
              <label className="form-label">Resolution Notes (Optional)</label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Describe how the request was resolved..."
                className="form-textarea w-full text-sm"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
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
          >
            💬 Add Note
          </button>

          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
