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
import { useToast } from "@/components/toast";
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
  
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>("securities");
  const [isNewSecurityModalOpen, setIsNewSecurityModalOpen] = useState(false);
  const [isNewOptionModalOpen, setIsNewOptionModalOpen] = useState(false);
  const [isNewAwardModalOpen, setIsNewAwardModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredSecurities = filterSecurities();
  const selectedSecurity = securities.find((s) => s.id === selectedSecurityId) || null;
  const [editingSecurity, setEditingSecurity] = useState<Security | null>(null);

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
    const sec = securities.find((s) => s.id === id) || null;
    setEditingSecurity(sec);
    // close drawer if open
    setIsDetailsDrawerOpen(false);
    setSelectedSecurityId(undefined);
    // open modal in edit mode
    setIsNewSecurityModalOpen(true);
  }, [securities, setSelectedSecurityId]);

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

  const handleExport = () => {
    try {
      // Get current active tab data
      let dataToExport: any[] = [];
      let filename = "";
      
      if (activeTab === "securities") {
        dataToExport = filteredSecurities.map(s => ({
          "Holder Name": s.holderName,
          "Type": s.type,
          "Shares": s.shares,
          "Value per Share": s.value,
          "Total Value": s.shares * s.value,
          "Issue Date": s.issueDate,
          "Status": s.status
        }));
        filename = "securities";
      } else if (activeTab === "options") {
        dataToExport = stockOptions.map(o => ({
          "Employee Name": o.employeeName,
          "Quantity": o.quantity,
          "Strike Price": o.strikePrice,
          "Grant Date": o.grantDate,
          "Vesting Period": o.vestingPeriod,
          "Expiry Date": o.expiryDate,
          "Status": o.status
        }));
        filename = "stock-options";
      } else if (activeTab === "awards") {
        dataToExport = equityAwards.map(a => ({
          "Employee Name": a.employeeName,
          "Award Type": a.awardType,
          "Quantity": a.quantity,
          "Vesting Date": a.vestingDate,
          "Status": a.status
        }));
        filename = "equity-awards";
      }

      // Convert to CSV
      const headers = Object.keys(dataToExport[0] || {}).join(",");
      const rows = dataToExport.map(row => 
        Object.values(row).map(val => 
          typeof val === "string" && val.includes(",") ? `"${val}"` : val
        ).join(",")
      );
      const csv = [headers, ...rows].join("\n");

      // Download CSV
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast("Data exported successfully", "success");
    } catch (error) {
      showToast("Failed to export data", "error");
    }
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
        <h3 style={{
          fontSize: "13px",
          fontWeight: "700",
          color: "var(--primary)",
          marginBottom: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>Quick Actions</h3>
        <div style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => setIsNewSecurityModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--secondary)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--background)";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <Plus size={16} style={{ color: "#2563eb" }} />
            New Security
          </button>
          <button
            onClick={() => setIsNewOptionModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--secondary)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--background)";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <Plus size={16} style={{ color: "#9333ea" }} />
            New Option
          </button>
          <button
            onClick={() => setIsNewAwardModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--secondary)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--background)";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <Plus size={16} style={{ color: "#16a34a" }} />
            New Award
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--secondary)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--background)";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <Upload size={16} style={{ color: "#ea580c" }} />
            Upload Docs
          </button>
          <button
            onClick={handleExport}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--secondary)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--background)";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <Download size={16} style={{ color: "#4f46e5" }} />
            Export
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{
          fontSize: "13px",
          fontWeight: "700",
          color: "var(--primary)",
          marginBottom: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>Filters & Search</h3>
        <div style={{
          background: "var(--background)",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          padding: "16px"
        }}>
          <SecuritiesFilterBar />
        </div>
      </div>

      {/* Tabs and Content */}
      <div style={{
        background: "var(--background)",
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
                background: "transparent",
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
        <div style={{ background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)", padding: "24px" }}>
          <CapTableChart />
        </div>
        <div style={{ background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)", padding: "24px" }}>
          <ValuationHistoryChart />
        </div>
      </div>

      {/* Modals and Drawers */}
      <NewSecurityModal
        isOpen={isNewSecurityModalOpen}
        onClose={() => {
          setIsNewSecurityModalOpen(false);
          setEditingSecurity(null);
        }}
        security={editingSecurity}
      />
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
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedSecurityId(undefined);
        }}
        securityId={selectedSecurityId}
      />
    </div>
  );
}
