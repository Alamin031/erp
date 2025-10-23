"use client";

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/app/dashboard-layout';
import { NotesStatsCards } from './components/NotesStatsCards';
import { NotesTable } from './components/NotesTable';
import { ActivityTimeline } from './components/ActivityTimeline';
import { NewNoteModal } from './components/NewNoteModal';
import { EditNoteModal } from './components/EditNoteModal';
import { NoteDetailsDrawer } from './components/NoteDetailsDrawer';
import { useNotes } from '@/store/useNotes';

export default function NotesClientPage() {
  const loadDemoData = useNotes(s => s.loadDemoData);
  const notes = useNotes(s => s.notes);
  const tags = useNotes(s => s.tags);
  const addNote = useNotes(s => s.addNote);
  const editNote = useNotes(s => s.editNote);
  const deleteNote = useNotes(s => s.deleteNote);

  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<any|null>(null);
  const [viewing, setViewing] = useState<any|null>(null);

  useEffect(()=>{ loadDemoData(); }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Notes</h2>
          <div>
            <button className="btn btn-primary" onClick={()=>setShowNew(true)}>New Note</button>
          </div>
        </div>
        <p style={{ color: 'var(--muted)' }}>Create and manage notes on contacts, companies, and deals.</p>
      </div>

      <NotesStatsCards />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginTop: 16 }}>
        <div>
          <NotesTable notes={notes} tags={tags} onView={(n)=>setViewing(n)} onEdit={(n)=>setEditing(n)} onDelete={(id)=>deleteNote(id)} />
        </div>
        <div>
          <ActivityTimeline />
        </div>
      </div>

      <NewNoteModal isOpen={showNew} onClose={()=>setShowNew(false)} onSave={(p)=>{ addNote(p); setShowNew(false); }} />
      <EditNoteModal isOpen={!!editing} note={editing} onClose={()=>setEditing(null)} onSave={(id,p)=>{ editNote(id,p); setEditing(null); }} />
      <NoteDetailsDrawer note={viewing} isOpen={!!viewing} onClose={()=>setViewing(null)} onEdit={(n)=>{ setViewing(null); setEditing(n); }} onDelete={(id)=>{ deleteNote(id); setViewing(null); }} />
    </div>
  );
}
