"use client";

import { Document } from "@/types/document";
import { Check, Clock, X } from "lucide-react";

interface RecipientListProps {
  document: Document;
  onSignNow?: (doc: Document) => void;
}

export function RecipientList({ document, onSignNow }: RecipientListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "signed":
        return <Check className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "rejected":
        return <X className="w-5 h-5 text-red-600" />;
      case "expired":
        return <X className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {document.signers.map((signer, idx) => (
        <div
          key={signer.id}
          className="p-4 border border-(--border) rounded-lg hover:border-(--primary) transition-colors"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-(--primary)/20 flex items-center justify-center text-sm font-semibold text-(--primary)">
                {signer.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-(--foreground)">
                  {signer.name}
                </p>
                <p className="text-xs text-(--secondary)">{signer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(signer.status)}
              <span className="text-xs font-medium capitalize text-(--foreground)">
                {signer.status}
              </span>
            </div>
          </div>

          {/* Signing order indicator for sequential */}
          {document.signingOrder === "sequential" && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              Position: #{idx + 1} in signing order
            </div>
          )}

          {/* Status details */}
          {signer.status === "signed" && signer.signedAt && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
              Signed on {formatDate(signer.signedAt)} by {signer.signedBy}
            </div>
          )}

          {/* Fields status */}
          <div className="mb-3">
            <p className="text-xs font-medium text-(--secondary) mb-2">
              Signature Fields ({signer.fields.length})
            </p>
            <div className="space-y-1">
              {signer.fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-2 bg-(--background) rounded text-xs"
                >
                  <span className="text-(--foreground)">
                    Page {field.page}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${
                      field.status === "signed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {field.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          {signer.status === "pending" && onSignNow && (
            <button
              onClick={() => onSignNow(document)}
              className="w-full px-3 py-2 bg-(--primary) hover:opacity-90 text-white rounded-lg text-sm font-medium transition-opacity"
            >
              Sign Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
