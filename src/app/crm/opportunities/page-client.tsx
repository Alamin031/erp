"use client";

import { useEffect, useState } from "react";
import { useOpportunities } from "@/store/useOpportunities";
import { Opportunity, StageName } from "@/types/opportunities";
import { OpportunityStatsCards } from "./components/OpportunityStatsCards";
import { PipelineView } from "./components/PipelineView";
import { OpportunitiesTable } from "./components/OpportunitiesTable";
import { AnalyticsChart } from "./components/AnalyticsChart";
import { ActivityLog } from "./components/ActivityLog";
import { NewOpportunityModal } from "./components/NewOpportunityModal";
import { EditOpportunityModal } from "./components/EditOpportunityModal";
import { OpportunityDetailsDrawer } from "./components/OpportunityDetailsDrawer";
import { useToast } from "@/components/toast";
import { Plus, AlertCircle } from "lucide-react";

export function OpportunitiesPageClient() {
  const {
    loadDemoData,
    getStats,
    getByStage,
    getFiltered,
    moveOpportunity,
    addOpportunity,
    editOpportunity,
    deleteOpportunity,
  } = useOpportunities();
  const [isNew, setIsNew] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadDemoData().catch(() =>
      showToast("Failed to load opportunities", "error")
    );
  }, []);

  const stats = getStats();
  const byStage = getByStage();
  const filtered = getFiltered();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div className="page-header">
          <div>
            <h2 className="dashboard-page-title">Opportunities</h2>
            <p className="dashboard-subtitle">
              Track sales opportunities and deal stages.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setIsNew(true)}>
              <Plus size={14} style={{ marginRight: 8 }} /> New Opportunity
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section" role="alert" aria-live="polite">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AlertCircle size={18} color="#2563eb" />
            <span style={{ color: "var(--secondary)" }}>
              💼 Opportunities management is under development.
            </span>
          </div>
        </div>

        <div className="dashboard-section">
          <OpportunityStatsCards
            total={stats.total}
            won={stats.won}
            lost={stats.lost}
            totalValue={stats.totalValue}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div>
              <PipelineView
                byStage={byStage}
                onMove={(id, stage) => {
                  moveOpportunity(id, stage as StageName);
                  showToast("Opportunity moved", "success");
                }}
                onOpen={(opp) => setSelected(opp)}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 24,
              }}
            >
              <div>
                <OpportunitiesTable
                  opportunities={filtered}
                  onView={(o) => setSelected(o)}
                  onEdit={(o) => setEditing(o)}
                  onDelete={(id) => {
                    deleteOpportunity(id);
                    showToast("Opportunity deleted", "success");
                  }}
                />
              </div>
              <div>
                <div className="dashboard-section" style={{ marginBottom: 16 }}>
                  <h3 className="section-title">Analytics</h3>
                  <AnalyticsChart opportunities={filtered} />
                </div>
                <div className="dashboard-section">
                  <h3 className="section-title">Recent Activity</h3>
                  <ActivityLog limit={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewOpportunityModal
        isOpen={isNew}
        onClose={() => setIsNew(false)}
        onSave={(p) => {
          addOpportunity(p);
          showToast("Opportunity created", "success");
          setIsNew(false);
        }}
      />
      <EditOpportunityModal
        isOpen={!!editing}
        opportunity={editing || undefined}
        onClose={() => setEditing(null)}
        onSave={(id, p) => {
          editOpportunity(id, p);
          showToast("Opportunity updated", "success");
          setEditing(null);
        }}
      />

      <OpportunityDetailsDrawer
        isOpen={!!selected}
        opportunity={selected || undefined}
        onClose={() => setSelected(null)}
        onEdit={(o) => {
          setEditing(o);
          setSelected(null);
        }}
        onMove={(id, stage) => {
          moveOpportunity(id, stage as StageName);
          showToast("Stage updated", "success");
        }}
        onDelete={(id) => {
          deleteOpportunity(id);
          showToast("Deleted", "success");
          setSelected(null);
        }}
      />
    </div>
  );
}
