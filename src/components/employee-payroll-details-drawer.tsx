"use client";

import { Employee, PayrollRecord } from "@/types/payroll";
import React from "react";

interface EmployeePayrollDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  payroll: PayrollRecord | null;
}

export function EmployeePayrollDetailsDrawer({ isOpen, onClose, employee, payroll }: EmployeePayrollDetailsDrawerProps) {
  if (!isOpen || !employee) return null;

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over" role="dialog" aria-modal="true" aria-labelledby="employee-drawer-title">
        <div className="slide-over-header">
          <div>
            <h2 id="employee-drawer-title" className="slide-over-title">
              {employee.name}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <span style={{ padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#3b82f6" }}>
                {employee.status}
              </span>
              <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
                {employee.position} - {employee.department}
              </span>
            </div>
          </div>
          <button className="slide-over-close" onClick={onClose} title="Close drawer">✕</button>
        </div>
        <div className="slide-over-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Contact & Details
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "13px" }}>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Email</div>
                  <div style={{ color: "var(--foreground)", fontWeight: 500 }}>{employee.email}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Phone</div>
                  <div style={{ color: "var(--foreground)", fontWeight: 500 }}>{employee.phone}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Join Date</div>
                  <div style={{ color: "var(--foreground)", fontWeight: 500 }}>{employee.joinDate}</div>
                </div>
                <div>
                  <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Base Salary</div>
                  <div style={{ color: "var(--foreground)", fontWeight: 500 }}>{employee.baseSalary}</div>
                </div>
              </div>
            </div>
            {payroll && (
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Payroll Details
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "13px" }}>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Month</div>
                    <div style={{ color: "var(--foreground)", fontWeight: 500 }}>{payroll.month}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Year</div>
                    <div style={{ color: "var(--foreground)", fontWeight: 500 }}>{payroll.year}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Net Pay</div>
                    <div style={{ color: "var(--foreground)", fontWeight: 500 }}>{payroll.netPay}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--secondary)", fontSize: "11px", marginBottom: "2px" }}>Payment Status</div>
                    <div style={{ color: "var(--foreground)", fontWeight: 500 }}>{payroll.paymentStatus}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
