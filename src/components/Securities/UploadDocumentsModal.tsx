"use client";

import { useState } from "react";
import { Document } from "@/types/securities";
import { useSecurities } from "@/store/useSecurities";
import { useToast } from "@/components/toast";
import { Trash2, File } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  securityId: string;
  onDocumentsUpdated?: (documents: Document[]) => void;
}

export function UploadDocumentsModal({ isOpen, onClose, securityId, onDocumentsUpdated }: Props) {
  const { securities, updateSecurity } = useSecurities();
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [fileName, setFileName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const security = securities.find((s) => s.id === securityId);

  if (!isOpen || !security) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const newDocs: Document[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newDocs.push({
        id: `DOC-${Date.now()}`,
        name: file.name,
        url,
        type: file.type || file.name.split(".").pop() || "unknown",
        uploadedAt: new Date().toISOString(),
      });
    });

    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const removeDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const saveDocuments = () => {
    setIsAdding(true);
    try {
      const allDocuments = [...(security.documents || []), ...documents];
      updateSecurity(securityId, { documents: allDocuments });
      showToast("Documents uploaded successfully", "success");
      onDocumentsUpdated?.(allDocuments);
      setDocuments([]);
      onClose();
    } catch (e) {
      showToast((e as Error).message || "Failed to upload documents", "error");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <h2>Upload Documents</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Files (PDF, Images, etc.)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
              <File size={32} className="mx-auto text-gray-400 mb-2" />
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">Click to upload</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG, DOC up to 10MB</p>
            </div>
          </div>

          {documents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Files to Upload ({documents.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded p-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <File size={16} className="text-blue-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-600">{doc.type}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600 shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {security.documents && security.documents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Existing Documents ({security.documents.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {security.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <File size={16} className="text-gray-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-600">Uploaded: {doc.uploadedAt.split("T")[0]}</p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              onClick={saveDocuments}
              disabled={isAdding || documents.length === 0}
              className="btn btn-primary"
            >
              {isAdding ? "Uploading..." : "Upload Documents"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
