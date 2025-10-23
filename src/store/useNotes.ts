import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Note, Tag, NoteFilters, NoteActivityEntry, LinkedEntityType } from "@/types/notes";

interface NotesStore {
  notes: Note[];
  tags: Tag[];
  filters: NoteFilters;
  log: NoteActivityEntry[];

  loadDemoData: () => Promise<void>;
  addNote: (payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editNote: (id: string, payload: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  assignTags: (id: string, tagIds: string[]) => void;
  filterNotes: (f: NoteFilters) => void;
  getNotesByEntity: (entityType: LinkedEntityType, entityId?: string) => Note[];
}

export const useNotes = create<NotesStore>()(
  persist((set, get) => ({
    notes: [],
    tags: [],
    filters: {},
    log: [],

    loadDemoData: async () => {
      try {
        const [notes, tags, contacts, companies, deals] = await Promise.all([
          fetch('/demo/demoNotes.json').then(r => r.json()).catch(() => []),
          fetch('/demo/demoTags.json').then(r => r.json()).catch(() => []),
          fetch('/demo/demoContacts.json').then(r => r.json()).catch(() => []),
          fetch('/demo/demoCompanies.json').then(r => r.json()).catch(() => []),
          fetch('/demo/demoOpportunities.json').then(r => r.json()).catch(() => []),
        ]);

        // Ensure newest first
        const sorted = (notes || []).sort((a: Note, b: Note) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        set({ notes: sorted, tags: tags || [], log: [{ id: `log-${Date.now()}`, text: `Loaded ${sorted.length} notes`, timestamp: new Date().toISOString() }] });
      } catch (e) { console.error('Failed to load notes demo', e); }
    },

    addNote: (payload) => {
      const id = `NOTE-${Date.now()}`;
      const now = new Date().toISOString();
      const note: Note = { ...payload, id, createdAt: now, updatedAt: now } as Note;
      set(state => ({ notes: [note, ...state.notes], log: [{ id: `log-${Date.now()}`, text: `Note created: ${note.title}`, timestamp: now, entityType: note.linkedEntityType }, ...state.log] }));
    },

    editNote: (id, payload) => {
      const now = new Date().toISOString();
      set(state => ({ notes: state.notes.map(n => n.id === id ? { ...n, ...payload, updatedAt: now } : n), log: [{ id: `log-${Date.now()}`, text: `Note updated: ${id}`, timestamp: now }, ...state.log] }));
    },

    deleteNote: (id) => {
      set(state => ({ notes: state.notes.filter(n => n.id !== id), log: [{ id: `log-${Date.now()}`, text: `Note deleted: ${id}`, timestamp: new Date().toISOString() }, ...state.log] }));
    },

    assignTags: (id, tagIds) => {
      const now = new Date().toISOString();
      set(state => ({ notes: state.notes.map(n => n.id === id ? { ...n, tags: Array.from(new Set([...(n.tags||[]), ...tagIds])) } : n), log: [{ id: `log-${Date.now()}`, text: `Tags assigned to ${id}: ${tagIds.join(', ')}`, timestamp: now }, ...state.log] }));
    },

    filterNotes: (f) => set({ filters: f }),

    getNotesByEntity: (entityType, entityId) => get().notes.filter(n => n.linkedEntityType === entityType && (!entityId || n.linkedEntityId === entityId)).sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

  }), { name: 'notes-store' })
);
