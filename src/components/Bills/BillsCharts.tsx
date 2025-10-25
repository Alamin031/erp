"use client";

import { Bill } from "@/types/bills";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

interface Props { bills: Bill[] }

const COLORS = ["#0ea5e9", "#f97316", "#22c55e", "#a78bfa", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6"];

export function BillsCharts({ bills }: Props) {
  const byMonth: Record<string, number> = {};
  const byVendor: Record<string, number> = {};

  bills.forEach((b) => {
    const month = new Date(b.billDate).toLocaleString(undefined, { month: 'short', year: '2-digit' });
    byMonth[month] = (byMonth[month] || 0) + b.amount;
    byVendor[b.vendorName] = (byVendor[b.vendorName] || 0) + b.amount;
  });

  const monthData = Object.entries(byMonth).map(([name, total]) => ({ name, total })).sort((a, b) => a.name.localeCompare(b.name));
  const vendorData = Object.entries(byVendor).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Monthly Bills Trend</h3>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={monthData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Vendor-wise Expense Distribution</h3>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={vendorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {vendorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
