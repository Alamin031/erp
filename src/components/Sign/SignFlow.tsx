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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: '-50%', x: '-50%' }}
            animate={{ scale: 1, opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ scale: 0.95, opacity: 0, y: '-50%', x: '-50%' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: 'calc(100% - 32px)',
              maxWidth: 560,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--card)',
              borderRadius: 12,
              border: '1px solid var(--border)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
              zIndex: 10001,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <h2 style={{ 
                fontSize: 18, 
                fontWeight: 600, 
                color: 'var(--foreground)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginRight: 12
              }}>
                Sign Document
              </h2>
              <button
                onClick={onClose}
                disabled={isLoading}
                style={{
                  padding: 6,
                  border: 'none',
                  background: 'transparent',
                  borderRadius: 6,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--muted)',
                  opacity: isLoading ? 0.5 : 1,
                  flexShrink: 0
                }}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.background = 'var(--background)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--background)',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', maxWidth: '100%' }}>
                {[1, 2, 3].map((s) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        minWidth: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 700,
                        transition: 'all 0.2s ease',
                        background: s <= step ? 'var(--primary)' : 'var(--border)',
                        color: s <= step ? '#fff' : 'var(--muted)'
                      }}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div
                        style={{
                          width: 60,
                          height: 3,
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          background: s < step ? 'var(--primary)' : 'var(--border)'
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ 
                marginTop: 12, 
                fontSize: 13, 
                fontWeight: 600, 
                color: 'var(--foreground)',
                textAlign: 'center'
              }}>
                {step === 1 && "Confirm Identity"}
                {step === 2 && "Accept Terms"}
                {step === 3 && "Sign Document"}
              </div>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              overflowY: 'auto',
              overflowX: 'hidden',
              flex: 1
            }}>
              {error && (
                <div style={{
                  padding: 12,
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 8
                }}>
                  <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 500 }}>{error}</p>
                </div>
              )}

              {/* Step 1: Identity */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                    Please confirm your identity
                  </p>

                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: 8,
                    padding: 12
                  }}>
                    <p style={{ fontSize: 12, color: '#1e40af', lineHeight: 1.5, wordBreak: 'break-word' }}>
                      <strong>Demo Mode:</strong> Identity verification is simulated. In production, this would include OTP, KBA, or OAuth verification.
                    </p>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--foreground)',
                      marginBottom: 8
                    }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="form-input"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--foreground)',
                      marginBottom: 8
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="form-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Consent */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{
                    background: 'var(--background)',
                    borderRadius: 8,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    maxHeight: 256,
                    overflowY: 'auto'
                  }}>
                    <h3 style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: 15 }}>
                      Signing Agreement
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                      By signing this document, you acknowledge that:
                    </p>
                    <ul style={{
                      fontSize: 13,
                      color: 'var(--muted)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      listStyle: 'disc',
                      paddingLeft: 24
                    }}>
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

                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 12,
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      style={{ marginTop: 2, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.5 }}>
                      I confirm I am authorized to sign this document and accept all terms above
                    </span>
                  </label>
                </div>
              )}

              {/* Step 3: Signature */}
              {step === 3 && (
                <div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
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
            <div style={{
              position: 'sticky',
              bottom: 0,
              borderTop: '1px solid var(--border)',
              padding: '14px 20px',
              background: 'var(--card)',
              display: 'flex',
              gap: 10,
              flexShrink: 0
            }}>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>

              {step < 3 && (
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    opacity: isLoading ? 0.5 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
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
