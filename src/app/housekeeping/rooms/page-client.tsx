"use client";

import { useEffect, useState } from "react";
import { Room, RoomFilters } from "@/types/room";
import { useRoomStatus } from "@/store/useRoomStatus";
import { MOCK_ROOMS } from "@/lib/mock-rooms";
import { RoomKPICards } from "@/components/room-kpi-cards";
import { FloorTabs } from "@/components/floor-tabs";
import { RoomFilterBar } from "@/components/room-filter-bar";
import { RoomStatusMatrix } from "@/components/room-status-matrix";
import { OccupancyChart } from "@/components/occupancy-chart";
import { CleanlinessChart } from "@/components/cleanliness-chart";
import { MaintenanceQueue } from "@/components/maintenance-queue";
import { QuickActions } from "@/components/quick-actions";
import { RoomLegend } from "@/components/room-legend";
import { PaginationControls } from "@/components/pagination-controls";
import { RoomDetailsModal } from "@/components/room-details-modal";
import { useToast } from "@/components/toast";

export function HousekeepingRoomsPageClient() {
  const {
    rooms,
    filters,
    selectedRoom,
    setRooms,
    setFilters,
    setSelectedRoom,
    getRoomStats,
    getFloorRooms,
  } = useRoomStatus();

  const [activeFloor, setActiveFloor] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { showToast } = useToast();

  useEffect(() => {
    if (rooms.length === 0) {
      setRooms(MOCK_ROOMS);
    }
  }, []);

  const stats = getRoomStats();

  const getDisplayRooms = () => {
    let displayRooms = rooms;

    if (filters.status) {
      displayRooms = displayRooms.filter(r => r.status === filters.status);
    }

    if (filters.floor) {
      displayRooms = displayRooms.filter(r => r.floor === filters.floor);
    }

    if (filters.roomType) {
      displayRooms = displayRooms.filter(r => r.type === filters.roomType);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      displayRooms = displayRooms.filter(
        r =>
          r.roomNumber.toLowerCase().includes(query) ||
          r.currentGuest?.name.toLowerCase().includes(query)
      );
    }

    if (activeFloor !== null) {
      displayRooms = displayRooms.filter(r => r.floor === activeFloor);
    }

    return displayRooms;
  };

  const displayRooms = getDisplayRooms();
  const totalPages = Math.ceil(displayRooms.length / itemsPerPage);
  const paginatedRooms = displayRooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort((a, b) => a - b);

  const handleFilterChange = (newFilters: RoomFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    setRooms([...rooms]);
  };

  const handleAddTask = () => {
    showToast("Add maintenance task feature coming soon", "info");
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Room Status Management</h1>
          <p className="dashboard-subtitle">Monitor room occupancy and cleanliness in real-time</p>
        </div>

        <RoomKPICards
          total={stats.total}
          occupied={stats.occupied}
          vacant={stats.vacant}
          needsCleaning={stats.needsCleaning}
          underMaintenance={stats.underMaintenance}
        />

        <div style={{ marginBottom: "24px" }}>
          <QuickActions onRefresh={handleRefresh} onAddTask={handleAddTask} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
            Floor View
          </h3>
          <FloorTabs
            floors={floors}
            activeFloor={activeFloor}
            onFloorChange={setActiveFloor}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <RoomFilterBar rooms={rooms} onFilterChange={handleFilterChange} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <RoomLegend />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <div>
            <OccupancyChart rooms={displayRooms} />
          </div>
          <div>
            <CleanlinessChart rooms={displayRooms} />
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
            Room Matrix
          </h3>
          <RoomStatusMatrix
            rooms={paginatedRooms}
            onRoomClick={handleRoomClick}
            itemsPerRow={10}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={displayRooms.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <MaintenanceQueue rooms={displayRooms} onRefresh={handleRefresh} />
        </div>
      </div>

      <RoomDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRoom(null);
        }}
        room={selectedRoom}
        onRefresh={handleRefresh}
      />
    </>
  );
}
