"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw } from "lucide-react";
import { TaxRules } from "@/types/payroll";
import { useToast } from "@/components/toast";

interface PayrollTaxDeductionsProps {
  taxRules: TaxRules;
  onSave: (rules: TaxRules) => void;
}

export function PayrollTaxDeductions({
  taxRules,
  onSave,
}: PayrollTaxDeductionsProps) {
  const [formData, setFormData] = useState(taxRules);
  const [isDirty, setIsDirty] = useState(false);
  const { showToast } = useToast();

  const handleInputChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleOtherDeductionChange = (key: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      otherDeductions: {
        ...prev.otherDeductions,
        [key]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleAddDeduction = () => {
    const newKey = `deduction-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      otherDeductions: {
        ...prev.otherDeductions,
        [newKey]: 0,
      },
    }));
    setIsDirty(true);
  };

  const handleRemoveDeduction = (key: string) => {
    setFormData((prev) => {
      const updated = { ...prev.otherDeductions };
      delete updated[key];
      return {
        ...prev,
        otherDeductions: updated,
      };
    });
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(formData);
    setIsDirty(false);
    showToast("Tax rules updated successfully", "success");
  };

  const handleReset = () => {
    setFormData(taxRules);
    setIsDirty(false);
    showToast("Changes discarded", "info");
  };

  const baseSalary = 50000;
  const allowances = 7500;
  const grossSalary = baseSalary + allowances;

  const incomeTax = (grossSalary * formData.incomeTaxPercentage) / 100;
  const providentFund = (baseSalary * formData.providentFundPercentage) / 100;
  const insurance = (grossSalary * formData.insurancePercentage) / 100;
  let otherDeductions = 0;
  Object.values(formData.otherDeductions).forEach((val) => {
    otherDeductions += val;
  });
  const totalDeductions = incomeTax + providentFund + insurance + otherDeductions;
  const netSalary = grossSalary - totalDeductions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)', border: '1px solid var(--border)', padding: 24 }} className="space-y-6">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)' }}>
              Tax & Deduction Rules
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                  Income Tax %
                </label>
                <input
                  type="number"
                  value={formData.incomeTaxPercentage}
                  onChange={(e) =>
                    handleInputChange("incomeTaxPercentage", parseFloat(e.target.value) || 0)
                  }
                  min="0"
                  max="100"
                  step="0.1"
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                  Provident Fund %
                </label>
                <input
                  type="number"
                  value={formData.providentFundPercentage}
                  onChange={(e) =>
                    handleInputChange(
                      "providentFundPercentage",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  max="100"
                  step="0.1"
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                  Insurance %
                </label>
                <input
                  type="number"
                  value={formData.insurancePercentage}
                  onChange={(e) =>
                    handleInputChange("insurancePercentage", parseFloat(e.target.value) || 0)
                  }
                  min="0"
                  max="100"
                  step="0.1"
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>
                  Other Deductions
                </h4>
                <button
                  onClick={handleAddDeduction}
                  style={{ fontSize: 12, background: 'var(--background)', color: '#3b82f6', padding: '4px 12px', borderRadius: 8, border: '1px solid var(--border)', transition: 'background 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
                >
                  + Add
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(formData.otherDeductions).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Deduction name"
                      defaultValue={key.replace("deduction-", "")}
                      style={{ flex: 1, padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                    />
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        handleOtherDeductionChange(key, parseFloat(e.target.value) || 0)
                      }
                      placeholder="Amount"
                      style={{ width: 96, padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                    />
                    <button
                      onClick={() => handleRemoveDeduction(key)}
                      style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', fontSize: 14, transition: 'background 0.2s', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, paddingTop: 16 }}>
              <button
                onClick={handleSave}
                disabled={!isDirty}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', background: '#2563eb', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 16, cursor: isDirty ? 'pointer' : 'not-allowed', opacity: isDirty ? 1 : 0.5, transition: 'background 0.2s' }}
                onMouseOver={e => { if (isDirty) e.currentTarget.style.background = '#1d4ed8'; }}
                onMouseOut={e => { if (isDirty) e.currentTarget.style.background = '#2563eb'; }}
              >
                <Save size={16} />
                Save Rules
              </button>
              <button
                onClick={handleReset}
                disabled={!isDirty}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', borderRadius: 8, background: 'var(--background)', color: 'var(--secondary)', fontWeight: 500, fontSize: 16, border: '1px solid var(--border)', cursor: isDirty ? 'pointer' : 'not-allowed', opacity: isDirty ? 1 : 0.5, transition: 'background 0.2s' }}
                onMouseOver={e => { if (isDirty) e.currentTarget.style.background = 'var(--sidebar-hover)'; }}
                onMouseOut={e => { if (isDirty) e.currentTarget.style.background = 'var(--background)'; }}
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)', border: '1px solid var(--border)', padding: 24 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>
            Net Salary Preview
          </h4>
          <p style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 16 }}>
            Based on a sample salary of ${baseSalary.toLocaleString()}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--secondary)' }}>Gross Salary</span>
              <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>${grossSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--secondary)' }}>Income Tax</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>-${incomeTax.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--secondary)' }}>Provident Fund</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>-${providentFund.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--secondary)' }}>Insurance</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>-${insurance.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
              </div>
              {otherDeductions > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                  <span style={{ color: 'var(--secondary)' }}>Other Deductions</span>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>-${otherDeductions.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>Net Salary</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>
                ${netSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
