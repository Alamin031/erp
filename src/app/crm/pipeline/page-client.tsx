"use client";

import { useEffect, useState } from "react";
import { usePipeline } from "@/store/usePipeline";
import { Opportunity, StageName } from "@/types/opportunities";
import { PipelineStatsCards } from "./components/PipelineStatsCards";
import { PipelineBoard } from "./components/PipelineBoard";
import { ConversionFunnelChart } from "./components/ConversionFunnelChart";
import { RevenueForecastChart } from "./components/RevenueForecastChart";
import { FiltersBar } from "./components/FiltersBar";
import { ActivityFeed } from "./components/ActivityFeed";
import { OpportunityDetailsDrawer } from "../opportunities/components/OpportunityDetailsDrawer";
import { EditOpportunityModal } from "../opportunities/components/EditOpportunityModal";
import { useOpportunities } from "@/store/useOpportunities";
import { useToast } from "@/components/toast";

export function PipelinePageClient() {
  const { loadDemoData, getTotals, getByStage, getConversionRates, moveOpportunity, filterPipeline } = usePipeline();
  const { editOpportunity, deleteOpportunity } = useOpportunities();
  const { showToast } = useToast();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [editing, setEditing] = useState<Opportunity | null>(null);

  useEffect(() => { loadDemoData().catch(()=>showToast('Failed to load pipeline demo','error')); }, []);

  const totals = getTotals();
  const byStage = getByStage();
  const conversion = getConversionRates();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div className="page-header">
          <div>
            <h2 className="dashboard-page-title">Sales Pipeline</h2>
            <p className="dashboard-subtitle">Visualize opportunities at each stage of the sales pipeline.</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section" role="status">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <strong>🚧 Sales pipeline visualization is under development.</strong>
          </div>
        </div>

        <div className="dashboard-section">
          <FiltersBar onApply={(f)=>{ filterPipeline(f); showToast('Filters applied','info'); }} onReset={()=>{ filterPipeline({}); showToast('Filters reset','info'); }} />

          <PipelineStatsCards total={totals.total} pipelineValue={totals.totalValue} winRate={totals.winRate} avgDealSize={totals.avgDealSize} />
        </div>

        <div className="dashboard-section" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px 24px 16px 24px' }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>Pipeline Board</h3>
          </div>
          <div style={{ overflowX: 'auto', padding: '0 24px 24px 24px' }}>
            <PipelineBoard 
              byStage={byStage} 
              onMove={(id,stage)=>{ moveOpportunity(id,stage); showToast('Opportunity moved','success'); }}
              onOpen={(opp) => setSelected(opp)}
            />
          </div>
        </div>

        <div className="responsive-grid-2-1">
          <div className="dashboard-section">
            <h3 className="section-title">Conversion Funnel</h3>
            <ConversionFunnelChart conversion={conversion} />
          </div>
          <div className="dashboard-section">
            <h3 className="section-title">Revenue Forecast</h3>
            <RevenueForecastChart />
          </div>
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">Activity Feed</h3>
          <ActivityFeed />
        </div>
      </div>

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
          showToast('Stage updated', 'success');
        }}
        onDelete={(id) => {
          deleteOpportunity(id);
          showToast('Opportunity deleted', 'success');
          setSelected(null);
        }}
      />

      <EditOpportunityModal
        isOpen={!!editing}
        opportunity={editing || undefined}
        onClose={() => setEditing(null)}
        onSave={(id, payload) => {
          editOpportunity(id, payload);
          showToast('Opportunity updated', 'success');
          setEditing(null);
        }}
      />
    </div>
  );
}
