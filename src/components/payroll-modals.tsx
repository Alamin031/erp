"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SalaryStructure, SalaryComponent, Employee, PayrollRecord } from "@/types/payroll";
import { useToast } from "@/components/toast";

interface SalaryStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  structure: SalaryStructure | null;
  onSave: (structure: SalaryStructure) => void;
}

export function SalaryStructureModal({
  isOpen,
  onClose,
  structure,
  onSave,
}: SalaryStructureModalProps) {
  const [formData, setFormData] = useState<Partial<SalaryStructure>>({
    name: "",
    department: "",
    baseAmount: 0,
    totalAllowances: 0,
    totalDeductions: 0,
    components: [],
  });
  const { showToast } = useToast();

  useEffect(() => {
    if (structure) {
      setFormData(structure);
    } else {
      setFormData({
        name: "",
        department: "",
        baseAmount: 0,
        totalAllowances: 0,
        totalDeductions: 0,
        components: [],
      });
    }
  }, [structure, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddComponent = () => {
    const newComponent: SalaryComponent = {
      id: `comp-${Date.now()}`,
      name: "",
      type: "allowance",
      amount: 0,
    };
    setFormData((prev) => ({
      ...prev,
      components: [...(prev.components || []), newComponent],
    }));
  };

  const handleComponentChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const components = [...(formData.components || [])];
    components[index] = { ...components[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      components,
    }));
  };

  const handleRemoveComponent = (index: number) => {
    const components = formData.components?.filter((_, i) => i !== index) || [];
    setFormData((prev) => ({
      ...prev,
      components,
    }));
  };

  const calculateNetSalary = () => {
    const base = formData.baseAmount || 0;
    const allowances = formData.totalAllowances || 0;
    const deductions = formData.totalDeductions || 0;
    return base + allowances - deductions;
  };

  const handleSave = () => {
    if (!formData.name) {
      showToast("Please enter a structure name", "error");
      return;
    }

    const newStructure: SalaryStructure = {
      id: structure?.id || `struct-${Date.now()}`,
      name: formData.name || "",
      department: formData.department || "",
      components: formData.components || [],
      baseAmount: formData.baseAmount || 0,
      totalAllowances: formData.totalAllowances || 0,
      totalDeductions: formData.totalDeductions || 0,
      netSalary: calculateNetSalary(),
      createdAt: structure?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: structure?.archived,
    };

    onSave(newStructure);
    showToast(structure ? "Structure updated" : "Structure created", "success");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">
                {structure ? "Edit Salary Structure" : "Create Salary Structure"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Structure Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Senior Developer"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department || ""}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="e.g., Engineering"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Amount
                  </label>
                  <input
                    type="number"
                    value={formData.baseAmount || 0}
                    onChange={(e) =>
                      handleInputChange("baseAmount", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Allowances
                  </label>
                  <input
                    type="number"
                    value={formData.totalAllowances || 0}
                    onChange={(e) =>
                      handleInputChange("totalAllowances", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Deductions
                  </label>
                  <input
                    type="number"
                    value={formData.totalDeductions || 0}
                    onChange={(e) =>
                      handleInputChange("totalDeductions", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Net Salary</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${calculateNetSalary().toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Salary Components</h4>
                  <button
                    onClick={handleAddComponent}
                    className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                  >
                    + Add Component
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.components || []).map((comp, idx) => (
                    <div key={comp.id} className="flex gap-2 items-end">
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) =>
                          handleComponentChange(idx, "name", e.target.value)
                        }
                        placeholder="Component name"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <select
                        value={comp.type}
                        onChange={(e) =>
                          handleComponentChange(idx, "type", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="base">Base</option>
                        <option value="allowance">Allowance</option>
                        <option value="bonus">Bonus</option>
                        <option value="deduction">Deduction</option>
                      </select>
                      <input
                        type="number"
                        value={comp.amount}
                        onChange={(e) =>
                          handleComponentChange(idx, "amount", parseFloat(e.target.value) || 0)
                        }
                        placeholder="Amount"
                        className="w-24 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        onClick={() => handleRemoveComponent(idx)}
                        className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-6 bg-gray-50 flex gap-3 sticky bottom-0">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {structure ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface EmployeePayrollDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  payroll: PayrollRecord | null;
}

export function EmployeePayrollDetailsModal({
  isOpen,
  onClose,
  employee,
  payroll,
}: EmployeePayrollDetailsModalProps) {
  if (!employee || !payroll) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">
                Payroll Details - {employee.name}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">
                    Employee ID
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {employee.employeeId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">
                    Department
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {employee.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">
                    Position
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {employee.position}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">
                    Period
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {payroll.period}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Salary Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Base Salary</span>
                    <span className="font-semibold text-gray-900">
                      ${payroll.baseSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Allowances</span>
                    <span className="font-semibold text-green-600">
                      +${payroll.allowances.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Deductions</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Income Tax</span>
                    <span className="font-semibold text-red-600">
                      -${payroll.incomeTax.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Provident Fund</span>
                    <span className="font-semibold text-red-600">
                      -${payroll.providentFund.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Insurance</span>
                    <span className="font-semibold text-red-600">
                      -${payroll.insurance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {payroll.otherDeductions > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Other Deductions</span>
                      <span className="font-semibold text-red-600">
                        -${payroll.otherDeductions.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Net Pay</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${payroll.netPay.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-6 bg-gray-50 flex gap-3 sticky bottom-0">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
