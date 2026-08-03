export interface CountryLanguage {
  name: string;
  type: 'Official' | 'National' | 'Recognized' | 'Spoken';
  speakersPercentage?: number;
}

export interface GovernmentDetails {
  systemType: string; // e.g., Constitutional Republic, Parliamentary Democracy
  headOfState: { name: string; title: string };
  headOfGovernment?: { name: string; title: string };
  rulingCoalitionOrParty: string;
  governanceTrustIndex: number; // 0 - 100
  capitalCity: string;
}

export interface MediaLandscape {
  pressFreedomIndexRank: number; // e.g., 28 / 180
  mediaRegulatoryBody: string;
  majorBroadcasters: string[];
  independentMediaStatus: string;
}

export interface PublisherEntity {
  id: string;
  name: string;
  type: 'State' | 'Independent' | 'Digital Native' | 'International Wire';
  trustScore: number; // 0 - 100
  reach: string;
}

export interface PoliticalParty {
  name: string;
  acronym: string;
  orientation: 'Centrist' | 'Center-Left' | 'Center-Right' | 'Left' | 'Right' | 'Coalition';
  seatsPercentage: number;
  status: 'Ruling' | 'Opposition' | 'Minority' | 'Coalition';
}

export interface AdministrativeDivision {
  name: string;
  type: 'Province' | 'State' | 'Region' | 'County' | 'District';
  capital: string;
  populationEstimate?: string;
}

export interface InstitutionalEntity {
  name: string;
  category: 'University' | 'NGO' | 'Think Tank' | 'Court' | 'Ministry' | 'International Organization';
  description: string;
  headOrLead?: string;
  website?: string;
}

export interface LegalFramework {
  title: string;
  category: 'Constitution' | 'Cybersecurity' | 'Data Protection' | 'Media Law' | 'AI & Tech Regulation';
  enactedYear: number;
  summary: string;
}

export interface CountryIntelligenceProfile {
  isoCode: string; // e.g. "RWA", "KEN", "GHA", "FRA", "USA"
  countryName: string;
  region: 'Africa' | 'Europe' | 'Asia' | 'North America' | 'South America' | 'Middle East' | 'Oceania';
  flagEmoji: string;
  capital: string;
  population: string;
  gdpNominal: string;
  currency: string;
  
  // Requirement Sections
  languages: CountryLanguage[];
  government: GovernmentDetails;
  media: MediaLandscape;
  publishers: PublisherEntity[];
  politicalParties: PoliticalParty[];
  administrativeDivisions: AdministrativeDivision[];
  universities: InstitutionalEntity[];
  ngos: InstitutionalEntity[];
  thinkTanks: InstitutionalEntity[];
  courts: InstitutionalEntity[];
  ministries: InstitutionalEntity[];
  internationalOrganizations: InstitutionalEntity[];
  laws: LegalFramework[];

  intelligenceSummary: string;
  riskRating: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  lastAuditDate: string;
}

/**
 * Country Intelligence Engine & Dynamic Registry
 * Supports adding countries dynamically without modifying core pipeline code.
 */
export class CountryIntelligenceEngine {
  private static countryRegistry: Map<string, CountryIntelligenceProfile> = new Map();

  static {
    // Bootstrap Core Profiles
    this.registerCountryProfile(this.getRwandaProfile());
    this.registerCountryProfile(this.getKenyaProfile());
    this.registerCountryProfile(this.getGhanaProfile());
    this.registerCountryProfile(this.getFranceProfile());
    this.registerCountryProfile(this.getUSAProfile());
  }

  /**
   * Register a new country profile dynamically without altering core codebase
   */
  public static registerCountryProfile(profile: CountryIntelligenceProfile): void {
    this.countryRegistry.set(profile.isoCode.toUpperCase(), profile);
    this.countryRegistry.set(profile.countryName.toLowerCase(), profile);
  }

  /**
   * Get list of all registered country intelligence profiles
   */
  public static getAllCountryProfiles(): CountryIntelligenceProfile[] {
    const uniqueMap = new Map<string, CountryIntelligenceProfile>();
    this.countryRegistry.forEach((p) => uniqueMap.set(p.isoCode, p));
    return Array.from(uniqueMap.values());
  }

  /**
   * Query profile by ISO code or Country Name
   */
  public static getCountryProfile(query: string): CountryIntelligenceProfile | undefined {
    return this.countryRegistry.get(query.toUpperCase()) || this.countryRegistry.get(query.toLowerCase());
  }

