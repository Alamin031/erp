"use client";

import { ResponsiveContainer, Funnel, FunnelChart, Tooltip, LabelList } from 'recharts';

interface Props { conversion: number[] }

export function ConversionFunnelChart({ conversion }: Props) {
  // conversion is array of percentages between stages
  const data = conversion.map((v,i)=>({ name: `Stage ${i+1}`, value: Math.max(1, Math.round(v)) }));

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList position="insideTop" dataKey="name" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
