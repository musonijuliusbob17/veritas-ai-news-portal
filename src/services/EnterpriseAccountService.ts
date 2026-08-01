export type OrganizationType = 
  | 'Government' 
  | 'NGO' 
  | 'Corporation' 
  | 'Research Institution' 
  | 'Investment Firm' 
  | 'Media Organization';

export type UserRole = 'OWNER' | 'ADMIN' | 'ANALYST' | 'VIEWER';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedDate: string;
  lastActive: string;
}

export interface OrganizationProfile {
  organizationId: string;
  organizationName: string;
  organizationType: OrganizationType;
  industry: string;
  country: string;
  teamMembers: TeamMember[];
  subscriptionPlan: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
  createdDate: string;
  apiAccessEnabled: boolean;
  securityDomainIsolation: boolean;
}

export class EnterpriseAccountService {
  private static organizations: OrganizationProfile[] = [
    {
      organizationId: 'org_eac_gov_01',
      organizationName: 'East African Community Secretariat (EAC)',
      organizationType: 'Government',
      industry: 'Public Governance & Economic Policy',
      country: 'Rwanda & Regional',
      subscriptionPlan: 'ENTERPRISE',
      createdDate: '2026-01-15',
      apiAccessEnabled: true,
      securityDomainIsolation: true,
      teamMembers: [
        { id: 'usr_01', name: 'Dr. Clare Akamanzi', email: 'c.akamanzi@eac.int', role: 'OWNER', joinedDate: '2026-01-15', lastActive: 'Just now' },
        { id: 'usr_02', name: 'Jean-Paul Nsengimana', email: 'jp.nsengimana@eac.int', role: 'ANALYST', joinedDate: '2026-02-01', lastActive: '12m ago' }
      ]
    },
    {
      organizationId: 'org_norrsken_vc',
      organizationName: 'Norrsken Africa Innovation Fund',
      organizationType: 'Investment Firm',
      industry: 'Venture Capital & Deep Tech',
      country: 'Rwanda',
      subscriptionPlan: 'ENTERPRISE',
      createdDate: '2026-03-10',
      apiAccessEnabled: true,
      securityDomainIsolation: true,
      teamMembers: [
        { id: 'usr_03', name: 'Pascal Murasira', email: 'pascal@norrsken.org', role: 'OWNER', joinedDate: '2026-03-10', lastActive: '1h ago' },
        { id: 'usr_04', name: 'Elena Rostova', email: 'elena@norrsken.org', role: 'ANALYST', joinedDate: '2026-04-05', lastActive: '3h ago' }
      ]
    },
    {
      organizationId: 'org_smart_africa',
      organizationName: 'Smart Africa Alliance',
      organizationType: 'NGO',
      industry: 'Digital Transformation & Telecoms',
      country: 'Pan-African',
      subscriptionPlan: 'PROFESSIONAL',
      createdDate: '2026-04-18',
      apiAccessEnabled: false,
      securityDomainIsolation: false,
      teamMembers: [
        { id: 'usr_05', name: 'Lacina Koné', email: 'lkone@smartafrica.org', role: 'OWNER', joinedDate: '2026-04-18', lastActive: '2d ago' }
      ]
    }
  ];

  public static getOrganizations(): OrganizationProfile[] {
    return [...this.organizations];
  }

  public static getCurrentOrganization(): OrganizationProfile {
    return this.organizations[0];
  }

  public static createOrganization(data: Omit<OrganizationProfile, 'organizationId' | 'createdDate' | 'teamMembers'>, ownerEmail: string, ownerName: string): OrganizationProfile {
    const newOrg: OrganizationProfile = {
      ...data,
      organizationId: `org_${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      teamMembers: [
        {
          id: `usr_${Date.now()}`,
          name: ownerName,
          email: ownerEmail,
          role: 'OWNER',
          joinedDate: new Date().toISOString().split('T')[0],
          lastActive: 'Just now'
        }
      ]
    };
    this.organizations.unshift(newOrg);
    return newOrg;
  }

  public static inviteTeamMember(orgId: string, name: string, email: string, role: UserRole): TeamMember | null {
    const org = this.organizations.find(o => o.organizationId === orgId);
    if (!org) return null;
    const newMember: TeamMember = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Pending Invite'
    };
    org.teamMembers.push(newMember);
    return newMember;
  }
}
