import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function Financing() {
  return (
    <Section>
      <Reveal>
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#040a1e_0%,#1a2438_55%,#4a7fa8_100%)] p-8 text-white md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
                Insurance &amp; Financing
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Quality Care Should Feel Accessible
              </h2>
              <p className="mt-4 max-w-xl text-white/75">
                Transparent pricing, EMI options on request, and guidance on insurance
                documentation during consultation.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["EMI Available", "Transparent Pricing", "Free Consultation"].map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <Button href="/contact#book" variant="white">
              Discuss your plan
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
