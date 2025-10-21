"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { motion } from "framer-motion";

interface CalendarViewProps {
  tasks: Task[];
  onAddTask?: (date: string) => void;
}

export function CalendarView({ tasks, onAddTask }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
          {monthName}
        </h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handlePrevMonth}
            style={{
              padding: "6px 12px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            ← Prev
          </button>
          <button
            onClick={handleNextMonth}
            style={{
              padding: "6px 12px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Next →
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div
            key={day}
            style={{
              padding: "8px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--secondary)",
            }}
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dayTasks = day ? getTasksForDate(day) : [];
          const dateStr = day
            ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : "";

          return (
            <motion.div
              key={index}
              whileHover={day ? { scale: 1.05 } : {}}
              style={{
                minHeight: "80px",
                padding: "8px",
                background: day ? "var(--background)" : "transparent",
                border: day ? "1px solid var(--border)" : "none",
                borderRadius: "6px",
                cursor: day ? "pointer" : "default",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
              onClick={() => day && onAddTask?.(dateStr)}
            >
              {day && (
                <>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--foreground)" }}>
                    {day}
                  </span>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                    {dayTasks.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        style={{
                          fontSize: "10px",
                          padding: "2px 4px",
                          background: "var(--primary)",
                          color: "white",
                          borderRadius: "2px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={task.description}
                      >
                        R{task.roomNumber}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div style={{ fontSize: "10px", color: "var(--secondary)" }}>
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
