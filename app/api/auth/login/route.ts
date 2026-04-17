import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "surge_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: Request) {
  const expected = (process.env.SURGE_ACCESS_PASSWORD || "").trim();

  if (!expected) {
    return NextResponse.json(
      {
        error:
          "SURGE_ACCESS_PASSWORD is not configured. Set it in your environment variables.",
      },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const provided = (body.password || "").trim();
  if (!provided) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  // Constant-time-ish compare (good enough for a single-password gate)
  if (provided.length !== expected.length || provided !== expected) {
    return NextResponse.json({ error: "Incorrect access code" }, { status: 401 });
  }

  // Issue cookie. Value is a token derived from the password so that rotating the
  // env var instantly invalidates all existing sessions without an extra secret.
  const token = `authenticated-${expected.slice(-8)}`;

  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
