"use client";

import { useMemo } from "react";
import { usePlanning } from "@/store/usePlanning";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

export function ResourceUtilizationChart() {
  const { getUtilizationStats } = usePlanning();
  const data = useMemo(() => getUtilizationStats().byDepartment.map(d => ({ name: d.name, utilization: d.utilization })), [getUtilizationStats]);

  if (!data.length) return <div className="text-zinc-400 text-sm">No data</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Bar dataKey="utilization" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
