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
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bills by Month</h3>
        {monthly.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" style={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="count" name="Bill Count" fill="#4a9eff" />
              <Bar dataKey="total" name="Amount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Status Ratio</h3>
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
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
