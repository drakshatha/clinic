import { faqs } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";

export function FaqSection({ items = faqs }: { items?: { q: string; a: string }[] }) {
  return (
    <Section alt id="faq">
      <SectionHeading
        kicker="FAQ"
        title="Questions Patients Ask Most"
        description="Clear answers before you walk in — so your visit feels calm and informed."
      />
      <Reveal>
        <div className="mx-auto max-w-3xl">
          <Accordion items={items} />
        </div>
      </Reveal>
    </Section>
  );
}
