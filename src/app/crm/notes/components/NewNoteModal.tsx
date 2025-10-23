"use client";

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Tag } from '@/types/notes';

const Schema = z.object({ title: z.string().min(1), linkedEntityType: z.enum(['Contact','Company','Deal']), linkedEntityId: z.string().optional(), tags: z.array(z.string()).optional(), description: z.string().optional(), ownerName: z.string().optional() });

interface Props { isOpen: boolean; onClose: ()=>void; onSave?: (payload:any)=>void; contacts?: any[]; companies?: any[]; deals?: any[]; tags?: Tag[] }

export function NewNoteModal({ isOpen, onClose, onSave, contacts = [], companies = [], deals = [], tags = [] }: Props) {
  const [form, setForm] = useState<any>({ title: '', linkedEntityType: 'Contact', linkedEntityId: '', tags: [], description: '', ownerName: '' });
  const [error, setError] = useState<string|null>(null);

  useEffect(()=>{ if(!isOpen) setForm({ title: '', linkedEntityType: 'Contact', linkedEntityId: '', tags: [], description: '', ownerName: '' }); }, [isOpen]);
  if(!isOpen) return null;

  const handleSave = ()=>{
    const res = Schema.safeParse(form);
    if(!res.success){ setError(res.error.issues.map(e=>e.message).join(', ')); return; }
    onSave?.({ ...form, linkedEntityName: (form.linkedEntityType === 'Contact' ? contacts.find(c=>c.id===form.linkedEntityId)?.fullName : form.linkedEntityType === 'Company' ? companies.find(c=>c.id===form.linkedEntityId)?.name : deals.find(d=>d.id===form.linkedEntityId)?.name) });
    onClose();
  };

  const optionsFor = (type: string) => {
    if(type === 'Contact') return contacts;
    if(type === 'Company') return companies;
    return deals;
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <motion.div className="modal" initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }}>
        <div className="modal-header">
          <h2>New Note</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Title</label>
              <input className="form-input" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Linked Entity Type</label>
              <select className="form-input" value={form.linkedEntityType} onChange={(e)=>setForm({...form, linkedEntityType: e.target.value, linkedEntityId: ''})}>
                <option>Contact</option>
                <option>Company</option>
                <option>Deal</option>
              </select>
            </div>

            <div>
              <label className="form-label">Linked Entity</label>
              <select className="form-input" value={form.linkedEntityId} onChange={(e)=>setForm({...form, linkedEntityId: e.target.value})}>
                <option value="">Select</option>
                {optionsFor(form.linkedEntityType).map((o:any)=>(<option key={o.id} value={o.id}>{o.name || o.fullName || o.firstName + ' ' + o.lastName}</option>))}
              </select>
            </div>

            <div>
              <label className="form-label">Owner</label>
              <input className="form-input" value={form.ownerName} onChange={(e)=>setForm({...form, ownerName: e.target.value})} placeholder="Owner name (demo)" />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Tags</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tags.map(t=>{
                  const selected = (form.tags||[]).includes(t.id);
                  return (
                    <button key={t.id} onClick={()=>setForm((f: { tags: any[]; })=>({ ...f, tags: selected ? f.tags.filter((x:string)=>x!==t.id) : [ ...(f.tags||[]), t.id ] }))} className="btn btn-ghost" style={{ borderRadius: 8, background: selected ? t.color : undefined }}>{t.name}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={4} value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
            </div>
          </div>

          {error && <div style={{ color: '#dc3545' }}>{error}</div>}

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Create Note</button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
