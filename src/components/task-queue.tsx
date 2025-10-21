"use client";

import { Task, HousekeepingStaff } from "@/types/task";
import { motion } from "framer-motion";

interface TaskQueueProps {
  tasks: Task[];
  staff: HousekeepingStaff[];
  onAddTask?: () => void;
  onTaskClick?: (task: Task) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
}

export function TaskQueue({
  tasks,
  staff,
  onAddTask,
  onTaskClick,
  onStatusChange,
}: TaskQueueProps) {
  const pendingTasks = tasks.filter(t => t.status === "Pending");
  const inProgressTasks = tasks.filter(t => t.status === "In Progress");
  const completedTasks = tasks.filter(t => t.status === "Completed");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "var(--danger)";
      case "Medium":
        return "var(--warning)";
      case "Low":
        return "var(--success)";
      default:
        return "var(--secondary)";
    }
  };

  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || "Unassigned";
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <motion.div
      layoutId={task.id}
      onClick={() => onTaskClick?.(task)}
      whileHover={{ y: -2 }}
      style={{
        padding: "12px",
        background: "var(--background)",
        border: `2px solid ${getPriorityColor(task.priority)}40`,
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            background: "var(--primary)",
            color: "white",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          Room {task.roomNumber}
        </span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: "600",
            color: getPriorityColor(task.priority),
            background: `${getPriorityColor(task.priority)}20`,
            padding: "2px 6px",
            borderRadius: "3px",
          }}
        >
          {task.priority}
        </span>
      </div>

      <p style={{ margin: "0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
        {task.taskType}
      </p>

      <p style={{ margin: "0", fontSize: "12px", color: "var(--secondary)" }}>
        {task.description.substring(0, 40)}...
      </p>

      <div
        style={{
          fontSize: "11px",
          color: "var(--secondary)",
          paddingTop: "8px",
          borderTop: "1px solid var(--border)",
        }}
      >
        {getStaffName(task.assignedStaffId)}
      </div>
    </motion.div>
  );

  const Column = ({
    title,
    taskList,
    color,
  }: {
    title: string;
    taskList: Task[];
    color: string;
  }) => (
    <div
      style={{
        flex: 1,
        minWidth: "300px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          background: color,
          borderRadius: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "white" }}>
          {title}
        </h3>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "white",
            background: "rgba(255,255,255,0.3)",
            padding: "2px 8px",
            borderRadius: "3px",
          }}
        >
          {taskList.length}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          minHeight: "300px",
          padding: "12px",
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
        }}
      >
        {taskList.length > 0 ? (
          taskList.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              color: "var(--secondary)",
              fontSize: "13px",
              textAlign: "center",
            }}
          >
            No tasks
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "var(--foreground)" }}>
          Task Queue
        </h2>
        <button onClick={onAddTask} className="btn btn-primary">
          + Add New Task
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}
      >
        <Column title="Pending" taskList={pendingTasks} color="#ffc107" />
        <Column title="In Progress" taskList={inProgressTasks} color="#0066cc" />
        <Column title="Completed" taskList={completedTasks} color="#28a745" />
      </div>
    </div>
  );
}