  // Sample Comprehensive Built-In Profiles

  private static getRwandaProfile(): CountryIntelligenceProfile {
    return {
      isoCode: 'RWA',
      countryName: 'Rwanda',
      region: 'Africa',
      flagEmoji: '🇷🇼',
      capital: 'Kigali',
      population: '13.8 Million',
      gdpNominal: '$14.1 Billion',
      currency: 'Rwandan Franc (RWF)',
      intelligenceSummary: 'Rwanda is a regional technology, fintech, and sovereign AI compute hub in East Africa, featuring high governance digital integration and rapid infrastructure expansion.',
      riskRating: 'LOW',
      lastAuditDate: '2026-08-01',
      languages: [
        { name: 'Kinyarwanda', type: 'Official', speakersPercentage: 98 },
        { name: 'English', type: 'Official', speakersPercentage: 70 },
        { name: 'French', type: 'Official', speakersPercentage: 45 },
        { name: 'Swahili', type: 'National', speakersPercentage: 55 }
      ],
      government: {
        systemType: 'Unitary Presidential Republic',
        headOfState: { name: 'Paul Kagame', title: 'President of the Republic of Rwanda' },
        headOfGovernment: { name: 'Justin Nsengiyumva', title: 'Prime Minister' },
        rulingCoalitionOrParty: 'Rwandan Patriotic Front (RPF-Inkotanyi)',
        governanceTrustIndex: 91,
        capitalCity: 'Kigali'
      },
      media: {
        pressFreedomIndexRank: 112,
        mediaRegulatoryBody: 'Rwanda Utilities Regulatory Authority (RURA) & Rwanda Media Commission (RMC)',
        majorBroadcasters: ['RBA (Rwanda Broadcasting Agency)', 'Igihe TV', 'Flash FM', 'KCT Channel'],
        independentMediaStatus: 'Expanding digital investigative ecosystem with active public sector accountability press.'
      },
      publishers: [
        { id: 'pub_the_new_times', name: 'The New Times', type: 'Independent', trustScore: 92, reach: 'National & Pan-African' },
        { id: 'pub_igihe', name: 'Igihe.com', type: 'Digital Native', trustScore: 90, reach: '1.2M Daily Active Readers' },
        { id: 'pub_rwanda_today', name: 'Rwanda Today / EastAfrican', type: 'Independent', trustScore: 89, reach: 'Regional East Africa' }
      ],
      politicalParties: [
        { name: 'Rwandan Patriotic Front', acronym: 'RPF', orientation: 'Centrist', seatsPercentage: 74, status: 'Ruling' },
        { name: 'Social Democratic Party', acronym: 'PSD', orientation: 'Center-Left', seatsPercentage: 10, status: 'Coalition' },
        { name: 'Democratic Green Party of Rwanda', acronym: 'DGPR', orientation: 'Center-Left', seatsPercentage: 6, status: 'Opposition' }
      ],
      administrativeDivisions: [
        { name: 'Kigali City', type: 'Province', capital: 'Kigali', populationEstimate: '1.3M' },
        { name: 'Eastern Province', type: 'Province', capital: 'Rwamagana', populationEstimate: '3.1M' },
        { name: 'Northern Province', type: 'Province', capital: 'Musanze', populationEstimate: '2.2M' },
        { name: 'Southern Province', type: 'Province', capital: 'Nyanza', populationEstimate: '2.8M' },
        { name: 'Western Province', type: 'Province', capital: 'Karongi', populationEstimate: '2.9M' }
      ],
      universities: [
        { name: 'University of Rwanda (UR)', category: 'University', description: 'Flagship public research university across 6 specialized colleges.', headOrLead: 'Dr. Didas Kayihura Muganga' },
        { name: 'Carnegie Mellon University Africa (CMU-Africa)', category: 'University', description: 'Premier postgraduate ICT and AI engineering institute in Innovation City.', headOrLead: 'Prof. Conrad Tucker' },
        { name: 'African Institute for Mathematical Sciences (AIMS Rwanda)', category: 'University', description: 'Pan-African center of excellence for quantum science and advanced AI research.' }
      ],
      ngos: [
        { name: 'Imbuto Foundation', category: 'NGO', description: 'Social development, education, and youth empowerment initiatives across Rwanda.', headOrLead: 'First Lady Jeannette Kagame' },
        { name: 'WaterAid Rwanda', category: 'NGO', description: 'Clean water, hygiene, and climate-resilient water infrastructure development.' }
      ],
      thinkTanks: [
        { name: 'Institute of Policy Analysis and Research (IPAR-Rwanda)', category: 'Think Tank', description: 'Leading autonomous policy research institute analyzing socio-economic frameworks.', headOrLead: 'Eugénie Kayitesi' },
        { name: 'Kigali Global Policy Forum', category: 'Think Tank', description: 'Regional geopolitical strategy and trade integration policy lab.' }
      ],
      courts: [
        { name: 'Supreme Court of Rwanda', category: 'Court', description: 'Highest judicial authority headed by the Chief Justice.', headOrLead: 'Chief Justice Faustin Ntezilyayo' },
        { name: 'Court of Appeal', category: 'Court', description: 'Appellate jurisdiction over High Court decisions.' }
      ],
      ministries: [
        { name: 'Ministry of ICT and Innovation (MINICT)', category: 'Ministry', description: 'Leads digital transformation, AI governance, and tech startup policies.', headOrLead: 'Paula Ingabire' },
        { name: 'Ministry of Foreign Affairs and International Cooperation (MINAFFET)', category: 'Ministry', description: 'Directs diplomatic missions and international treaty negotiations.', headOrLead: 'Olivier Nduhungirehe' },
        { name: 'Ministry of Finance and Economic Planning (MINECOFIN)', category: 'Ministry', description: 'Oversees national budget, fiscal policy, and AfCFTA integration strategy.' }
      ],
      internationalOrganizations: [
        { name: 'Smart Africa Secretariat', category: 'International Organization', description: 'Pan-African digital single market alliance headquartered in Kigali.', headOrLead: 'Lacina Koné' },
        { name: 'East African Community (EAC)', category: 'International Organization', description: 'Regional intergovernmental organization member state.' },
        { name: 'African Union (AU)', category: 'International Organization', description: 'Founding member state driving Agenda 2063.' }
      ],
      laws: [
        { title: 'Law No. 058/2021 Relating to the Protection of Personal Data and Privacy', category: 'Data Protection', enactedYear: 2021, summary: 'Comprehensive framework governing data controller registration, cross-border transfer requirements, and citizen data rights.' },
        { title: 'National Artificial Intelligence Policy Framework', category: 'AI & Tech Regulation', enactedYear: 2023, summary: 'Establishes guidelines for ethical AI deployment, sovereign compute infrastructure, and sandbox regulatory trials.' }
      ]
    };
  }

