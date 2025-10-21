import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ARInvoice,
  APBill,
  JournalEntry,
  BankAccount,
  BankTransaction,
  AccountingFilters,
  ChartOfAccounts,
  Payment,
} from "@/types/accounting";

interface AccountingStore {
  ar: ARInvoice[];
  ap: APBill[];
  ledger: JournalEntry[];
  banks: BankAccount[];
  bankTransactions: BankTransaction[];
  chartOfAccounts: ChartOfAccounts[];
  payments: Payment[];
  filters: AccountingFilters;
  selectedTab: string;

  setAR: (ar: ARInvoice[]) => void;
  setAP: (ap: APBill[]) => void;
  setLedger: (ledger: JournalEntry[]) => void;
  setBanks: (banks: BankAccount[]) => void;
  setChartOfAccounts: (coa: ChartOfAccounts[]) => void;
  setFilters: (filters: AccountingFilters) => void;
  setSelectedTab: (tab: string) => void;

  recordPayment: (invoiceId: string, amount: number, method: string, reference: string) => void;
  createJournalEntry: (entry: JournalEntry) => void;
  postJournalEntry: (entryId: string) => void;
  unpostJournalEntry: (entryId: string) => void;
  deleteJournalEntry: (entryId: string) => void;
  reconcileBankTransaction: (txnId: string, paymentId: string) => void;
  unreconcileBankTransaction: (txnId: string) => void;
  initializeDemoData: () => Promise<void>;

  getARStats: () => {
    totalAR: number;
    paidAR: number;
    balanceAR: number;
    overdueCount: number;
    overdueAmount: number;
  };

  getAPStats: () => {
    totalAP: number;
    paidAP: number;
    balanceAP: number;
    overdueCount: number;
    overdueAmount: number;
  };

  getCashPosition: () => {
    totalBankBalance: number;
    totalAR: number;
    totalAP: number;
    netCashflow: number;
  };

  getTrialBalance: () => Array<{
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
  }>;

  getARAgingBuckets: () => Record<string, { count: number; amount: number }>;
  getAPAgingBuckets: () => Record<string, { count: number; amount: number }>;

  exportARCsv: () => string;
  exportAPCsv: () => string;
  exportLedgerCsv: () => string;
}

