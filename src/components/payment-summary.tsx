"use client";

interface PaymentSummaryProps {
  breakdown: Record<string, number>;
}

export function PaymentSummary({ breakdown }: PaymentSummaryProps) {
  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  const circumference = 2 * Math.PI * 45;

  const data = [
    { label: "Cash", value: breakdown["Cash"] || 0, color: "#28a745" },
    { label: "Card", value: breakdown["Card"] || 0, color: "#0066cc" },
    { label: "Bank Transfer", value: breakdown["Bank Transfer"] || 0, color: "#20c997" },
    { label: "Pending", value: breakdown["Pending"] || 0, color: "#ffc107" },
  ];

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
        Payment Distribution
      </h3>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px" }}>
        <div style={{ position: "relative", width: "120px", height: "120px" }}>
          <svg
            width="120"
            height="120"
            style={{
              transform: "rotate(-90deg)",
            }}
          >
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="8"
            />
            {data.map((item, idx) => {
              const percentage = total > 0 ? item.value / total : 0;
              const offset = data.slice(0, idx).reduce((sum, d) => {
                const dPct = total > 0 ? d.value / total : 0;
                return sum + (dPct * circumference);
              }, 0);
              const value = percentage * circumference;

              return (
                <circle
                  key={item.label}
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={`${value} ${circumference}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)" }}>
              ${total.toFixed(0)}
            </div>
            <div style={{ fontSize: "11px", color: "var(--secondary)" }}>Total</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {data.map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: item.color,
                }}
              />
              <span style={{ fontSize: "13px", color: "var(--foreground)", minWidth: "110px" }}>
                {item.label}
              </span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: item.color, minWidth: "100px", textAlign: "right" }}>
                ${item.value.toFixed(2)}
              </span>
              {total > 0 && (
                <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
                  ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
