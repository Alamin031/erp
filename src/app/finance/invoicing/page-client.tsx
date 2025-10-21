"use client";

import { useEffect, useState } from "react";
import { Invoice, InvoiceFilters } from "@/types/invoice";
import { useInvoices } from "@/store/useInvoices";
import { MOCK_INVOICES } from "@/lib/mock-invoices";
import { InvoiceStatsCards } from "@/components/invoice-stats-cards";
import { InvoiceFilterBar } from "@/components/invoice-filter-bar";
import { InvoiceTable } from "@/components/invoice-table";
import { InvoiceModal } from "@/components/invoice-modal";
import { InvoiceDetailsModal } from "@/components/invoice-details-modal";
import { RevenueChart } from "@/components/revenue-chart";
import { PaymentSummary } from "@/components/payment-summary";
import { InvoiceQuickActions } from "@/components/invoice-quick-actions";
import { PaginationControls } from "@/components/pagination-controls";
import { useToast } from "@/components/toast";

export function InvoicingPageClient() {
  const {
    invoices,
    filters,
    selectedInvoice,
    setInvoices,
    setFilters,
    setSelectedInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markPaid,
    filterInvoices,
    getInvoiceStats,
    getPaymentMethodBreakdown,
    exportInvoices,
  } = useInvoices();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { showToast } = useToast();

  useEffect(() => {
    if (invoices.length === 0) {
      setInvoices(MOCK_INVOICES);
    }
  }, []);

  const stats = getInvoiceStats();
  const paymentBreakdown = getPaymentMethodBreakdown();
  const filteredInvoices = filterInvoices();
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (newFilters: InvoiceFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setIsCreateModalOpen(true);
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    if (selectedInvoice) {
      updateInvoice(selectedInvoice.id, invoice);
      showToast("Invoice updated successfully", "success");
    } else {
      createInvoice(invoice);
      showToast("Invoice created successfully", "success");
    }
    setIsCreateModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleRowClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsModalOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsCreateModalOpen(true);
  };

  const handleDeleteInvoice = (id: string) => {
    deleteInvoice(id);
    showToast("Invoice deleted successfully", "success");
  };

  const handleMarkPaid = (id: string, paymentMethod: string, transactionId: string) => {
    markPaid(id, paymentMethod, transactionId);
    setIsDetailsModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleExportCSV = () => {
    const csv = exportInvoices("csv");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    );
    element.setAttribute("download", `invoices-${new Date().toISOString().split("T")[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportPDF = () => {
    showToast("PDF export feature coming soon", "info");
  };

  const handleSendReminders = () => {
    const overdueInvoices = invoices.filter(
      inv =>
        inv.status !== "Paid" && new Date(inv.dueDate) < new Date()
    );
    if (overdueInvoices.length > 0) {
      showToast(`Reminders sent to ${overdueInvoices.length} clients`, "success");
    }
  };

  const handleRefresh = () => {
    setInvoices([...invoices]);
    showToast("Invoices refreshed", "info");
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Invoice Management</h1>
          <p className="dashboard-subtitle">Create, manage, and track invoice payments</p>
        </div>

        <InvoiceStatsCards
          totalInvoices={stats.totalInvoices}
          paidInvoices={stats.paidInvoices}
          unpaidInvoices={stats.unpaidInvoices}
          overdueInvoices={stats.overdueInvoices}
          totalRevenue={stats.totalRevenue}
          pendingRevenue={stats.pendingRevenue}
          monthlyRevenue={stats.monthlyRevenue}
          averageInvoiceValue={stats.averageInvoiceValue}
        />

        <div style={{ marginBottom: "24px" }}>
          <InvoiceQuickActions
            onCreateNew={handleCreateInvoice}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            onSendReminders={handleSendReminders}
            onRefresh={handleRefresh}
            overdueCount={stats.overdueInvoices}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <div>
            <RevenueChart invoices={filteredInvoices} />
          </div>
          <div>
            <PaymentSummary breakdown={paymentBreakdown} />
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <InvoiceFilterBar onFilterChange={handleFilterChange} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <InvoiceTable
            invoices={paginatedInvoices}
            onRowClick={handleRowClick}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredInvoices.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>

      <InvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onSave={handleSaveInvoice}
      />

      <InvoiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onMarkPaid={handleMarkPaid}
      />
    </>
  );
}
