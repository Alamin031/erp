"use client";

import { useState, useMemo } from "react";
import { Task, HousekeepingStaff, ActivityLog } from "@/types/task";
import { mockTasks, mockStaff, mockActivityLogs, mockRoomStatuses } from "@/lib/mock-tasks";
import { TaskStatsCards } from "@/components/task-stats-cards";
import { TaskQueue } from "@/components/task-queue";
import { TaskModal } from "@/components/task-modal";
import { TaskDetailsModal } from "@/components/task-details-modal";
import { StaffPerformanceModal } from "@/components/staff-performance-modal";
import { FilterBar, FilterOptions } from "@/components/task-filter-bar";
import { TaskTable } from "@/components/task-table";
import { RoomStatusGrid } from "@/components/room-status-grid";
import { RecentActivity } from "@/components/recent-activity";
import { StaffList } from "@/components/staff-list";
import { StaffPerformanceChart } from "@/components/staff-performance-chart";
import { TaskPriorityChart } from "@/components/task-priority-chart";
import { CalendarView } from "@/components/calendar-view";
import { ToastContainer, useToast } from "@/components/toast";

export function HousekeepingPageClient() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<HousekeepingStaff | null>(null);
  const [prefilledRoom, setPrefilledRoom] = useState<string>("");
  const [filters, setFilters] = useState<FilterOptions>({
    status: "",
    priority: "",
    taskType: "",
    assignedStaffId: "",
    dateFrom: "",
    dateTo: "",
  });
  const [activeTab, setActiveTab] = useState<"queue" | "table" | "rooms" | "calendar" | "performance">("queue");
  const { showToast } = useToast();
  const { toasts, removeToast } = useToast();

  const handleAddTask = () => {
    setSelectedTask(null);
    setPrefilledRoom("");
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = (data: any) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      roomNumber: data.roomNumber,
      taskType: data.taskType,
      assignedStaffId: data.assignedStaffId,
      priority: data.priority,
      description: data.description,
      dueDate: data.dueDate,
      dueTime: data.dueTime,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [...prev, newTask]);

    const activity: ActivityLog = {
      id: `log-${Date.now()}`,
      taskId: newTask.id,
      action: "created",
      staffId: "staff-0",
      staffName: "Admin",
      roomNumber: newTask.roomNumber,
      timestamp: new Date().toISOString(),
      details: `Task created for ${newTask.taskType}`,
    };
    setActivityLogs(prev => [activity, ...prev]);

    showToast("Task created successfully", "success");
    setIsTaskModalOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleMarkComplete = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: "Completed", completedAt: new Date().toISOString() }
          : t
      )
    );

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const activity: ActivityLog = {
        id: `log-${Date.now()}`,
        taskId: taskId,
        action: "completed",
        staffId: task.assignedStaffId,
        staffName: mockStaff.find(s => s.id === task.assignedStaffId)?.name || "Unknown",
        roomNumber: task.roomNumber,
        timestamp: new Date().toISOString(),
        details: `Room ${task.roomNumber} marked as complete`,
      };
      setActivityLogs(prev => [activity, ...prev]);
    }
  };

  const handleReopen = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: "Pending", completedAt: undefined }
          : t
      )
    );

    const activity: ActivityLog = {
      id: `log-${Date.now()}`,
      taskId: taskId,
      action: "reopened",
      staffId: "staff-0",
      staffName: "Admin",
      roomNumber: tasks.find(t => t.id === taskId)?.roomNumber || "",
      timestamp: new Date().toISOString(),
      details: "Task reopened",
    };
    setActivityLogs(prev => [activity, ...prev]);
  };

  const handleRoomClick = (roomNumber: string) => {
    setPrefilledRoom(roomNumber);
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleAddTaskFromDate = (date: string) => {
    setSelectedTask(null);
    setPrefilledRoom("");
    setIsTaskModalOpen(true);
  };

  const handleViewPerformance = (staffId: string) => {
    const staff = mockStaff.find(s => s.id === staffId);
    if (staff) {
      setSelectedStaff(staff);
      setIsPerformanceModalOpen(true);
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">Housekeeping Management</h1>
          <p className="dashboard-subtitle">Manage cleaning tasks and staff performance</p>
        </div>

        <TaskStatsCards tasks={tasks} />

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "queue" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("queue")}
              >
                Task Queue
              </button>
              <button
                className={`tab ${activeTab === "table" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("table")}
              >
                Task List
              </button>
              <button
                className={`tab ${activeTab === "rooms" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("rooms")}
              >
                Room Status
              </button>
              <button
                className={`tab ${activeTab === "calendar" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("calendar")}
              >
                Calendar
              </button>
              <button
                className={`tab ${activeTab === "performance" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("performance")}
              >
                Analytics
              </button>
            </div>

            {activeTab === "queue" && (
              <div style={{ marginTop: "24px" }}>
                <TaskQueue
                  tasks={tasks}
                  staff={mockStaff}
                  onAddTask={handleAddTask}
                  onTaskClick={handleTaskClick}
                />
              </div>
            )}

            {activeTab === "table" && (
              <div style={{ marginTop: "24px" }}>
                <FilterBar
                  tasks={tasks}
                  staff={mockStaff}
                  onFilterChange={setFilters}
                />
                <div style={{ marginTop: "24px" }}>
                  <TaskTable
                    tasks={tasks}
                    staff={mockStaff}
                    filters={filters}
                    onTaskClick={handleTaskClick}
                  />
                </div>
              </div>
            )}

            {activeTab === "rooms" && (
              <div style={{ marginTop: "24px" }}>
                <h2 className="section-title">Room Status Overview</h2>
                <RoomStatusGrid rooms={mockRoomStatuses} onRoomClick={handleRoomClick} />
              </div>
            )}

            {activeTab === "calendar" && (
              <div style={{ marginTop: "24px" }}>
                <CalendarView tasks={tasks} onAddTask={handleAddTaskFromDate} />
              </div>
            )}

            {activeTab === "performance" && (
              <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <StaffPerformanceChart staff={mockStaff} />
                <TaskPriorityChart tasks={tasks} />
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-grid" style={{ marginTop: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div className="dashboard-section">
              <RecentActivity activities={activityLogs} />
            </div>

            <div className="dashboard-section">
              <StaffList staff={mockStaff} onViewPerformance={handleViewPerformance} />
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        staff={mockStaff}
        task={selectedTask}
        prefilledRoom={prefilledRoom}
        onSubmit={handleTaskSubmit}
      />

      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={selectedTask}
        staff={mockStaff}
        onMarkComplete={handleMarkComplete}
        onReopen={handleReopen}
      />

      <StaffPerformanceModal
        isOpen={isPerformanceModalOpen}
        onClose={() => setIsPerformanceModalOpen(false)}
        staff={selectedStaff}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
