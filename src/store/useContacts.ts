import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Contact, Company, Tag, ContactFilters, ContactActivityEntry, ContactType } from "@/types/contacts";

interface ContactsStore {
  contacts: Contact[];
  companies: Company[];
  tags: Tag[];
  filters: ContactFilters;
  activityLog: ContactActivityEntry[];

  setContacts: (items: Contact[]) => void;
  setCompanies: (items: Company[]) => void;
  setTags: (items: Tag[]) => void;
  setFilters: (f: ContactFilters) => void;
  setActivityLog: (items: ContactActivityEntry[]) => void;

  loadDemoData: () => Promise<void>;
  addContact: (payload: Omit<Contact, "id" | "createdAt" | "updatedAt" | "fullName">) => void;
  editContact: (id: string, payload: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  assignTag: (id: string, tag: string) => void;
  filterContacts: (f: ContactFilters) => void;
  getContactById: (id: string) => Contact | undefined;

  getFilteredContacts: () => Contact[];
  getStatistics: () => { total: number; customers: number; prospects: number; activeThisMonth: number };
  getRecentActivity: (limit?: number) => ContactActivityEntry[];
}

export const useContacts = create<ContactsStore>()(
  persist((set, get) => ({
    contacts: [],
    companies: [],
    tags: [],
    filters: {},
    activityLog: [],

    setContacts: (items) => set({ contacts: items }),
    setCompanies: (items) => set({ companies: items }),
    setTags: (items) => set({ tags: items }),
    setFilters: (f) => set({ filters: f }),
    setActivityLog: (items) => set({ activityLog: items }),

    loadDemoData: async () => {
      try {
        const [contacts, companies, tags] = await Promise.all([
          fetch("/demo/demoContacts.json").then((r) => r.json()).catch(() => []),
          fetch("/demo/demoCompanies.json").then((r) => r.json()).catch(() => []),
          fetch("/demo/demoTags.json").then((r) => r.json()).catch(() => []),
        ]);

        set({
          contacts: contacts.map((c: any) => ({ ...c, fullName: `${c.firstName} ${c.lastName}` })),
          companies,
          tags,
          activityLog: [
            {
              id: `ACT-INIT-${Date.now()}`,
              contactId: "SYSTEM",
              contactName: "System",
              timestamp: new Date().toISOString(),
              type: "created",
              details: `Loaded ${contacts.length} contacts and ${companies.length} companies`,
              user: "System",
            },
          ],
        });
      } catch (e) {
        console.error("Failed to load demo contacts:", e);
      }
    },

    addContact: (payload) => {
      const id = `C-${Date.now()}`;
      const contact: Contact = {
        ...payload,
        id,
        fullName: `${payload.firstName} ${payload.lastName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Contact;

      set((state) => ({
        contacts: [contact, ...state.contacts],
        activityLog: [
          {
            id: `ACT-${Date.now()}`,
            contactId: id,
            contactName: contact.fullName || contact.email,
            timestamp: new Date().toISOString(),
            type: "created",
            details: `Contact created: ${contact.email}`,
            user: "System",
          },
          ...state.activityLog,
        ],
      }));
    },

    editContact: (id, payload) => {
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...payload, fullName: `${(payload.firstName ?? c.firstName)} ${(payload.lastName ?? c.lastName)}`, updatedAt: new Date().toISOString() } : c)),
        activityLog: [
          {
            id: `ACT-${Date.now()}`,
            contactId: id,
            contactName: (payload.firstName || payload.lastName) ? `${payload.firstName ?? ""} ${payload.lastName ?? ""}` : (state.contacts.find((x) => x.id === id)?.fullName || "Unknown"),
            timestamp: new Date().toISOString(),
            type: "updated",
            details: `Contact updated`,
            user: "System",
          },
          ...state.activityLog,
        ],
      }));
    },

    removeContact: (id) => {
      const contact = get().contacts.find((c) => c.id === id);
      if (!contact) return;
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
        activityLog: [
          {
            id: `ACT-${Date.now()}`,
            contactId: id,
            contactName: contact.fullName || contact.email,
            timestamp: new Date().toISOString(),
            type: "deleted",
            details: `Contact deleted`,
            user: "System",
          },
          ...state.activityLog,
        ],
      }));
    },

    assignTag: (id, tag) => {
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? { ...c, tags: Array.from(new Set([...(c.tags || []), tag])) } : c)),
        activityLog: [
          {
            id: `ACT-${Date.now()}`,
            contactId: id,
            contactName: state.contacts.find((c) => c.id === id)?.fullName || "Unknown",
            timestamp: new Date().toISOString(),
            type: "tagged",
            details: `Tag added: ${tag}`,
            user: "System",
          },
          ...state.activityLog,
        ],
      }));
    },

    filterContacts: (f) => set({ filters: f }),

    getContactById: (id) => get().contacts.find((c) => c.id === id),

    getFilteredContacts: () => {
      const { contacts, filters } = get();
      return contacts.filter((c) => {
        if (filters.type && filters.type !== "All" && c.type !== (filters.type as ContactType)) return false;
        if (filters.companyId && filters.companyId !== "All" && c.companyId !== filters.companyId) return false;
        if (filters.tags && filters.tags.length > 0 && !filters.tags.every((t) => c.tags.includes(t))) return false;
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          if (!(c.fullName || (c.firstName + " " + c.lastName)).toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !(c.companyName || "").toLowerCase().includes(q)) return false;
        }
        return true;
      }).sort((a, b) => {
        const da = new Date(a.lastActivity || a.updatedAt).getTime();
        const db = new Date(b.lastActivity || b.updatedAt).getTime();
        return db - da;
      });
    },

    getStatistics: () => {
      const { contacts } = get();
      const total = contacts.length;
      const customers = contacts.filter((c) => c.type === "Customer").length;
      const prospects = contacts.filter((c) => c.type === "Prospect").length;
      const now = new Date();
      const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const activeThisMonth = contacts.filter((c) => (c.lastActivity || c.updatedAt) >= startMonth).length;
      return { total, customers, prospects, activeThisMonth };
    },

    getRecentActivity: (limit = 20) => get().activityLog.slice(0, limit),
  }), { name: "contacts-store" })
);
