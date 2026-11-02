import type { MenuItem, MenuSection } from "@/app/menu/menuData";

// Dish groups for the steak/seafood and gluten-free landing pages, picked from the
// live admin menu at request time (never the static menuData defaults), so the
// pages can't name a dish that has left the menu. Pure functions: no server imports.

export type PickedDish = { name: string; desc: string; section: string; glutenFree: boolean };

// "add chicken, shrimp, or salmon" / "can substitute shrimp" is an option, not the dish.
const OPTIONAL_PART = /^\s*(add|can substitute|substitute|sub)\b/i;
// A part such as "seasonal vegetables, add over-easy eggs" also counts as optional from "add" on.
const trimOptional = (part: string) => part.split(/,\s*(?=add\b|can substitute\b)/i)[0];

const STEAK = /\b(steak|filet|filet mignon|wagyu|flat iron|ribeye|rib-eye|sirloin|strip steak|tenderloin|angus beef)\b/i;
const SEAFOOD =
  /\b(shrimp|crab|salmon|catfish|crawfish|fish|catch|oysters?|scallops?|lobster|tuna|grouper|redfish|snapper|mahi)\b/i;

function core(item: MenuItem) {
  const parts = (item.desc ?? []).filter((p) => !OPTIONAL_PART.test(p)).map(trimOptional);
  return `${item.name} ${parts.join(" ")}`;
}

function pick(sections: MenuSection[], test: (item: MenuItem) => boolean): PickedDish[] {
  return sections.flatMap((s) =>
    s.items.filter(test).map((item) => ({
      name: item.name.trim(),
      desc: (item.desc ?? []).join(", ").trim(),
      section: s.title,
      glutenFree: Boolean(item.glutenFree ?? item.gf),
    })),
  );
}

export const steakDishes = (sections: MenuSection[]) => pick(sections, (i) => STEAK.test(core(i)));
export const seafoodDishes = (sections: MenuSection[]) => pick(sections, (i) => SEAFOOD.test(core(i)));
export const glutenFreeDishes = (sections: MenuSection[]) => pick(sections, (i) => Boolean(i.glutenFree ?? i.gf));

/** "A, B and C" */
export function listNames(dishes: PickedDish[]) {
  const names = dishes.map((d) => d.name);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