  private static getKenyaProfile(): CountryIntelligenceProfile {
    return {
      isoCode: 'KEN',
      countryName: 'Kenya',
      region: 'Africa',
      flagEmoji: '🇰🇪',
      capital: 'Nairobi',
      population: '54.0 Million',
      gdpNominal: '$113.4 Billion',
      currency: 'Kenyan Shilling (KES)',
      intelligenceSummary: 'Kenya is East Africa’s largest economic driver and financial center ("Silicon Savannah"), pioneering mobile money payments (M-Pesa) and green geothermal grid transmission.',
      riskRating: 'MODERATE',
      lastAuditDate: '2026-08-01',
      languages: [
        { name: 'Swahili', type: 'Official', speakersPercentage: 90 },
        { name: 'English', type: 'Official', speakersPercentage: 80 }
      ],
      government: {
        systemType: 'Presidential Republic',
        headOfState: { name: 'William Ruto', title: 'President of Kenya' },
        rulingCoalitionOrParty: 'Kenya Kwanza Alliance',
        governanceTrustIndex: 78,
        capitalCity: 'Nairobi'
      },
      media: {
        pressFreedomIndexRank: 116,
        mediaRegulatoryBody: 'Media Council of Kenya (MCK)',
        majorBroadcasters: ['Citizen TV', 'NTV Kenya', 'KTN News', 'KBC'],
        independentMediaStatus: 'Vibrant competitive media environment with strong investigative journalism outlets.'
      },
      publishers: [
        { id: 'pub_daily_nation', name: 'Daily Nation / Nation Media Group', type: 'Independent', trustScore: 91, reach: 'East Africa Regional Leader' },
        { id: 'pub_the_standard', name: 'The Standard Newspaper', type: 'Independent', trustScore: 88, reach: 'National Print & Digital' }
      ],
      politicalParties: [
        { name: 'United Democratic Alliance', acronym: 'UDA', orientation: 'Center-Right', seatsPercentage: 42, status: 'Ruling' },
        { name: 'Orange Democratic Movement', acronym: 'ODM', orientation: 'Center-Left', seatsPercentage: 28, status: 'Opposition' }
      ],
      administrativeDivisions: [
        { name: 'Nairobi County', type: 'County', capital: 'Nairobi', populationEstimate: '4.4M' },
        { name: 'Mombasa County', type: 'County', capital: 'Mombasa', populationEstimate: '1.2M' },
        { name: 'Nakuru County', type: 'County', capital: 'Nakuru', populationEstimate: '2.1M' }
      ],
      universities: [
        { name: 'University of Nairobi (UoN)', category: 'University', description: 'Leading public university with top faculties in law, medicine, and engineering.' },
        { name: 'Strathmore University', category: 'University', description: 'Premier private university specializing in computer science, business, and AI research.' }
      ],
      ngos: [
        { name: 'AMREF Health Africa', category: 'NGO', description: 'Leading African-led health development organization.' }
      ],
      thinkTanks: [
        { name: 'Kenya Institute for Public Policy Research and Analysis (KIPPRA)', category: 'Think Tank', description: 'Autonomous policy institute providing economic advisory to government.' }
      ],
      courts: [
        { name: 'Supreme Court of Kenya', category: 'Court', description: 'Highest court headed by Chief Justice Martha Koome.', headOrLead: 'Chief Justice Martha Koome' }
      ],
      ministries: [
        { name: 'Ministry of Information, Communications and the Digital Economy', category: 'Ministry', description: 'Drives national fiber optic rollout and e-government services.', headOrLead: 'Eliud Owalo' }
      ],
      internationalOrganizations: [
        { name: 'UN Environment Programme (UNEP)', category: 'International Organization', description: 'Global environmental authority headquartered at UN Office at Nairobi (UNON).' }
      ],
      laws: [
        { title: 'Data Protection Act of 2019', category: 'Data Protection', enactedYear: 2019, summary: 'Regulates personal data processing and enforces data subject consent protocols.' }
      ]
    };
  }

