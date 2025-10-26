"use client";

import { useMemo } from "react";
import type { Transaction, VatReturn } from "@/types/vat";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

interface Props { returns: VatReturn[]; transactions: Transaction[] }

export function VatAnalyticsChart({ returns, transactions }: Props) {
  const data = useMemo(() => {
    const map = new Map<string, { month: string; output: number; input: number }>();
    returns.forEach(r => {
      const m = (r.periodStart || '').slice(0,7);
      const row = map.get(m) || { month: m, output: 0, input: 0 };
      row.output += r.outputVat; row.input += r.inputVat; map.set(m, row);
    });
    return Array.from(map.values()).sort((a,b)=>a.month.localeCompare(b.month));
  }, [returns, transactions]);

  return (
    <div className="bg-[#18181b] rounded-2xl shadow-lg border border-gray-700 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-100">VAT Analytics</h3>
        {/* Optionally add a settings or info icon here */}
      </div>
      <div className="w-full h-60 bg-[#23232a] rounded-xl border border-gray-700 p-2 flex items-center">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="colOutput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colInput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#a1a1aa" tick={{ fontSize: 12 }} />
            <YAxis stroke="#a1a1aa" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#23232a', border: '1px solid #374151', color: '#fff' }} labelStyle={{ color: '#fff' }} />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Area type="monotone" dataKey="output" stroke="#3b82f6" fillOpacity={1} fill="url(#colOutput)" />
            <Area type="monotone" dataKey="input" stroke="#10b981" fillOpacity={1} fill="url(#colInput)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
