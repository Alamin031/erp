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
    if (!res.success) { setError(res.error.errors.map(e => e.message).join(', ')); return; }
    onSave?.({ ...form, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <motion.div className="modal" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="modal-header">
          <h2>Create Company</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Company Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Industry</label>
              <select className="form-input" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                <option value="">Select industry</option>
                {industries.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Size</label>
              <input className="form-input" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="e.g. 1-50" />
            </div>
            <div>
              <label className="form-label">Country</label>
              <input className="form-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Website</label>
              <input className="form-input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>

          {error && <div style={{ color: '#dc3545' }}>{error}</div>}

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Create Company</button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
