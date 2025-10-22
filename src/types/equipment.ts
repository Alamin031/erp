export type EquipmentStatus = "Active" | "In Use" | "Under Maintenance" | "Retired";

export interface Supplier {
  id: string;
  name: string;
  contactEmail?: string;
  phone?: string;
}

export interface Equipment {
  id: string; // auto id
  name: string;
  sku: string;
  category: string;
  serialNumber?: string;
  purchaseDate?: string;
  supplierId?: string;
  purchasePrice?: number;
  warrantyExpiry?: string;
  location?: string;
  quantity: number;
  minStock: number;
  depreciationMethod?: "Straight-line" | "None";
  depreciationRate?: number; // % per year for straight-line
  notes?: string;
  images?: string[];
  status: EquipmentStatus;
  assignedTo?: string; // staff/room/project
  lastMaintenanceAt?: string;
  linkedWorkOrderIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentHistoryEntry {
  id: string;
  equipmentId: string;
  timestamp: string;
  type: "create" | "update" | "adjust" | "assign" | "link-wo" | "retire" | "maintenance";
  user: string;
  details: string;
  beforeQty?: number;
  afterQty?: number;
}
