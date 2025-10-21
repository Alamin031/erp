"use client";

import { useState } from "react";
import { Rate } from "@/types/rates";
import { useRates } from "@/store/useRates";

interface RateCalendarViewProps {
  rates: Rate[];
  onDateClick?: (date: Date, roomType: string) => void;
}

export function RateCalendarView({ rates, onDateClick }: RateCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1));
  const { getEffectiveRate } = useRates();

  const roomTypes = [...new Set(rates.map((r) => r.roomType))].sort();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getColorForPrice = (price: number, min: number, max: number) => {
    const range = max - min;
    const position = (price - min) / range;

    if (position < 0.33) return "#dbeafe";
    if (position < 0.66) return "#fef3c7";
    return "#fecaca";
  };

  const month = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
            Rate Calendar - {month}
          </h3>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handlePrevMonth}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "500",
                color: "var(--primary)",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ← Prev
            </button>
            <button
              onClick={handleNextMonth}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "500",
                color: "var(--primary)",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {roomTypes.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            {roomTypes.map((roomType) => {
              const pricesForType = days.map((day) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                return getEffectiveRate(roomType, date, "All");
              });

              const minPrice = Math.min(...pricesForType);
              const maxPrice = Math.max(...pricesForType);

              return (
                <div key={roomType} style={{ marginBottom: "24px" }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "var(--secondary)" }}>
                    {roomType}
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "var(--secondary)",
                          background: "var(--background)",
                          borderRadius: "4px",
                        }}
                      >
                        {day}
                      </div>
                    ))}

                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {days.map((day) => {
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const price = getEffectiveRate(roomType, date, "All");
                      const bgColor = getColorForPrice(price, minPrice, maxPrice);

                      return (
                        <div
                          key={day}
                          onClick={() => onDateClick?.(date, roomType)}
                          style={{
                            padding: "12px 8px",
                            textAlign: "center",
                            fontSize: "11px",
                            background: bgColor,
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          title={`${roomType} - ${date.toLocaleDateString()}: $${price.toFixed(2)}`}
                        >
                          <div style={{ fontWeight: "600", color: "var(--foreground)", marginBottom: "4px" }}>
                            {day}
                          </div>
                          <div style={{ fontSize: "10px", color: "var(--foreground)" }}>
                            ${price.toFixed(0)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
          Legend
        </h4>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{ width: "20px", height: "20px", background: "#dbeafe", borderRadius: "4px", border: "1px solid var(--border)" }}
            />
            <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Low Price</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{ width: "20px", height: "20px", background: "#fef3c7", borderRadius: "4px", border: "1px solid var(--border)" }}
            />
            <span style={{ fontSize: "12px", color: "var(--secondary)" }}>Medium Price</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{ width: "20px", height: "20px", background: "#fecaca", borderRadius: "4px", border: "1px solid var(--border)" }}
            />
            <span style={{ fontSize: "12px", color: "var(--secondary)" }}>High Price</span>
          </div>
        </div>
      </div>
    </div>
  );
}
