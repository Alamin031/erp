"use client";

import { motion } from 'framer-motion';
import { Company } from '@/types/companies';
import { X, Edit2, Trash2, Users } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; company?: Company; onEdit?: (c: Company) => void; onDelete?: (id: string) => void }

export function CompanyDetailsDrawer({ isOpen, onClose, company, onEdit, onDelete }: Props) {
  if (!isOpen || !company) return null;

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <motion.div className="slide-over" initial={{ x: '100%' }} animate={{ x: 0 }}>
        <div className="slide-over-header">
          <h2>{company.name}</h2>
          <button className="slide-over-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="slide-over-content">
          <div className="details-section">
            <h3 className="details-title">Company Info</h3>
            <div className="detail-item"><span className="detail-label">Industry</span><span className="detail-value">{company.industry || '-'}</span></div>
            <div className="detail-item"><span className="detail-label">Country</span><span className="detail-value">{company.country || '-'}</span></div>
            <div className="detail-item"><span className="detail-label">Size</span><span className="detail-value">{company.size || '-'}</span></div>
            <div className="detail-item"><span className="detail-label">Website</span><span className="detail-value">{company.website || '-'}</span></div>
            <div className="detail-item"><span className="detail-label">Email</span><span className="detail-value">{company.email || '-'}</span></div>
            <div className="detail-item"><span className="detail-label">Phone</span><span className="detail-value">{company.phone || '-'}</span></div>
          </div>

          <div className="details-section">
            <h3 className="details-title">Linked Contacts</h3>
            {company.contacts && company.contacts.length > 0 ? (
              <div className="details-notes">{company.contacts.map(id => <div key={id} style={{ padding: 6, borderBottom: '1px solid var(--border)' }}>{id}</div>)}</div>
            ) : (
              <div className="details-notes">No linked contacts</div>
            )}
          </div>

          <div className="details-section">
            <h3 className="details-title">Description</h3>
            <div className="details-notes">{company.description || 'No description provided.'}</div>
          </div>
        </div>

        <div className="slide-over-actions">
          <button className="btn btn-primary" onClick={() => { onEdit?.(company); onClose(); }}><Edit2 size={16} /> Edit</button>
          <button className="btn btn-secondary" onClick={() => { onDelete?.(company.id); onClose(); }} style={{ borderColor: '#dc3545', color: '#dc3545' }}><Trash2 size={16} /> Delete</button>
        </div>
      </motion.div>
    </>
  );
}