  private static getGhanaProfile(): CountryIntelligenceProfile {
    return {
      isoCode: 'GHA',
      countryName: 'Ghana',
      region: 'Africa',
      flagEmoji: '🇬🇭',
      capital: 'Accra',
      population: '33.5 Million',
      gdpNominal: '$76.6 Billion',
      currency: 'Ghanaian Cedi (GHS)',
      intelligenceSummary: 'Ghana hosts the AfCFTA Permanent Secretariat in Accra and represents a democratic anchor in West Africa with expanding fintech and green energy trade.',
      riskRating: 'LOW',
      lastAuditDate: '2026-08-01',
      languages: [
        { name: 'English', type: 'Official', speakersPercentage: 80 },
        { name: 'Twi / Akan', type: 'National', speakersPercentage: 65 }
      ],
      government: {
        systemType: 'Unitary Constitutional Democracy',
        headOfState: { name: 'Nana Akufo-Addo', title: 'President of Ghana' },
        rulingCoalitionOrParty: 'New Patriotic Party (NPP)',
        governanceTrustIndex: 85,
        capitalCity: 'Accra'
      },
      media: {
        pressFreedomIndexRank: 62,
        mediaRegulatoryBody: 'National Media Commission (NMC)',
        majorBroadcasters: ['GTV', 'JoyNews', 'Citi TV', 'TV3 Ghana'],
        independentMediaStatus: 'High press freedom index with active broadcast radio networks.'
      },
      publishers: [
        { id: 'pub_daily_graphic', name: 'Daily Graphic', type: 'State', trustScore: 90, reach: 'National Print' },
        { id: 'pub_myjoyonline', name: 'MyJoyOnline', type: 'Digital Native', trustScore: 89, reach: 'National Digital' }
      ],
      politicalParties: [
        { name: 'New Patriotic Party', acronym: 'NPP', orientation: 'Center-Right', seatsPercentage: 50, status: 'Ruling' },
        { name: 'National Democratic Congress', acronym: 'NDC', orientation: 'Center-Left', seatsPercentage: 50, status: 'Opposition' }
      ],
      administrativeDivisions: [
        { name: 'Greater Accra Region', type: 'Region', capital: 'Accra', populationEstimate: '5.4M' },
        { name: 'Ashanti Region', type: 'Region', capital: 'Kumasi', populationEstimate: '5.9M' }
      ],
      universities: [
        { name: 'University of Ghana (Legon)', category: 'University', description: 'Oldest and largest public university in Ghana.' }
      ],
      ngos: [
        { name: 'CDD-Ghana (Center for Democratic Development)', category: 'NGO', description: 'Promotes democracy, good governance, and civil liberty.' }
      ],
      thinkTanks: [
        { name: 'Institute of Economic Affairs (IEA Ghana)', category: 'Think Tank', description: 'Public policy research center analyzing fiscal and governance reform.' }
      ],
      courts: [
        { name: 'Supreme Court of Ghana', category: 'Court', description: 'Chief judicial organ exercising constitutional review.' }
      ],
      ministries: [
        { name: 'Ministry of Communications and Digitalisation', category: 'Ministry', description: 'Oversees mobile money interoperability and telecom spectrum regulation.' }
      ],
      internationalOrganizations: [
        { name: 'AfCFTA Secretariat', category: 'International Organization', description: 'Permanent headquarters of the African Continental Free Trade Area.' }
      ],
      laws: [
        { title: 'Cybersecurity Act of 2020 (Act 1038)', category: 'Cybersecurity', enactedYear: 2020, summary: 'Establishes the Cyber Security Authority to protect critical information infrastructure.' }
      ]
    };
  }

