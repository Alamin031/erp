"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter } from "lucide-react";
import { useReports, CRMReportFilters } from "@/store/useReports";

const schema = z.object({
  dateFrom: z.string().min(1),
  dateTo: z.string().min(1),
  salesperson: z.string().optional(),
  region: z.string().optional(),
  dealStage: z.string().optional(),
  companyType: z.string().optional(),
  reportType: z.string().optional(),
}).refine((vals) => new Date(vals.dateFrom) <= new Date(vals.dateTo), {
  message: "Start date must be before end date",
  path: ["dateTo"],
});

const SALESPERSONS = ["Sarah Johnson","Michael Chen","Emily Rodriguez","James Wilson","Lisa Anderson","David Martinez"];
const REGIONS = ["North America","Europe","Asia Pacific","Latin America","Middle East","Africa"];
const DEAL_STAGES = ["Prospects","Qualified","Proposal","Negotiation","Closed"];
const COMPANY_TYPES = ["Startup","SMB","Enterprise","Agency","Nonprofit"];

export function ReportFilters() {
  const { filters, setFilters, fetchReports } = useReports();

  const form = useForm<CRMReportFilters>({
    resolver: zodResolver(schema as any),
    defaultValues: filters as any,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(filters as any);
  }, [filters]);

  const onSubmit = async (values: any) => {
    setFilters(values);
    await fetchReports();
  };

  const onReset = async () => {
    form.reset(filters as any);
    await fetchReports();
  };

  const { register, handleSubmit, formState } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{
      padding: "16px",
      borderRadius: 8,
      backgroundColor: "var(--card-bg)",
      border: "1px solid var(--border)",
      marginBottom: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Filter size={16} style={{ color: "var(--primary)" }} />
        <h3 style={{ fontWeight: 600, fontSize: "14px" }}>Filters</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>Date From</label>
          <input type="date" {...register("dateFrom")} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 14 }} />
          {formState.errors.dateFrom && (<p style={{ color: "var(--destructive)", fontSize: 12 }}>{formState.errors.dateFrom.message as string}</p>)}
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>Date To</label>
          <input type="date" {...register("dateTo")} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 14 }} />
          {formState.errors.dateTo && (<p style={{ color: "var(--destructive)", fontSize: 12 }}>{formState.errors.dateTo.message as string}</p>)}
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>Salesperson</label>
          <select {...register("salesperson")} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 14 }}>
            <option value="">All</option>
            {SALESPERSONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>Region</label>
          <select {...register("region")} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 14 }}>
            <option value="">All</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>Deal Stage</label>
          <select {...register("dealStage")} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 14 }}>
            <option value="">All</option>
            {DEAL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>Company Type</label>
          <select {...register("companyType")} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 14 }}>
            <option value="">All</option>
            {COMPANY_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="button" onClick={onReset} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--foreground)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Reset</button>
        <button type="submit" style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Apply Filters</button>
      </div>
    </form>
  );
}
