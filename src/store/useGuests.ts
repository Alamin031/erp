"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Guest, GuestFilters, GuestStatus, GuestStats } from "@/types/guest";

interface GuestsStore {
  guests: Guest[];
  selectedGuestId: string | null;
  filters: GuestFilters;
  searchQuery: string;
  viewMode: "table" | "grid";
  pagination: {
    page: number;
    pageSize: number;
  };
  activityLog: Array<{ timestamp: string; message: string; guestId?: string }>;

  // Actions
  setGuests: (guests: Guest[]) => void;
  setSelectedGuestId: (id: string | null) => void;
  setFilters: (filters: GuestFilters) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: "table" | "grid") => void;
  setPagination: (page: number, pageSize: number) => void;
  
  addGuest: (guest: Omit<Guest, "id" | "createdAt" | "updatedAt" | "activityLog">) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  
  searchGuests: (query: string) => Guest[];
  filterGuests: () => Guest[];
  getFilteredGuests: () => Guest[];
  getCurrentGuests: () => Guest[];
  getVIPGuests: () => Guest[];
  getRecentArrivals: (days: number) => Guest[];
  
  getStats: () => GuestStats;
  bulkExport: (ids: string[]) => void;
}

export const useGuests = create<GuestsStore>()(
  persist(
    (set, get) => ({
      guests: [],
      selectedGuestId: null,
      filters: {
        status: "All",
        tag: "All",
        dateFromArrival: "",
        dateToArrival: "",
        floor: "All",
        roomType: "All",
      },
      searchQuery: "",
      viewMode: "table",
      pagination: {
        page: 1,
        pageSize: 10,
      },
      activityLog: [],

      setGuests: (guests) => set({ guests }),

      setSelectedGuestId: (id) => set({ selectedGuestId: id }),

      setFilters: (filters) => set({ filters }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setPagination: (page, pageSize) => set({ pagination: { page, pageSize } }),

      addGuest: (guestData) => {
        const newGuest: Guest = {
          ...guestData,
          id: `G-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          activityLog: [
            {
              id: "1",
              timestamp: new Date().toISOString(),
              type: "check-in",
              description: "Guest profile created",
              performedBy: "System",
            },
          ],
        };
        set((state) => ({
          guests: [newGuest, ...state.guests],
          activityLog: [
            ...state.activityLog,
            {
              timestamp: new Date().toISOString(),
              message: `New guest added: ${guestData.firstName} ${guestData.lastName}`,
              guestId: newGuest.id,
            },
          ],
        }));
      },

      updateGuest: (id, updates) => {
        set((state) => ({
          guests: state.guests.map((g) =>
            g.id === id
              ? {
                  ...g,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                  activityLog: [
                    ...(g.activityLog || []),
                    {
                      id: `${(g.activityLog?.length || 0) + 1}`,
                      timestamp: new Date().toISOString(),
                      type: "edit",
                      description: "Guest profile updated",
                      performedBy: "Staff",
                    },
                  ],
                }
              : g
          ),
          activityLog: [
            ...state.activityLog,
            {
              timestamp: new Date().toISOString(),
              message: `Guest profile updated: ${id}`,
              guestId: id,
            },
          ],
        }));
      },

      deleteGuest: (id) => {
        set((state) => ({
          guests: state.guests.filter((g) => g.id !== id),
          selectedGuestId: state.selectedGuestId === id ? null : state.selectedGuestId,
          activityLog: [
            ...state.activityLog,
            {
              timestamp: new Date().toISOString(),
              message: `Guest deleted: ${id}`,
              guestId: id,
            },
          ],
        }));
      },

      searchGuests: (query) => {
        const { guests } = get();
        if (!query.trim()) return guests;

        const q = query.toLowerCase();
        return guests.filter(
          (g) =>
            g.firstName.toLowerCase().includes(q) ||
            g.lastName.toLowerCase().includes(q) ||
            g.email.toLowerCase().includes(q) ||
            g.phone.includes(q) ||
            g.currentRoomNumber?.toLowerCase().includes(q)
        );
      },

      filterGuests: () => {
        const { guests, filters } = get();
        let filtered = guests;

        if (filters.status !== "All") {
          filtered = filtered.filter((g) => g.status === filters.status);
        }

        if (filters.tag !== "All") {
          filtered = filtered.filter((g) => g.tags.includes(filters.tag));
        }

        if (filters.dateFromArrival) {
          filtered = filtered.filter(
            (g) => new Date(g.checkInDate) >= new Date(filters.dateFromArrival)
          );
        }

        if (filters.dateToArrival) {
          filtered = filtered.filter(
            (g) => new Date(g.checkInDate) <= new Date(filters.dateToArrival)
          );
        }

        if (filters.floor !== "All" && filters.floor) {
          filtered = filtered.filter((g) => g.currentFloor === filters.floor);
        }

        return filtered;
      },

      getFilteredGuests: () => {
        const { searchQuery, pagination, filterGuests: filter } = get();
        let filtered = filter();

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (g) =>
              g.firstName.toLowerCase().includes(q) ||
              g.lastName.toLowerCase().includes(q) ||
              g.email.toLowerCase().includes(q) ||
              g.phone.includes(q) ||
              g.currentRoomNumber?.toLowerCase().includes(q)
          );
        }

        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filtered.slice(start, end);
      },

      getCurrentGuests: () => {
        return get().guests.filter((g) => g.status === "Checked-in");
      },

      getVIPGuests: () => {
        return get().guests.filter((g) => g.tags.includes("VIP"));
      },

      getRecentArrivals: (days) => {
        const now = new Date();
        const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        return get().guests.filter((g) => {
          const checkInDate = new Date(g.checkInDate);
          return checkInDate >= pastDate && checkInDate <= now;
        });
      },

      getStats: () => {
        const { guests } = get();
        const today = new Date().toDateString();

        return {
          totalGuests: guests.length,
          checkedInGuests: guests.filter((g) => g.status === "Checked-in").length,
          vipGuests: guests.filter((g) => g.tags.includes("VIP")).length,
          newGuestsToday: guests.filter(
            (g) => new Date(g.createdAt).toDateString() === today
          ).length,
        };
      },

      bulkExport: (ids) => {
        const { guests } = get();
        const selectedGuests = guests.filter((g) => ids.includes(g.id));

        const headers = ["Name", "Email", "Phone", "Room", "Status", "Check-in"];
        const rows = selectedGuests.map((g) => [
          `${g.firstName} ${g.lastName}`,
          g.email,
          g.phone,
          g.currentRoomNumber || "N/A",
          g.status,
          new Date(g.checkInDate).toLocaleDateString(),
        ]);

        const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `guests-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
    }),
    {
      name: "guests-store",
    }
  )
);
