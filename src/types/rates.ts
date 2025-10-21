export type RateType = "Base" | "Seasonal" | "Promo" | "Corporate" | "Package";
export type Channel = "All" | "OTA" | "Direct" | "Corporate";
export type RateStatus = "Active" | "Scheduled" | "Expired";
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type RuleOperator = "percentage_increase" | "percentage_decrease" | "fixed_surcharge" | "fixed_discount" | "multiplier";
export type RuleCondition = "occupancy" | "length_of_stay" | "lead_time" | "weekday" | "weekendOnly";

export interface Rate {
  id: string;
  code: string;
  name: string;
  roomType: string;
  rateType: RateType;
  channels: Channel[];
  effectiveFrom: string;
  effectiveTo: string;
  basePrice: number;
  currency: string;
  minStay?: number;
  maxStay?: number;
  blackoutDates?: string[];
  priority: number;
  status: RateStatus;
  rules?: string[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface RateRule {
  id: string;
  name: string;
  description?: string;
  operator: RuleOperator;
  value: number;
  conditions?: {
    type: RuleCondition;
    operator: "equals" | "greater_than" | "less_than" | "between";
    value: number | number[];
  }[];
  channelMultipliers?: Record<Channel, number>;
  weekdayDifferentials?: {
    monday?: number;
    tuesday?: number;
    wednesday?: number;
    thursday?: number;
    friday?: number;
    saturday?: number;
    sunday?: number;
  };
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface PriceAdjustment {
  id: string;
  rateId: string;
  adjustmentType: "increase" | "decrease" | "override";
  effectiveFrom: string;
  effectiveTo: string;
  percentage?: number;
  fixedAmount?: number;
  reason: string;
  approvalStatus: ApprovalStatus;
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RateAuditLog {
  id: string;
  rateId: string;
  action: "create" | "update" | "delete" | "approve" | "reject";
  changedFields?: Record<string, { from: any; to: any }>;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface RateFilters {
  roomType: string[];
  rateType: RateType[];
  channel: Channel[];
  status: RateStatus[];
  dateFrom: string;
  dateTo: string;
  priceFrom: number;
  priceTo: number;
  searchQuery: string;
}

export interface RateWithCalculatedPrice extends Rate {
  calculatedPrice: number;
  appliedRules: string[];
}

export interface ChannelOverride {
  rateId: string;
  channel: Channel;
  multiplier: number;
  overridePrice?: number;
  blackoutDates?: string[];
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface BulkUploadResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: {
    rowNumber: number;
    code: string;
    message: string;
  }[];
  warnings?: {
    rowNumber: number;
    message: string;
  }[];
}
