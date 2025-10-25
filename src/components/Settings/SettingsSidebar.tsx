"use client";

import { useSettings } from "@/store/useSettings";
import { motion } from "framer-motion";
import { settingsItems } from "./constants";

export function SettingsSidebar() {
  const { activeTab, setActiveTab } = useSettings();

  return (
    <aside className="h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
        <nav className="space-y-3">
          {settingsItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md transition-colors duration-150 flex items-center gap-3 group ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-[#2a2f3c] hover:text-gray-200"
                }`}
              >
                <div className={`flex-shrink-0 ${
                  active ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${
                    active ? "text-white" : "text-white"
                  }`}>
                    {item.label}
                  </p>
                  <p className={`text-xs ${
                    active ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
