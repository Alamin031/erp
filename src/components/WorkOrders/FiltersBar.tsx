"use client";

import { useWorkOrders } from "@/store/useWorkOrders";

export function FiltersBar() {
  const { filters, setFilters, technicians } = useWorkOrders();

  const update = (patch: Partial<typeof filters>) => {
    setFilters({ ...filters, ...patch });
  };

  return (
    <div className="filters-section">
      <div className="filters-row">
        <div className="filter-group">
          <label className="form-label">Status</label>
          <select className="form-input" value={filters.status} onChange={(e)=>update({ status: e.target.value as any })}>
            {['All','Open','In Progress','Paused','Completed'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="form-label">Priority</label>
          <select className="form-input" value={filters.priority} onChange={(e)=>update({ priority: e.target.value as any })}>
            {['All','Low','Medium','High','Critical'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="form-label">Asset Type</label>
          <select className="form-input" value={filters.assetType} onChange={(e)=>update({ assetType: e.target.value as any })}>
            {['All','Room','HVAC','Electrical','Plumbing','Elevator','Other'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="form-label">Technician</label>
          <select className="form-input" value={filters.technician} onChange={(e)=>update({ technician: e.target.value })}>
            <option value="All">All</option>
            {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="form-label">From</label>
          <input type="date" className="form-input" value={filters.dateFrom || ''} onChange={(e)=>update({ dateFrom: e.target.value })} />
        </div>
        <div className="filter-group">
          <label className="form-label">To</label>
          <input type="date" className="form-input" value={filters.dateTo || ''} onChange={(e)=>update({ dateTo: e.target.value })} />
        </div>
        <div className="filter-group">
          <label className="form-label">Overdue</label>
          <input type="checkbox" className="form-input" checked={!!filters.overdueOnly} onChange={(e)=>update({ overdueOnly: e.target.checked })} />
        </div>
      </div>
    </div>
  );
}
