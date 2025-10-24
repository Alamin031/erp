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
      <div className="modal">
        <motion.div className="modal-card" initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }}>
          <div className="modal-header">
            <h2>New Activity</h2>
            <button className="modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Activity Type <span style={{ color: '#dc3545' }}>*</span></label>
                <select className="form-input" value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})} style={{ width: '100%' }}>
                  <option>Call</option>
                  <option>Meeting</option>
                  <option>Email</option>
                  <option>Task</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Date & Time <span style={{ color: '#dc3545' }}>*</span></label>
                <input type="datetime-local" className="form-input" value={form.dateTime} onChange={(e)=>setForm({...form, dateTime: e.target.value})} style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Contact</label>
                <select className="form-input" value={form.contactId} onChange={(e)=>setForm({...form, contactId: e.target.value})} style={{ width: '100%' }}>
                  <option value="">Select</option>
                  {contacts.map(c=>(<option key={c.id} value={c.id}>{c.fullName || (c.firstName + ' ' + c.lastName)}</option>))}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Company</label>
                <select className="form-input" value={form.companyId} onChange={(e)=>setForm({...form, companyId: e.target.value})} style={{ width: '100%' }}>
                  <option value="">Select</option>
                  {companies.map(c=>(<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Owner</label>
                <input className="form-input" value={form.ownerId} onChange={(e)=>setForm({...form, ownerId: e.target.value, ownerName: e.target.value})} placeholder="Owner name or id" style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Follow-Up (optional)</label>
                <input type="datetime-local" className="form-input" value={form.followUp} onChange={(e)=>setForm({...form, followUp: e.target.value})} style={{ width: '100%' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Notes</label>
                <textarea className="form-input" rows={4} value={form.notes} onChange={(e)=>setForm({...form, notes: e.target.value})} placeholder="Add activity notes..." style={{ resize: 'vertical', width: '100%' }} />
              </div>
            </div>

            {error && <div style={{ color: '#dc3545', marginTop: 16, padding: '12px', background: 'rgba(220, 53, 69, 0.1)', borderRadius: '6px', fontSize: '14px' }}>{error}</div>}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Create Activity</button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
