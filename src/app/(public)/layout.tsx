import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { OffersBanner } from "@/components/sections/OffersBanner";
import { OffersPopup } from "@/components/sections/OffersPopup";

// Cache the offers DB call for 60 seconds — shared across all visitors
const getCachedOffers = unstable_cache(
  async () => {
    const today = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
    return prisma.offer.findMany({
      where: {
        isActive: true,
        OR: [{ validUntil: null }, { validUntil: { gte: today } }],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, badge: true, title: true,
        description: true, imageUrl: true, validUntil: true,
      },
    });
  },
  ["public-offers"],
  { revalidate: 60 }
);

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const offers = await getCachedOffers();

  return (
    <>
      <Header />
      <OffersBanner initialOffers={offers} />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
      <OffersPopup initialOffers={offers} />
    </>
  );
}
