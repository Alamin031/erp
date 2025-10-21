import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { ROLE_LABELS } from "@/types/auth";
import type { UserRole } from "@/types/auth";

// Dashboard components for each role
const SuperAdminDashboard = () => (
  <div
    className="dashboard-grid"
    style={{ display: "flex", flexDirection: "column", gap: 24 }}
  >
    {/* top stats - compact 4-column cards */}
    <div
      className="dashboard-top-stats"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        alignItems: "stretch",
      }}
    >
      {[
        {
          label: "Total Properties",
          value: "5",
          change: "+2 this quarter",
        },
        {
          label: "Active Users",
          value: "247",
          change: "+18 this month",
        },
        {
          label: "System Uptime",
          value: "99.98%",
          change: "↑ 0.02% vs last month",
        },
        {
          label: "API Calls",
          value: "2.4M",
          change: "+320K this month",
        },
      ].map((s) => (
        <div
          key={s.label}
          className="stat-card"
          style={{
            background: "#fff",
            padding: 18,
            borderRadius: 10,
            boxShadow: "0 1px 4px rgba(16,24,40,0.04)",
            border: "1px solid #eef2f6",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 84,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#7b8794",
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#1f6feb",
              marginTop: 6,
            }}
          >
            {s.value}
          </div>
          <div style={{ fontSize: 12, color: "#16a34a", marginTop: 6 }}>
            {s.change}
          </div>
        </div>
      ))}
    </div>

    {/* main charts row (donut, bar, area) */}
    <div
      className="dashboard-charts"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1.2fr",
        gap: 20,
        alignItems: "start",
      }}
    >
      {/* Staff applications (donut) */}
      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: 16,
          boxShadow: "0 1px 6px rgba(16,24,40,0.04)",
          border: "1px solid #eef2f6",
        }}
      >
        <div className="card-header" style={{ marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Staff applications</h3>
        </div>
        <div
          className="card-body"
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg
              width="120"
              height="120"
              viewBox="0 0 42 42"
              className="donut"
              style={{ display: "block" }}
            >
              <defs>
                <linearGradient id="g1_dashboard" x1="0" x2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ff6a88" />
                </linearGradient>
              </defs>
              <circle
                cx="21"
                cy="21"
                r="15.9"
                fill="transparent"
                stroke="#f3f4f6"
                strokeWidth="6"
              ></circle>
              <circle
                cx="21"
                cy="21"
                r="15.9"
                fill="transparent"
                stroke="#e6e7ea"
                strokeWidth="6"
                strokeDasharray="60 40"
                transform="rotate(-90 21 21)"
              />
              <circle
                cx="21"
                cy="21"
                r="15.9"
                fill="transparent"
                stroke="url(#g1_dashboard)"
                strokeWidth="6"
                strokeDasharray="60 40"
                strokeDashoffset="20"
                transform="rotate(-90 21 21)"
              />
              <text
                x="21"
                y="22.5"
                textAnchor="middle"
                fontSize="4"
                fontWeight="700"
                fill="#111827"
              >
                200
              </text>
            </svg>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: 140,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 4,
                      background: "#a78bfa",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: "#374151" }}>Pending</span>
                </div>
                <strong style={{ color: "#111827" }}>100</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: 140,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 4,
                      background: "#ff7aa2",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: "#374151" }}>Approved</span>
                </div>
                <strong style={{ color: "#111827" }}>60</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: 140,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 4,
                      background: "#f3f4f6",
                      display: "inline-block",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <span style={{ color: "#374151" }}>Rejected</span>
                </div>
                <strong style={{ color: "#111827" }}>40</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Annual payroll summary (bar) */}
      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: 12,
          boxShadow: "0 1px 6px rgba(16,24,40,0.04)",
          border: "1px solid #eef2f6",
        }}
      >
        <div className="card-header" style={{ marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Annual payroll summary</h3>
        </div>
        <div className="card-body" style={{ padding: 6 }}>
          <svg
            width="100%"
            height="160"
            viewBox="0 0 300 160"
            preserveAspectRatio="none"
          >
            <g transform="translate(30,10)">
              <text x="-10" y="10" fontSize="10" fill="#9ca3af">
                600k
              </text>
              <text x="-10" y="50" fontSize="10" fill="#9ca3af">
                400k
              </text>
              <text x="-10" y="90" fontSize="10" fill="#9ca3af">
                200k
              </text>
              <text x="-10" y="130" fontSize="10" fill="#9ca3af">
                0
              </text>
              <g>
                <rect
                  x="0"
                  y="30"
                  width="22"
                  height="100"
                  rx="4"
                  fill="#ffb86b"
                />
                <rect
                  x="36"
                  y="10"
                  width="22"
                  height="120"
                  rx="4"
                  fill="#7c3aed"
                />
                <rect
                  x="72"
                  y="50"
                  width="22"
                  height="80"
                  rx="4"
                  fill="#f06292"
                />
                <rect
                  x="108"
                  y="0"
                  width="22"
                  height="130"
                  rx="4"
                  fill="#7c3aed"
                />
                <rect
                  x="144"
                  y="40"
                  width="22"
                  height="90"
                  rx="4"
                  fill="#ffb86b"
                />
                <rect
                  x="180"
                  y="20"
                  width="22"
                  height="110"
                  rx="4"
                  fill="#7c3aed"
                />
              </g>
              <g transform="translate(0,140)" fill="#6b7280" fontSize="9">
                <text x="2">30 Sep</text>
                <text x="38">10 Oct</text>
                <text x="74">20 Oct</text>
                <text x="110">30 Oct</text>
                <text x="146">10 Nov</text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Total income (area) */}
      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: 16,
          boxShadow: "0 1px 6px rgba(16,24,40,0.04)",
          border: "1px solid #eef2f6",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="card-header" style={{ marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Total income</h3>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18 }}>$11,800,000.00</div>
            <div style={{ color: "#16a34a", fontSize: 13 }}>
              ▲ 21% vs last month
            </div>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <svg
            width="100%"
            height="160"
            viewBox="0 0 300 160"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGrad2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g transform="translate(0,10)">
              <path
                d="M0,110 C40,85 80,60 120,70 C160,80 200,40 240,30 L300,30 L300,120 L0,120 Z"
                fill="url(#areaGrad2)"
                stroke="none"
              />
              <path
                d="M0,110 C40,85 80,60 120,70 C160,80 200,40 240,30"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2"
              />
              <circle cx="190" cy="62" r="6" fill="#ff6a88" />
              <rect
                x="150"
                y="46"
                rx="6"
                width="90"
                height="28"
                fill="#fff"
                stroke="#eef2f6"
              />
              <text
                x="195"
                y="64"
                fontSize="10"
                textAnchor="middle"
                fill="#cc1f3b"
              >
                $3,400,849
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    {/* --- ADD: three graphs row (Orders / Daily Sales / Avg Order Value) --- */}
    <div
      className="dashboard-three-graphs"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 16,
        marginTop: 8,
      }}
    >
      {/* Orders by channels (list) */}
      <div
        className="card"
        style={{
          padding: 16,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>
          Orders by channels
        </h4>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div style={{ color: "#6b7280" }}>Total</div>
          <div style={{ fontWeight: 700 }}>
            2641{" "}
            <span style={{ color: "#10b981", fontSize: 12, marginLeft: 8 }}>
              ▲ 21%
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
          {/*
            { name: "Uber EATS", percent: 39.4, total: 1080, color: "#111827" },
            { name: "Deliveroo", percent: 28.9, total: 756, color: "#7c3aed" },
            { name: "Website", percent: 25.3, total: 616, color: "#10b981" },
            { name: "Just EAT", percent: 6.4, total: 189, color: "#ffb86b" },
          */}
          {/*
            <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ width: 10, height: 10, borderRadius: 4, background: s.color, display: "inline-block" }} />
                <span style={{ color: "#374151", fontSize: 13 }}>{s.name}</span>
              </div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>{s.percent}% <span style={{ marginLeft: 8, color: "#111827" }}>{s.total}</span></div>
            </div>
          */}
        </div>
      </div>

      {/* Daily Sales (donut) */}
      <div
        className="card"
        style={{
          padding: 16,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h4 style={{ margin: "0 0 12px 0", fontSize: 14 }}>Daily Sales</h4>
        <svg width="160" height="120" viewBox="0 0 120 90">
          <g transform="translate(60,45)">
            <circle r="30" fill="#f3f4f6" />
            <path
              d="M0 -30 A30 30 0 0 1 24 6 L8 10 A18 18 0 0 0 0 -18 Z"
              fill="#10b981"
            />
            <path
              d="M24 6 A30 30 0 0 1 -6 28 L-4 18 A18 18 0 0 0 8 10 Z"
              fill="#7c3aed"
            />
            <path
              d="-6 28 A30 30 0 0 1 -30 -2 L-20 2 A18 18 0 0 0 -4 18 Z"
              fill="#ffb86b"
            />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              fontSize="10"
              fontWeight={700}
              fill="#111827"
            >
              £1,749.69
            </text>
          </g>
        </svg>
        <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span
              style={{
                width: 10,
                height: 10,
                background: "#10b981",
                borderRadius: 3,
              }}
            />
            Uber eats
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span
              style={{
                width: 10,
                height: 10,
                background: "#7c3aed",
                borderRadius: 3,
              }}
            />
            Deliveroo
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span
              style={{
                width: 10,
                height: 10,
                background: "#ffb86b",
                borderRadius: 3,
              }}
            />
            Website
          </div>
        </div>
      </div>

      {/* Average Order Value (area) */}
      <div
        className="card"
        style={{
          padding: 16,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>
          Average Order Value
        </h4>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18 }}>£22</div>
          <div style={{ color: "#10b981", fontSize: 12 }}>▲ 12%</div>
        </div>
        <svg
          width="100%"
          height="60"
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="aovGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g transform="translate(0,0)">
            <path
              d="M0,40 C30,20 60,30 90,18 C120,6 150,24 180,12 L200,12 L200,60 L0,60 Z"
              fill="url(#aovGrad)"
            />
            <path
              d="M0,40 C30,20 60,30 90,18 C120,6 150,24 180,12"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>
    </div>
    {/* --- end added row --- */}

    {/* extended charts - 10 additional graphs for Super Admin */}
    <div
      className="dashboard-extended-charts"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 16,
        marginTop: 4,
      }}
    >
      {/* Revenue and costs (multi-line) - added */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
          gridColumn: "span 2", // make this graph wider
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Revenue and costs</h4>
        <svg
          width="100%"
          height="120"
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* axes labels */}
          <g transform="translate(40,10)" fill="#9ca3af" fontSize="10">
            <text x="-10" y="10">
              11K
            </text>
            <text x="-10" y="40">
              10K
            </text>
            <text x="-10" y="70">
              9K
            </text>
            <text x="-10" y="100">
              8K
            </text>
          </g>
          {/* lines */}
          <g transform="translate(40,10)" fill="none" strokeLinecap="round">
            {/* Revenue (green) */}
            <path
              d="M0,80 C40,30 80,50 120,40 C160,30 200,50 240,35 C280,25 320,28 360,20"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
            />
            {/* Net profit (black) */}
            <path
              d="M0,90 C40,50 80,60 120,60 C160,55 200,70 240,50 C280,40 320,48 360,40"
              stroke="#111827"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Costs (pink) */}
            <path
              d="M0,100 C40,70 80,80 120,85 C160,90 200,60 240,70 C280,80 320,62 360,70"
              stroke="#ff4d7e"
              strokeWidth="2.5"
              fill="none"
            />
            {/* shaded area under revenue for visual match */}
            <path
              d="M0,80 C40,30 80,50 120,40 C160,30 200,50 240,35 C280,25 320,28 360,20 L360,100 L0,100 Z"
              fill="url(#revGrad)"
              stroke="none"
              opacity="0.9"
            />
          </g>
          {/* legend */}
          <g transform="translate(260,10)" fontSize="11" fill="#374151">
            <g>
              <rect x="0" y="0" width="10" height="10" rx="2" fill="#10b981" />
              <text x="16" y="9">
                Revenue
              </text>
            </g>
            <g transform="translate(0,18)">
              <rect x="0" y="0" width="10" height="10" rx="2" fill="#ff4d7e" />
              <text x="16" y="9">
                Costs
              </text>
            </g>
            <g transform="translate(0,36)">
              <rect x="0" y="0" width="10" height="10" rx="2" fill="#111827" />
              <text x="16" y="9">
                Net profit
              </text>
            </g>
          </g>
          {/* example tooltip (static) */}
          <g transform="translate(150,10)">
            <line
              x1="40"
              y1="0"
              x2="40"
              y2="100"
              stroke="#d1d5db"
              strokeDasharray="4 4"
            />
            <rect
              x="46"
              y="10"
              rx="6"
              width="120"
              height="56"
              fill="#fff"
              stroke="#eef2f6"
            />
            <text x="54" y="28" fontSize="11" fill="#374151">
              AUG 12, 2025
            </text>
            <text x="54" y="44" fontSize="11" fill="#111827">
              Revenue $4,515
            </text>
            <text x="54" y="60" fontSize="11" fill="#111827">
              Net profit $3,545
            </text>
            <text x="54" y="76" fontSize="11" fill="#ff4d7e">
              Costs $1,032
            </text>
          </g>
        </svg>
      </div>

      {/* Reservations trend (line sparkline) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>
          Reservations (30d)
        </h4>
        <svg
          width="100%"
          height="60"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
            points="0,30 15,24 30,18 45,20 60,14 75,10 90,12 100,8"
          />
        </svg>
      </div>

      {/* Occupancy rate (gauge) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Occupancy Rate</h4>
        <svg width="100%" height="60" viewBox="0 0 100 60">
          <path
            d="M10 45 A35 35 0 0 1 90 45"
            stroke="#e6e7ea"
            strokeWidth="8"
            fill="none"
          />
          <path
            d="M10 45 A35 35 0 0 1 70 20"
            stroke="#16a34a"
            strokeWidth="8"
            fill="none"
          />
          <text x="50" y="42" textAnchor="middle" fontSize="12" fill="#111827">
            87%
          </text>
        </svg>
      </div>

      {/* ADR sparkline */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>
          ADR (Average Daily Rate)
        </h4>
        <svg width="100%" height="60" viewBox="0 0 100 40">
          <polyline
            fill="none"
            stroke="#ffb86b"
            strokeWidth="2"
            points="0,34 15,30 30,26 45,28 60,22 75,18 90,20 100,16"
          />
          <text x="50" y="35" textAnchor="middle" fontSize="11" fill="#111827">
            $285
          </text>
        </svg>
      </div>

      {/* RevPAR sparkline */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>RevPAR</h4>
        <svg width="100%" height="60" viewBox="0 0 100 40">
          <polyline
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
            points="0,32 15,28 30,24 45,22 60,20 75,18 90,14 100,10"
          />
          <text x="50" y="35" textAnchor="middle" fontSize="11" fill="#111827">
            $210
          </text>
        </svg>
      </div>

      {/* Revenue by property (stacked bars) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>
          Revenue by Property
        </h4>
        <svg width="100%" height="60" viewBox="0 0 100 40">
          <rect x="4" y="10" width="14" height="26" fill="#7c3aed" />
          <rect x="26" y="4" width="14" height="32" fill="#ffb86b" />
          <rect x="48" y="16" width="14" height="20" fill="#f06292" />
          <rect x="70" y="8" width="14" height="28" fill="#7c3aed" />
        </svg>
      </div>

      {/* Bookings by source (pie) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>
          Bookings by Source
        </h4>
        <svg width="100%" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="18" fill="#f3f4f6" />
          <path d="M30 30 L30 12 A18 18 0 0 1 48 36 Z" fill="#7c3aed" />
          <path d="M30 30 L48 36 A18 18 0 0 1 22 48 Z" fill="#ffb86b" />
        </svg>
      </div>

      {/* Cancellations (small donut) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Cancellations</h4>
        <svg width="100%" height="60" viewBox="0 0 42 42">
          <circle
            cx="21"
            cy="21"
            r="12"
            fill="transparent"
            stroke="#e6e7ea"
            strokeWidth="6"
          />
          <circle
            cx="21"
            cy="21"
            r="12"
            fill="transparent"
            stroke="#f97316"
            strokeWidth="6"
            strokeDasharray="20 80"
            transform="rotate(-90 21 21)"
          />
          <text x="21" y="24" textAnchor="middle" fontSize="6" fill="#111827">
            5%
          </text>
        </svg>
      </div>

      {/* Payment methods (pie legend) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Payment Methods</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="18" fill="#f3f4f6" />
            <path d="M24 24 L24 6 A18 18 0 0 1 40 30 Z" fill="#7c3aed" />
            <path d="M24 24 L40 30 A18 18 0 0 1 18 40 Z" fill="#ffb86b" />
          </svg>
          <div style={{ fontSize: 12 }}>
            <div>Card 68%</div>
            <div>Cash 20%</div>
            <div>Other 12%</div>
          </div>
        </div>
      </div>

      {/* AR aging (bar buckets) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>AR Aging (N)</h4>
        <svg width="100%" height="60" viewBox="0 0 100 40">
          <rect x="6" y="20" width="14" height="18" rx="2" fill="#7c3aed" />
          <rect x="30" y="12" width="14" height="26" rx="2" fill="#ffb86b" />
          <rect x="54" y="6" width="14" height="32" rx="2" fill="#f06292" />
          <rect x="78" y="18" width="14" height="20" rx="2" fill="#7c3aed" />
        </svg>
      </div>

      {/* Room type occupancy (stacked) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>
          Room Type Occupancy
        </h4>
        <svg width="100%" height="60" viewBox="0 0 100 40">
          <rect x="6" y="12" width="80" height="16" rx="4" fill="#f3f4f6" />
          <rect x="6" y="12" width="50" height="16" rx="4" fill="#7c3aed" />
          <rect x="56" y="12" width="20" height="16" rx="4" fill="#ffb86b" />
        </svg>
      </div>

      {/* Small annual payroll summary (mini card) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>
          Annual payroll summary
        </h4>
        <svg
          width="100%"
          height="100"
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
        >
          <g transform="translate(8,8)">
            <g>
              <rect x="0" y="20" width="18" height="72" rx="3" fill="#ff7a18" />
              <rect x="28" y="8" width="18" height="84" rx="3" fill="#facc15" />
              <rect
                x="56"
                y="28"
                width="18"
                height="64"
                rx="3"
                fill="#7c3aed"
              />
              <rect
                x="84"
                y="4"
                width="18"
                height="88"
                rx="3"
                fill="#7c3aed"
                opacity="0.9"
              />
              <rect
                x="112"
                y="18"
                width="18"
                height="74"
                rx="3"
                fill="#ffb86b"
              />
            </g>
            <g transform="translate(0,92)" fill="#6b7280" fontSize="8">
              <text x="0">30 Sep</text>
              <text x="28">10 Oct</text>
              <text x="56">20 Oct</text>
              <text x="84">30 Oct</text>
              <text x="112">10 Nov</text>
            </g>
            <g transform="translate(130,6)" fontSize="9" fill="#374151">
              <g>
                <rect x="0" y="0" width="8" height="8" rx="1" fill="#ff7a18" />
                <text x="12" y="7">
                  Net salary
                </text>
              </g>
              <g transform="translate(0,12)">
                <rect x="0" y="0" width="8" height="8" rx="1" fill="#facc15" />
                <text x="12" y="7">
                  Tax
                </text>
              </g>
              <g transform="translate(0,24)">
                <rect x="0" y="0" width="8" height="8" rx="1" fill="#7c3aed" />
                <text x="12" y="7">
                  Loan
                </text>
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* Payment vouchers (list) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
          overflow: "hidden",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Payment vouchers</h4>
        <div style={{ maxHeight: 140, overflowY: "auto", paddingRight: 8 }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead style={{ color: "#6b7280", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "6px 0", width: 24 }}>#</th>
                <th style={{ padding: "6px 8px" }}>Subject</th>
                <th style={{ padding: "6px 8px", width: 92 }}>Date</th>
                <th style={{ padding: "6px 8px", width: 72 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "01",
                  "Request for FARS for October 2022",
                  "25/10/2025",
                  "Pending",
                ],
                [
                  "02",
                  "Request for project proposal fee",
                  "19/10/2025",
                  "Approved",
                ],
                [
                  "03",
                  "Request for FARS for October 2022",
                  "10/10/2025",
                  "Approved",
                ],
                [
                  "04",
                  "Request for project proposal fee",
                  "03/10/2025",
                  "Pending",
                ],
              ].map((row) => (
                <tr key={row[0]}>
                  <td style={{ padding: "8px 0", color: "#6b7280" }}>
                    {row[0]}
                  </td>
                  <td style={{ padding: "8px" }}>{row[1]}</td>
                  <td style={{ padding: "8px", color: "#6b7280" }}>{row[2]}</td>
                  <td style={{ padding: "8px" }}>
                    <span
                      style={{
                        color: row[3] === "Approved" ? "#10b981" : "#f59e0b",
                        fontWeight: 600,
                      }}
                    >
                      {row[3]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget history (table) */}
      <div
        className="card"
        style={{
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #eef2f6",
          overflow: "hidden",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Budget history</h4>
        <div style={{ maxHeight: 140, overflowY: "auto", paddingRight: 8 }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead style={{ color: "#6b7280", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "6px 0", width: 28 }}>S/N</th>
                <th style={{ padding: "6px 8px" }}>Budget No.</th>
                <th style={{ padding: "6px 8px" }}>Budgeted Amount (N)</th>
                <th style={{ padding: "6px 8px" }}>Actual Amount (N)</th>
                <th style={{ padding: "6px 8px", width: 92 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "01",
                  "00211235",
                  "$1,400,000.00",
                  "$1,380,000.00",
                  "25/10/2025",
                ],
                ["02", "36211235", "$400,000.00", "$500,000.00", "22/10/2025"],
                [
                  "03",
                  "00214465",
                  "$2,000,000.00",
                  "$1,400,000.00",
                  "20/10/2025",
                ],
                [
                  "04",
                  "00214465",
                  "$800,000.00",
                  "$1,800,000.00",
                  "20/10/2025",
                ],
              ].map((r) => (
                <tr key={r[0]}>
                  <td style={{ padding: "8px 0", color: "#6b7280" }}>{r[0]}</td>
                  <td style={{ padding: "8px" }}>{r[1]}</td>
                  <td style={{ padding: "8px" }}>{r[2]}</td>
                  <td style={{ padding: "8px" }}>{r[3]}</td>
                  <td style={{ padding: "8px", color: "#6b7280" }}>{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

const GeneralManagerDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Hotel Performance</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Occupancy Rate</div>
          <div className="stat-value">87%</div>
          <div className="stat-change">+5% vs last week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Revenue (MTD)</div>
          <div className="stat-value">$245.8K</div>
          <div className="stat-change">+12% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Guest Satisfaction</div>
          <div className="stat-value">4.7/5</div>
          <div className="stat-change">+0.2 vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Staff Count</div>
          <div className="stat-value">156</div>
          <div className="stat-change">+3 new hires</div>
        </div>
      </div>
    </div>
    <div className="dashboard-section">
      <h2 className="section-title">Key Metrics</h2>
      <div className="metrics-list">
        <div className="metric-item">
          <span>Average Daily Rate:</span>
          <span className="metric-value">$285</span>
        </div>
        <div className="metric-item">
          <span>Rooms Available:</span>
          <span className="metric-value">32/285</span>
        </div>
        <div className="metric-item">
          <span>Pending Reservations:</span>
          <span className="metric-value">18</span>
        </div>
      </div>
    </div>
  </div>
);

const FrontDeskDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Today's Check-ins</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Expected Arrivals</div>
          <div className="stat-value">24</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Checked In</div>
          <div className="stat-value">12</div>
        </div>
      </div>
    </div>
    <div className="dashboard-section">
      <h2 className="section-title">Today's Check-outs</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Expected Departures</div>
          <div className="stat-value">18</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Checked Out</div>
          <div className="stat-value">8</div>
        </div>
      </div>
    </div>
  </div>
);

const HousekeepingDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Room Status</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Occupied</div>
          <div className="stat-value">245</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Vacant & Dirty</div>
          <div className="stat-value">18</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Vacant & Clean</div>
          <div className="stat-value">22</div>
        </div>
      </div>
    </div>
    <div className="dashboard-section">
      <h2 className="section-title">Task Queue</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Pending Tasks</div>
          <div className="stat-value">8</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">5</div>
        </div>
      </div>
    </div>
  </div>
);

const FinanceDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Financial Summary</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">$847.2K</div>
          <div className="stat-change">+8% vs last period</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Outstanding AR</div>
          <div className="stat-value">$54.3K</div>
          <div className="stat-change">-12% vs last period</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Invoices Pending</div>
          <div className="stat-value">34</div>
        </div>
      </div>
    </div>
  </div>
);

const SalesDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Campaign Performance</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Active Campaigns</div>
          <div className="stat-value">7</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-value">12.4%</div>
          <div className="stat-change">+2.1% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bookings</div>
          <div className="stat-value">156</div>
          <div className="stat-change">+24 this month</div>
        </div>
      </div>
    </div>
  </div>
);

const ConciergeDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Guest Services</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Active Guests</div>
          <div className="stat-value">245</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Service Requests</div>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed Today</div>
          <div className="stat-value">28</div>
        </div>
      </div>
    </div>
  </div>
);

const MaintenanceDashboard = () => (
  <div className="dashboard-grid">
    <div className="dashboard-section">
      <h2 className="section-title">Work Orders</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Open Orders</div>
          <div className="stat-value">14</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">6</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">89</div>
        </div>
      </div>
    </div>
  </div>
);

const dashboardComponents: Record<UserRole, () => React.ReactNode> = {
  super_admin: SuperAdminDashboard,
  general_manager: GeneralManagerDashboard,
  front_desk_manager: FrontDeskDashboard,
  front_desk_agent: FrontDeskDashboard,
  housekeeping_manager: HousekeepingDashboard,
  housekeeping_staff: HousekeepingDashboard,
  finance_manager: FinanceDashboard,
  sales_marketing: SalesDashboard,
  concierge: ConciergeDashboard,
  maintenance_manager: MaintenanceDashboard,
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // ensure TypeScript knows the shape of user.role so it can index dashboardComponents
  const user = session.user as { role: UserRole; name?: string };
  const DashboardContent = dashboardComponents[user.role];

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">
            {ROLE_LABELS[user.role]} Dashboard
          </h1>
          <p className="dashboard-subtitle">Welcome back, {user.name}!</p>
        </div>
        <DashboardContent />
      </div>
    </DashboardLayout>
  );
}
