import { describe, expect, it, vi } from 'vitest';
import { NextResponse } from 'next/server';

vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: async () => ({
          choices: [{ message: { content: 'สวัสดีจาก Brillz Brain' } }],
        }),
      },
    };
  },
}));

describe('API chat route', () => {
  it('returns the assistant reply when prompt is valid', async () => {
    const { POST } = await import('../app/api/chat/route');

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'สวัสดี' }],
      }),
    });

    const response = await POST(request as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.reply).toContain('Brillz');
  });
});
