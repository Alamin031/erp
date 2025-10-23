export type LinkedEntityType = 'Contact' | 'Company' | 'Deal';

export interface Note {
  id: string;
  title: string;
  linkedEntityType: LinkedEntityType;
  linkedEntityId?: string;
  linkedEntityName?: string;
  tags: string[]; // tag ids
  description?: string;
  ownerId?: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface NoteFilters {
  linkedEntityType?: LinkedEntityType | 'All';
  ownerId?: string | 'All';
  tagIds?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface NoteActivityEntry {
  id: string;
  text: string;
  timestamp: string;
  entityType?: LinkedEntityType;
}
