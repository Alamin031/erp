export type EquityClassType = "Common" | "Preferred" | "Options" | "Convertible";
export type OwnershipChangeType = "Issuance" | "Transfer" | "Cancellation" | "Conversion" | "Split";

export interface Shareholder {
  id: string;
  name: string;
  email?: string;
  sharesHeld: number;
  ownershipPercentage: number;
  equityType: EquityClassType;
  joinDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquityClass {
  id: string;
  name: EquityClassType;
  authorizedShares: number;
  issuedShares: number;
  pricePerShare: number;
  description?: string;
  votingRights?: number; // percentage
  liquidationPreference?: number; // multiple
  conversionRatio?: number;
  lastUpdated: string;
}

export interface OwnershipChange {
  id: string;
  timestamp: string;
  type: OwnershipChangeType;
  shareholderId?: string;
  shareholderName: string;
  sharesQuantity: number;
  equityClass: EquityClassType;
  details: string;
  user: string;
}

export interface OwnershipSummary {
  totalShareholders: number;
  totalSharesOutstanding: number;
  authorizedShares: number;
  fullyDilutedOwnership: number; // percentage
  byEquityClass: EquityClassBreakdown[];
  byHolder: ShareholderOwnership[];
}

export interface EquityClassBreakdown {
  class: EquityClassType;
  authorizedShares: number;
  issuedShares: number;
  percentageOfTotal: number;
  holdersCount: number;
}

export interface ShareholderOwnership {
  shareholderId: string;
  shareholderName: string;
  equityType: EquityClassType;
  sharesHeld: number;
  ownershipPercentage: number;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: "Added" | "Updated" | "Deleted" | "Transferred";
  entity: "Shareholder" | "EquityClass" | "Shares";
  entityName: string;
  details: string;
  user: string;
}

export interface CapTableFilters {
  equityType?: EquityClassType | "All";
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}
