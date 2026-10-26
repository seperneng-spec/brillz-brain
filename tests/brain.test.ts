import { describe, expect, it } from "vitest";
import { createBrain } from "../modules/brain";

describe("brain module", () => {
  it("creates a brain instance with defaults", () => {
    const brain = createBrain({ name: "brillz" });

    expect(brain.name).toBe("brillz");
    expect(brain.model).toBe("gpt-4o-mini");
    expect(brain.temperature).toBe(0.2);
  });
});
