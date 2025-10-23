"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
import { Plus, Download, Upload, Filter } from "lucide-react";

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
  const [showFilters, setShowFilters] = useState(false);

  // Memoize filtered securities to avoid recalculating on every render
  const filteredSecurities = useMemo(() => filterSecurities(), [filterSecurities, securities.length]);
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

  const getActiveCount = (tab: TabType) => {
    switch (tab) {
      case "securities": return filteredSecurities.length;
      case "options": return stockOptions.length;
      case "awards": return equityAwards.length;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Securities Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage equity securities, stock options, and equity awards in one place.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
              <Download size={18} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
              <Upload size={18} />
              Import
            </button>
            <button
              onClick={() => setIsNewSecurityModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              New Security
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <SecuritiesSummaryCards />

        {/* Main Content Area */}
        <div className="">
          {/* Filters Sidebar - Collapsible on mobile */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              {/* Filter Header */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Filter size={18} />
                    Filters
                  </h3>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="xl:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showFilters ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              
              {/* Filter Content */}
              <div className={`p-4 ${showFilters ? 'block' : 'hidden xl:block'}`}>
                <SecuritiesFilterBar />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Tabs Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              {/* Tab Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex space-x-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1 mb-4 sm:mb-0">
                  {(["securities", "options", "awards"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        activeTab === tab
                          ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>
                          {tab === "securities" && "Securities"}
                          {tab === "options" && "Stock Options"}
                          {tab === "awards" && "Equity Awards"}
                        </span>
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          activeTab === tab 
                            ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300" 
                            : "bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-400"
                        }`}>
                          {getActiveCount(tab)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {activeTab === "options" && (
                    <button
                      onClick={() => setIsNewOptionModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                    >
                      <Plus size={18} />
                      New Option
                    </button>
                  )}
                  {activeTab === "awards" && (
                    <button
                      onClick={() => setIsNewAwardModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                    >
                      <Plus size={18} />
                      New Award
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Content */}
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Capitalization Table</h3>
                <CapTableChart />
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Valuation History</h3>
                <ValuationHistoryChart />
              </div>
            </div>
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