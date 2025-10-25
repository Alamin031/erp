"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Edit2, Trash2, Search, Filter } from "lucide-react";
import { Employee, PayrollRecord } from "@/types/payroll";

interface PayrollEmployeesTableProps {
  employees: Employee[];
  payrollRecords: PayrollRecord[];
  onViewDetails: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  filters: {
    department: string;
    searchQuery: string;
  };
  onFilterChange: (filters: any) => void;
}

export function PayrollEmployeesTable({
  employees,
  payrollRecords,
  onViewDetails,
  onEdit,
  onDelete,
  filters,
  onFilterChange,
}: PayrollEmployeesTableProps) {
  const [searchInput, setSearchInput] = useState(filters.searchQuery || "");
  const [departmentFilter, setDepartmentFilter] = useState(
    filters.department || ""
  );

  const departments = [...new Set(employees.map((e) => e.department))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchInput.toLowerCase());
    const matchesDept = !departmentFilter || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleSearch = (query: string) => {
    setSearchInput(query);
    onFilterChange({ ...filters, searchQuery: query });
  };

  const handleDepartmentChange = (dept: string) => {
    setDepartmentFilter(dept);
    onFilterChange({ ...filters, department: dept });
  };

  const getEmployeePayroll = (employeeId: string) => {
    return payrollRecords.find((r) => r.employeeId === employeeId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}
    >
      <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>
          Employee Payroll
        </h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            margin: '0 auto',
            maxWidth: 700,
          }}
        >
          <div style={{ flex: 1, minWidth: 260, maxWidth: 350, position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }}
            />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '1px solid var(--border)',
                borderRadius: 8,
                background: 'var(--background)',
                color: 'var(--foreground)',
                outline: 'none',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 200, gap: 8 }}>
            <Filter size={18} style={{ color: 'var(--secondary)' }} />
            <select
              value={departmentFilter}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid var(--border)',
                borderRadius: 8,
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                minWidth: 140,
              }}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.95rem' }}>
          <thead style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--secondary)' }}>Employee ID</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--secondary)' }}>Name</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--secondary)' }}>Department</th>
              <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: 'var(--secondary)' }}>Base Salary</th>
              <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: 'var(--secondary)' }}>Net Pay</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--secondary)' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: 'var(--secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, idx) => {
              const payroll = getEmployeePayroll(emp.id);
              return (
                <tr
                  key={emp.id}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  className="hover:bg-[var(--sidebar-hover)]"
                >
                  <td style={{ padding: '16px', color: 'var(--foreground)', fontWeight: 500 }}>{emp.employeeId}</td>
                  <td style={{ padding: '16px', color: 'var(--foreground)' }}>{emp.name}</td>
                  <td style={{ padding: '16px', color: 'var(--secondary)' }}>{emp.department}</td>
                  <td style={{ padding: '16px', color: 'var(--foreground)', fontWeight: 500, textAlign: 'right' }}>
                    ${emp.baseSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '16px', color: '#22c55e', fontWeight: 500, textAlign: 'right' }}>
                    ${payroll ? payroll.netPay.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "N/A"}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      color: '#22c55e',
                      textTransform: 'capitalize',
                    }}>{emp.status}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <button
                        onClick={() => onViewDetails(emp)}
                        title="View Details"
                        style={{ padding: 8, borderRadius: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', transition: 'all 0.2s', cursor: 'pointer' }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(emp)}
                        title="Edit"
                        style={{ padding: 8, borderRadius: 8, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', transition: 'all 0.2s', cursor: 'pointer' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(emp.id)}
                        title="Delete"
                        style={{ padding: 8, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', transition: 'all 0.2s', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredEmployees.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--secondary)' }}>
          No employees found
        </div>
      )}
    </motion.div>
  );
}
