"use client";

import { useEffect, useState } from "react";
import { useContacts } from "@/store/useContacts";
import { Contact } from "@/types/contacts";
import { ContactStatsCards } from "./components/ContactStatsCards";
import { ContactsTable } from "./components/ContactsTable";
import { SegmentAnalyticsChart } from "./components/SegmentAnalyticsChart";
import { ActivityLog } from "./components/ActivityLog";
import { NewContactModal } from "./components/NewContactModal";
import { EditContactModal } from "./components/EditContactModal";
import { ContactDetailsDrawer } from "./components/ContactDetailsDrawer";
import { TagsFilter } from "./components/TagsFilter";
import { useToast } from "@/components/toast";
import { Plus, AlertCircle } from "lucide-react";

export function ContactsPageClient() {
  const { contacts, companies, tags, loadDemoData, addContact, editContact, removeContact, filterContacts, getFilteredContacts, getStatistics } = useContacts();
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [selected, setSelected] = useState<Contact | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (contacts.length === 0) loadDemoData().catch(() => showToast("Failed to load contacts", "error"));
  }, []);

  const stats = getStatistics();
  const filtered = getFilteredContacts();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div className="page-header">
          <div>
            <h2 className="dashboard-page-title">Contacts</h2>
            <p className="dashboard-subtitle">Manage customer and prospect contact information.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setIsNewOpen(true)}>
              <Plus size={14} style={{ marginRight: 8 }} /> New Contact
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section" role="alert" aria-live="polite">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AlertCircle size={18} color="#f59e0b" />
            <span style={{ color: "var(--secondary)" }}>⚙️ Contacts management is under development.</span>
          </div>
        </div>

        <div className="dashboard-section">
          <TagsFilter />
          <ContactStatsCards total={stats.total} customers={stats.customers} prospects={stats.prospects} activeThisMonth={stats.activeThisMonth} />

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div>
              <ContactsTable
                contacts={filtered}
                onView={(c) => setSelected(c)}
                onEdit={(c) => setEditing(c)}
                onDelete={(id) => { removeContact(id); showToast("Contact deleted", "success"); }}
              />
            </div>
            <div>
              <div className="dashboard-section" style={{ marginBottom: 16 }}>
                <h3 className="section-title">Segment Analytics</h3>
                <SegmentAnalyticsChart contacts={filtered} />
              </div>
              <div className="dashboard-section">
                <h3 className="section-title">Recent Activity</h3>
                <ActivityLog limit={12} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewContactModal isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} companies={companies} tags={tags} onSave={(p) => { addContact(p); showToast("Contact added", "success"); setIsNewOpen(false); }} />

      <EditContactModal isOpen={!!editing} contact={editing || undefined} onClose={() => setEditing(null)} onSave={(id, p) => { editContact(id, p); showToast("Contact updated", "success"); setEditing(null); }} companies={companies} tags={tags} />

      <ContactDetailsDrawer isOpen={!!selected} contact={selected || undefined} onClose={() => setSelected(null)} onEdit={(c) => { setEditing(c); setSelected(null); }} onDelete={(id) => { removeContact(id); showToast("Contact deleted", "success"); setSelected(null); }} />
    </div>
  );
}
