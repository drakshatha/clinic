import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const photos = [
  {
    src: "/images/before-after/gallery-smile-makeover-2.jpg",
    label: "Smile Makeover",
    alt: "Woman showing confident bright smile after smile makeover treatment",
  },
  {
    src: "/images/before-after/gallery-veneers.jpg",
    label: "Porcelain Veneers",
    alt: "Dentist shade-matching veneers for a smiling patient",
  },
  {
    src: "/images/before-after/gallery-full-mouth.jpg",
    label: "Full Mouth Rehabilitation",
    alt: "Senior patient delighted with her full mouth rehabilitation result",
  },
  {
    src: "/images/before-after/gallery-implant-2.jpg",
    label: "Dental Implants",
    alt: "Patient celebrating successful implant result with her dentist",
  },
  {
    src: "/images/before-after/gallery-cosmetic-2.jpg",
    label: "Cosmetic Dentistry",
    alt: "Woman smiling naturally while caring for her bright teeth",
  },
  {
    src: "/images/before-after/gallery-confidence-2.jpg",
    label: "Smile Confidence",
    alt: "Woman radiating confidence with her beautifully restored smile",
  },
];

export function BeforeAfterGallery() {
  return (
    <Section alt id="gallery">
      <SectionHeading
        kicker="Smile Gallery"
        title="Happy Patients, Lasting Results"
        description="The kind of experience and outcomes specialist prosthodontic care delivers — personalised, gentle, and built around you."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, i) => (
          <Reveal key={photo.src} delay={i * 70}>
            <div className="group overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy shadow-sm">
                  {photo.label}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        ✦ Illustrative images. Real patient cases available to view at your consultation.
      </p>

      <div className="mt-6 text-center">
        <Button href="/contact#book">Book your consultation</Button>
      </div>
    </Section>
  );
}
