"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function UnauthorizedPage() {
  return (
    <div className="error-container">
      <div className="error-card">
        <h1 className="error-title">❌ Access Denied</h1>
        <p className="error-message">
          You do not have permission to access this page.
        </p>
        <div className="error-actions">
          <Link href="/dashboard" className="error-button">
            Go to Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="error-button error-button-secondary"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
