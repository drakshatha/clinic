export const site = {
  name: "Akshatha Dental Clinic",
  shortName: "Akshatha Dental",
  doctor: "Dr. Akshatha V",
  credentials: "MDS Prosthodontist & Implantologist",
  tagline: "Prosthodontist in Mahalakshmi Layout, Bengaluru",
  phone: "+916364349943",
  phoneDisplay: "+91 63643 49943",
  whatsapp: "916364349943",
  email: "care@akshathadental.com",
  city: "Bengaluru",
  area: "Mahalakshmi Layout",
  address: "K M Arcade, opp. Swimming Pool & Bus Stop, next to Buddha Statue, Mahalakshmi Layout, Bengaluru 560096",
  hours: "11:00 AM – 9:30 PM · Daily",
  openHour: 11,
  closeHour: 21,
  yearsExperience: 11,
  patientsServed: "1000+",
  rating: "4.9",
  reviewCount: 50,
  url: "https://drakshatha.in",
  // Direct write-review link (confirmed from Google Business Profile)
  googleReviewUrl: "https://g.page/r/CcptNvhnF_qkEBE/review",
  mapsEmbed:
    "https://maps.google.com/maps?q=Akshatha+Dental+Clinic+KM+Arcade+Mahalakshmi+Layout+Bengaluru&z=15&output=embed",
  // Shareable Google Maps link (non-embed) — used in schema sameAs / hasMap
  mapsUrl: "https://maps.google.com/maps?q=Akshatha+Dental+Clinic+KM+Arcade+Mahalakshmi+Layout+Bengaluru",
  // Social & directory profile URLs — fill these in once verified, leave "" to omit from schema
  instagram: "",   // e.g. "https://www.instagram.com/akshathadental"
  facebook: "",    // e.g. "https://www.facebook.com/akshathadental"
  practo: "",      // e.g. "https://www.practo.com/bengaluru/doctor/dr-akshatha-v"
  justdial: "",    // e.g. "https://www.justdial.com/Bangalore/Akshatha-Dental-Clinic-..."
  gbpPage: "https://g.page/r/CcptNvhnF_qkEBE", // GBP page (not the review form)
} as const;

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  benefits: string[];
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  startingFrom: string;
  image: string;
  keywords: string[];
};

