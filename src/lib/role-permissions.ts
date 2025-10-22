import type { UserRole } from "@/types/auth";
import type { ComponentType, SVGProps } from "react";
import {
  BarChart2,
  Users,
  Settings,
  Clipboard,
  CheckSquare,
  Box,
  ShoppingCart,
  Truck,
  DollarSign,
  FileText,
  Folder,
  List,
  Calendar,
  ClipboardList,
  Briefcase,
  Gift,
  Wrench,
  Layers,
  FileArchive,
  Database,
  BookOpen,
  Tag,
  GitPullRequest,
  MapPin,
} from "lucide-react";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export function BullseyeIconFallback(): IconComponent {
  return MapPin;
}

export function BellFallback(): IconComponent {
  return MapPin;
}

export function SearchFallback(): IconComponent {
  return MapPin;
}

export function MailFallback(): IconComponent {
  return MapPin;
}

export function PhoneFallback(): IconComponent {
  return MapPin;
}

export interface NavItem {
  label: string;
  href: string;
  icon: IconComponent;
  roles: UserRole[];
  description?: string;
  children?: NavItem[]; // added to support dropdown / nested items
}

export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: BarChart2,
    roles: ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent", "housekeeping_manager", "housekeeping_staff", "finance_manager", "sales_marketing", "concierge", "maintenance_manager"],
  },
  // Admin section
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
    roles: ["super_admin"],
  },
  {
    label: "System Settings",
    href: "/admin/system",
    icon: Settings,
    roles: ["super_admin"],
  },
  // Front Office
  {
    label: "Reservations",
    href: "/front-office/reservations",
    icon: Clipboard,
    roles: ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent"],
  },
  {
    label: "Check-in",
    href: "/front-office/checkin",
    icon: CheckSquare,
    roles: ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent"],
  },
  {
    label: "Check-out",
    href: "/front-office/checkout",
    icon: ClipboardList,
    roles: ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent"],
  },
  // Housekeeping
  {
    label: "Tasks",
    href: "/housekeeping/tasks",
    icon: CheckSquare,
    roles: ["super_admin", "general_manager", "housekeeping_manager", "housekeeping_staff"],
  },
  {
    label: "Room Status",
    href: "/housekeeping/rooms",
    icon: Box,
    roles: ["super_admin", "general_manager", "housekeeping_manager"],
  },
  // Finance
  {
    label: "Invoicing",
    href: "/finance/invoicing",
    icon: FileText,
    roles: ["super_admin", "general_manager", "finance_manager"],
  },
  {
    label: "Accounting",
    href: "/finance/accounting",
    icon: BarChart2,
    roles: ["super_admin", "general_manager", "finance_manager"],
  },
  {
    label: "Payroll",
    href: "/finance/payroll",
    icon: DollarSign,
    roles: ["super_admin", "general_manager"],
  },
  {
    label: "Reports",
    href: "/finance/reports",
    icon: BarChart2,
    roles: ["super_admin", "general_manager", "finance_manager"],
  },

  // Equity (Finance)
  {
    label: "Equity",
    href: "/finance/equity",
    icon: BarChart2,
    description: "Manage securities, transactions, and cap tables",
    roles: ["super_admin", "general_manager", "finance_manager"],
    children: [
      {
        label: "Securities",
        href: "/finance/equity/securities",
        icon: DollarSign,
        roles: ["super_admin", "general_manager", "finance_manager"],
      },
      {
        label: "Transactions",
        href: "/finance/equity/transactions",
        icon: Truck,
        roles: ["super_admin", "general_manager", "finance_manager"],
      },
      {
        label: "Cap Table",
        href: "/finance/equity/cap-table",
        icon: FileArchive,
        roles: ["super_admin", "general_manager", "finance_manager"],
      },
    ],
  },
  // Sales & Marketing
  {
    label: "Campaigns",
    href: "/sales/campaigns",
    icon: BullseyeIconFallback(),
    roles: ["super_admin", "general_manager", "sales_marketing"],
  },
  {
    label: "Rate Management",
    href: "/sales/rates",
    icon: Tag,
    roles: ["super_admin", "general_manager", "sales_marketing"],
  },

  // Shopee Connector (integration)
  {
    label: "Shopee Connector",
    href: "/integrations/shopee",
    icon: ShoppingCart,
    description: "Import Shopee orders and sync deliveries",
    roles: ["super_admin", "general_manager", "sales_marketing", "finance_manager"],
    children: [
      {
        label: "Import Orders",
        href: "/integrations/shopee/import-orders",
        icon: ShoppingCart,
        roles: ["super_admin", "general_manager", "sales_marketing", "finance_manager"],
      },
      {
        label: "Sync Deliveries",
        href: "/integrations/shopee/deliveries",
        icon: Truck,
        roles: ["super_admin", "general_manager", "sales_marketing", "finance_manager"],
      },
      {
        label: "Shopee Settings",
        href: "/integrations/shopee/settings",
        icon: Settings,
        roles: ["super_admin", "general_manager"],
      },
    ],
  },

  // Inventory (parent with dropdown)
  {
    label: "Inventory",
    href: "/inventory",
    icon: Box,
    description: "Manage stock, items, suppliers and inventory reports",
    roles: ["super_admin", "general_manager"],
    children: [
      {
        label: "Inventory Dashboard",
        href: "/inventory/dashboard",
        icon: BarChart2,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Items / Products",
        href: "/inventory/items",
        icon: Box,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Categories",
        href: "/inventory/categories",
        icon: Folder,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Stock In",
        href: "/inventory/stock-in",
        icon: Truck,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Stock Out",
        href: "/inventory/stock-out",
        icon: Truck,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Transfers",
        href: "/inventory/transfers",
        icon: GitPullRequest,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Adjustments",
        href: "/inventory/adjustments",
        icon: Wrench,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Suppliers",
        href: "/inventory/suppliers",
        icon: Briefcase,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Purchase Orders",
        href: "/inventory/purchase-orders",
        icon: FileText,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Reorder Alerts",
        href: "/inventory/reorder-alerts",
        icon: BellFallback(),
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Inventory Reports",
        href: "/inventory/reports",
        icon: BarChart2,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Inventory Settings",
        href: "/inventory/settings",
        icon: Settings,
        roles: ["super_admin", "general_manager"],
      },
    ],
  },

  // CRM (super_admin only)
  {
    label: "CRM",
    href: "/crm",
    icon: Folder,
    roles: ["super_admin"],
  },
  {
    label: "Leads",
    href: "/crm/leads",
    icon: SearchFallback(),
    roles: ["super_admin"],
  },
  {
    label: "Contacts",
    href: "/crm/contacts",
    icon: Users,
    roles: ["super_admin"],
  },
  {
    label: "Companies",
    href: "/crm/companies",
    icon: Briefcase,
    roles: ["super_admin"],
  },
  {
    label: "Opportunities",
    href: "/crm/opportunities",
    icon: Briefcase,
    roles: ["super_admin"],
  },
  {
    label: "Pipeline",
    href: "/crm/pipeline",
    icon: BarChart2,
    roles: ["super_admin"],
  },
  {
    label: "Activities",
    href: "/crm/activities",
    icon: List,
    roles: ["super_admin"],
  },
  {
    label: "Notes",
    href: "/crm/notes",
    icon: FileText,
    roles: ["super_admin"],
  },
  {
    label: "Tasks",
    href: "/crm/tasks",
    icon: CheckSquare,
    roles: ["super_admin"],
  },
  {
    label: "Communication Log",
    href: "/crm/communications",
    icon: PhoneFallback(),
    roles: ["super_admin"],
  },
  {
    label: "Reports",
    href: "/crm/reports",
    icon: BarChart2,
    roles: ["super_admin"],
  },
  {
    label: "Settings",
    href: "/crm/settings",
    icon: Settings,
    roles: ["super_admin"],
  },

  // Documents / Signing
  {
    label: "Sign",
    href: "/documents/sign",
    icon: FileText,
    description: "Our documents signed pen\nin just one click\nallows you to send, sign, and approve documents online. Simplify your processes across all aspects of your business.",
    roles: ["super_admin", "general_manager"],
  },
  {
    label: "Data Recycle",
    href: "/admin/data-recycle",
    icon: FileArchive,
    description: "Find old records and archive/delete them",
    roles: ["super_admin", "general_manager"],
  },

  // Documents (parent with dropdown)
  {
    label: "Documents",
    href: "/documents",
    icon: Folder,
    description: "Manage bills, expenses and VAT documents",
    roles: ["super_admin", "general_manager", "finance_manager"],
    children: [
      {
        label: "Bills",
        href: "/documents/bills",
        icon: FileText,
        roles: ["super_admin", "general_manager", "finance_manager"],
      },
      {
        label: "Expenses",
        href: "/documents/expenses",
        icon: DollarSign,
        roles: ["super_admin", "general_manager", "finance_manager"],
      },
      {
        label: "VAT",
        href: "/documents/vat",
        icon: DollarSign,
        roles: ["super_admin", "general_manager", "finance_manager"],
      },
    ],
  },

  // Concierge
  {
    label: "Guest Services",
    href: "/concierge/services",
    icon: Gift,
    roles: ["super_admin", "general_manager", "concierge"],
  },
  {
    label: "Guest Directory",
    href: "/concierge/guests",
    icon: Users,
    roles: ["super_admin", "general_manager", "concierge", "front_desk_manager"],
  },
  // Maintenance
  {
    label: "Work Orders",
    href: "/maintenance/workorders",
    icon: Wrench,
    roles: ["super_admin", "general_manager", "maintenance_manager"],
  },
  {
    label: "Equipment",
    href: "/maintenance/equipment",
    icon: Wrench,
    roles: ["super_admin", "general_manager", "maintenance_manager"],
  },
  // HR
  {
    label: "Skills Management",
    href: "/hr/skills",
    icon: BookOpen,
    roles: ["super_admin", "general_manager"],
  },
  {
    label: "Planning",
    href: "/hr/planning",
    icon: Calendar,
    description: "Manage your employees' schedule",
    roles: ["super_admin", "general_manager"],
  },
  // HR -> Recruitment (dropdown)
  {
    label: "Recruitment",
    href: "/hr/recruitment",
    icon: Users,
    description: "Manage job postings, applicants and hiring workflow",
    roles: ["super_admin", "general_manager"],
    children: [
      {
        label: "Job Openings",
        href: "/hr/recruitment/jobs",
        icon: Clipboard,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Applicants",
        href: "/hr/recruitment/applicants",
        icon: Users,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Interviews",
        href: "/hr/recruitment/interviews",
        icon: Calendar,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Offers",
        href: "/hr/recruitment/offers",
        icon: MailFallback(),
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Onboarding",
        href: "/hr/recruitment/onboarding",
        icon: FileText,
        roles: ["super_admin", "general_manager"],
      },
    ],
  },

  // Product Lifecycle Management (PLM)
  {
    label: "Product Lifecycle Management (PLM)",
    href: "/plm",
    icon: Layers,
    description: "Manage product data, BOMs, change requests and lifecycle stages",
    roles: ["super_admin", "general_manager"],
    children: [
      {
        label: "PLM Dashboard",
        href: "/plm/dashboard",
        icon: BarChart2,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Products",
        href: "/plm/products",
        icon: Box,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "BOMs",
        href: "/plm/boms",
        icon: FileText,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Change Requests",
        href: "/plm/change-requests",
        icon: GitPullRequest,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "Releases",
        href: "/plm/releases",
        icon: BarChart2,
        roles: ["super_admin", "general_manager"],
      },
      {
        label: "PLM Projects",
        href: "/plm/projects",
        icon: Folder,
        roles: ["super_admin", "general_manager"],
      },
    ],
  },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return navigationItems.reduce<NavItem[]>((acc, item) => {
    if (!item.roles.includes(role)) return acc;
    if (item.children) {
      const filteredChildren = item.children.filter(c => c.roles.includes(role));
      acc.push({ ...item, children: filteredChildren });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

export function canAccessRoute(role: UserRole, href: string): boolean {
  const items = getNavItemsForRole(role);
  return items.some(item =>
    item.href === href ||
    href.startsWith(item.href) ||
    (item.children && item.children.some(c => c.href === href || href.startsWith(c.href)))
  );
}
