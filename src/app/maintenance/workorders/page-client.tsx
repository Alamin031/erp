"use client";

import { useEffect, useMemo, useState } from "react";
import { useWorkOrders } from "@/store/useWorkOrders";
import { FiltersBar } from "@/components/WorkOrders/FiltersBar";
import { SearchBar } from "@/components/WorkOrders/SearchBar";
import { WorkOrderStatsCards } from "@/components/WorkOrders/WorkOrderStatsCards";
import { WorkOrdersTable } from "@/components/WorkOrders/WorkOrdersTable";
import { WorkOrderQueue } from "@/components/WorkOrders/WorkOrderQueue";
import { MaintenanceCalendar } from "@/components/WorkOrders/MaintenanceCalendar";
import { NewWorkOrderModal } from "@/components/WorkOrders/NewWorkOrderModal";
import { AssignTechModal } from "@/components/WorkOrders/AssignTechModal";
import { WorkOrderDetailsDrawer } from "@/components/WorkOrders/WorkOrderDetailsDrawer";
import { ToastContainer, useToast } from "@/components/toast";

export function WorkOrdersPageClient() {
  const { workOrders, loadDemoData, filterWorkOrders, pagination, setPagination } = useWorkOrders();
  const [query, setQuery] = useState("");
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [assignFor, setAssignFor] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const { toasts, removeToast, showToast } = useToast();

  useEffect(()=>{ if (workOrders.length===0) loadDemoData(); }, [workOrders.length, loadDemoData]);

  const visible = useMemo(()=>{
    const list = filterWorkOrders();
    const q = query.toLowerCase().trim();
    if (!q) return list;
    return list.filter(w => w.id.toLowerCase().includes(q) || w.title.toLowerCase().includes(q) || (w.assetName||'').toLowerCase().includes(q));
  }, [filterWorkOrders, query]);

  const handleExport = () => {
    showToast(`Exporting ${visible.length} work orders to CSV`, "success");
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Work Orders</h1>
          <p className="dashboard-subtitle">Manage maintenance work orders</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <WorkOrderStatsCards />
        </div>

        {/* Search and Actions */}
        <div className="dashboard-section" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: "1 1 300px" }}>
                <SearchBar onSearch={setQuery} />
              </div>
              <button className="btn btn-primary" onClick={()=>setIsNewOpen(true)}>
                + New Work Order
              </button>
              <button className="btn btn-secondary" onClick={handleExport}>
                📥 Export CSV
              </button>
            </div>
            <FiltersBar />
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "24px" }}>
          {/* Work Orders Table - Full Width */}
          <div className="dashboard-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                All Work Orders
              </h3>
              <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
                {visible.length} work order{visible.length !== 1 ? 's' : ''}
              </span>
            </div>
            <WorkOrdersTable
              items={visible}
              pagination={pagination}
              onPaginationChange={setPagination}
              onView={(id)=>setViewId(id)}
              onAssign={(id)=>setAssignFor(id)}
            />
          </div>
        </div>

        {/* Bottom Grid: Queue and Calendar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Work Order Queue */}
          <div className="dashboard-section">
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
              Work Order Queue
            </h3>
            <WorkOrderQueue onAssign={(id)=>setAssignFor(id)} onStart={(id)=>setViewId(id)} onComplete={(id)=>setViewId(id)} />
          </div>

          {/* Maintenance Calendar */}
          <div className="dashboard-section">
            <MaintenanceCalendar />
          </div>
        </div>
      </div>

      <NewWorkOrderModal isOpen={isNewOpen} onClose={()=>setIsNewOpen(false)} />
      <AssignTechModal isOpen={!!assignFor} onClose={()=>setAssignFor(null)} workOrderId={assignFor || ''} />
      <WorkOrderDetailsDrawer 
        id={viewId} 
        isOpen={!!viewId} 
        onClose={()=>setViewId(null)} 
        onAssign={()=>{ if(viewId){ setAssignFor(viewId);} }}
        onShowToast={showToast}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
