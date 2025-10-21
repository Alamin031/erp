"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { useAccounting } from "@/store/useAccounting";
import { useToast } from "@/components/toast";
import { AccountingKpis } from "@/components/accounting-kpis";
import { ARTable } from "@/components/ar-table";
import { APTable } from "@/components/ap-table";
import { AccountingFilterBar } from "@/components/accounting-filter-bar";
import { LedgerTable } from "@/components/ledger-table";
import { TrialBalance } from "@/components/trial-balance";
import { AgingReport } from "@/components/aging-report";
import { BankReconciliation } from "@/components/bank-reconciliation";
import { CashflowStatement } from "@/components/cashflow-statement";
import { ProfitLoss } from "@/components/profit-loss";
import { BalanceSheet } from "@/components/balance-sheet";
import { PaymentModal, PaymentData } from "@/components/accounting-payment-modal";
import { JournalEntryForm } from "@/components/journal-entry-form";
import { QuickActions } from "@/components/accounting-quick-actions";
import { AccountingFilters } from "@/types/accounting";

export default function AccountingPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const {
    ar,
    ap,
    ledger,
    banks,
    chartOfAccounts,
    filters,
    selectedTab,
    initializeDemoData,
    setAR,
    setAP,
    setFilters,
    setSelectedTab,
    recordPayment,
    createJournalEntry,
    postJournalEntry,
  } = useAccounting();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isJournalFormOpen, setIsJournalFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const checkAuth = async () => {
      const sess = await getSession();
      if (!sess) {
        window.location.href = "/login";
        return;
      }

      const userRole = (sess.user as any).role;
      const allowedRoles = ["super_admin", "general_manager", "finance_manager"];

      if (!allowedRoles.includes(userRole)) {
        window.location.href = "/unauthorized";
        return;
      }

      setSession(sess);
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (ar.length === 0 && ap.length === 0) {
      initializeDemoData().then(() => {
        showToast("Demo data loaded successfully", "success");
      });
    }
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: "24px", textAlign: "center" }}>
          <p style={{ color: "var(--secondary)" }}>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const arStats = ar.reduce(
    (acc, inv) => ({
      totalAR: acc.totalAR + inv.amount,
      balanceAR: acc.balanceAR + inv.balance,
      overdueCount: acc.overdueCount + (inv.status === "Overdue" ? 1 : 0),
      overdueAmount: acc.overdueAmount + (inv.status === "Overdue" ? inv.balance : 0),
    }),
    { totalAR: 0, balanceAR: 0, overdueCount: 0, overdueAmount: 0 }
  );

  const apStats = ap.reduce(
    (acc, bill) => ({
      totalAP: acc.totalAP + bill.amount,
      balanceAP: acc.balanceAP + bill.balance,
    }),
    { totalAP: 0, balanceAP: 0 }
  );

  const cashOnHand = banks.reduce((sum, bank) => sum + bank.balance, 0);
  const netCashflow = cashOnHand + arStats.balanceAR - apStats.balanceAP;

  const filteredAR = ar.filter((inv) => {
    if (filters.searchQuery && !inv.invoiceNumber.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    if (filters.status && inv.status !== filters.status) return false;
    return true;
  });

  const filteredAP = ap.filter((bill) => {
    if (filters.searchQuery && !bill.billNumber.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    if (filters.status && bill.status !== filters.status) return false;
    return true;
  });

  const handleRecordPayment = (invoiceId: string) => {
    const item = ar.find((inv) => inv.id === invoiceId);
    if (item) {
      setSelectedItem(item);
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentSubmit = (data: PaymentData) => {
    if (!selectedItem) return;

    recordPayment(selectedItem.id, data.amount, data.method, data.reference);
    showToast("Payment recorded successfully", "success");
    setIsPaymentModalOpen(false);
    setSelectedItem(null);
  };

  const handleCreateJournal = (formData: any) => {
    const entry = {
      ...formData,
      id: `je-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: (session?.user as any)?.name || "admin",
      updatedAt: new Date().toISOString(),
    };

    createJournalEntry(entry);
    postJournalEntry(entry.id);
    setIsJournalFormOpen(false);
    showToast("Journal entry created and posted", "success");
  };

  const handleExportCSV = (type: "ar" | "ap" | "ledger") => {
    let csv = "";
    const filename = `accounting-${type}-${new Date().toISOString().split("T")[0]}.csv`;

    if (type === "ar") {
      const headers = ["Invoice Number", "Client", "Amount", "Paid", "Balance", "Due Date", "Status"];
      const rows = filteredAR.map((inv) => [
        inv.invoiceNumber,
        inv.clientName,
        inv.amount.toFixed(2),
        inv.paidAmount.toFixed(2),
        inv.balance.toFixed(2),
        new Date(inv.dueDate).toLocaleDateString(),
        inv.status,
      ]);
      csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    } else if (type === "ap") {
      const headers = ["Bill Number", "Vendor", "Amount", "Paid", "Balance", "Due Date", "Status"];
      const rows = filteredAP.map((bill) => [
        bill.billNumber,
        bill.vendorName,
        bill.amount.toFixed(2),
        bill.paidAmount.toFixed(2),
        bill.balance.toFixed(2),
        new Date(bill.dueDate).toLocaleDateString(),
        bill.status,
      ]);
      csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    } else if (type === "ledger") {
      const headers = ["Date", "Reference", "Description", "Debit", "Credit", "Posted"];
      const rows: string[][] = [];
      ledger.forEach((entry) => {
        entry.lines.forEach((line) => {
          rows.push([
            new Date(entry.date).toLocaleDateString(),
            entry.referenceNumber,
            entry.description || "",
            line.type === "Debit" ? line.amount.toFixed(2) : "",
            line.type === "Credit" ? line.amount.toFixed(2) : "",
            entry.isPosted ? "Yes" : "No",
          ]);
        });
      });
      csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    }

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showToast(`${type.toUpperCase()} exported successfully`, "success");
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Accounting Dashboard</h1>
          <p className="dashboard-subtitle">Track accounts receivable and payable</p>
        </div>

        <AccountingKpis
          arOutstanding={arStats.balanceAR}
          apOutstanding={apStats.balanceAP}
          cashOnHand={cashOnHand}
          overdueCount={arStats.overdueCount}
          overdueAmount={arStats.overdueAmount}
          netCashflow={netCashflow}
          onKpiClick={(type) => setSelectedTab(type)}
        />

        <QuickActions
          onCreateJournal={() => setIsJournalFormOpen(true)}
          onRecordPayment={() => {
            if (filteredAR.length > 0) {
              handleRecordPayment(filteredAR[0].id);
            } else {
              showToast("No invoices available", "info");
            }
          }}
          onReconcile={() => setSelectedTab("reconciliation")}
          onExportReport={() => setSelectedTab("reports")}
          onCreateAdjustment={() => setIsJournalFormOpen(true)}
        />

        <div style={{ marginBottom: "24px" }}>
          <AccountingFilterBar onFilterChange={setFilters} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              paddingBottom: "8px",
            }}
          >
            {[
              { id: "overview", label: "Overview" },
              { id: "ar", label: "Accounts Receivable" },
              { id: "ap", label: "Accounts Payable" },
              { id: "ledger", label: "Ledger & Journals" },
              { id: "reconciliation", label: "Bank Reconciliation" },
              { id: "reports", label: "Reports" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: selectedTab === tab.id ? "700" : "600",
                  color: selectedTab === tab.id ? "var(--primary)" : "var(--secondary)",
                  background: selectedTab === tab.id ? "var(--background)" : "transparent",
                  border: `2px solid ${selectedTab === tab.id ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {selectedTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <AgingReport items={ar} type="AR" />
            <AgingReport items={ap} type="AP" />
          </div>
        )}

        {selectedTab === "ar" && (
          <div>
            <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleExportCSV("ar")}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "white",
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                📥 Export CSV
              </button>
            </div>
            <ARTable
              invoices={filteredAR}
              onRecordPayment={handleRecordPayment}
              onViewInvoice={(inv) => showToast(`View invoice: ${inv.invoiceNumber}`, "info")}
            />
          </div>
        )}

        {selectedTab === "ap" && (
          <div>
            <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleExportCSV("ap")}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "white",
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                📥 Export CSV
              </button>
            </div>
            <APTable
              bills={filteredAP}
              onRecordPayment={(billId) => showToast(`Record payment for ${billId}`, "info")}
            />
          </div>
        )}

        {selectedTab === "ledger" && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ marginBottom: "24px", display: "flex", gap: "8px" }}>
              <button
                onClick={() => setIsJournalFormOpen(true)}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "white",
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ➕ New Journal Entry
              </button>
              <button
                onClick={() => handleExportCSV("ledger")}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "white",
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                📥 Export CSV
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <LedgerTable entries={ledger} />
              </div>
              <div>
                <TrialBalance entries={ledger} chartOfAccounts={chartOfAccounts} />
              </div>
            </div>
          </div>
        )}

        {selectedTab === "reconciliation" && (
          <div style={{ marginBottom: "24px" }}>
            <BankReconciliation
              banks={banks}
              transactions={[]}
              payments={[]}
              onReconcile={(txnId, paymentId) => {
                showToast("Transaction reconciled", "success");
              }}
            />
          </div>
        )}

        {selectedTab === "reports" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "24px" }}>
            <CashflowStatement arInvoices={ar} apBills={ap} entries={ledger} />
            <ProfitLoss entries={ledger} />
            <BalanceSheet chartOfAccounts={chartOfAccounts} entries={ledger} />
          </div>
        )}

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onSubmit={handlePaymentSubmit}
          banks={banks}
        />

        {isJournalFormOpen && (
          <div style={{ marginTop: "24px", marginBottom: "24px" }}>
            <JournalEntryForm
              chartOfAccounts={chartOfAccounts}
              onSubmit={handleCreateJournal}
              onCancel={() => setIsJournalFormOpen(false)}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
