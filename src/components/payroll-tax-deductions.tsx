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
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Tax &amp; Deduction Rules
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  Other Deductions
                </h4>
                <button
                  onClick={handleAddDeduction}
                  className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(formData.otherDeductions).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Deduction name"
                      defaultValue={key.replace("deduction-", "")}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        handleOtherDeductionChange(key, parseFloat(e.target.value) || 0)
                      }
                      placeholder="Amount"
                      className="w-24 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleRemoveDeduction(key)}
                      className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={!isDirty}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={16} />
                Save Rules
              </button>
              <button
                onClick={handleReset}
                disabled={!isDirty}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md border border-blue-100 p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Net Salary Preview
          </h4>
          <p className="text-xs text-gray-600 mb-4">
            Based on a sample salary of ${baseSalary.toLocaleString()}
          </p>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Gross Salary</span>
              <span className="font-semibold">${grossSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="border-t border-blue-200 pt-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Income Tax</span>
                <span className="text-red-600">-${incomeTax.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Provident Fund</span>
                <span className="text-red-600">-${providentFund.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Insurance</span>
                <span className="text-red-600">-${insurance.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
              </div>
              {otherDeductions > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">Other Deductions</span>
                  <span className="text-red-600">-${otherDeductions.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
            <div className="border-t border-blue-200 pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">Net Salary</span>
              <span className="text-lg font-bold text-green-600">
                ${netSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
