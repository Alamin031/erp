"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ServiceRequest, Staff, Priority, RequestStatus, GuestServicesFilters, RequestStats } from "@/types/guest-services";

interface GuestServicesStore {
  requests: ServiceRequest[];
  staff: Staff[];
  filters: GuestServicesFilters;
  selectedRequestId: string | null;
  pagination: {
    page: number;
    pageSize: number;
  };
  activityLog: Array<{ timestamp: string; message: string; staffName: string }>;

  // Actions
  setRequests: (requests: ServiceRequest[]) => void;
  setStaff: (staff: Staff[]) => void;
  setFilters: (filters: GuestServicesFilters) => void;
  setPagination: (page: number, pageSize: number) => void;
  setSelectedRequestId: (id: string | null) => void;
  addRequest: (request: Omit<ServiceRequest, "id" | "activityLog">) => void;
  assignRequest: (requestId: string, staffIds: string[]) => void;
  startRequest: (requestId: string, staffId: string) => void;
  resolveRequest: (requestId: string, resolutionNote: string) => void;
  updatePriority: (requestId: string, priority: Priority) => void;
  addNote: (requestId: string, note: string, staffName: string) => void;
  deleteRequest: (requestId: string) => void;
  bulkAssign: (requestIds: string[], staffId: string) => void;
  getFilteredRequests: () => ServiceRequest[];
  getQueue: () => ServiceRequest[];
  getStats: () => RequestStats;
}

