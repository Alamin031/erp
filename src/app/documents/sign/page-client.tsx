"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useSign } from "@/store/useSign";
import { Document } from "@/types/document";
import { SendDocumentModal } from "@/components/Sign/SendDocumentModal";
import { DocumentList } from "@/components/Sign/DocumentList";
import { DocumentPreview } from "@/components/Sign/DocumentPreview";
import { SignFlow } from "@/components/Sign/SignFlow";
import { FiltersBar } from "@/components/Sign/FiltersBar";
import { ApprovalsPanel } from "@/components/Sign/ApprovalsPanel";
import { useToast } from "@/components/toast";
import { Send, CheckCircle, Clock, XCircle } from "lucide-react";

interface KPICard {
  label: string;
  value: number;
  color: string;
  icon: ReactNode;
}

export function SignPageClient() {
  const {
    documents,
    loadDemoData,
    resendReminder,
    cancelDocument,
    approveDocument,
  } = useSign();

  const { showToast } = useToast();

  // UI States
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<Document | null>(null);
  const [selectedForSign, setSelectedForSign] = useState<Document | null>(null);
  const [showSignFlow, setShowSignFlow] = useState(false);
  const [showApprovalsPanel, setShowApprovalsPanel] = useState(false);

  // Load demo data on mount
  useEffect(() => {
    if (documents.length === 0) {
      loadDemoData().catch(() =>
        showToast("Failed to load demo data", "error")
      );
    }
  }, [documents.length, loadDemoData, showToast]);

  // Calculate KPIs
  const kpis: KPICard[] = [
    {
      label: "Documents Sent",
      value: documents.filter((d) => d.sentAt).length,
      color: "bg-blue-100 text-blue-700",
      icon: <Send className="w-5 h-5" />,
    },
    {
      label: "Pending Signatures",
      value: documents.filter(
        (d) => d.status === "sent" || d.status === "partially_signed"
      ).length,
      color: "bg-yellow-100 text-yellow-700",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Completed",
      value: documents.filter(
        (d) => d.status === "completed" || d.status === "approved"
      ).length,
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      label: "Rejected",
      value: documents.filter((d) => d.status === "rejected").length,
      color: "bg-red-100 text-red-700",
      icon: <XCircle className="w-5 h-5" />,
    },
  ];

  // Handlers
  const handleView = (doc: Document) => {
    setSelectedPreview(doc);
  };

  const handleManage = (doc: Document) => {
    setSelectedForSign(doc);
    setShowSendModal(true);
  };

  const handleCancel = async (doc: Document) => {
    if (
      window.confirm(
        `Are you sure you want to cancel "${doc.title}"? This cannot be undone.`
      )
    ) {
      try {
        await cancelDocument(doc.id, "Document cancelled by user");
        showToast("Document cancelled", "success");
      } catch (error) {
        showToast("Failed to cancel document", "error");
      }
    }
  };

  const handleResend = async (doc: Document) => {
    try {
      for (const signer of doc.signers.filter((s) => s.status === "pending")) {
        await resendReminder(doc.id, signer.id);
      }
      showToast("Reminders sent to pending signers", "success");
    } catch (error) {
      showToast("Failed to send reminders", "error");
    }
  };

  const handleSignNow = (doc: Document) => {
    setSelectedForSign(doc);
    setShowSignFlow(true);
  };

  const handleApprove = async (doc: Document, note?: string) => {
    try {
      await approveDocument({
        documentId: doc.id,
        approverId: "current-user",
        approverName: "Current User",
        note: note ?? "",
      });
      showToast("Document approved", "success");
    } catch (error) {
      showToast("Failed to approve document", "error");
    }
  };

  const handleReject = async (doc: Document, reason?: string) => {
    try {
      // In a real app, this would call a reject API
      // use reason if provided, e.g. send it to the API or log it
      showToast("Document rejected", "success");
    } catch (error) {
      showToast("Failed to reject document", "error");
    }
  };

  const handleDownload = async (doc: Document) => {
    showToast("Download started", "success");
  };

  const getSigner = () => {
    if (!selectedForSign) return null;
    // In demo, just return first signer
    return selectedForSign.signers?.[0] ?? null;
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--foreground)' }}>Sign</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setShowApprovalsPanel(!showApprovalsPanel)}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Approvals
            </button>
            <button
              onClick={() => setShowSendModal(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Send size={16} />
              Send Document
            </button>
          </div>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Send, sign, and approve documents online for streamlined workflows.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: kpi.label.includes('Sent') ? 'rgba(59, 130, 246, 0.1)' :
                         kpi.label.includes('Pending') ? 'rgba(234, 179, 8, 0.1)' :
                         kpi.label.includes('Completed') ? 'rgba(34, 197, 94, 0.1)' :
                         'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: kpi.label.includes('Sent') ? '#3b82f6' :
                     kpi.label.includes('Pending') ? '#eab308' :
                     kpi.label.includes('Completed') ? '#22c55e' :
                     '#ef4444'
            }}>
              {kpi.icon}
            </div>
            <div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{kpi.label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--foreground)' }}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <div style={{ marginBottom: 20 }}>
        <FiltersBar />
      </div>

      {/* Documents Section */}
      <div style={{ 
        background: 'var(--card)', 
        border: '1px solid var(--border)', 
        borderRadius: 12,
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '16px 20px', 
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>
            Documents ({documents.length})
          </h3>
        </div>
        <div style={{ padding: 0 }}>
          {showApprovalsPanel ? (
            <div style={{ padding: 24 }}>
              <ApprovalsPanel
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          ) : (
            <DocumentList
              onView={handleView}
              onManage={handleManage}
              onCancel={handleCancel}
              onResend={handleResend}
            />
          )}
        </div>
      </div>

      {/* Modals & Slide-overs */}
      <SendDocumentModal
        isOpen={showSendModal}
        onClose={() => {
          setShowSendModal(false);
          setSelectedForSign(null);
        }}
        initialTitle={selectedForSign?.title}
      />

      <DocumentPreview
        document={selectedPreview}
        onClose={() => setSelectedPreview(null)}
        onSignNow={handleSignNow}
        onApprove={handleApprove}
        onReject={handleReject}
        onDownload={handleDownload}
      />

      <SignFlow
        isOpen={showSignFlow}
        document={selectedForSign}
        signer={getSigner()}
        onClose={() => {
          setShowSignFlow(false);
          setSelectedForSign(null);
        }}
        onSuccess={() => {
          setSelectedPreview(null);
        }}
      />
    </div>
  );
}

export default SignPageClient;
