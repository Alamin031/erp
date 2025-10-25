"use client";

import { useSettings } from "@/store/useSettings";
import { motion } from "framer-motion";
import { settingsItems } from "./constants";

export function SettingsSidebar() {
  const { activeTab, setActiveTab } = useSettings();

  return (
    <aside className="w-80 bg-[var(--card-bg)] border-r border-[var(--border)] overflow-y-auto sticky top-0 h-[100vh]">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">
          Settings
        </h2>
        <nav className="space-y-2">
          {settingsItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === item.id
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30"
                  : "text-[var(--foreground)] hover:bg-[var(--sidebar-hover)]"
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="text-[var(--secondary)]">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-[var(--secondary)]">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
