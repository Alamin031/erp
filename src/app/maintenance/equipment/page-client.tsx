"use client";

import { useEffect, useState } from "react";
import { useEquipment } from "@/store/useEquipment";
import { Equipment } from "@/types/equipment";
import { EquipmentTable } from "@/components/Equipment/EquipmentTable";
import { EquipmentCard } from "@/components/Equipment/EquipmentCard";
import { NewEquipmentModal } from "@/components/Equipment/NewEquipmentModal";
import { EditEquipmentModal } from "@/components/Equipment/EditEquipmentModal";
import { EquipmentDetailsDrawer } from "@/components/Equipment/EquipmentDetailsDrawer";
import { StockAdjustmentModal } from "@/components/Equipment/StockAdjustmentModal";
import { MaintenanceLinkModal } from "@/components/Equipment/MaintenanceLinkModal";
import { AssignmentPanel } from "@/components/Equipment/AssignmentPanel";
import { LowStockAlert } from "@/components/Equipment/LowStockAlert";
import { ActivityLog } from "@/components/Equipment/ActivityLog";
import { EquipmentFilterBar } from "@/components/Equipment/EquipmentFilterBar";
import { useToast } from "@/components/toast";

export function EquipmentPageClient() {
  const {
    equipment,
    suppliers,
    pagination,
    loadDemoData,
    filterEquipment,
    setPagination,
    setSelectedEquipmentId,
    selectedEquipmentId,
    markRetired,
  } = useEquipment();

  const { showToast } = useToast();

  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isStockAdjustmentOpen, setIsStockAdjustmentOpen] = useState(false);
  const [isMaintenanceLinkOpen, setIsMaintenanceLinkOpen] = useState(false);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Load demo data on mount
  useEffect(() => {
    if (equipment.length === 0) {
      loadDemoData().catch(() =>
        showToast("Failed to load demo data", "error")
      );
    }
  }, []);

  // Get filtered and paginated equipment
  const filteredEquipment = filterEquipment();
  const totalPages = Math.ceil(filteredEquipment.length / pagination.pageSize) || 1;
  const start = (pagination.page - 1) * pagination.pageSize;
  const pageEquipment = filteredEquipment.slice(
    start,
    start + pagination.pageSize
  );

  // Get selected equipment for edit modal
  const selectedEquipment =
    selectedEquipmentId && isEditModalOpen
      ? equipment.find((e) => e.id === selectedEquipmentId) || null
      : null;

  // Modal handlers
  const handleView = (id: string) => {
    setSelectedEquipmentId(id);
    setIsDetailsDrawerOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedEquipmentId(id);
    setIsEditModalOpen(true);
  };

  const handleAdjust = (id: string) => {
    setSelectedEquipmentId(id);
    setIsStockAdjustmentOpen(true);
  };

  const handleLinkWO = (id: string) => {
    setSelectedEquipmentId(id);
    setIsMaintenanceLinkOpen(true);
  };

  const handleAssign = () => {
    setIsDetailsDrawerOpen(false);
    setIsAssignmentOpen(true);
  };

  const handleAdjustFromDrawer = () => {
    setIsDetailsDrawerOpen(false);
    setIsStockAdjustmentOpen(true);
  };

  const handleCreateWO = () => {
    setIsDetailsDrawerOpen(false);
    setIsMaintenanceLinkOpen(true);
  };

  const handleMarkRetired = () => {
    if (selectedEquipmentId) {
      if (confirm("Mark this equipment as retired? This action cannot be undone.")) {
        markRetired(selectedEquipmentId, "Equipment marked as retired by user");
        showToast("Equipment retired", "success");
        setIsDetailsDrawerOpen(false);
      }
    }
  };

  const closeAllModals = () => {
    setIsNewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailsDrawerOpen(false);
    setIsStockAdjustmentOpen(false);
    setIsMaintenanceLinkOpen(false);
    setIsAssignmentOpen(false);
    setSelectedEquipmentId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Equipment Inventory</h2>
          <p className="text-secondary text-sm mt-1">
            {filteredEquipment.length} equipment {filteredEquipment.length === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsNewModalOpen(true)}
        >
          + New Equipment
        </button>
      </div>

      {/* Low Stock Alert */}
      <LowStockAlert />

      {/* Filter Bar */}
      <EquipmentFilterBar
        suppliers={suppliers}
        equipment={equipment}
        onViewChange={setViewMode}
        currentView={viewMode}
      />

      {/* Equipment Table or Grid */}
      {viewMode === "table" ? (
        <EquipmentTable
          items={pageEquipment}
          pagination={pagination}
          onPaginationChange={(page, pageSize) =>
            setPagination(page, pageSize)
          }
          onView={handleView}
          onEdit={handleEdit}
          onAdjust={handleAdjust}
          onLinkWO={handleLinkWO}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pageEquipment.length === 0 ? (
            <div className="col-span-full text-center py-12 text-secondary">
              <p className="mb-2 text-lg">No equipment found</p>
              <p className="text-sm">Try adjusting your filters or search</p>
            </div>
          ) : (
            pageEquipment.map((item) => (
              <div key={item.id} className="relative group">
                <EquipmentCard item={item} onView={handleView} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                  <button
                    className="action-btn"
                    title="Edit"
                    onClick={() => handleEdit(item.id)}
                  >
                    ✎
                  </button>
                  <button
                    className="action-btn"
                    title="Adjust"
                    onClick={() => handleAdjust(item.id)}
                  >
                    ±
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Grid Pagination */}
      {viewMode === "grid" && filteredEquipment.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-secondary">
            Page {pagination.page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              className="btn btn-secondary"
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination(Math.max(1, pagination.page - 1), pagination.pageSize)
              }
            >
              ← Prev
            </button>
            <button
              className="btn btn-secondary"
              disabled={start + pagination.pageSize >= filteredEquipment.length}
              onClick={() =>
                setPagination(pagination.page + 1, pagination.pageSize)
              }
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Activity Log Section */}
      {equipment.length > 0 && (
        <div className="dashboard-section">
          <h3 className="section-title">Recent Activity</h3>
          <ActivityLog limit={15} />
        </div>
      )}

      {/* Modals */}
      <NewEquipmentModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setSelectedEquipmentId(null);
        }}
      />

      <EditEquipmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEquipmentId(null);
        }}
        equipment={selectedEquipment}
      />

      <EquipmentDetailsDrawer
        id={selectedEquipmentId}
        isOpen={isDetailsDrawerOpen}
        onClose={() => {
          setIsDetailsDrawerOpen(false);
          setSelectedEquipmentId(null);
        }}
        onAssign={handleAssign}
        onAdjust={handleAdjustFromDrawer}
        onCreateWO={handleCreateWO}
        onMarkRetired={handleMarkRetired}
      />

      <StockAdjustmentModal
        isOpen={isStockAdjustmentOpen}
        onClose={() => {
          setIsStockAdjustmentOpen(false);
          setSelectedEquipmentId(null);
        }}
        equipmentId={selectedEquipmentId || ""}
      />

      <MaintenanceLinkModal
        isOpen={isMaintenanceLinkOpen}
        onClose={() => {
          setIsMaintenanceLinkOpen(false);
          setSelectedEquipmentId(null);
        }}
        equipmentId={selectedEquipmentId || ""}
      />

      <AssignmentPanel
        isOpen={isAssignmentOpen}
        onClose={() => {
          setIsAssignmentOpen(false);
          setSelectedEquipmentId(null);
        }}
        equipmentId={selectedEquipmentId || ""}
      />
    </div>
  );
}
