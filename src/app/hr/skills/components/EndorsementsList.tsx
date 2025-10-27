"use client";

import { MessageSquare } from "lucide-react";

interface Item { by: string; note?: string; at: string; employeeId?: string }

export function EndorsementsList({ items }: { items: Item[] }) {
  if (!items.length) return <div className="text-slate-400 text-sm">No endorsements yet.</div>;
  return (
    <ul className="space-y-2">
      {items.map((e, idx) => (
        <li key={idx} className="flex items-start gap-3 rounded-xl bg-slate-800/60 border border-slate-700 p-3">
          <div className="mt-0.5"><MessageSquare className="h-4 w-4 text-slate-400" /></div>
          <div>
            <div className="text-slate-200 text-sm">{e.note || "Endorsed"}</div>
            <div className="text-slate-500 text-xs">By {e.by} • {new Date(e.at).toLocaleString()}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
