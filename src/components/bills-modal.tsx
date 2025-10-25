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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">
                {bill ? "Edit Bill" : "Add New Bill"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Name *
                  </label>
                  <input
                    {...register("vendorName")}
                    placeholder="Vendor name"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.vendorName && (
                    <p className="text-red-600 text-xs mt-1">{errors.vendorName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Email
                  </label>
                  <input
                    {...register("vendorEmail")}
                    type="email"
                    placeholder="vendor@example.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.vendorEmail && (
                    <p className="text-red-600 text-xs mt-1">{errors.vendorEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Phone
                  </label>
                  <input
                    {...register("vendorPhone")}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bill Date *
                  </label>
                  <input
                    {...register("billDate")}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billDate && (
                    <p className="text-red-600 text-xs mt-1">{errors.billDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    {...register("dueDate")}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.dueDate && (
                    <p className="text-red-600 text-xs mt-1">{errors.dueDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    {...register("amount", { valueAsNumber: true })}
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.amount && (
                    <p className="text-red-600 text-xs mt-1">{errors.amount.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  {...register("notes")}
                  placeholder="Additional notes..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Drag and drop files here or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, Excel, Word files accepted</p>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