export const useGuestServices = create<GuestServicesStore>()(
  persist(
    (set, get) => ({
      requests: [],
      staff: [],
      filters: {
        status: "All",
        priority: "All",
        serviceType: "All",
        assignedStaff: "All",
        dateFrom: "",
        dateTo: "",
      },
      selectedRequestId: null,
      pagination: {
        page: 1,
        pageSize: 10,
      },
      activityLog: [],

      setRequests: (requests) => set({ requests }),

      setStaff: (staff) => set({ staff }),

      setFilters: (filters) => set({ filters }),

      setPagination: (page, pageSize) => set({ pagination: { page, pageSize } }),

      setSelectedRequestId: (id) => set({ selectedRequestId: id }),

      addRequest: (request) => {
        const newRequest: ServiceRequest = {
          ...request,
          id: `REQ-${Date.now()}`,
          activityLog: [
            {
              id: "1",
              timestamp: new Date().toISOString(),
              action: "created",
              performedBy: "System",
            },
          ],
        };
        set((state) => ({
          requests: [newRequest, ...state.requests],
          activityLog: [
            ...state.activityLog,
            {
              timestamp: new Date().toISOString(),
              message: `New request #${newRequest.id} from ${request.guestName} (Room ${request.roomNumber})`,
              staffName: "System",
            },
          ],
        }));
      },

      assignRequest: (requestId, staffIds) => {
        set((state) => {
          const staffNames = state.staff
            .filter((s) => staffIds.includes(s.id))
            .map((s) => s.name)
            .join(", ");

          return {
            requests: state.requests.map((r) =>
              r.id === requestId
                ? {
                    ...r,
                    assignedStaffIds: staffIds,
                    activityLog: [
                      ...r.activityLog,
                      {
                        id: `${r.activityLog.length + 1}`,
                        timestamp: new Date().toISOString(),
                        action: "assigned",
                        performedBy: "Staff",
                        details: staffNames,
                      },
                    ],
                  }
                : r
            ),
            activityLog: [
              ...state.activityLog,
              {
                timestamp: new Date().toISOString(),
                message: `Request #${requestId} assigned to ${staffNames}`,
                staffName: "System",
              },
            ],
          };
        });
      },

      startRequest: (requestId, staffId) => {
        set((state) => {
          const staff = state.staff.find((s) => s.id === staffId);
          return {
            requests: state.requests.map((r) =>
              r.id === requestId
                ? {
                    ...r,
                    status: "In Progress" as RequestStatus,
                    activityLog: [
                      ...r.activityLog,
                      {
                        id: `${r.activityLog.length + 1}`,
                        timestamp: new Date().toISOString(),
                        action: "started",
                        performedBy: staff?.name || "Unknown",
                      },
                    ],
                  }
                : r
            ),
            activityLog: [
              ...state.activityLog,
              {
                timestamp: new Date().toISOString(),
                message: `Request #${requestId} marked as In Progress`,
                staffName: staff?.name || "Unknown",
              },
            ],
          };
        });
      },

      resolveRequest: (requestId, resolutionNote) => {
        set((state) => {
          return {
            requests: state.requests.map((r) =>
              r.id === requestId
                ? {
                    ...r,
                    status: "Resolved" as RequestStatus,
                    completedAt: new Date().toISOString(),
                    notes: resolutionNote || r.notes,
                    activityLog: [
                      ...r.activityLog,
                      {
                        id: `${r.activityLog.length + 1}`,
                        timestamp: new Date().toISOString(),
                        action: "resolved",
                        performedBy: "Staff",
                        details: resolutionNote,
                      },
                    ],
                  }
                : r
            ),
            activityLog: [
              ...state.activityLog,
              {
                timestamp: new Date().toISOString(),
                message: `Request #${requestId} marked as Resolved`,
                staffName: "Staff",
              },
            ],
          };
        });
      },

      updatePriority: (requestId, priority) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  priority,
                  activityLog: [
                    ...r.activityLog,
                    {
                      id: `${r.activityLog.length + 1}`,
                      timestamp: new Date().toISOString(),
                      action: "priority_changed",
                      performedBy: "Staff",
                      details: priority,
                    },
                  ],
                }
              : r
          ),
        }));
      },

      addNote: (requestId, note, staffName) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  activityLog: [
                    ...r.activityLog,
                    {
                      id: `${r.activityLog.length + 1}`,
                      timestamp: new Date().toISOString(),
                      action: "note_added",
                      performedBy: staffName,
                      details: note,
                    },
                  ],
                }
              : r
          ),
          activityLog: [
            ...state.activityLog,
            {
              timestamp: new Date().toISOString(),
              message: `Note added to request #${requestId}`,
              staffName,
            },
          ],
        }));
      },

      deleteRequest: (requestId) => {
        set((state) => ({
          requests: state.requests.filter((r) => r.id !== requestId),
          selectedRequestId: state.selectedRequestId === requestId ? null : state.selectedRequestId,
        }));
      },

      bulkAssign: (requestIds, staffId) => {
        set((state) => {
          const staff = state.staff.find((s) => s.id === staffId);
          return {
            requests: state.requests.map((r) =>
              requestIds.includes(r.id)
                ? {
                    ...r,
                    assignedStaffIds: [staffId],
                    activityLog: [
                      ...r.activityLog,
                      {
                        id: `${r.activityLog.length + 1}`,
                        timestamp: new Date().toISOString(),
                        action: "assigned",
                        performedBy: "Bulk",
                        details: staff?.name,
                      },
                    ],
                  }
                : r
            ),
          };
        });
      },

      getFilteredRequests: () => {
        const { requests, filters, pagination } = get();
        let filtered = requests;

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
          filtered = filtered.filter(
            (r) => new Date(r.requestedAt) >= new Date(filters.dateFrom)
          );
        }

        if (filters.dateTo) {
          filtered = filtered.filter(
            (r) => new Date(r.requestedAt) <= new Date(filters.dateTo)
          );
        }

        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filtered.slice(start, end);
      },

      getQueue: () => {
        const { requests } = get();
        const priorityOrder = { Urgent: 0, High: 1, Normal: 2, Low: 3 };
        return requests
          .filter((r) => r.status !== "Resolved" && r.status !== "Cancelled")
          .sort((a, b) => {
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
          });
      },

      getStats: () => {
        const { requests } = get();
        const today = new Date().toDateString();

        return {
          openRequests: requests.filter((r) => r.status === "Open").length,
          inProgress: requests.filter((r) => r.status === "In Progress").length,
          resolvedToday: requests.filter(
            (r) =>
              r.status === "Resolved" &&
              r.completedAt &&
              new Date(r.completedAt).toDateString() === today
          ).length,
          avgResponseTime: Math.round(
            requests.reduce((sum, r) => {
              if (r.eta) {
                const diff =
                  new Date(r.eta).getTime() - new Date(r.requestedAt).getTime();
                return sum + diff;
              }
              return sum;
            }, 0) / Math.max(requests.length, 1) / 60000
          ),
        };
      },
    }),
    {
      name: "guest-services-store",
    }
  )
);
