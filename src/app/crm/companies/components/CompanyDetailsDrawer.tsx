"use client";

import { motion } from 'framer-motion';
import { Company } from '@/types/companies';
import { X, Edit2, Trash2, Globe, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

interface Props { isOpen: boolean; onClose: () => void; company?: Company; onEdit?: (c: Company) => void; onDelete?: (id: string) => void }

export function CompanyDetailsDrawer({ isOpen, onClose, company, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !company) return null;

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete?.(company.id);
      onClose();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <motion.div className="slide-over" initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }}>
        <div className="slide-over-header">
          <h2>{company.name}</h2>
          <button className="slide-over-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="slide-over-content">
          <div className="details-section">
            <h3 className="details-title">Company Information</h3>
            <div className="detail-item">
              <span className="detail-label">Industry</span>
              <span className="detail-value">{company.industry || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Country</span>
              <span className="detail-value">{company.country || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Size</span>
              <span className="detail-value">{company.size || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value">
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  background: company.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  color: company.status === 'Active' ? '#10b981' : '#3b82f6'
                }}>
                  {company.status || 'Prospect'}
                </span>
              </span>
            </div>
          </div>

          <div className="details-section">
            <h3 className="details-title">Contact Information</h3>
            {company.website && (
              <div className="detail-item">
                <span className="detail-label"><Globe size={14} style={{ marginRight: 4 }} /> Website</span>
                <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="detail-value" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  {company.website}
                </a>
              </div>
            )}
            {company.email && (
              <div className="detail-item">
                <span className="detail-label"><Mail size={14} style={{ marginRight: 4 }} /> Email</span>
                <a href={`mailto:${company.email}`} className="detail-value" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  {company.email}
                </a>
              </div>
            )}
            {company.phone && (
              <div className="detail-item">
                <span className="detail-label"><Phone size={14} style={{ marginRight: 4 }} /> Phone</span>
                <a href={`tel:${company.phone}`} className="detail-value" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  {company.phone}
                </a>
              </div>
            )}
            {!company.website && !company.email && !company.phone && (
              <div className="details-notes">No contact information available</div>
            )}
          </div>

          {company.contacts && company.contacts.length > 0 && (
            <div className="details-section">
              <h3 className="details-title">Linked Contacts</h3>
              <div className="details-notes">
                {company.contacts.map(id => (
                  <div key={id} style={{ padding: 6, borderBottom: '1px solid var(--border)' }}>{id}</div>
                ))}
              </div>
            </div>
          )}

          {company.description && (
            <div className="details-section">
              <h3 className="details-title">Description</h3>
              <div className="details-notes">{company.description}</div>
            </div>
          )}
        </div>

        <div className="slide-over-actions">
          <button className="btn btn-primary" onClick={() => { onEdit?.(company); onClose(); }}>
            <Edit2 size={16} /> Edit
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleDelete}
            style={{ 
              borderColor: confirmDelete ? '#dc3545' : 'var(--border)', 
              color: confirmDelete ? '#dc3545' : 'var(--secondary)',
              background: confirmDelete ? 'rgba(220, 53, 69, 0.1)' : 'transparent'
            }}
          >
            <Trash2 size={16} /> {confirmDelete ? 'Click again to confirm' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </>
  );
}
