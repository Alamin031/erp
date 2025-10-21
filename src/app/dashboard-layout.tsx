"use client";

import { ReactNode } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/sidebar";
import { LogoutButton } from "@/components/logout-button";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Redirecting to login...</div>
      </div>
    );
  }

  const user = session?.user as any;

  return (
    <div className="dashboard-wrapper">
      <Sidebar role={user?.role} userName={user?.name} />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>OrionStay ERP System</h1>
          </div>
          <div className="header-actions">
            <span className="user-display">{user?.email}</span>
            <LogoutButton />
          </div>
        </header>
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SessionProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SessionProvider>
  );
}
