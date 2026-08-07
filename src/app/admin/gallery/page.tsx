import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const metadata = { title: "Gallery – Admin" };

export default async function GalleryPage() {
  const session = await requireStaff();
  if (!session) redirect("/admin");
  return <GalleryManager />;
}
