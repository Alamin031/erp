"use client";

import { useMemo } from "react";
import { useEquipment } from "@/store/useEquipment";
import { DepreciationChart } from "./DepreciationChart";

export function EquipmentDetailsDrawer({ id, isOpen, onClose, onAssign, onAdjust, onCreateWO, onMarkRetired }: { id: string | null; isOpen: boolean; onClose: ()=>void; onAssign: ()=>void; onAdjust: ()=>void; onCreateWO: ()=>void; onMarkRetired?: ()=>void }) {
  const { equipment, history } = useEquipment();
  const item = useMemo(()=> equipment.find(e=>e.id===id) || null, [equipment, id]);
  const logs = useMemo(()=> history.filter(h=>h.equipmentId===id).sort((a,b)=> new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime()), [history, id]);

  if (!isOpen || !item) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return { bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.3)", color: "#22c55e" };
      case "In Use": return { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", color: "#3b82f6" };
      case "Under Maintenance": return { bg: "rgba(251, 191, 36, 0.1)", border: "rgba(251, 191, 36, 0.3)", color: "#fbbf24" };
      case "Retired": return { bg: "rgba(156, 163, 175, 0.1)", border: "rgba(156, 163, 175, 0.3)", color: "#9ca3af" };
      default: return { bg: "rgba(156, 163, 175, 0.1)", border: "rgba(156, 163, 175, 0.3)", color: "#9ca3af" };
    }
  };

  const statusStyle = getStatusColor(item.status);

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over" role="dialog" aria-modal>
        <div className="slide-over-header">
          <div>
            <h2 className="slide-over-title">{item.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <span style={{ 
                padding: "4px 12px", 
                borderRadius: "12px", 
                fontSize: "11px", 
                fontWeight: "600",
                background: statusStyle.bg,
                border: `1px solid ${statusStyle.border}`,
                color: statusStyle.color
              }}>
                {item.status}
              </span>
              <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
                SKU: {item.sku || "N/A"}
              </span>
            </div>
          </div>
          <button className="slide-over-close" onClick={onClose}>✕</button>
        </div>
        <div className="slide-over-body">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Stock Information Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Stock Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Current Quantity</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "600", fontSize: "20px" }}>{item.quantity}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Min Stock</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "600", fontSize: "20px" }}>{item.minStock}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Location</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "600", fontSize: "14px" }}>{item.location || "—"}</div>
                </div>
              </div>
            </div>

            {/* Equipment Details Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Equipment Details
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "13px" }}>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Category</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{item.category}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Serial Number</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{item.serialNumber || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Purchase Date</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{item.purchaseDate || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Purchase Price</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>${item.purchasePrice || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Supplier ID</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{item.supplierId || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Warranty Expiry</div>
                  <div style={{ color: "var(--foreground)", fontWeight: "500" }}>{item.warrantyExpiry || "—"}</div>
                </div>
              </div>
            </div>

            {/* Depreciation Card */}
            {item.depreciationMethod !== "None" && (
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Depreciation
                </h3>
                <div style={{ marginBottom: "8px" }}>
                  <div style={{ color: "var(--secondary)", fontSize: "11px" }}>Method: {item.depreciationMethod}</div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px" }}>Rate: {item.depreciationRate}%</div>
                </div>
                <DepreciationChart item={item} />
              </div>
            )}

            {/* Attachments Card */}
            {(item.images && item.images.length > 0) && (
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Attachments
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {item.images.map((src, idx) => (
                    <img 
                      key={idx} 
                      src={src} 
                      alt="attachment" 
                      style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Maintenance Records Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Maintenance Records
              </h3>
              <div style={{ fontSize: "13px" }}>
                <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "4px" }}>Last Maintenance</div>
                <div style={{ color: "var(--foreground)", fontWeight: "500" }}>
                  {item.lastMaintenanceAt ? new Date(item.lastMaintenanceAt).toLocaleString() : "No maintenance recorded"}
                </div>
              </div>
            </div>

            {/* Audit History Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Audit History
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto" }}>
                {logs.length === 0 ? (
                  <div style={{ color: "var(--secondary)", fontSize: "13px" }}>No history available</div>
                ) : logs.map(l => (
                  <div 
                    key={l.id} 
                    style={{ 
                      padding: "8px 12px", 
                      background: "var(--background)", 
                      borderRadius: "6px",
                      border: "1px solid var(--border)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "8px" }}>
                      <span style={{ color: "var(--foreground)", fontSize: "13px", flex: 1 }}>{l.details}</span>
                      <span style={{ color: "var(--secondary)", fontSize: "11px", whiteSpace: "nowrap" }}>
                        {new Date(l.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Quick Actions
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button className="btn btn-secondary" onClick={onAssign}>👤 Assign Equipment</button>
                <button className="btn btn-secondary" onClick={onAdjust}>± Adjust Stock</button>
                <button className="btn btn-secondary" onClick={onCreateWO}>🔧 Create Work Order</button>
                <button 
                  className="btn btn-primary" 
                  onClick={onMarkRetired} 
                  disabled={item?.status === "Retired"}
                  style={{ opacity: item?.status === "Retired" ? 0.5 : 1 }}
                >
                  🗑️ Mark as Retired
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
