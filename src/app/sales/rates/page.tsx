"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { Rate, RateFilters, Channel } from "@/types/rates";
import { useRates } from "@/store/useRates";
import { RatesSummaryCards } from "@/components/rates-summary-cards";
import { RatesFilterBar } from "@/components/rates-filter-bar";
import { RatesTable } from "@/components/rates-table";
import { RateCalendarView } from "@/components/rate-calendar-view";
import { RateFormModal } from "@/components/rate-form-modal";
import { RateRulesBuilder } from "@/components/rate-rules-builder";
import { RateDetailsDrawer } from "@/components/rate-details-drawer";
import { ChannelOverrides } from "@/components/channel-overrides";
import { BulkUpload } from "@/components/bulk-upload";
import { PriceAdjustmentQueue } from "@/components/price-adjustment-queue";
import { useToast } from "@/components/toast";

type ViewMode = "table" | "calendar";

export default function RatesPage() {
  const { showToast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isChannelOverridesOpen, setIsChannelOverridesOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isRulesBuilderOpen, setIsRulesBuilderOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<Rate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [session, setSession] = useState<any>(null);
  const [showQueue, setShowQueue] = useState(false);

  const {
    rates,
    rules,
    adjustmentQueue,
    auditLogs,
    filters,
    selectedRate,
    setRates,
    setRules,
    setFilters,
    setSelectedRate,
    addRate,
    updateRate,
    deleteRate,
    cloneRate,
    addRule,
    filterRates,
    approveAdjustment,
    rejectAdjustment,
  } = useRates();

  useEffect(() => {
    setIsClient(true);
    getSession().then((sess) => {
      if (!sess) {
        redirect("/login");
      }
      setSession(sess);
      const userRole = (sess.user as any).role;
      const allowedRoles = ["super_admin", "general_manager", "sales_marketing"];
      if (!allowedRoles.includes(userRole)) {
        redirect("/unauthorized");
      }

      // Load mock data if empty
      if (rates.length === 0) {
        const mockRates = [
          {
            id: "R-001",
            code: "STD-BASE",
            name: "Standard Room Base Rate",
            roomType: "Standard",
            rateType: "Base" as const,
            channels: ["All"] as Channel[],
            effectiveFrom: "2025-01-01",
            effectiveTo: "2025-12-31",
            basePrice: 99.0,
            currency: "USD",
            minStay: 1,
            priority: 1,
            status: "Active" as const,
            rules: ["RULE-001"],
            notes: "Standard room base rate",
            createdBy: "admin@orionhotel.com",
            createdAt: "2025-01-01T08:00:00Z",
            updatedBy: "admin@orionhotel.com",
            updatedAt: "2025-09-10T10:00:00Z",
          },
          {
            id: "R-002",
            code: "DLX-BASE",
            name: "Deluxe Room Base Rate",
            roomType: "Deluxe",
            rateType: "Base" as const,
            channels: ["All"] as Channel[],
            effectiveFrom: "2025-01-01",
            effectiveTo: "2025-12-31",
            basePrice: 149.0,
            currency: "USD",
            minStay: 1,
            priority: 1,
            status: "Active" as const,
            rules: ["RULE-001", "RULE-002"],
            notes: "Deluxe room base rate",
            createdBy: "admin@orionhotel.com",
            createdAt: "2025-01-01T08:00:00Z",
            updatedBy: "admin@orionhotel.com",
            updatedAt: "2025-09-10T10:00:00Z",
          },
          {
            id: "R-003",
            code: "SUITE-BASE",
            name: "Suite Base Rate",
            roomType: "Suite",
            rateType: "Base" as const,
            channels: ["All"] as Channel[],
            effectiveFrom: "2025-01-01",
            effectiveTo: "2025-12-31",
            basePrice: 249.0,
            currency: "USD",
            minStay: 2,
            priority: 1,
            status: "Active" as const,
            rules: ["RULE-001", "RULE-003"],
            notes: "Premium suite rate",
            createdBy: "admin@orionhotel.com",
            createdAt: "2025-01-01T08:00:00Z",
            updatedBy: "admin@orionhotel.com",
            updatedAt: "2025-09-10T10:00:00Z",
          },
        ];
        setRates(mockRates);

        const mockRules = [
          {
            id: "RULE-001",
            name: "Weekend Rate Increase",
            description: "Increase rate by 20% on weekends",
            operator: "percentage_increase" as const,
            value: 20,
            weekdayDifferentials: {
              monday: 0,
              tuesday: 0,
              wednesday: 0,
              thursday: 0,
              friday: 10,
              saturday: 20,
              sunday: 15,
            },
            priority: 1,
            createdAt: "2025-01-01T08:00:00Z",
            updatedAt: "2025-01-01T08:00:00Z",
          },
          {
            id: "RULE-002",
            name: "High Occupancy Surge",
            description: "Add 15% to rate when occupancy exceeds 80%",
            operator: "percentage_increase" as const,
            value: 15,
            priority: 2,
            createdAt: "2025-02-15T10:00:00Z",
            updatedAt: "2025-02-15T10:00:00Z",
          },
          {
            id: "RULE-003",
            name: "Extended Stay Discount",
            description: "Reduce rate by 10% for stays longer than 7 nights",
            operator: "percentage_decrease" as const,
            value: 10,
            priority: 3,
            createdAt: "2025-03-01T09:00:00Z",
            updatedAt: "2025-03-01T09:00:00Z",
          },
        ];
        setRules(mockRules);
      }
    });
  }, []);

  if (!isClient || !session) {
    return null;
  }

  const roomTypes = [...new Set(rates.map((r) => r.roomType))];
  const filteredRates = filterRates();

  const handleAddRate = () => {
    setEditingRate(null);
    setIsFormModalOpen(true);
  };

  const handleEditRate = (rate: Rate) => {
    setEditingRate(rate);
    setIsFormModalOpen(true);
  };

  const handleSaveRate = (rate: Rate) => {
    if (editingRate) {
      updateRate(editingRate.id, rate);
      showToast("Rate updated successfully", "success");
    } else {
      addRate(rate);
      showToast("Rate created successfully", "success");
    }
    setIsFormModalOpen(false);
    setEditingRate(null);
  };

  const handleCloneRate = (rate: Rate) => {
    setEditingRate(rate);
    cloneRate(rate.id, { code: `${rate.code}-CLONE`, name: `${rate.name} (Clone)` });
    showToast("Rate cloned successfully", "success");
  };

  const handleDeleteRate = (id: string) => {
    deleteRate(id);
    showToast("Rate deleted successfully", "success");
  };

  const handleViewRate = (rate: Rate) => {
    setSelectedRate(rate);
    setIsDetailDrawerOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">🏷️ Room Rates</h1>
          <p className="dashboard-subtitle">Set and manage room rates</p>
        </div>

        <RatesSummaryCards rates={rates} adjustmentQueue={adjustmentQueue} />

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setViewMode("table")}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "600",
                color: viewMode === "table" ? "white" : "var(--secondary)",
                background: viewMode === "table" ? "var(--primary)" : "transparent",
                border: viewMode === "table" ? "none" : "1px solid var(--border)",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              📊 Table View
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "600",
                color: viewMode === "calendar" ? "white" : "var(--secondary)",
                background: viewMode === "calendar" ? "var(--primary)" : "transparent",
                border: viewMode === "calendar" ? "none" : "1px solid var(--border)",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              📅 Calendar View
            </button>
            <button
              onClick={() => setShowQueue(!showQueue)}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "600",
                color: showQueue ? "white" : "var(--secondary)",
                background: showQueue ? "var(--primary)" : "transparent",
                border: showQueue ? "none" : "1px solid var(--border)",
                borderRadius: "6px",
                cursor: "pointer",
                position: "relative",
              }}
            >
              📋 Queue {adjustmentQueue.filter((a) => a.approvalStatus === "Pending").length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#dc3545",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 6px",
                    borderRadius: "10px",
                  }}
                >
                  {adjustmentQueue.filter((a) => a.approvalStatus === "Pending").length}
                </span>
              )}
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setIsBulkUploadOpen(true)}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "600",
                color: "white",
                background: "#8b5cf6",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              📤 Bulk Upload
            </button>
            <button
              onClick={() => setIsRulesBuilderOpen(true)}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "600",
                color: "white",
                background: "#f59e0b",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              ⚙️ Create Rule
            </button>
            <button
              onClick={handleAddRate}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "600",
                color: "white",
                background: "var(--primary)",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              + New Rate
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section" style={{ gridColumn: "1 / -1" }}>
            <RatesFilterBar onFilterChange={setFilters} roomTypes={roomTypes} />
          </div>

          {showQueue && (
            <div className="dashboard-section" style={{ gridColumn: "1 / -1" }}>
              <PriceAdjustmentQueue
                adjustments={adjustmentQueue}
                onApprove={(id) => approveAdjustment(id, session.user.email)}
                onReject={(id) => rejectAdjustment(id, session.user.email)}
              />
            </div>
          )}

          <div className="dashboard-section" style={{ gridColumn: "1 / -1" }}>
            {viewMode === "table" ? (
              <RatesTable
                rates={filteredRates}
                onRowClick={handleViewRate}
                onEdit={handleEditRate}
                onClone={handleCloneRate}
                onDelete={handleDeleteRate}
                onHistory={handleViewRate}
              />
            ) : (
              <RateCalendarView rates={filteredRates} onDateClick={() => {}} />
            )}
          </div>
        </div>
      </div>

      <RateFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRate(null);
        }}
        rate={editingRate}
        mode={editingRate ? "edit" : "add"}
        roomTypes={roomTypes}
        onSave={handleSaveRate}
      />

      <RateDetailsDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedRate(null);
        }}
        rate={selectedRate}
        logs={auditLogs}
        onEdit={handleEditRate}
      />

      <RateRulesBuilder
        isOpen={isRulesBuilderOpen}
        onClose={() => setIsRulesBuilderOpen(false)}
        rules={rules}
        onSaveRule={(rule) => {
          addRule(rule);
          showToast("Rule created successfully", "success");
          setIsRulesBuilderOpen(false);
        }}
      />

      <ChannelOverrides
        isOpen={isChannelOverridesOpen}
        onClose={() => setIsChannelOverridesOpen(false)}
        rateId={selectedRate?.id || ""}
        rateName={selectedRate?.name || ""}
        basePrice={selectedRate?.basePrice || 0}
      />

      <BulkUpload
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUpload={async (file) => {
          // Mock implementation - in real app would parse CSV/Excel
          return {
            totalRows: 10,
            successCount: 10,
            errorCount: 0,
            errors: [],
          };
        }}
      />
    </DashboardLayout>
  );
}
