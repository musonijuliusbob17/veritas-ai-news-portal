export interface SecurityRole {
  roleId: string;
  roleName: string;
  description: string;
  permissions: string[];
  clearanceLevel: 'UNCLASSIFIED' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET_SOVEREIGN';
}

export interface SecurityLayerDetail {
  layerId: string;
  layerName: string;
  category: 'Access' | 'Data Protection' | 'Compliance & Audit' | 'Resilience';
  summary: string;
  implementationDetails: string[];
  standardsComplied: string[];
  status: 'ACTIVE_ENFORCED' | 'HARDENED' | 'CONTINUOUS_MONITORING';
  explanation: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  merkleHash: string;
  prevHash: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
}

export class SecurityArchitectureEngine {
  private static roles: SecurityRole[] = [
    {
      roleId: 'role_analyst',
      roleName: 'Junior Intelligence Analyst',
      description: 'Can query public press wires, view unclassified risk maps, and submit draft briefings.',
      clearanceLevel: 'UNCLASSIFIED',
      permissions: ['read:wires', 'query:search', 'draft:briefings']
    },
    {
      roleId: 'role_senior_officer',
      roleName: 'Senior Intelligence Officer',
      description: 'Authorized to publish intelligence briefings, trigger AI narrative scans, and inspect company dossiers.',
      clearanceLevel: 'RESTRICTED',
      permissions: ['read:wires', 'query:search', 'draft:briefings', 'publish:briefings', 'view:dossiers', 'execute:ai_scans']
    },
    {
      roleId: 'role_cso',
      roleName: 'Chief Security Officer (CSO)',
      description: 'Full sovereign access to classified threat matrices, knowledge graph exports, and mTLS key management.',
      clearanceLevel: 'TOP_SECRET_SOVEREIGN',
      permissions: ['read:wires', 'query:search', 'publish:briefings', 'view:dossiers', 'execute:ai_scans', 'access:classified_matrix', 'export:graph', 'manage:mtls_keys', 'view:audit_logs']
    },
    {
      roleId: 'role_auditor',
      roleName: 'Compliance & Integrity Auditor',
      description: 'ReadOnly inspection of Merkle tree cryptographic audit logs, digital signatures, and access policies.',
      clearanceLevel: 'CONFIDENTIAL',
      permissions: ['view:audit_logs', 'verify:digital_signatures', 'inspect:backup_logs']
    }
  ];

