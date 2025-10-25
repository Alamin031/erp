"use client";

import { useState } from "react";
import { useEquipment } from "@/store/useEquipment";
import { useToast } from "@/components/toast";

export function AssignmentPanel({ isOpen, onClose, equipmentId }: { isOpen: boolean; onClose: ()=>void; equipmentId: string }) {
  const { equipment, assignEquipment } = useEquipment();
  const { showToast } = useToast();
  const item = equipment.find(e=>e.id===equipmentId) || null;
  const [assignee, setAssignee] = useState("");

  if (!isOpen || !item) return null;

  const save = () => {
    if (!assignee.trim()) return;
    assignEquipment(item.id, assignee.trim(), "Admin");
    showToast("Equipment assigned successfully", "success");
    onClose();
  };

  const quickAssignments = [
    { label: "Housekeeping", icon: "🧹" },
    { label: "Maintenance", icon: "🔧" },
    { label: "Kitchen", icon: "🍳" },
    { label: "Front Desk", icon: "🏨" },
    { label: "Room 101", icon: "🚪" },
    { label: "Room 102", icon: "🚪" },
  ];

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ zIndex: 1001 }}>
        <div className="modal-card" style={{ maxWidth: "650px", maxHeight: "90vh", overflow: "auto" }}>
          <div className="modal-header">
            <h2>Assign — {item.name}</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); save(); }}>
            {/* Equipment Info */}
            <div style={{ 
              background: "var(--background)", 
              border: "1px solid var(--border)", 
              borderRadius: "8px", 
              padding: "12px",
              marginBottom: "20px"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", fontSize: "13px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--secondary)" }}>SKU</div>
                  <div style={{ fontWeight: "500", color: "var(--foreground)" }}>{item.sku}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--secondary)" }}>Category</div>
                  <div style={{ fontWeight: "500", color: "var(--foreground)" }}>{item.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--secondary)" }}>Location</div>
                  <div style={{ fontWeight: "500", color: "var(--foreground)" }}>{item.location || "N/A"}</div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Assign to (staff/room/project)</label>
              <input 
                className="form-input" 
                value={assignee} 
                onChange={(e)=>setAssignee(e.target.value)} 
                placeholder="e.g., Housekeeping or Room 305"
                autoFocus
              />
              <p style={{ fontSize: "12px", color: "var(--secondary)", marginTop: "4px" }}>
                Enter staff member name, room number, or project name
              </p>
            </div>

            {/* Quick Assignments */}
            <div className="form-group">
              <label className="form-label">Quick Assignments</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {quickAssignments.map((qa) => (
                  <button
                    key={qa.label}
                    type="button"
                    onClick={() => setAssignee(qa.label)}
                    style={{
                      padding: "8px 12px",
                      background: assignee === qa.label ? "var(--primary)" : "var(--background)",
                      border: `1px solid ${assignee === qa.label ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: assignee === qa.label ? "#fff" : "var(--foreground)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      justifyContent: "center"
                    }}
                  >
                    <span>{qa.icon}</span>
                    <span>{qa.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={!assignee.trim()}
                style={{ opacity: !assignee.trim() ? 0.5 : 1 }}
              >
                Assign Equipment
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
