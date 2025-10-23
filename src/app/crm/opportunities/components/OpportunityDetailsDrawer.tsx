"use client";

import { motion } from 'framer-motion';
import { Opportunity } from '@/types/opportunities';
import { X, Edit2, Trash2 } from 'lucide-react';

interface Props { isOpen: boolean; opportunity?: Opportunity; onClose: ()=>void; onEdit?: (o: Opportunity)=>void; onMove?: (id: string, stage: string)=>void; onDelete?: (id: string)=>void }

export function OpportunityDetailsDrawer({ isOpen, opportunity, onClose, onEdit, onMove, onDelete }: Props) {
  if (!isOpen || !opportunity) return null;

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <motion.div className="slide-over" initial={{ x: '100%' }} animate={{ x: 0 }}>
        <div className="slide-over-header">
          <h2>{opportunity.name}</h2>
          <button className="slide-over-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="slide-over-content">
          <div className="details-section">
            <h3 className="details-title">Key Info</h3>
            <div className="detail-item"><span className="detail-label">Value</span><span className="detail-value">${opportunity.value.toLocaleString()}</span></div>
            <div className="detail-item"><span className="detail-label">Owner</span><span className="detail-value">{opportunity.ownerName||'-'}</span></div>
            <div className="detail-item"><span className="detail-label">Expected Close</span><span className="detail-value">{opportunity.expectedCloseDate?new Date(opportunity.expectedCloseDate).toLocaleDateString():'-'}</span></div>
            <div className="detail-item"><span className="detail-label">Probability</span><span className="detail-value">{opportunity.probability||'-'}%</span></div>
          </div>

          <div className="details-section">
            <h3 className="details-title">Related</h3>
            <div className="detail-item"><span className="detail-label">Company</span><span className="detail-value">{opportunity.companyName||'-'}</span></div>
            <div className="detail-item"><span className="detail-label">Contact</span><span className="detail-value">{opportunity.contactName||'-'}</span></div>
          </div>

          <div className="details-section">
            <h3 className="details-title">Description</h3>
            <div className="details-notes">{opportunity.description||'No description'}</div>
          </div>
        </div>

        <div className="slide-over-actions">
          <button className="btn btn-primary" onClick={()=>{ onEdit?.(opportunity); onClose(); }}><Edit2 size={16} /> Edit</button>
          <button className="btn btn-secondary" onClick={()=>{ onDelete?.(opportunity.id); onClose(); }} style={{ borderColor:'#dc3545', color:'#dc3545' }}><Trash2 size={16} /> Delete</button>
        </div>
      </motion.div>
    </>
  );
}
