"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PayrollTrendChartProps {
  data: Array<{ month: string; expense: number; paid: number }>;
}

export function PayrollTrendChart({ data }: PayrollTrendChartProps) {
  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)', padding: 24, border: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>
        Monthly Payroll Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="month"
            stroke="var(--secondary)"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="var(--secondary)" style={{ fontSize: "12px" }} />
          <Tooltip
            formatter={(value) =>
              `$${typeof value === "number" ? value.toLocaleString() : value}`
            }
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--foreground)',
            }}
            labelStyle={{ color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            name="Total Expense"
            dot={{ fill: "#ef4444" }}
          />
          <Line
            type="monotone"
            dataKey="paid"
            stroke="#10b981"
            name="Paid Amount"
            dot={{ fill: "#10b981" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DepartmentDistributionProps {
  data: Array<{ name: string; value: number }>;
}

export function DepartmentDistribution({ data }: DepartmentDistributionProps) {
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (!data || data.length === 0) {
    return (
      <div style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)', padding: 24, border: '1px solid var(--border)', color: 'var(--secondary)' }} className="flex items-center justify-center h-[350px]">
        No data available
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)', padding: 24, border: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>
        Department-wise Salary Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              `$${typeof value === "number" ? value.toLocaleString() : value}`
            }
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--foreground)',
            }}
            labelStyle={{ color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
