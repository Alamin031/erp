"use client";

import { NewActivityModal } from './NewActivityModal';
import { Activity } from '@/types/activities';

interface Props { isOpen: boolean; activity?: Activity; onClose: ()=>void; onSave: (id: string, payload: any)=>void; contacts?: any[]; companies?: any[] }

export function EditActivityModal({ isOpen, activity, onClose, onSave, contacts, companies }: Props) {
  if (!isOpen || !activity) return null;
  // Reuse NewActivityModal by mapping onSave
  return <NewActivityModal isOpen={isOpen} onClose={onClose} contacts={contacts} companies={companies} onSave={(payload)=>onSave(activity.id, payload)} />;
}
