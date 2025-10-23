export interface Company {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  country?: string;
  website?: string;
  email?: string;
  phone?: string;
  description?: string;
  tags?: string[];
  contacts?: string[]; // contact IDs
  status?: "Active" | "Prospect";
  createdAt: string;
  updatedAt: string;
}

export interface Industry {
  id: string;
  name: string;
  category?: string;
}

export interface CompanyFilters {
  industry?: string | "All";
  size?: string | "All";
  country?: string | "All";
  searchQuery?: string;
}
