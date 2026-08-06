import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function CtaBand() {
  return (
    <Section>
      <Reveal>
        <div className="rounded-[28px] border border-line bg-bg-soft px-6 py-14 text-center md:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
            Limited appointments available
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Ready to Restore Your Smile?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Book a specialist consultation and leave with a clear plan for implants,
            crowns, dentures, or a full smile makeover.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/contact#book">Book Appointment</Button>
            <Button href="/services" variant="secondary">
              View Treatments
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
