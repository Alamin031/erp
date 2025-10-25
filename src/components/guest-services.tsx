"use client";

import { useEffect, useState, useMemo } from "react";
import { useGuestServices } from "@/store/useGuestServices";
import { NewRequestModal } from "./new-request-modal";
import { AssignStaffModal } from "./assign-staff-modal";
import { AddNoteModal } from "./add-note-modal";
import { RequestDetailsDrawer } from "./request-details-drawer";
import { ServiceRequestTable } from "./service-request-table";
import { RequestQueue } from "./request-queue";
import { ActivityLog } from "./activity-log";
import { RequestStatsCards } from "./request-stats-cards";
import { QuickActions } from "./quick-actions-services";
import { FiltersBarServices } from "./filters-bar-services";
import { SearchBarServices } from "./search-bar-services";

interface GuestServicesProps {
  initialRequests?: any[];
  initialStaff?: any[];
}

export function GuestServices({ initialRequests = [], initialStaff = [] }: GuestServicesProps) {
  const { setRequests, setStaff, setFilters, requests, filters } = useGuestServices();
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedRequestIdForModal, setSelectedRequestIdForModal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize data
  useEffect(() => {
    if (initialRequests.length > 0) {
      setRequests(initialRequests);
    }
    if (initialStaff.length > 0) {
      setStaff(initialStaff);
    }
  }, [setRequests, setStaff]);

  // Filter requests based on search query
  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return requests;

    const query = searchQuery.toLowerCase();
    return requests.filter(
      (r) =>
        r.id.toLowerCase().includes(query) ||
        r.guestName.toLowerCase().includes(query) ||
        r.roomNumber.toLowerCase().includes(query)
    );
  }, [requests, searchQuery]);

  // Apply filters to search results
  const visibleRequests = useMemo(() => {
    let filtered = filteredBySearch;

    if (filters.status !== "All") {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    if (filters.priority !== "All") {
      filtered = filtered.filter((r) => r.priority === filters.priority);
    }

    if (filters.serviceType !== "All") {
      filtered = filtered.filter((r) => r.serviceType === filters.serviceType);
    }

    if (filters.assignedStaff !== "All") {
      filtered = filtered.filter((r) => r.assignedStaffIds.includes(filters.assignedStaff));
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((r) => new Date(r.requestedAt) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter((r) => new Date(r.requestedAt) <= new Date(filters.dateTo));
    }

    return filtered;
  }, [filteredBySearch, filters]);

  const handleAssignClick = (requestId: string) => {
    setSelectedRequestIdForModal(requestId);
    setIsAssignStaffModalOpen(true);
  };

  const handleAddNoteClick = () => {
    setIsAddNoteModalOpen(true);
  };

  const handleViewRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const handleQueueClick = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dashboard-section">
          <div className="stat-label">Open Requests</div>
          <div className="stat-value text-primary">{requests.filter((r) => r.status === "Open").length}</div>
          <div className="stat-change text-xs">Awaiting assignment</div>
        </div>
        <div className="dashboard-section">
          <div className="stat-label">In Progress</div>
          <div className="stat-value text-warning">{requests.filter((r) => r.status === "In Progress").length}</div>
          <div className="stat-change text-xs">Being processed</div>
        </div>
        <div className="dashboard-section">
          <div className="stat-label">Resolved Today</div>
          <div className="stat-value text-success">
            {requests.filter(
              (r) =>
                r.status === "Resolved" &&
                r.completedAt &&
                new Date(r.completedAt).toDateString() === new Date().toDateString()
            ).length}
          </div>
          <div className="stat-change text-xs">Completed requests</div>
        </div>
        <div className="dashboard-section">
          <div className="stat-label">Avg Response Time</div>
          <div className="stat-value text-primary">
            {Math.round(
              requests.reduce((sum, r) => {
                if (r.eta) {
                  const diff = new Date(r.eta).getTime() - new Date(r.requestedAt).getTime();
                  return sum + diff;
                }
                return sum;
              }, 0) / Math.max(requests.length, 1) / 60000
            )}
          </div>
          <div className="stat-change text-xs">minutes</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <QuickActions onAddRequest={() => setIsNewRequestModalOpen(true)} />
      </div>

      {/* Filters and Search */}
      <div className="dashboard-section flex flex-col gap-4">
        <div className="flex gap-4">
          <SearchBarServices onSearch={setSearchQuery} />
        </div>
        <FiltersBarServices />
      </div>

      {/* Service Request Table - Full Width */}
      <div className="dashboard-section">
        <ServiceRequestTable
          requests={visibleRequests}
          onViewClick={handleViewRequest}
          onAssignClick={handleAssignClick}
        />
      </div>

      {/* Request Queue Below Table */}
      <div className="dashboard-section">
        <RequestQueue onRequestClick={handleQueueClick} />
      </div>

      {/* Right Panel: Staff + Stats + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2" />
        <div className="dashboard-section flex flex-col gap-6">
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Staff Panel</h3>
            <RequestStatsCards />
          </div>
          <div>
            <ActivityLog />
          </div>
        </div>
      </div>

      {/* Modals and Drawers */}
      <NewRequestModal isOpen={isNewRequestModalOpen} onClose={() => setIsNewRequestModalOpen(false)} />

      <AssignStaffModal
        isOpen={isAssignStaffModalOpen}
        onClose={() => setIsAssignStaffModalOpen(false)}
        requestId={selectedRequestIdForModal}
      />

      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        requestId={selectedRequestIdForModal}
      />

      <RequestDetailsDrawer
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onAssignClick={() => {
          if (selectedRequestId) {
            setSelectedRequestIdForModal(selectedRequestId);
            setSelectedRequestId(null); // Close drawer
            setIsAssignStaffModalOpen(true);
          }
        }}
        onAddNoteClick={() => {
          if (selectedRequestId) {
            setSelectedRequestIdForModal(selectedRequestId);
            setSelectedRequestId(null); // Close drawer
            setIsAddNoteModalOpen(true);
          }
        }}
      />
    </div>
  );
}
