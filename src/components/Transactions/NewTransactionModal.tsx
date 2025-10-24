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
      {/* fixed centered wrapper; inner .modal-card holds the visual content */}
      <div className="modal">
        <div className="modal-card" style={{ maxWidth: 700 }}>
          <div className="modal-header">
            <h2>Record New Transaction</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-row">
            <div>
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
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">
                Entity (Shareholder/Employee) *
              </label>
              <input
                className="form-input"
                {...register("entity")}
                placeholder="e.g., John Smith, TechVentures Fund"
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
          </div>

          <div className="form-row">
            <div>
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

          <div className="form-row">
            <div>
              <label className="form-label">Quantity *</label>
              <input
                className="form-input"
                type="number"
                {...register("quantity")}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="form-error">{errors.quantity.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Unit Price / Value *</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                {...register("unitPrice")}
                placeholder="0.00"
              />
              {errors.unitPrice && (
                <p className="form-error">{errors.unitPrice.message}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 6, padding: 12 }}>
              <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600, margin: 0 }}>
                Total Amount (Auto-Calculated)
              </p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)', margin: '8px 0 0 0' }}>
                ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Transaction Date *</label>
              <input className="form-input" type="date" {...register("date")} />
              {errors.date && (
                <p className="form-error">{errors.date.message}</p>
              )}
            </div>
            <div>
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

          <div className="form-row">
            <div>
              <label className="form-label">Notes / Description</label>
              <textarea
                className="form-input"
                {...register("notes")}
                placeholder="Add any relevant notes about this transaction"
                rows={3}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Creating..." : "Create Transaction"}
            </button>
          </div>
          </form>
        </div>
      </div>
    </>
  );
}
