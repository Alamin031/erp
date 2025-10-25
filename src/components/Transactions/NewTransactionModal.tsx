"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransactions } from "@/store/useTransactions";
import {
  newTransactionSchema,
  NewTransactionInput,
} from "@/lib/transactions-validation";
import { useToast } from "@/components/toast";

export function NewTransactionModal({
  isOpen,
  onClose,
  transaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaction?: any;
}) {
  const { createTransaction, shareholders, loadDemoData, updateTransaction } = useTransactions();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<NewTransactionInput>({
    resolver: zodResolver(newTransactionSchema) as Resolver<NewTransactionInput>,
    defaultValues: {
      type: "Issuance",
      securityType: "Common",
      status: "Draft",
    },
  });

  const quantity = watch("quantity");
  const unitPrice = watch("unitPrice");
  const totalAmount = (quantity || 0) * (unitPrice || 0);

  useEffect(() => {
    if (shareholders.length === 0) {
      loadDemoData();
    }
  }, [shareholders.length, loadDemoData]);

  // if editing, prefill the form
  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        securityType: transaction.securityType,
        entity: transaction.entity,
        quantity: transaction.quantity,
        unitPrice: transaction.unitPrice,
        date: transaction.date.split("T")[0],
        status: transaction.status,
        notes: transaction.notes || "",
      });
    } else {
      reset({ type: "Issuance", securityType: "Common", status: "Draft" });
    }
  }, [transaction, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: NewTransactionInput) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 200));
      if (transaction) {
        updateTransaction(transaction.id, {
          date: data.date,
          type: data.type,
          entity: data.entity,
          securityType: data.securityType,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          totalAmount: data.quantity * data.unitPrice,
          status: data.status,
          notes: data.notes,
        });
        showToast("Transaction updated successfully", "success");
      } else {
        createTransaction({
        date: data.date,
        type: data.type,
        entity: data.entity,
        securityType: data.securityType,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalAmount: data.quantity * data.unitPrice,
        status: data.status,
        notes: data.notes,
        documents: [],
        });
        showToast("Transaction created successfully", "success");
      }
      reset();
      onClose();
    } catch (e) {
      showToast(
        (e as Error).message || "Failed to create transaction",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <div className="modal-card" style={{ maxWidth: "700px" }}>
          <div className="modal-header">
            <h2>{transaction ? "Edit Transaction" : "Record New Transaction"}</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            {/* Transaction Type and Entity */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Transaction Type *</label>
                <select className="form-input" {...register("type")}>
                  <option value="Issuance">Issuance</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Cancellation">Cancellation</option>
                  <option value="Conversion">Conversion</option>
                </select>
                {errors.type && (
                  <p className="form-error">{errors.type.message}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Security Type *</label>
                <select className="form-input" {...register("securityType")}>
                  <option value="Common">Common</option>
                  <option value="Preferred">Preferred</option>
                  <option value="Option">Option</option>
                </select>
                {errors.securityType && (
                  <p className="form-error">{errors.securityType.message}</p>
                )}
              </div>
            </div>

            {/* Entity */}
            <div className="form-group">
              <label className="form-label">Entity (Shareholder/Employee) *</label>
              <input
                className="form-input"
                {...register("entity")}
                placeholder="Departed Employee"
                list="shareholders"
              />
              <datalist id="shareholders">
                {shareholders.map((sh) => (
                  <option key={sh.id} value={sh.name} />
                ))}
              </datalist>
              {errors.entity && (
                <p className="form-error">{errors.entity.message}</p>
              )}
            </div>

            {/* Quantity and Unit Price */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input
                  className="form-input"
                  type="number"
                  {...register("quantity")}
                  placeholder="2000"
                />
                {errors.quantity && (
                  <p className="form-error">{errors.quantity.message}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price / Value *</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.01"
                  {...register("unitPrice")}
                  placeholder="1.5"
                />
                {errors.unitPrice && (
                  <p className="form-error">{errors.unitPrice.message}</p>
                )}
              </div>
            </div>

            {/* Total Amount Display */}
            <div className="form-group">
              <div style={{ 
                background: 'rgba(74, 158, 255, 0.1)', 
                border: '1px solid rgba(74, 158, 255, 0.3)', 
                borderRadius: '8px', 
                padding: '16px',
                textAlign: 'center'
              }}>
                <p style={{ 
                  fontSize: '12px', 
                  color: 'var(--secondary)', 
                  fontWeight: '600', 
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Total Amount (Auto-Calculated)
                </p>
                <p style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: 'var(--primary)', 
                  margin: '8px 0 0 0',
                  fontFamily: 'monospace'
                }}>
                  ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Transaction Date and Status */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Transaction Date *</label>
                <input className="form-input" type="date" {...register("date")} />
                {errors.date && (
                  <p className="form-error">{errors.date.message}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" {...register("status")}>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Executed">Executed</option>
                </select>
              </div>
            </div>

            {/* Notes / Description */}
            <div className="form-group">
              <label className="form-label">Notes / Description</label>
              <textarea
                className="form-input"
                {...register("notes")}
                placeholder="Unvested options cancelled upon termination"
                rows={3}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting 
                  ? (transaction ? "Updating..." : "Creating...") 
                  : (transaction ? "Update Transaction" : "Create Transaction")
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
