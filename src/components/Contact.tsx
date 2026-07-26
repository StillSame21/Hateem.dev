import { ContactForm } from "@/components/ContactForm";
import { Section } from "@/components/Section";
import { SITE } from "@/lib/site";

export function Contact() {
  return (
    <Section id="contact" label="Contact">
      <p className="max-w-[24ch] text-[26px] leading-[1.25] text-ink md:max-w-[28ch] md:text-[38px]">
        Open to internship offers for September to December 2026.
      </p>

      {/* The email is this section's accent and its primary call to action —
          which is why the Send button below is the quiet outline variant. */}
      <p className="mt-6 md:mt-8">
        <a
          href={`mailto:${SITE.email}`}
          className="inline-flex min-h-11 items-center text-[20px] leading-[1.3] break-all text-signal underline decoration-signal/30 decoration-1 underline-offset-[6px] transition-colors hover:decoration-signal md:text-[28px]"
        >
          {SITE.email}
        </a>
      </p>

      <ContactForm />
    </Section>
  );
}
