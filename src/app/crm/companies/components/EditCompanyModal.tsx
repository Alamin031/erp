"use client";

import { NewCompanyModal } from './NewCompanyModal';
import { Company, Industry } from '@/types/companies';

interface Props { isOpen: boolean; company?: Company; onClose: () => void; onSave: (id: string, payload: any) => void; industries: Industry[] }

export function EditCompanyModal({ isOpen, company, onClose, onSave, industries }: Props) {
  if (!isOpen || !company) return null;

  // Reuse NewCompanyModal, but wrap onSave
  return (
    <NewCompanyModal isOpen={isOpen} onClose={onClose} industries={industries} onSave={(payload) => onSave(company.id, payload)} />
  );
}
