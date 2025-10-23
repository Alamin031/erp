"use client";

import { NewContactModal } from "./NewContactModal";
import { Contact, Company, Tag } from "@/types/contacts";

interface Props { isOpen: boolean; contact?: Contact; onClose: () => void; onSave: (id: string, payload: any) => void; companies: Company[]; tags: Tag[] }

export function EditContactModal({ isOpen, contact, onClose, onSave, companies, tags }: Props) {
  if (!isOpen || !contact) return null;

  // Reuse NewContactModal UI by providing prefilled and custom onSave
  return (
    <NewContactModal
      isOpen={isOpen}
      onClose={onClose}
      companies={companies}
      tags={tags}
      onSave={(payload) => onSave(contact.id, payload)}
    />
  );
}
