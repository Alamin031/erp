"use client";

import { motion } from 'framer-motion';
import { X, Edit2, Trash2 } from 'lucide-react';
import { NoteTags } from './NoteTags';
import { Note } from '@/types/notes';

interface Props { note?: Note | null; isOpen: boolean; onClose: ()=>void; onEdit?: (n: Note)=>void; onDelete?: (id: string)=>void }

export function NoteDetailsDrawer({ note, isOpen, onClose, onEdit, onDelete }: Props) {
  if(!isOpen || !note) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <motion.div className="drawer" initial={{ x: 300 }} animate={{ x: 0 }} style={{ width: 420 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{note.title}</h3>
          <div>
            <button className="btn btn-ghost" onClick={()=>onEdit?.(note)} style={{ marginRight: 8 }}><Edit2 size={16} /></button>
            <button className="btn btn-ghost" onClick={()=>onDelete?.(note.id)}><Trash2 size={16} /></button>
            <button className="modal-close" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ color: 'var(--muted)', marginBottom: 8 }}>{note.linkedEntityType}{note.linkedEntityName ? ` — ${note.linkedEntityName}` : ''}</div>
          <div style={{ marginBottom: 12 }}>
            <NoteTags tagIds={note.tags} />
          </div>
          <div style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>{note.description || '-'}</div>

          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            <div>Owner: {note.ownerName || note.ownerId || '-'}</div>
            <div>Created: {new Date(note.createdAt).toLocaleString()}</div>
            <div>Updated: {new Date(note.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
