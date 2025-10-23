"use client";

import { useEffect, useState, useCallback } from "react";
import { useTransactions } from "@/store/useTransactions";
import { TransactionStatsCards } from "@/components/Transactions/TransactionStatsCards";
import { TransactionFiltersBar } from "@/components/Transactions/TransactionFiltersBar";
import { TransactionsTable } from "@/components/Transactions/TransactionsTable";
import { TransactionDetailsDrawer } from "@/components/Transactions/TransactionDetailsDrawer";
import { NewTransactionModal } from "@/components/Transactions/NewTransactionModal";
import { TransactionChart } from "@/components/Transactions/TransactionChart";
import { TransactionActivityLog } from "@/components/Transactions/TransactionActivityLog";
import { AlertCircle, Plus } from "lucide-react";

export function TransactionsPageClient() {
  const {
    transactions,
    filterTransactions,
    loadDemoData,
    setSelectedTransactionId,
    selectedTransactionId,
    approveTransaction,
    rejectTransaction,
    executeTransaction,
  } = useTransactions();

  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const filteredTransactions = filterTransactions();
  const selectedTransaction = transactions.find((t) => t.id === selectedTransactionId) || null;

  useEffect(() => {
    if (transactions.length === 0) {
      loadDemoData();
    }
  }, [transactions.length, loadDemoData]);

  const handleViewDetails = useCallback(
    (id: string) => {
      setSelectedTransactionId(id);
      setIsDetailsDrawerOpen(true);
    },
    [setSelectedTransactionId]
  );

  const handleEditTransaction = useCallback((id: string) => {
    alert(`Edit functionality for transaction ${id}`);
  }, []);

  const handleDeleteTransaction = useCallback(() => {
    setIsDetailsDrawerOpen(false);
    setSelectedTransactionId(undefined);
  }, [setSelectedTransactionId]);

  const handleApprove = useCallback(() => {
    if (selectedTransactionId) {
      approveTransaction(selectedTransactionId, "Current User");
      setIsDetailsDrawerOpen(false);
      setSelectedTransactionId(undefined);
    }
  }, [selectedTransactionId, approveTransaction, setSelectedTransactionId]);

  const handleReject = useCallback(() => {
    if (selectedTransactionId && confirm("Reject this transaction?")) {
      rejectTransaction(selectedTransactionId, "Current User");
      setIsDetailsDrawerOpen(false);
      setSelectedTransactionId(undefined);
    }
  }, [selectedTransactionId, rejectTransaction, setSelectedTransactionId]);

  const handleExecute = useCallback(() => {
    if (selectedTransactionId && confirm("Execute this transaction?")) {
      executeTransaction(selectedTransactionId);
      setIsDetailsDrawerOpen(false);
      setSelectedTransactionId(undefined);
    }
  }, [selectedTransactionId, executeTransaction, setSelectedTransactionId]);

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 className="dashboard-page-title">Transactions</h1>
          <p className="dashboard-subtitle">Track equity issuance, exercises, and other equity transactions.</p>
        </div>

        <button
          onClick={() => setIsNewTransactionModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "6px",
            background: "var(--primary)",
            color: "white",
            fontSize: "13px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Plus size={16} />
          New Transaction
        </button>
      </div>

      {/* Alert Banner */}
      <div style={{
        background: "#fef3c7",
        border: "1px solid #fcd34d",
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "24px"
      }}>
        <div style={{ color: "#b45309", flexShrink: 0, marginTop: "2px" }}>
          <AlertCircle size={20} />
        </div>
        <div>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#92400e", margin: 0 }}>
            ⚙️ Equity transactions management is under development.
          </p>
          <p style={{ fontSize: "12px", color: "#a16207", marginTop: "4px", margin: 0 }}>
            Some features may not be fully functional. We are continuously improving this module.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ marginBottom: "24px" }}>
        <TransactionStatsCards />
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
          <TransactionFiltersBar />
        </div>
      </div>

      {/* Transaction Records Table */}
      <div style={{
        background: "var(--background)",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        marginBottom: "24px"
      }}>
        <div style={{ padding: "24px" }}>
          <h2 style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--primary)",
            marginBottom: "16px",
            margin: 0
          }}>
            Transaction Records ({filteredTransactions.length})
          </h2>
          <TransactionsTable
            items={filteredTransactions}
            onView={handleViewDetails}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>

      {/* Charts and Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginTop: "24px" }}>
        <div style={{ background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)", padding: "24px" }}>
          <TransactionChart />
        </div>
        <div style={{ background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)", padding: "24px" }}>
          <TransactionActivityLog />
        </div>
      </div>

      {/* Modals and Drawers */}
      <NewTransactionModal isOpen={isNewTransactionModalOpen} onClose={() => setIsNewTransactionModalOpen(false)} />

      <TransactionDetailsDrawer
        transaction={selectedTransaction}
        isOpen={isDetailsDrawerOpen}
        onClose={() => {
          setIsDetailsDrawerOpen(false);
          setSelectedTransactionId(undefined);
        }}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      {/* Action Buttons in Drawer */}
      {isDetailsDrawerOpen && selectedTransaction && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          border: "1px solid var(--border)"
        }}>
          {selectedTransaction.status === "Draft" && (
            <>
              <button
                onClick={handleApprove}
                style={{
                  background: "#10b981",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                style={{
                  background: "#ef4444",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
              >
                Reject
              </button>
            </>
          )}
          {selectedTransaction.status === "Approved" && (
            <button
              onClick={handleExecute}
              style={{
                background: "var(--primary)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Execute
            </button>
          )}
        </div>
      )}
    </div>
  );
}
