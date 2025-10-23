"use client";

import { useEffect, useState } from "react";
import { useActivities } from "@/store/useActivities";
import { Activity } from "@/types/activities";
import { ActivityStatsCards } from "./components/ActivityStatsCards";
import { ActivitiesTable } from "./components/ActivitiesTable";
import { ActivityTimeline } from "./components/ActivityTimeline";
import { CalendarView } from "./components/CalendarView";
import { NewActivityModal } from "./components/NewActivityModal";
import { EditActivityModal } from "./components/EditActivityModal";
import { ActivityDetailsDrawer } from "./components/ActivityDetailsDrawer";
import { FiltersBar } from "./components/FiltersBar";
import { useToast } from "@/components/toast";
import { Plus, AlertCircle } from "lucide-react";

export function ActivitiesPageClient() {
  const { activities, loadDemoData, addActivity, editActivity, deleteActivity, markCompleted, getFiltered, getUpcoming, getStats } = useActivities();
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [selected, setSelected] = useState<Activity | null>(null);
  const { showToast } = useToast();

  useEffect(() => { if (activities.length === 0) loadDemoData().catch(()=>showToast('Failed to load activities','error')); }, []);

  const stats = getStats();
  const filtered = getFiltered();
  const upcoming = getUpcoming(10);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div className="page-header">
          <div>
            <h2 className="dashboard-page-title">Activities</h2>
            <p className="dashboard-subtitle">Log and track customer interaction activities and follow-ups.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setIsNewOpen(true)}><Plus size={14} style={{ marginRight: 8 }} /> New Activity</button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section" role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={18} color="#f59e0b" />
            <span style={{ color: 'var(--secondary)' }}>⚙️ Activities tracking is under development.</span>
          </div>
        </div>

        <div className="dashboard-section">
          <FiltersBar onApply={(f)=>{ /* can wire to store.filterActivities */ showToast('Filters applied', 'info'); }} onReset={()=>{ showToast('Filters reset', 'info'); }} />

          <ActivityStatsCards total={stats.total} callsToday={stats.callsToday} meetings={stats.meetings} pendingFollowUps={stats.pendingFollowUps} />

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div>
              <div style={{ marginBottom: 12 }}>
                <CalendarView onQuickAdd={(date)=>{ setIsNewOpen(true); showToast('Quick add open', 'info'); }} />
              </div>

              <ActivitiesTable activities={filtered} onView={(a)=>setSelected(a)} onEdit={(a)=>setEditing(a)} onDelete={(id)=>{ deleteActivity(id); showToast('Activity deleted', 'success'); }} onMarkCompleted={(id)=>{ markCompleted(id); showToast('Marked completed', 'success'); }} />
            </div>

            <div>
              <div className="dashboard-section" style={{ marginBottom: 12 }}>
                <h3 className="section-title">Activity Timeline</h3>
                <ActivityTimeline activities={filtered} />
              </div>
              <div className="dashboard-section">
                <h3 className="section-title">Upcoming</h3>
                {upcoming.map(u => (
                  <div key={u.id} style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>{u.type} — {u.contactName || u.companyName} — {new Date(u.dateTime).toLocaleString()}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewActivityModal isOpen={isNewOpen} onClose={()=>setIsNewOpen(false)} onSave={(p)=>{ addActivity(p); showToast('Activity created', 'success'); setIsNewOpen(false); }} />
      <EditActivityModal isOpen={!!editing} activity={editing||undefined} onClose={()=>setEditing(null)} onSave={(id,p)=>{ editActivity(id,p); showToast('Activity updated', 'success'); setEditing(null); }} />

      <ActivityDetailsDrawer isOpen={!!selected} activity={selected||undefined} onClose={()=>setSelected(null)} onEdit={(a)=>{ setEditing(a); setSelected(null); }} onDelete={(id)=>{ deleteActivity(id); showToast('Activity deleted', 'success'); setSelected(null); }} onComplete={(id)=>{ markCompleted(id); showToast('Activity completed', 'success'); setSelected(null); }} />
    </div>
  );
}
