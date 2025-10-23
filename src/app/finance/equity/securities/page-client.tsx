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
      <div style={{ marginBottom: "24px" }}>
        <SecuritiesSummaryCards />
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{
          background: "white",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "var(--primary)",
            marginBottom: "16px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>Quick Actions</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "16px"
          }}>
            <button
              onClick={() => setIsNewSecurityModalOpen(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--background)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px"
              }}>
                <Plus size={24} style={{ color: "white" }} />
              </div>
              <span style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--secondary)",
                textAlign: "center"
              }}>New Security</span>
            </button>
            <button
              onClick={() => setIsNewOptionModalOpen(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--background)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px"
              }}>
                <Plus size={24} style={{ color: "white" }} />
              </div>
              <span style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--secondary)",
                textAlign: "center"
              }}>New Option</span>
            </button>
            <button
              onClick={() => setIsNewAwardModalOpen(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--background)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px"
              }}>
                <Plus size={24} style={{ color: "white" }} />
              </div>
              <span style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--secondary)",
                textAlign: "center"
              }}>New Award</span>
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--background)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px"
              }}>
                <Upload size={24} style={{ color: "white" }} />
              </div>
              <span style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--secondary)",
                textAlign: "center"
              }}>Upload Docs</span>
            </button>
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--background)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px"
              }}>
                <Download size={24} style={{ color: "white" }} />
              </div>
              <span style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--secondary)",
                textAlign: "center"
              }}>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{
          background: "white",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          padding: "24px"
        }}>
          <h3 style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "var(--primary)",
            marginBottom: "16px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>Filters & Search</h3>
          <SecuritiesFilterBar />
        </div>
      </div>

      {/* Tabs and Content */}
      <div style={{
        background: "white",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        marginBottom: "24px"
      }}>
        <div style={{
          borderBottom: "1px solid var(--border)",
          display: "flex",
          background: "var(--background)"
        }}>
          {(["securities", "options", "awards"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 20px",
                fontSize: "13px",
                fontWeight: activeTab === tab ? "700" : "600",
                color: activeTab === tab ? "var(--primary)" : "var(--secondary)",
                background: activeTab === tab ? "white" : "transparent",
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
        <div style={{ background: "white", borderRadius: "8px", border: "1px solid var(--border)", padding: "24px" }}>
          <CapTableChart />
        </div>
        <div style={{ background: "white", borderRadius: "8px", border: "1px solid var(--border)", padding: "24px" }}>
          <ValuationHistoryChart />
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
