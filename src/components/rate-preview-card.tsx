"use client";

import { Rate, RateRule } from "@/types/rates";

interface RatePreviewCardProps {
  rate: Rate;
  rules: RateRule[];
  date?: Date;
  channel?: string;
  occupancy?: number;
  lengthOfStay?: number;
  leadTime?: number;
  calculatedPrice?: number;
}

export function RatePreviewCard({
  rate,
  rules,
  date = new Date(),
  channel = "All",
  occupancy = 70,
  lengthOfStay = 1,
  leadTime = 14,
  calculatedPrice,
}: RatePreviewCardProps) {
  const applicableRules = rules.filter((r) => rate.rules?.includes(r.id));

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px" }}>
      <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
        Price Breakdown
      </h3>

      <div style={{ fontSize: "12px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ color: "var(--secondary)" }}>Rate</span>
          <span style={{ fontWeight: "600", color: "var(--foreground)" }}>{rate.name}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "var(--secondary)" }}>Date</span>
          <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
            {date.toLocaleDateString()}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "var(--secondary)" }}>Channel</span>
          <span style={{ fontWeight: "600", color: "var(--foreground)" }}>{channel}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ color: "var(--secondary)" }}>Base Price</span>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)" }}>
            ${rate.basePrice.toFixed(2)}
          </span>
        </div>

        {applicableRules.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--secondary)", marginBottom: "8px", textTransform: "uppercase" }}>
              Applied Rules
            </div>
            {applicableRules.map((rule) => (
              <div
                key={rule.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  padding: "6px",
                  background: "var(--background)",
                  borderRadius: "4px",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "var(--secondary)" }}>{rule.name}</span>
                <span
                  style={{
                    fontWeight: "600",
                    color: ["percentage_increase", "fixed_surcharge"].includes(rule.operator)
                      ? "#059669"
                      : "#dc3545",
                  }}
                >
                  {["percentage_increase", "fixed_surcharge"].includes(rule.operator) ? "+" : "-"}
                  {rule.operator === "percentage_increase" || rule.operator === "percentage_decrease"
                    ? `${rule.value}%`
                    : `$${rule.value.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "2px solid var(--border)" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>Final Price</span>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--primary)" }}>
            ${(calculatedPrice || rate.basePrice).toFixed(2)}
          </span>
        </div>
      </div>

      <div style={{ fontSize: "11px", color: "var(--secondary)", padding: "8px", background: "var(--background)", borderRadius: "4px" }}>
        <p style={{ margin: "0 0 4px 0" }}>
          <strong>Context:</strong> Occupancy {occupancy}%, {lengthOfStay}-night stay, {leadTime}-day advance
        </p>
      </div>
    </div>
  );
}
