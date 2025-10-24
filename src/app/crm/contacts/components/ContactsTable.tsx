import { Contact } from "@/types/contacts";
import { Eye, Edit2, Trash2 } from "lucide-react";

interface Props { contacts: Contact[]; onView?: (c: Contact) => void; onEdit?: (c: Contact) => void; onDelete?: (id: string) => void }

export function ContactsTable({ contacts, onView, onEdit, onDelete }: Props) {
  if (!contacts || contacts.length === 0) return <div style={{ color: "var(--secondary)" }}>No contacts found.</div>;

  return (
    <div style={{ width: "100%", overflowX: "auto", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card-bg)" }}>
      <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
            <th style={{ padding: 12, whiteSpace: "nowrap" }}>Name</th>
            <th style={{ padding: 12, whiteSpace: "nowrap" }}>Company</th>
            <th style={{ padding: 12, whiteSpace: "nowrap" }}>Email</th>
            <th style={{ padding: 12, whiteSpace: "nowrap" }}>Phone</th>
            <th style={{ padding: 12, whiteSpace: "nowrap" }}>Type</th>
            <th style={{ padding: 12, whiteSpace: "nowrap" }}>Tags</th>
            <th style={{ padding: 12, whiteSpace: "nowrap" }}>Country</th>
            <th style={{ padding: 12, whiteSpace: "nowrap" }}>Last Activity</th>
            <th style={{ padding: 12, whiteSpace: "nowrap" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: 12 }}>{c.fullName || `${c.firstName} ${c.lastName}`}</td>
              <td style={{ padding: 12 }}>{c.companyName || "-"}</td>
              <td style={{ padding: 12 }}>{c.email}</td>
              <td style={{ padding: 12 }}>{c.phone || "-"}</td>
              <td style={{ padding: 12 }}><span style={{ padding: "4px 8px", borderRadius: 999, background: c.type === "Customer" ? "rgba(5,150,105,0.12)" : "rgba(37,99,235,0.12)", color: c.type === "Customer" ? "#059669" : "#2563eb", fontWeight: 600 }}>{c.type}</span></td>
              <td style={{ padding: 12 }}>
                {c.tags.map(t => <span key={t} style={{ marginRight: 6, padding: "4px 8px", borderRadius: 8, background: "var(--border)", fontSize: 12 }}>{t}</span>)}
              </td>
              <td style={{ padding: 12 }}>{c.country || "-"}</td>
              <td style={{ padding: 12 }}>{c.lastActivity ? new Date(c.lastActivity).toLocaleDateString() : "-"}</td>
              <td style={{ padding: 12 }}>
                <button onClick={() => onView?.(c)} style={{ marginRight: 8 }}><Eye size={14} /></button>
                <button onClick={() => onEdit?.(c)} style={{ marginRight: 8 }}><Edit2 size={14} /></button>
                <button onClick={() => onDelete?.(c.id)}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
