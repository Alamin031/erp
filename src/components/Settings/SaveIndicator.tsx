"use client";

import { useSettings } from "@/store/useSettings";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

interface SaveIndicatorProps {
  status?: "idle" | "saving" | "success" | "error";
  message?: string;
}

export function SaveIndicator({
  status = "idle",
  message = "Saving changes...",
}: SaveIndicatorProps) {
  const { isSaving } = useSettings();

  const currentStatus = status !== "idle" ? status : isSaving ? "saving" : "idle";

  return (
    <AnimatePresence mode="wait">
      {(currentStatus === "saving" || currentStatus === "success") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              currentStatus === "saving"
                ? "bg-blue-500 bg-opacity-90"
                : "bg-green-500 bg-opacity-90"
            }`}
          >
            {currentStatus === "saving" ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5"
                >
                  <div className="w-full h-full border-2 border-white border-t-transparent rounded-full" />
                </motion.div>
                <span className="text-white font-medium text-sm">
                  {message}
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                <span className="text-white font-medium text-sm">
                  Changes saved
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}

      {currentStatus === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 bg-red-500 bg-opacity-90">
            <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-white font-medium text-sm">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
