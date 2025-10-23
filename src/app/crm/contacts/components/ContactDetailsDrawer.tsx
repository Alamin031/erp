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
      <motion.div className="slide-over" initial={{ x: '100%' }} animate={{ x: 0 }}>
        <div className="slide-over-header">
          <h2>{contact.fullName || `${contact.firstName} ${contact.lastName}`}</h2>
          <button className="slide-over-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="slide-over-content">
          <div className="details-section">
            <h3 className="details-title">Contact Info</h3>
            <div className="detail-item"><span className="detail-label">Company</span><span className="detail-value">{contact.companyName || "-"}</span></div>
            <div className="detail-item"><span className="detail-label">Email</span><span className="detail-value">{contact.email}</span></div>
            <div className="detail-item"><span className="detail-label">Phone</span><span className="detail-value">{contact.phone || "-"}</span></div>
            <div className="detail-item"><span className="detail-label">Country</span><span className="detail-value">{contact.country || "-"}</span></div>
            <div className="detail-item"><span className="detail-label">Type</span><span className="detail-value">{contact.type}</span></div>
          </div>

          <div className="details-section">
            <h3 className="details-title">Notes</h3>
            <div className="details-notes">{contact.notes || "No notes"}</div>
          </div>

          <div className="details-section">
            <h3 className="details-title">Communication History</h3>
            <div className="details-notes">No communications recorded (demo)</div>
          </div>
        </div>

        <div className="slide-over-actions">
          <button className="btn btn-primary" onClick={() => { onEdit?.(contact); onClose(); }}><Edit2 size={16} /> Edit</button>
          <button className="btn btn-secondary" onClick={() => { onDelete?.(contact.id); onClose(); }} style={{ borderColor: '#dc3545', color: '#dc3545' }}><Trash2 size={16} /> Delete</button>
        </div>
      </motion.div>
    </>
  );
}
