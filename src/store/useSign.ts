"use client";

import { create } from "zustand";
import {
  Document,
  DocumentStatus,
  SignFieldRequest,
  DocumentRequest,
  ApproveDocumentRequest,
} from "@/types/document";

interface SignFilters {
  status?: DocumentStatus[];
  dateRange?: { from: string; to: string };
  owner?: string[];
  recipient?: string[];
  keyword?: string;
  showExpired?: boolean;
}

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface SignStore {
  documents: Document[];
  filters: SignFilters;
  pagination: PaginationParams;
  selectedDocumentId: string | null;
  isLoading: boolean;

  // Setters
  setDocuments: (docs: Document[]) => void;
  setFilters: (filters: SignFilters) => void;
  setPagination: (page: number, pageSize: number) => void;
  setSelectedDocumentId: (id: string | null) => void;

  // Data loading
  loadDemoData: () => Promise<void>;

  // Document actions
  createDocument: (request: DocumentRequest, ownerId: string, ownerEmail: string, ownerName: string) => Promise<Document>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  sendDocument: (id: string) => Promise<void>;
  cancelDocument: (id: string, reason: string) => Promise<void>;
  resendReminder: (id: string, signerId: string) => Promise<void>;

  // Signing actions
  signField: (request: SignFieldRequest) => Promise<void>;
  rejectDocument: (id: string, reason: string) => Promise<void>;

  // Admin actions
  approveDocument: (request: ApproveDocumentRequest) => Promise<void>;
  downloadDocument: (id: string) => Promise<void>;
  fetchAuditTrail: (id: string) => Promise<Document["auditTrail"]>;

  // Filtering & pagination
  getFilteredDocuments: () => Document[];
  getPagedDocuments: () => Document[];
  getDocumentById: (id: string) => Document | undefined;
  getSignerDocuments: (signerEmail: string) => Document[];
  getOwnerDocuments: (ownerEmail: string) => Document[];
  getPendingApprovals: () => Document[];
}

const addAuditEntry = (
  doc: Document,
  action: string,
  userId: string,
  userName: string,
  details: string,
  fieldId?: string
): Document => {
  return {
    ...doc,
    auditTrail: [
      ...(doc.auditTrail || []),
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: action as any,
        userId,
        userName,
        fieldId,
        details,
      },
    ],
  };
};

