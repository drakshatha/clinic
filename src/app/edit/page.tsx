import { requireSiteEditor } from "@/lib/edit-auth";
import { ContentManager } from "@/components/admin/ContentManager";

export default async function EditPage() {
  await requireSiteEditor();
  return <ContentManager apiBase="/api/edit" />;
}
