import { Article } from '../types';

export type InvestigationDomain = 
  | 'Political Analysis' 
  | 'Economic Research' 
  | 'Technology Research' 
  | 'Company Intelligence' 
  | 'Climate Analysis' 
  | 'Security Analysis';

export interface InvestigationVersion {
  versionNumber: number;
  date: string;
  author: string;
  changeSummary: string;
  reasoning: string;
}

export interface InvestigationRecord {
  id: string;
  title: string;
  domain: InvestigationDomain;
  status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
  createdDate: string;
  lastUpdated: string;
  leadAnalyst: string;
  collectedArticles: Article[];
  entities: string[];
  notes: string[];
  findings: string[];
  backgroundSummary: string;
  keyActors: string[];
  timelineEvents: Array<{ date: string; title: string; detail: string }>;
  recommendations: string[];
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  versionHistory: InvestigationVersion[];
}

export class InvestigationEngine {
  private static investigations: InvestigationRecord[] = [
    {
      id: 'inv_001',
      title: 'East Africa Sovereign AI & Data Center Ecosystem',
      domain: 'Technology Research',
      status: 'ACTIVE',
      createdDate: '2026-07-15',
      lastUpdated: '2026-08-01',
      leadAnalyst: 'Veritas AI Agent Network (Lead Analyst #409)',
      collectedArticles: [],
      entities: ['Rwanda RISA', 'Norrsken Kigali', 'Smart Africa Alliance', 'African Union', 'Silicon Savannah'],
      notes: [
        'Initial data center capacity in Kigali reached 25 MW in Q2 2026.',
        'Sovereign AI policy harmonization accord signed by EAC member states.',
        'Renewable solar microgrid direct feed operational.'
      ],
      backgroundSummary: 'Accelerated expansion of sovereign AI compute nodes and green hydro-powered data infrastructure across Kigali, Nairobi, and Addis Ababa.',
      keyActors: ['Rwanda Ministry of ICT', 'Norrsken Foundation', 'East African Community Secretariat', 'World Bank Digital Economy Initiative'],
      timelineEvents: [
        { date: '2024-03', title: 'National AI Policy Enacted', detail: 'Rwanda releases baseline sovereign data privacy & AI framework.' },
        { date: '2025-09', title: 'Kigali Innovation City Groundbreaking', detail: 'Phase 2 hyper-scale green data center broke ground.' },
        { date: '2026-06', title: 'Pan-African Sovereign AI Accord', detail: '14 member nations ratify cross-border data transfer protocols.' }
      ],
      findings: [
        'Compute capacity in East Africa has grown by 140% year-over-year.',
        'Sovereign LLMs trained on localized African languages (Kinyarwanda, Swahili) reduce clinical diagnostic error by 34%.',
        'Venture funding for African AI startups surpassed $1.8B in 2026.'
      ],
      recommendations: [
        'Prioritize joint EAC green power purchase agreements to maintain 99.999% uptime.',
        'Standardize cross-border IP licensing for localized machine learning models.',
        'Expand university research fellowships in machine learning and quantum algorithms.'
      ],
      riskRating: 'LOW',
      versionHistory: [
        { versionNumber: 1, date: '2026-07-15', author: 'Research Agent', changeSummary: 'Initial investigation setup and entity extraction.', reasoning: 'Ingested foundational data center capacity stats.' },
        { versionNumber: 2, date: '2026-07-25', author: 'Human Analyst #104', changeSummary: 'Updated compute capacity findings to +140% YoY.', reasoning: 'Incorporated latest RISA and Smart Africa Alliance Q2 disclosures.' },
        { versionNumber: 3, date: '2026-08-01', author: 'Fact Verification Agent', changeSummary: 'Added sovereign LLM language error reduction metrics.', reasoning: 'Cross-validated clinical trial outputs from Kigali Central Hospital.' }
      ]
    },
    {
      id: 'inv_002',
      title: 'Subsea Fiber Cable Security & Regional Redundancy',
      domain: 'Security Analysis',
      status: 'ACTIVE',
      createdDate: '2026-07-20',
      lastUpdated: '2026-08-01',
      leadAnalyst: 'Security Research Desk',
      collectedArticles: [],
      entities: ['EASSy Cable Consortium', 'SEACOM', 'IMO Hydrographic Office', 'REG Rwanda'],
      notes: [
        'Monitoring maritime hydrophone telemetry near Mombasa and Dar es Salaam landing stations.',
        'Redundant overland fiber backbones active via Rwanda and Uganda corridors.'
      ],
      backgroundSummary: 'Evaluation of coastal subsea fiber cable vulnerabilities and terrestrial microgrid backup links across East and Central Africa.',
      keyActors: ['International Maritime Organization', 'East African Telecommunications Association', 'Sovereign Cyber Defense Command'],
      timelineEvents: [
        { date: '2025-11', title: 'Terrestrial Backbone Ring Completed', detail: 'Direct high-speed overland link connecting Mombasa to Kigali via Kampala.' },
        { date: '2026-07', title: 'Acoustic Monitoring Deployment', detail: 'Subsea acoustic hydrophone sensors activated along coastal approaches.' }
      ],
      findings: [
        'Overland redundancy reduces latency variance during maritime disruptions to under 12ms.',
        'Zero physical security breaches logged at landing stations in past 24 months.'
      ],
      recommendations: [
        'Perform quarterly joint cyber-physical breach simulations across regional IXPs.',
        'Establish automated traffic re-routing protocols at the BGP level.'
      ],
      riskRating: 'MEDIUM',
      versionHistory: [
        { versionNumber: 1, date: '2026-07-20', author: 'Security Analyst Agent', changeSummary: 'Baseline subsea route mapping.', reasoning: 'Imported maritime AIS & hydrographic datasets.' },
        { versionNumber: 2, date: '2026-08-01', author: 'Lead Analyst Desk', changeSummary: 'Added terrestrial ring latency figures.', reasoning: 'Verified live traceroute telemetry through Kigali IXP.' }
      ]
    }
  ];

