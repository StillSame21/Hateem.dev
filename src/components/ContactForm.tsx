"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/*
 * Underline only: a bottom hairline, no box, no radius.
 *
 * Note there is no `outline-none` here. The darkened border is a nice extra
 * cue but it is far too quiet to be the only one, so these fields keep the
 * global :focus-visible ring from globals.css. A ring that appears on focus is
 * not the same thing as a resting-state box.
 */
const FIELD =
  "mono w-full min-h-11 border-0 border-b border-rule bg-transparent px-0 py-3 text-[16px] text-ink placeholder:text-ink-muted/70 focus:border-ink";

const LABEL = "mono block text-[12px] text-ink-muted md:text-[13px]";

/**
 * Underline-only inputs: a bottom hairline, no boxes, no rounded rectangles.
 *
 * The provider is not wired up yet — /api/contact validates and logs, with a
 * TODO for Resend. The form's success and error states are real, so swapping
 * the provider in needs no change here.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setStatus("error");
        setError(result.error ?? "Something went wrong. Please email me instead.");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Could not reach the server. Please email me instead.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mt-12 flex max-w-[560px] flex-col gap-7 md:mt-16"
    >
      <div>
        <label className={LABEL} htmlFor="contact-name">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          maxLength={120}
          className={FIELD}
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={200}
          className={FIELD}
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          maxLength={4000}
          className={`${FIELD} resize-y`}
        />
      </div>

      {/*
        Honeypot. Off-screen rather than display:none, because some bots skip
        hidden inputs. tabindex="-1" keeps it out of the keyboard path, which is
        also what makes aria-hidden legitimate here. A filled value gets the
        same success response a human gets — see the route handler.
      */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="mono inline-flex h-12 w-full items-center justify-center border border-ink px-6 text-[13px] text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-start"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        {/* Both states are visible text, not colour alone. */}
        <p role="status" aria-live="polite" className="mono text-[12px] md:text-[13px]">
          {status === "sent" ? (
            <span className="text-signal">
              Thanks — your message is on its way. I&rsquo;ll reply to the
              address you gave.
            </span>
          ) : null}
        </p>

        {status === "error" ? (
          <p role="alert" className="mono text-[12px] text-ink md:text-[13px]">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
