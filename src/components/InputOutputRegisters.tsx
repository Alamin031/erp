"use client";

import type { Transaction, Vendor } from "@/types/vat";

interface Props { transactions: Transaction[]; vendors: Vendor[] }

export function InputOutputRegisters({ transactions }: Props) {
  const inputs = transactions.filter(t => t.type === 'Purchase');
  const outputs = transactions.filter(t => t.type === 'Sale');
  return (
    <div className="space-y-6">
      <div className="bg-[#18181b] rounded-2xl shadow-lg border border-gray-700 p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-100">Input VAT Register</h3>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-700 bg-[#23232a]">
          <table className="min-w-full text-sm text-left text-gray-200">
            <thead className="bg-[#23232a] text-gray-400">
              <tr>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Invoice</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                <th className="px-4 py-2 font-medium">VAT</th>
                <th className="px-4 py-2 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {inputs.slice(0,10).map(i => (
                <tr key={i.id} className="border-t border-gray-700 hover:bg-[#23232a]/80">
                  <td className="px-4 py-2">{i.date.slice(0,10)}</td>
                  <td className="px-4 py-2">{i.invoiceNumber}</td>
                  <td className="px-4 py-2">{i.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{i.vatAmount.toFixed(2)}</td>
                  <td className="px-4 py-2">{i.vatCategory}</td>
                </tr>
              ))}
              {inputs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-500">No input transactions</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-[#18181b] rounded-2xl shadow-lg border border-gray-700 p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-100">Output VAT Register</h3>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-700 bg-[#23232a]">
          <table className="min-w-full text-sm text-left text-gray-200">
            <thead className="bg-[#23232a] text-gray-400">
              <tr>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Invoice</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                <th className="px-4 py-2 font-medium">VAT</th>
                <th className="px-4 py-2 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {outputs.slice(0,10).map(o => (
                <tr key={o.id} className="border-t border-gray-700 hover:bg-[#23232a]/80">
                  <td className="px-4 py-2">{o.date.slice(0,10)}</td>
                  <td className="px-4 py-2">{o.invoiceNumber}</td>
                  <td className="px-4 py-2">{o.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{o.vatAmount.toFixed(2)}</td>
                  <td className="px-4 py-2">{o.vatCategory}</td>
                </tr>
              ))}
              {outputs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-500">No output transactions</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
