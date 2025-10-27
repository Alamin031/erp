"use client";

import { useMemo } from "react";
import { useSkills } from "@/store/useSkills";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

export function ProficiencyRadar() {
  const { getAnalytics } = useSkills();
  const data = useMemo(() => getAnalytics().avgBySkill.map(d => ({ subject: d.name, A: Number(d.avg.toFixed(2)) })), [getAnalytics]);

  if (!data.length) return <div className="text-slate-400 text-sm">No data</div>;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#1f2937" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Radar name="Avg" dataKey="A" stroke="#34d399" fill="#34d399" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
