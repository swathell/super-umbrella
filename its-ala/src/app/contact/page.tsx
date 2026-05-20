import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/marketing/section-heading";

export default function ContactPage() {
  return (
    <main className="bg-sand py-24">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeading
          eyebrow="Contact"
          title="Start with the problem, not a polished spec."
          body="If this is your first Vercel-backed project, that is fine. We are building the structure so the trust layer and the actual app layer can grow together."
        />
        <ContactForm />
      </div>
    </main>
  );
}
