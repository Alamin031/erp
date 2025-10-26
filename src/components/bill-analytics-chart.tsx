"use client";

import { Bill } from "@/types/bills";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

interface Props {
  bills: Bill[];
}

export function BillAnalyticsChart({ bills }: Props) {
  const monthlyMap: Record<string, { month: string; total: number; count: number }> = {};
  bills.forEach((b) => {
    const d = new Date(b.billDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, total: 0, count: 0 };
    monthlyMap[key].total += b.amount;
    monthlyMap[key].count += 1;
  });
  const monthly = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

  const statusCounts = [
    { name: "Paid", value: bills.filter((b) => b.status === "Paid").length, color: "#10b981" },
    { name: "Pending", value: bills.filter((b) => b.status === "Pending").length, color: "#f59e0b" },
    { name: "Overdue", value: bills.filter((b) => b.status === "Overdue").length, color: "#ef4444" },
    { name: "Cancelled", value: bills.filter((b) => b.status === "Cancelled").length, color: "#6b7280" }
  ].filter((s) => s.value > 0);

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-xl shadow-md border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Bills by Month</h3>
        {monthly.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#d1d5db" style={{ fontSize: 12 }} />
              <YAxis stroke="#d1d5db" style={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151', borderRadius: 8 }} labelStyle={{ color: '#f3f4f6' }} itemStyle={{ color: '#f3f4f6' }} />
              <Legend wrapperStyle={{ color: '#d1d5db' }} />
              <Bar dataKey="count" name="Bill Count" fill="#4a9eff" />
              <Bar dataKey="total" name="Amount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-gray-900 rounded-xl shadow-md border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Status Ratio</h3>
        {statusCounts.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusCounts} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {statusCounts.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151', borderRadius: 8 }} labelStyle={{ color: '#f3f4f6' }} itemStyle={{ color: '#f3f4f6' }} />
              <Legend wrapperStyle={{ color: '#d1d5db' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
