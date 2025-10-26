"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { billFormSchema, BillFormData } from "@/lib/bills-validation";
import { Bill } from "@/types/bills";
import { useToast } from "@/components/toast";

interface AddEditBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onSave: (bill: Bill) => void;
}

export function AddEditBillModal({
  isOpen,
  onClose,
  bill,
  onSave,
}: AddEditBillModalProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BillFormData>({
    resolver: zodResolver(billFormSchema),
    defaultValues: bill
      ? {
          vendorName: bill.vendorName,
          vendorEmail: bill.vendorEmail || "",
          vendorPhone: bill.vendorPhone || "",
          billDate: bill.billDate.split("T")[0],
          dueDate: bill.dueDate.split("T")[0],
          amount: bill.amount,
          status: bill.status,
          notes: bill.notes || "",
        }
      : {
          vendorName: "",
          vendorEmail: "",
          vendorPhone: "",
          billDate: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          amount: 0,
          status: "Pending",
          notes: "",
        },
  });

  useEffect(() => {
    if (bill) {
      reset({
        vendorName: bill.vendorName,
        vendorEmail: bill.vendorEmail || "",
        vendorPhone: bill.vendorPhone || "",
        billDate: bill.billDate.split("T")[0],
        dueDate: bill.dueDate.split("T")[0],
        amount: bill.amount,
        status: bill.status,
        notes: bill.notes || "",
      });
    } else {
      reset({
        vendorName: "",
        vendorEmail: "",
        vendorPhone: "",
        billDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        amount: 0,
        status: "Pending",
        notes: "",
      });
    }
  }, [bill, isOpen, reset]);

  const onSubmit = async (data: BillFormData) => {
    setIsLoading(true);
    try {
      const newBill: Bill = {
        id: bill?.id || `bill-${Date.now()}`,
        billNumber: bill?.billNumber || `BILL-${Date.now()}`,
        vendorName: data.vendorName,
        vendorEmail: data.vendorEmail,
        vendorPhone: data.vendorPhone,
        billDate: new Date(data.billDate).toISOString(),
        dueDate: new Date(data.dueDate).toISOString(),
        amount: data.amount,
        status: data.status,
        notes: data.notes,
        lineItems: bill?.lineItems || [],
        attachments: bill?.attachments || [],
        createdAt: bill?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSave(newBill);
      showToast(bill ? "Bill updated successfully" : "Bill created successfully", "success");
      onClose();
    } catch (error) {
      showToast("Error saving bill", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="relative bg-[#181A20] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-[#1F2128] sticky top-0 z-10">
              <h2 className="text-xl font-semibold text-white">{bill ? "Edit Bill" : "Add New Bill"}</h2>
              <button className="hover:bg-gray-800 rounded-full p-1 transition" onClick={onClose} aria-label="Close"><X size={22} className="text-gray-300" /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Vendor Name *</label>
                  <input
                    {...register("vendorName")}
                    placeholder="Vendor name"
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                  {errors.vendorName && (
                    <p className="text-red-400 text-xs mt-1">{errors.vendorName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Status</label>
                  <select
                    {...register("status")}
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Vendor Email</label>
                  <input
                    {...register("vendorEmail")}
                    type="email"
                    placeholder="vendor@example.com"
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                  {errors.vendorEmail && (
                    <p className="text-red-400 text-xs mt-1">{errors.vendorEmail.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Vendor Phone</label>
                  <input
                    {...register("vendorPhone")}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Bill Date *</label>
                  <input
                    {...register("billDate")}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billDate && (
                    <p className="text-red-400 text-xs mt-1">{errors.billDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Due Date *</label>
                  <input
                    {...register("dueDate")}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.dueDate && (
                    <p className="text-red-400 text-xs mt-1">{errors.dueDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Amount *</label>
                  <input
                    {...register("amount", { valueAsNumber: true })}
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                  {errors.amount && (
                    <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Notes</label>
                <textarea
                  {...register("notes")}
                  placeholder="Additional notes..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>

              <div className="border-t border-gray-700 pt-4">
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Attachments</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center bg-gray-800">
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">Drag and drop files here or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, Excel, Word files accepted</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-6 border-t border-gray-700 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  {isLoading ? "Saving..." : bill ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
