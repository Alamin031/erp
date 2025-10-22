"use client";

import { Equipment } from "@/types/equipment";

export function EquipmentCard({ item, onView }: { item: Equipment; onView: (id: string)=>void }) {
  return (
    <div className="p-3 rounded-lg border border-border bg-card-bg shadow-sm hover:border-primary transition cursor-pointer" onClick={()=>onView(item.id)}>
      <div className="w-full h-28 bg-background rounded mb-2 flex items-center justify-center text-secondary text-sm">Image</div>
      <div className="font-semibold text-sm truncate">{item.name}</div>
      <div className="text-xs text-secondary truncate">{item.category} • {item.location || '—'}</div>
      <div className="flex justify-between items-center mt-2 text-xs">
        <span className="font-medium">Qty: {item.quantity}</span>
        <span className="px-2 py-0.5 rounded bg-background">{item.status}</span>
      </div>
    </div>
  );
}
