import Image from "next/image";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function DoctorSection() {
  return (
    <Section id="doctor">
      <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="overflow-hidden rounded-[28px] shadow-[var(--shadow)]">
            <Image
              src="/images/doctor-portrait-clean.png"
              alt={site.doctor}
              width={640}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
            Meet Your Specialist
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{site.doctor}</h2>
          <p className="mt-2 font-semibold text-blue">{site.credentials}</p>
          <p className="mt-5 leading-relaxed text-muted">
            {site.doctor} specializes in rebuilding smiles through dental implants, crowns &
            bridges, dentures, and full-mouth rehabilitation. Her approach combines clinical
            precision with a calm, patient-first experience — so every plan feels clear,
            comfortable, and confidence-building.
          </p>
          <ul className="mt-6 space-y-3 text-sm font-medium text-navy">
            {[
              "MDS in Prosthodontics & Implantology",
              `${site.yearsExperience}+ years of clinical experience`,
              "Expert in full-mouth rehabilitation",
              "Smile design & cosmetic dentistry",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 border-b border-line pb-3">
                <span className="text-success">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/about">Meet the Doctor →</Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
