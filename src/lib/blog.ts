import { site } from "@/lib/site";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date string
  updatedAt?: string;
  readingMinutes: number;
  category: string;
  relatedService?: string; // service slug
  keywords: string[];
  content: string; // HTML string
};

export const blogPosts: BlogPost[] = [
  {
    slug: "dental-implant-cost-bengaluru",
    title: "Dental Implant Cost in Bengaluru: What Determines the Price?",
    description:
      "A transparent breakdown of dental implant costs in Bengaluru — what drives the price, what's included, and what to ask your specialist before committing.",
    publishedAt: "2026-08-20",
    readingMinutes: 7,
    category: "Patient Guide",
    relatedService: "dental-implants",
    keywords: [
      "dental implant cost Bengaluru",
      "dental implants price Bengaluru",
      "how much do dental implants cost in Bengaluru",
      "affordable dental implants Bengaluru",
      "dental implants Mahalakshmi Layout",
    ],
    content: `
<p class="lead">Missing a tooth and wondering what an implant actually costs in Bengaluru? The short answer: a single implant typically ranges from <strong>₹25,000 to ₹75,000+</strong> depending on several factors — and knowing those factors helps you make a better decision, not just a cheaper one.</p>

<h2>Why Implant Costs Vary So Much</h2>
<p>Dental implants aren't a commodity. Unlike a filling or extraction, an implant is a multi-stage surgical and prosthetic procedure that involves a specialist's time, medical-grade materials, and precision equipment. The cost reflects all of that.</p>
<p>The main variables that move the price:</p>
<ul>
  <li><strong>Implant brand and material</strong> — Medical-grade titanium implants from established brands (Straumann, Nobel Biocare, Osstem, etc.) cost more than unbranded imports. The brand matters because long-term outcomes are backed by clinical data and global recall support.</li>
  <li><strong>Crown type</strong> — The crown that sits on top of the implant can be zirconia (most natural-looking), porcelain-fused-to-metal, or metal. Zirconia is typically higher cost but significantly better aesthetically and in biocompatibility.</li>
  <li><strong>Number of implants</strong> — A single missing tooth is one implant + one crown. Multiple missing teeth may use fewer implants than teeth (e.g. 4 implants for a full arch in "All-on-4"), which can be more cost-effective per tooth than individual implants.</li>
  <li><strong>Bone condition</strong> — If you've had a missing tooth for a long time, the jawbone may have resorbed. A bone graft or sinus lift procedure is sometimes needed before the implant can be placed. This adds to the overall cost.</li>
  <li><strong>Specialist vs. general dentist</strong> — A prosthodontist (MDS specialist in dental restorations and implants) brings focused training to implant planning and crown design. Specialist fees reflect that expertise and generally lead to better functional and aesthetic outcomes.</li>
  <li><strong>Imaging and diagnostics</strong> — A 3D CBCT scan is typically needed to assess bone depth and anatomy before implant placement. This is sometimes included in the treatment cost, sometimes separate.</li>
</ul>

<h2>Typical Cost Ranges in Bengaluru</h2>
<table>
  <thead>
    <tr><th>Procedure</th><th>Approximate Cost</th></tr>
  </thead>
  <tbody>
    <tr><td>Single implant + zirconia crown</td><td>₹35,000 – ₹75,000+</td></tr>
    <tr><td>Single implant + metal-ceramic crown</td><td>₹25,000 – ₹45,000</td></tr>
    <tr><td>All-on-4 (full arch, 4 implants)</td><td>₹2,50,000 – ₹5,00,000</td></tr>
    <tr><td>Bone graft (if needed)</td><td>₹8,000 – ₹25,000</td></tr>
    <tr><td>CBCT scan</td><td>₹2,500 – ₹5,000</td></tr>
  </tbody>
</table>
<p class="note">Note: These are typical ranges for Bengaluru. Exact costs depend on your specific case and are confirmed at consultation. Prices at Akshatha Dental Clinic are shared transparently at your first visit.</p>

<h2>What Should Be Included in the Quote</h2>
<p>When a clinic quotes you an implant cost, always ask what's included. A genuinely complete quote covers:</p>
<ol>
  <li>The implant fixture (the titanium screw placed in the bone)</li>
  <li>The abutment (the connector between implant and crown)</li>
  <li>The crown (the visible tooth portion)</li>
  <li>Pre-surgical consultation and treatment planning</li>
  <li>Post-surgical follow-up visits</li>
</ol>
<p>Imaging (CBCT scan) and bone grafting, if needed, are typically quoted separately because they're only required in specific cases.</p>

<h2>Why Cheaper Isn't Always Better</h2>
<p>It's tempting to compare on price alone. But with implants, the cost of a failed implant — failed osseointegration, implant rejection, or a poorly fitted crown causing bite problems — is significantly higher than the savings from going with a lower-quality fixture or inexperienced provider.</p>
<p>Questions worth asking:</p>
<ul>
  <li>What implant brand and grade of titanium are you using?</li>
  <li>Are you a prosthodontist (MDS specialist) or a general dentist?</li>
  <li>Do you have CBCT imaging capability in-house?</li>
  <li>What's the follow-up protocol if I have a problem after placement?</li>
</ul>

<h2>Are Implants Worth the Cost?</h2>
<p>Compared to the alternatives — bridges (which require grinding adjacent healthy teeth) or removable dentures (which slip, limit food choices, and accelerate bone loss) — implants are the only tooth replacement that preserves jawbone and mimics natural tooth function. A well-placed implant with a quality crown typically lasts <strong>15–25 years or more</strong> with proper care.</p>
<p>That longevity changes the cost calculation significantly. Over 20 years, an implant is often more cost-effective than repeatedly replacing dentures or managing a failing bridge.</p>

<h2>Does Insurance Cover Implants?</h2>
<p>Most Indian health insurance policies don't cover elective dental procedures including implants. Some corporate dental benefit plans include partial coverage — check your policy documents or bring your insurance details to your consultation and we'll help you understand what applies.</p>

<h2>Next Step: Get a Personalised Assessment</h2>
<p>Every implant case is different. Bone depth, gum health, the location of the missing tooth, and your overall oral condition all affect what's right for you. The only way to get an accurate cost and a plan you can trust is a proper clinical assessment with imaging.</p>
<p>Dr. Akshatha V is an MDS Prosthodontist and Implantologist at Akshatha Dental Clinic, Mahalakshmi Layout — specialising in implant planning, full-arch restoration, and implant-supported dentures. Appointments are available daily from 11 AM to 9:30 PM.</p>
    `.trim(),
  },

  {
    slug: "prosthodontist-vs-general-dentist",
    title: "Prosthodontist vs General Dentist: When Should You See a Specialist?",
    description:
      "Not sure whether to visit a prosthodontist or your regular dentist? Here's how to tell the difference — and which cases actually benefit from specialist care.",
    publishedAt: "2026-08-20",
    readingMinutes: 5,
    category: "Patient Guide",
    relatedService: undefined,
    keywords: [
      "prosthodontist Bengaluru",
      "prosthodontist vs dentist",
      "when to see a prosthodontist",
      "MDS prosthodontist Bengaluru",
      "dental specialist Bengaluru",
    ],
    content: `
<p class="lead">Most people visit a general dentist for check-ups, fillings, and cleanings — and that's exactly right. But certain dental problems need a different kind of training. A prosthodontist is a dental specialist with focused expertise in restoring and replacing teeth. Knowing the difference can save you time, money, and unnecessary procedures.</p>

<h2>What Is a Prosthodontist?</h2>
<p>A prosthodontist is a dentist who completed an additional 3-year post-graduation (MDS) in Prosthodontics after their BDS degree — focused entirely on restoring damaged teeth and replacing missing ones. In India, this is the MDS (Master of Dental Surgery) qualification with a specialisation in Prosthodontics and Crown & Bridge.</p>
<p>That specialisation covers:</p>
<ul>
  <li>Dental implants and implant-supported restorations</li>
  <li>Full mouth rehabilitation (rebuilding the entire bite)</li>
  <li>Complex crown and bridge work</li>
  <li>Complete and partial dentures</li>
  <li>Cosmetic restorations including veneers and smile makeovers</li>
  <li>TMJ (jaw joint) problems related to bite</li>
</ul>

<h2>What a General Dentist Does</h2>
<p>A general dentist (BDS) manages the broad range of everyday dental needs: fillings, extractions, root canals, scaling and cleaning, basic crowns, and preventive care. Most people don't need a specialist for most of their dental visits.</p>

<h2>When to See a Prosthodontist</h2>
<p>A specialist consultation adds real value in these situations:</p>
<ul>
  <li><strong>You're missing one or more teeth</strong> and considering implants, a bridge, or dentures — especially if you want to understand all your options before committing.</li>
  <li><strong>Multiple teeth are severely worn, cracked, or damaged</strong> — coordinating the restoration of many teeth requires bite design expertise that goes beyond routine crown work.</li>
  <li><strong>You've had a failed implant or failed crown</strong> — specialist assessment can identify why it failed and how to approach it differently.</li>
  <li><strong>You need full mouth rehabilitation</strong> — rebuilding the entire bite is complex work that requires a prosthodontist's planning framework.</li>
  <li><strong>A smile makeover involves significant structural changes</strong> — not just whitening or minor cosmetic work, but veneers, crowns, and gum-line changes together.</li>
  <li><strong>You've been told you need bone grafting or sinus lift</strong> before an implant — these procedures benefit from specialist oversight of the full treatment chain.</li>
</ul>

<h2>Can't My Regular Dentist Do This?</h2>
<p>General dentists are trained in basic crown and bridge work, and many do single implants. But complex cases — multiple missing teeth, worn-down dentition, full-arch implants, failing bridgework — involve bite mechanics, material selection, and treatment sequencing that specialist training specifically prepares for.</p>
<p>Think of it like medicine: your GP handles most things well, but you'd see an orthopaedic surgeon for a complex joint issue, not just because it involves surgery, but because the depth of specialisation changes the outcome.</p>

<h2>Do I Need a Referral?</h2>
<p>No. You can book a prosthodontist consultation directly. Many patients come after a general dentist has recommended specialist review, but you don't need a referral to visit one.</p>

<h2>What to Expect at a Specialist Consultation</h2>
<p>A first visit typically includes a clinical examination, review of X-rays or CBCT scans (if available), a discussion of your goals and concerns, and a treatment plan outline with options and approximate costs. You won't be pushed into immediate treatment — the consultation is to understand what's possible and what's right for your case.</p>

<h2>Consulting a Prosthodontist in Bengaluru</h2>
<p>Dr. Akshatha V holds an MDS in Prosthodontics and Crown & Bridge, with over 11 years of specialist practice at Akshatha Dental Clinic in Mahalakshmi Layout, Bengaluru. Consultations are available daily 11 AM – 9:30 PM.</p>
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
