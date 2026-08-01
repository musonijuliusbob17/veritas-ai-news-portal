import { GeneratedReport } from './IntelligenceReportService';

export interface PurchasedReport {
  purchaseId: string;
  reportId: string;
  title: string;
  category: 'Country' | 'Industry' | 'Risk' | 'Custom';
  priceUSD: number;
  purchasedByOrg: string;
  purchaseDate: string;
  watermarkText: string;
  downloadCount: number;
}

export class ReportDeliveryService {
  private static purchasedReports: PurchasedReport[] = [
    {
      purchaseId: 'pur_001',
      reportId: 'rep_rwanda_country_2026',
      title: 'Rwanda Sovereign AI & Digital Economy Outlook 2026-2030',
      category: 'Country',
      priceUSD: 499,
      purchasedByOrg: 'East African Community Secretariat (EAC)',
      purchaseDate: '2026-07-28',
      watermarkText: 'LICENSED TO: EAC SECRETARIAT • CONFIDENTIAL VERITAS AUDIT',
      downloadCount: 3
    },
    {
      purchaseId: 'pur_002',
      reportId: 'rep_subsea_energy_2026',
      title: 'Pan-African Hydro & Clean Microgrid Investment Matrix',
      category: 'Industry',
      priceUSD: 799,
      purchasedByOrg: 'Norrsken Africa Innovation Fund',
      purchaseDate: '2026-07-30',
      watermarkText: 'LICENSED TO: NORRSKEN VC • DO NOT REDISTRIBUTE',
      downloadCount: 5
    }
  ];

  public static getPurchasedReports(): PurchasedReport[] {
    return [...this.purchasedReports];
  }

  public static purchaseReport(title: string, category: 'Country' | 'Industry' | 'Risk' | 'Custom', priceUSD: number, orgName: string): PurchasedReport {
    const newPur: PurchasedReport = {
      purchaseId: `pur_${Date.now()}`,
      reportId: `rep_${Date.now()}`,
      title,
      category,
      priceUSD,
      purchasedByOrg: orgName,
      purchaseDate: new Date().toISOString().split('T')[0],
      watermarkText: `LICENSED TO: ${orgName.toUpperCase()} • VERITAS OFFICIAL STAMP`,
      downloadCount: 1
    };
    this.purchasedReports.unshift(newPur);
    return newPur;
  }

  public static generateWatermarkedPDF(report: GeneratedReport, orgName: string): { pdfBlobUrl: string; watermark: string } {
    const watermark = `VERITAS SECURE DOCUMENT • LICENSED TO [${orgName.toUpperCase()}] • STAMP ID #${Math.floor(Math.random() * 899999 + 100000)}`;
    return {
      pdfBlobUrl: `data:application/pdf;base64,JVBERi0xLjQKJ...`,
      watermark
    };
  }
}
