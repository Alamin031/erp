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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="dashboard-page-title">Transactions</h1>
          <p className="dashboard-subtitle">Track equity issuance, exercises, and other equity transactions.</p>
        </div>

        <button
          onClick={() => setIsNewTransactionModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} />
          New Transaction
        </button>
      </div>

      {/* Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-4">
        <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-900">⚙️ Equity transactions management is under development.</p>
          <p className="text-xs text-amber-800 mt-1">Some features may not be fully functional. We are continuously improving this module.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <TransactionStatsCards />

      {/* Main Content: table first, filters below on all screen sizes */}
      <div className="grid grid-cols-1 gap-6">
        {/* Table: full width */}
        <div className="w-full">
          <div className="bg-[var(--background)] rounded-lg border border-[var(--border)] overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Transaction Records ({filteredTransactions.length})</h2>
              <TransactionsTable
                items={filteredTransactions}
                onView={handleViewDetails}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        </div>

        {/* Filters: below the table */}
        <div className="w-full">
          <TransactionFiltersBar />
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionChart />
        </div>
        <div className="lg:col-span-1">
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
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          {selectedTransaction.status === "Draft" && (
            <>
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition font-medium"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition font-medium"
              >
                Reject
              </button>
            </>
          )}
          {selectedTransaction.status === "Approved" && (
            <button
              onClick={handleExecute}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium"
            >
              Execute
            </button>
          )}
        </div>
      )}
    </div>
  );
}
