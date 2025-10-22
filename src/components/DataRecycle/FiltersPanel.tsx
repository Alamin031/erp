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
    <div className="w-64 bg-[var(--card-bg)] border-r border-[var(--border)] h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--foreground)]">Filters</h2>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-[var(--background)] rounded transition-colors"
          title="Collapse filters"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        {/* Clear & Save */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors text-[var(--foreground)]"
          >
            Clear Filters
          </button>
        )}

        {/* Search */}
        <div>
          <label className="text-xs font-semibold text-[var(--secondary)] uppercase">
            Search
          </label>
          <input
            type="text"
            value={filters.keyword || ""}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value || undefined })}
            placeholder="Record ID or title..."
            className="w-full mt-1 px-2 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded text-sm text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Module Type */}
        <div>
          <button
            onClick={() => toggleSection("modules")}
            className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-[var(--background)] transition-colors"
          >
            <label className="text-xs font-semibold text-[var(--secondary)] uppercase">
              Module Type
            </label>
            {expandedSections.modules ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.modules && (
            <div className="space-y-2 mt-2 pl-2 border-l border-[var(--border)]">
              {MODULES.map((module) => (
                <label key={module} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.modules?.includes(module) || false}
                    onChange={(e) => handleModuleChange(module, e.target.checked)}
                    className="rounded"
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
            className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-[var(--background)] transition-colors"
          >
            <label className="text-xs font-semibold text-[var(--secondary)] uppercase">
              Date Range
            </label>
            {expandedSections.dateRange ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.dateRange && (
            <div className="space-y-2 mt-2 pl-2 border-l border-[var(--border)]">
              <div>
                <label className="text-xs text-[var(--secondary)]">From</label>
                <input
                  type="date"
                  value={
                    filters.dateRange?.from ||
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) => handleDateRangeChange("from", e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--secondary)]">To</label>
                <input
                  type="date"
                  value={
                    filters.dateRange?.to ||
                    new Date().toISOString().split("T")[0]
                  }
                  onChange={(e) => handleDateRangeChange("to", e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Retention Status */}
        <div>
          <button
            onClick={() => toggleSection("retention")}
            className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-[var(--background)] transition-colors"
          >
            <label className="text-xs font-semibold text-[var(--secondary)] uppercase">
              Retention Status
            </label>
            {expandedSections.retention ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.retention && (
            <div className="space-y-2 mt-2 pl-2 border-l border-[var(--border)]">
              {RETENTION_STATUSES.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.retentionStatus?.includes(status) || false}
                    onChange={(e) => handleRetentionStatusChange(status, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-[var(--foreground)]">
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
            className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-[var(--background)] transition-colors"
          >
            <label className="text-xs font-semibold text-[var(--secondary)] uppercase">
              Other
            </label>
            {expandedSections.other ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.other && (
            <div className="space-y-2 mt-2 pl-2 border-l border-[var(--border)]">
              <div>
                <label className="text-xs text-[var(--secondary)]">
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
                  className="w-full mt-1 px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-sm text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Presets Footer */}
      <div className="border-t border-[var(--border)] p-4 space-y-2">
        {filterPresets.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[var(--secondary)] uppercase">
              Saved Presets
            </p>
            {filterPresets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-[var(--background)] group"
              >
                <button
                  onClick={() => loadFilterPreset(preset.id)}
                  className="flex-1 text-left text-xs text-[var(--primary)] hover:underline"
                >
                  {preset.name}
                </button>
                <button
                  onClick={() => deleteFilterPreset(preset.id)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                  title="Delete preset"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showPresetInput && (
          <div className="flex gap-2">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name..."
              className="flex-1 px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-sm text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              autoFocus
            />
            <button
              onClick={handleSavePreset}
              className="p-1 hover:bg-[var(--primary)] hover:text-white rounded transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        )}

        {!showPresetInput && (
          <button
            onClick={() => setShowPresetInput(true)}
            className="w-full px-3 py-2 text-xs text-center bg-[var(--primary)] hover:opacity-90 text-white rounded-lg font-medium transition-opacity"
          >
            Save Current Filters
          </button>
        )}
      </div>
    </div>
  );
}
