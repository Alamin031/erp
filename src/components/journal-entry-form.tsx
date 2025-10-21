"use client";

import { useState } from "react";
import { JournalEntry, JournalLine, ChartOfAccounts } from "@/types/accounting";
import { useToast } from "./toast";

interface JournalEntryFormProps {
  chartOfAccounts: ChartOfAccounts[];
  onSubmit: (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "createdBy">) => void;
  onCancel: () => void;
}

export function JournalEntryForm({ chartOfAccounts, onSubmit, onCancel }: JournalEntryFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    referenceNumber: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    lines: [
      { accountCode: "", accountName: "", type: "Debit" as const, amount: 0, description: "" },
      { accountCode: "", accountName: "", type: "Credit" as const, amount: 0, description: "" },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addLine = () => {
    setFormData({
      ...formData,
      lines: [...formData.lines, { accountCode: "", accountName: "", type: "Debit", amount: 0, description: "" }],
    });
  };

  const removeLine = (index: number) => {
    if (formData.lines.length <= 2) {
      showToast("Journal entry must have at least 2 lines", "error");
      return;
    }
    setFormData({
      ...formData,
      lines: formData.lines.filter((_, i) => i !== index),
    });
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...formData.lines];
    if (field === "accountCode") {
      const account = chartOfAccounts.find((a) => a.code === value);
      newLines[index] = { ...newLines[index], accountCode: value, accountName: account?.name || "" };
    } else {
      (newLines[index] as any)[field] = value;
    }
    setFormData({ ...formData, lines: newLines });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.referenceNumber) newErrors.referenceNumber = "Reference number is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (formData.lines.length < 2) newErrors.lines = "Entry must have at least 2 lines";

    formData.lines.forEach((line, index) => {
      if (!line.accountCode) newErrors[`line-${index}-account`] = "Account is required";
      if (line.amount <= 0) newErrors[`line-${index}-amount`] = "Amount must be greater than 0";
    });

    const totalDebits = formData.lines
      .filter((l) => l.type === "Debit")
      .reduce((sum, l) => sum + l.amount, 0);
    const totalCredits = formData.lines
      .filter((l) => l.type === "Credit")
      .reduce((sum, l) => sum + l.amount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      newErrors.balance = `Debits ($${totalDebits.toFixed(2)}) must equal Credits ($${totalCredits.toFixed(2)})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    const entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "createdBy"> = {
      referenceNumber: formData.referenceNumber,
      date: formData.date,
      description: formData.description,
      lines: formData.lines.map((line) => ({
        accountId: chartOfAccounts.find((a) => a.code === line.accountCode)?.id || "",
        accountCode: line.accountCode,
        accountName: line.accountName,
        type: line.type,
        amount: line.amount,
        description: line.description,
      })),
      isPosted: false,
    };

    onSubmit(entry);
    showToast("Journal entry created successfully", "success");
  };

  const totalDebits = formData.lines.filter((l) => l.type === "Debit").reduce((sum, l) => sum + l.amount, 0);
  const totalCredits = formData.lines.filter((l) => l.type === "Credit").reduce((sum, l) => sum + l.amount, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <div style={{ background: "var(--card-bg)", borderRadius: "8px", padding: "24px", border: "1px solid var(--border)" }}>
      <h2 style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: "700", color: "var(--foreground)" }}>
        Create Journal Entry
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label className="form-label">Reference Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="JE-2024-001"
              value={formData.referenceNumber}
              onChange={(e) => {
                setFormData({ ...formData, referenceNumber: e.target.value });
                if (errors.referenceNumber) setErrors({ ...errors, referenceNumber: "" });
              }}
            />
            {errors.referenceNumber && <p style={{ color: "#dc3545", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.referenceNumber}</p>}
          </div>

          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                if (errors.date) setErrors({ ...errors, date: "" });
              }}
            />
            {errors.date && <p style={{ color: "#dc3545", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.date}</p>}
          </div>
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            placeholder="Enter a description for this journal entry..."
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ fontFamily: "inherit", resize: "vertical" }}
          />
        </div>

        {errors.balance && (
          <div style={{ padding: "12px", background: "#dc354520", border: "1px solid #dc3545", borderRadius: "4px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#dc3545" }}>{errors.balance}</p>
          </div>
        )}

        <div style={{ marginTop: "12px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
            Journal Lines
          </h3>

          <div style={{ overflowX: "auto", marginBottom: "16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)" }}>
                    Account
                  </th>
                  <th style={{ padding: "8px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "var(--secondary)" }}>
                    Type
                  </th>
                  <th style={{ padding: "8px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)" }}>
                    Amount
                  </th>
                  <th style={{ padding: "8px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)" }}>
                    Description
                  </th>
                  <th style={{ padding: "8px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "var(--secondary)" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.lines.map((line, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px" }}>
                      <select
                        className="form-input"
                        value={line.accountCode}
                        onChange={(e) => updateLine(index, "accountCode", e.target.value)}
                        style={{ fontSize: "13px" }}
                      >
                        <option value="">Select Account</option>
                        {chartOfAccounts.map((account) => (
                          <option key={account.code} value={account.code}>
                            {account.code} - {account.name}
                          </option>
                        ))}
                      </select>
                      {errors[`line-${index}-account`] && (
                        <p style={{ color: "#dc3545", fontSize: "11px", margin: "2px 0 0 0" }}>{errors[`line-${index}-account`]}</p>
                      )}
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <select
                        className="form-input"
                        value={line.type}
                        onChange={(e) => updateLine(index, "type", e.target.value)}
                        style={{ fontSize: "13px" }}
                      >
                        <option value="Debit">Debit</option>
                        <option value="Credit">Credit</option>
                      </select>
                    </td>
                    <td style={{ padding: "8px", textAlign: "right" }}>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={line.amount}
                        onChange={(e) => updateLine(index, "amount", parseFloat(e.target.value) || 0)}
                        style={{ fontSize: "13px" }}
                      />
                      {errors[`line-${index}-amount`] && (
                        <p style={{ color: "#dc3545", fontSize: "11px", margin: "2px 0 0 0" }}>{errors[`line-${index}-amount`]}</p>
                      )}
                    </td>
                    <td style={{ padding: "8px" }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Description"
                        value={line.description}
                        onChange={(e) => updateLine(index, "description", e.target.value)}
                        style={{ fontSize: "13px" }}
                      />
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        style={{
                          padding: "4px 8px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#dc3545",
                          background: "transparent",
                          border: "1px solid #dc3545",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--background)", borderTop: "2px solid var(--border)" }}>
                  <td colSpan={2} style={{ padding: "8px", textAlign: "right", fontWeight: "600", color: "var(--foreground)" }}>
                    Totals:
                  </td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div>
                        <div style={{ fontSize: "11px", color: "var(--secondary)" }}>Debits</div>
                        <div style={{ fontWeight: "700", color: totalDebits > 0 ? "#0066cc" : "var(--foreground)" }}>
                          ${totalDebits.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "var(--secondary)" }}>Credits</div>
                        <div style={{ fontWeight: "700", color: totalCredits > 0 ? "#0066cc" : "var(--foreground)" }}>
                          ${totalCredits.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button
            type="button"
            onClick={addLine}
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--primary)",
              background: "transparent",
              border: "1px solid var(--primary)",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            + Add Line
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--foreground)",
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isBalanced}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              color: isBalanced ? "white" : "var(--secondary)",
              background: isBalanced ? "var(--primary)" : "var(--background)",
              border: `1px solid ${isBalanced ? "var(--primary)" : "var(--border)"}`,
              borderRadius: "4px",
              cursor: isBalanced ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            Create Entry
          </button>
        </div>
      </form>
    </div>
  );
}
