import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function HomeBooking() {
  return (
    <Section id="book" alt>
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr]">
        <Reveal>
          <SectionHeading
            kicker="Book Online"
            title="Start With a Free Consultation"
            description="Share your details and preferred treatment. We’ll confirm your slot on WhatsApp — no third-party clutter, just clear next steps."
            center={false}
          />
          <ul className="mt-6 space-y-3 text-sm font-medium text-navy">
            {[
              "Specialist prosthodontist consultation",
              "Transparent treatment options",
              "WhatsApp confirmation within hours",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-success">✔</span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={100}>
          <AppointmentForm />
        </Reveal>
      </div>
    </Section>
  );
}
