import { getDefaultMenuPayload, parseMenuPayload } from "@/lib/menuSettings";
import { getSettingValue } from "@/lib/settings";
import type { MenuSection } from "@/app/menu/menuData";

/** The menu as /menu shows it: the admin-edited copy, or the static default. */
export async function loadMenuSections(): Promise<MenuSection[]> {
  const stored = await getSettingValue<unknown>("menu_html");
  const parsed = stored == null ? null : parseMenuPayload(stored);
  return parsed?.sections ?? getDefaultMenuPayload().sections;
}
