"use client";

import { useState } from "react";
import { JournalEntry, JournalLine, ChartOfAccounts } from "@/types/accounting";
import { useToast } from "./toast";

interface JournalEntryFormProps {
  chartOfAccounts: ChartOfAccounts[];
  onSubmit: (
    entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "createdBy">
  ) => void;
  onCancel: () => void;
}

export function JournalEntryForm({
  chartOfAccounts,
  onSubmit,
  onCancel,
}: JournalEntryFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    referenceNumber: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    lines: [
      {
        accountCode: "",
        accountName: "",
        type: "Debit" as const,
        amount: 0,
        description: "",
      },
      {
        accountCode: "",
        accountName: "",
        type: "Credit" as const,
        amount: 0,
        description: "",
      },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const styles: {
    container: React.CSSProperties;
    header: React.CSSProperties;
    twoCols: React.CSSProperties;
    label: React.CSSProperties;
    input: React.CSSProperties;
    textarea: React.CSSProperties;
    errorText: React.CSSProperties;
    tableWrap: React.CSSProperties;
    table: React.CSSProperties;
    th: React.CSSProperties;
    td: React.CSSProperties;
    smallBtn: React.CSSProperties;
    addLineBtn: React.CSSProperties;
    actions: React.CSSProperties;
    cancelBtn: React.CSSProperties;
    submitBtn: (enabled?: boolean) => React.CSSProperties;
    balanceNotice: React.CSSProperties;
  } = {
    container: {
      background: "var(--card-bg)",
      borderRadius: 8,
      padding: 20,
      border: "1px solid var(--border)",
    },
    header: {
      margin: "0 0 18px 0",
      fontSize: 20,
      fontWeight: 700,
      color: "var(--foreground)",
    },
    twoCols: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    label: {
      display: "block",
      fontSize: 13,
      color: "var(--secondary)",
      marginBottom: 6,
    },
    input: {
      width: "100%",
      padding: "8px 10px",
      borderRadius: 6,
      border: "1px solid var(--border)",
      background: "var(--input-bg, transparent)",
      color: "var(--foreground)",
      fontSize: 14,
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "8px 10px",
      borderRadius: 6,
      border: "1px solid var(--border)",
      fontSize: 14,
      resize: "vertical",
    },
    errorText: { color: "#dc3545", fontSize: 12, marginTop: 6 },
    tableWrap: { overflowX: "auto", marginTop: 12 },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: {
      padding: 10,
      textAlign: "left",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--secondary)",
      borderBottom: "1px solid var(--border)",
    },
    td: {
      padding: 8,
      verticalAlign: "middle",
      borderBottom: "1px solid var(--border)",
    },
    smallBtn: {
      padding: "6px 10px",
      fontSize: 12,
      fontWeight: 600,
      color: "#dc3545",
      background: "transparent",
      border: "1px solid #dc3545",
      borderRadius: 4,
      cursor: "pointer",
    },
    addLineBtn: {
      padding: "8px 14px",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--primary)",
      background: "transparent",
      border: "1px solid var(--primary)",
      borderRadius: 6,
      cursor: "pointer",
    },
    actions: {
      display: "flex",
      gap: 12,
      justifyContent: "flex-end",
      marginTop: 18,
    },
    cancelBtn: {
      padding: "10px 18px",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--foreground)",
      background: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      cursor: "pointer",
    },
    submitBtn: (enabled = true): React.CSSProperties => ({
      padding: "10px 18px",
      fontSize: 14,
      fontWeight: 600,
      color: enabled ? "white" : "var(--secondary)",
      background: enabled ? "var(--primary)" : "var(--background)",
      border: `1px solid ${enabled ? "var(--primary)" : "var(--border)"}`,
      borderRadius: 6,
      cursor: enabled ? "pointer" : "not-allowed",
    }),
    balanceNotice: {
      padding: 12,
      borderRadius: 6,
      background: "#f8f9fa",
      border: "1px solid var(--border)",
    },
  };

  const addLine = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          accountCode: "",
          accountName: "",
          type: "Debit",
          amount: 0,
          description: "",
        },
      ],
    }));
  };

  const removeLine = (index: number) => {
    if (formData.lines.length <= 2) {
      showToast("Journal entry must have at least 2 lines", "error");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  };

  const updateLine = (
    index: number,
    field: keyof JournalLine | "accountCode",
    value: any
  ) => {
    setFormData((prev) => {
      const newLines = prev.lines.map((l, i) => ({ ...l }));
      if (field === "accountCode") {
        const account = chartOfAccounts.find((a) => a.code === value);
        newLines[index].accountCode = value;
        newLines[index].accountName = account?.name || "";
      } else if (field === "amount") {
        const parsed = parseFloat(value as any);
        newLines[index].amount = Number.isFinite(parsed) ? parsed : 0;
      } else if (field === "type") {
        newLines[index].type = value === "Credit" ? "Credit" : "Debit";
      } else {
        // description or accountName (rare)
        (newLines[index] as any)[field] = value;
      }
      return { ...prev, lines: newLines };
    });

    // clear per-line errors when user edits
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[`line-${index}-account`];
      delete copy[`line-${index}-amount`];
      delete copy.balance;
      return copy;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.referenceNumber)
      newErrors.referenceNumber = "Reference number is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (formData.lines.length < 2)
      newErrors.lines = "Entry must have at least 2 lines";

    formData.lines.forEach((line, index) => {
      if (!line.accountCode)
        newErrors[`line-${index}-account`] = "Account is required";
      if (line.amount <= 0)
        newErrors[`line-${index}-amount`] = "Amount must be greater than 0";
    });

    const totalDebits = formData.lines
      .filter((l) => l.type === "Debit")
      .reduce((s, l) => s + l.amount, 0);
    const totalCredits = formData.lines
      .filter((l) => l.type === "Credit")
      .reduce((s, l) => s + l.amount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      newErrors.balance = `Debits ($${totalDebits.toFixed(
        2
      )}) must equal Credits ($${totalCredits.toFixed(2)})`;
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

    const entry: Omit<
      JournalEntry,
      "id" | "createdAt" | "updatedAt" | "createdBy"
    > = {
      referenceNumber: formData.referenceNumber,
      date: formData.date,
      description: formData.description,
      lines: formData.lines.map((line) => ({
        accountId:
          chartOfAccounts.find((a) => a.code === line.accountCode)?.id || "",
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

  const totalDebits = formData.lines
    .filter((l) => l.type === "Debit")
    .reduce((sum, l) => sum + l.amount, 0);
  const totalCredits = formData.lines
    .filter((l) => l.type === "Credit")
    .reduce((sum, l) => sum + l.amount, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Create Journal Entry</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 18 }}
        noValidate
      >
        <div style={styles.twoCols}>
          <div>
            <label style={styles.label}>Reference Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="JE-2024-001"
              value={formData.referenceNumber}
              onChange={(e) => {
                setFormData({ ...formData, referenceNumber: e.target.value });
                if (errors.referenceNumber)
                  setErrors({ ...errors, referenceNumber: "" });
              }}
              style={styles.input}
              aria-invalid={!!errors.referenceNumber}
            />
            {errors.referenceNumber && (
              <p style={styles.errorText}>{errors.referenceNumber}</p>
            )}
          </div>

          <div>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                if (errors.date) setErrors({ ...errors, date: "" });
              }}
              style={styles.input}
            />
            {errors.date && <p style={styles.errorText}>{errors.date}</p>}
          </div>
        </div>

        <div>
          <label style={styles.label}>Description</label>
          <textarea
            className="form-input"
            placeholder="Enter a description for this journal entry..."
            rows={2}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            style={styles.textarea}
          />
        </div>

        {errors.balance && (
          <div
            style={{
              ...styles.balanceNotice,
              borderColor: "#f5c6cb",
              background: "#f8d7da",
            }}
          >
            <p style={{ margin: 0, color: "#721c24", fontSize: 13 }}>
              {errors.balance}
            </p>
          </div>
        )}

        <div>
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            Journal Lines
          </h3>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Account</th>
                  <th style={{ ...styles.th, textAlign: "center", width: 110 }}>
                    Type
                  </th>
                  <th style={{ ...styles.th, textAlign: "right", width: 140 }}>
                    Amount
                  </th>
                  <th style={styles.th}>Description</th>
                  <th style={{ ...styles.th, textAlign: "center", width: 90 }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {formData.lines.map((line, index) => (
                  <tr key={index}>
                    <td style={styles.td}>
                      <select
                        className="form-input"
                        value={line.accountCode}
                        onChange={(e) =>
                          updateLine(index, "accountCode", e.target.value)
                        }
                        style={styles.input}
                      >
                        <option value="">Select Account</option>
                        {chartOfAccounts.map((account) => (
                          <option key={account.code} value={account.code}>
                            {account.code} - {account.name}
                          </option>
                        ))}
                      </select>
                      {errors[`line-${index}-account`] && (
                        <p style={{ ...styles.errorText, marginTop: 6 }}>
                          {errors[`line-${index}-account`]}
                        </p>
                      )}
                    </td>

                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <select
                        className="form-input"
                        value={line.type}
                        onChange={(e) =>
                          updateLine(index, "type", e.target.value)
                        }
                        style={{ ...styles.input, textAlign: "center" }}
                        aria-label={`Line ${index + 1} type`}
                      >
                        <option value="Debit">Debit</option>
                        <option value="Credit">Credit</option>
                      </select>
                    </td>

                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={line.amount}
                        onChange={(e) =>
                          updateLine(index, "amount", e.target.value)
                        }
                        style={{ ...styles.input, textAlign: "right" }}
                        aria-label={`Line ${index + 1} amount`}
                      />
                      {errors[`line-${index}-amount`] && (
                        <p style={{ ...styles.errorText, marginTop: 6 }}>
                          {errors[`line-${index}-amount`]}
                        </p>
                      )}
                    </td>

                    <td style={styles.td}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Description"
                        value={line.description}
                        onChange={(e) =>
                          updateLine(index, "description", e.target.value)
                        }
                        style={styles.input}
                      />
                    </td>

                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        style={styles.smallBtn}
                        aria-label={`Remove line ${index + 1}`}
                        disabled={formData.lines.length <= 2}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      padding: 10,
                      textAlign: "right",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    Totals:
                  </td>
                  <td style={{ padding: 10, textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 18,
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{ fontSize: 11, color: "var(--secondary)" }}
                        >
                          Debits
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            color:
                              totalDebits > 0 ? "#0066cc" : "var(--foreground)",
                          }}
                        >
                          ${totalDebits.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{ fontSize: 11, color: "var(--secondary)" }}
                        >
                          Credits
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            color:
                              totalCredits > 0
                                ? "#0066cc"
                                : "var(--foreground)",
                          }}
                        >
                          ${totalCredits.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="button" onClick={addLine} style={styles.addLineBtn}>
              + Add Line
            </button>
          </div>
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isBalanced}
            style={styles.submitBtn(isBalanced)}
          >
            Create Entry
          </button>
        </div>
      </form>
    </div>
  );
}
