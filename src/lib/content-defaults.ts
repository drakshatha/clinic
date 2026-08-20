/**
 * Default content for all 5 service pages + global FAQs.
 * Used by the CMS seed action — admin clicks "Load Defaults" in Content Manager.
 * Content is professionally written for SEO (800-1500 words per service).
 */

export type DefaultService = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  benefits: string[];
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  startingFrom: string;
  keywords: string[];
};

export const DEFAULT_SERVICE_CONTENT: DefaultService[] = [
  {
    slug: "full-mouth-rehabilitation",
    title: "Full Mouth Rehabilitation",
    shortTitle: "Full Mouth Rehab",
    startingFrom: "₹50,000+",
    summary:
      "Complete functional and aesthetic rebuilding for severely worn, missing, or damaged teeth — designed and delivered by an MDS Prosthodontist in Bengaluru.",
    description: `Full mouth rehabilitation is one of the most comprehensive treatments in prosthodontics. It addresses damaged, decayed, missing, or severely worn teeth across the entire mouth in a coordinated, phased plan — rebuilding your bite, restoring function, and transforming the way you look and feel.

Unlike fixing teeth one at a time, full mouth rehabilitation considers the complete picture: how your teeth meet, how your jaw joints work, the health of your gums, and what your smile looks like from every angle. The result is a mouth that functions as a single, balanced system — not a collection of individual repairs.

At Akshatha Dental Clinic, Dr. Akshatha V has been designing and delivering full mouth rehabilitation plans for over 11 years. Her specialist MDS training in Prosthodontics and Implantology means she can plan and execute complex, multi-stage cases with precision — giving you clear milestones and realistic timelines from day one.

**Who needs full mouth rehabilitation?**

Full mouth rehabilitation is recommended when multiple areas of the mouth need attention simultaneously. You may be a candidate if you:

- Have five or more missing or severely damaged teeth
- Experience significant tooth wear from grinding (bruxism) or acid erosion
- Have teeth that have been weakened by repeated decay or fractures
- Suffer from jaw pain, clicking, or bite discomfort that simple treatments haven't resolved
- Feel embarrassed to smile or struggle to chew properly
- Were told by another dentist that your case is "too complex" for a single treatment

Many patients reach this point after years of managing individual problems in isolation. Rehabilitation addresses all of them together, which is both more effective and, over a lifetime, more cost-efficient.

**What treatments are typically included?**

Every rehabilitation plan is unique. Dr. Akshatha creates a personalised roadmap based on your clinical examination, CBCT scans (where needed), and your goals. Common components include:

- *Dental implants* — to replace missing roots and give crowns, bridges, or dentures a permanent, bone-supported foundation
- *Porcelain crowns and bridges* — to cap and protect weakened teeth or replace missing ones without implants
- *Removable or implant-supported dentures* — for cases where full arch replacement is the most practical option
- *Gum treatment* — deep cleaning or surgical correction if periodontal disease is contributing to tooth loss
- *Occlusal (bite) correction* — reshaping or realigning the way your teeth meet to remove damaging forces
- *Teeth whitening or veneers* — cosmetic finishing to unify the colour and appearance of restored teeth

Not every plan includes all of these. Some patients need four crowns and two implants; others need a full-arch implant bridge. The scope is determined by your examination.

**The phased approach: what to expect**

Full mouth rehabilitation is typically planned in phases across several months. Here is how the process generally unfolds at Akshatha Dental Clinic:

Phase 1 — Diagnosis and planning: Digital records, photographs, models, and (where indicated) a CBCT scan allow Dr. Akshatha to plan every restoration before treatment begins. You receive a written treatment roadmap with costs and timelines.

Phase 2 — Foundational work: Gum treatment, extractions of teeth beyond saving, and implant placements happen in this phase. If implants are placed, a healing period of 3–5 months follows to allow osseointegration (the implant fusing with your jawbone).

Phase 3 — Restorations: Crowns, bridges, or dentures are fabricated and fitted. This phase may run over multiple appointments, particularly when several restorations are being completed.

Phase 4 — Final refinement: Bite adjustments, polishing, and cosmetic finishing ensure everything functions correctly and looks natural.

**How long do results last?**

High-quality restorations — implants, zirconia crowns, porcelain bridges — are designed to last 15–25 years or longer with proper care and regular maintenance visits. Implants, in particular, can last a lifetime when the bone around them remains healthy. Dr. Akshatha provides clear aftercare guidance and schedules follow-up reviews to protect your investment.

**Starting cost and financing**

Full mouth rehabilitation costs vary widely depending on the number of implants, crowns, and other restorations involved. Simpler cases start from ₹50,000; complex full-arch implant cases can be significantly more. Dr. Akshatha provides a detailed written estimate after examination. Phasing the treatment over time is always an option for patients who want to manage costs without delaying necessary care.`,
    benefits: [
      "Restores full chewing function and speech clarity",
      "Rebuilds facial support and reduces sunken appearance",
      "Eliminates pain from broken, decayed, or poorly biting teeth",
      "Long-lasting results — quality restorations last 15–25 years+",
      "Comprehensive specialist planning — no referrals between doctors",
      "Custom phased plan based on your priorities and budget",
      "Improves confidence, smile aesthetics, and overall quality of life",
      "Treats the root cause, not just individual symptoms",
    ],
    steps: [
      {
        title: "Comprehensive assessment",
        body: "Digital records, bite analysis, photographs, and (where needed) CBCT scans. A complete picture before any treatment begins.",
      },
      {
        title: "Personalised roadmap",
        body: "Dr. Akshatha presents a phased treatment plan in writing — every procedure, timeline, and cost explained clearly.",
      },
      {
        title: "Foundation phase",
        body: "Gum treatment, necessary extractions, and implant placements. Healing and osseointegration where implants are placed.",
      },
      {
        title: "Restorations & refinement",
        body: "Crowns, bridges, or dentures fitted and fine-tuned for a natural bite, comfort, and aesthetics you can smile about.",
      },
    ],
    faqs: [
      {
        q: "How long does full mouth rehabilitation take?",
        a: "Plans involving dental implants typically take 4–8 months to allow the implants to fuse with the jawbone before crowns are attached. Crown-and-bridge-only cases can often complete in 3–6 weeks. Dr. Akshatha provides a personalised timeline at your consultation.",
      },
      {
        q: "Is full mouth rehabilitation painful?",
        a: "All procedures are performed under local anaesthesia. Most patients describe the treatment as far more comfortable than they expected. Post-procedure soreness is typically managed with over-the-counter pain relief.",
      },
      {
        q: "Can I eat normally during treatment?",
        a: "Temporary restorations are placed between phases so you are never without functional teeth. Dietary modifications may apply after implant surgery but are temporary.",
      },
      {
        q: "How much does full mouth rehabilitation cost in Bengaluru?",
        a: "Cost depends on the number and type of restorations needed. Simple cases start from ₹50,000; complex full-arch implant cases cost more. Dr. Akshatha provides a transparent written estimate after your examination.",
      },
      {
        q: "Is it better to do full mouth rehab all at once or in phases?",
        a: "Phasing is often medically necessary (implants need healing time) and financially practical. Dr. Akshatha structures the plan to address the most urgent functional needs first while fitting your timeline and budget.",
      },
    ],
    keywords: [
      "full mouth rehabilitation Bengaluru",
      "full mouth rehab specialist",
      "complete dental restoration Bengaluru",
      "prosthodontist full mouth rehabilitation",
      "Mahalakshmi Layout dental clinic",
    ],
  },

  {
    slug: "dental-implants",
    title: "Dental Implants",
    shortTitle: "Implants",
    startingFrom: "₹25,000",
    summary:
      "Permanent, bone-supported tooth replacement with titanium implants and custom-matched crowns — by an MDS Implantologist in Bengaluru.",
    description: `A dental implant is the closest thing modern dentistry has to a real tooth. It replaces not just the visible crown but also the root — a titanium post anchored into your jawbone — giving you a tooth that looks natural, bites with full force, and preserves the bone that keeps your face looking supported and youthful.

At Akshatha Dental Clinic, Dr. Akshatha V places and restores dental implants with specialist precision. Her MDS qualification in Prosthodontics and Implantology means she handles both the surgical and restorative phases in-house, ensuring seamless treatment and a result that integrates naturally with the rest of your smile.

**Why choose implants over other options?**

Bridges and removable dentures have their place, but they come with trade-offs. A bridge requires filing down the adjacent healthy teeth to act as support pillars — permanently altering teeth that are otherwise fine. A removable denture can slip, affect taste, and requires daily removal for cleaning.

A dental implant avoids both problems:

- *No damage to neighbouring teeth* — the implant stands alone, anchored directly to the bone
- *No bone loss* — when a root is lost, the jawbone gradually shrinks. An implant mimics a root, stimulating the bone and preventing this deterioration
- *Permanence* — once integrated, the implant is fixed. No removal, no adhesives, no movement when you eat
- *Bite strength* — implant-supported crowns restore close to full natural biting force, unlike dentures which typically achieve 20–30% of natural force

**The implant process — step by step**

Step 1: Consultation and scanning
Dr. Akshatha begins with a detailed examination, including assessment of your bone volume, gum health, bite, and overall oral condition. A CBCT (3D) scan may be used to plan the exact implant position and ensure the bone is sufficient for placement.

Step 2: Implant placement
The titanium implant post is placed into the jawbone through a small, controlled surgical procedure. Local anaesthesia ensures you are comfortable throughout. Most patients describe the procedure as significantly less uncomfortable than a tooth extraction.

Step 3: Osseointegration (healing phase)
Over the next 3–5 months, the implant fuses with the bone — a process called osseointegration. During this time, a temporary restoration or the existing denture can be worn. The integration creates the strong, permanent foundation the crown will attach to.

Step 4: Crown attachment
Once integration is confirmed, a custom-made porcelain or zirconia crown — colour-matched to your surrounding teeth — is attached to the implant. The result looks, feels, and functions like a natural tooth.

**Am I a candidate for dental implants?**

Most adults with one or more missing teeth are candidates. Key considerations include:

- Adequate bone volume (or the option to graft bone if needed)
- Good gum health (existing gum disease is treated before implant placement)
- Controlled systemic conditions — diabetes, for example, is manageable if well-controlled
- Non-smokers or patients willing to quit, as smoking significantly affects healing

If bone loss has occurred after tooth loss, bone grafting can be performed to rebuild the site before implant placement. Dr. Akshatha discusses all options transparently at your consultation.

**Single implants, multiple implants, and implant-supported bridges**

A single implant replaces one missing tooth. Two or more implants can support a bridge spanning several missing teeth — avoiding the need to implant every position individually. A full arch of missing teeth can be replaced with as few as 4–6 implants supporting a fixed bridge (All-on-4 or similar concepts) — eliminating the need for a removable denture entirely.

**How long do implants last?**

The titanium implant itself is designed to last a lifetime. The crown on top is subject to the same wear as a natural tooth and typically lasts 15–20 years before replacement may be considered. Proper oral hygiene, regular checkups, and avoiding habits like grinding (or wearing a night guard) maximise longevity significantly.

**Implant cost in Bengaluru**

Dental implant costs in Bengaluru vary by implant brand, crown material, and the complexity of the case. At Akshatha Dental Clinic, single implants start from ₹25,000. Dr. Akshatha provides a clear written estimate after examination, with no hidden fees.`,
    benefits: [
      "Permanent solution — designed to last a lifetime with care",
      "Preserves jawbone and prevents facial sagging after tooth loss",
      "No damage to adjacent healthy teeth (unlike bridges)",
      "Full biting force — eat whatever you want confidently",
      "Looks, feels, and functions like a natural tooth",
      "Fixed in place — no removal, no adhesives, no slipping",
      "Easy to clean — brush and floss exactly like natural teeth",
      "Single-clinic care — placement and restoration by one specialist",
    ],
    steps: [
      {
        title: "Consultation & 3D scan",
        body: "Evaluate bone, gum health, and bite. A CBCT scan maps the bone in 3D so implant position is planned with precision before any treatment.",
      },
      {
        title: "Implant placement",
        body: "The titanium post is placed into the jawbone under local anaesthesia. Most patients find it more comfortable than an extraction.",
      },
      {
        title: "Osseointegration",
        body: "Over 3–5 months the implant fuses with the bone, creating a strong, permanent root. A temporary restoration keeps your smile functional.",
      },
      {
        title: "Custom crown fitting",
        body: "A porcelain or zirconia crown, shade-matched to your natural teeth, is attached to the implant for a seamless, natural result.",
      },
    ],
    faqs: [
      {
        q: "How much do dental implants cost in Bengaluru?",
        a: "Single implants at Akshatha Dental Clinic start from ₹25,000. The total cost depends on the implant brand, crown material, and whether bone grafting is needed. Dr. Akshatha provides a clear written estimate after your examination.",
      },
      {
        q: "Is the implant procedure painful?",
        a: "The procedure is done under local anaesthesia and most patients report less discomfort than a tooth extraction. Post-procedure soreness typically resolves within 2–3 days with standard pain relief.",
      },
      {
        q: "How long does osseointegration take?",
        a: "Typically 3–5 months. This period allows the titanium implant to fuse solidly with the jawbone — creating the strong foundation the crown sits on. You won't feel the fusion happening; Dr. Akshatha monitors progress at review appointments.",
      },
      {
        q: "Can I get an implant if I've had bone loss?",
        a: "Yes, often. Bone grafting — adding bone material to the site — can rebuild areas where bone has been lost after tooth extraction. Dr. Akshatha will assess whether grafting is needed and explain the options.",
      },
      {
        q: "What if I need multiple implants?",
        a: "Multiple implants can be placed in the same procedure. They can also support a bridge — meaning fewer implants are needed to replace several missing teeth. For full arch replacement, 4–6 implants can support a fixed bridge on each jaw.",
      },
    ],
    keywords: [
      "dental implants Bengaluru",
      "best dental implants Mahalakshmi Layout",
      "implant specialist Bengaluru",
      "tooth implant cost Bengaluru",
      "MDS implantologist Bengaluru",
    ],
  },

  {
    slug: "crowns-bridges",
    title: "Crowns & Bridges",
    shortTitle: "Crowns & Bridges",
    startingFrom: "₹8,000",
    summary:
      "Precision-crafted porcelain and zirconia crowns and bridges that rebuild strength, restore shape, and blend seamlessly with your natural teeth.",
    description: `A dental crown is a cap that fits over a damaged or weakened tooth, restoring its original shape, size, and strength while protecting it from further fracture or decay. A bridge uses two crowns on neighbouring teeth (or implants) as anchors to span one or more missing teeth — replacing what's lost without surgery.

At Akshatha Dental Clinic, Dr. Akshatha V fabricates crowns and bridges using high-quality porcelain and zirconia materials that match the natural colour of your teeth closely. The result is a restoration that is both functionally strong and aesthetically invisible — most people will not be able to tell which teeth have crowns.

**When do you need a crown?**

A crown is recommended when a tooth is:

- Broken or fractured beyond what a filling can repair
- Severely decayed, with little remaining healthy tooth structure
- Cracked and at risk of splitting further
- Following a root canal treatment (root-canal-treated teeth become brittle and need a crown to prevent fracture)
- Discoloured or misshapen in a way that affects both aesthetics and function
- An existing crown that has failed, discoloured, or no longer fits well

**When do you need a bridge?**

A bridge is suitable when:

- One or more teeth are missing and implants are not the preferred option
- The adjacent teeth require crowns anyway (making them useful anchors)
- A quick, fixed solution is preferred over a removable partial denture
- The patient's bone is insufficient for implants without significant grafting

**Materials: porcelain, zirconia, or metal-ceramic?**

Dr. Akshatha uses materials matched to each tooth's location and the patient's functional demands:

- *Zirconia crowns* — the strongest all-ceramic option. Ideal for back teeth where biting forces are highest. Highly resistant to fracture, no metal component, and highly aesthetic. The preferred choice for most posterior crowns and bridges.
- *Porcelain-fused-to-zirconia (PFZ)* — combines the strength of a zirconia core with a porcelain outer layer for superior aesthetics. Excellent for front teeth where appearance is paramount.
- *Full porcelain (e-max)* — extremely natural-looking, best suited for front teeth where forces are lower. The most aesthetic option.
- *Metal-ceramic (PFM)* — traditional and robust, still used in some situations where budget is the primary consideration.

Dr. Akshatha recommends materials based on clinical assessment, not upselling — and explains the trade-offs of each option clearly.

**The crown procedure: what to expect**

Your first appointment involves preparing the tooth — gently reshaping it so the crown can fit over it without adding bulk to your bite — and taking a precise impression or digital scan. A temporary crown is placed to protect the prepared tooth while the permanent one is fabricated.

At your second appointment (typically 1–2 weeks later), the temporary is removed and the permanent crown is checked for fit, colour, and bite before being permanently cemented. If adjustments are needed, they are made on the spot.

For bridges, the same process applies to the anchor teeth (abutments) on either side of the gap, with the artificial replacement tooth (pontic) spanning the space between them.

**How long do crowns and bridges last?**

Well-made crowns — especially zirconia — routinely last 10–15 years and often considerably longer. The lifespan depends on oral hygiene, whether you grind your teeth (a night guard significantly extends crown life), and the quality of the underlying tooth structure and cement.

Bridges last a similar duration when the anchor teeth and gum remain healthy. Dr. Akshatha recommends professional cleaning visits every 6 months to monitor and clean under the bridge pontic.

**Crown and bridge pricing in Bengaluru**

Crowns at Akshatha Dental Clinic start from ₹8,000 depending on the material. Zirconia and full-porcelain crowns cost more than metal-ceramic but offer significantly superior durability and aesthetics. Dr. Akshatha provides a detailed written cost estimate after examining the tooth and discussing your preferences.`,
    benefits: [
      "Saves teeth that would otherwise need extraction",
      "Restores full biting strength on damaged or root-canal treated teeth",
      "Natural-looking porcelain and zirconia — invisible in conversation",
      "Fixed solution — no removal or daily maintenance beyond brushing",
      "Replaces missing teeth without implant surgery (bridge option)",
      "Protects weakened teeth from fracturing further",
      "Durable — quality crowns last 10–15 years or more",
      "Custom shade-matched to blend with your existing teeth",
    ],
    steps: [
      {
        title: "Assessment",
        body: "Examine the tooth for cracks, decay extent, and structural integrity. X-rays and clinical assessment determine whether a crown is the right option.",
      },
      {
        title: "Tooth preparation",
        body: "Gentle reshaping of the tooth under local anaesthesia. A digital scan or impression captures the precise shape for the lab. A temporary crown protects the tooth.",
      },
      {
        title: "Lab fabrication",
        body: "Your custom crown or bridge is crafted in a dental laboratory to exact specifications — shade, contour, and fit tailored to your bite.",
      },
      {
        title: "Fitting & cementation",
        body: "The permanent crown is checked for fit, bite, and appearance, fine-tuned if needed, and permanently cemented. You leave with a tooth you can trust.",
      },
    ],
    faqs: [
      {
        q: "How long does getting a crown take?",
        a: "Typically two appointments one to two weeks apart. The first appointment prepares the tooth and takes an impression; the second appointment fits and cements the permanent crown.",
      },
      {
        q: "Does getting a crown hurt?",
        a: "The tooth preparation is done under local anaesthesia so you won't feel anything during the procedure. Mild sensitivity after the anaesthesia wears off is normal and usually resolves within a few days.",
      },
      {
        q: "Crown or veneer — what's the difference?",
        a: "A crown covers the entire tooth for structural reasons (decay, fracture, weakness). A veneer covers only the front surface for cosmetic reasons (colour, shape) and requires much less tooth reduction. Crowns are chosen for function; veneers for aesthetics.",
      },
      {
        q: "What is zirconia and why is it recommended?",
        a: "Zirconia is an extremely strong white ceramic material used to make dental crowns. It is stronger than traditional porcelain, has no metal core (no grey line at the gum), and is highly aesthetic. It is Dr. Akshatha's preferred material for most crowns because of its durability and natural appearance.",
      },
      {
        q: "How do I clean under a bridge?",
        a: "Bridges require flossing under the pontic (the false tooth) using a floss threader or interdental brush. Dr. Akshatha will demonstrate the technique at your fitting appointment. Regular professional cleaning visits are important to maintain gum health under the bridge.",
      },
    ],
    keywords: [
      "dental crowns Bengaluru",
      "zirconia crowns Mahalakshmi Layout",
      "porcelain crowns specialist Bengaluru",
      "dental bridge Bengaluru",
      "crown and bridge prosthodontist",
    ],
  },

  {
    slug: "dentures",
    title: "Complete & Partial Dentures",
    shortTitle: "Dentures",
    startingFrom: "₹15,000",
    summary:
      "Custom-fitted complete and partial dentures for natural appearance, comfortable chewing, and restored confidence — including implant-supported options for maximum stability.",
    description: `Dentures remain one of the most effective, affordable, and immediately available solutions for multiple or all missing teeth. Modern dentures are vastly improved from the removable prosthetics of a generation ago — lighter, more natural-looking, and more precisely fitted — but they work best when designed and delivered by a prosthodontist who specialises in them.

At Akshatha Dental Clinic, Dr. Akshatha V has extensive experience in complete and partial dentures across a range of materials and styles. Whether you need to replace a few teeth or an entire arch, she designs dentures that prioritise fit, function, and aesthetics — and explains every option clearly so you can make an informed choice.

**Complete dentures: full arch replacement**

A complete denture replaces all the teeth in an arch (upper, lower, or both). It rests on the gums and relies on suction (upper jaw) or muscle control (lower jaw) for retention. Conventional complete dentures are made after all remaining teeth are extracted and the gum has healed — typically 8–12 weeks post-extraction.

*Immediate dentures* can be placed the day of extraction so you are never without teeth during healing. They are adjusted as the gum shrinks and heals over the following weeks.

**Partial dentures: replacing some teeth**

A partial denture replaces one or several missing teeth while retaining your existing natural teeth as support. It uses clasps or precision attachments to anchor to the remaining teeth. A well-fitted partial denture restores chewing ability, prevents remaining teeth from drifting into the gap, and improves appearance without the cost or surgical requirement of implants.

**Implant-supported dentures: the most stable option**

The most significant limitation of conventional dentures is retention — particularly lower complete dentures, which have no palate for suction and often move during eating and speaking.

Implant-supported dentures address this directly. 2–4 dental implants are placed in the jaw and the denture clips onto attachment mechanisms on the implants. The result:

- Significantly improved stability — the denture stays in place when you eat and speak
- Better biting force — closer to natural than a conventional denture
- Reduced bone loss — the implants stimulate the jawbone, slowing the shrinkage that makes conventional dentures loosen over time
- Greater comfort — less gum rubbing and pressure because the implants bear the load

Implant-supported dentures can be removable (for cleaning) or fixed (screwed permanently to the implants, removed only by a dentist for maintenance). Dr. Akshatha explains both options and their implications at your consultation.

**What to expect from a new denture**

A new denture takes adjustment — typically 3–6 weeks of regular wear, practice speaking, and gradual introduction of different foods. Dr. Akshatha schedules follow-up adjustments as needed during this period.

Common experiences in the adjustment period:
- Increased saliva initially (the mouth recognises a foreign object and produces more saliva — this normalises quickly)
- Slight speech changes, particularly with s and f sounds (improves with practice)
- Mild gum soreness at pressure points (addressed with adjustments)
- Difficulty with certain foods initially (soft foods first, then gradually introducing harder textures)

**Denture care and longevity**

Dentures should be:
- Removed and cleaned after meals where possible, and always at night
- Stored in water or a denture solution overnight to prevent warping
- Brought to regular checkup appointments — gums and bone change over time, and dentures need periodic adjustments or relining to maintain fit

Well-made dentures typically last 5–8 years before replacement is needed due to changes in the underlying bone and gum. Relining (adding material to the fitting surface) can extend the life of a denture as the gum shrinks.

Dr. Akshatha uses quality acrylic and porcelain tooth materials for dentures — natural-looking, stain-resistant, and comfortable. She also offers metal-framework partial dentures (cobalt-chrome) for added strength and a thinner, less bulky fit compared to all-acrylic partials.`,
    benefits: [
      "Restores eating function and nutritional variety",
      "Supports facial muscles — prevents the sunken look after tooth loss",
      "Improves speech and confidence in conversation",
      "Most affordable tooth-replacement option with immediate results",
      "Implant-supported option for dramatically better stability",
      "Custom shade and shape — looks natural in conversation",
      "No surgery required for conventional dentures",
      "Adjustable and repairable throughout their lifespan",
    ],
    steps: [
      {
        title: "Consultation",
        body: "Discuss goals, remaining teeth, timeline, and denture type. Assess gum and bone condition to recommend the best option.",
      },
      {
        title: "Impressions & measurements",
        body: "Precise molds of your gums and bite registration capture the foundation for a well-fitting denture. Multiple visits may be needed for a complete denture.",
      },
      {
        title: "Try-in",
        body: "A wax try-in lets you preview the teeth arrangement, lip support, and appearance before fabrication is finalised. Adjustments are made at this stage.",
      },
      {
        title: "Delivery & adjustment",
        body: "The finished denture is fitted and adjusted. Follow-up appointments address pressure points and ensure you adapt comfortably to eating and speaking.",
      },
    ],
    faqs: [
      {
        q: "How long does it take to get dentures?",
        a: "Conventional complete dentures take 4–6 weeks from the first impression to delivery, requiring 4–5 appointments. Partial dentures are similar. Immediate dentures can be placed on the day of extraction. Implant-supported dentures take longer (3–6 months) to allow implant healing.",
      },
      {
        q: "Will dentures affect my speech?",
        a: "There is typically an adjustment period of 2–4 weeks where certain sounds feel different. Most patients adapt quickly, and speech returns to normal with practice. A well-fitted denture minimises this adjustment period.",
      },
      {
        q: "Can I eat normally with dentures?",
        a: "Conventional complete dentures restore approximately 20–30% of natural biting force. Most foods are manageable, but very hard or sticky foods (raw carrots, hard candy, gum) are best avoided. Implant-supported dentures restore significantly more force and allow a broader diet.",
      },
      {
        q: "How do I clean my dentures?",
        a: "Remove and rinse after meals. Brush daily with a soft denture brush and denture cleanser (not regular toothpaste, which is too abrasive). Soak overnight in water or a denture solution. Handle carefully over a folded towel or water-filled sink — dentures are fragile when dry.",
      },
      {
        q: "What is the difference between a cobalt-chrome partial and an acrylic partial?",
        a: "A cobalt-chrome (metal framework) partial denture is thinner, lighter, and more durable than an all-acrylic partial. It covers less of the palate so feels less bulky. It costs more but is typically worth it for patients who will wear the denture long-term.",
      },
    ],
    keywords: [
      "dentures Bengaluru",
      "complete dentures Mahalakshmi Layout",
      "implant supported dentures Bengaluru",
      "partial dentures specialist Bengaluru",
      "affordable dentures Bengaluru",
    ],
  },

  {
    slug: "cosmetic-smile-makeover",
    title: "Cosmetic Smile Makeover",
    shortTitle: "Smile Makeover",
    startingFrom: "₹15,000",
    summary:
      "A personalised blend of veneers, whitening, and restorative care to create a confident, natural smile — designed around your face, personality, and goals.",
    description: `A smile makeover is not a single procedure — it is a personalised treatment plan that combines cosmetic and prosthodontic techniques to create a smile that suits your face, works with your bite, and reflects the way you want to look and feel.

At Akshatha Dental Clinic, Dr. Akshatha V approaches smile makeovers differently from purely cosmetic practices. As an MDS Prosthodontist, she considers both aesthetics and function — ensuring that the new smile is not just beautiful but also durable, comfortable, and biologically sound. A beautiful smile that damages the underlying teeth or bite is not a good result; Dr. Akshatha designs for both.

**What can a smile makeover address?**

Smile makeovers can address a wide range of concerns simultaneously:

- *Discoloured teeth* — deep staining from tea, coffee, tobacco, or tetracycline that whitening alone cannot resolve
- *Chipped or worn teeth* — edges chipped from habits or acid wear, making the smile look uneven or aged
- *Gaps and spaces* — diastema (gap between front teeth) or multiple small gaps throughout the smile
- *Crooked or misaligned teeth* — mild crowding or rotations that affect appearance (significant misalignment is better treated with orthodontics first)
- *Small or misshapen teeth* — teeth that are disproportionately small (peg laterals) or have unusual shapes
- *Gummy smile* — too much gum showing above the teeth, affecting the smile's proportions
- *Missing teeth* — gaps in the smile zone that affect confidence

**The key treatments in a smile makeover**

*Porcelain veneers* are ultra-thin shells of porcelain bonded to the front surface of teeth. They can transform colour, shape, length, and spacing in one step, with minimal tooth reduction compared to crowns. Veneers are the workhorse of cosmetic dentistry and form the core of many smile makeovers.

*Teeth whitening (professional)* is the simplest, least invasive cosmetic treatment. Professional whitening — whether in-chair or with custom take-home trays — achieves results significantly beyond what over-the-counter products offer. For teeth with intrinsic staining (from inside the tooth), veneers or crowns may be needed instead.

*Composite bonding* uses tooth-coloured composite resin applied and sculpted directly on the tooth to repair chips, close small gaps, or reshape teeth. Less expensive than veneers, but less durable and more prone to staining over time.

*Crowns* are used when the teeth need structural restoration as well as cosmetic improvement — for example, heavily filled, fractured, or root-canal treated teeth in the smile zone.

*Gum contouring* reshapes excess or uneven gum tissue using a laser or surgical technique to improve the proportions of the smile. Often combined with veneers when the gum line is irregular.

**The smile design process**

A great smile makeover starts with listening — understanding what you like and don't like about your current smile, what outcomes you're hoping for, and what your lifestyle (habits, diet, budget) allows.

Dr. Akshatha then conducts a complete assessment: photographs, smile analysis (teeth proportion, lip line, gum symmetry, facial midline), and a bite evaluation to ensure the planned cosmetic work is compatible with your jaw function. For complex cases, diagnostic mock-ups may be prepared — a temporary preview of the proposed result applied over your existing teeth — so you can approve the design before any irreversible preparation begins.

**How many appointments does a smile makeover take?**

Simple makeovers — whitening plus composite bonding — can complete in 2–3 appointments. Porcelain veneer cases typically involve 3–4 visits: consultation and mock-up, preparation and temporaries, and final fitting. More complex combinations with crowns and restorative work take longer.

**Are results permanent?**

Porcelain veneers and crowns are long-term restorations lasting 10–15 years with care. Whitening needs periodic top-ups (every 12–24 months typically). Composite bonding is less durable — typically 5–8 years — and more prone to staining. Dr. Akshatha discusses the longevity of each component at the planning stage.

**Smile makeover cost in Bengaluru**

Costs vary significantly depending on the number of teeth involved and the treatments used. Whitening-only makeovers start from ₹15,000; veneer-based smile makeovers depend on the number of veneers. Dr. Akshatha provides a detailed written estimate after your smile assessment, with options at different price points where possible.`,
    benefits: [
      "Holistic design — function and aesthetics planned together by one specialist",
      "Addresses multiple concerns in one coordinated plan",
      "Personalised to your face shape, skin tone, and preferences",
      "Minimally invasive options (veneers, bonding) where possible",
      "Natural-looking, long-lasting porcelain and zirconia materials",
      "Diagnostic mock-up lets you preview the result before commitment",
      "Dramatically boosts confidence — in photos, conversations, and daily life",
      "Improves how you present professionally and socially",
    ],
    steps: [
      {
        title: "Smile analysis",
        body: "Photographs, facial symmetry assessment, bite evaluation, and a conversation about what you like and want. Your input shapes the design completely.",
      },
      {
        title: "Treatment plan & mock-up",
        body: "A written plan with options and costs. For veneer cases, a diagnostic wax-up or temporary mock-up previews the result before any tooth preparation.",
      },
      {
        title: "Treatment",
        body: "Whitening, veneers, bonding, crowns — or a combination — executed in sequence. Temporaries protect the smile between preparation and final fitting.",
      },
      {
        title: "Reveal & aftercare",
        body: "Final restorations fitted and polished. Dr. Akshatha provides detailed aftercare instructions and schedules a review to ensure your smile settles perfectly.",
      },
    ],
    faqs: [
      {
        q: "What is the difference between veneers and crowns?",
        a: "Veneers cover only the front surface of a tooth for cosmetic improvement and require minimal tooth reduction. Crowns cover the entire tooth for structural reasons (decay, fracture, weakness) or when greater colour change is needed. For healthy teeth needing only cosmetic improvement, veneers are preferred.",
      },
      {
        q: "Will veneers look fake or obvious?",
        a: "Modern porcelain veneers are designed to replicate the translucency and texture of natural enamel. When shade-matched and shaped correctly, they are indistinguishable from natural teeth in conversation. Dr. Akshatha uses a shade guide and facial analysis to ensure the result looks natural, not over-white.",
      },
      {
        q: "Can I whiten my teeth if I have crowns or veneers?",
        a: "Whitening only works on natural tooth structure — it does not change the colour of crowns, veneers, or composite restorations. If you plan to whiten, it is best done before any restorations are placed so the restoration shade can be matched to the whitened teeth.",
      },
      {
        q: "How long do veneers last?",
        a: "Porcelain veneers typically last 10–15 years with good care. Avoiding habits like nail-biting and opening packaging with your teeth, wearing a night guard if you grind, and attending regular checkups all significantly extend veneer lifespan.",
      },
      {
        q: "Is a smile makeover painful?",
        a: "Veneer preparation involves minimal tooth reduction under local anaesthesia. Most patients experience little to no discomfort during the procedure and mild, short-lived sensitivity after preparation. Whitening can cause temporary tooth sensitivity.",
      },
    ],
    keywords: [
      "smile makeover Bengaluru",
      "porcelain veneers Bengaluru",
      "cosmetic dentist Mahalakshmi Layout",
      "teeth whitening specialist Bengaluru",
      "smile design prosthodontist Bengaluru",
    ],
  },
];

