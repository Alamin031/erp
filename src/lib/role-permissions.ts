import type { UserRole } from "@/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
}

export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "📊",
    roles: ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent", "housekeeping_manager", "housekeeping_staff", "finance_manager", "sales_marketing", "concierge", "maintenance_manager"],
  },
  // Admin section
  {
    label: "User Management",
    href: "/admin/users",
    icon: "👥",
    roles: ["super_admin"],
  },
  {
    label: "System Settings",
    href: "/admin/system",
    icon: "⚙️",
    roles: ["super_admin"],
  },
  // Front Office
  {
    label: "Reservations",
    href: "/front-office/reservations",
    icon: "📋",
    roles: ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent"],
  },
  {
    label: "Check-in",
    href: "/front-office/checkin",
    icon: "📥",
    roles: ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent"],
  },
  {
    label: "Check-out",
    href: "/front-office/checkout",
    icon: "📤",
    roles: ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent"],
  },
  // Housekeeping
  {
    label: "Tasks",
    href: "/housekeeping/tasks",
    icon: "🧹",
    roles: ["super_admin", "general_manager", "housekeeping_manager", "housekeeping_staff"],
  },
  {
    label: "Room Status",
    href: "/housekeeping/rooms",
    icon: "🛏️",
    roles: ["super_admin", "general_manager", "housekeeping_manager"],
  },
  // Finance
  {
    label: "Invoicing",
    href: "/finance/invoicing",
    icon: "💳",
    roles: ["super_admin", "general_manager", "finance_manager"],
  },
  {
    label: "Accounting",
    href: "/finance/accounting",
    icon: "📈",
    roles: ["super_admin", "general_manager", "finance_manager"],
  },
  {
    label: "Reports",
    href: "/finance/reports",
    icon: "📑",
    roles: ["super_admin", "general_manager", "finance_manager"],
  },
  // Sales & Marketing
  {
    label: "Campaigns",
    href: "/sales/campaigns",
    icon: "📢",
    roles: ["super_admin", "general_manager", "sales_marketing"],
  },
  {
    label: "Rate Management",
    href: "/sales/rates",
    icon: "💰",
    roles: ["super_admin", "general_manager", "sales_marketing"],
  },
  // Concierge
  {
    label: "Guest Services",
    href: "/concierge/services",
    icon: "🎩",
    roles: ["super_admin", "general_manager", "concierge"],
  },
  {
    label: "Guest Directory",
    href: "/concierge/guests",
    icon: "🧑‍💼",
    roles: ["super_admin", "general_manager", "concierge", "front_desk_manager"],
  },
  // Maintenance
  {
    label: "Work Orders",
    href: "/maintenance/workorders",
    icon: "🔧",
    roles: ["super_admin", "general_manager", "maintenance_manager"],
  },
  {
    label: "Equipment",
    href: "/maintenance/equipment",
    icon: "⚙️",
    roles: ["super_admin", "general_manager", "maintenance_manager"],
  },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return navigationItems.filter(item => item.roles.includes(role));
}

export function canAccessRoute(role: UserRole, href: string): boolean {
  return getNavItemsForRole(role).some(item => item.href === href || href.startsWith(item.href));
}
