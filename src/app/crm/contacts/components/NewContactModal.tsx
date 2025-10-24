"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Company, Tag } from "@/types/contacts";

const ContactSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  companyId: z.string().optional(),
  country: z.string().optional(),
  type: z.enum(["Customer", "Prospect"]),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  tags: Tag[];
  onSave?: (payload: any) => void;
}

export function NewContactModal({ isOpen, onClose, companies, tags, onSave }: Props) {
  const [form, setForm] = useState<any>({ firstName: "", lastName: "", email: "", phone: "", companyId: "", country: "", type: "Customer", tags: [] });
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) setForm({ firstName: "", lastName: "", email: "", phone: "", companyId: "", country: "", type: "Customer", tags: [] });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const result = ContactSchema.safeParse(form);
    if (!result.success) {
      setErrors(result.error.issues.map(i => i.message).join(", "));
      return;
    }

    onSave?.({
      ...form,
      email: form.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: form.tags || [],
      companyName: companies.find(c => c.id === form.companyId)?.name,
    });

    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="modal-header">
            <h2>Create Contact</h2>
            <button className="modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-form">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>First Name <span style={{ color: '#dc3545' }}>*</span></label>
                <input 
                  className="form-input" 
                  value={form.firstName} 
                  onChange={(e) => setForm({ ...form, firstName: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) })} 
                  placeholder="Enter first name"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Last Name <span style={{ color: '#dc3545' }}>*</span></label>
                <input 
                  className="form-input" 
                  value={form.lastName} 
                  onChange={(e) => setForm({ ...form, lastName: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) })} 
                  placeholder="Enter last name"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Email <span style={{ color: '#dc3545' }}>*</span></label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  placeholder="email@example.com"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Phone</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  placeholder="+1 (555) 000-0000"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Company</label>
                <select 
                  className="form-input" 
                  value={form.companyId} 
                  onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="">Select company</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Country</label>
                <input 
                  className="form-input" 
                  value={form.country} 
                  onChange={(e) => setForm({ ...form, country: e.target.value })} 
                  placeholder="United States"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Contact Type <span style={{ color: '#dc3545' }}>*</span></label>
                <select 
                  className="form-input" 
                  value={form.type} 
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Customer">Customer</option>
                  <option value="Prospect">Prospect</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Tags</label>
                <select 
                  className="form-input" 
                  multiple 
                  value={form.tags} 
                  onChange={(e) => setForm({ ...form, tags: Array.from(e.target.selectedOptions).map(o => o.value) })} 
                  style={{ height: 100, width: '100%' }}
                >
                  {tags.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                <small style={{ color: 'var(--secondary)', fontSize: 11, display: 'block', marginTop: 6 }}>Hold Ctrl/Cmd to select multiple</small>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>Notes</label>
                <textarea 
                  className="form-input" 
                  rows={4} 
                  value={form.notes} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                  placeholder="Add any additional notes..."
                  style={{ resize: 'vertical', width: '100%' }}
                />
              </div>
            </div>

            {errors && <div style={{ color: "#dc3545", marginTop: 16, padding: '12px', background: 'rgba(220, 53, 69, 0.1)', borderRadius: '6px', fontSize: '14px' }}>{errors}</div>}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Create Contact</button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
