import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    module: "brain",
    message: "Brain API route is ready.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      ok: true,
      module: "brain",
      received: body,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        module: "brain",
        error: "Invalid JSON payload",
      },
      { status: 400 },
    );
  }
}
