"use client";

import { StageName } from "@/types/opportunities";
import { Opportunity } from "@/types/opportunities";
import { StageColumn } from "./StageColumn";

interface Props { byStage: Record<StageName, Opportunity[]>; onMove?: (id: string, stage: StageName) => void }

export function PipelineBoard({ byStage, onMove }: Props) {
  const stages = Object.keys(byStage) as StageName[];

  return (
    <div style={{ 
      display: 'grid', 
      gridAutoFlow: 'column', 
      gridAutoColumns: 'minmax(300px, 1fr)', 
      gap: 16, 
      paddingBottom: 8, 
      minWidth: 'min-content' 
    }}>
      {stages.map(s => (
        <StageColumn key={s} stage={s} opportunities={byStage[s]} onDrop={(id)=>onMove?.(id, s)} />
      ))}
    </div>
  );
}
