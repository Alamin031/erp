import { Bill } from "@/types/bills";

export class BillsExporter {
  static exportToCSV(bills: Bill[]): string {
    const headers = [
      "Bill ID",
      "Vendor Name",
      "Bill Date",
      "Due Date",
      "Amount",
      "Status",
      "Payment Date",
      "Reference Number",
    ];

    const rows = bills.map((bill) => [
      bill.billNumber,
      bill.vendorName,
      new Date(bill.billDate).toLocaleDateString(),
      new Date(bill.dueDate).toLocaleDateString(),
      bill.amount.toFixed(2),
      bill.status,
      bill.paymentDate ? new Date(bill.paymentDate).toLocaleDateString() : "-",
      bill.referenceNumber || "-",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell);
            if (cellStr.includes(",") || cellStr.includes('"')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(",")
      ),
    ].join("\n");

    return csv;
  }

  static generatePDFContent(bills: Bill[]): string {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Bills Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .summary {
          margin-bottom: 30px;
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .summary-card {
          flex: 1;
          min-width: 200px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .summary-card h4 {
          margin: 0 0 10px 0;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
        }
        .summary-card .value {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        thead {
          background-color: #f0f0f0;
          border-top: 2px solid #333;
          border-bottom: 2px solid #333;
        }
        th {
          padding: 12px;
          text-align: left;
          font-weight: bold;
          font-size: 12px;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
          font-size: 12px;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .number {
          text-align: right;
        }
        .status {
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
        }
        .status.pending { background-color: #fff3cd; color: #856404; }
        .status.paid { background-color: #d4edda; color: #155724; }
        .status.overdue { background-color: #f8d7da; color: #842029; }
        .status.cancelled { background-color: #e2e3e5; color: #383d41; }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 10px;
          color: #999;
          text-align: center;
        }
        @media print {
          body { margin: 0; }
          .header { page-break-after: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Bills Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
    `;

    // Add summary statistics
    const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
    const paidBills = bills.filter((b) => b.status === "Paid");
    const pendingBills = bills.filter((b) => b.status !== "Paid");
    const overdueBills = bills.filter(
      (b) => b.status !== "Paid" && new Date(b.dueDate) < new Date()
    );

    html += `
      <div class="summary">
        <div class="summary-card">
          <h4>Total Bills</h4>
          <div class="value">${bills.length}</div>
        </div>
        <div class="summary-card">
          <h4>Total Amount</h4>
          <div class="value">$${totalAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
        </div>
        <div class="summary-card">
          <h4>Paid Bills</h4>
          <div class="value">${paidBills.length}</div>
        </div>
        <div class="summary-card">
          <h4>Pending Bills</h4>
          <div class="value">${pendingBills.length}</div>
        </div>
        <div class="summary-card">
          <h4>Overdue Bills</h4>
          <div class="value">${overdueBills.length}</div>
        </div>
      </div>
    `;

    // Add table
    html += `
      <table>
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Vendor Name</th>
            <th>Bill Date</th>
            <th>Due Date</th>
            <th class="number">Amount</th>
            <th>Status</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    bills.forEach((bill) => {
      const statusClass = bill.status.toLowerCase();
      html += `
        <tr>
          <td>${bill.billNumber}</td>
          <td>${bill.vendorName}</td>
          <td>${new Date(bill.billDate).toLocaleDateString()}</td>
          <td>${new Date(bill.dueDate).toLocaleDateString()}</td>
          <td class="number">$${bill.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
          <td><span class="status ${statusClass}">${bill.status}</span></td>
          <td>${bill.paymentDate ? new Date(bill.paymentDate).toLocaleDateString() : "-"}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
      <div class="footer">
        <p>This is an automatically generated report. Please keep this document confidential.</p>
      </div>
    </body>
    </html>
    `;

    return html;
  }

  static downloadCSV(bills: Bill[]): void {
    const csv = this.exportToCSV(bills);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    );
    element.setAttribute("download", `bills-${new Date().toISOString().split("T")[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  static downloadPDF(bills: Bill[]): void {
    const html = this.generatePDFContent(bills);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/html;charset=utf-8," + encodeURIComponent(html)
    );
    element.setAttribute("download", `bills-${new Date().toISOString().split("T")[0]}.html`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