export const DEFAULT_FAQS = [
  {
    question: "Who is a prosthodontist, and how are they different from a regular dentist?",
    answer:
      "A prosthodontist is a dental specialist who has completed an additional 3-year postgraduate programme (MDS) after a 5-year dental degree, specialising in restoring and replacing teeth. While a general dentist manages a wide range of routine dental care, a prosthodontist focuses specifically on crowns, bridges, implants, dentures, and full-mouth rehabilitation — complex restorative and cosmetic work. Dr. Akshatha V holds an MDS in Prosthodontics and Implantology.",
  },
  {
    question: "What is the difference between an MDS Prosthodontist and a general dentist?",
    answer:
      "An MDS Prosthodontist has 8 years of dental education (5-year BDS + 3-year MDS) with specialist training in tooth replacement, bite analysis, and complex restorative care. A general dentist typically handles fillings, cleanings, extractions, and routine care. For implants, crowns, dentures, or full mouth rehabilitation, a prosthodontist's specialist training significantly improves outcomes.",
  },
  {
    question: "How do I book an appointment at Akshatha Dental Clinic?",
    answer:
      "You can book directly through the 'Book Appointment' form on this website — choose your preferred date and available time slot, verify your phone number with OTP, and submit. You will receive a WhatsApp confirmation from the clinic. You can also call +91 63643 49943 or message on WhatsApp.",
  },
  {
    question: "What are the clinic's working hours?",
    answer:
      "Akshatha Dental Clinic is open daily (including weekends) from 11:00 AM to 9:30 PM. Limited appointment slots are available each day — booking in advance is recommended, particularly for evenings.",
  },
  {
    question: "Where is Akshatha Dental Clinic located?",
    answer:
      "The clinic is at K M Arcade, opposite the Swimming Pool and Bus Stop, next to the Buddha Statue, Mahalakshmi Layout, Bengaluru — 560096. It is easily accessible from Rajajinagar, Yeshwanthpur, and Malleshwaram. Parking is available.",
  },
  {
    question: "Does the clinic offer dental implants, and how long does the implant process take?",
    answer:
      "Yes. Dr. Akshatha V is an MDS Implantologist and both places and restores implants at the clinic. A single implant typically takes 4–6 months from placement to final crown — most of this is healing time (osseointegration) rather than active treatment. Multiple implants or implant-supported bridges follow a similar timeline.",
  },
  {
    question: "How much do dental treatments cost? Do you share price estimates?",
    answer:
      "Yes — Dr. Akshatha provides a clear written cost estimate after examining your teeth. General ranges: fillings from ₹800, single tooth cleaning from ₹1,500, root canals from ₹4,000, crowns from ₹8,000, implants from ₹25,000, dentures from ₹15,000, smile makeovers from ₹15,000, and full mouth rehabilitation from ₹50,000. Complex cases are estimated case-by-case.",
  },
  {
    question: "Is dental treatment painful? How does the clinic manage pain?",
    answer:
      "All restorative and surgical procedures at Akshatha Dental Clinic are performed under local anaesthesia. Most patients find modern dental treatment significantly more comfortable than they expect. Dr. Akshatha uses a gentle technique and takes time to ensure you are fully numb before proceeding. Post-procedure discomfort is typically managed with over-the-counter pain relief.",
  },
  {
    question: "Do you accept dental insurance or offer EMI options?",
    answer:
      "Bring your insurance documents to your consultation and Dr. Akshatha's team will help you understand what may be covered. The clinic currently accepts direct payment (cash, UPI, card). For larger treatments, phasing the plan over time is always an option to manage costs. Please ask about available payment arrangements at your consultation.",
  },
  {
    question: "How often should I visit the dentist even if my teeth feel fine?",
    answer:
      "A professional check-up and cleaning every 6 months is recommended for most adults. Many dental problems — early-stage cavities, gum disease, and bite issues — are asymptomatic in their early stages and are most easily and affordably treated when caught early. Waiting until something hurts typically means more complex treatment.",
  },
];
