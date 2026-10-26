export const brainSystem = {
  name: 'brain',
  description: 'Core reasoning engine for Brillz operations',
  status: 'active',
};

export function createBrainDirective(command: string) {
  return {
    directive: command,
    module: 'brain',
    createdAt: new Date().toISOString(),
  };
}