  private static getFranceProfile(): CountryIntelligenceProfile {
    return {
      isoCode: 'FRA',
      countryName: 'France',
      region: 'Europe',
      flagEmoji: '🇫🇷',
      capital: 'Paris',
      population: '68.1 Million',
      gdpNominal: '$3.08 Trillion',
      currency: 'Euro (EUR)',
      intelligenceSummary: 'France is a European Union founding power, leading sovereign AI infrastructure investments in Paris and championing EU AI Act regulatory enforcement.',
      riskRating: 'LOW',
      lastAuditDate: '2026-08-01',
      languages: [
        { name: 'French', type: 'Official', speakersPercentage: 100 }
      ],
      government: {
        systemType: 'Semi-Presidential Republic',
        headOfState: { name: 'Emmanuel Macron', title: 'President of the French Republic' },
        rulingCoalitionOrParty: 'Ensemble Alliance',
        governanceTrustIndex: 82,
        capitalCity: 'Paris'
      },
      media: {
        pressFreedomIndexRank: 24,
        mediaRegulatoryBody: 'Arcom (Autorité de régulation de la communication audiovisuelle et numérique)',
        majorBroadcasters: ['France Télévisions', 'TF1', 'BFMTV', 'ARTE'],
        independentMediaStatus: 'High journalistic standards with strong public media funding.'
      },
      publishers: [
        { id: 'pub_le_monde', name: 'Le Monde', type: 'Independent', trustScore: 94, reach: 'Global French & English' },
        { id: 'pub_afp', name: 'Agence France-Presse (AFP)', type: 'International Wire', trustScore: 96, reach: 'Worldwide Wire Service' }
      ],
      politicalParties: [
        { name: 'Renaissance', acronym: 'RE', orientation: 'Centrist', seatsPercentage: 35, status: 'Ruling' },
        { name: 'Rassemblement National', acronym: 'RN', orientation: 'Right', seatsPercentage: 25, status: 'Opposition' }
      ],
      administrativeDivisions: [
        { name: 'Île-de-France', type: 'Region', capital: 'Paris', populationEstimate: '12.3M' }
      ],
      universities: [
        { name: 'Sorbonne University', category: 'University', description: 'Multidisciplinary research university in Paris.' },
        { name: 'École Polytechnique / IP Paris', category: 'University', description: 'Top engineering and mathematics institute.' }
      ],
      ngos: [
        { name: 'Médecins Sans Frontières (MSF)', category: 'NGO', description: 'Global medical humanitarian aid organization founded in Paris.' }
      ],
      thinkTanks: [
        { name: 'IFRI (Institut français des relations internationales)', category: 'Think Tank', description: 'Leading French think tank on international policy and European security.' }
      ],
      courts: [
        { name: 'Conseil d’État & Cour de cassation', category: 'Court', description: 'Supreme organs for administrative and judicial law.' }
      ],
      ministries: [
        { name: 'Ministry of Economy, Finance and Industrial Sovereignty', category: 'Ministry', description: 'Directs national industrial strategy and technology subsidies.' }
      ],
      internationalOrganizations: [
        { name: 'UNESCO', category: 'International Organization', description: 'UN Educational, Scientific and Cultural Organization headquartered in Paris.' },
        { name: 'OECD', category: 'International Organization', description: 'Organisation for Economic Co-operation and Development.' }
      ],
      laws: [
        { title: 'EU Artificial Intelligence Act Framework', category: 'AI & Tech Regulation', enactedYear: 2024, summary: 'Risk-based classification framework governing high-risk AI models and foundational general-purpose AI transparency.' }
      ]
    };
  }

