"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROLE_LABELS } from "@/lib/role-permissions";
import type { UserRole } from "@/types/auth";

const DEMO_ACCOUNTS = [
  { email: "super@orionhotel.com", role: "super_admin" as UserRole },
  { email: "gm@orionhotel.com", role: "general_manager" as UserRole },
  { email: "fdm@orionhotel.com", role: "front_desk_manager" as UserRole },
  { email: "fda@orionhotel.com", role: "front_desk_agent" as UserRole },
  { email: "hk@orionhotel.com", role: "housekeeping_manager" as UserRole },
  { email: "hks@orionhotel.com", role: "housekeeping_staff" as UserRole },
  { email: "finance@orionhotel.com", role: "finance_manager" as UserRole },
  { email: "sales@orionhotel.com", role: "sales_marketing" as UserRole },
  { email: "concierge@orionhotel.com", role: "concierge" as UserRole },
  { email: "maintenance@orionhotel.com", role: "maintenance_manager" as UserRole },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setTimeout(() => {
      const form = document.querySelector("form") as HTMLFormElement;
      if (form) form.dispatchEvent(new Event("submit", { bubbles: true }));
    }, 100);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">🏨 OrionStay ERP</h1>
          <p className="login-subtitle">Hotel Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Demo Accounts (Password: demo123)</p>
          <div className="demo-buttons">
            {DEMO_ACCOUNTS.map(({ email: demoEmail, role }) => (
              <button
                key={demoEmail}
                onClick={() => quickLogin(demoEmail)}
                className="demo-button"
                disabled={isLoading}
                type="button"
              >
                <span className="demo-role">{ROLE_LABELS[role]}</span>
                <span className="demo-email">{demoEmail}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer">
          <p>This is a demo system for testing purposes</p>
        </div>
      </div>
    </div>
  );
}
