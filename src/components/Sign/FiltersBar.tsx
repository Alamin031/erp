"use client";

import { useSign } from "@/store/useSign";
import { DocumentStatus } from "@/types/document";
import { Search, X } from "lucide-react";

const STATUS_OPTIONS: DocumentStatus[] = [
  "draft",
  "sent",
  "partially_signed",
  "completed",
  "approved",
  "rejected",
  "expired",
];

interface FiltersBarProps {}

export function FiltersBar({}: FiltersBarProps) {
  const { filters, setFilters } = useSign();

  const handleStatusChange = (status: DocumentStatus, checked: boolean) => {
    const statuses = filters.status || [];
    const newStatuses = checked
      ? [...statuses, status]
      : statuses.filter((s) => s !== status);

    setFilters({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = !!(
    filters.status ||
    filters.keyword ||
    filters.owner ||
    filters.recipient
  );

  return (
    <div style={{ 
      background: 'var(--card)', 
      border: '1px solid var(--border)', 
      borderRadius: 10,
      padding: 20
    }}>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search 
          size={16} 
          style={{ 
            position: 'absolute', 
            left: 12, 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--muted)',
            pointerEvents: 'none'
          }} 
        />
        <input
          type="text"
          value={filters.keyword || ""}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value || undefined })}
          placeholder="Search documents..."
          className="form-input"
          style={{ 
            width: '100%', 
            paddingLeft: 38,
            fontSize: 14
          }}
        />
      </div>

      {/* Status Filters */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <label style={{ 
            fontSize: 11, 
            fontWeight: 600, 
            color: 'var(--muted)', 
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            STATUS
          </label>
          {filters.status && filters.status.length > 0 && (
            <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500 }}>
              {filters.status.length} selected
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STATUS_OPTIONS.map((status) => {
            const isChecked = filters.status?.includes(status) || false;
            return (
              <label
                key={status}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border)'}`,
                  background: isChecked ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: 13
                }}
                onMouseEnter={(e) => {
                  if (!isChecked) e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isChecked) e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleStatusChange(status, e.target.checked)}
                  style={{ 
                    width: 16, 
                    height: 16,
                    cursor: 'pointer',
                    accentColor: 'var(--primary)'
                  }}
                />
                <span style={{ 
                  color: 'var(--foreground)', 
                  textTransform: 'capitalize',
                  fontWeight: isChecked ? 500 : 400
                }}>
                  {status.replace(/_/g, " ")}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="btn btn-secondary"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16,
            fontSize: 13
          }}
        >
          <X size={16} />
          Clear Filters
        </button>
      )}
    </div>
  );
}