export const services: Service[] = [
  {
    slug: "full-mouth-rehabilitation",
    title: "Full Mouth Rehabilitation in Bengaluru",
    shortTitle: "Full Mouth Rehab",
    summary:
      "Complete rebuilding of severely worn, damaged, or missing teeth — restoring bite, function, and smile aesthetics through a coordinated specialist plan.",
    description:
      "Full mouth rehabilitation (also called full mouth reconstruction) is a comprehensive prosthodontic treatment plan that rebuilds every tooth in the mouth. It is recommended when multiple teeth are severely worn down (tooth wear from grinding/bruxism), decayed, damaged, or missing. Dr. Akshatha V, MDS Prosthodontist at Akshatha Dental Clinic, Mahalakshmi Layout, designs personalised full mouth rehabilitation plans combining implants, crowns, bridges, inlays, and dentures — restoring chewing function, speech, bite comfort, and smile aesthetics.",
    benefits: [
      "Restores chewing function and normal bite",
      "Rebuilds facial support lost through tooth wear or tooth loss",
      "Addresses pain from jaw muscle fatigue and bite collapse",
      "Improves speech clarity affected by missing or worn teeth",
      "Coordinated treatment across all teeth — not piecemeal fixes",
      "Phased plan aligned to your budget and timeline",
    ],
    steps: [
      { title: "Comprehensive examination", body: "Digital bite analysis, X-rays, and study models assess all teeth, gums, jaw joints (TMJ), and facial proportions." },
      { title: "Diagnosis & treatment plan", body: "A detailed, staged treatment plan is designed — specifying which teeth need implants, crowns, bridges, or other restorations, in what sequence, and at what cost." },
      { title: "Provisional restorations", body: "Temporary crowns or veneers are placed to test the new bite and aesthetics before any permanent work is committed to." },
      { title: "Phased restoration", body: "Permanent restorations are placed in planned stages — implants first, then crowns and bridges, then fine details. Healing time between stages is built into the plan." },
      { title: "Final bite refinement", body: "Bite is verified, adjusted, and confirmed comfortable. A night guard is provided if grinding was a contributing factor." },
    ],
    faqs: [
      {
        q: "What is full mouth rehabilitation in dentistry?",
        a: "Full mouth rehabilitation (or full mouth reconstruction) is a comprehensive treatment plan that rebuilds all or most of the teeth in both jaws. It is used when teeth are severely worn down, extensively decayed, or missing across multiple areas — requiring a coordinated approach rather than individual tooth fixes. Treatment typically combines implants, crowns, bridges, and sometimes dentures, planned and delivered by a prosthodontist.",
      },
      {
        q: "Who needs full mouth rehabilitation?",
        a: "Full mouth rehabilitation is recommended for patients with: (1) severe tooth wear due to bruxism (grinding) or acid erosion; (2) multiple missing teeth affecting bite and function; (3) teeth broken down by decay that have been patched repeatedly; (4) jaw pain or bite collapse from years of tooth loss; or (5) patients who want to restore a functional, comfortable, and aesthetic smile after significant dental neglect or trauma.",
      },
      {
        q: "How much does full mouth rehabilitation cost in Bengaluru?",
        a: "Full mouth rehabilitation cost in Bengaluru varies considerably based on the number of teeth involved and the treatments required. At Akshatha Dental Clinic, indicative costs start from ₹50,000 for simpler cases and can range to several lakhs for complex cases involving multiple implants and crowns. A detailed cost breakdown is provided at your consultation after a clinical examination.",
      },
      {
        q: "How long does full mouth rehabilitation take?",
        a: "Most full mouth rehabilitation plans are completed over 3–12 months. Simple cases (crowns only, no implants) can be done faster. Cases involving implants require a healing period of 3–6 months between implant placement and crown fitting. Treatment is phased to manage cost, healing, and lifestyle disruption.",
      },
      {
        q: "Is full mouth rehabilitation painful?",
        a: "All procedures are performed under local anaesthesia. Mild soreness after surgical steps (extractions, implant placement) is managed with prescribed pain relief and usually settles within a few days. Most patients find the experience more manageable than expected once a clear plan is in place.",
      },
      {
        q: "What is the difference between full mouth rehabilitation and a smile makeover?",
        a: "A smile makeover focuses primarily on aesthetics — changing the appearance of teeth that are structurally sound. Full mouth rehabilitation addresses both function and aesthetics — it is used when the bite, tooth structure, or missing teeth need to be rebuilt from a clinical standpoint. Many full mouth rehabilitation cases include cosmetic improvements, but the driver is functional need.",
      },
    ],
    startingFrom: "₹50,000+",
    image: "/images/doctor-procedure-care.jpg",
    keywords: [
      "full mouth rehabilitation Bengaluru",
      "full mouth reconstruction Bengaluru",
      "full mouth rehabilitation specialist Bengaluru",
      "complete mouth restoration Bengaluru",
      "full mouth rehab cost Bengaluru",
      "full mouth dental treatment Bengaluru",
      "prosthodontist full mouth Bengaluru",
      "tooth wear treatment Bengaluru",
      "bruxism treatment Bengaluru",
      "bite reconstruction Bengaluru",
      "full mouth rehab Mahalakshmi Layout",
    ],
  },
  {
    slug: "dental-implants",
    title: "Dental Implants",
    shortTitle: "Implants",
    summary:
      "Permanent, natural-looking tooth replacement with titanium implants and custom crowns.",
    description:
      "Dental implants replace missing tooth roots and support crowns that look and feel like natural teeth — preserving bone and long-term oral health.",
    benefits: [
      "Permanent solution lasting decades with care",
      "Preserves jawbone and facial structure",
      "No damage to adjacent healthy teeth",
      "Stable chewing and confident smile",
    ],
    steps: [
      { title: "Consultation & scans", body: "Evaluate bone, bite, and implant suitability." },
      { title: "Implant placement", body: "Precision placement of the titanium implant." },
      { title: "Healing phase", body: "Osseointegration for a strong, lasting foundation." },
      { title: "Custom crown", body: "Attach a natural-looking crown matched to your smile." },
    ],
    faqs: [
      {
        q: "What does an implant involve?",
        a: "Treatment involves a titanium implant placed in the jaw, a healing phase, and a custom crown. Exact scope depends on bone condition and materials — your consultation will outline a personalised plan.",
      },
      {
        q: "Am I a candidate?",
        a: "Most adults with missing teeth and adequate bone (or grafting options) are candidates. A consultation confirms suitability.",
      },
    ],
    startingFrom: "₹25,000",
    image: "/images/doctor-patient-consultation.jpg",
    keywords: ["dental implants Bengaluru", "dental implants cost Bengaluru", "implant dentist Mahalakshmi Layout", "all on 4 implants Bengaluru", "tooth replacement Bengaluru", "implantologist Bengaluru"],
  },
  {
    slug: "crowns-bridges",
    title: "Dental Crowns & Bridges in Bengaluru",
    shortTitle: "Crowns & Bridges",
    summary:
      "Precision-crafted zirconia and ceramic crowns and bridges by a specialist prosthodontist — restoring damaged or missing teeth with a natural fit and appearance.",
    description:
      "A dental crown caps a damaged, cracked, or root-canal treated tooth to restore its shape, strength, and appearance. A dental bridge spans one or more missing teeth by anchoring to adjacent teeth or implants. At Akshatha Dental Clinic, Mahalakshmi Layout, Dr. Akshatha V designs every crown and bridge to match your natural shade and bite — using zirconia, e.max, and metal-ceramic materials.",
    benefits: [
      "Protects weakened or root-canal treated teeth from fracture",
      "Zirconia crowns: strong, metal-free, and naturally translucent",
      "Bridges restore missing teeth without surgery",
      "Exact shade-matching for a seamless, natural smile",
      "Bite-balanced design for long-term comfort",
      "Durable with proper care — 10–15 years or more",
    ],
    steps: [
      { title: "Examination & X-ray", body: "Assess the tooth or gap. Identify any decay, nerve involvement, or bone changes that affect treatment planning." },
      { title: "Tooth preparation", body: "The tooth is gently shaped to create space for the crown or bridge. A temporary restoration is fitted while the lab works." },
      { title: "Impression & shade matching", body: "Digital or conventional impressions are taken. Shade is matched precisely to your adjacent natural teeth." },
      { title: "Lab fabrication", body: "A specialist dental laboratory crafts your custom crown or bridge from zirconia, e.max ceramic, or metal-ceramic." },
      { title: "Fitting & cementation", body: "The final restoration is tried in for fit and aesthetics, then permanently cemented. Bite is refined for comfort." },
    ],
    faqs: [
      {
        q: "How much does a dental crown cost in Bengaluru?",
        a: "Dental crown cost in Bengaluru starts from ₹8,000 for metal-ceramic (PFM) and ₹12,000–₹18,000+ for full zirconia crowns at Akshatha Dental Clinic. The exact cost depends on the material and number of teeth involved.",
      },
      {
        q: "How long do dental crowns last?",
        a: "With good oral hygiene and regular check-ups, quality crowns typically last 10–15 years or longer. Zirconia crowns are especially durable. Grinding teeth (bruxism) can shorten crown life — a night guard helps.",
      },
      {
        q: "Crown vs bridge — which is right for me?",
        a: "A crown restores a damaged tooth that is still present. A bridge replaces a missing tooth by using adjacent teeth as anchors. If you have a missing tooth and healthy adjacent teeth, a bridge is an option; if you prefer not to modify adjacent teeth, a dental implant is often recommended instead.",
      },
      {
        q: "Crown vs veneer — what is the difference?",
        a: "Crowns cover the entire tooth surface and are used when a tooth is structurally damaged, cracked, or has had a root canal. Veneers are thin porcelain shells placed on the front surface only — they are a cosmetic option for discolouration or shape, not structural damage.",
      },
      {
        q: "Is a zirconia crown better than porcelain-fused-to-metal?",
        a: "Zirconia crowns are metal-free, stronger, and look more natural — the material is translucent like real enamel. PFM crowns are a cost-effective option but can show a dark metal line at the gum over time. For front teeth especially, zirconia is the preferred choice.",
      },
      {
        q: "How many visits does a crown take?",
        a: "Usually 2–3 visits over 1–2 weeks: preparation and temporary crown, then fitting and cementation of the final crown. Same-day CAD/CAM crowns exist but are not available at every clinic.",
      },
    ],
    startingFrom: "₹8,000",
    image: "/images/doctor-procedure-care-ppe.jpg",
    keywords: [
      "dental crowns Bengaluru",
      "dental bridge Bengaluru",
      "crowns and bridges Bengaluru",
      "zirconia crown Bengaluru",
      "zirconia crown Mahalakshmi Layout",
      "porcelain crown Bengaluru",
      "crown replacement Bengaluru",
      "dental crown cost Bengaluru",
      "dental bridge cost Bengaluru",
      "prosthodontist crowns Bengaluru",
      "ceramic crown Bengaluru",
      "tooth cap Bengaluru",
    ],
  },
  {
    slug: "dentures",
    title: "Dentures in Bengaluru — Complete & Partial",
    shortTitle: "Dentures",
    summary:
      "Custom-fitted complete and partial dentures for natural appearance, speech, and comfortable eating — including implant-supported options for superior stability.",
    description:
      "Dentures replace missing teeth with a removable prosthesis custom-made to fit your mouth. At Akshatha Dental Clinic, Mahalakshmi Layout, Dr. Akshatha V fabricates complete dentures (all teeth missing) and partial dentures (some teeth remaining), matched precisely to your facial proportions and bite. Implant-supported dentures are also available for patients who want a more stable, non-removable solution without the cost of individual implants per tooth.",
    benefits: [
      "Restores chewing ability and eating confidence",
      "Supports facial structure and prevents the sunken appearance of tooth loss",
      "Improves speech affected by missing teeth",
      "Complete, partial, and implant-supported options available",
      "Custom shade and shape matched to your natural appearance",
      "Adjustable: follow-up appointments for fit refinements included",
    ],
    steps: [
      { title: "Consultation & planning", body: "Assess remaining teeth, gum health, bite, and jaw relationship. Discuss denture type — complete, partial, or implant-supported." },
      { title: "Impressions", body: "Precise impressions and bite records are taken to create a foundation that fits your gum contours and jaw relationship accurately." },
      { title: "Try-in appointment", body: "A wax or trial denture is fitted so you can preview the look, test the bite, and request adjustments before the final is made." },
      { title: "Final delivery", body: "The finished denture is fitted, bite is checked, and care instructions provided. Follow-up appointments for adjustments are included." },
    ],
    faqs: [
      {
        q: "How much do dentures cost in Bengaluru?",
        a: "Denture costs in Bengaluru at Akshatha Dental Clinic start from approximately ₹15,000 for a partial denture and ₹25,000–₹45,000 for a complete denture (full upper or lower arch), depending on the material and number of teeth. Implant-supported dentures are quoted separately after a consultation. Final cost is confirmed at your appointment.",
      },
      {
        q: "What is the difference between complete and partial dentures?",
        a: "Complete dentures replace all teeth in an arch (upper or lower jaw). Partial dentures replace some missing teeth while anchoring to your remaining natural teeth with clasps. If you still have several healthy teeth, a partial denture is usually the option. If all or nearly all teeth are missing or need extraction, a complete denture is used.",
      },
      {
        q: "Are implant-supported dentures better than conventional dentures?",
        a: "Implant-supported dentures attach to 2–4 implants placed in the jaw, giving far better stability — no slipping, no adhesive, and better chewing force. Conventional dentures rest on the gum and can move, especially the lower jaw. Implant-supported options are recommended for patients who find conventional dentures loose or uncomfortable, and for those who want to prevent jawbone resorption.",
      },
      {
        q: "How long do dentures last?",
        a: "Well-made dentures typically last 5–8 years before they need replacing. The fit changes over time as the gum and bone remodel — regular check-ups every 1–2 years allow for adjustments and relines to maintain a good fit. Attempting to wear ill-fitting dentures for too long can damage the gums and remaining bone.",
      },
      {
        q: "How long does it take to get used to new dentures?",
        a: "Most patients adapt to new dentures within 4–8 weeks. Speech and eating feel different initially — this is normal. Minor sore spots are common at first and are adjusted at follow-up appointments. Partial dentures generally take less adjustment time than complete dentures.",
      },
      {
        q: "Can I sleep with dentures in?",
        a: "It is generally recommended to remove dentures overnight to allow the gum tissue to rest and to clean the denture thoroughly. Sleeping with dentures increases the risk of gum soreness, bacterial build-up, and in complete denture wearers, faster bone resorption underneath the denture base.",
      },
    ],
    startingFrom: "₹15,000",
    image: "/images/family-smile-consultation.jpg",
    keywords: [
      "dentures Bengaluru",
      "complete dentures Bengaluru",
      "partial dentures Bengaluru",
      "implant supported dentures Bengaluru",
      "denture specialist Bengaluru",
      "denture specialist Mahalakshmi Layout",
      "missing teeth treatment Bengaluru",
      "denture cost Bengaluru",
      "removable dentures Bengaluru",
      "full dentures Bengaluru",
      "new dentures Bengaluru",
    ],
  },
  {
    slug: "cosmetic-smile-makeover",
    title: "Cosmetic Smile Makeover",
    shortTitle: "Smile Makeover",
    summary:
      "A personalized blend of veneers, whitening, and restorative care for a confident smile.",
    description:
      "Smile makeovers combine cosmetic and prosthodontic treatments into one cohesive plan — designed around your facial features, lifestyle, and goals.",
    benefits: [
      "Holistic plan from one specialist",
      "Digital smile preview approach",
      "Phased treatment to manage budget",
      "Dramatic confidence and aesthetic gains",
    ],
    steps: [
      { title: "Smile analysis", body: "Assess color, shape, gums, and facial harmony." },
      { title: "Design plan", body: "Select veneers, crowns, implants, or whitening as needed." },
      { title: "Treatment", body: "Execute with precision materials and specialist technique." },
      { title: "Reveal", body: "Final polish and aftercare for lasting results." },
    ],
    faqs: [
      {
        q: "What does a smile makeover involve?",
        a: "Plans vary widely — from selective veneers to full transformations. A consultation outlines a personalised treatment roadmap.",
      },
      {
        q: "How many visits?",
        a: "Many cosmetic cases complete in 2–4 visits; complex rehab takes longer.",
      },
    ],
    startingFrom: "₹15,000",
    image: "/images/hero-chisel-style.jpg",
    keywords: ["smile makeover Bengaluru", "cosmetic dentist Bengaluru", "veneers Bengaluru", "smile design Bengaluru", "cosmetic dentistry Mahalakshmi Layout", "teeth whitening Bengaluru"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const testimonials = [
  {
    name: "Nanditha K J Lohit",
    text: "Kind-hearted care, thoughtful treatment, and honest, reasonable pricing.",
    rating: 5,
  },
  {
    name: "Dr Vinay Kumaraswamy",
    text: "Pain-free extraction and cleaning — and I usually fear the dentist!",
    rating: 5,
  },
  {
    name: "Simran Anand",
    text: "Friendly, and took real time to explain every option with care.",
    rating: 5,
  },
];

export const faqs = [
  {
    q: "Who is a prosthodontist?",
    a: "A prosthodontist is a dental specialist focused on restoring and replacing teeth — including implants, crowns, bridges, dentures, and full-mouth rehabilitation.",
  },
  {
    q: "Do you accept insurance?",
    a: "Bring your insurance details to your consultation and we’ll help you understand your coverage options.",
  },
  {
    q: "How do I book an appointment?",
    a: "Use the Book Appointment form on this site, call us, or message on WhatsApp. Limited slots are available daily from 11 AM to 9:30 PM.",
  },
  {
    q: "Where is the clinic located?",
    a: "K M Arcade, Mahalakshmi Layout, Bengaluru — opposite the swimming pool & bus stop, next to the Buddha statue.",
  },
];

// ── Blog content strategy (Phase 9 SEO) ──────────────────────────────────────
// Create /blog pages with these articles to build topical authority.
// Each maps to a service page for internal linking.
export const blogContentPlan = [
  {
    slug: "dental-implants-bengaluru-complete-guide",
    title: "Dental Implants in Bengaluru: Complete Patient Guide",
    targetKeyword: "dental implants Bengaluru",
    intent: "informational",
    relatedService: "dental-implants",
    funnelStage: "consideration",
  },
  {
    slug: "dental-implants-vs-dentures",
    title: "Dental Implants vs Dentures: Which is Better for Missing Teeth?",
    targetKeyword: "dental implants vs dentures",
    intent: "commercial",
    relatedService: "dental-implants",
    funnelStage: "decision",
  },
  {
    slug: "full-mouth-rehabilitation-who-needs-it",
    title: "Full Mouth Rehabilitation: Who Needs It and What Does It Involve?",
    targetKeyword: "full mouth rehabilitation Bengaluru",
    intent: "informational",
    relatedService: "full-mouth-rehabilitation",
    funnelStage: "awareness",
  },
  {
    slug: "dental-implant-cost-bengaluru",
    title: "Dental Implant Cost in Bengaluru: What Determines the Price?",
    targetKeyword: "dental implant cost Bengaluru",
    intent: "commercial",
    relatedService: "dental-implants",
    funnelStage: "decision",
  },
  {
    slug: "prosthodontist-vs-general-dentist",
    title: "Prosthodontist vs General Dentist: When Should You See a Specialist?",
    targetKeyword: "prosthodontist Bengaluru",
    intent: "informational",
    relatedService: null,
    funnelStage: "awareness",
  },
  {
    slug: "complete-dentures-vs-implant-supported-dentures",
    title: "Complete Dentures vs Implant-Supported Dentures: A Practical Guide",
    targetKeyword: "implant supported dentures Bengaluru",
    intent: "commercial",
    relatedService: "dentures",
    funnelStage: "consideration",
  },
  {
    slug: "smile-makeover-what-to-expect",
    title: "Smile Makeover in Bengaluru: What to Expect at Your Consultation",
    targetKeyword: "smile makeover Bengaluru",
    intent: "informational",
    relatedService: "cosmetic-smile-makeover",
    funnelStage: "consideration",
  },
] as const;
