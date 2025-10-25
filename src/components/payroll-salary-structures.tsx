"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Copy, Archive } from "lucide-react";
import { SalaryStructure } from "@/types/payroll";

interface PayrollSalaryStructuresProps {
  structures: SalaryStructure[];
  onAdd: () => void;
  onEdit: (structure: SalaryStructure) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
}

export function PayrollSalaryStructures({
  structures,
  onAdd,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
}: PayrollSalaryStructuresProps) {
  const [showArchived, setShowArchived] = useState(false);

  const filteredStructures = structures.filter(
    (s) => showArchived === (s.archived || false)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Salary Structures
          </h3>
          <p className="text-sm text-gray-600">
            {filteredStructures.length} structure{filteredStructures.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add Structure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStructures.map((structure, idx) => (
          <motion.div
            key={structure.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {structure.name}
                </h4>
                {structure.department && (
                  <p className="text-sm text-gray-600">{structure.department}</p>
                )}
              </div>
              {structure.archived && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                  Archived
                </span>
              )}
            </div>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Base Salary</span>
                <span className="font-semibold text-gray-900">
                  ${structure.baseAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Allowances</span>
                <span className="font-semibold text-gray-900">
                  ${structure.totalAllowances.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Deductions</span>
                <span className="font-semibold text-red-600">
                  -${structure.totalDeductions.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Net Salary</p>
              <p className="text-2xl font-bold text-green-600">
                ${structure.netSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(structure)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
              >
                <Edit2 size={14} />
                Edit
              </button>
              <button
                onClick={() => onDuplicate(structure.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
              >
                <Copy size={14} />
                Duplicate
              </button>
              <button
                onClick={() =>
                  structure.archived ? onEdit(structure) : onArchive(structure.id)
                }
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors"
              >
                <Archive size={14} />
                {structure.archived ? "Restore" : "Archive"}
              </button>
              <button
                onClick={() => onDelete(structure.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>

            {structure.components && structure.components.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">
                  Components
                </p>
                <div className="space-y-1">
                  {structure.components.slice(0, 3).map((comp) => (
                    <div key={comp.id} className="text-xs text-gray-600">
                      • {comp.name}:{" "}
                      {comp.isPercentage ? `${comp.amount}%` : `$${comp.amount}`}
                    </div>
                  ))}
                  {structure.components.length > 3 && (
                    <div className="text-xs text-gray-500 italic">
                      +{structure.components.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredStructures.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 mb-4">
            {showArchived ? "No archived structures" : "No salary structures found"}
          </p>
          {!showArchived && (
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Create First Structure
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
