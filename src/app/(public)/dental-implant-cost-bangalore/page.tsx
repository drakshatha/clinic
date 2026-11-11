import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { site } from "@/lib/site";

// 301 redirect to the canonical blog post.
// Consolidates ranking signals and resolves keyword cannibalization between this
// page and /blog/dental-implant-cost-bengaluru (which ranks better in GSC).
export const metadata: Metadata = {
  title: `Dental Implant Cost in Bengaluru | ${site.name}`,
  alternates: { canonical: "/blog/dental-implant-cost-bengaluru" },
};

export default function DentalImplantCostRedirect() {
  redirect("/blog/dental-implant-cost-bengaluru");
}
