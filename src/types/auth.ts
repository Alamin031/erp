export type UserRole = 
  | "super_admin"
  | "general_manager"
  | "front_desk_manager"
  | "front_desk_agent"
  | "housekeeping_manager"
  | "housekeeping_staff"
  | "finance_manager"
  | "sales_marketing"
  | "concierge"
  | "maintenance_manager";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}

export interface Session {
  user: User;
  expires: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  general_manager: "General Manager",
  front_desk_manager: "Front Desk Manager",
  front_desk_agent: "Front Desk Agent",
  housekeeping_manager: "Housekeeping Manager",
  housekeeping_staff: "Housekeeping Staff",
  finance_manager: "Finance Manager",
  sales_marketing: "Sales & Marketing",
  concierge: "Concierge",
  maintenance_manager: "Maintenance Manager",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: "System-wide analytics and user management",
  general_manager: "Hotel performance and financial KPIs",
  front_desk_manager: "Room availability and check-in/check-out",
  front_desk_agent: "Daily arrivals and departures",
  housekeeping_manager: "Room status and task assignments",
  housekeeping_staff: "Assigned housekeeping tasks",
  finance_manager: "Invoicing, budgets, and accounting",
  sales_marketing: "Campaigns and rate management",
  concierge: "Guest itineraries and services",
  maintenance_manager: "Equipment and work orders",
};
