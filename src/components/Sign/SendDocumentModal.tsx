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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-(--card-bg) rounded-xl border border-(--border) shadow-xl z-50"
          >
            {/* Header */}
            <div className="sticky top-0 px-6 py-4 border-b border-(--border) bg-(--card-bg) flex items-center justify-between">
              <h2 className="text-xl font-semibold text-(--foreground)">
                Send Document
              </h2>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-1 hover:bg-(--background) rounded transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 py-4 border-b border-(--border) bg-(--background)">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                        s <= step
                          ? "bg-(--primary) text-white"
                          : "bg-(--border) text-(--secondary)"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 4 && (
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
                {step === 1 && "Upload Document"}
                {step === 2 && "Add Recipients"}
                {step === 3 && "Place Signature Fields"}
                {step === 4 && "Message & Expiration"}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Step 1: Upload Document */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-(--foreground) mb-2">
                      Document Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Service Agreement"
                      className="w-full px-3 py-2 border border-(--border) rounded-lg bg-(--background) text-(--foreground) placeholder-(--secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--foreground) mb-2">
                      File Name *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="e.g., agreement.pdf"
                        className="flex-1 px-3 py-2 border border-(--border) rounded-lg bg-(--background) text-(--foreground) placeholder-(--secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                      />
                      <button
                        disabled
                        className="px-4 py-2 border border-(--border) rounded-lg hover:bg-(--background) text-(--secondary) opacity-50 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-(--secondary) mt-1">
                      Demo mode: File upload simulation
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Add Recipients */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-(--foreground)">
                      Signing Order
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-3 border border-(--border) rounded-lg cursor-pointer hover:bg-(--background)">
                      <input
                        type="radio"
                        name="order"
                        value="parallel"
                        checked={signingOrder === "parallel"}
                        onChange={(e) => setSigningOrder(e.target.value as SigningOrder)}
                      />
                      <div>
                        <p className="text-sm font-medium text-(--foreground)">
                          Parallel (Everyone at once)
                        </p>
                        <p className="text-xs text-(--secondary)">
                          All signers can sign simultaneously
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-3 border border-(--border) rounded-lg cursor-pointer hover:bg-(--background)">
                      <input
                        type="radio"
                        name="order"
                        value="sequential"
                        checked={signingOrder === "sequential"}
                        onChange={(e) => setSigningOrder(e.target.value as SigningOrder)}
                      />
                      <div>
                        <p className="text-sm font-medium text-(--foreground)">
                          Sequential (One at a time)
                        </p>
                        <p className="text-xs text-(--secondary)">
                          Signers sign in the order listed below
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="border-t border-(--border) pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-(--foreground)">
                        Recipients
                      </h3>
                      <button
                        onClick={handleAddSigner}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-(--primary) hover:opacity-90 text-white rounded transition-opacity"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    <div className="space-y-3">
                      {signers.map((signer, idx) => (
                        <div key={idx} className="p-3 border border-(--border) rounded-lg bg-(--background)">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-xs font-bold text-(--primary) bg-(--primary)/10 px-2 py-1 rounded">
                              {idx + 1}
                            </span>
                            {signers.length > 1 && (
                              <button
                                onClick={() => handleRemoveSigner(idx)}
                                className="ml-auto p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-2">
                            <input
                              type="email"
                              value={signer.email}
                              onChange={(e) =>
                                handleSignerChange(idx, "email", e.target.value)
                              }
                              placeholder="Email address"
                              className="w-full px-2 py-1 text-sm border border-(--border) rounded bg-(--card-bg) text-(--foreground) placeholder-(--secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                            />
                            <input
                              type="text"
                              value={signer.name}
                              onChange={(e) =>
                                handleSignerChange(idx, "name", e.target.value)
                              }
                              placeholder="Full name"
                              className="w-full px-2 py-1 text-sm border border-(--border) rounded bg-(--card-bg) text-(--foreground) placeholder-(--secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
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
                <div className="space-y-4">
                  <p className="text-sm text-(--secondary)">
                    Define where each signer should place their signature. In demo mode, you specify page and coordinates.
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-(--foreground)">
                      Signature Fields
                    </h3>
                    <button
                      onClick={handleAddField}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-(--primary) hover:opacity-90 text-white rounded transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {fields.map((field, idx) => (
                      <div key={idx} className="p-3 border border-(--border) rounded-lg bg-(--background)">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-xs font-bold text-(--primary) bg-(--primary)/10 px-2 py-1 rounded">
                            Field {idx + 1}
                          </span>
                          {fields.length > 1 && (
                            <button
                              onClick={() => handleRemoveField(idx)}
                              className="ml-auto p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-(--secondary)">
                              Page
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={field.page}
                              onChange={(e) =>
                                handleFieldChange(idx, "page", Number(e.target.value))
                              }
                              className="w-full px-2 py-1 text-sm border border-(--border) rounded bg-(--card-bg) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-(--secondary)">
                              Assigned To
                            </label>
                            <select
                              value={field.assignedTo}
                              onChange={(e) =>
                                handleFieldChange(idx, "assignedTo", e.target.value)
                              }
                              className="w-full px-2 py-1 text-sm border border-(--border) rounded bg-(--card-bg) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--primary)"
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
                            <label className="text-xs text-(--secondary)">
                              X Position
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={field.x}
                              onChange={(e) =>
                                handleFieldChange(idx, "x", Number(e.target.value))
                              }
                              className="w-full px-2 py-1 text-sm border border-(--border) rounded bg-(--card-bg) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-(--secondary)">
                              Y Position
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={field.y}
                              onChange={(e) =>
                                handleFieldChange(idx, "y", Number(e.target.value))
                              }
                              className="w-full px-2 py-1 text-sm border border-(--border) rounded bg-(--card-bg) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--primary)"
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-(--foreground) mb-2">
                      Message to Signers (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add a personal message or instructions..."
                      className="w-full px-3 py-2 border border-(--border) rounded-lg bg-(--background) text-(--foreground) placeholder-(--secondary) focus:outline-none focus:ring-2 focus:ring-(--primary) text-sm"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--foreground) mb-2">
                      Expiration Period (Days) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={expiresIn}
                      onChange={(e) => setExpiresIn(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-(--border) rounded-lg bg-(--background) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                    <p className="text-xs text-(--secondary) mt-1">
                      Signers must sign by{" "}
                      {new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--foreground) mb-2">
                      Reminder Frequency
                    </label>
                    <select
                      value={reminders}
                      onChange={(e) => setReminders(e.target.value as any)}
                      className="w-full px-3 py-2 border border-(--border) rounded-lg bg-(--background) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--primary)"
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
            <div className="sticky bottom-0 border-t border-(--border) px-6 py-4 bg-(--card-bg) flex gap-2 justify-between">
              <button
                onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-lg text-(--foreground) hover:bg-(--background) font-medium transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                {step === 1 ? "Cancel" : "Back"}
              </button>

              {step < 4 && (
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-(--primary) hover:opacity-90 text-white rounded-lg font-medium transition-opacity disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 4 && (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Send Document"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
