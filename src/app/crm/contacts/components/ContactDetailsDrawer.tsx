"use client";

import { motion } from "framer-motion";
import { Contact } from "@/types/contacts";
import { X, Edit2, Trash2 } from "lucide-react";

interface Props { isOpen: boolean; onClose: () => void; contact?: Contact; onEdit?: (c: Contact) => void; onDelete?: (id: string) => void }

export function ContactDetailsDrawer({ isOpen, onClose, contact, onEdit, onDelete }: Props) {
  if (!isOpen || !contact) return null;

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <motion.div className="slide-over" initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }}>
        <div className="slide-over-header">
          <h2 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
            {contact.fullName || `${contact.firstName} ${contact.lastName}`}
          </h2>
          <button className="slide-over-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="slide-over-content">
          <div className="details-section">
            <h3 className="details-title">Contact Info</h3>
            <div className="detail-item"><span className="detail-label">Type</span><span className="detail-value">{contact.type}</span></div>
            <div className="detail-item"><span className="detail-label">Company</span><span className="detail-value">{contact.companyName || "-"}</span></div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value" style={{ wordBreak: 'break-word' }}>
                <a href={`mailto:${contact.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  {contact.email}
                </a>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">
                {contact.phone ? (
                  <a href={`tel:${contact.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    {contact.phone}
                  </a>
                ) : "-"}
              </span>
            </div>
            <div className="detail-item"><span className="detail-label">Country</span><span className="detail-value">{contact.country || "-"}</span></div>
          </div>

          {contact.tags && contact.tags.length > 0 && (
            <div className="details-section">
              <h3 className="details-title">Tags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {contact.tags.map((tag, idx) => (
                  <span key={idx} style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    padding: '4px 12px', 
                    borderRadius: 12, 
                    fontSize: 12,
                    fontWeight: 500
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="details-section">
            <h3 className="details-title">Notes</h3>
            <div className="details-notes">{contact.notes || "No notes available."}</div>
          </div>

          {(contact.createdAt || contact.updatedAt) && (
            <div className="details-section">
              <h3 className="details-title">Timeline</h3>
              {contact.createdAt && (
                <div className="detail-item">
                  <span className="detail-label">Created</span>
                  <span className="detail-value">{new Date(contact.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {contact.updatedAt && (
                <div className="detail-item">
                  <span className="detail-label">Last Updated</span>
                  <span className="detail-value">{new Date(contact.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}

          <div className="details-section">
            <h3 className="details-title">Communication History</h3>
            <div className="details-notes" style={{ color: 'var(--secondary)', fontStyle: 'italic' }}>
              No communications recorded (demo)
            </div>
          </div>
        </div>

        <div className="slide-over-actions">
          <button className="btn btn-primary" onClick={() => { onEdit?.(contact); }}>
            <Edit2 size={16} style={{ marginRight: 6 }} /> Edit
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => { 
              if(confirm(`Are you sure you want to delete ${contact.fullName || contact.firstName + ' ' + contact.lastName}?`)) {
                onDelete?.(contact.id); 
                onClose(); 
              }
            }} 
            style={{ borderColor: '#dc3545', color: '#dc3545' }}
          >
            <Trash2 size={16} style={{ marginRight: 6 }} /> Delete
          </button>
        </div>
      </motion.div>
    </>
  );
}
