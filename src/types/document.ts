export type DocumentStatus = "draft" | "sent" | "partially_signed" | "completed" | "approved" | "rejected" | "expired";
export type SigningMethod = "draw" | "image" | "type";
export type SigningOrder = "sequential" | "parallel";

export interface SignatureField {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  assignedTo: string;
  status: "pending" | "signed" | "rejected";
  signedAt?: string;
  signatureData?: string;
}

export interface Signer {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  status: "pending" | "signed" | "rejected" | "expired";
  signedAt?: string;
  signedBy?: string;
  fields: SignatureField[];
}

export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileSize?: number;
  fileUrl?: string;
  owner: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: DocumentStatus;
  signers: Signer[];
  signingOrder: SigningOrder;
  createdAt: string;
  sentAt?: string;
  completedAt?: string;
  expiresAt?: string;
  message?: string;
  reminders?: {
    frequency: "daily" | "weekly" | "once";
    lastSentAt?: string;
  };
  rejectionReason?: string;
  approvals?: DocumentApproval[];
  auditTrail: AuditEntry[];
}

export interface DocumentApproval {
  id: string;
  approverId: string;
  approverName: string;
  approvedAt: string;
  note?: string;
}

export interface SignatureData {
  method: SigningMethod;
  timestamp: string;
  signerId: string;
  signerEmail: string;
  ipAddress?: string;
  userAgent?: string;
  consentGiven: boolean;
  signatureImage?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: "created" | "sent" | "viewed" | "signed" | "rejected" | "approved" | "expired" | "resent" | "cancelled";
  userId: string;
  userName: string;
  fieldId?: string;
  details: string;
}

export interface DocumentRequest {
  title: string;
  fileName: string;
  fileContent?: string;
  signers: {
    email: string;
    name: string;
  }[];
  signingOrder: SigningOrder;
  fields: Omit<SignatureField, "id" | "status" | "signedAt" | "signatureData">[];
  message?: string;
  expiresIn: number;
  reminders?: {
    frequency: "daily" | "weekly" | "once";
  };
}

export interface SignFieldRequest {
  documentId: string;
  fieldId: string;
  signatureData: SignatureData;
}

export interface ApproveDocumentRequest {
  documentId: string;
  approverId: string;
  approverName: string;
  note?: string;
}

export interface RejectDocumentRequest {
  documentId: string;
  rejectReason: string;
}
