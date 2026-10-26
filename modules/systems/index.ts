export const systemRegistry = {
  name: 'systems',
  items: ['memory', 'builder', 'security', 'brain'],
};

export function registerSystem(name: string) {
  return { name, registeredAt: new Date().toISOString() };
}
