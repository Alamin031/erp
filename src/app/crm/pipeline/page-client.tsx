"use client";

import { useEffect, useState } from "react";
import { usePipeline } from "@/store/usePipeline";
import { PipelineStatsCards } from "./components/PipelineStatsCards";
import { PipelineBoard } from "./components/PipelineBoard";
import { ConversionFunnelChart } from "./components/ConversionFunnelChart";
import { RevenueForecastChart } from "./components/RevenueForecastChart";
import { FiltersBar } from "./components/FiltersBar";
import { ActivityFeed } from "./components/ActivityFeed";
import { useToast } from "@/components/toast";

export function PipelinePageClient() {
  const { loadDemoData, getTotals, getByStage, getConversionRates, moveOpportunity, filterPipeline } = usePipeline();
  const { showToast } = useToast();
  const [filtersOpen, setFiltersOpen] = useState(false);

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

          <div className="responsive-grid-2-1" style={{ marginTop: 12 }}>
            <div>
              <PipelineBoard byStage={byStage} onMove={(id,stage)=>{ moveOpportunity(id,stage); showToast('Opportunity moved','success'); }} />
            </div>
            <div>
              <div className="dashboard-section" style={{ marginBottom: 12 }}>
                <h3 className="section-title">Conversion Funnel</h3>
                <ConversionFunnelChart conversion={conversion} />
              </div>
              <div className="dashboard-section" style={{ marginBottom: 12 }}>
                <h3 className="section-title">Revenue Forecast</h3>
                <RevenueForecastChart />
              </div>
              <div className="dashboard-section">
                <h3 className="section-title">Activity Feed</h3>
                <ActivityFeed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
