import type { ReactNode } from "react";
import { EditShell } from "@/components/edit/EditShell";

export const metadata = { title: "Site Editor — Dr. Akshatha's Clinic" };

export default function EditLayout({ children }: { children: ReactNode }) {
  return <EditShell>{children}</EditShell>;
}
