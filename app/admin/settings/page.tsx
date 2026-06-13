import { getSettings } from "@/lib/db/repositories/settings";
import { requireAdmin } from "@/lib/auth/guard";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireAdmin();
  const settings = await getSettings();
  const name =
    (user.user_metadata?.name as string | undefined) || user.email?.split("@")[0] || "Admin";
  return <SettingsForm settings={settings} adminName={name} adminEmail={user.email ?? ""} />;
}
