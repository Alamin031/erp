"use client";

import { useState } from "react";
import { useRecycleBin } from "@/store/useRecycleBin";
import {
  ChevronDown,
  ChevronUp,
  X,
  Save,
  Trash2,
} from "lucide-react";
import { ModuleType, RetentionStatusType } from "@/types/recycle";

const MODULES: ModuleType[] = [
  "Reservation",
  "Invoice",
  "User",
  "Room",
  "Task",
  "Equipment",
  "Guest",
  "Campaign",
  "WorkOrder",
  "Payment",
];

const RETENTION_STATUSES: RetentionStatusType[] = [
  "eligible_for_purge",
  "protected",
  "archived",
  "within_retention",
];

interface FiltersPanelProps {
  onClose?: () => void;
}

export function FiltersPanel({ onClose }: FiltersPanelProps) {
  const {
    filters,
    setFilters,
    filterPresets,
    saveFilterPreset,
    loadFilterPreset,
    deleteFilterPreset,
  } = useRecycleBin();

  const [isExpanded, setIsExpanded] = useState(true);
  const [presetName, setPresetName] = useState("");
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    modules: true,
    dateRange: true,
    retention: true,
    storage: true,
    other: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleModuleChange = (module: ModuleType, checked: boolean) => {
    const modules = filters.modules || [];
    const newModules = checked
      ? [...modules, module]
      : modules.filter((m) => m !== module);

    setFilters({
      ...filters,
      modules: newModules.length > 0 ? newModules : undefined,
    });
  };

  const handleRetentionStatusChange = (
    status: RetentionStatusType,
    checked: boolean
  ) => {
    const statuses = filters.retentionStatus || [];
    const newStatuses = checked
      ? [...statuses, status]
      : statuses.filter((s) => s !== status);

    setFilters({
      ...filters,
      retentionStatus: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleDateRangeChange = (field: "from" | "to", value: string) => {
    const dateRange = filters.dateRange || {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
    };

    setFilters({
      ...filters,
      dateRange: {
        ...dateRange,
        [field]: value,
      },
    });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      saveFilterPreset(presetName, "current-user");
      setPresetName("");
      setShowPresetInput(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = !!(
    filters.modules ||
    filters.dateRange ||
    filters.keyword ||
    filters.olderThanDays ||
    filters.deletedBy ||
    filters.retentionStatus
  );

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="p-2 hover:bg-[var(--background)] rounded transition-colors text-[var(--foreground)]"
        title="Expand filters"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Filters</h2>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-[var(--background)] rounded transition-colors"
          title="Collapse filters"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Search */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-[var(--secondary)] uppercase mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.keyword || ""}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value || undefined })}
              placeholder="Record ID or title..."
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            />
          </div>

        {/* Module Type */}
        <div>
          <button
            onClick={() => toggleSection("modules")}
            className="w-full flex items-center justify-between mb-2 hover:text-[var(--primary)] transition-colors"
          >
            <label className="text-xs font-semibold text-[var(--secondary)] uppercase cursor-pointer">
              Module Type
            </label>
            {expandedSections.modules ? (
              <ChevronUp className="w-4 h-4 text-[var(--secondary)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--secondary)]" />
            )}
          </button>
          {expandedSections.modules && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
              {MODULES.map((module) => (
                <label key={module} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-[var(--background)] transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.modules?.includes(module) || false}
                    onChange={(e) => handleModuleChange(module, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-[var(--foreground)]">{module}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div>
          <button
            onClick={() => toggleSection("dateRange")}
            className="w-full flex items-center justify-between mb-2 hover:text-[var(--primary)] transition-colors"
          >
            <label className="text-xs font-semibold text-[var(--secondary)] uppercase cursor-pointer">
              Date Range
            </label>
            {expandedSections.dateRange ? (
              <ChevronUp className="w-4 h-4 text-[var(--secondary)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--secondary)]" />
            )}
          </button>
          {expandedSections.dateRange && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[var(--secondary)] mb-1">From</label>
                <input
                  type="date"
                  value={
                    filters.dateRange?.from ||
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) => handleDateRangeChange("from", e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--secondary)] mb-1">To</label>
                <input
                  type="date"
                  value={
                    filters.dateRange?.to ||
                    new Date().toISOString().split("T")[0]
                  }
                  onChange={(e) => handleDateRangeChange("to", e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Retention Status */}
        <div>
          <button
            onClick={() => toggleSection("retention")}
            className="w-full flex items-center justify-between mb-2 hover:text-[var(--primary)] transition-colors"
          >
            <label className="text-xs font-semibold text-[var(--secondary)] uppercase cursor-pointer">
              Retention Status
            </label>
            {expandedSections.retention ? (
              <ChevronUp className="w-4 h-4 text-[var(--secondary)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--secondary)]" />
            )}
          </button>
          {expandedSections.retention && (
            <div className="space-y-1.5">
              {RETENTION_STATUSES.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-[var(--background)] transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.retentionStatus?.includes(status) || false}
                    onChange={(e) => handleRetentionStatusChange(status, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-[var(--foreground)] capitalize">
                    {status.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Other Options */}
        <div>
          <button
            onClick={() => toggleSection("other")}
            className="w-full flex items-center justify-between mb-2 hover:text-[var(--primary)] transition-colors"
          >
            <label className="text-xs font-semibold text-[var(--secondary)] uppercase cursor-pointer">
              Other
            </label>
            {expandedSections.other ? (
              <ChevronUp className="w-4 h-4 text-[var(--secondary)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--secondary)]" />
            )}
          </button>
          {expandedSections.other && (
            <div>
              <label className="block text-xs text-[var(--secondary)] mb-1">
                Older than (days)
              </label>
              <input
                type="number"
                min="0"
                value={filters.olderThanDays || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    olderThanDays: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="Leave empty for any"
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="px-6 pb-4">
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2.5 text-sm border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>

      {/* Presets Footer */}
      <div className="border-t border-[var(--border)] p-6 bg-[var(--background)]">
        <div className="max-w-md mx-auto">
          {filterPresets.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold text-[var(--secondary)] uppercase">
                Saved Presets
              </p>
              {filterPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-[var(--card-bg)] group transition-colors border border-transparent hover:border-[var(--border)]"
                >
                  <button
                    onClick={() => loadFilterPreset(preset.id)}
                    className="flex-1 text-left text-sm text-[var(--primary)] hover:underline font-medium"
                  >
                    {preset.name}
                  </button>
                  <button
                    onClick={() => deleteFilterPreset(preset.id)}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                    title="Delete preset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showPresetInput && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset name..."
                className="flex-1 px-3 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                autoFocus
              />
              <button
                onClick={handleSavePreset}
                className="p-2 bg-[var(--primary)] hover:opacity-90 text-white rounded-lg transition-all"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
          )}

          {!showPresetInput && (
            <button
              onClick={() => setShowPresetInput(true)}
              className="w-full px-4 py-2.5 text-sm text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow"
            >
              Save Current Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
