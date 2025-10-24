"use client";

import { useEffect, useState } from "react";
import { useCompanies } from "@/store/useCompanies";
import { Company } from "@/types/companies";
import { CompanyStatsCards } from "./components/CompanyStatsCards";
import { CompaniesTable } from "./components/CompaniesTable";
import { AnalyticsChart } from "./components/AnalyticsChart";
import { ActivityLog } from "./components/ActivityLog";
import { NewCompanyModal } from "./components/NewCompanyModal";
import { EditCompanyModal } from "./components/EditCompanyModal";
import { CompanyDetailsDrawer } from "./components/CompanyDetailsDrawer";
import { IndustryFilter } from "./components/IndustryFilter";
import { useToast } from "@/components/toast";
import { Plus, AlertCircle } from "lucide-react";

export function CompaniesPageClient() {
  const { companies, industries, loadDemoData, addCompany, editCompany, removeCompany, getFilteredCompanies, getStatistics } = useCompanies();
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [selected, setSelected] = useState<Company | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (companies.length === 0) loadDemoData().catch(() => showToast('Failed to load companies', 'error'));
  }, []);

  const stats = getStatistics();
  const filtered = getFilteredCompanies();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div className="page-header">
          <div>
            <h2 className="dashboard-page-title">Companies</h2>
            <p className="dashboard-subtitle">Manage company information and organizational details.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setIsNewOpen(true)}>
              <Plus size={14} style={{ marginRight: 8 }} /> New Company
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section" role="alert" aria-live="polite">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={18} color="#f59e0b" />
            <span style={{ color: 'var(--secondary)' }}>⚙️ Companies management is under development.</span>
          </div>
        </div>

        <div className="dashboard-section">
          <IndustryFilter />
          <CompanyStatsCards total={stats.total} activeClients={stats.activeClients} prospects={stats.prospects} avgEmployees={stats.avgEmployees} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            <CompaniesTable companies={filtered} onView={(c) => setSelected(c)} onEdit={(c) => setEditing(c)} onDelete={(id) => { removeCompany(id); showToast('Company deleted', 'success'); }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <div className="dashboard-section">
                <h3 className="section-title">Analytics</h3>
                <AnalyticsChart companies={filtered} />
              </div>
              <div className="dashboard-section">
                <h3 className="section-title">Recent Activity</h3>
                <ActivityLog limit={12} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewCompanyModal isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} industries={industries} onSave={(p) => { addCompany(p); showToast('Company added', 'success'); setIsNewOpen(false); }} />

      <EditCompanyModal isOpen={!!editing} company={editing || undefined} onClose={() => setEditing(null)} onSave={(id, p) => { editCompany(id, p); showToast('Company updated', 'success'); setEditing(null); }} industries={industries} />

      <CompanyDetailsDrawer isOpen={!!selected} company={selected || undefined} onClose={() => setSelected(null)} onEdit={(c) => { setEditing(c); setSelected(null); }} onDelete={(id) => { removeCompany(id); showToast('Company deleted', 'success'); setSelected(null); }} />
    </div>
  );
}
