"use client";

import { useState } from "react";
import { Document } from "@/types/document";
import { SignaturePad } from "./SignaturePad";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useToast } from "@/components/toast";
import { useSign } from "@/store/useSign";

interface SignFlowProps {
  isOpen: boolean;
  document: Document | null;
  signer: Document["signers"][0] | null;
  onClose: () => void;
  onSuccess?: (doc: Document) => void;
}

export function SignFlow({
  isOpen,
  document,
  signer,
  onClose,
  onSuccess,
}: SignFlowProps) {
  const { signField } = useSign();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(signer?.email || "");
  const [fullName, setFullName] = useState(signer?.name || "");
  const [consentChecked, setConsentChecked] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !document || !signer) return null;

  const handleNext = () => {
    setError(null);

    if (step === 1) {
      if (!email.trim() || !fullName.trim()) {
        setError("Email and full name are required");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!consentChecked) {
        setError("You must accept the terms to continue");
        return;
      }
      setStep(3);
    }
  };

  const handleSignature = async (data: string) => {
    setSignatureData(data);

    setIsLoading(true);
    setError(null);

    try {
      for (const field of signer.fields) {
        await signField({
          documentId: document.id,
          fieldId: field.id,
          signatureData: {
            method: "draw",
            timestamp: new Date().toISOString(),
            signerId: signer.id,
            signerEmail: email,
            ipAddress: "192.168.1.1",
            userAgent: navigator.userAgent,
            consentGiven: true,
            signatureImage: data,
          },
        });
      }

      showToast(
        "Document signed successfully! Thank you.",
        "success"
      );

      setTimeout(() => {
        onClose();
        onSuccess?.(document);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign document"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto bg-(--card-bg) rounded-xl border border-(--border) shadow-xl z-50"
          >
            {/* Header */}
            <div className="sticky top-0 px-6 py-4 border-b border-(--border) bg-(--card-bg) flex items-center justify-between">
              <h2 className="text-lg font-semibold text-(--foreground)">
                Sign Document
              </h2>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-1 hover:bg-(--background) rounded transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="px-6 py-4 border-b border-(--border) bg-(--background)">
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-1 flex-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        s <= step
                          ? "bg-(--primary) text-white"
                          : "bg-(--border) text-(--secondary)"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`flex-1 h-1 transition-colors ${
                          s < step ? "bg-(--primary)" : "bg-(--border)"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-(--secondary)">
                {step === 1 && "Confirm Identity"}
                {step === 2 && "Accept Terms"}
                {step === 3 && "Sign Document"}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Step 1: Identity */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-(--secondary)">
                    Please confirm your identity
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-800">
                      <strong>Demo Mode:</strong> Identity verification is simulated. In production, this would include OTP, KBA, or OAuth verification.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--foreground) mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 border border-(--border) rounded-lg bg-(--background) text-(--foreground) placeholder-(--secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--foreground) mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-3 py-2 border border-(--border) rounded-lg bg-(--background) text-(--foreground) placeholder-(--secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Consent */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-(--background) rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                    <h3 className="font-semibold text-(--foreground)">
                      Signing Agreement
                    </h3>
                    <p className="text-sm text-(--secondary)">
                      By signing this document, you acknowledge that:
                    </p>
                    <ul className="text-sm text-(--secondary) space-y-2 list-disc list-inside">
                      <li>
                        You have read and understand the document contents
                      </li>
                      <li>
                        You are authorized to sign this document
                      </li>
                      <li>
                        Your signature is legally binding
                      </li>
                      <li>
                        This electronic signature is valid and enforceable
                      </li>
                    </ul>
                  </div>

                  <label className="flex items-start gap-3 p-3 border border-(--border) rounded-lg cursor-pointer hover:bg-(--background) transition-colors">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-(--foreground)">
                      I confirm I am authorized to sign this document and accept all terms above
                    </span>
                  </label>
                </div>
              )}

              {/* Step 3: Signature */}
              {step === 3 && (
                <div>
                  <p className="text-sm text-(--secondary) mb-4">
                    Choose how to sign below
                  </p>
                  <SignaturePad
                    onSign={handleSignature}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 border-t border-(--border) px-6 py-4 bg-(--card-bg) flex gap-2">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-(--border) rounded-lg text-(--foreground) hover:bg-(--background) font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              {step < 3 && (
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-(--primary) hover:opacity-90 text-white rounded-lg font-medium transition-opacity disabled:opacity-50"
                >
                  Next
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
