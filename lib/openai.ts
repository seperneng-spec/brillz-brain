import OpenAI from 'openai';

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured.');
  }

  return new OpenAI({ apiKey });
}

export function resolveOpenAIClient() {
  try {
    return getOpenAI();
  } catch {
    return null;
  }
}
