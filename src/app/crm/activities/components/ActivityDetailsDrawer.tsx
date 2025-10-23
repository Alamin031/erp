"use client";

import { motion } from 'framer-motion';
import { Activity } from '@/types/activities';
import { X } from 'lucide-react';

interface Props { isOpen: boolean; activity?: Activity; onClose: ()=>void; onEdit?: (a: Activity)=>void; onDelete?: (id: string)=>void; onComplete?: (id: string)=>void }

export function ActivityDetailsDrawer({ isOpen, activity, onClose, onEdit, onDelete, onComplete }: Props) {
  if (!isOpen || !activity) return null;

  const isOverdue = activity.status !== 'Completed' && new Date(activity.dateTime) < new Date();

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <motion.div className="slide-over" initial={{ x: '100%' }} animate={{ x: 0 }}>
        <div className="slide-over-header">
          <h2>{activity.type} — {activity.contactName || activity.companyName}</h2>
          <button className="slide-over-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="slide-over-content">
          <div className="details-section">
            <h3 className="details-title">Details</h3>
            <div className="detail-item"><span className="detail-label">Date/Time</span><span className="detail-value">{new Date(activity.dateTime).toLocaleString()}</span></div>
            <div className="detail-item"><span className="detail-label">Owner</span><span className="detail-value">{activity.ownerName || '-'}</span></div>
            <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value" style={{ color: isOverdue ? '#dc3545' : undefined }}>{isOverdue ? 'Overdue' : activity.status}</span></div>
          </div>
          <div className="details-section">
            <h3 className="details-title">Notes</h3>
            <div className="details-notes">{activity.notes || 'No notes'}</div>
          </div>
          {activity.followUp && (
            <div className="details-section">
              <h3 className="details-title">Follow-up</h3>
              <div className="detail-item"><span className="detail-value">{new Date(activity.followUp).toLocaleString()}</span></div>
            </div>
          )}
        </div>
        <div className="slide-over-actions">
          <button className="btn btn-primary" onClick={() => { onEdit?.(activity); onClose(); }}>Edit</button>
          <button className="btn btn-secondary" onClick={() => { onComplete?.(activity.id); onClose(); }}>Complete</button>
          <button className="btn" onClick={() => { onDelete?.(activity.id); onClose(); }} style={{ borderColor: '#dc3545', color: '#dc3545' }}>Delete</button>
        </div>
      </motion.div>
    </>
  );
}
