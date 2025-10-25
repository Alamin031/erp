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
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Employee Payroll
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={departmentFilter}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Employee ID
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Department
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                Base Salary
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                Net Pay
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, idx) => {
              const payroll = getEmployeePayroll(emp.id);
              return (
                <tr
                  key={emp.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {emp.employeeId}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{emp.name}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.department}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    ${emp.baseSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-green-600">
                    ${payroll ? payroll.netPay.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewDetails(emp)}
                        title="View Details"
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => onEdit(emp)}
                        title="Edit"
                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} className="text-yellow-600" />
                      </button>
                      <button
                        onClick={() => onDelete(emp.id)}
                        title="Delete"
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
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
        <div className="text-center py-12 text-gray-500">
          No employees found
        </div>
      )}
    </motion.div>
  );
}
