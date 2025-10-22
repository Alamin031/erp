"use client";

import { useSign } from "@/store/useSign";
import { Document } from "@/types/document";
import { DocumentCard } from "./DocumentCard";
import { useState } from "react";

interface DocumentListProps {
  onView: (doc: Document) => void;
  onManage: (doc: Document) => void;
  onCancel: (doc: Document) => void;
  onResend: (doc: Document) => void;
}

export function DocumentList({
  onView,
  onManage,
  onCancel,
  onResend,
}: DocumentListProps) {
  const { getPagedDocuments, getFilteredDocuments, pagination, setPagination } = useSign();

  const pagedDocuments = getPagedDocuments();
  const filteredDocuments = getFilteredDocuments();
  const totalPages = Math.ceil(filteredDocuments.length / pagination.pageSize) || 1;

  if (pagedDocuments.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--secondary)] mb-2">No documents found</p>
          <p className="text-xs text-[var(--secondary)]">
            Adjust your filters or create a new document
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {pagedDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={onView}
              onManage={onManage}
              onCancel={onCancel}
              onResend={onResend}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {filteredDocuments.length > pagination.pageSize && (
        <div className="border-t border-[var(--border)] px-4 py-3 flex items-center justify-between bg-[var(--card-bg)]">
          <div className="text-sm text-[var(--secondary)]">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, filteredDocuments.length)} of{" "}
            {filteredDocuments.length} documents
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination(pagination.page - 1, pagination.pageSize)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded border border-[var(--border)] text-sm disabled:opacity-50 hover:bg-[var(--background)]"
            >
              Previous
            </button>
            <div className="flex items-center gap-1 px-3">
              <span className="text-sm text-[var(--secondary)]">
                Page {pagination.page} of {totalPages}
              </span>
            </div>
            <button
              onClick={() => setPagination(pagination.page + 1, pagination.pageSize)}
              disabled={pagination.page >= totalPages}
              className="px-3 py-1 rounded border border-[var(--border)] text-sm disabled:opacity-50 hover:bg-[var(--background)]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
