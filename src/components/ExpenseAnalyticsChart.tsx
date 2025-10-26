"use client";

import { useMemo } from "react";
import { Expense } from "@/types/expenses";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

interface Props { expenses: Expense[] }

export function ExpenseAnalyticsChart({ expenses }: Props) {
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => map[e.category] = (map[e.category] || 0) + e.amount);
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const monthly = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + e.amount;
    });
    return Object.entries(map).map(([month, amount]) => ({ month, amount })).sort((a,b)=>a.month.localeCompare(b.month));
  }, [expenses]);

  const COLORS = ["#4a9eff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border">
        <h4 className="font-semibold mb-2">Spend by Category</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 border">
        <h4 className="font-semibold mb-2">Monthly Spend</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4a9eff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
