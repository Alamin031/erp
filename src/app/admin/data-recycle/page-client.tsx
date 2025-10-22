"use client";

import { useEffect, useState } from "react";
import { useRecycleBin } from "@/store/useRecycleBin";
import { RecycledRecord } from "@/types/recycle";
import { RecycleTable } from "@/components/DataRecycle/RecycleTable";
import { RecordPreview } from "@/components/DataRecycle/RecordPreview";
import { ActionConfirmModal, ActionType } from "@/components/DataRecycle/ActionConfirmModal";
import { ArchiveModal, ArchiveConfig } from "@/components/DataRecycle/ArchiveModal";
import { FiltersPanel } from "@/components/DataRecycle/FiltersPanel";
import { BulkActionsMenu } from "@/components/DataRecycle/BulkActionsMenu";
import { RetentionPolicyEditor } from "@/components/DataRecycle/RetentionPolicyEditor";
import { AuditLogsPanel } from "@/components/DataRecycle/AuditLogsPanel";
import { useToast } from "@/components/toast";
import {
  Settings,
  BarChart3,
  FileText,
  Trash2,
  AlertCircle,
  Filter,
} from "lucide-react";

interface KPICard {
  label: string;
  value: number;
  sublabel?: string;
  color: string;
  icon: React.ReactNode;
}

