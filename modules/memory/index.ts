export type MemoryEntry = {
  id: string;
  key: string;
  value: unknown;
  createdAt: string;
};

export class MemoryStore {
  private storage = new Map<string, MemoryEntry>();

  set(key: string, value: unknown) {
    const id = crypto.randomUUID();
    const entry: MemoryEntry = {
      id,
      key,
      value,
      createdAt: new Date().toISOString(),
    };

    this.storage.set(key, entry);
    return entry;
  }

  get(key: string) {
    return this.storage.get(key)?.value;
  }

  getEntry(key: string) {
    return this.storage.get(key);
  }

  list() {
    return Array.from(this.storage.values());
  }
}

export function createMemoryStore() {
  return new MemoryStore();
}

export default MemoryStore;
