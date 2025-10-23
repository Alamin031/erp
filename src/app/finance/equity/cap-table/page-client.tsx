"use client";

import { useEffect, useState } from "react";
import { useCapTable } from "@/store/useCapTable";
import { Shareholder, EquityClass } from "@/types/cap-table";
import { OwnershipSummaryCards } from "@/components/cap-table-summary-cards";
import { ShareholdersTable } from "@/components/cap-table-shareholders";
import { EquityClassesTable } from "@/components/cap-table-equity-classes";
import { OwnershipPieChart } from "@/components/cap-table-ownership-chart";
import { AddShareholderModal } from "@/components/cap-table-add-shareholder-modal";
import { EditEquityModal } from "@/components/cap-table-edit-equity-modal";
import { CapTableTimeline } from "@/components/cap-table-timeline";
import { CapTableActivityLog } from "@/components/cap-table-activity-log";
import { useToast } from "@/components/toast";
import { motion } from "framer-motion";
import { Plus, AlertCircle } from "lucide-react";

export function CapTablePageClient() {
  const { showToast } = useToast();
  const {
    shareholders,
    equityClasses,
    ownershipHistory,
    activityLog,
    loadDemoData,
    addShareholder,
    editShareholder,
    removeShareholder,
    updateEquityClass,
  } = useCapTable();

  const [activeTab, setActiveTab] = useState<"shareholders" | "equity" | "chart">("shareholders");
  const [isShareholderModalOpen, setIsShareholderModalOpen] = useState(false);
  const [isEquityModalOpen, setIsEquityModalOpen] = useState(false);
  const [selectedShareholder, setSelectedShareholder] = useState<Shareholder | null>(null);
  const [selectedEquity, setSelectedEquity] = useState<EquityClass | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded && shareholders.length === 0) {
      loadDemoData();
      setIsLoaded(true);
    }
  }, [isLoaded, shareholders.length, loadDemoData]);

  const ownership = {
    totalShareholders: shareholders.length,
    totalSharesOutstanding: shareholders.reduce((sum, s) => sum + s.sharesHeld, 0),
    authorizedShares: equityClasses.reduce((sum, e) => sum + e.authorizedShares, 0),
    fullyDilutedOwnership: 100,
    byEquityClass: equityClasses.map((ec) => {
      const classHolders = shareholders.filter((s) => s.equityType === ec.name);
      const issuedInClass = classHolders.reduce((sum, s) => sum + s.sharesHeld, 0);
      const totalShares = shareholders.reduce((sum, s) => sum + s.sharesHeld, 0);
      const percentageOfTotal = totalShares > 0 ? (issuedInClass / totalShares) * 100 : 0;

      return {
        class: ec.name,
        authorizedShares: ec.authorizedShares,
        issuedShares: issuedInClass,
        percentageOfTotal,
        holdersCount: classHolders.length,
      };
    }),
    byHolder: shareholders.map((s) => {
      const totalShares = shareholders.reduce((sum, sh) => sum + sh.sharesHeld, 0);
      const ownershipPercentage = totalShares > 0 ? (s.sharesHeld / totalShares) * 100 : 0;

      return {
        shareholderId: s.id,
        shareholderName: s.name,
        equityType: s.equityType,
        sharesHeld: s.sharesHeld,
        ownershipPercentage,
      };
    }),
  };

  const handleAddShareholder = (data: Omit<Shareholder, "id" | "ownershipPercentage" | "createdAt" | "updatedAt">) => {
    addShareholder(data);
    setSelectedShareholder(null);
  };

  const handleEditShareholder = (shareholder: Shareholder) => {
    setSelectedShareholder(shareholder);
    setIsShareholderModalOpen(true);
  };

  const handleSaveShareholder = (data: Omit<Shareholder, "id" | "ownershipPercentage" | "createdAt" | "updatedAt">) => {
    if (selectedShareholder) {
      editShareholder(selectedShareholder.id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      addShareholder(data);
    }
    setSelectedShareholder(null);
    setIsShareholderModalOpen(false);
  };

  const handleEditEquity = (equityClass: EquityClass) => {
    setSelectedEquity(equityClass);
    setIsEquityModalOpen(true);
  };

  const handleSaveEquity = (data: Partial<EquityClass>) => {
    if (selectedEquity) {
      updateEquityClass(selectedEquity.id, {
        ...data,
        lastUpdated: new Date().toISOString(),
      });
    }
    setSelectedEquity(null);
    setIsEquityModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: "24px" }}
    >
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px", color: "var(--foreground)" }}>
          Cap Table
        </h1>
        <p style={{ fontSize: "16px", color: "var(--secondary)", margin: 0 }}>
          View and manage capitalization table, shareholder equity, and ownership structure.
        </p>
      </div>

      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "#fef3c7",
          border: "1px solid #fcd34d",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "24px",
        }}
      >
        <AlertCircle size={20} style={{ color: "#f59e0b", flexShrink: 0 }} />
        <span style={{ fontSize: "13px", color: "#92400e" }}>
          ⚙️ Cap table management is under development.
        </span>
      </motion.div>

      {/* Summary Cards */}
      <OwnershipSummaryCards
        totalShareholders={ownership.totalShareholders}
        totalSharesOutstanding={ownership.totalSharesOutstanding}
        authorizedShares={ownership.authorizedShares}
        fullyDilutedOwnership={ownership.fullyDilutedOwnership}
      />

      {/* Tabs */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", marginBottom: "0" }}>
          {[
            { id: "shareholders", label: "Shareholders" },
            { id: "equity", label: "Equity Classes" },
            { id: "chart", label: "Ownership Chart" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "12px 16px",
                fontSize: "13px",
                fontWeight: "500",
                color: activeTab === tab.id ? "var(--primary)" : "var(--secondary)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "none",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ paddingTop: "24px" }}>
          {activeTab === "shareholders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div style={{ marginBottom: "16px" }}>
                <button
                  onClick={() => {
                    setSelectedShareholder(null);
                    setIsShareholderModalOpen(true);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "white",
                    background: "var(--primary)",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  <Plus size={14} />
                  Add Shareholder
                </button>
              </div>
              <ShareholdersTable
                shareholders={shareholders}
                onEdit={handleEditShareholder}
                onDelete={removeShareholder}
                onRecalculate={() => showToast("Ownership recalculated", "success")}
              />
            </motion.div>
          )}

          {activeTab === "equity" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <EquityClassesTable equityClasses={equityClasses} onEdit={handleEditEquity} />
            </motion.div>
          )}

          {activeTab === "chart" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <OwnershipPieChart
                shareholderOwnership={ownership.byHolder}
                equityClassBreakdown={ownership.byEquityClass}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Timeline Section */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "var(--foreground)" }}>
          Activity Timeline
        </h3>
        <CapTableTimeline ownershipHistory={ownershipHistory} />
      </div>

      {/* Activity Log Section */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "var(--foreground)" }}>
          Activity Log
        </h3>
        <CapTableActivityLog activityLog={activityLog} limit={50} />
      </div>

      {/* Modals */}
      <AddShareholderModal
        isOpen={isShareholderModalOpen}
        onClose={() => {
          setIsShareholderModalOpen(false);
          setSelectedShareholder(null);
        }}
        shareholder={selectedShareholder}
        onSave={handleSaveShareholder}
      />

      <EditEquityModal
        isOpen={isEquityModalOpen}
        onClose={() => {
          setIsEquityModalOpen(false);
          setSelectedEquity(null);
        }}
        equityClass={selectedEquity}
        onSave={handleSaveEquity}
      />
    </motion.div>
  );
}
