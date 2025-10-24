"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, ChevronRight, ChevronLeft, Upload } from "lucide-react";
import { DocumentRequest, SigningOrder } from "@/types/document";
import { useSign } from "@/store/useSign";
import { useToast } from "@/components/toast";

interface SendDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
}

interface SignerInput {
  email: string;
  name: string;
}

interface FieldInput {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  assignedTo: string;
}

export function SendDocumentModal({
  isOpen,
  onClose,
  initialTitle,
}: SendDocumentModalProps) {
  const { createDocument } = useSign();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(initialTitle || "");
  const [fileName, setFileName] = useState("");
  const [signers, setSigners] = useState<SignerInput[]>([
    { email: "", name: "" },
  ]);
  const [signingOrder, setSigningOrder] = useState<SigningOrder>("parallel");
  const [fields, setFields] = useState<FieldInput[]>([
    { page: 1, x: 100, y: 250, width: 200, height: 60, assignedTo: "" },
  ]);
  const [message, setMessage] = useState("");
  const [expiresIn, setExpiresIn] = useState(30);
  const [reminders, setReminders] = useState<"daily" | "weekly" | "once">(
    "daily"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSigner = () => {
    setSigners([...signers, { email: "", name: "" }]);
  };

  const handleRemoveSigner = (idx: number) => {
    setSigners(signers.filter((_, i) => i !== idx));
  };

  const handleSignerChange = (
    idx: number,
    field: keyof SignerInput,
    value: string
  ) => {
    const newSigners = [...signers];
    newSigners[idx][field] = value;
    setSigners(newSigners);
  };

  const handleAddField = () => {
    setFields([
      ...fields,
      { page: 1, x: 100, y: 300, width: 200, height: 60, assignedTo: "" },
    ]);
  };

  const handleRemoveField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (
    idx: number,
    field: keyof FieldInput,
    value: string | number
  ) => {
    const newFields = [...fields];
    // Use a spread + computed property and assert the result as FieldInput
    // to avoid indexing with `any` while keeping type safety.
    newFields[idx] = { ...newFields[idx], [field]: value } as FieldInput;
    setFields(newFields);
  };

  const validateStep = (): boolean => {
    setError(null);

    if (step === 1) {
      if (!title.trim()) {
        setError("Document title is required");
        return false;
      }
      if (!fileName.trim()) {
        setError("File name is required");
        return false;
      }
    } else if (step === 2) {
      if (signers.length === 0) {
        setError("At least one signer is required");
        return false;
      }
      if (signers.some((s) => !s.email.trim() || !s.name.trim())) {
        setError("All signers must have email and name");
        return false;
      }
    } else if (step === 3) {
      if (fields.length === 0) {
        setError("At least one signature field is required");
        return false;
      }
      if (fields.some((f) => !f.assignedTo)) {
        setError("All fields must be assigned to a signer");
        return false;
      }
    } else if (step === 4) {
      if (expiresIn < 1) {
        setError("Expiration period must be at least 1 day");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    setError(null);

    try {
      const request: DocumentRequest = {
        title,
        fileName,
        signers,
        signingOrder,
        fields: fields.map(({ assignedTo, ...rest }) => ({
          ...rest,
          assignedTo,
          id: `field-${Date.now()}-${Math.random()}`,
        })),
        message,
        expiresIn,
        reminders: { frequency: reminders },
      };

      await createDocument(
        request,
        "current-user",
        "user@orionhotel.com",
        "Current User"
      );

      showToast("Document created successfully", "success");
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setFileName("");
    setSigners([{ email: "", name: "" }]);
    setSigningOrder("parallel");
    setFields([
      { page: 1, x: 100, y: 250, width: 200, height: 60, assignedTo: "" },
    ]);
    setMessage("");
    setExpiresIn(30);
    setReminders("daily");
    setError(null);
  };

  const signerEmails = signers.map((s) => s.email);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="modal-overlay" onClick={onClose} />

          <div className="modal">
            <motion.div 
              className="modal-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              style={{ maxWidth: 700, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Header */}
              <div className="modal-header">
                <h2>Send Document</h2>
                <button className="modal-close" onClick={onClose} disabled={isLoading}>
                  <X size={20} />
                </button>
              </div>

              {/* Progress Indicator */}
              <div style={{ 
                padding: '16px 24px', 
                borderBottom: '1px solid var(--border)',
                background: 'var(--background)'
              }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                          background: s <= step ? 'var(--primary)' : 'var(--border)',
                          color: s <= step ? 'white' : 'var(--muted)'
                        }}
                      >
                        {s}
                      </div>
                      {s < 4 && (
                        <div
                          style={{
                            flex: 1,
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
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
                  {step === 1 && "Upload Document"}
                  {step === 2 && "Add Recipients"}
                  {step === 3 && "Place Signature Fields"}
                  {step === 4 && "Message & Expiration"}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                {error && (
                  <div style={{ 
                    padding: 12, 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)', 
                    borderRadius: 8,
                    marginBottom: 16
                  }}>
                    <p style={{ fontSize: 13, color: '#ef4444' }}>{error}</p>
                  </div>
                )}

                {/* Step 1: Upload Document */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
                        Document Title <span style={{ color: '#dc3545' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Service Agreement"
                        className="form-input"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
                        File Name <span style={{ color: '#dc3545' }}>*</span>
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                          placeholder="e.g., agreement.pdf"
                          className="form-input"
                          style={{ flex: 1 }}
                        />
                        <button
                          disabled
                          className="btn btn-secondary"
                          style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.5 }}
                        >
                          <Upload size={16} />
                        </button>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                        Demo mode: File upload simulation
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Add Recipients */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ marginBottom: 8 }}>
                      <h3 style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 12, fontSize: 15 }}>
                        Signing Order
                      </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: 12, 
                        padding: 12, 
                        border: '1px solid var(--border)', 
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <input
                          type="radio"
                          name="order"
                          value="parallel"
                          checked={signingOrder === "parallel"}
                          onChange={(e) => setSigningOrder(e.target.value as SigningOrder)}
                          style={{ marginTop: 2, cursor: 'pointer', accentColor: 'var(--primary)' }}
                        />
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)', marginBottom: 4 }}>
                            Parallel (Everyone at once)
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                            All signers can sign simultaneously
                          </p>
                        </div>
                      </label>

                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: 12, 
                        padding: 12, 
                        border: '1px solid var(--border)', 
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <input
                          type="radio"
                          name="order"
                          value="sequential"
                          checked={signingOrder === "sequential"}
                          onChange={(e) => setSigningOrder(e.target.value as SigningOrder)}
                          style={{ marginTop: 2, cursor: 'pointer', accentColor: 'var(--primary)' }}
                        />
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)', marginBottom: 4 }}>
                            Sequential (One at a time)
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                            Signers sign in the order listed below
                          </p>
                        </div>
                      </label>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <h3 style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: 15 }}>
                          Recipients
                        </h3>
                        <button
                          onClick={handleAddSigner}
                          className="btn btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 12px' }}
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {signers.map((signer, idx) => (
                          <div key={idx} style={{ 
                            padding: 12, 
                            border: '1px solid var(--border)', 
                            borderRadius: 8,
                            background: 'var(--background)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                              <span style={{ 
                                fontSize: 11, 
                                fontWeight: 700, 
                                color: 'var(--primary)', 
                                background: 'rgba(var(--primary-rgb), 0.1)', 
                                padding: '4px 8px', 
                                borderRadius: 6
                              }}>
                                {idx + 1}
                              </span>
                              {signers.length > 1 && (
                                <button
                                  onClick={() => handleRemoveSigner(idx)}
                                  style={{
                                    marginLeft: 'auto',
                                    padding: 4,
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    borderRadius: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <input
                                type="email"
                                value={signer.email}
                                onChange={(e) =>
                                  handleSignerChange(idx, "email", e.target.value)
                                }
                                placeholder="Email address"
                                className="form-input"
                                style={{ width: '100%', fontSize: 13 }}
                              />
                              <input
                                type="text"
                                value={signer.name}
                                onChange={(e) =>
                                  handleSignerChange(idx, "name", e.target.value)
                                }
                                placeholder="Full name"
                                className="form-input"
                                style={{ width: '100%', fontSize: 13 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Signature Fields */}
                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                      Define where each signer should place their signature. In demo mode, you specify page and coordinates.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: 15 }}>
                        Signature Fields
                      </h3>
                      <button
                        onClick={handleAddField}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 12px' }}
                      >
                        <Plus size={16} />
                        Add Field
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }}>
                      {fields.map((field, idx) => (
                        <div key={idx} style={{ 
                          padding: 12, 
                          border: '1px solid var(--border)', 
                          borderRadius: 8,
                          background: 'var(--background)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                            <span style={{ 
                              fontSize: 11, 
                              fontWeight: 700, 
                              color: 'var(--primary)', 
                              background: 'rgba(var(--primary-rgb), 0.1)', 
                              padding: '4px 8px', 
                              borderRadius: 6
                            }}>
                              Field {idx + 1}
                            </span>
                            {fields.length > 1 && (
                              <button
                                onClick={() => handleRemoveField(idx)}
                                style={{
                                  marginLeft: 'auto',
                                  padding: 4,
                                  border: 'none',
                                  background: 'transparent',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  borderRadius: 4,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div>
                              <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                                Page
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={field.page}
                                onChange={(e) =>
                                  handleFieldChange(idx, "page", Number(e.target.value))
                                }
                                className="form-input"
                                style={{ width: '100%', fontSize: 13 }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                                Assigned To
                              </label>
                              <select
                                value={field.assignedTo}
                                onChange={(e) =>
                                  handleFieldChange(idx, "assignedTo", e.target.value)
                                }
                                className="form-input"
                                style={{ width: '100%', fontSize: 13 }}
                              >
                                <option value="">Select signer...</option>
                                {signers.map((s, i) => (
                                  <option key={i} value={s.email}>
                                    {s.name || s.email}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                                X Position
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={field.x}
                                onChange={(e) =>
                                  handleFieldChange(idx, "x", Number(e.target.value))
                                }
                                className="form-input"
                                style={{ width: '100%', fontSize: 13 }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                                Y Position
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={field.y}
                                onChange={(e) =>
                                  handleFieldChange(idx, "y", Number(e.target.value))
                                }
                                className="form-input"
                                style={{ width: '100%', fontSize: 13 }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Message & Expiration */}
                {step === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
                        Message to Signers (Optional)
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a personal message or instructions..."
                        className="form-input"
                        style={{ width: '100%', resize: 'vertical' }}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
                        Expiration Period (Days) <span style={{ color: '#dc3545' }}>*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={expiresIn}
                        onChange={(e) => setExpiresIn(Number(e.target.value))}
                        className="form-input"
                        style={{ width: '100%' }}
                      />
                      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                        Signers must sign by{" "}
                        {new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <label className="form-label" style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
                        Reminder Frequency
                      </label>
                      <select
                        value={reminders}
                        onChange={(e) => setReminders(e.target.value as any)}
                        className="form-input"
                        style={{ width: '100%' }}
                      >
                        <option value="once">Send once</option>
                        <option value="daily">Daily reminders</option>
                        <option value="weekly">Weekly reminders</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="modal-actions" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
                  disabled={isLoading}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <ChevronLeft size={16} />
                  {step === 1 ? "Cancel" : "Back"}
                </button>

                {step < 4 && (
                  <button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                )}

                {step === 4 && (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8,
                      background: '#16a34a'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
                  >
                    {isLoading ? "Creating..." : "Send Document"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
