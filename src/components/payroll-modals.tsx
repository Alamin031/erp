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
          className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground)' }}>
                {structure ? "Edit Salary Structure" : "Create Salary Structure"}
              </h2>
              <button
                onClick={onClose}
                style={{ padding: 8, borderRadius: 8, background: 'none', transition: 'background 0.2s', cursor: 'pointer' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                <X size={20} color="var(--secondary)" />
              </button>
            </div>

            <div style={{ padding: 24 }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                  Structure Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Senior Developer"
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department || ""}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="e.g., Engineering"
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                    Base Amount
                  </label>
                  <input
                    type="number"
                    value={formData.baseAmount || 0}
                    onChange={(e) =>
                      handleInputChange("baseAmount", parseFloat(e.target.value) || 0)
                    }
                    style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                    Total Allowances
                  </label>
                  <input
                    type="number"
                    value={formData.totalAllowances || 0}
                    onChange={(e) =>
                      handleInputChange("totalAllowances", parseFloat(e.target.value) || 0)
                    }
                    style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                    Total Deductions
                  </label>
                  <input
                    type="number"
                    value={formData.totalDeductions || 0}
                    onChange={(e) =>
                      handleInputChange("totalDeductions", parseFloat(e.target.value) || 0)
                    }
                    style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--background)', padding: 16, borderRadius: 12 }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--secondary)', marginBottom: 8 }}>Net Salary</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>
                  ${calculateNetSalary().toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ fontWeight: 500, color: 'var(--foreground)' }}>Salary Components</h4>
                  <button
                    onClick={handleAddComponent}
                    style={{ fontSize: 12, background: 'var(--background)', color: '#3b82f6', padding: '4px 12px', borderRadius: 8, border: '1px solid var(--border)', transition: 'background 0.2s' }}
                  >
                    + Add Component
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(formData.components || []).map((comp, idx) => (
                    <div key={comp.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) => handleComponentChange(idx, "name", e.target.value)}
                        placeholder="Component name"
                        style={{ flex: 1, padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: 14 }}
                      />
                      <select
                        value={comp.type}
                        onChange={(e) => handleComponentChange(idx, "type", e.target.value)}
                        style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', fontSize: 14, outline: 'none' }}
                      >
                        <option value="base">Base</option>
                        <option value="allowance">Allowance</option>
                        <option value="bonus">Bonus</option>
                        <option value="deduction">Deduction</option>
                      </select>
                      <input
                        type="number"
                        value={comp.amount}
                        onChange={(e) => handleComponentChange(idx, "amount", parseFloat(e.target.value) || 0)}
                        placeholder="Amount"
                        style={{ width: 80, padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: 14 }}
                      />
                      <button
                        onClick={() => handleRemoveComponent(idx)}
                        style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', fontSize: 14, transition: 'background 0.2s', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', padding: 24, background: 'var(--background)', display: 'flex', gap: 12, position: 'sticky', bottom: 0 }}>
              <button
                onClick={onClose}
                style={{ flex: 1, padding: '10px 0', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--secondary)', fontWeight: 500, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer', border: 'none', transition: 'background 0.2s' }}
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
            style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground)' }}>
                Payroll Details - {employee.name}
              </h2>
              <button
                onClick={onClose}
                style={{ padding: 8, borderRadius: 8, background: 'none', transition: 'background 0.2s', cursor: 'pointer' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                <X size={20} color="var(--secondary)" />
              </button>
            </div>

            <div style={{ padding: 24 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p style={{ fontSize: 11, color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Employee ID
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--foreground)' }}>
                    {employee.employeeId}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Department
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--foreground)' }}>
                    {employee.department}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Position
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--foreground)' }}>
                    {employee.position}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Period
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--foreground)' }}>
                    {payroll.period}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                <h4 style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>Salary Breakdown</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--secondary)' }}>Base Salary</span>
                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                      ${payroll.baseSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--secondary)' }}>Allowances</span>
                    <span style={{ fontWeight: 600, color: '#22c55e' }}>
                      +${payroll.allowances.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                <h4 style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>Deductions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--secondary)' }}>Income Tax</span>
                    <span style={{ fontWeight: 600, color: '#ef4444' }}>
                      -${payroll.incomeTax.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--secondary)' }}>Provident Fund</span>
                    <span style={{ fontWeight: 600, color: '#ef4444' }}>
                      -${payroll.providentFund.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--secondary)' }}>Insurance</span>
                    <span style={{ fontWeight: 600, color: '#ef4444' }}>
                      -${payroll.insurance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {payroll.otherDeductions > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary)' }}>Other Deductions</span>
                      <span style={{ fontWeight: 600, color: '#ef4444' }}>
                        -${payroll.otherDeductions.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, background: 'var(--background)', borderRadius: 12, marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>Net Pay</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>
                    ${payroll.netPay.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', padding: 24, background: 'var(--background)', display: 'flex', gap: 12, position: 'sticky', bottom: 0 }}>
              <button
                onClick={onClose}
                style={{ flex: 1, padding: '10px 0', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--secondary)', fontWeight: 500, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}
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
