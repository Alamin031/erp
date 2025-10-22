"use client";

import { useMemo } from "react";
import { useEquipment } from "@/store/useEquipment";
import { EquipmentHistoryEntry } from "@/types/equipment";

interface Props {
  limit?: number;
  equipmentId?: string;
}

const typeIcons: Record<string, string> = {
  create: "➕",
  update: "✏️",
  adjust: "📦",
  assign: "👤",
  "link-wo": "🔗",
  retire: "🗑️",
  maintenance: "🔧",
};

const typeLabels: Record<string, string> = {
  create: "Created",
  update: "Updated",
  adjust: "Stock Adjusted",
  assign: "Assigned",
  "link-wo": "Work Order Linked",
  retire: "Retired",
  maintenance: "Maintenance",
};

export function ActivityLog({ limit = 20, equipmentId }: Props) {
  const { history, equipment } = useEquipment();

  const logs = useMemo(() => {
    let filtered = [...history];

    if (equipmentId) {
      filtered = filtered.filter((h) => h.equipmentId === equipmentId);
    }

    return filtered
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }, [history, equipmentId, limit]);

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-secondary text-sm">
        No activity yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {logs.map((log) => {
        const item = equipment.find((e) => e.id === log.equipmentId);
        const typeLabel = typeLabels[log.type] || log.type;
        const icon = typeIcons[log.type] || "📝";

        return (
          <div
            key={log.id}
            className="activity-item border-l-2 border-primary pl-3"
          >
            <div className="flex items-start gap-2">
              <span className="text-lg mt-0.5">{icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{typeLabel}</span>
                  <span className="text-secondary text-xs">
                    {item ? item.name : log.equipmentId}
                  </span>
                </div>
                <p className="text-sm text-secondary mt-0.5">{log.details}</p>
                {(log.beforeQty !== undefined || log.afterQty !== undefined) && (
                  <p className="text-xs text-secondary mt-1">
                    Qty: {log.beforeQty} → {log.afterQty}
                  </p>
                )}
                <p className="text-xs text-secondary mt-1">
                  {new Date(log.timestamp).toLocaleString()} · {log.user}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
