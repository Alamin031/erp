"use client";

import { useState } from "react";
import { BankAccount, BankTransaction, Payment } from "@/types/accounting";
import { useToast } from "./toast";

interface BankReconciliationProps {
  banks: BankAccount[];
  transactions: BankTransaction[];
  payments: Payment[];
  onReconcile?: (txnId: string, paymentId: string) => void;
}

export function BankReconciliation({
  banks,
  transactions,
  payments,
  onReconcile,
}: BankReconciliationProps) {
  const { showToast } = useToast();
  const [selectedBank, setSelectedBank] = useState<string>(banks[0]?.id || "");
  const [selectedMatches, setSelectedMatches] = useState<Record<string, string>>({});

  const selectedBankData = banks.find((b) => b.id === selectedBank);
  const bankTransactions = transactions.filter((t) => t.bankAccountId === selectedBank);

  const unreconciled = bankTransactions.filter((t) => t.status !== "Reconciled");

  const suggestMatch = (txn: BankTransaction) => {
    const fuzzyMatches = payments.filter((p) => {
      const amountMatch = Math.abs(p.amount - txn.amount) < 0.01;
      const dateMatch = Math.abs(
        new Date(p.date).getTime() - new Date(txn.date).getTime()
      ) < 24 * 60 * 60 * 1000;
      return amountMatch && dateMatch;
    });

    return fuzzyMatches[0];
  };

  const handleReconcile = (txnId: string) => {
    const paymentId = selectedMatches[txnId];
    if (!paymentId) {
      showToast("Please select a payment to match", "error");
      return;
    }

    onReconcile?.(txnId, paymentId);
    setSelectedMatches((prev) => ({
      ...prev,
      [txnId]: "",
    }));
    showToast("Transaction reconciled", "success");
  };

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "var(--foreground)" }}>
          Bank Reconciliation
        </h3>

        {selectedBankData && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>Bank</p>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "var(--foreground)" }}>
                {selectedBankData.bankName}
              </p>
            </div>
            <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>Account</p>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "var(--foreground)" }}>
                {selectedBankData.accountName}
              </p>
            </div>
            <div style={{ padding: "12px", background: "var(--background)", borderRadius: "4px" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>Balance</p>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#28a745" }}>
                ${selectedBankData.balance.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <label className="form-label">Select Bank Account</label>
          <select
            className="form-input"
            value={selectedBank}
            onChange={(e) => {
              setSelectedBank(e.target.value);
              setSelectedMatches({});
            }}
          >
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.accountName} - {bank.bankName} (${bank.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {unreconciled.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: "var(--secondary)" }}>
            <p style={{ margin: 0, fontSize: "14px" }}>All transactions reconciled ✓</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                    Date
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                    Description
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                    Amount
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                    Matched Payment
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {unreconciled.map((txn) => {
                  const suggestedMatch = suggestMatch(txn);

                  return (
                    <tr
                      key={txn.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--background)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--secondary)" }}>
                        {new Date(txn.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>
                        {txn.description}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "600", color: "var(--foreground)" }}>
                        ${txn.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <select
                          className="form-input"
                          value={selectedMatches[txn.id] || ""}
                          onChange={(e) =>
                            setSelectedMatches({
                              ...selectedMatches,
                              [txn.id]: e.target.value,
                            })
                          }
                          style={{ fontSize: "13px" }}
                        >
                          <option value="">
                            {suggestedMatch ? "✓ " : ""}
                            Select Payment
                          </option>
                          {payments.map((payment) => (
                            <option
                              key={payment.id}
                              value={payment.id}
                              style={{
                                fontWeight: suggestedMatch?.id === payment.id ? "700" : "400",
                              }}
                            >
                              {suggestedMatch?.id === payment.id ? "✓ " : ""}
                              {new Date(payment.date).toLocaleDateString()} - ${payment.amount.toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <button
                          onClick={() => handleReconcile(txn.id)}
                          disabled={!selectedMatches[txn.id]}
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: selectedMatches[txn.id] ? "white" : "var(--secondary)",
                            background: selectedMatches[txn.id] ? "var(--primary)" : "var(--background)",
                            border: `1px solid ${selectedMatches[txn.id] ? "var(--primary)" : "var(--border)"}`,
                            borderRadius: "4px",
                            cursor: selectedMatches[txn.id] ? "pointer" : "not-allowed",
                          }}
                        >
                          Reconcile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: "24px", padding: "16px", background: "var(--background)", borderRadius: "4px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>
                Unreconciled Items
              </p>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--foreground)" }}>
                {unreconciled.length}
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>
                Unmatched Amount
              </p>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#dc3545" }}>
                ${unreconciled.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
