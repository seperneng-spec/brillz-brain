import { describe, expect, it } from "vitest";
import { createSecurityModule } from "../modules/security";

describe("security module", () => {
  it("applies a default secure policy", () => {
    const policy = createSecurityModule();

    expect(policy.validate().valid).toBe(true);
    expect(policy.policy.requireAuth).toBe(true);
    expect(policy.policy.rateLimit).toBe(60);
  });
});
