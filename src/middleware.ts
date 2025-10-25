import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { UserRole } from "@/types/auth";
import { AUTH_SECRET } from "@/lib/auth-constants";

// Define route protection rules: path pattern -> allowed roles
const routeProtection: Record<string, UserRole[]> = {
  "/dashboard": [
    "super_admin",
    "general_manager",
    "front_desk_manager",
    "front_desk_agent",
    "housekeeping_manager",
    "housekeeping_staff",
    "finance_manager",
    "sales_marketing",
    "concierge",
    "maintenance_manager",
  ],

  // Super Admin routes
  "/admin/users": ["super_admin"],
  "/admin/system": ["super_admin"],

  // General Manager routes
  "/manager/analytics": ["super_admin", "general_manager"],
  "/manager/financial": ["super_admin", "general_manager", "finance_manager"],

  // Front Office routes
  "/front-office/reservations": ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent"],
  "/front-office/checkin": ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent"],
  "/front-office/checkout": ["super_admin", "general_manager", "front_desk_manager", "front_desk_agent"],

  // Housekeeping routes
  "/housekeeping/tasks": ["super_admin", "general_manager", "housekeeping_manager", "housekeeping_staff"],
  "/housekeeping/rooms": ["super_admin", "general_manager", "housekeeping_manager"],

  // Finance routes
  "/finance/invoicing": ["super_admin", "general_manager", "finance_manager"],
  "/finance/accounting": ["super_admin", "general_manager", "finance_manager"],
  "/finance/reports": ["super_admin", "general_manager", "finance_manager"],

  // Sales & Marketing routes
  "/sales/campaigns": ["super_admin", "general_manager", "sales_marketing"],
  "/sales/rates": ["super_admin", "general_manager", "sales_marketing"],

  // Concierge routes
  "/concierge/services": ["super_admin", "general_manager", "concierge"],
  "/concierge/guests": ["super_admin", "general_manager", "concierge", "front_desk_manager"],

  // Maintenance routes
  "/maintenance/workorders": ["super_admin", "general_manager", "maintenance_manager"],
  "/maintenance/equipment": ["super_admin", "general_manager", "maintenance_manager"],
};

function getMatchingRoute(pathname: string): string | null {
  const exactMatch = routeProtection[pathname];
  if (exactMatch) return pathname;
  for (const route of Object.keys(routeProtection)) {
    if (pathname.startsWith(route)) return route;
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow access to auth and public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: AUTH_SECRET });

  const matchedRoute = getMatchingRoute(pathname);
  if (!matchedRoute) {
    // If no protection rule, allow access
    return NextResponse.next();
  }

  // Require authentication
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const allowedRoles = routeProtection[matchedRoute];
  const userRole = (token as any)?.role as UserRole | undefined;

  if (!userRole || !allowedRoles.includes(userRole)) {
    const url = req.nextUrl.clone();
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url, { status: 307 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
