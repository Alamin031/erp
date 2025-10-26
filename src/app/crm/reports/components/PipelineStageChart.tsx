"use client";

import { PipelineFunnelChart } from "./PipelineFunnelChart";
import { PipelineStage } from "@/store/useReports";

interface Props {
  data: PipelineStage[];
}

export function PipelineStageChart({ data }: Props) {
  return <PipelineFunnelChart data={data} />;
}
