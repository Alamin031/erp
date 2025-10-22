export type ModuleType = "Reservation" | "Invoice" | "User" | "Room" | "Task" | "Equipment" | "Guest" | "Campaign" | "WorkOrder" | "Payment";
export type RetentionStatusType = "eligible_for_purge" | "protected" | "archived" | "within_retention";
export type StorageType = "active" | "archived" | "cloud";
export type ArchiveTarget = "local" | "s3" | "cloud";

export interface RecycledRecord {
  id: string;
  recordId: string;
  module: ModuleType;
  title: string;
  deletedAt: string;
  deletedBy: string;
  deletedByUserId: string;
  retentionStatusDaysLeft: number;
  retentionStatus: RetentionStatusType;
  currentStorage: StorageType;
  archivedAt?: string;
  archivedBy?: string;
  deletionReason?: string;
  originalLocation?: string;
  data: Record<string, any>;
  size?: number;
  isProtected?: boolean;
  onHold?: boolean;
  auditNotes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: "restore" | "archive" | "delete" | "policy_change" | "hold_placed" | "hold_removed";
  recordId?: string;
  recordModule?: ModuleType;
  details: string;
  affectedRecordCount?: number;
}

export interface RetentionPolicy {
  id: string;
  module: ModuleType | "default";
  retentionDays: number;
  autoArchiveAfterDays: number;
  autoPurgeAfterDays: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface RetentionPolicyException {
  id: string;
  recordId: string;
  exceptionType: "legal_hold" | "archival_hold" | "exempt";
  reason: string;
  createdAt: string;
  createdBy: string;
  expiresAt?: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  userId: string;
  filters: {
    modules?: ModuleType[];
    dateRange?: { from: string; to: string };
    deletedBy?: string[];
    retentionStatus?: RetentionStatusType[];
    storageType?: StorageType[];
    keyword?: string;
    olderThanDays?: number;
  };
  createdAt: string;
}

export interface RecycleStats {
  totalDeleted: number;
  eligibleForPurge: number;
  archived: number;
  restorable: number;
  totalStorageSize: number;
  protectedRecords: number;
}
