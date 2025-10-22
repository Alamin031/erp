"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/auth";
import { ROLE_LABELS } from "@/types/auth";
import { getNavItemsForRole } from "@/lib/role-permissions";
import type { NavItem } from "@/lib/role-permissions";

interface SidebarProps {
  role: UserRole;
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const navItems = getNavItemsForRole(role);

  // categories with matching logic
  const categories = useMemo(
    () => [
      { key: "Main", match: (i: NavItem) => i.href === "/dashboard" },
      {
        key: "Front Office",
        match: (i: NavItem) => i.href.startsWith("/front-office"),
      },
      {
        key: "Housekeeping",
        match: (i: NavItem) => i.href.startsWith("/housekeeping"),
      },
      { key: "Finance", match: (i: NavItem) => i.href.startsWith("/finance") },
      { key: "Sales", match: (i: NavItem) => i.href.startsWith("/sales") },
      {
        key: "Concierge",
        match: (i: NavItem) => i.href.startsWith("/concierge"),
      },
      {
        key: "Maintenance",
        match: (i: NavItem) => i.href.startsWith("/maintenance"),
      },
      { key: "Admin", match: (i: NavItem) => i.href.startsWith("/admin") },
      {
        key: "CRM",
        match: (i: NavItem) => i.href === "/crm" || i.href.startsWith("/crm/"),
      },
      {
        key: "Documents",
        match: (i: NavItem) =>
          i.href === "/documents" || i.href.startsWith("/documents/"),
      },
      {
        key: "HR",
        match: (i: NavItem) => i.href === "/hr" || i.href.startsWith("/hr/"),
      },
      {
        key: "PLM",
        match: (i: NavItem) => i.href === "/plm" || i.href.startsWith("/plm/"),
      },
    ],
    []
  );

  // initialize groupedItems and put unmatched items into "Other"
  const groupedItems: Record<string, NavItem[]> = useMemo(() => {
    const map: Record<string, NavItem[]> = {};
    categories.forEach((c) => (map[c.key] = []));
    map["Other"] = [];

    navItems.forEach((item) => {
      const cat = categories.find((c) => c.match(item));
      if (cat) map[cat.key].push(item);
      else map["Other"].push(item);
    });

    return map;
  }, [navItems, categories]);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  // manage open state for any parent item with children (default open if path is inside)
  const initialOpenState = useMemo(() => {
    const state: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.children && item.children.length > 0) {
        state[item.href] =
          !!pathname &&
          (pathname === item.href || pathname.startsWith(item.href + "/"));
      }
    });
    return state;
  }, [navItems, pathname]);

  const [openMap, setOpenMap] =
    useState<Record<string, boolean>>(initialOpenState);

  const toggleParent = (href: string) => {
    setOpenMap((s) => ({ ...s, [href]: !s[href] }));
  };

  return (
    <aside
      className={`sidebar-container ${
        isOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
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
          <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
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
                {items.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const open = !!openMap[item.href];

                  if (hasChildren) {
                    // parent with dropdown
                    return (
                      <li key={item.href} className="nav-parent">
                        <a
                          href={item.href}
                          className={`nav-link ${
                            isActive(item.href) ? "nav-link-active" : ""
                          }`}
                          title={item.label}
                          role="button"
                          aria-expanded={open}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleParent(item.href);
                          }}
                        >
                          <span className="nav-icon">{item.icon}</span>
                          {isOpen && (
                            <span className="nav-label">{item.label}</span>
                          )}
                          {isOpen && (
                            <span className="parent-toggle">
                              {open ? "▾" : "▸"}
                            </span>
                          )}
                        </a>

                        {open && (
                          <ul className="nav-sublist">
                            {item.children!.map((child) => (
                              <li key={child.href} className="nav-subitem">
                                <Link
                                  href={child.href}
                                  className={`nav-link ${
                                    isActive(child.href)
                                      ? "nav-link-active"
                                      : ""
                                  }`}
                                  title={child.label}
                                >
                                  <span className="nav-icon">{child.icon}</span>
                                  {isOpen && (
                                    <span className="nav-label">
                                      {child.label}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  // simple item
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-link ${
                          isActive(item.href) ? "nav-link-active" : ""
                        }`}
                        title={item.label}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {isOpen && (
                          <span className="nav-label">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
