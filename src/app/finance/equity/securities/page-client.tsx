"use client";

import { useEffect, useState, useCallback } from "react";
import { useSecurities } from "@/store/useSecurities";
import { SecuritiesSummaryCards } from "@/components/Securities/SecuritiesSummaryCards";
import { SecuritiesFilterBar } from "@/components/Securities/SecuritiesFilterBar";
import { SecuritiesTable } from "@/components/Securities/SecuritiesTable";
import { StockOptionsTable } from "@/components/Securities/StockOptionsTable";
import { EquityAwardsTable } from "@/components/Securities/EquityAwardsTable";
import { CapTableChart } from "@/components/Securities/CapTableChart";
import { ValuationHistoryChart } from "@/components/Securities/ValuationHistoryChart";
import { SecuritiesDetailsDrawer } from "@/components/Securities/SecuritiesDetailsDrawer";
import { NewSecurityModal } from "@/components/Securities/NewSecurityModal";
import { NewStockOptionModal } from "@/components/Securities/NewStockOptionModal";
import { NewEquityAwardModal } from "@/components/Securities/NewEquityAwardModal";
import { UploadDocumentsModal } from "@/components/Securities/UploadDocumentsModal";
import { Security } from "@/types/securities";
import { Plus, Download, Upload } from "lucide-react";

type TabType = "securities" | "options" | "awards";

export function SecuritiesPageClient() {
  const {
    securities,
    stockOptions,
    equityAwards,
    filterSecurities,
    loadDemoData,
    setSelectedSecurityId,
    selectedSecurityId,
  } = useSecurities();

  const [activeTab, setActiveTab] = useState<TabType>("securities");
  const [isNewSecurityModalOpen, setIsNewSecurityModalOpen] = useState(false);
  const [isNewOptionModalOpen, setIsNewOptionModalOpen] = useState(false);
  const [isNewAwardModalOpen, setIsNewAwardModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredSecurities = filterSecurities();
  const selectedSecurity = securities.find((s) => s.id === selectedSecurityId) || null;

  useEffect(() => {
    if (securities.length === 0) {
      loadDemoData();
    }
  }, [securities.length, loadDemoData]);

  const handleViewDetails = useCallback((id: string) => {
    setSelectedSecurityId(id);
    setIsDetailsDrawerOpen(true);
  }, [setSelectedSecurityId]);

  const handleEditSecurity = useCallback((id: string) => {
    // In a real app, you'd open an edit modal
    alert(`Edit functionality for security ${id}`);
  }, []);

  const handleDeleteSecurity = useCallback(() => {
    setIsDetailsDrawerOpen(false);
    setSelectedSecurityId(undefined);
  }, [setSelectedSecurityId]);

  const handleAddTransaction = useCallback((id: string) => {
    alert(`Add transaction functionality for security ${id}`);
  }, []);

  const handleEditOption = useCallback((id: string) => {
    alert(`Edit functionality for option ${id}`);
  }, []);

  const handleEditAward = useCallback((id: string) => {
    alert(`Edit functionality for award ${id}`);
  }, []);

  const handleViewAwardHistory = useCallback((id: string) => {
    alert(`View history functionality for award ${id}`);
  }, []);

  const handleUploadDocuments = (id: string) => {
    setSelectedSecurityId(id);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="dashboard-header-content mb-6">
        <h1 className="dashboard-page-title">Securities Management</h1>
        <p className="dashboard-subtitle">Manage equity securities, stock options, and equity awards in one place.</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6">
        <SecuritiesSummaryCards />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => setIsNewSecurityModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition text-center"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Plus size={20} className="text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">New Security</span>
            </button>
            <button
              onClick={() => setIsNewOptionModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition text-center"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Plus size={20} className="text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">New Option</span>
            </button>
            <button
              onClick={() => setIsNewAwardModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition text-center"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Plus size={20} className="text-green-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">New Award</span>
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition text-center"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <Upload size={20} className="text-orange-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Upload Docs</span>
            </button>
            <button
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition text-center"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                <Download size={20} className="text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Filters & Search</h3>
          <SecuritiesFilterBar />
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 flex">
          {(["securities", "options", "awards"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 20px",
                fontSize: "13px",
                fontWeight: activeTab === tab ? "700" : "600",
                color: activeTab === tab ? "var(--primary)" : "var(--secondary)",
                background: activeTab === tab ? "transparent" : "transparent",
                border: "none",
                borderBottom: `3px solid ${activeTab === tab ? "var(--primary)" : "transparent"}`,
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {tab === "securities" && "Securities"}
              {tab === "options" && "Stock Options"}
              {tab === "awards" && "Equity Awards"}
              {tab === "securities" && ` (${filteredSecurities.length})`}
              {tab === "options" && ` (${stockOptions.length})`}
              {tab === "awards" && ` (${equityAwards.length})`}
            </button>
          ))}
        </div>

        <div style={{ padding: "24px" }}>
          {activeTab === "securities" && (
            <SecuritiesTable
              items={filteredSecurities}
              onView={handleViewDetails}
              onEdit={handleEditSecurity}
              onDelete={handleDeleteSecurity}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {activeTab === "options" && (
            <StockOptionsTable
              items={stockOptions}
              onEdit={handleEditOption}
              onDelete={() => {}}
            />
          )}

          {activeTab === "awards" && (
            <EquityAwardsTable
              items={equityAwards}
              onEdit={handleEditAward}
              onDelete={() => {}}
              onViewHistory={handleViewAwardHistory}
            />
          )}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
        <CapTableChart />
        <ValuationHistoryChart />
      </div>

      {/* Modals and Drawers */}
      <NewSecurityModal isOpen={isNewSecurityModalOpen} onClose={() => setIsNewSecurityModalOpen(false)} />
      <NewStockOptionModal isOpen={isNewOptionModalOpen} onClose={() => setIsNewOptionModalOpen(false)} />
      <NewEquityAwardModal isOpen={isNewAwardModalOpen} onClose={() => setIsNewAwardModalOpen(false)} />
      <SecuritiesDetailsDrawer
        security={selectedSecurity}
        isOpen={isDetailsDrawerOpen}
        onClose={() => {
          setIsDetailsDrawerOpen(false);
          setSelectedSecurityId(undefined);
        }}
      />
      <UploadDocumentsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        securityId={selectedSecurityId || ""}
      />
    </div>
  );
}
