// "use client";

// import { useEffect, useState } from "react";
// import { useReports } from "@/store/useReports";
// import { useToast } from "@/components/toast";
// import { ReportSummaryCards } from "@/components/report-summary-cards";
// import { FilterPanel } from "@/components/report-filter-panel";
// import { RevenueChart, ExpenseChart, ProfitLossChart } from "@/components/report-charts";
// import { ReportTable } from "@/components/report-table";
// import { ExportModal, ReportDetailsModal } from "@/components/report-modals";

// export function ReportsPageClient() {
//   const { showToast } = useToast();
//   const {
//     reports,
//     filters,
//     selectedReport,
//     fetchReports,
//     setFilters,
//     filterReports,
//     selectReport,
//   } = useReports();

//   const [selectedTab, setSelectedTab] = useState("overview");
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
//   const [exportReport, setExportReport] = useState<any>(null);

//   useEffect(() => {
//     if (reports.length === 0) {
//       fetchReports().then(() => {
//         showToast("Reports loaded successfully", "success");
//       });
//     }
//   }, []);

//   const filteredReports = filterReports();
//   const summary = {
//     totalRevenue: filteredReports
//       .filter((r) => r.type === "Revenue")
//       .reduce((sum, r) => sum + r.amount, 0),
//     totalExpenses: filteredReports
//       .filter((r) => r.type === "Expense")
//       .reduce((sum, r) => sum + r.amount, 0),
//     netProfit: 0,
//     outstandingBalance: 0,
//   };

//   summary.netProfit = summary.totalRevenue - summary.totalExpenses;
//   summary.outstandingBalance = summary.netProfit;

//   const handleViewDetails = (report: any) => {
//     selectReport(report.id);
//     setIsDetailsModalOpen(true);
//   };

//   const handleExport = (report: any) => {
//     setExportReport(report);
//     setIsExportModalOpen(true);
//   };

//   const tabs = [
//     { id: "overview", label: "Overview" },
//     { id: "revenue", label: "Revenue Reports" },
//     { id: "expense", label: "Expense Reports" },
//     { id: "profit", label: "Profit & Loss" },
//     { id: "custom", label: "Custom Reports" },
//   ];

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header-content" style={{ marginBottom: "24px" }}>
//         <h1 className="dashboard-page-title">Financial Reports</h1>
//         <p className="dashboard-subtitle">View and export financial reports</p>
//       </div>

//       <ReportSummaryCards
//         totalRevenue={summary.totalRevenue}
//         totalExpenses={summary.totalExpenses}
//         netProfit={summary.netProfit}
//         outstandingBalance={summary.outstandingBalance}
//       />

//       <FilterPanel filters={filters} onFilterChange={setFilters} />

//       <div style={{ marginBottom: "24px", display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setSelectedTab(tab.id)}
//             style={{
//               padding: "8px 16px",
//               fontSize: "13px",
//               fontWeight: selectedTab === tab.id ? "700" : "600",
//               color: selectedTab === tab.id ? "var(--primary)" : "var(--secondary)",
//               background: selectedTab === tab.id ? "var(--background)" : "transparent",
//               border: `2px solid ${selectedTab === tab.id ? "var(--primary)" : "var(--border)"}`,
//               borderRadius: "4px",
//               cursor: "pointer",
//               transition: "all 0.2s",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {selectedTab === "overview" && (
//         <div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", marginBottom: "24px" }}>
//             <RevenueChart reports={filteredReports} />
//             <ExpenseChart reports={filteredReports} />
//           </div>
//           <ProfitLossChart reports={filteredReports} />
//         </div>
//       )}

//       {selectedTab === "revenue" && (
//         <div>
//           <RevenueChart reports={filteredReports} />
//           <ReportTable
//             reports={filteredReports.filter((r) => r.type === "Revenue")}
//             onViewDetails={handleViewDetails}
//             onExport={handleExport}
//           />
//         </div>
//       )}

//       {selectedTab === "expense" && (
//         <div>
//           <ExpenseChart reports={filteredReports} />
//           <ReportTable
//             reports={filteredReports.filter((r) => r.type === "Expense")}
//             onViewDetails={handleViewDetails}
//             onExport={handleExport}
//           />
//         </div>
//       )}

//       {selectedTab === "profit" && (
//         <div>
//           <ProfitLossChart reports={filteredReports} />
//           <ReportTable
//             reports={filteredReports}
//             onViewDetails={handleViewDetails}
//             onExport={handleExport}
//           />
//         </div>
//       )}

//       {selectedTab === "custom" && (
//         <div
//           style={{
//             background: "var(--card-bg)",
//             border: "1px solid var(--border)",
//             borderRadius: "8px",
//             padding: "48px 24px",
//             textAlign: "center",
//             color: "var(--secondary)",
//           }}
//         >
//           <p style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>
//             Custom Reports
//           </p>
//           <p style={{ margin: 0, fontSize: "13px" }}>
//             Build your own custom reports by selecting the data, metrics, and visualizations you need.
//           </p>
//         </div>
//       )}

//       <ExportModal
//         isOpen={isExportModalOpen}
//         onClose={() => {
//           setIsExportModalOpen(false);
//           setExportReport(null);
//         }}
//         report={exportReport}
//       />

//       <ReportDetailsModal
//         isOpen={isDetailsModalOpen}
//         onClose={() => {
//           setIsDetailsModalOpen(false);
//         }}
//         report={selectedReport}
//       />
//     </div>
//   );
// }
