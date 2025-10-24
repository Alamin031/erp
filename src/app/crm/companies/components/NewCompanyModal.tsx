"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Industry } from "@/types/companies";

const CompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  size: z.string().optional(),
  country: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["Active", "Prospect"]).optional(),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  industries: Industry[];
  onSave?: (payload: any) => void;
}

export function NewCompanyModal({ isOpen, onClose, industries, onSave }: Props) {
  const [form, setForm] = useState<any>({ name: "", industry: "", size: "", country: "", website: "", email: "", phone: "", description: "", tags: [], status: "Prospect" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!isOpen) setForm({ name: "", industry: "", size: "", country: "", website: "", email: "", phone: "", description: "", tags: [], status: "Prospect" }); }, [isOpen]);
  if (!isOpen) return null;

  const handleSave = () => {
    const res = CompanySchema.safeParse(form);
    if (!res.success) {
      setError(res.error.issues.map(i => i.message).join(', '));
      return;
    }
    onSave?.({ ...form, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="modal-header">
            <h2>Create Company</h2>
            <button className="modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Company Name <span style={{ color: '#dc3545' }}>*</span></label>
                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Industry</label>
                <select className="form-input" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} style={{ width: '100%' }}>
                  <option value="">Select industry</option>
                  {industries.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Country</label>
                <input className="form-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="United States" style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Size</label>
                <input className="form-input" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="e.g. 1-50" style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Website</label>
                <input type="url" className="form-input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://example.com" style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Phone</label>
                <input type="tel" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" style={{ width: '100%' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Email</label>
                <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@company.com" style={{ width: '100%' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Description</label>
                <textarea className="form-input" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Company description..." style={{ resize: 'vertical', width: '100%' }} />
              </div>
            </div>

            {error && <div style={{ color: '#dc3545', marginTop: 16, padding: '12px', background: 'rgba(220, 53, 69, 0.1)', borderRadius: '6px', fontSize: '14px' }}>{error}</div>}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Create Company</button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
