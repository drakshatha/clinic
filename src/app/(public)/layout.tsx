import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { OffersBanner } from "@/components/sections/OffersBanner";
import { OffersPopup } from "@/components/sections/OffersPopup";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <OffersBanner />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
      <OffersPopup />
    </>
  );
}
