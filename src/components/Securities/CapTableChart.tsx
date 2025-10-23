"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { useSecurities } from "@/store/useSecurities";
import { useMemo } from "react";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

export function CapTableChart() {
  const { getCapTableData } = useSecurities();
  const capTableData = useMemo(() => getCapTableData(), [getCapTableData]);

  const pieData = capTableData.ownership.map((item) => ({
    name: item.category,
    value: Number(item.percentage.toFixed(2)),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const ownershipItem = capTableData.ownership.find((o) => o.category === data.name);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-700">Percentage: {data.value.toFixed(2)}%</p>
          {ownershipItem && (
            <>
              <p className="text-sm text-gray-700">Shares: {ownershipItem.shares.toLocaleString()}</p>
              <p className="text-sm text-gray-700">
                Valuation: ${ownershipItem.valuation.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  if (pieData.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 border border-gray-200 flex items-center justify-center h-96">
        <p className="text-gray-500 text-center">No ownership data available yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cap Table (Ownership Distribution)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {capTableData.ownership.map((item, idx) => (
          <div key={item.category} className="bg-gray-50 rounded p-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className="font-semibold text-gray-900">{item.category}</span>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                Shares: <span className="font-medium">{item.shares.toLocaleString()}</span>
              </p>
              <p>
                Ownership: <span className="font-medium">{item.percentage.toFixed(2)}%</span>
              </p>
              <p>
                Valuation:{" "}
                <span className="font-medium">
                  ${item.valuation.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
