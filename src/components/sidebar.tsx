"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/auth";
import { getNavItemsForRole, ROLE_LABELS } from "@/lib/role-permissions";
import type { NavItem } from "@/lib/role-permissions";

interface SidebarProps {
  role: UserRole;
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const navItems = getNavItemsForRole(role);

  // Group items by category
  const groupedItems: Record<string, NavItem[]> = {
    Main: [],
    "Front Office": [],
    Housekeeping: [],
    Finance: [],
    Sales: [],
    Concierge: [],
    Maintenance: [],
    Admin: [],
  };

  navItems.forEach(item => {
    if (item.href === "/dashboard") {
      groupedItems.Main.push(item);
    } else if (item.href.startsWith("/front-office")) {
      groupedItems["Front Office"].push(item);
    } else if (item.href.startsWith("/housekeeping")) {
      groupedItems.Housekeeping.push(item);
    } else if (item.href.startsWith("/finance")) {
      groupedItems.Finance.push(item);
    } else if (item.href.startsWith("/sales")) {
      groupedItems.Sales.push(item);
    } else if (item.href.startsWith("/concierge")) {
      groupedItems.Concierge.push(item);
    } else if (item.href.startsWith("/maintenance")) {
      groupedItems.Maintenance.push(item);
    } else if (item.href.startsWith("/admin")) {
      groupedItems.Admin.push(item);
    }
  });

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className={`sidebar-container ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon">🏨</span>
          {isOpen && <span className="brand-text">OrionStay</span>}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="toggle-btn"
          aria-label="Toggle sidebar"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {isOpen && (
        <div className="sidebar-user">
          <div className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <p className="user-name">{userName}</p>
            <p className="user-role">{ROLE_LABELS[role]}</p>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {Object.entries(groupedItems).map(([category, items]) => {
          if (items.length === 0) return null;

          return (
            <div key={category} className="nav-section">
              {isOpen && <h3 className="nav-section-title">{category}</h3>}
              <ul className="nav-list">
                {items.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`nav-link ${isActive(item.href) ? "nav-link-active" : ""}`}
                      title={item.label}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {isOpen && <span className="nav-label">{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
