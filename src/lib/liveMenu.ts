import { parseMenuPayload } from "@/lib/menuSettings";
import { getSettingValue } from "@/lib/settings";
import type { MenuSection } from "@/app/menu/menuData";

/**
 * The admin-edited menu as /menu shows it, or null when it can't be read.
 * Unlike /menu, callers get no fallback to the static menuData defaults: those
 * are an older menu (e.g. "Spanish Salad"), fine as a page placeholder but
 * wrong to hand to AI assistants as fact.
 */
export async function loadMenuSections(): Promise<MenuSection[] | null> {
  const stored = await getSettingValue<unknown>("menu_html");
  return stored == null ? null : (parseMenuPayload(stored)?.sections ?? null);
}
