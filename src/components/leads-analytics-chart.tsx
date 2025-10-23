"use client";

import { Lead, LeadStage } from "@/types/leads";
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

interface Props { leads: Lead[] }

const stages: LeadStage[] = ["New", "Contacted", "Qualified", "Proposal", "Closed Won", "Closed Lost"];
const stageColors: Record<LeadStage, string> = {
  New: "#6b7280",
  Contacted: "#2563eb",
  Qualified: "#f59e0b",
  Proposal: "#8b5cf6",
  "Closed Won": "#059669",
  "Closed Lost": "#dc3545",
};

export function LeadsAnalyticsChart({ leads }: Props) {
  const byStage = stages.map((s) => ({ stage: s, count: leads.filter((l) => l.stage === s).length }));
  const converted = leads.filter((l) => l.status === "Converted").length;
  const total = leads.length || 1;
  const conversionRate = Math.round((converted / total) * 100);
  const conversionData = [
    { name: "Converted", value: converted },
    { name: "Others", value: total - converted },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byStage}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="stage" stroke="var(--secondary)" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} stroke="var(--secondary)" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Leads">
              {byStage.map((e) => (
                <Cell key={e.stage} fill={stageColors[e.stage as LeadStage]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie data={conversionData} dataKey="value" nameKey="name" outerRadius={80} label>
              <Cell fill="#059669" />
              <Cell fill="#2563eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--secondary)" }}>
          Conversion Rate: <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{conversionRate}%</span>
        </div>
      </div>
    </div>
  );
}
