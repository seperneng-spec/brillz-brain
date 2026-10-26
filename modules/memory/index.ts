export const memoryNamespace = {
  name: 'memory',
  storage: 'vector-index',
};

export function remember(key: string, value: string) {
  return { key, value, savedAt: new Date().toISOString() };
}
