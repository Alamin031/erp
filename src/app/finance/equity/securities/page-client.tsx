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
import { Plus } from "lucide-react";

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
    <div className="space-y-6">
      {/* Header with Summary Cards */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Securities</h1>
            <p className="text-gray-600 mt-1">Manage equity securities, stock options, and equity awards.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsNewSecurityModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              New Security
            </button>
          </div>
        </div>

        <SecuritiesSummaryCards />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Filters */}
        <div className="xl:col-span-1">
          <SecuritiesFilterBar />
        </div>

        {/* Center & Right: Tables and Charts */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tabs for Securities, Options, Awards */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b flex">
              {(["securities", "options", "awards"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {tab === "securities" && "Securities"}
                  {tab === "options" && "Stock Options"}
                  {tab === "awards" && "Equity Awards"}
                  {tab === "securities" && ` (${filteredSecurities.length})`}
                  {tab === "options" && ` (${stockOptions.length})`}
                  {tab === "awards" && ` (${equityAwards.length})`}
                </button>
              ))}
              {activeTab !== "securities" && (
                <div className="ml-auto px-6 py-3">
                  {activeTab === "options" && (
                    <button
                      onClick={() => setIsNewOptionModalOpen(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                    >
                      <Plus size={18} />
                      New Option
                    </button>
                  )}
                  {activeTab === "awards" && (
                    <button
                      onClick={() => setIsNewAwardModalOpen(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                    >
                      <Plus size={18} />
                      New Award
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="p-6">
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
          <div className="space-y-6">
            <CapTableChart />
            <ValuationHistoryChart />
          </div>
        </div>
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
