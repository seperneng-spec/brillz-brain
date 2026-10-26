import { describe, expect, it } from 'vitest';
import { ensureAccess } from '../modules/security';

describe('security module', () => {
  it('allows authorized roles and rejects guests', () => {
    expect(ensureAccess('admin').authorized).toBe(true);
    expect(ensureAccess('guest').authorized).toBe(false);
  });
});
