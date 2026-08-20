export const site = {
  name: "Akshatha Dental Clinic",
  shortName: "Akshatha Dental",
  doctor: "Dr. Akshatha V",
  credentials: "MDS Prosthodontist & Implantologist",
  tagline: "Advanced Smile Restoration by Expert Prosthodontist",
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
  // When patient is logged into Google, this opens the review form directly
  googleReviewUrl: "https://g.page/r/CcptNvhnF_qkEBE/review",
  mapsEmbed:
    "https://maps.google.com/maps?q=Akshatha+Dental+Clinic+KM+Arcade+Mahalakshmi+Layout+Bengaluru&z=15&output=embed",
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
    title: "Full Mouth Rehabilitation",
    shortTitle: "Full Mouth Rehab",
    summary:
      "Complete functional and aesthetic rebuilding for severely worn, missing, or damaged teeth.",
    description:
      "Full mouth rehabilitation restores bite, speech, comfort, and smile aesthetics through a coordinated prosthodontic plan — often combining implants, crowns, bridges, and dentures.",
    benefits: [
      "Restores chewing function and speech clarity",
      "Rebuilds facial support and smile aesthetics",
      "Custom phased plan based on your goals and budget",
      "Long-lasting materials with specialist precision",
    ],
    steps: [
      { title: "Comprehensive exam", body: "Digital assessment of teeth, bite, gums, and bone." },
      { title: "Smile & bite design", body: "Personalized treatment roadmap with clear timelines." },
      { title: "Phased restoration", body: "Implants, crowns, or dentures delivered in planned stages." },
      { title: "Final refinement", body: "Fine-tuning for comfort, function, and natural aesthetics." },
    ],
    faqs: [
      {
        q: "How long does full mouth rehab take?",
        a: "Most plans span several weeks to a few months depending on implants, healing, and the number of restorations.",
      },
      {
        q: "Is it painful?",
        a: "Procedures are performed with local anaesthesia and gentle techniques. Most patients report manageable discomfort.",
      },
    ],
    startingFrom: "₹50,000+",
    image: "/images/doctor-procedure-care.jpg",
    keywords: ["full mouth rehabilitation Bengaluru", "full mouth reconstruction Bengaluru", "full mouth rehabilitation specialist", "complete mouth restoration Bengaluru", "prosthodontist Bengaluru"],
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
    title: "Crowns & Bridges",
    shortTitle: "Crowns & Bridges",
    summary:
      "Precision-crafted restorations that rebuild strength, shape, and natural appearance.",
    description:
      "Crowns protect damaged teeth; bridges replace missing teeth by anchoring to adjacent teeth or implants — restoring both function and aesthetics.",
    benefits: [
      "Protects weakened or root-canal treated teeth",
      "Natural porcelain and zirconia options",
      "Restores chewing and smile symmetry",
      "Durable with proper care",
    ],
    steps: [
      { title: "Assessment", body: "Identify cracks, wear, or missing units needing restoration." },
      { title: "Preparation", body: "Gentle shaping and digital/impression capture." },
      { title: "Lab crafting", body: "Custom shade-matched crown or bridge fabrication." },
      { title: "Final fit", body: "Cementation and bite refinement for comfort." },
    ],
    faqs: [
      {
        q: "How long do crowns last?",
        a: "With good hygiene, quality crowns often last 10–15 years or longer.",
      },
      {
        q: "Crown vs veneer?",
        a: "Crowns cover the full tooth for structural damage; veneers are thin shells mainly for cosmetic front-surface changes.",
      },
    ],
    startingFrom: "₹8,000",
    image: "/images/doctor-procedure-care-ppe.jpg",
    keywords: ["dental crowns Bengaluru", "dental bridge Bengaluru", "zirconia crown Bengaluru", "porcelain crown specialist", "crown replacement Bengaluru"],
  },
  {
    slug: "dentures",
    title: "Complete & Partial Dentures",
    shortTitle: "Dentures",
    summary:
      "Comfortable full and partial dentures designed for speech, stability, and natural looks.",
    description:
      "Modern dentures restore missing teeth with custom fit and aesthetics. Implant-supported options add exceptional stability when needed.",
    benefits: [
      "Restores eating and speaking confidence",
      "Supports facial muscles",
      "Full, partial, and implant-supported options",
      "Custom-fitted for comfort",
    ],
    steps: [
      { title: "Consultation", body: "Discuss goals, fit preferences, and denture type." },
      { title: "Impressions", body: "Precise molds for a personalized base and bite." },
      { title: "Try-in", body: "Preview look and adjust for comfort and aesthetics." },
      { title: "Delivery", body: "Final denture with guidance on care and adaptation." },
    ],
    faqs: [
      {
        q: "Are implant dentures better?",
        a: "Implant-supported dentures offer superior stability and chewing comfort for many patients.",
      },
      {
        q: "How long to adjust?",
        a: "Most patients adapt within a few weeks with follow-up adjustments as needed.",
      },
    ],
    startingFrom: "₹15,000",
    image: "/images/family-smile-consultation.jpg",
    keywords: ["dentures Bengaluru", "complete dentures Bengaluru", "partial dentures Bengaluru", "implant supported dentures Bengaluru", "denture specialist Mahalakshmi Layout", "missing teeth treatment Bengaluru"],
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