export function DataRecyclePageClient() {
  const {
    records,
    stats,
    loadDemoData,
    restoreRecord,
    archiveRecord,
    deleteRecordPermanently,
    bulkRestore,
    bulkArchive,
    bulkDelete,
    placeHold,
    removeHold,
    selectedRecordIds,
  } = useRecycleBin();

  const { showToast } = useToast();

  // UI State
  const [selectedRecord, setSelectedRecord] = useState<RecycledRecord | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [showActionConfirm, setShowActionConfirm] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showPolicyEditor, setShowPolicyEditor] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);

  // Load demo data
  useEffect(() => {
    if (records.length === 0) {
      loadDemoData().catch(() =>
        showToast("Failed to load demo data", "error")
      );
    }
  }, [records.length, loadDemoData, showToast]);

  // KPI Cards
  const kpis: KPICard[] = [
    {
      label: "Total Deleted",
      value: stats.totalDeleted,
      color: "bg-blue-100 text-blue-700",
      icon: <Trash2 className="w-5 h-5" />,
    },
    {
      label: "Eligible for Purge",
      value: stats.eligibleForPurge,
      sublabel: "ready to delete",
      color: "bg-red-100 text-red-700",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    {
      label: "Archived",
      value: stats.archived,
      sublabel: "in long-term storage",
      color: "bg-blue-100 text-blue-700",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Restorable",
      value: stats.restorable,
      sublabel: "can be restored",
      color: "bg-green-100 text-green-700",
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  // Action handlers
  const handleSelectRecord = (record: RecycledRecord) => {
    setSelectedRecord(record);
  };

  const handleRestore = (record: RecycledRecord) => {
    setSelectedRecord(record);
    setActionType("restore");
    setShowActionConfirm(true);
  };

  const handleArchive = (record: RecycledRecord) => {
    setSelectedRecord(record);
    setShowArchiveModal(true);
  };

  const handleDelete = (record: RecycledRecord) => {
    setSelectedRecord(record);
    setActionType("delete");
    setShowActionConfirm(true);
  };

  const handleConfirmAction = async (note: string) => {
    if (!selectedRecord || !actionType) return;

    try {
      if (actionType === "restore") {
        await restoreRecord(selectedRecord.id, note);
        showToast(
          `Record "${selectedRecord.title}" restored successfully`,
          "success"
        );
      } else if (actionType === "delete") {
        await deleteRecordPermanently(selectedRecord.id, note);
        showToast(
          `Record "${selectedRecord.title}" permanently deleted`,
          "success"
        );
      }

      setShowActionConfirm(false);
      setSelectedRecord(null);
      setActionType(null);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
    }
  };

  const handleArchiveConfirm = async (config: ArchiveConfig) => {
    if (!selectedRecord) return;

    try {
      await archiveRecord(selectedRecord.id, config.target, config.note);
      showToast(
        `Record "${selectedRecord.title}" archived successfully`,
        "success"
      );
      setShowArchiveModal(false);
      setSelectedRecord(null);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
    }
  };

  const handleBulkRestore = async (ids: string[], note: string) => {
    try {
      await bulkRestore(ids, note);
      showToast(`${ids.length} records restored successfully`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
    }
  };

  const handleBulkArchive = async (ids: string[], config: ArchiveConfig) => {
    try {
      await bulkArchive(ids, config.target, config.note);
      showToast(`${ids.length} records archived successfully`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
    }
  };

  const handleBulkDelete = async (ids: string[], note: string) => {
    try {
      await bulkDelete(ids, note);
      showToast(`${ids.length} records permanently deleted`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
    }
  };

  const handlePlaceHold = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await placeHold(id, "Placed via bulk actions");
      }
      showToast(`Hold placed on ${ids.length} records`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
    }
  };

  const handleRemoveHold = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await removeHold(id);
      }
      showToast(`Hold removed from ${ids.length} records`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--card-bg)] border-b border-[var(--border)] px-8 py-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Data Recycle
        </h1>
        <p className="text-[var(--secondary)] mt-1">
          Find old records and archive or permanently delete them.
        </p>
      </div>

      {/* KPI Chips */}
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
                {kpi.sublabel && (
                  <p className="text-xs opacity-75">{kpi.sublabel}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Filters Panel */}
        {showFiltersPanel && <FiltersPanel />}

        {/* Center Table + Actions */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Bulk Actions Toolbar */}
          {selectedRecordIds.length > 0 && (
            <BulkActionsMenu
              selectedCount={selectedRecordIds.length}
              onRestore={handleBulkRestore}
              onArchive={handleBulkArchive}
              onDelete={handleBulkDelete}
              onHold={handlePlaceHold}
              onRemoveHold={handleRemoveHold}
            />
          )}

          {/* Table */}
          <div className="flex-1 overflow-hidden m-6">
            <RecycleTable onSelectRecord={handleSelectRecord} />
          </div>
        </div>
      </div>

      {/* Footer Toolbar */}
      <div className="bg-[var(--card-bg)] border-t border-[var(--border)] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[var(--secondary)]">
          <Filter className="w-4 h-4" />
          <span>
            {records.length} total records | {selectedRecordIds.length} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            title="Toggle filters panel"
            className="p-2 hover:bg-[var(--background)] rounded transition-colors text-[var(--foreground)]"
          >
            <Filter className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowAuditLogs(true)}
            className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--background)] text-[var(--foreground)] transition-colors"
          >
            View Audit Logs
          </button>

          <button
            onClick={() => setShowPolicyEditor(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--primary)] hover:opacity-90 text-white rounded-lg font-medium transition-opacity"
          >
            <Settings className="w-4 h-4" />
            Retention Policies
          </button>
        </div>
      </div>

      {/* Record Preview Slide-over */}
      <RecordPreview
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onRestore={handleRestore}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />

      {/* Action Confirm Modal */}
      {actionType && (
        <ActionConfirmModal
          isOpen={showActionConfirm}
          actionType={actionType}
          recordTitle={selectedRecord?.title || ""}
          onConfirm={handleConfirmAction}
          onCancel={() => {
            setShowActionConfirm(false);
            setActionType(null);
          }}
          isDestructive={actionType === "delete"}
        />
      )}

      {/* Archive Modal */}
      <ArchiveModal
        isOpen={showArchiveModal}
        recordTitle={selectedRecord?.title || ""}
        recordSize={selectedRecord?.size}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setShowArchiveModal(false)}
      />

      {/* Retention Policy Editor */}
      <RetentionPolicyEditor
        isOpen={showPolicyEditor}
        onClose={() => setShowPolicyEditor(false)}
      />

      {/* Audit Logs Panel */}
      <AuditLogsPanel
        isOpen={showAuditLogs}
        onClose={() => setShowAuditLogs(false)}
      />
    </div>
  );
}
