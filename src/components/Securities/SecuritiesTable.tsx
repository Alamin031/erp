"use client";

import { useMemo, useState } from "react";
import { Security } from "@/types/securities";
import { useSecurities } from "@/store/useSecurities";
import { useToast } from "@/components/toast";
import { ChevronDown } from "lucide-react";

interface Props {
  items: Security[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddTransaction: (id: string) => void;
}

type SortField = "holderName" | "shares" | "value" | "issueDate";
interface SortState {
  field: SortField;
  direction: "asc" | "desc";
}

export function SecuritiesTable({ items, onView, onEdit, onDelete, onAddTransaction }: Props) {
  const { deleteSecurity } = useSecurities();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortState>({ field: "issueDate", direction: "desc" });

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      let aVal: any = a[sort.field];
      let bVal: any = b[sort.field];

      if (sort.field === "shares") {
        return sort.direction === "asc" ? (a.shares || 0) - (b.shares || 0) : (b.shares || 0) - (a.shares || 0);
      }
      if (sort.field === "value") {
        return sort.direction === "asc" ? (a.value || 0) - (b.value || 0) : (b.value || 0) - (a.value || 0);
      }
      if (sort.field === "issueDate" || sort.field === "holderName") {
        const aStr = aVal?.toString() || "";
        const bStr = bVal?.toString() || "";
        return sort.direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      }
      return 0;
    });
    return copy;
  }, [items, sort]);

  const toggleAll = () => {
    if (selected.size === sorted.length) setSelected(new Set());
    else setSelected(new Set(sorted.map((i) => i.id)));
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const exportCSV = () => {
    const ids = Array.from(selected);
    const rows = items
      .filter((i) => ids.includes(i.id))
      .map((i) => [
        i.id,
        i.holderName,
        i.type,
        i.shares.toString(),
        (i.shares * i.value).toFixed(2),
        i.issueDate,
        i.status,
      ]);
    const csv = [
      "ID,Holder Name,Type,Shares,Value,Issue Date,Status",
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `securities-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Issued":
        return { background: "#fef08a", color: "#854d0e" };
      case "Active":
        return { background: "#dcfce7", color: "#166534" };
      case "Vested":
        return { background: "#dbeafe", color: "#0c2d6b" };
      case "Transferred":
        return { background: "#e9d5ff", color: "#6b21a8" };
      case "Cancelled":
        return { background: "#fee2e2", color: "#7c2d12" };
      default:
        return { background: "var(--background)", color: "var(--secondary)" };
    }
  };

  const confirmDelete = (id: string) => {
    if (confirm("Delete this security?")) {
      deleteSecurity(id);
      showToast("Security deleted", "success");
      setSelected((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
      onDelete(id);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {selected.size > 0 && (
        <div style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--secondary)" }}>
            {selected.size} selected
          </span>
          <button
            onClick={exportCSV}
            style={{
              background: "var(--primary)",
              color: "white",
              padding: "6px 16px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Export CSV
          </button>
        </div>
      )}
      <div style={{
        borderRadius: "6px",
        border: "1px solid var(--border)",
        overflowX: "auto"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>
          <thead>
            <tr style={{
              borderBottom: "1px solid var(--border)",
              background: "var(--background)"
            }}>
              <th style={{
                width: 30,
                padding: "12px 16px",
                textAlign: "left"
              }}>
                <input
                  type="checkbox"
                  checked={selected.size > 0 && selected.size === sorted.length}
                  onChange={toggleAll}
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "var(--secondary)",
                  cursor: "pointer",
                  userSelect: "none"
                }}
                onClick={() =>
                  setSort({
                    field: "holderName",
                    direction: sort.field === "holderName" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  HOLDER NAME {sort.field === "holderName" && <ChevronDown size={14} />}
                </div>
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "12px",
                fontWeight: "700",
                color: "var(--secondary)"
              }}>
                TYPE
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "var(--secondary)",
                  cursor: "pointer",
                  userSelect: "none"
                }}
                onClick={() =>
                  setSort({
                    field: "shares",
                    direction: sort.field === "shares" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  SHARES {sort.field === "shares" && <ChevronDown size={14} />}
                </div>
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "var(--secondary)",
                  cursor: "pointer",
                  userSelect: "none"
                }}
                onClick={() =>
                  setSort({
                    field: "value",
                    direction: sort.field === "value" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  VALUE {sort.field === "value" && <ChevronDown size={14} />}
                </div>
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "var(--secondary)",
                  cursor: "pointer",
                  userSelect: "none"
                }}
                onClick={() =>
                  setSort({
                    field: "issueDate",
                    direction: sort.field === "issueDate" && sort.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  ISSUE DATE {sort.field === "issueDate" && <ChevronDown size={14} />}
                </div>
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "12px",
                fontWeight: "700",
                color: "var(--secondary)"
              }}>
                STATUS
              </th>
              <th style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "12px",
                fontWeight: "700",
                color: "var(--secondary)"
              }}>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "var(--secondary)",
                  fontSize: "13px"
                }}>
                  No securities found
                </td>
              </tr>
            ) : (
              sorted.map((security) => (
                <tr
                  key={security.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--background)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{
                    padding: "12px 16px"
                  }}>
                    <input
                      type="checkbox"
                      checked={selected.has(security.id)}
                      onChange={() => toggleSelect(security.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--primary)"
                  }}>
                    {security.holderName}
                  </td>
                  <td style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--secondary)"
                  }}>
                    <span style={{
                      background: "#e0e7ff",
                      color: "#312e81",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "600"
                    }}>
                      {security.type}
                    </span>
                  </td>
                  <td style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--secondary)"
                  }}>
                    {security.shares.toLocaleString()}
                  </td>
                  <td style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--secondary)"
                  }}>
                    ${(security.shares * security.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--secondary)"
                  }}>
                    {security.issueDate}
                  </td>
                  <td style={{
                    padding: "12px 16px",
                    fontSize: "13px"
                  }}>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "600",
                      ...getStatusBadgeStyles(security.status)
                    }}>
                      {security.status}
                    </span>
                  </td>
                  <td style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    display: "flex",
                    gap: "8px"
                  }}>
                    <button
                      onClick={() => onView(security.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      title="View Details"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(security.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--success)",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onAddTransaction(security.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      title="Add Transaction"
                    >
                      Transaction
                    </button>
                    <button
                      onClick={() => confirmDelete(security.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--danger)",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
