export type ContactType = "Customer" | "Prospect";

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  companyId?: string;
  companyName?: string;
  email: string;
  phone?: string;
  country?: string;
  type: ContactType;
  tags: string[];
  notes?: string;
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  country?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface ContactFilters {
  type?: ContactType | "All";
  tags?: string[];
  companyId?: string | "All";
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ContactActivityEntry {
  id: string;
  contactId: string;
  contactName: string;
  timestamp: string;
  type: "created" | "updated" | "deleted" | "tagged";
  details: string;
  user: string;
}
