import { NextResponse } from "next/server";

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

  /*
   * TODO: send the email. Planned provider is Resend:
   *
   *   import { Resend } from "resend";
   *   const resend = new Resend(process.env.RESEND_API_KEY);
   *   await resend.emails.send({
   *     from: "hateem.dev <contact@hateem.dev>",
   *     to: "hateemnaza@gmail.com",
   *     replyTo: email,
   *     subject: `hateem.dev — ${name}`,
   *     text: message,
   *   });
   *
   * Add RESEND_API_KEY to the Vercel project environment first, and return a
   * 502 with { ok: false } if the send throws so the form can show its error
   * state instead of a false success.
   */
  console.info("[contact] submission received", {
    name,
    email,
    length: message.length,
  });

  return NextResponse.json({ ok: true });
}
