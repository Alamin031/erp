"use client";

import { PriceAdjustment } from "@/types/rates";
import { useToast } from "./toast";

interface PriceAdjustmentQueueProps {
  adjustments: PriceAdjustment[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function PriceAdjustmentQueue({
  adjustments,
  onApprove,
  onReject,
}: PriceAdjustmentQueueProps) {
  const { showToast } = useToast();

  const pendingAdjustments = adjustments.filter((a) => a.approvalStatus === "Pending");
  const approvedAdjustments = adjustments.filter((a) => a.approvalStatus === "Approved");
  const rejectedAdjustments = adjustments.filter((a) => a.approvalStatus === "Rejected");

  const handleApprove = (id: string) => {
    onApprove?.(id);
    showToast("Adjustment approved", "success");
  };

  const handleReject = (id: string) => {
    onReject?.(id);
    showToast("Adjustment rejected", "warning");
  };

  const AdjustmentRow = ({ adjustment, status }: { adjustment: PriceAdjustment; status: "pending" | "approved" | "rejected" }) => (
    <div
      style={{
        padding: "12px",
        background: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        marginBottom: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "4px" }}>
            {adjustment.reason}
          </div>
          <div style={{ fontSize: "11px", color: "var(--secondary)" }}>
            Rate ID: {adjustment.rateId}
          </div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)", textAlign: "right" }}>
          {adjustment.percentage ? `${adjustment.percentage > 0 ? "+" : ""}${adjustment.percentage}%` : `$${adjustment.fixedAmount?.toFixed(2)}`}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--secondary)", marginBottom: "8px" }}>
        <span>
          {new Date(adjustment.effectiveFrom).toLocaleDateString()} to{" "}
          {new Date(adjustment.effectiveTo).toLocaleDateString()}
        </span>
        <span>Requested by: {adjustment.requestedBy}</span>
      </div>

      {status === "pending" && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => handleApprove(adjustment.id)}
            style={{
              padding: "6px 12px",
              fontSize: "11px",
              fontWeight: "600",
              color: "white",
              background: "#059669",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Approve
          </button>
          <button
            onClick={() => handleReject(adjustment.id)}
            style={{
              padding: "6px 12px",
              fontSize: "11px",
              fontWeight: "600",
              color: "white",
              background: "#dc3545",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reject
          </button>
        </div>
      )}

      {status === "approved" && (
        <div style={{ fontSize: "11px", fontWeight: "600", color: "#059669" }}>
          ✓ Approved by {adjustment.approvedBy}
        </div>
      )}

      {status === "rejected" && (
        <div style={{ fontSize: "11px", fontWeight: "600", color: "#dc3545" }}>
          ✗ Rejected by {adjustment.approvedBy}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
      <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
        Price Adjustment Queue
      </h3>

      {pendingAdjustments.length === 0 &&
        approvedAdjustments.length === 0 &&
        rejectedAdjustments.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--secondary)", padding: "24px" }}>
          <p style={{ margin: 0, fontSize: "14px" }}>No adjustments to display</p>
        </div>
      ) : (
        <>
          {pendingAdjustments.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#f59e0b",
                  textTransform: "uppercase",
                }}
              >
                Pending Approval ({pendingAdjustments.length})
              </h4>
              {pendingAdjustments.map((adj) => (
                <AdjustmentRow key={adj.id} adjustment={adj} status="pending" />
              ))}
            </div>
          )}

          {approvedAdjustments.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#059669",
                  textTransform: "uppercase",
                }}
              >
                Approved ({approvedAdjustments.length})
              </h4>
              {approvedAdjustments.map((adj) => (
                <AdjustmentRow key={adj.id} adjustment={adj} status="approved" />
              ))}
            </div>
          )}

          {rejectedAdjustments.length > 0 && (
            <div>
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#dc3545",
                  textTransform: "uppercase",
                }}
              >
                Rejected ({rejectedAdjustments.length})
              </h4>
              {rejectedAdjustments.map((adj) => (
                <AdjustmentRow key={adj.id} adjustment={adj} status="rejected" />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
