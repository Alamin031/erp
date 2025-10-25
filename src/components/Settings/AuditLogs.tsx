"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/store/useSettings";
import { motion } from "framer-motion";
import { Search, Download, Filter, Calendar, User, Activity } from "lucide-react";


export function AuditLogs() {
  const { auditLogs, fetchAuditLogs } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      try {
        await fetchAuditLogs({
          user: filterUser,
          startDate: startDate,
          endDate: endDate,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [filterUser, startDate, endDate, fetchAuditLogs]);

  const filteredLogs = auditLogs.logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ["Date", "Action", "User", "Details", "IP Address"];
    const rows = filteredLogs.map((log) => [
      new Date(log.date).toLocaleString(),
      log.action,
      log.user,
      log.details,
      log.ipAddress,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Audit Logs
          </h3>
          <p className="text-sm text-[var(--secondary)]">
            Track all system activities and administrative actions
          </p>
        </div>
        <motion.button
          onClick={handleExportCSV}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search actions, details, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full form-input pl-10"
            />
          </div>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input"
            placeholder="End Date"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                  Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <p className="text-[var(--secondary)]">Loading logs...</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <p className="text-[var(--secondary)]">No logs found</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-[var(--border)] hover:bg-[var(--sidebar-hover)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm text-[var(--foreground)]">
                        {new Date(log.date).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-white">
                          {log.action.split(' ')[0]}
                        </span>
                        <span className="text-xs text-gray-400">
                          {log.action.split(' ').slice(1).join(' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[var(--foreground)]">{log.user}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[var(--secondary)] max-w-xs">
                        {log.details}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-[var(--foreground)]">
                        {log.ipAddress}
                      </p>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredLogs.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--secondary)]">
              Showing {filteredLogs.length} of {auditLogs.logs.length} logs
            </p>
            <p className="text-sm text-[var(--secondary)]">
              {filteredLogs.length === auditLogs.logs.length
                ? "All logs"
                : `Filtered from ${auditLogs.logs.length} total`}
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-600 border border-blue-700 rounded-lg p-6">
        <h4 className="font-semibold text-white mb-3">Audit Log Information</h4>
        <ul className="text-sm text-white space-y-2">
          <li>• All system activities are automatically logged</li>
          <li>• Logs are retained for 90 days</li>
          <li>• User actions, system changes, and security events are tracked</li>
          <li>• IP addresses are recorded for security purposes</li>
        </ul>
      </div>
    </motion.div>
  );
}
