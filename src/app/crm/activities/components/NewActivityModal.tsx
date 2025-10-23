"use client";

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const Schema = z.object({ type: z.enum(['Call','Meeting','Email','Task']), contactId: z.string().optional(), companyId: z.string().optional(), ownerId: z.string().optional(), dateTime: z.string().min(1), notes: z.string().optional(), followUp: z.string().optional() });

interface Props { isOpen: boolean; onClose: ()=>void; onSave?: (payload:any)=>void; contacts?: any[]; companies?: any[] }

export function NewActivityModal({ isOpen, onClose, onSave, contacts = [], companies = [] }: Props) {
  const [form, setForm] = useState<any>({ type: 'Call', contactId: '', companyId: '', ownerId: '', dateTime: '', notes: '', followUp: '' });
  const [error, setError] = useState<string|null>(null);

  useEffect(()=>{ if(!isOpen) setForm({ type: 'Call', contactId: '', companyId: '', ownerId: '', dateTime: '', notes: '', followUp: '' }); }, [isOpen]);
  if(!isOpen) return null;

  const handleSave = ()=>{
    const res = Schema.safeParse(form);
    if(!res.success){ setError(res.error.issues.map(e=>e.message).join(', ')); return; }
    onSave?.({ ...form, status: 'Pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), contactName: contacts.find(c=>c.id===form.contactId)?.fullName, companyName: companies.find(c=>c.id===form.companyId)?.name });
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <motion.div className="modal" initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }}>
        <div className="modal-header">
          <h2>New Activity</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Activity Type</label>
              <select className="form-input" value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})}>
                <option>Call</option>
                <option>Meeting</option>
                <option>Email</option>
                <option>Task</option>
              </select>
            </div>
            <div>
              <label className="form-label">Date & Time</label>
              <input type="datetime-local" className="form-input" value={form.dateTime} onChange={(e)=>setForm({...form, dateTime: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Contact</label>
              <select className="form-input" value={form.contactId} onChange={(e)=>setForm({...form, contactId: e.target.value})}>
                <option value="">Select</option>
                {contacts.map(c=>(<option key={c.id} value={c.id}>{c.fullName || (c.firstName + ' ' + c.lastName)}</option>))}
              </select>
            </div>
            <div>
              <label className="form-label">Company</label>
              <select className="form-input" value={form.companyId} onChange={(e)=>setForm({...form, companyId: e.target.value})}>
                <option value="">Select</option>
                {companies.map(c=>(<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="form-label">Owner</label>
              <input className="form-input" value={form.ownerId} onChange={(e)=>setForm({...form, ownerId: e.target.value, ownerName: e.target.value})} placeholder="Owner name or id (demo)" />
            </div>
            <div>
              <label className="form-label">Follow-Up (optional)</label>
              <input type="datetime-local" className="form-input" value={form.followUp} onChange={(e)=>setForm({...form, followUp: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows={3} value={form.notes} onChange={(e)=>setForm({...form, notes: e.target.value})} />
            </div>
          </div>

          {error && <div style={{ color: '#dc3545' }}>{error}</div>}

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Create Activity</button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
