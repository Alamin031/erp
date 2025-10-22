"use client";

import { useEffect, useState } from "react";
import { useUsers } from "@/store/useUsers";
import { ExtendedUser } from "@/types/admin";
import { useToast } from "@/components/toast";

import { UserKPICards } from "@/components/Users/UserKPICards";
import { SearchBar } from "@/components/Users/SearchBar";
import { FiltersBar } from "@/components/Users/FiltersBar";
import { UsersTable } from "@/components/Users/UsersTable";
import { NewUserModal } from "@/components/Users/NewUserModal";
import { InviteUserModal } from "@/components/Users/InviteUserModal";
import { EditUserModal } from "@/components/Users/EditUserModal";
import { UserProfileDrawer } from "@/components/Users/UserProfileDrawer";
import { RolesPermissionsPanel } from "@/components/Users/RolesPermissionsPanel";
import { PermissionMatrix } from "@/components/Users/PermissionMatrix";
import { GroupsPanel } from "@/components/Users/GroupsPanel";
import { UserActivityLog } from "@/components/Users/UserActivityLog";

export function UsersPageClient() {
  const {
    users,
    pagination,
    loadDemoData,
    getFilteredUsers,
    setPagination,
    setSelectedUserId,
    selectedUserId,
    resetPassword,
    impersonateUser,
  } = useUsers();

  const { showToast } = useToast();

  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Load demo data on mount
  useEffect(() => {
    if (users.length === 0) {
      loadDemoData().catch(() => showToast("Failed to load demo data", "error"));
    }
  }, [users.length, loadDemoData, showToast]);

  // Get filtered and paginated users
  const filteredUsers = getFilteredUsers();
  const totalPages = Math.ceil(filteredUsers.length / pagination.pageSize) || 1;
  const start = (pagination.page - 1) * pagination.pageSize;
  const pageUsers = filteredUsers.slice(start, start + pagination.pageSize);

  // Get selected user for edit modal
  const selectedUser =
    selectedUserId && isEditModalOpen ? users.find((u) => u.id === selectedUserId) || null : null;

  // Modal handlers
  const handleView = (id: string) => {
    setSelectedUserId(id);
    setIsProfileDrawerOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setIsEditModalOpen(true);
  };

  const handleResetPassword = (id: string) => {
    if (confirm("Send password reset email to this user?")) {
      resetPassword(id);
      showToast("Password reset email sent", "success");
    }
  };

  const handleImpersonate = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      if (confirm(`Impersonate ${user.name}? You'll be logged in as this user.`)) {
        impersonateUser(id);
        showToast(`Impersonating ${user.name} (simulated)`, "info");
      }
    }
  };

  const closeAllModals = () => {
    setIsNewModalOpen(false);
    setIsInviteModalOpen(false);
    setIsEditModalOpen(false);
    setIsProfileDrawerOpen(false);
    setSelectedUserId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <UserKPICards />

      {/* Header with Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-secondary text-sm mt-1">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-primary" onClick={() => setIsNewModalOpen(true)}>
            + New User
          </button>
          <button className="btn btn-secondary" onClick={() => setIsInviteModalOpen(true)}>
            📧 Invite User
          </button>
          <button
            className={`btn ${showAdminPanel ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setShowAdminPanel(!showAdminPanel)}
          >
            ⚙️ Admin Panel
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="dashboard-section">
        <div className="flex flex-col gap-4">
          <SearchBar />
          <FiltersBar />
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        users={pageUsers}
        pagination={pagination}
        onPaginationChange={(page, pageSize) => setPagination(page, pageSize)}
        onView={handleView}
        onEdit={handleEdit}
        onResetPassword={handleResetPassword}
        onImpersonate={handleImpersonate}
        onDeactivate={() => {}}
        onDelete={() => {}}
      />

      {/* Admin Panel */}
      {showAdminPanel && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <RolesPermissionsPanel />
          </div>
          <div className="lg:col-span-1">
            <GroupsPanel />
          </div>
          <div className="lg:col-span-1">
            <div className="dashboard-section">
              <h3 className="section-title">Activity Log</h3>
              <UserActivityLog limit={10} />
            </div>
          </div>
        </div>
      )}

      {/* Permission Matrix (Advanced) */}
      {showAdminPanel && (
        <div>
          <PermissionMatrix />
        </div>
      )}

      {/* Activity Log Section (if not in admin panel) */}
      {!showAdminPanel && (
        <div className="dashboard-section">
          <h3 className="section-title">Recent Activity</h3>
          <UserActivityLog limit={10} />
        </div>
      )}

      {/* Modals */}
      <NewUserModal isOpen={isNewModalOpen} onClose={closeAllModals} />

      <InviteUserModal isOpen={isInviteModalOpen} onClose={closeAllModals} />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={closeAllModals}
        user={selectedUser}
      />

      <UserProfileDrawer
        userId={selectedUserId}
        isOpen={isProfileDrawerOpen}
        onClose={closeAllModals}
        onEdit={() => {
          setIsProfileDrawerOpen(false);
          setIsEditModalOpen(true);
        }}
        onResetPassword={() => {
          if (selectedUserId) handleResetPassword(selectedUserId);
          setIsProfileDrawerOpen(false);
        }}
        onImpersonate={() => {
          if (selectedUserId) handleImpersonate(selectedUserId);
          setIsProfileDrawerOpen(false);
        }}
      />
    </div>
  );
}
