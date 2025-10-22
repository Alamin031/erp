"use client";

import { useEffect, useMemo, useState } from "react";
import { useGuests } from "@/store/useGuests";
import { GuestsTable } from "@/components/guests-table";
import { GuestCard } from "@/components/guest-card";
import { GuestStatsCards } from "@/components/guest-stats-cards";
import { ActivityLogGuests } from "@/components/activity-log-guests";
import { FiltersBarGuests } from "@/components/filters-bar-guests";
import { SearchBarGuests } from "@/components/search-bar-guests";
import { QuickActionsGuests } from "@/components/quick-actions-guests";
import { AddGuestModal } from "@/components/add-guest-modal";
import { EditGuestModal } from "@/components/edit-guest-modal";
import { GuestProfileDrawer } from "@/components/guest-profile-drawer";
import { Guest } from "@/types/guest";
import { ToastContainer, useToast } from "@/components/toast";

export function GuestsPageClient() {
  const {
    guests,
    setGuests,
    filters,
    setSearchQuery,
    viewMode,
    setViewMode,
    searchQuery,
  } = useGuests();

  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    if (guests.length === 0) {
      fetch("/demo/demoGuests.json")
        .then((r) => r.json())
        .then((data) => setGuests(data))
        .catch(() => {});
    }
  }, [guests.length, setGuests]);

  const stats = useMemo(() => {
    const total = guests.length;
    const occupied = guests.filter((g) => g.status === "Checked-in").length;
    const vips = guests.filter((g) => g.tags.includes("VIP")).length;
    const today = new Date().toDateString();
    const newToday = guests.filter((g) => new Date(g.createdAt).toDateString() === today).length;
    return { total, occupied, vips, newToday };
  }, [guests]);

  const filteredGuests = useMemo(() => {
    let list = guests.filter((g) => {
      if (filters.status !== "All" && g.status !== filters.status) return false;
      if (filters.tag !== "All" && !g.tags.includes(filters.tag)) return false;
      if (filters.dateFromArrival && new Date(g.checkInDate) < new Date(filters.dateFromArrival)) return false;
      if (filters.dateToArrival && new Date(g.checkInDate) > new Date(filters.dateToArrival)) return false;
      if (filters.floor !== "All" && filters.floor !== undefined && g.currentFloor !== filters.floor) return false;
      return true;
    });
    const q = (searchQuery || "").toLowerCase().trim();
    if (q) {
      list = list.filter((g) =>
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.phone.toLowerCase().includes(q) ||
        (g.currentRoomNumber || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [guests, filters, searchQuery]);

  const handleView = (guestId: string) => {
    const g = guests.find((x) => x.id === guestId) || null;
    setSelectedGuest(g);
    setIsProfileOpen(true);
  };

  const handleEdit = (guestId: string) => {
    const g = guests.find((x) => x.id === guestId) || null;
    setEditingGuest(g);
  };

  const gridGuestsForPage = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredGuests.slice(start, end);
  }, [filteredGuests, pagination]);

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Guests</h1>
          <p className="dashboard-subtitle">View guest information and profiles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="dashboard-section"><div className="stat-label">Total Guests</div><div className="stat-value text-primary">{stats.total}</div></div>
          <div className="dashboard-section"><div className="stat-label">Currently Occupied</div><div className="stat-value text-success">{stats.occupied}</div></div>
          <div className="dashboard-section"><div className="stat-label">VIPs</div><div className="stat-value">⭐ {stats.vips}</div></div>
          <div className="dashboard-section"><div className="stat-label">New Today</div><div className="stat-value text-success">{stats.newToday}</div></div>
        </div>

        <div className="dashboard-section flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <SearchBarGuests onSearch={setSearchQuery} />
            <div className="flex gap-2">
              <button className={`btn ${viewMode === "table" ? "btn-primary" : "btn-secondary"}`} onClick={() => setViewMode("table")} title="Table view">▤</button>
              <button className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-secondary"}`} onClick={() => setViewMode("grid")} title="Grid view">▦</button>
            </div>
          </div>
          <FiltersBarGuests />
          <QuickActionsGuests onAddGuest={() => setIsAddOpen(true)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {viewMode === "table" ? (
              <GuestsTable
                guests={filteredGuests}
                onViewClick={handleView}
                onEditClick={handleEdit}
                pagination={pagination}
                onPaginationChange={setPagination}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gridGuestsForPage.length === 0 ? (
                  <div className="text-center text-secondary py-8">No guests found</div>
                ) : (
                  gridGuestsForPage.map((g) => (
                    <GuestCard key={g.id} guest={g} onClick={() => handleView(g.id)} />
                  ))
                )}
              </div>
            )}
          </div>
          <div className="dashboard-section flex flex-col gap-6">
            <GuestStatsCards />
            <ActivityLogGuests />
          </div>
        </div>
      </div>

      <AddGuestModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditGuestModal isOpen={!!editingGuest} onClose={() => setEditingGuest(null)} guest={editingGuest} />
      <GuestProfileDrawer guest={selectedGuest} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
