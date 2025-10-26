"use client";

import type { Transaction, Vendor } from "@/types/vat";

interface Props { transactions: Transaction[]; vendors: Vendor[] }

export function InputOutputRegisters({ transactions }: Props) {
  const inputs = transactions.filter(t => t.type === 'Purchase');
  const outputs = transactions.filter(t => t.type === 'Sale');
  return (
    <div className="space-y-4">
      <div className="table-container">
        <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Input VAT Register</h3></div>
        <table>
          <thead><tr><th>Date</th><th>Invoice</th><th>Amount</th><th>VAT</th><th>Category</th></tr></thead>
          <tbody>
            {inputs.slice(0,10).map(i => (<tr key={i.id}><td>{i.date.slice(0,10)}</td><td>{i.invoiceNumber}</td><td>{i.amount.toFixed(2)}</td><td>{i.vatAmount.toFixed(2)}</td><td>{i.vatCategory}</td></tr>))}
          </tbody>
        </table>
      </div>
      <div className="table-container">
        <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Output VAT Register</h3></div>
        <table>
          <thead><tr><th>Date</th><th>Invoice</th><th>Amount</th><th>VAT</th><th>Category</th></tr></thead>
          <tbody>
            {outputs.slice(0,10).map(o => (<tr key={o.id}><td>{o.date.slice(0,10)}</td><td>{o.invoiceNumber}</td><td>{o.amount.toFixed(2)}</td><td>{o.vatAmount.toFixed(2)}</td><td>{o.vatCategory}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
