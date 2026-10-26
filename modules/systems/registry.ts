export type SystemDefinition = {
  id: string;
  name: string;
  description?: string;
};

export const systemsRegistry = new Map<string, SystemDefinition>();

export function registerSystem(system: SystemDefinition) {
  systemsRegistry.set(system.id, system);
  return system;
}

export function getSystem(id: string) {
  return systemsRegistry.get(id);
}

export function listSystems() {
  return Array.from(systemsRegistry.values());
}
