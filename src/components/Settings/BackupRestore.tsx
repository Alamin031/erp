"use client";

import { useState } from "react";
import { useSettings } from "@/store/useSettings";
import { useToast } from "@/components/toast";
import { motion } from "framer-motion";
import { Download, Upload, Loader } from "lucide-react";

export function BackupRestore() {
  const { backupRestore, createBackup, restoreFromBackup, isSaving } =
    useSettings();
  const { showToast } = useToast();
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [isRestoringFile, setIsRestoringFile] = useState(false);

  const handleCreateBackup = async () => {
    try {
      await createBackup();
      showToast("Backup created successfully", "success");
    } catch (error) {
      showToast("Failed to create backup", "error");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("Restore from this backup? This action cannot be undone.")) {
      return;
    }

    setIsRestoringFile(true);
    setRestoreProgress(0);

    try {
      const interval = setInterval(() => {
        setRestoreProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      await restoreFromBackup(file);

      clearInterval(interval);
      setRestoreProgress(100);
      showToast("Backup restored successfully", "success");

      setTimeout(() => {
        setRestoreProgress(0);
        setIsRestoringFile(false);
      }, 1000);
    } catch (error) {
      setRestoreProgress(0);
      setIsRestoringFile(false);
      showToast("Failed to restore backup", "error");
    }
  };

  const handleDownloadBackup = () => {
    if (!backupRestore.lastBackupDate) {
      showToast("No backup available to download", "error");
      return;
    }
    showToast("Download started", "success");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          Backup & Restore
        </h3>
        <p className="text-sm text-[var(--secondary)] mb-6">
          Create and manage system backups
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Create Backup
              </h4>
              <p className="text-sm text-[var(--secondary)]">
                Generate a new system backup
              </p>
            </div>
            <span className="text-3xl">💾</span>
          </div>

          <div className="bg-[var(--background)] rounded-lg p-4 mb-6">
            <p className="text-sm text-[var(--secondary)] mb-1">
              Last Backup
            </p>
            <p className="text-lg font-semibold text-[var(--foreground)]">
              {formatDate(backupRestore.lastBackupDate)}
            </p>
            {backupRestore.lastBackupSize && (
              <p className="text-sm text-[var(--secondary)] mt-1">
                Size: {backupRestore.lastBackupSize}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <motion.button
              onClick={handleCreateBackup}
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Create Backup Now
                </>
              )}
            </motion.button>

            <motion.button
              onClick={handleDownloadBackup}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!backupRestore.lastBackupDate}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download Backup
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Restore from Backup
              </h4>
              <p className="text-sm text-[var(--secondary)]">
                Restore from a previously saved backup
              </p>
            </div>
            <span className="text-3xl">📂</span>
          </div>

          <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center mb-6">
            <input
              type="file"
              id="backup-file"
              accept=".zip,.tar,.gz"
              onChange={handleFileSelect}
              disabled={isRestoringFile}
              className="hidden"
            />

            {restoreProgress > 0 ? (
              <div className="space-y-4">
                <Loader className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
                <div className="w-full bg-[var(--background)] rounded-full h-2">
                  <motion.div
                    className="bg-[var(--primary)] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${restoreProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-[var(--secondary)]">
                  Restoring... {Math.round(restoreProgress)}%
                </p>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-3 text-[var(--primary)]" />
                <p className="text-[var(--foreground)] font-medium mb-1">
                  Click to select backup file
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Supported formats: .zip, .tar, .gz
                </p>
                <input
                  type="file"
                  accept=".zip,.tar,.gz"
                  onChange={handleFileSelect}
                  disabled={isRestoringFile}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="bg-orange-500 border border-orange-600 rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm text-white font-medium">
              Restoring will overwrite all current data. This action cannot be undone.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="bg-blue-600 border border-blue-700 rounded-lg p-6">
        <h4 className="font-semibold text-white mb-3">Backup Information</h4>
        <ul className="text-sm text-white space-y-2">
          <li>• Backups include all system data, configurations, and user information</li>
          <li>• Automatic daily backups are performed at 2:00 AM UTC</li>
          <li>• Backups are retained for 30 days</li>
          <li>• Manual backups are retained indefinitely</li>
        </ul>
      </div>
    </motion.div>
  );
}
