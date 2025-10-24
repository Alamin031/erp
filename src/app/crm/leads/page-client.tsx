"use client";

import { useEffect, useMemo, useState } from "react";
import { useLeads } from "@/store/useLeads";
import { LeadsStatsCards } from "@/components/leads-stats-cards";
import { PipelineStageBoard } from "@/components/leads-pipeline-board";
import { LeadsTable } from "@/components/leads-table";
import { NewLeadModal } from "@/components/leads-new-modal";
import { LeadDetailsDrawer } from "@/components/leads-details-drawer";
import { LeadsFiltersBar } from "@/components/leads-filters-bar";
import { LeadsSearchBar } from "@/components/leads-search-bar";
import { LeadsActivityLog } from "@/components/leads-activity-log";
import { LeadsAnalyticsChart } from "@/components/leads-analytics-chart";
import { FollowUpScheduler } from "@/components/leads-followup-scheduler";
import { Lead, LeadStage } from "@/types/leads";
import { useToast } from "@/components/toast";
import { AlertCircle, Plus } from "lucide-react";

export function LeadsPageClient() {
  const {
    leads,
    salesAgents,
    leadSources,
    filters,
    loadDemoData,
    addLead,
    editLead,
    removeLead,
    changeStage,
    markConverted,
    markLost,
    scheduleFollowUp,
    getStatistics,
    getLeadsByStage,
    getFilteredLeads,
  } = useLeads();

  const { showToast } = useToast();

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);

  useEffect(() => {
    if (leads.length === 0) {
      loadDemoData().catch(() => showToast("Failed to load demo data", "error"));
    }
  }, []);

  const stats = getStatistics();
  const leadsByStage = getLeadsByStage();
  const filteredLeads = getFilteredLeads();

  const handleCreate = () => {
    setEditingLead(null);
    setIsNewOpen(true);
  };

  const handleSave = (payload: Omit<Lead, "id" | "createdAt" | "updatedAt" | "interactionHistory">) => {
    if (editingLead) {
      editLead(editingLead.id, payload);
      showToast("Lead updated successfully", "success");
    } else {
      addLead(payload);
      showToast("Lead created successfully", "success");
    }
    setIsNewOpen(false);
    setEditingLead(null);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsNewOpen(true);
  };

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const handleScheduleFollowUp = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFollowUpOpen(true);
  };

  const handleConfirmFollowUp = (date: string) => {
    if (!selectedLead) return;
    scheduleFollowUp(selectedLead.id, date);
    showToast("Follow-up scheduled", "success");
    setIsFollowUpOpen(false);
    setSelectedLead(null);
  };

  const handleMarkConverted = (id: string) => {
    markConverted(id);
    showToast("Lead marked as converted", "success");
  };

  const handleMarkLost = (id: string) => {
    const reason = window.prompt("Reason for marking as lost?") || "No reason provided";
    markLost(id, reason);
    showToast("Lead marked as lost", "success");
  };

  return (
    <div className="dashboard-container" style={{ overflow: "hidden" }}>
      <div className="dashboard-header-content">
        <div className="page-header">
          <div>
            <h2 className="dashboard-page-title">Leads</h2>
            <p className="dashboard-subtitle">Track and manage sales leads through the sales pipeline.</p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate} aria-label="Create new lead">
            <Plus size={16} style={{ marginRight: 8 }} /> New Lead
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section" role="alert" aria-live="polite">
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <AlertCircle size={18} color="#f59e0b" />
            <span style={{ color: "var(--secondary)" }}>⚙️ Leads management is under development.</span>
          </div>
        </div>

        <div className="dashboard-section" style={{ overflow: "hidden" }}>
          <div className="filters-section">
            <LeadsSearchBar />
            <LeadsFiltersBar />
          </div>

          <LeadsStatsCards
            totalLeads={stats.totalLeads}
            qualifiedLeads={stats.qualifiedLeads}
            convertedLeads={stats.convertedLeads}
            lostLeads={stats.lostLeads}
            conversionRate={stats.conversionRate}
            totalValue={stats.totalValue}
          />

          <div style={{ width: "100%", overflow: "hidden" }}>
            <PipelineStageBoard
              leadsByStage={leadsByStage}
              onEdit={handleEdit}
              onViewDetails={handleView}
              onChangeStage={(id, stage) => changeStage(id, stage)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            <div style={{ minWidth: 0, overflow: "hidden" }}>
              <LeadsTable
                leads={filteredLeads}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={(id) => removeLead(id)}
                onScheduleFollowUp={handleScheduleFollowUp}
                onChangeStage={(id, stage) => changeStage(id, stage)}
                onMarkConverted={handleMarkConverted}
                onMarkLost={handleMarkLost}
              />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, minWidth: 0 }}>
              <div className="dashboard-section">
                <h3 className="section-title">Analytics</h3>
                <LeadsAnalyticsChart leads={filteredLeads} />
              </div>
              <div className="dashboard-section">
                <h3 className="section-title">Recent Activity</h3>
                <LeadsActivityLog limit={12} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewLeadModal
        isOpen={isNewOpen}
        onClose={() => {
          setIsNewOpen(false);
          setEditingLead(null);
        }}
        lead={editingLead}
        salesAgents={salesAgents}
        leadSources={leadSources}
        onSave={handleSave}
      />

      <LeadDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        lead={selectedLead}
        onEdit={handleEdit}
        onScheduleFollowUp={handleScheduleFollowUp}
        onMarkConverted={handleMarkConverted}
        onMarkLost={handleMarkLost}
      />

      <FollowUpScheduler
        isOpen={isFollowUpOpen}
        onClose={() => setIsFollowUpOpen(false)}
        onConfirm={handleConfirmFollowUp}
        salesAgents={salesAgents}
        lead={selectedLead || undefined}
      />
    </div>
  );
}
