import { describe, expect, it } from "vitest";
import { listSystems, registerSystem } from "../modules/systems/registry";

describe("systems registry", () => {
  it("registers and lists systems", () => {
    registerSystem({ id: "memory", name: "Memory System" });
    registerSystem({ id: "builder", name: "Builder System" });

    expect(listSystems().some((system) => system.id === "memory")).toBe(true);
    expect(listSystems().some((system) => system.id === "builder")).toBe(true);
  });
});
