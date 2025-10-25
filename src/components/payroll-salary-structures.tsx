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
  <div style={{ background: 'var(--card-bg)', padding: 24, borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)', border: '1px solid var(--border)' }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>
            Salary Structures
          </h3>
          <p style={{ fontSize: 14, color: 'var(--secondary)' }}>
            {filteredStructures.length} structure{filteredStructures.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowArchived(!showArchived)}
            style={{ padding: '8px 16px', fontSize: 14, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--secondary)', transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </button>
          <button
            onClick={onAdd}
            style={{ padding: '8px 16px', fontSize: 14, background: '#2563eb', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, border: 'none', transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
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
            style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)', border: '1px solid var(--border)', padding: 24, transition: 'box-shadow 0.2s' }}
            className="hover:shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)' }}>{structure.name}</h4>
                {structure.department && (
                  <p style={{ fontSize: 14, color: 'var(--secondary)' }}>{structure.department}</p>
                )}
              </div>
              {structure.archived && (
                <span style={{ padding: '2px 8px', background: 'var(--background)', color: 'var(--secondary)', fontSize: 12, fontWeight: 500, borderRadius: 8 }}>
                  Archived
                </span>
              )}
            </div>

            <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--secondary)', fontSize: 14 }}>Base Salary</span>
                <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  ${structure.baseAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--secondary)', fontSize: 14 }}>Allowances</span>
                <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  ${structure.totalAllowances.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--secondary)', fontSize: 14 }}>Deductions</span>
                <span style={{ fontWeight: 600, color: '#ef4444' }}>
                  -${structure.totalDeductions.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, color: 'var(--secondary)', marginBottom: 8 }}>Net Salary</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>
                ${structure.netSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(structure)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 12px', fontSize: 14, background: 'var(--background)', color: '#3b82f6', borderRadius: 8, border: '1px solid var(--border)', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
                onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
              >
                <Edit2 size={14} />
                Edit
              </button>
              <button
                onClick={() => onDuplicate(structure.id)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 12px', fontSize: 14, background: 'var(--background)', color: '#22c55e', borderRadius: 8, border: '1px solid var(--border)', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
                onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
              >
                <Copy size={14} />
                Duplicate
              </button>
              <button
                onClick={() =>
                  structure.archived ? onEdit(structure) : onArchive(structure.id)
                }
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 12px', fontSize: 14, background: 'var(--background)', color: '#eab308', borderRadius: 8, border: '1px solid var(--border)', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
                onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
              >
                <Archive size={14} />
                {structure.archived ? "Restore" : "Archive"}
              </button>
              <button
                onClick={() => onDelete(structure.id)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 12px', fontSize: 14, background: 'var(--background)', color: '#ef4444', borderRadius: 8, border: '1px solid var(--border)', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
                onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>

            {structure.components && structure.components.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--secondary)', marginBottom: 8, textTransform: 'uppercase' }}>
                  Components
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {structure.components.slice(0, 3).map((comp) => (
                    <div key={comp.id} style={{ fontSize: 12, color: 'var(--secondary)' }}>
                      • {comp.name}: {comp.isPercentage ? `${comp.amount}%` : `$${comp.amount}`}
                    </div>
                  ))}
                  {structure.components.length > 3 && (
                    <div style={{ fontSize: 12, color: 'var(--secondary)', fontStyle: 'italic' }}>
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
        <div style={{ textAlign: 'center', padding: 48, background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--secondary)', marginBottom: 16 }}>
            {showArchived ? "No archived structures" : "No salary structures found"}
          </p>
          {!showArchived && (
            <button
              onClick={onAdd}
              style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
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
