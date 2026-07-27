import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

/** Matches the honeypot input's name in ContactForm. */
const HONEYPOT_FIELD = "company";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 120, email: 200, message: 4000 };

type Payload = Record<string, unknown>;

function field(payload: Payload, key: string): string {
  const value = payload[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not read that request." },
      { status: 400 },
    );
  }

  // A filled honeypot means a bot. Answer with the same success shape a human
  // gets: an error would tell the bot what tripped it.
  if (field(payload, HONEYPOT_FIELD) !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = field(payload, "name");
  const email = field(payload, "email");
  const message = field(payload, "message");

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, email and message." },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    message.length > LIMITS.message
  ) {
    return NextResponse.json(
      { ok: false, error: "That message is longer than this form accepts." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please email me instead." },
      { status: 502 },
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error: sendError } = await resend.emails.send({
      // Shared Resend sender until hateem.dev is a verified sending domain.
      // Swap to "hateem.dev <contact@hateem.dev>" once that's done.
      from: "hateem.dev <onboarding@resend.dev>",
      to: "hateemnaza@gmail.com",
      replyTo: email,
      subject: `hateem.dev — ${name}`,
      text: message,
    });

    if (sendError) {
      console.error("[contact] Resend error", sendError);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please email me instead." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send threw", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please email me instead." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