  private static getUSAProfile(): CountryIntelligenceProfile {
    return {
      isoCode: 'USA',
      countryName: 'United States',
      region: 'North America',
      flagEmoji: '🇺🇸',
      capital: 'Washington, D.C.',
      population: '335.0 Million',
      gdpNominal: '$27.36 Trillion',
      currency: 'US Dollar (USD)',
      intelligenceSummary: 'The United States is the world’s primary economy and technology innovator, hosting Silicon Valley, key capital markets, and national AI safety institutes.',
      riskRating: 'LOW',
      lastAuditDate: '2026-08-01',
      languages: [
        { name: 'English', type: 'National', speakersPercentage: 91 },
        { name: 'Spanish', type: 'Recognized', speakersPercentage: 18 }
      ],
      government: {
        systemType: 'Federal Constitutional Republic',
        headOfState: { name: 'President of the United States', title: 'Head of State & Government' },
        rulingCoalitionOrParty: 'Democratic Party',
        governanceTrustIndex: 80,
        capitalCity: 'Washington, D.C.'
      },
      media: {
        pressFreedomIndexRank: 45,
        mediaRegulatoryBody: 'Federal Communications Commission (FCC)',
        majorBroadcasters: ['PBS', 'CBS', 'NBC', 'ABC', 'CNN'],
        independentMediaStatus: 'Expansive private media landscape with First Amendment constitutional protections.'
      },
      publishers: [
        { id: 'pub_ap_news', name: 'Associated Press (AP)', type: 'International Wire', trustScore: 96, reach: 'Global Wire' },
        { id: 'pub_nyt', name: 'The New York Times', type: 'Independent', trustScore: 92, reach: 'Global Digital' },
        { id: 'pub_wsj', name: 'The Wall Street Journal', type: 'Independent', trustScore: 93, reach: 'Global Financial' }
      ],
      politicalParties: [
        { name: 'Democratic Party', acronym: 'DEM', orientation: 'Center-Left', seatsPercentage: 48, status: 'Ruling' },
        { name: 'Republican Party', acronym: 'GOP', orientation: 'Center-Right', seatsPercentage: 51, status: 'Opposition' }
      ],
      administrativeDivisions: [
        { name: 'California', type: 'State', capital: 'Sacramento', populationEstimate: '39.0M' },
        { name: 'New York', type: 'State', capital: 'Albany', populationEstimate: '19.5M' },
        { name: 'Texas', type: 'State', capital: 'Austin', populationEstimate: '30.0M' }
      ],
      universities: [
        { name: 'Massachusetts Institute of Technology (MIT)', category: 'University', description: 'Global leader in computing, engineering, and artificial intelligence.' },
        { name: 'Stanford University', category: 'University', description: 'Silicon Valley research university pioneering AI foundational models.' }
      ],
      ngos: [
        { name: 'Bill & Melinda Gates Foundation', category: 'NGO', description: 'Global health and development grant-making institution.' }
      ],
      thinkTanks: [
        { name: 'Center for Strategic and International Studies (CSIS)', category: 'Think Tank', description: 'Nonpartisan policy research organization analyzing national security and AI.' }
      ],
      courts: [
        { name: 'Supreme Court of the United States (SCOTUS)', category: 'Court', description: 'Highest federal court exercising judicial review.' }
      ],
      ministries: [
        { name: 'Department of Commerce / NIST', category: 'Ministry', description: 'Houses the US AI Safety Institute setting AI evaluation standards.' }
      ],
      internationalOrganizations: [
        { name: 'United Nations Headquarters', category: 'International Organization', description: 'Global diplomatic headquarters in New York City.' },
        { name: 'World Bank Group & IMF', category: 'International Organization', description: 'Multilateral financial institutions based in Washington, D.C.' }
      ],
      laws: [
        { title: 'Executive Order on Safe, Secure, and Trustworthy Artificial Intelligence', category: 'AI & Tech Regulation', enactedYear: 2023, summary: 'Mandates red-teaming safety assessments for dual-use foundation models and defense cloud security.' }
      ]
    };
  }
}