export const useSign = create<SignStore>((set, get) => ({
  documents: [],
  filters: {},
  pagination: { page: 1, pageSize: 10 },
  selectedDocumentId: null,
  isLoading: false,

  setDocuments: (docs) => set({ documents: docs }),

  setFilters: (filters) => set({ filters, pagination: { page: 1, pageSize: 10 } }),

  setPagination: (page, pageSize) => set({ pagination: { page, pageSize } }),

  setSelectedDocumentId: (id) => set({ selectedDocumentId: id }),

  loadDemoData: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/demo/demoDocuments.json");
      const data = await response.json();
      set({ documents: data?.documents || [], isLoading: false });
    } catch (error) {
      console.error("Failed to load demo data:", error);
      set({ isLoading: false });
    }
  },

  createDocument: async (request, ownerId, ownerEmail, ownerName) => {
    const now = Date.now();
    const newDoc: Document = {
      id: `doc-${now}`,
      title: request.title,
      fileName: request.fileName,
      fileSize: Math.floor(Math.random() * 1000000) + 100000,
      fileUrl: "/documents/sample.pdf",
      owner: {
        id: ownerId,
        name: ownerName,
        email: ownerEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${ownerName.replace(/\s+/g, '')}`,
      },
      status: "draft",
      signers: (request.signers || []).map((signer, idx) => ({
        id: `signer-${now}-${idx}`,
        email: signer.email,
        name: signer.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signer.name.replace(/\s+/g, '')}`,
        status: "pending",
        fields: (request.fields || [])
          .filter((f) => f.assignedTo === signer.email)
          .map((f, fi) => ({
            // use signer index + field index to create a unique id without accessing f.id (which is omitted in the incoming type)
            id: `field-${now}-${idx}-${fi}`,
            page: f.page,
            x: f.x,
            y: f.y,
            width: f.width,
            height: f.height,
            assignedTo: signer.email,
            status: "pending" as const,
          })),
      })),
      signingOrder: request.signingOrder,
      createdAt: new Date().toISOString(),
      message: request.message,
      reminders: request.reminders,
      expiresAt: request.expiresIn
        ? new Date(Date.now() + request.expiresIn * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      auditTrail: [
        {
          id: `audit-${now}`,
          timestamp: new Date().toISOString(),
          action: "created",
          userId: ownerId,
          userName: ownerName,
          details: "Document created",
        },
      ],
    };

    set((state) => ({ documents: [newDoc, ...state.documents] }));
    return newDoc;
  },

  updateDocument: async (id, updates) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }));
  },

  sendDocument: async (id) => {
    const doc = get().documents.find((d) => d.id === id);
    if (!doc) return;

    let updated = { ...doc };
    updated.status = "sent" as DocumentStatus;
    updated.sentAt = new Date().toISOString();
    updated = addAuditEntry(
      updated,
      "sent",
      doc.owner?.id ?? "unknown",
      doc.owner?.name ?? "Unknown",
      `Sent to ${doc.signers?.length ?? 0} signer${(doc.signers?.length ?? 0) !== 1 ? "s" : ""}`
    );

    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? updated : d)),
    }));
  },

  cancelDocument: async (id, reason) => {
    const doc = get().documents.find((d) => d.id === id);
    if (!doc) return;

    let updated = { ...doc };
    updated.status = "expired" as DocumentStatus;
    updated = addAuditEntry(
      updated,
      "expired",
      doc.owner?.id ?? "unknown",
      doc.owner?.name ?? "Unknown",
      `Document cancelled: ${reason}`
    );

    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? updated : d)),
    }));
  },

  resendReminder: async (id, signerId) => {
    const doc = get().documents.find((d) => d.id === id);
    if (!doc) return;

    let updated = { ...doc };
    updated = addAuditEntry(
      updated,
      "resent",
      doc.owner?.id ?? "unknown",
      doc.owner?.name ?? "Unknown",
      `Reminder resent to signer ${signerId}`
    );

    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? updated : d)),
    }));
  },

  signField: async (request) => {
    const doc = get().documents.find((d) => d.id === request.documentId);
    if (!doc) return;

    let updated = { ...doc };
    const signerIdx = updated.signers.findIndex(
      (s) => s.id === (request.signatureData as any).signerId
    );
    if (signerIdx === -1) return;

    const fieldIdx = updated.signers[signerIdx].fields.findIndex(
      (f) => f.id === request.fieldId
    );
    if (fieldIdx === -1) return;

    // ensure objects exist before mutation
    const signer = { ...updated.signers[signerIdx] };
    const field = { ...signer.fields[fieldIdx] };

    field.status = "signed";
    field.signedAt = request.signatureData.timestamp;
    field.signatureData = request.signatureData.signatureImage;

    signer.fields = [...signer.fields];
    signer.fields[fieldIdx] = field;
    signer.status = "signed";
    signer.signedAt = request.signatureData.timestamp;
    signer.signedBy = request.signatureData.signerEmail;

    updated.signers = [...updated.signers];
    updated.signers[signerIdx] = signer;

    const allSigned = updated.signers.every((s) => s.status === "signed");
    if (allSigned) {
      updated.status = "completed" as DocumentStatus;
      updated.completedAt = new Date().toISOString();
    } else {
      updated.status = "partially_signed" as DocumentStatus;
    }

    updated = addAuditEntry(
      updated,
      "signed",
      request.signatureData.signerId,
      request.signatureData.signerEmail,
      `Signature field signed`,
      request.fieldId
    );

    set((state) => ({
      documents: state.documents.map((d) => (d.id === request.documentId ? updated : d)),
    }));
  },

  rejectDocument: async (id, reason) => {
    const doc = get().documents.find((d) => d.id === id);
    if (!doc) return;

    let updated = { ...doc };
    updated.status = "rejected" as DocumentStatus;
    updated.rejectionReason = reason;
    updated = addAuditEntry(
      updated,
      "rejected",
      "current-signer",
      "Signer",
      `Document rejected: ${reason}`
    );

    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? updated : d)),
    }));
  },

  approveDocument: async (request) => {
    const doc = get().documents.find((d) => d.id === request.documentId);
    if (!doc) return;

    let updated = { ...doc };
    if (!updated.approvals) {
      updated.approvals = [];
    }

    updated.approvals = [
      ...updated.approvals,
      {
        id: `approval-${Date.now()}`,
        approverId: request.approverId,
        approverName: request.approverName,
        approvedAt: new Date().toISOString(),
        note: request.note,
      },
    ];

    updated.status = "approved" as DocumentStatus;
    updated = addAuditEntry(
      updated,
      "approved",
      request.approverId,
      request.approverName,
      `Document approved by ${request.approverName}. Note: ${request.note || "No note"}`
    );

    set((state) => ({
      documents: state.documents.map((d) => (d.id === request.documentId ? updated : d)),
    }));
  },

  downloadDocument: async (id) => {
    const doc = get().documents.find((d) => d.id === id);
    if (!doc) return;

    if (typeof document === "undefined") return;
    const element = document.createElement("a");
    element.setAttribute("href", doc.fileUrl || "/documents/sample.pdf");
    element.setAttribute("download", doc.fileName || "document.pdf");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },

  fetchAuditTrail: async (id) => {
    const doc = get().documents.find((d) => d.id === id);
    return doc?.auditTrail || [];
  },

  getFilteredDocuments: () => {
    const { documents, filters } = get();
    let filtered = [...documents];

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((d) => filters.status!.includes(d.status));
    }

    if (filters.dateRange) {
      const from = new Date(filters.dateRange.from);
      const to = new Date(filters.dateRange.to);
      filtered = filtered.filter((d) => {
        const date = new Date(d.createdAt);
        return date >= from && date <= to;
      });
    }

    if (filters.owner && filters.owner.length > 0) {
      filtered = filtered.filter((d) =>
        filters.owner!.includes(d.owner.id)
      );
    }

    if (filters.recipient && filters.recipient.length > 0) {
      filtered = filtered.filter((d) =>
        d.signers.some((s) => filters.recipient!.includes(s.email))
      );
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();

      const hasId = (x: unknown): x is { id: string } =>
        typeof x === "object" && x !== null && "id" in x && typeof (x as any).id === "string";

      filtered = filtered.filter(
        (d) =>
          (d.title || "").toLowerCase().includes(kw) ||
          (hasId(d) && (d.id || "").toLowerCase().includes(kw)) ||
          (d.owner?.name || "").toLowerCase().includes(kw)
      );
    }

    if (filters.showExpired === false) {
      // hide expired -> keep only not expired. If expiresAt is not set, treat as not expired.
      filtered = filtered.filter(
        (d) => (d.expiresAt ? new Date(d.expiresAt) > new Date() : true)
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getPagedDocuments: () => {
    const filtered = get().getFilteredDocuments();
    const { pagination } = get();
    const start = (pagination.page - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  },

  getDocumentById: (id) => {
    return get().documents.find((d) => d.id === id);
  },

  getSignerDocuments: (signerEmail) => {
    return get().documents.filter((d) =>
      d.signers.some((s) => s.email === signerEmail)
    );
  },

  getOwnerDocuments: (ownerEmail) => {
    return get().documents.filter((d) => d.owner.email === ownerEmail);
  },

  getPendingApprovals: () => {
    return get().documents.filter((d) => d.status === "completed");
  },
}));
