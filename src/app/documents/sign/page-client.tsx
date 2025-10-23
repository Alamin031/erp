"use client";

import { useEffect, useState } from "react";
import { useSign } from "@/store/useSign";
import { Document } from "@/types/document";
import { SendDocumentModal } from "@/components/Sign/SendDocumentModal";
import { DocumentList } from "@/components/Sign/DocumentList";
import { DocumentPreview } from "@/components/Sign/DocumentPreview";
import { SignFlow } from "@/components/Sign/SignFlow";
import { FiltersBar } from "@/components/Sign/FiltersBar";
import { ApprovalsPanel } from "@/components/Sign/ApprovalsPanel";
import { useToast } from "@/components/toast";
import { Send, CheckCircle, Clock, XCircle, FileText } from "lucide-react";

interface KPICard {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

export function SignPageClient() {
  const {
    documents,
    loadDemoData,
    resendReminder,
    cancelDocument,
    approveDocument,
    sendDocument,
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
      confirm(
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

  const handleApprove = async (doc: Document, note: string) => {
    try {
      await approveDocument({
        documentId: doc.id,
        approverId: "current-user",
        approverName: "Current User",
        note,
      });
      showToast("Document approved", "success");
    } catch (error) {
      showToast("Failed to approve document", "error");
    }
  };

  const handleReject = async (doc: Document, reason: string) => {
    try {
      // In a real app, this would call a reject API
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
    return selectedForSign.signers[0];
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--card-bg)] border-b border-[var(--border)] px-8 py-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Sign</h1>
        <p className="text-[var(--secondary)] mt-1">
          Send, sign, and approve documents online for streamlined workflows.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="px-8 py-4 bg-[var(--background)] border-b border-[var(--border)] overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${kpi.color} min-w-fit`}
            >
              {kpi.icon}
              <div>
                <p className="text-sm font-semibold">{kpi.label}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="bg-[var(--card-bg)] border-b border-[var(--border)] px-8 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-[var(--foreground)]">
            Documents ({documents.length})
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApprovalsPanel(!showApprovalsPanel)}
              className="px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] text-[var(--foreground)] text-sm font-medium transition-colors"
            >
              Approvals
            </button>
            <button
              onClick={() => setShowSendModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white rounded-lg font-medium transition-opacity"
            >
              <Send className="w-4 h-4" />
              Send Document
            </button>
          </div>
        </div>

        {/* Content: Filters row above cards */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Filters Row */}
          <div className="px-8 py-4 border-b border-[var(--border)]">
            <FiltersBar />
          </div>

          {/* Main Panel */}
          <div className="flex-1 overflow-y-auto p-6">
            {showApprovalsPanel ? (
              <div className="p-6">
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
