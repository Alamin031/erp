"use client";

import { useEffect, useMemo, useState } from "react";
import { useWorkOrders } from "@/store/useWorkOrders";

export function WorkOrderDetailsDrawer({ id, isOpen, onClose, onAssign, onShowToast }: { id: string | null; isOpen: boolean; onClose: ()=>void; onAssign: ()=>void; onShowToast?: (message: string, type: "success" | "error" | "info") => void }) {
  const { workOrders, addComment, startWorkOrder, completeWorkOrder } = useWorkOrders();
  const [comment, setComment] = useState("");
  const item = useMemo(()=> workOrders.find(w=>w.id===id) || null, [workOrders, id]);

  const dueInfo = useMemo(() => {
    if (!item?.dueAt) return { text: "No SLA", color: "var(--secondary)" };
    const now = Date.now();
    const due = new Date(item.dueAt).getTime();
    const diff = due - now;
    if (diff < 0) return { text: `Overdue by ${Math.ceil(Math.abs(diff)/60000)}m`, color: "var(--danger)" };
    if (diff < 60*60*1000) return { text: `${Math.ceil(diff/60000)}m remaining`, color: "var(--warning)" };
    return { text: `${Math.ceil(diff/3600000)}h remaining`, color: "var(--success)" };
  }, [item?.dueAt]);

  useEffect(()=>{ if (!isOpen) setComment(""); }, [isOpen]);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    if (onShowToast) {
      onShowToast(message, type);
    }
  };

  const handleStart = () => {
    if (item) {
      startWorkOrder(item.id);
      showToast("Work order started", "success");
    }
  };

  const handleComplete = () => {
    if (item) {
      completeWorkOrder(item.id);
      showToast("Work order completed", "success");
      onClose();
    }
  };

  if (!isOpen || !item) return null;

  const submitComment = () => {
    if (!comment.trim()) return;
    addComment(item.id, { author: "Supervisor", message: comment.trim() });
    setComment("");
  };

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over" role="dialog" aria-modal>
        <div className="slide-over-header">
          <h2 className="slide-over-title">{item.id} — {item.title}</h2>
          <button className="slide-over-close" onClick={onClose}>✕</button>
        </div>
        <div className="slide-over-body">
          <div className="flex flex-col gap-4">
            <div className="dashboard-section">
              <div className="text-sm text-secondary">Asset</div>
              <div className="font-medium">{item.assetName || item.assetType || "—"}</div>
              <div className="text-sm"><span className="text-secondary">Priority:</span> {item.priority}</div>
              <div className="text-sm"><span className="text-secondary">Assigned:</span> {item.assignedTechName || "Unassigned"}</div>
              <div className="text-sm" style={{ color: dueInfo.color }}><span className="text-secondary">SLA:</span> {dueInfo.text}</div>
            </div>

            <div className="dashboard-section">
              <h3 className="section-title">Description</h3>
              <p className="text-sm whitespace-pre-wrap">{item.description}</p>
            </div>

            {item.attachments && item.attachments.length > 0 && (
              <div className="dashboard-section">
                <h3 className="section-title">Attachments</h3>
                <div className="grid grid-cols-3 gap-2">
                  {item.attachments.map((src, idx)=>(
                    <img key={idx} src={src} alt="attachment" className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              </div>
            )}

            <div className="dashboard-section">
              <h3 className="section-title">Comments</h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {item.comments.length===0 ? (
                  <div className="text-sm text-secondary">No comments yet</div>
                ) : item.comments.map(c => (
                  <div key={c.id} className="p-2 bg-background rounded">
                    <div className="text-xs text-secondary">{new Date(c.timestamp).toLocaleString()} — {c.author}</div>
                    <div className="text-sm">{c.message}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input className="form-input flex-1" placeholder="Add a comment" value={comment} onChange={(e)=>setComment(e.target.value)} />
                <button className="btn btn-primary" onClick={submitComment} disabled={!comment.trim()}>Post</button>
              </div>
            </div>

            <div className="dashboard-section">
              <h3 className="section-title">Logs</h3>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto text-sm">
                {item.logs.map(l => (
                  <div key={l.id} className="flex gap-2">
                    <span className="text-secondary w-40">{new Date(l.timestamp).toLocaleString()}</span>
                    <span>{l.message}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn btn-secondary" onClick={onAssign}>Assign</button>
              {item.status !== "In Progress" && item.status !== "Completed" && (
                <button className="btn btn-secondary" onClick={handleStart}>Start</button>
              )}
              {item.status !== "Completed" && (
                <button className="btn btn-primary" onClick={handleComplete}>Complete</button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
