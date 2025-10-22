"use client";

import { useState } from "react";
import { useRecycleBin } from "@/store/useRecycleBin";
import { RetentionPolicy } from "@/types/recycle";
import { Save, Play, Clock } from "lucide-react";

interface RetentionPolicyEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RetentionPolicyEditor({ isOpen, onClose }: RetentionPolicyEditorProps) {
  const { policies, updateRetentionPolicy, getRecordsEligibleForAction, records } =
    useRecycleBin();

  const [editingPolicies, setEditingPolicies] = useState<Map<string, Partial<RetentionPolicy>>>(new Map());
  const [simulationResults, setSimulationResults] = useState<{
    toArchive: number;
    toPurge: number;
  } | null>(null);

  if (!isOpen) return null;

  const handlePolicyChange = (
    policyId: string,
    field: keyof RetentionPolicy,
    value: number
  ) => {
    setEditingPolicies((prev) => {
      const newMap = new Map(prev);
      const policy = newMap.get(policyId) || {};
      newMap.set(policyId, {
        ...policy,
        [field]: value,
      });
      return newMap;
    });
  };

  const handleSavePolicy = async (policyId: string) => {
    const changes = editingPolicies.get(policyId);
    if (changes) {
      await updateRetentionPolicy(policyId, changes);
      setEditingPolicies((prev) => {
        const newMap = new Map(prev);
        newMap.delete(policyId);
        return newMap;
      });
    }
  };

  const handleTestPolicy = () => {
    const archiveEligible = getRecordsEligibleForAction("archive");
    const purgeEligible = getRecordsEligibleForAction("purge");

    setSimulationResults({
      toArchive: archiveEligible.length,
      toPurge: purgeEligible.length,
    });
  };

  const getPolicyDisplay = (policyId: string, field: keyof RetentionPolicy) => {
    const policy = policies.find((p) => p.id === policyId);
    const editing = editingPolicies.get(policyId);
    if (editing && field in editing) {
      return editing[field];
    }
    return policy ? policy[field] : 0;
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[var(--card-bg)] rounded-lg border border-[var(--border)] shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 border-b border-[var(--border)] bg-[var(--card-bg)]">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Retention Policies
          </h2>
          <p className="text-sm text-[var(--secondary)] mt-1">
            Configure how long records are retained before archival and purge
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Test Policy Simulator */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Policy Simulator
                </h3>
                <p className="text-sm text-blue-800">
                  Test current policies to see which records would be archived or purged
                </p>
              </div>
              <button
                onClick={handleTestPolicy}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
              >
                <Play className="w-4 h-4" />
                Test Policy
              </button>
            </div>

            {simulationResults && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-white rounded p-3">
                  <p className="text-xs text-blue-600 mb-1">Records Eligible for Archive</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {simulationResults.toArchive}
                  </p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="text-xs text-red-600 mb-1">Records Eligible for Purge</p>
                  <p className="text-2xl font-bold text-red-900">
                    {simulationResults.toPurge}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Policies Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                    Module / Type
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                    Retention Period (days)
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                    Auto-Archive After (days)
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                    Auto-Purge After (days)
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => {
                  const hasChanges = editingPolicies.has(policy.id);
                  return (
                    <tr
                      key={policy.id}
                      className={`border-b border-[var(--border)] hover:bg-[var(--background)] transition-colors ${
                        hasChanges ? "bg-[var(--primary)]/5" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-sm font-medium text-[var(--foreground)]">
                        {policy.module === "default" ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                            Default Policy
                          </span>
                        ) : (
                          policy.module
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="1"
                          max="3650"
                          value={getPolicyDisplay(policy.id, "retentionDays")}
                          onChange={(e) =>
                            handlePolicyChange(
                              policy.id,
                              "retentionDays",
                              Number(e.target.value)
                            )
                          }
                          className="w-24 px-2 py-1 border border-[var(--border)] rounded text-center text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="1"
                          max="3650"
                          value={getPolicyDisplay(policy.id, "autoArchiveAfterDays")}
                          onChange={(e) =>
                            handlePolicyChange(
                              policy.id,
                              "autoArchiveAfterDays",
                              Number(e.target.value)
                            )
                          }
                          className="w-24 px-2 py-1 border border-[var(--border)] rounded text-center text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="1"
                          max="3650"
                          value={getPolicyDisplay(policy.id, "autoPurgeAfterDays")}
                          onChange={(e) =>
                            handlePolicyChange(
                              policy.id,
                              "autoPurgeAfterDays",
                              Number(e.target.value)
                            )
                          }
                          className="w-24 px-2 py-1 border border-[var(--border)] rounded text-center text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {hasChanges && (
                          <button
                            onClick={() => handleSavePolicy(policy.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-[var(--primary)] hover:opacity-90 text-white text-sm rounded transition-opacity"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Scheduled Purge Section */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-2">
                  Scheduled Purge
                </h3>
                <p className="text-sm text-amber-800 mb-3">
                  Run automatic purge operations on a schedule. The next scheduled purge will run tonight at 2:00 AM.
                </p>
                <div className="space-y-2">
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg font-medium transition-colors">
                    Run Purge Now
                  </button>
                  <p className="text-xs text-amber-700">
                    Last purge: 2 days ago (45 records deleted)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Soft vs Hard Delete Explanation */}
          <div className="bg-[var(--background)] rounded-lg p-4 border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--foreground)] mb-3">
              Understanding Soft and Hard Delete
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-[var(--foreground)] mb-1">
                  🗑️ Soft Delete (Initial)
                </p>
                <p className="text-[var(--secondary)]">
                  When a record is deleted, it's moved to the recycle bin but not permanently removed. 
                  It's searchable and restorable during the retention period.
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)] mb-1">
                  📦 Archive
                </p>
                <p className="text-[var(--secondary)]">
                  Archived records are moved to long-term storage (local, S3, or cloud). 
                  They're no longer in active storage but remain accessible for compliance.
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)] mb-1">
                  🔥 Hard Delete (Permanent)
                </p>
                <p className="text-[var(--secondary)]">
                  Permanently removes all traces of the record. This cannot be undone and is irreversible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-[var(--border)] px-6 py-4 bg-[var(--card-bg)] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--background)] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
