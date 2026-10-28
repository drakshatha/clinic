import { site } from "@/lib/site";
import { blogPosts } from "@/lib/blog";
import { services } from "@/lib/site";

export const revalidate = 86400;

export function GET() {
  const lines: string[] = [
    `# ${site.name}`,
    ``,
    `## About`,
    `${site.name} is a specialist dental clinic in ${site.area}, ${site.city} 560096, India.`,
    `Lead clinician: ${site.doctor}, ${site.credentials}, ${site.yearsExperience}+ years clinical experience.`,
    `Phone: ${site.phoneDisplay} | Hours: ${site.hours}`,
    `Address: ${site.address}`,
    ``,
    `## Services`,
    ...services.map((s) => `- [${s.title}](${site.url}/services/${s.slug}): ${s.summary}`),
    ``,
    `## Pricing (indicative ranges — exact quotes after consultation)`,
    `- Single dental implant: ₹25,000 – ₹40,000 per tooth (implant + abutment + crown)`,
    `- Implant + bone graft: ₹35,000 – ₹60,000`,
    `- All-on-4 full arch: ₹2,50,000 – ₹4,00,000 per jaw`,
    `- All-on-6 full arch: ₹3,50,000 – ₹5,00,000 per jaw`,
    `- Zirconia crown: ₹10,000 – ₹22,000 per tooth`,
    `- Porcelain-fused-to-metal (PFM) crown: ₹5,000 – ₹12,000 per tooth`,
    `- Composite dental bonding: ₹3,000 – ₹8,000 per tooth`,
    `- Porcelain veneers: ₹12,000 – ₹25,000 per tooth`,
    `- Complete dentures (both arches): ₹25,000 – ₹60,000`,
    `- OPG X-ray: ₹500 – ₹800 | CBCT scan: ₹2,000 – ₹3,500`,
    ``,
    `## Key pages`,
    `- [Home](${site.url}): Overview of the clinic and specialist services`,
    `- [About Dr. Akshatha V](${site.url}/about): Qualifications, experience, specialist background`,
    `- [Dental Implant Cost Bengaluru](${site.url}/dental-implant-cost-bangalore): Full pricing breakdown`,
    `- [All-on-4 Dental Implants Bengaluru](${site.url}/all-on-4-dental-implants-bangalore): Full-arch implant pricing and procedure`,
    `- [Smile Makeover Cost Bengaluru](${site.url}/smile-makeover-cost-bangalore): Cosmetic treatment pricing`,
    `- [Services](${site.url}/services): All specialist treatments`,
    ``,
    `## Blog`,
    ...blogPosts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}) (${p.publishedAt}): ${p.description}`),
    ``,
    `## Contact`,
    `- Phone: ${site.phoneDisplay}`,
    `- WhatsApp: https://wa.me/${site.whatsapp}`,
    `- Book online: ${site.url}/contact`,
    ``,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