export const useAccounting = create<AccountingStore>()(
  persist(
    (set, get) => ({
      ar: [],
      ap: [],
      ledger: [],
      banks: [],
      bankTransactions: [],
      chartOfAccounts: [],
      payments: [],
      filters: {
        dateFrom: "",
        dateTo: "",
        accountType: "",
        clientOrVendor: "",
        status: "",
        minAmount: 0,
        maxAmount: 999999,
        searchQuery: "",
      },
      selectedTab: "overview",

      setAR: (ar) => set({ ar }),
      setAP: (ap) => set({ ap }),
      setLedger: (ledger) => set({ ledger }),
      setBanks: (banks) => set({ banks }),
      setChartOfAccounts: (coa) => set({ chartOfAccounts: coa }),
      setFilters: (filters) => set({ filters }),
      setSelectedTab: (tab) => set({ selectedTab: tab }),

      initializeDemoData: async () => {
        try {
          const [arRes, apRes, banksRes, ledgerRes, coaRes] = await Promise.all([
            fetch("/data/ar.json"),
            fetch("/data/ap.json"),
            fetch("/data/banks.json"),
            fetch("/data/ledger.json"),
            fetch("/data/chart-of-accounts.json"),
          ]);

          const ar = await arRes.json();
          const ap = await apRes.json();
          const banks = await banksRes.json();
          const ledger = await ledgerRes.json();
          const chartOfAccounts = await coaRes.json();

          set({ ar, ap, banks, ledger, chartOfAccounts });
        } catch (error) {
          console.error("Failed to load demo data:", error);
        }
      },

      recordPayment: (invoiceId, amount, method, reference) => {
        set(state => ({
          ar: state.ar.map(inv =>
            inv.id === invoiceId
              ? {
                  ...inv,
                  paidAmount: inv.paidAmount + amount,
                  balance: inv.balance - amount,
                  status: inv.balance - amount <= 0 ? "Paid" : "Partial",
                  updatedAt: new Date().toISOString(),
                }
              : inv
          ),
        }));
      },

      createJournalEntry: (entry) => {
        set(state => ({
          ledger: [...state.ledger, { ...entry, isPosted: false }],
        }));
      },

      postJournalEntry: (entryId) => {
        set(state => ({
          ledger: state.ledger.map(entry =>
            entry.id === entryId
              ? {
                  ...entry,
                  isPosted: true,
                  postedAt: new Date().toISOString(),
                }
              : entry
          ),
        }));
      },

      unpostJournalEntry: (entryId) => {
        set(state => ({
          ledger: state.ledger.map(entry =>
            entry.id === entryId
              ? {
                  ...entry,
                  isPosted: false,
                  postedAt: undefined,
                }
              : entry
          ),
        }));
      },

      deleteJournalEntry: (entryId) => {
        set(state => ({
          ledger: state.ledger.filter(entry => entry.id !== entryId),
        }));
      },

      reconcileBankTransaction: (txnId, paymentId) => {
        set(state => ({
          bankTransactions: state.bankTransactions.map(txn =>
            txn.id === txnId
              ? {
                  ...txn,
                  status: "Reconciled" as const,
                  matchedPaymentId: paymentId,
                }
              : txn
          ),
        }));
      },

      unreconcileBankTransaction: (txnId) => {
        set(state => ({
          bankTransactions: state.bankTransactions.map(txn =>
            txn.id === txnId
              ? {
                  ...txn,
                  status: "Unmatched" as const,
                  matchedPaymentId: undefined,
                }
              : txn
          ),
        }));
      },

      getARStats: () => {
        const { ar } = get();
        const now = new Date();

        const totalAR = ar.reduce((sum, inv) => sum + inv.amount, 0);
        const paidAR = ar.reduce((sum, inv) => sum + inv.paidAmount, 0);
        const balanceAR = ar.reduce((sum, inv) => sum + inv.balance, 0);

        const overdueItems = ar.filter(inv => new Date(inv.dueDate) < now && inv.status !== "Paid");
        const overdueCount = overdueItems.length;
        const overdueAmount = overdueItems.reduce((sum, inv) => sum + inv.balance, 0);

        return { totalAR, paidAR, balanceAR, overdueCount, overdueAmount };
      },

      getAPStats: () => {
        const { ap } = get();
        const now = new Date();

        const totalAP = ap.reduce((sum, bill) => sum + bill.amount, 0);
        const paidAP = ap.reduce((sum, bill) => sum + bill.paidAmount, 0);
        const balanceAP = ap.reduce((sum, bill) => sum + bill.balance, 0);

        const overdueItems = ap.filter(bill => new Date(bill.dueDate) < now && bill.status !== "Paid");
        const overdueCount = overdueItems.length;
        const overdueAmount = overdueItems.reduce((sum, bill) => sum + bill.balance, 0);

        return { totalAP, paidAP, balanceAP, overdueCount, overdueAmount };
      },

      getCashPosition: () => {
        const { banks, ar, ap } = get();
        const totalBankBalance = banks.reduce((sum, bank) => sum + bank.balance, 0);
        const arStats = get().getARStats();
        const apStats = get().getAPStats();

        return {
          totalBankBalance,
          totalAR: arStats.balanceAR,
          totalAP: apStats.balanceAP,
          netCashflow: totalBankBalance + arStats.balanceAR - apStats.balanceAP,
        };
      },

      getTrialBalance: () => {
        const { ledger, chartOfAccounts } = get();
        const postedEntries = ledger.filter(entry => entry.isPosted);

        const balances: Record<string, { debit: number; credit: number }> = {};

        postedEntries.forEach(entry => {
          entry.lines.forEach(line => {
            if (!balances[line.accountCode]) {
              balances[line.accountCode] = { debit: 0, credit: 0 };
            }

            if (line.type === "Debit") {
              balances[line.accountCode].debit += line.amount;
            } else {
              balances[line.accountCode].credit += line.amount;
            }
          });
        });

        return chartOfAccounts.map(account => ({
          accountCode: account.code,
          accountName: account.name,
          debit: balances[account.code]?.debit || 0,
          credit: balances[account.code]?.credit || 0,
        }));
      },

      getARAgingBuckets: () => {
        const { ar } = get();
        const now = new Date();

        const buckets: Record<string, { count: number; amount: number }> = {
          "0-30": { count: 0, amount: 0 },
          "31-60": { count: 0, amount: 0 },
          "61-90": { count: 0, amount: 0 },
          "90+": { count: 0, amount: 0 },
        };

        ar.forEach(inv => {
          if (inv.status === "Paid") return;

          const daysOverdue = Math.floor(
            (now.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24)
          );

          let bucket = "0-30";
          if (daysOverdue > 90) bucket = "90+";
          else if (daysOverdue > 60) bucket = "61-90";
          else if (daysOverdue > 30) bucket = "31-60";

          buckets[bucket].count += 1;
          buckets[bucket].amount += inv.balance;
        });

        return buckets;
      },

      getAPAgingBuckets: () => {
        const { ap } = get();
        const now = new Date();

        const buckets: Record<string, { count: number; amount: number }> = {
          "0-30": { count: 0, amount: 0 },
          "31-60": { count: 0, amount: 0 },
          "61-90": { count: 0, amount: 0 },
          "90+": { count: 0, amount: 0 },
        };

        ap.forEach(bill => {
          if (bill.status === "Paid") return;

          const daysOverdue = Math.floor(
            (now.getTime() - new Date(bill.dueDate).getTime()) / (1000 * 60 * 60 * 24)
          );

          let bucket = "0-30";
          if (daysOverdue > 90) bucket = "90+";
          else if (daysOverdue > 60) bucket = "61-90";
          else if (daysOverdue > 30) bucket = "31-60";

          buckets[bucket].count += 1;
          buckets[bucket].amount += bill.balance;
        });

        return buckets;
      },

      exportARCsv: () => {
        const { ar } = get();
        const headers = [
          "Invoice Number",
          "Client Name",
          "Invoice Date",
          "Due Date",
          "Amount",
          "Paid",
          "Balance",
          "Status",
        ];

        const rows = ar.map(inv => [
          inv.invoiceNumber,
          inv.clientName,
          new Date(inv.invoiceDate).toLocaleDateString(),
          new Date(inv.dueDate).toLocaleDateString(),
          inv.amount.toFixed(2),
          inv.paidAmount.toFixed(2),
          inv.balance.toFixed(2),
          inv.status,
        ]);

        return [
          headers.join(","),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
        ].join("\n");
      },

      exportAPCsv: () => {
        const { ap } = get();
        const headers = [
          "Bill Number",
          "Vendor Name",
          "Bill Date",
          "Due Date",
          "Amount",
          "Paid",
          "Balance",
          "Status",
        ];

        const rows = ap.map(bill => [
          bill.billNumber,
          bill.vendorName,
          new Date(bill.billDate).toLocaleDateString(),
          new Date(bill.dueDate).toLocaleDateString(),
          bill.amount.toFixed(2),
          bill.paidAmount.toFixed(2),
          bill.balance.toFixed(2),
          bill.status,
        ]);

        return [
          headers.join(","),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
        ].join("\n");
      },

      exportLedgerCsv: () => {
        const { ledger } = get();
        const headers = ["Date", "Reference", "Description", "Account Code", "Debit", "Credit", "Posted"];

        const rows: string[][] = [];
        ledger.forEach(entry => {
          entry.lines.forEach(line => {
            rows.push([
              new Date(entry.date).toLocaleDateString(),
              entry.referenceNumber,
              entry.description || "",
              line.accountCode,
              line.type === "Debit" ? line.amount.toFixed(2) : "",
              line.type === "Credit" ? line.amount.toFixed(2) : "",
              entry.isPosted ? "Yes" : "No",
            ]);
          });
        });

        return [
          headers.join(","),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
        ].join("\n");
      },
    }),
    {
      name: "accounting-store",
    }
  )
);
