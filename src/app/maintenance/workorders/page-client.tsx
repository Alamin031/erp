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
  const { toasts, removeToast } = useToast();

  useEffect(()=>{ if (workOrders.length===0) loadDemoData(); }, [workOrders.length, loadDemoData]);

  const visible = useMemo(()=>{
    const list = filterWorkOrders();
    const q = query.toLowerCase().trim();
    if (!q) return list;
    return list.filter(w => w.id.toLowerCase().includes(q) || w.title.toLowerCase().includes(q) || (w.assetName||'').toLowerCase().includes(q));
  }, [filterWorkOrders, query]);

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Work Orders</h1>
          <p className="dashboard-subtitle">Manage maintenance work orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <WorkOrderStatsCards />
        </div>

        <div className="dashboard-section flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <SearchBar onSearch={setQuery} />
            <button className="btn btn-primary" onClick={()=>setIsNewOpen(true)}>+ New Work Order</button>
          </div>
          <FiltersBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="dashboard-section">
            <h3 className="section-title">Work Order Queue</h3>
            <WorkOrderQueue onAssign={(id)=>setAssignFor(id)} onStart={(id)=>setViewId(id)} onComplete={(id)=>setViewId(id)} />
          </div>
          <div className="lg:col-span-2">
            <WorkOrdersTable
              items={visible}
              pagination={pagination}
              onPaginationChange={setPagination}
              onView={(id)=>setViewId(id)}
              onAssign={(id)=>setAssignFor(id)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2" />
          <div className="flex flex-col gap-6">
            <MaintenanceCalendar />
          </div>
        </div>
      </div>

      <NewWorkOrderModal isOpen={isNewOpen} onClose={()=>setIsNewOpen(false)} />
      <AssignTechModal isOpen={!!assignFor} onClose={()=>setAssignFor(null)} workOrderId={assignFor || ''} />
      <WorkOrderDetailsDrawer id={viewId} isOpen={!!viewId} onClose={()=>setViewId(null)} onAssign={()=>{ if(viewId){ setAssignFor(viewId);} }} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