  public static getInvestigations(): InvestigationRecord[] {
    return [...this.investigations];
  }

  public static createInvestigation(
    title: string, 
    domain: InvestigationDomain, 
    articles: Article[] = []
  ): InvestigationRecord {
    const newInv: InvestigationRecord = {
      id: `inv_${Date.now()}`,
      title,
      domain,
      status: 'ACTIVE',
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      leadAnalyst: 'Veritas AI Automated Investigator',
      collectedArticles: articles,
      entities: ['Rwanda', 'East African Community', 'Technology Sector', 'Sovereign Fund'],
      notes: [`Investigation initiated automatically for topic '${title}'.`],
      backgroundSummary: `Comprehensive ${domain.toLowerCase()} investigation evaluating baseline trends, actor networks, and structural risks.`,
      keyActors: ['Ministry of Economy & Tech', 'Regional Regulatory Body', 'International Investment Consortium'],
      timelineEvents: [
        { date: new Date().toISOString().split('T')[0], title: 'Investigation Opened', detail: 'System initialized baseline entity vectors and historical timeline mapping.' }
      ],
      findings: [
        'High correlation detected between infrastructure capital investment and macroeconomic stability.',
        'Cross-publisher news sentiment remains positive (+78%).'
      ],
      recommendations: [
        'Monitor monthly data ingestion telemetry.',
        'Schedule follow-up audit with domain specialist analysts.'
      ],
      riskRating: 'LOW',
      versionHistory: [
        { versionNumber: 1, date: new Date().toISOString().split('T')[0], author: 'Veritas AI Agent', changeSummary: 'Created initial investigation desk.', reasoning: 'Automated workflow initialization.' }
      ]
    };

    this.investigations.unshift(newInv);
    return newInv;
  }

  public static addNote(invId: string, note: string) {
    const inv = this.investigations.find(x => x.id === invId);
    if (inv) {
      inv.notes.push(note);
      inv.lastUpdated = new Date().toISOString().split('T')[0];
      const nextVer = inv.versionHistory.length + 1;
      inv.versionHistory.push({
        versionNumber: nextVer,
        date: new Date().toISOString().split('T')[0],
        author: 'Human Analyst',
        changeSummary: `Added analyst note: "${note.substring(0, 30)}..."`,
        reasoning: 'Manual analyst update and commentary.'
      });
    }
  }

  public static addEntity(invId: string, entity: string) {
    const inv = this.investigations.find(x => x.id === invId);
    if (inv && !inv.entities.includes(entity)) {
      inv.entities.push(entity);
      inv.lastUpdated = new Date().toISOString().split('T')[0];
    }
  }
}
