"use client";

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCompanies } from '@/store/useCompanies';
import { useContacts } from '@/store/useContacts';

const Schema = z.object({ name: z.string().min(1), companyId: z.string().optional(), contactId: z.string().optional(), stage: z.string().min(1), source: z.string().optional(), ownerId: z.string().optional(), expectedCloseDate: z.string().optional(), value: z.number().min(0), description: z.string().optional() });

interface Props { isOpen: boolean; onClose: ()=>void; onSave?: (payload:any)=>void }

export function NewOpportunityModal({ isOpen, onClose, onSave }: Props) {
  const { companies } = useCompanies();
  const { contacts } = useContacts();
  const [form, setForm] = useState<any>({ name: '', companyId: '', contactId: '', stage: 'Prospecting', source: '', ownerId: '', expectedCloseDate: '', value: 0, description: '' });
  const [error, setError] = useState<string|null>(null);

  useEffect(()=>{ if(!isOpen) setForm({ name: '', companyId: '', contactId: '', stage: 'Prospecting', source: '', ownerId: '', expectedCloseDate: '', value: 0, description: '' }); }, [isOpen]);
  if(!isOpen) return null;

  const handleSave = ()=>{
    const res = Schema.safeParse({ ...form, value: Number(form.value) });
    if(!res.success){ setError(res.error.issues.map(i=>i.message).join(', ')); return; }
    onSave?.({ ...form, companyName: companies.find(c=>c.id===form.companyId)?.name, contactName: contacts.find(c=>c.id===form.contactId)?.fullName, status: 'In Progress', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <motion.div className="modal-card" initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }}>
          <div className="modal-header">
            <h2>Create Opportunity</h2>
            <button className="modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap:12 }}>
              <div>
                <label className="form-label">Opportunity Name</label>
                <input className="form-input" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="Enter opportunity name" />
              </div>
              <div>
                <label className="form-label">Company</label>
                <select className="form-input" value={form.companyId} onChange={(e)=>setForm({...form, companyId: e.target.value})}>
                  <option value="">Select company</option>
                  {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Contact</label>
                <select className="form-input" value={form.contactId} onChange={(e)=>setForm({...form, contactId: e.target.value})}>
                  <option value="">Select contact</option>
                  {contacts.map(c=><option key={c.id} value={c.id}>{c.fullName || (c.firstName + ' ' + c.lastName)}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Stage</label>
                <select className="form-input" value={form.stage} onChange={(e)=>setForm({...form, stage: e.target.value})}>
                  <option>Prospecting</option>
                  <option>Qualification</option>
                  <option>Proposal</option>
                  <option>Negotiation</option>
                  <option>Closed Won</option>
                  <option>Closed Lost</option>
                </select>
              </div>
              <div>
                <label className="form-label">Source</label>
                <input className="form-input" value={form.source} onChange={(e)=>setForm({...form, source: e.target.value})} placeholder="e.g., Website, Referral" />
              </div>
              <div>
                <label className="form-label">Owner</label>
                <input className="form-input" value={form.ownerId} onChange={(e)=>setForm({...form, ownerId: e.target.value, ownerName: e.target.value})} placeholder="Owner ID or name (demo)" />
              </div>
              <div>
                <label className="form-label">Expected Close Date</label>
                <input type="date" className="form-input" value={form.expectedCloseDate} onChange={(e)=>setForm({...form, expectedCloseDate: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Value</label>
                <input type="number" className="form-input" value={form.value} onChange={(e)=>setForm({...form, value: Number(e.target.value)})} placeholder="0" min="0" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} placeholder="Enter opportunity description..." />
              </div>
            </div>

            {error && <div style={{ color: '#dc3545', marginTop: 8 }}>{error}</div>}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Create</button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
