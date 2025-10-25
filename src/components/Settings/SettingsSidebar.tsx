"use client";

import { useSettings } from "@/store/useSettings";
import { motion } from "framer-motion";
import { settingsItems } from "./constants";

export function SettingsSidebar() {
  const { activeTab, setActiveTab } = useSettings();

  return (
    <aside className="w-80 bg-[var(--card-bg)]/80 border-r border-[var(--border)] backdrop-blur overflow-y-auto sticky top-0 h-[100vh]">
      <div className="p-5">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-[var(--secondary)] mb-4">Settings</h2>
        <nav className="space-y-1">
          {settingsItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative w-full text-left rounded-xl px-4 py-3 transition-colors ${
                  active
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20"
                    : "text-[var(--foreground)] hover:bg-[var(--sidebar-hover)]"
                }`}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`absolute left-0 top-0 h-full w-1 rounded-r ${active ? "bg-[var(--primary)]" : "bg-transparent group-hover:bg-[var(--border)]"}`} />
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${active ? "text-[var(--primary)]" : "text-[var(--secondary)]"}`}>{item.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium leading-5">{item.label}</p>
                    <p className="text-xs text-[var(--secondary)] leading-4 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
