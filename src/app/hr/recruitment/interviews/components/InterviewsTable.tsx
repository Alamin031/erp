"use client";

import { useMemo } from "react";
import { useInterviews } from "../store/useInterviews";
import { useApplicants } from "../../applicants/store/useApplicants";
import { useJobs } from "../../jobs/store/useJobs";
import { useToast } from "@/components/toast";

export function InterviewsTable({ onView }: { onView?: (id: string) => void }) {
  const { interviews, cancelInterview, rescheduleInterview, markCompleted } =
    useInterviews();
  const { applicants } = useApplicants();
  const { jobs } = useJobs();
  const { showToast } = useToast();

  const rows = useMemo(() => interviews, [interviews]);

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="text-zinc-400 text-xs">
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Candidate</th>
            <th className="px-3 py-2">Job</th>
            <th className="px-3 py-2">Interviewers</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Date & Time</th>
            <th className="px-3 py-2">Round</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-t border-zinc-800 hover:bg-zinc-800/40"
            >
              <td className="px-3 py-2 text-zinc-200">{r.id}</td>
              <td className="px-3 py-2 text-zinc-100">
                {applicants.find((a) => a.id === r.applicantId)?.name || "-"}
              </td>
              <td className="px-3 py-2 text-zinc-300">
                {jobs.find((j) => j.id === r.jobId)?.title || "-"}
              </td>
              <td className="px-3 py-2 text-zinc-300">
                {r.interviewers.join(", ")}
              </td>
              <td className="px-3 py-2 text-zinc-300">{r.type}</td>
              <td className="px-3 py-2 text-zinc-300">
                {r.date} {r.startTime}
              </td>
              <td className="px-3 py-2 text-zinc-300">{r.round}</td>
              <td className="px-3 py-2 text-zinc-300">{r.status}</td>
              <td className="px-3 py-2 text-right">
                <button
                  onClick={() => onView?.(r.id)}
                  className="px-2 py-1 rounded bg-zinc-800 text-zinc-100 mr-2"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    markCompleted(r.id);
                    showToast("Marked completed");
                  }}
                  className="px-2 py-1 rounded bg-emerald-400 text-black mr-2"
                >
                  Complete
                </button>

                <button
                  onClick={() => {
                    if (confirm("Cancel interview?")) {
                      cancelInterview(r.id);
                      showToast("Canceled");
                    }
                  }}
                  className="px-2 py-1 rounded bg-rose-500 text-black"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={9} className="px-3 py-8 text-center text-zinc-400">
                No interviews scheduled
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
