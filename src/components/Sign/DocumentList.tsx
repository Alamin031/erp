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
      <div style={{ padding: 60, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', marginBottom: 8, fontSize: 15 }}>No documents found</p>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Adjust your filters or create a new document
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Grid */}
      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
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
        <div style={{ 
          borderTop: '1px solid var(--border)', 
          padding: '16px 20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'var(--background)'
        }}>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, filteredDocuments.length)} of{" "}
            {filteredDocuments.length} documents
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setPagination(pagination.page - 1, pagination.pageSize)}
              disabled={pagination.page === 1}
              className="btn btn-secondary"
              style={{ fontSize: 13, padding: '6px 16px' }}
            >
              Previous
            </button>
            <span style={{ fontSize: 13, color: 'var(--muted)', padding: '0 8px' }}>
              Page {pagination.page} of {totalPages}
            </span>
            <button
              onClick={() => setPagination(pagination.page + 1, pagination.pageSize)}
              disabled={pagination.page >= totalPages}
              className="btn btn-secondary"
              style={{ fontSize: 13, padding: '6px 16px' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
