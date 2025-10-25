"use client";

import {
  LineChart,
  Line,
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

interface BillsTrendChartProps {
  data: Array<{ month: string; bills: number; amount: number }>;
}

export function BillsTrendChart({ data }: BillsTrendChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Monthly Bills Trend
      </h3>
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
            <Tooltip
              formatter={(value) => value.toLocaleString()}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="bills"
              stroke="#4a9eff"
              name="Bill Count"
              dot={{ fill: "#4a9eff" }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#10b981"
              name="Amount"
              dot={{ fill: "#10b981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

interface VendorDistributionProps {
  data: Array<{ name: string; amount: number; billCount: number }>;
}

export function VendorDistribution({ data }: VendorDistributionProps) {
  const COLORS = ["#4a9eff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex items-center justify-center h-80 text-gray-500">
        No vendor data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.name,
    value: item.amount,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Vendor-wise Expense Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: $${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              `$${typeof value === "number" ? value.toLocaleString("en-US", { maximumFractionDigits: 2 }) : value}`
            }
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