  private static securityLayers: SecurityLayerDetail[] = [
    {
      layerId: 'layer_auth',
      layerName: 'Authentication & Sovereign Identity',
      category: 'Access',
      summary: 'Multi-factor WebAuthn Passkeys, SAML 2.0 OIDC SSO, and Hardware Security Key enforcement.',
      implementationDetails: [
        'WebAuthn / FIDO2 biometrics (TouchID, FaceID, YubiKey) required for RESTRICTED access',
        'Enterprise SAML 2.0 / OIDC federation with sovereign identity providers (RISA ID, GovSSO)',
        'Context-aware session lifetime (15-min idle timeout for TOP_SECRET roles)',
        'Zero-trust adaptive MFA step-up triggered upon geographic or device anomaly'
      ],
      standardsComplied: ['NIST SP 800-63B (AAL3)', 'FIDO2 Level 3+', 'ISO/IEC 27001'],
      status: 'ACTIVE_ENFORCED',
      explanation: 'Authentication forms the outermost perimeter. By combining FIDO2 hardware keys with sovereign SAML federation, Veritas eliminates password phishing and credential stuffing attacks.'
    },
    {
      layerId: 'layer_rbac',
      layerName: 'Attribute & Role-Based Access Control (ABAC/RBAC)',
      category: 'Access',
      summary: 'Fine-grained policy enforcement mapping roles to data classification levels (UNCLASSIFIED to TOP_SECRET_SOVEREIGN).',
      implementationDetails: [
        'Declarative RBAC matrix controlling API endpoint invocation and UI action buttons',
        'Attribute-Based Access Control (ABAC) evaluating actor clearance vs document security tag',
        'Dynamic privilege revocation on anomalous threat posture shift',
        'Strict Principle of Least Privilege (PoLP) enforced across all microservices'
      ],
      standardsComplied: ['NIST SP 800-192', 'Zero Trust Architecture (NIST SP 800-207)'],
      status: 'ACTIVE_ENFORCED',
      explanation: 'Ensures users only view information matching their clearance level. Even if an analyst account is compromised, ABAC/RBAC prevents lateral movement into classified sovereign dossiers.'
    },
    {
      layerId: 'layer_api_sec',
      layerName: 'API Gateway & Network Security',
      category: 'Access',
      summary: 'Mutual TLS (mTLS), Token Bucket Rate Limiting, WAF inspection, and HMAC request signing.',
      implementationDetails: [
        'Mutual TLS (mTLS) client certificates mandatory for inter-service communication',
        'HMAC-SHA256 request signatures validating API payload body integrity in transit',
        'Adaptive Token Bucket Rate Limiting (100 req/min per IP, 1000 req/min for authenticated CSO)',
        'Web Application Firewall (WAF) filtering SQLi, XSS, and prompt injection payloads'
      ],
      standardsComplied: ['OWASP API Security Top 10', 'RFC 8446 (TLS 1.3)'],
      status: 'ACTIVE_ENFORCED',
      explanation: 'Protects backend API endpoints from distributed denial of service (DDoS), API abuse, and man-in-the-middle tampering.'
    },
    {
      layerId: 'layer_encryption',
      layerName: 'Encryption at Rest & Envelope Key Management',
      category: 'Data Protection',
      summary: 'AES-256-GCM database encryption powered by FIPS 140-2 Level 3 Hardware Security Modules (HSM).',
      implementationDetails: [
        'AES-256-GCM encryption for all database volumes, graph caches, and object stores',
        'Envelope Encryption: Data Encryption Keys (DEKs) wrapped by Master Key Encryption Keys (KEKs)',
        'Hardware Security Module (HSM) key storage with hardware-enforced non-exportability',
        'Automatic 30-day cryptographic key rotation schedule'
      ],
      standardsComplied: ['FIPS 140-2 Level 3', 'PCI-DSS v4.0', 'HIPAA Security Rule'],
      status: 'HARDENED',
      explanation: 'Protects stored intelligence data even in the event of physical drive seizure or storage snapshot theft. Unwrapping requires HSM authorization.'
    },
    {
      layerId: 'layer_secrets',
      layerName: 'Secrets Management & Ephemeral Credentials',
      category: 'Data Protection',
      summary: 'Centralized HashiCorp Vault store with dynamic ephemeral credentials and zero hardcoded keys.',
      implementationDetails: [
        'Zero hardcoded API keys or database passwords in source code or environment variables',
        'Short-lived, auto-expiring database credentials generated on-demand per request',
        'Strict audit logging for every secret read attempt with automatic lockout on 3 failed reads'
      ],
      standardsComplied: ['CIS Benchmarks', 'NIST SP 800-57'],
      status: 'HARDENED',
      explanation: 'Eliminates developer credential leaks. Ephemeral credentials automatically expire within 1 hour, making leaked tokens instantly useless.'
    },
    {
      layerId: 'layer_audit_logs',
      layerName: 'Immutable Cryptographic Audit Ledger',
      category: 'Compliance & Audit',
      summary: 'Tamper-evident Merkle Tree hash chain guaranteeing unalterable audit trails for compliance.',
      implementationDetails: [
        'Every user action, API query, and key read appends an entry to a cryptographic SHA-256 hash chain',
        'Merkle tree root published hourly to an immutable sovereign ledger',
        'Any attempt to edit, delete, or reorder historical logs invalidates all subsequent hash signatures',
        'Exportable in standardized W3C Verifiable Credentials and CEF formats'
      ],
      standardsComplied: ['SOC 2 Type II', 'ISO/IEC 27037 (Digital Evidence Handling)'],
      status: 'CONTINUOUS_MONITORING',
      explanation: 'Guarantees absolute accountability. System administrators cannot secretly wipe or alter audit logs after an unauthorized action.'
    },
    {
      layerId: 'layer_signatures',
      layerName: 'Digital Signatures & Anti-Tampering (ECDSA)',
      category: 'Compliance & Audit',
      summary: 'Cryptographic ECDSA P-384 signatures embedded into all published intelligence dossiers.',
      implementationDetails: [
        'All official intelligence briefings are digitally signed using the officer’s private key',
        'Receivers can verify origin authenticity and confirm 0-byte document tampering',
        'Embedded timestamp authority (TSA) proof proving exact publication time'
      ],
      standardsComplied: ['eIDAS Regulation', 'RFC 3161 (Timestamp Protocol)'],
      status: 'ACTIVE_ENFORCED',
      explanation: 'Prevents fake news injection or altered briefing distribution. Any 1-character modification in a signed report immediately breaks the ECDSA signature.'
    },
    {
      layerId: 'layer_dr_backup',
      layerName: 'Disaster Recovery, PITR & Multi-Region Resilience',
      category: 'Resilience',
      summary: 'Continuous Point-In-Time Recovery (PITR) with 15-second RPO and automated multi-region failover.',
      implementationDetails: [
        'Multi-region hot standby active-active database replication across Kigali, Nairobi, and Frankfurt',
        'Continuous Write-Ahead Log (WAL) archiving providing 15-second Recovery Point Objective (RPO)',
        'Automated health probe failover executing within 120 seconds (RTO < 2 minutes)',
        'Quarterly simulated disaster recovery chaos drills with zero data loss validation'
      ],
      standardsComplied: ['ISO 22301 (Business Continuity)', 'NIST SP 800-34'],
      status: 'CONTINUOUS_MONITORING',
      explanation: 'Ensures Veritas remains operational during severe cloud outages, submarine cable cuts, or natural disasters.'
    }
  ];

