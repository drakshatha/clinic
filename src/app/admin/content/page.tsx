import { redirect } from "next/navigation";

/** Moved to /edit — separate login, separate area. */
export default function ContentRedirectPage() {
  redirect("/edit");
}
