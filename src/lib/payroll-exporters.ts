import { PayrollRecord, Employee, SalaryStructure } from "@/types/payroll";

export interface ExportOptions {
  month: number;
  year: number;
  department?: string;
  status?: string;
}

export class PayrollExporter {
  static exportToCSV(
    records: PayrollRecord[],
    employees: Employee[],
    options: ExportOptions
  ): string {
    const headers = [
      "Employee ID",
      "Employee Name",
      "Department",
      "Position",
      "Period",
      "Base Salary",
      "Allowances",
      "Gross Salary",
      "Income Tax",
      "Provident Fund",
      "Insurance",
      "Other Deductions",
      "Total Deductions",
      "Net Pay",
      "Payment Status",
      "Payment Date",
      "Payment Method",
    ];

    const rows = records
      .filter((record) => {
        if (options.month && record.month !== options.month) return false;
        if (options.year && record.year !== options.year) return false;
        if (options.status && record.paymentStatus !== options.status)
          return false;
        if (options.department && record.employee?.department !== options.department)
          return false;
        return true;
      })
      .map((record) => {
        const emp = record.employee;
        const grossSalary = record.baseSalary + record.allowances;

        return [
          record.employeeId,
          emp?.name || "Unknown",
          emp?.department || "-",
          emp?.position || "-",
          record.period,
          record.baseSalary.toFixed(2),
          record.allowances.toFixed(2),
          grossSalary.toFixed(2),
          record.incomeTax.toFixed(2),
          record.providentFund.toFixed(2),
          record.insurance.toFixed(2),
          record.otherDeductions.toFixed(2),
          record.deductions.toFixed(2),
          record.netPay.toFixed(2),
          record.paymentStatus,
          record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : "-",
          record.paymentMethod || "-",
        ];
      });

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell);
            if (cellStr.includes(",") || cellStr.includes('"')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(",")
      )
      .join("\n");

