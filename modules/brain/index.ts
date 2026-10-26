export type BrainConfig = {
  name: string;
  model?: string;
  temperature?: number;
};

export class BrainModule {
  public readonly name: string;
  public readonly model: string;
  public readonly temperature: number;

  constructor(config: BrainConfig) {
    this.name = config.name;
    this.model = config.model ?? "gpt-4o-mini";
    this.temperature = config.temperature ?? 0.2;
  }

  get metadata() {
    return {
      name: this.name,
      model: this.model,
      temperature: this.temperature,
    };
  }
}

export function createBrain(config: BrainConfig) {
  return new BrainModule(config);
}

export default BrainModule;
