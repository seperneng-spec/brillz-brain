import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveOpenAIClient } from '@/lib/openai';

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1),
      }),
    )
    .min(1)
    .optional(),
  prompt: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Payload is invalid', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const client = resolveOpenAIClient();

    if (!client) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured.' },
        { status: 500 },
      );
    }

    const messages = parsed.data.messages ?? [
      { role: 'user' as const, content: parsed.data.prompt ?? 'Summarize the current system status.' },
    ];

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are Brillz Brain, an AI operations assistant for a system orchestration dashboard.',
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? 'No response generated.';

    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred.';

    return NextResponse.json(
      { error: 'Failed to generate a response.', details: message },
      { status: 500 },
    );
  }
}
