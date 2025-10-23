"use client";

import { NewOpportunityModal } from './NewOpportunityModal';
import { Opportunity } from '@/types/opportunities';

interface Props { isOpen: boolean; opportunity?: Opportunity; onClose: ()=>void; onSave: (id: string, payload: any)=>void }

export function EditOpportunityModal({ isOpen, opportunity, onClose, onSave }: Props) {
  if (!isOpen || !opportunity) return null;
  return <NewOpportunityModal isOpen={isOpen} onClose={onClose} onSave={(payload)=>onSave(opportunity.id, payload)} />;
}
