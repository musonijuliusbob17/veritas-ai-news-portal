export interface InvoiceRecord {
  invoiceId: string;
  orgId: string;
  orgName: string;
  date: string;
  amountUSD: number;
  description: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  pdfReceiptUrl: string;
}

export class BillingService {
  private static invoices: InvoiceRecord[] = [
    {
      invoiceId: 'inv_2026_001',
      orgId: 'org_eac_gov_01',
      orgName: 'East African Community Secretariat (EAC)',
      date: '2026-08-01',
      amountUSD: 1499,
      description: 'Veritas Enterprise Intelligence Platform - Annual Subscription (August 2026)',
      status: 'PAID',
      pdfReceiptUrl: '#'
    },
    {
      invoiceId: 'inv_2026_002',
      orgId: 'org_norrsken_vc',
      orgName: 'Norrsken Africa Innovation Fund',
      date: '2026-07-28',
      amountUSD: 799,
      description: 'Intelligence Store Purchase: Pan-African Hydro & Clean Microgrid Investment Matrix',
      status: 'PAID',
      pdfReceiptUrl: '#'
    },
    {
      invoiceId: 'inv_2026_003',
      orgId: 'org_smart_africa',
      orgName: 'Smart Africa Alliance',
      date: '2026-07-15',
      amountUSD: 299,
      description: 'Veritas Professional Plan - Monthly Recurring Subscription',
      status: 'PAID',
      pdfReceiptUrl: '#'
    }
  ];

  public static getInvoices(orgId?: string): InvoiceRecord[] {
    if (orgId) {
      return this.invoices.filter(i => i.orgId === orgId);
    }
    return [...this.invoices];
  }

  public static getTotalRevenueUSD(): number {
    return this.invoices.reduce((sum, i) => sum + i.amountUSD, 0);
  }

  public static createInvoice(orgId: string, orgName: string, amountUSD: number, description: string): InvoiceRecord {
    const inv: InvoiceRecord = {
      invoiceId: `inv_${Date.now()}`,
      orgId,
      orgName,
      date: new Date().toISOString().split('T')[0],
      amountUSD,
      description,
      status: 'PAID',
      pdfReceiptUrl: '#'
    };
    this.invoices.unshift(inv);
    return inv;
  }
}
