export type BuilderConfig = {
  projectName: string;
  template?: string;
};

export class BuilderModule {
  public readonly projectName: string;
  public readonly template: string;

  constructor(config: BuilderConfig) {
    this.projectName = config.projectName;
    this.template = config.template ?? "default";
  }

  build() {
    return {
      projectName: this.projectName,
      template: this.template,
      status: "ready",
    };
  }
}

export function createBuilder(config: BuilderConfig) {
  return new BuilderModule(config);
}

export default BuilderModule;
