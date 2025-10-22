"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Equipment } from "@/types/equipment";

export function DepreciationChart({ item }: { item: Equipment }) {
  const data = useMemo(() => {
    if (!item.purchasePrice || item.depreciationMethod === "None") {
      return [];
    }

    const purchaseDate = new Date(item.purchaseDate || item.createdAt);
    const depreciationRate = (item.depreciationRate || 0) / 100;
    const data = [];

    for (let year = 0; year <= 10; year++) {
      const date = new Date(purchaseDate);
      date.setFullYear(date.getFullYear() + year);

      let bookValue = item.purchasePrice;
      if (item.depreciationMethod === "Straight-line") {
        const totalDepreciation = item.purchasePrice * depreciationRate * year;
        bookValue = Math.max(0, item.purchasePrice - totalDepreciation);
      }

      data.push({
        year,
        date: date.getFullYear(),
        bookValue: Math.round(bookValue * 100) / 100,
      });
    }

    return data;
  }, [item]);

  if (data.length === 0) {
    return (
      <div className="text-sm text-secondary text-center py-8">
        No depreciation data. Set purchase price and method.
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "var(--secondary)" }}
            stroke="var(--border)"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--secondary)" }}
            stroke="var(--border)"
            label={{ value: "Value ($)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}
            labelStyle={{ color: "var(--text)" }}
            formatter={(value) => [
              value?.toLocaleString("en-US", { style: "currency", currency: "USD" }),
              "Book Value",
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="bookValue"
            stroke="var(--primary)"
            dot={false}
            isAnimationActive={false}
            name="Book Value"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