  private static mockAuditLogs: AuditLogEntry[] = [
    {
      id: 'log_9081',
      timestamp: '2026-08-02T16:20:12Z',
      actor: 'officer.p.kagame@risa.gov.rw',
      actorRole: 'Senior Intelligence Officer',
      action: 'PUBLISH_BRIEFING',
      resource: 'briefing_eac_clean_energy_2026',
      ipAddress: '197.243.16.42 (Kigali, RWA)',
      merkleHash: '0x8f2a1b9c7d3e4f5a...6b7c8d9e0f1a2b3c',
      prevHash: '0x1a2b3c4d5e6f7a8b...9c0d1e2f3a4b5c6d',
      status: 'SUCCESS'
    },
    {
      id: 'log_9082',
      timestamp: '2026-08-02T16:22:45Z',
      actor: 'analyst.j.smith@reuters.com',
      actorRole: 'Junior Intelligence Analyst',
      action: 'ACCESS_CLASSIFIED_DOSSIER',
      resource: 'dossier_sovereign_defense_rwanda',
      ipAddress: '54.210.88.12 (Frankfurt, DEU)',
      merkleHash: '0x3c4d5e6f7a8b9c0d...1e2f3a4b5c6d7e8f',
      prevHash: '0x8f2a1b9c7d3e4f5a...6b7c8d9e0f1a2b3c',
      status: 'DENIED'
    },
    {
      id: 'log_9083',
      timestamp: '2026-08-02T16:25:01Z',
      actor: 'cso.m.musoni@veritas.ai',
      actorRole: 'Chief Security Officer (CSO)',
      action: 'ROTATE_HSM_MASTER_KEY',
      resource: 'hsm_slot_01_kek',
      ipAddress: '10.0.12.4 (Internal Gateway)',
      merkleHash: '0x7e8f9a0b1c2d3e4f...5a6b7c8d9e0f1a2b',
      prevHash: '0x3c4d5e6f7a8b9c0d...1e2f3a4b5c6d7e8f',
      status: 'SUCCESS'
    }
  ];

  public static getRoles(): SecurityRole[] {
    return this.roles;
  }

  public static getSecurityLayers(): SecurityLayerDetail[] {
    return this.securityLayers;
  }

  public static getAuditLogs(): AuditLogEntry[] {
    return this.mockAuditLogs;
  }
}
