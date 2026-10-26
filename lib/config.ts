export const appConfig = {
  appName: 'Brillz Brain',
  environment: process.env.NODE_ENV ?? 'development',
  defaultModel: 'gpt-4o-mini',
};

export function formatSystemName(name: string) {
  return name.trim().replace(/\s+/g, ' ');
}