    return csv;
  }

  static exportToExcel(
    records: PayrollRecord[],
    employees: Employee[],
    options: ExportOptions
  ): string {
    const csv = this.exportToCSV(records, employees, options);

    // Convert CSV to Base64 for Excel compatibility
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    return blob.toString();
  }

  static generatePDFContent(
    records: PayrollRecord[],
    employees: Employee[],
    options: ExportOptions
  ): string {
    const filteredRecords = records.filter((record) => {
      if (options.month && record.month !== options.month) return false;
      if (options.year && record.year !== options.year) return false;
      if (options.status && record.paymentStatus !== options.status) return false;
      if (options.department && record.employee?.department !== options.department)
        return false;
      return true;
    });

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Payroll Report</title>
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
        .status.processing { background-color: #cfe2ff; color: #084298; }
        .status.failed { background-color: #f8d7da; color: #842029; }
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
        <h1>Payroll Report</h1>
        <p>Period: ${options.month}/${options.year}</p>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
    `;

    // Add summary statistics
    const totalNetPay = filteredRecords.reduce((sum, r) => sum + r.netPay, 0);
    const totalDeductions = filteredRecords.reduce((sum, r) => sum + r.deductions, 0);
    const totalGrossSalary = filteredRecords.reduce(
      (sum, r) => sum + r.baseSalary + r.allowances,
      0
    );
    const paidCount = filteredRecords.filter((r) => r.paymentStatus === "Paid").length;

    html += `
      <div class="summary">
        <div class="summary-card">
          <h4>Total Employees</h4>
          <div class="value">${filteredRecords.length}</div>
        </div>
        <div class="summary-card">
          <h4>Gross Salary</h4>
          <div class="value">$${totalGrossSalary.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}</div>
        </div>
        <div class="summary-card">
          <h4>Total Deductions</h4>
          <div class="value">$${totalDeductions.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}</div>
        </div>
        <div class="summary-card">
          <h4>Net Pay</h4>
          <div class="value">$${totalNetPay.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}</div>
        </div>
        <div class="summary-card">
          <h4>Paid</h4>
          <div class="value">${paidCount}/${filteredRecords.length}</div>
        </div>
      </div>
    `;

    // Add table
    html += `
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Base Salary</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th class="number">Net Pay</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    filteredRecords.forEach((record) => {
      const statusClass = record.paymentStatus.toLowerCase();
      html += `
        <tr>
          <td>${record.employeeId}</td>
          <td>${record.employee?.name || "Unknown"}</td>
          <td>${record.employee?.department || "-"}</td>
          <td class="number">$${record.baseSalary.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}</td>
          <td class="number">$${record.allowances.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}</td>
          <td class="number">$${record.deductions.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}</td>
          <td class="number"><strong>$${record.netPay.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}</strong></td>
          <td><span class="status ${statusClass}">${record.paymentStatus}</span></td>
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

  static downloadFile(
    content: string,
    filename: string,
    mimeType: string = "text/plain"
  ): void {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  static exportCSVFile(
    records: PayrollRecord[],
    employees: Employee[],
    options: ExportOptions
  ): void {
    const csv = this.exportToCSV(records, employees, options);
    const filename = `payroll-${options.month}-${options.year}.csv`;
    this.downloadFile(csv, filename, "text/csv;charset=utf-8");
  }

  static exportExcelFile(
    records: PayrollRecord[],
    employees: Employee[],
    options: ExportOptions
  ): void {
    const csv = this.exportToCSV(records, employees, options);
    const filename = `payroll-${options.month}-${options.year}.xlsx`;
    this.downloadFile(csv, filename, "text/csv;charset=utf-8");
  }

  static exportPDFFile(
    records: PayrollRecord[],
    employees: Employee[],
    options: ExportOptions
  ): void {
    const html = this.generatePDFContent(records, employees, options);
    const filename = `payroll-${options.month}-${options.year}.html`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/html;charset=utf-8," + encodeURIComponent(html)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // For actual PDF, you would need a library like jsPDF or pdfkit
    // For now, we're exporting as HTML which can be printed to PDF
  }
}

export function generatePayslipHTML(record: PayrollRecord): string {
  const employee = record.employee;
  const grossSalary = record.baseSalary + record.allowances;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Payslip</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .payslip {
          background: white;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          border: 1px solid #ddd;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .company-info {
          margin-bottom: 20px;
          font-size: 12px;
          color: #666;
        }
        .employee-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 12px;
        }
        .employee-info div {
          flex: 1;
        }
        .employee-info strong {
          display: block;
          color: #333;
          margin-bottom: 5px;
        }
        table {
          width: 100%;
          margin-bottom: 20px;
          border-collapse: collapse;
        }
        .earnings th, .earnings td {
          padding: 8px;
          text-align: left;
          font-size: 12px;
          border-bottom: 1px solid #ddd;
        }
        .earnings th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        .earnings td:last-child {
          text-align: right;
        }
        .section-title {
          font-weight: bold;
          background-color: #f0f0f0;
          padding: 8px;
          margin-top: 10px;
          font-size: 12px;
        }
        .summary {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding: 15px;
          background-color: #e8f4f8;
          border-radius: 5px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-item .label {
          font-size: 11px;
          color: #666;
        }
        .summary-item .value {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
        .footer {
          margin-top: 30px;
          font-size: 10px;
          color: #999;
          border-top: 1px solid #ddd;
          padding-top: 10px;
          text-align: center;
        }
        @media print {
          body { background: white; }
          .payslip { box-shadow: none; border: none; }
        }
      </style>
    </head>
    <body>
      <div class="payslip">
        <div class="header">
          <h1>PAYSLIP</h1>
          <div class="company-info">
            <strong>Your Company Name</strong><br>
            123 Business Street<br>
            City, State 12345
          </div>
        </div>

        <div class="employee-info">
          <div>
            <strong>Employee:</strong> ${employee?.name || "N/A"}
          </div>
          <div>
            <strong>ID:</strong> ${record.employeeId}
          </div>
          <div>
            <strong>Period:</strong> ${record.period}
          </div>
        </div>

        <table class="earnings">
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
          <tr class="section-title">
            <td colspan="2">Earnings</td>
          </tr>
          <tr>
            <td>Base Salary</td>
            <td>$${record.baseSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>Allowances</td>
            <td>$${record.allowances.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr class="section-title">
            <td colspan="2">Deductions</td>
          </tr>
          <tr>
            <td>Income Tax</td>
            <td>-$${record.incomeTax.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>Provident Fund</td>
            <td>-$${record.providentFund.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>Insurance</td>
            <td>-$${record.insurance.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
          </tr>
        </table>

        <div class="summary">
          <div class="summary-item">
            <div class="label">Gross Salary</div>
            <div class="value">$${grossSalary.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
          </div>
          <div class="summary-item">
            <div class="label">Total Deductions</div>
            <div class="value">$${record.deductions.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
          </div>
          <div class="summary-item">
            <div class="label">Net Pay</div>
            <div class="value">$${record.netPay.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div class="footer">
          <p>This is a confidential document. Please protect your payslip information.</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
