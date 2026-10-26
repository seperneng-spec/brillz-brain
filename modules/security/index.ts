export const securityPolicy = {
  name: 'security',
  mode: 'strict',
  features: ['rbac', 'audit', 'validation'],
};

export function ensureAccess(role: string) {
  return { role, authorized: role !== 'guest' };
}
