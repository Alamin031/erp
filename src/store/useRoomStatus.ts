import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Room, RoomFilters } from "@/types/room";

interface RoomStatusStore {
  rooms: Room[];
  filters: RoomFilters;
  selectedRoom: Room | null;
  setRooms: (rooms: Room[]) => void;
  setFilters: (filters: RoomFilters) => void;
  setSelectedRoom: (room: Room | null) => void;
  markClean: (roomId: string) => void;
  setMaintenance: (roomId: string, issue: string, assignedTo?: string) => void;
  checkOut: (roomId: string) => void;
  updateStatus: (roomId: string, status: string) => void;
  getFloorRooms: (floorNo: number) => Room[];
  getFilteredRooms: () => Room[];
  getMaintenanceQueue: () => Room[];
  getRoomStats: () => {
    total: number;
    occupied: number;
    vacant: number;
    needsCleaning: number;
    underMaintenance: number;
  };
}

export const useRoomStatus = create<RoomStatusStore>()(
  persist(
    (set, get) => ({
      rooms: [],
      filters: {
        status: "",
        floor: "",
        roomType: "",
        searchQuery: "",
        dateFrom: "",
        dateTo: "",
      },
      selectedRoom: null,

      setRooms: (rooms) => set({ rooms }),

      setFilters: (filters) => set({ filters }),

      setSelectedRoom: (room) => set({ selectedRoom: room }),

      markClean: (roomId) => {
        set(state => ({
          rooms: state.rooms.map(r =>
            r.id === roomId
              ? {
                  ...r,
                  status: "Clean" as const,
                  lastCleaned: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      setMaintenance: (roomId, issue, assignedTo) => {
        set(state => ({
          rooms: state.rooms.map(r =>
            r.id === roomId
              ? {
                  ...r,
                  status: "Under Maintenance" as const,
                  maintenanceStatus: {
                    issue,
                    assignedTo,
                    eta: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                    status: "Pending" as const,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      checkOut: (roomId) => {
        set(state => ({
          rooms: state.rooms.map(r =>
            r.id === roomId
              ? {
                  ...r,
                  status: "Needs Cleaning" as const,
                  currentGuest: undefined,
                  updatedAt: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      updateStatus: (roomId, status) => {
        set(state => ({
          rooms: state.rooms.map(r =>
            r.id === roomId
              ? {
                  ...r,
                  status: status as any,
                  updatedAt: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      getFloorRooms: (floorNo) => {
        return get().rooms.filter(r => r.floor === floorNo);
      },

      getFilteredRooms: () => {
        const { rooms, filters } = get();
        let filtered = rooms;

        if (filters.status) {
          filtered = filtered.filter(r => r.status === filters.status);
        }

        if (filters.floor) {
          filtered = filtered.filter(r => r.floor === filters.floor);
        }

        if (filters.roomType) {
          filtered = filtered.filter(r => r.type === filters.roomType);
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            r =>
              r.roomNumber.toLowerCase().includes(query) ||
              r.currentGuest?.name.toLowerCase().includes(query)
          );
        }

        return filtered;
      },

      getMaintenanceQueue: () => {
        return get().rooms.filter(r => r.status === "Under Maintenance");
      },

      getRoomStats: () => {
        const rooms = get().rooms;
        return {
          total: rooms.length,
          occupied: rooms.filter(r => r.status === "Occupied").length,
          vacant: rooms.filter(r => r.status === "Clean").length,
          needsCleaning: rooms.filter(r => r.status === "Needs Cleaning").length,
          underMaintenance: rooms.filter(r => r.status === "Under Maintenance").length,
        };
      },
    }),
    {
      name: "room-status-store",
    }
  )
);
