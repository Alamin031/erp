"use client";

import { useEffect, useState } from "react";
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
  const { setRequests, setStaff, setFilters, getStats } = useGuestServices();
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
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
  }, []);

  const handleAssignClick = (requestId: string) => {
    setSelectedRequestIdForModal(requestId);
    setIsAssignStaffModalOpen(true);
  };

  const handleAddNoteClick = () => {
    setIsAddNoteModalOpen(true);
  };

  const stats = getStats();

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dashboard-section">
          <div className="stat-label">Open Requests</div>
          <div className="stat-value text-primary">{stats.openRequests}</div>
          <div className="stat-change text-xs">Awaiting assignment</div>
        </div>
        <div className="dashboard-section">
          <div className="stat-label">In Progress</div>
          <div className="stat-value text-warning">{stats.inProgress}</div>
          <div className="stat-change text-xs">Being processed</div>
        </div>
        <div className="dashboard-section">
          <div className="stat-label">Resolved Today</div>
          <div className="stat-value text-success">{stats.resolvedToday}</div>
          <div className="stat-change text-xs">Completed requests</div>
        </div>
        <div className="dashboard-section">
          <div className="stat-label">Avg Response Time</div>
          <div className="stat-value text-primary">{stats.avgResponseTime}</div>
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

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Request Queue */}
        <div className="dashboard-section">
          <RequestQueue onRequestClick={(id) => {}} />
        </div>

        {/* Center: Service Request Table */}
        <div className="lg:col-span-2 dashboard-section">
          <ServiceRequestTable
            onViewClick={(id) => {}}
            onAssignClick={handleAssignClick}
          />
        </div>
      </div>

      {/* Right Panel: Staff + Stats + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:col-span-3">
        <div className="lg:col-span-2" />
        <div className="dashboard-section flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Staff Panel</h3>
            <RequestStatsCards />
          </div>
          <div>
            <ActivityLog />
          </div>
        </div>
      </div>

      {/* Modals and Drawers */}
      <NewRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
      />

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
    </div>
  );
}
