"use client";

import { useEquipment } from "@/store/useEquipment";

export function LowStockAlert() {
  const { getLowStockItems } = useEquipment();
  const items = getLowStockItems().slice(0, 5);

  if (items.length === 0) return null;

  return (
    <div className="dashboard-section bg-red-50 border-red-200">
      <h3 className="section-title">Low Stock Alert</h3>
      <div className="flex flex-col gap-1 text-sm">
        {items.map(i => (
          <div key={i.id} className="flex justify-between">
            <span>{i.name}</span>
            <span className="font-semibold">{i.quantity} / min {i.minStock}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
