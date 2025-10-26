import type { VatReturn } from "@/types/vat";

export function csvExportReturn(r: VatReturn): Blob {
  const headers = [
    'periodStart','periodEnd','taxableSales','zeroRatedSales','exemptSales','outputVat','inputVat','adjustments','credits','penalties','status'
  ];
  const row = [
    r.periodStart, r.periodEnd, r.taxableSales, r.zeroRatedSales, r.exemptSales, r.outputVat, r.inputVat, r.adjustments, r.credits, r.penalties, r.status
  ].join(',');
  const csv = headers.join(',') + '\n' + row + '\n';
  return new Blob([csv], { type: 'text/csv' });
}

export function pdfExportReturn(r: VatReturn): Blob {
  // Placeholder PDF content (plain text). Replace with real PDF generator later.
  const lines = [
    'VAT RETURN',
    `Period: ${r.periodStart} to ${r.periodEnd}`,
    `Taxable Sales: ${r.taxableSales}`,
    `Output VAT: ${r.outputVat}`,
    `Input VAT: ${r.inputVat}`,
    `Adjustments: ${r.adjustments}`,
    `Credits: ${r.credits}`,
    `Penalties: ${r.penalties}`,
    `Status: ${r.status}`,
  ].join('\n');
  return new Blob([lines], { type: 'application/pdf' });
}
