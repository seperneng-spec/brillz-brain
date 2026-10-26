export type SecurityPolicy = {
  allowAnonymous?: boolean;
  requireAuth?: boolean;
  rateLimit?: number;
};

export class SecurityModule {
  public readonly policy: SecurityPolicy;

  constructor(policy: SecurityPolicy = {}) {
    this.policy = {
      allowAnonymous: false,
      requireAuth: true,
      rateLimit: 60,
      ...policy,
    };
  }

  validate() {
    return {
      valid: true,
      policy: this.policy,
    };
  }
}

export function createSecurityModule(policy?: SecurityPolicy) {
  return new SecurityModule(policy);
}

export default SecurityModule;
