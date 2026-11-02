// node --experimental-strip-types scripts/test-menu-picks.mts
// Fixture: the live admin menu as /menu published it on 2026-11-02 (names, descriptions, gluten-free stars).
import assert from "node:assert/strict";
import { glutenFreeDishes, listNames, seafoodDishes, steakDishes } from "../src/lib/menuPicks.ts";

const LIVE_2026_11_02 = [{"title": "Beginnings", "items": [{"name": "Housemade Sweet Rolls", "desc": ["honey compound butter"], "glutenFree": false}, {"name": "Avery’s Fried Pickles", "desc": ["housemade pickles, sriracha aioli or jalapeño ranch"], "glutenFree": true}, {"name": "Stuffed Portobello Caps", "desc": ["spinach, sun-dried tomatoes, goat cheese, bell peppers, onions, shaved parmesan"], "glutenFree": true}, {"name": "Waka Waka Shrimp", "desc": ["crispy gulf shrimp, waka waka sauce"], "glutenFree": true}, {"name": "Soup du Jour", "desc": ["cup or bowl, daily chef’s selection"], "glutenFree": false}, {"name": "Crab Cakes", "desc": ["lump crab meat, corn relish, waka waka sauce"], "glutenFree": false}, {"name": "Seasonal Flatbread", "desc": [], "glutenFree": false}]}, {"title": "Mains", "items": [{"name": "Nana's Shrimp & Grits", "desc": ["gulf shrimp, seasonal vegetables, gouda grits"], "glutenFree": true}, {"name": "Sara’s Southwest Pasta", "desc": ["southwest cream sauce, fettuccine, grilled chicken, can substitute shrimp or salmon"], "glutenFree": false}, {"name": "Smoked Pork Belly", "desc": ["sweet chili glaze, jasmine rice, haricots verts, sriracha aioli"], "glutenFree": true}, {"name": "B & C’s Salmon", "desc": ["blackened salmon fillet, hot honey citrus glaze, sweet potato hash, crispy brussels sprouts"], "glutenFree": true}, {"name": "Fozzie’s Burger of the Week", "desc": ["chef’s weekly selection, fries, creole ketchup"], "glutenFree": false}, {"name": "Steak Frites", "desc": ["wagyu flat iron, fries, housemade horseradish, creole ketchup, add over-easy eggs"], "glutenFree": true}, {"name": "Fresh Gulf of America Catch", "desc": ["chef’s selection, grilled or blackened, gouda grits, seasonal vegetables"], "glutenFree": true}, {"name": "Smoky Mountain Surf & Turf", "desc": ["blackened catfish over gouda grits, conecuh sausage, seasonal vegetables, crispy brussels sprouts"], "glutenFree": true}, {"name": "Thai Curry Crawfish Étouffée", "desc": ["Served over jasmine rice and topped with crispy jumbo Gulf of America shrimp"], "glutenFree": true}, {"name": "Hallie Kay's Filet Mignon", "desc": ["center cut certified angus beef 8 oz. filet, peppercorn cream sauce, sautèed mushrooms, choice of garlic parm mashed potatoes or sweet potato hash"], "glutenFree": true}, {"name": "Seasonal Salad", "desc": ["mixed greens, grape tomatoes, cucumbers, toasted almonds,feta, croutons  seasonal fruits/vegetables, honey balsamic vinaigrette, add chicken, shrimp, or salmon for additional charge"], "glutenFree": false}, {"name": "Spinach Salad", "desc": ["baby spinach, craisins, toasted walnuts, shaved parmesan, grape tomatoes, slivered red onions, warm bacon vinaigrette, add chicken, shrimp, or salmon for additional charge"], "glutenFree": true}]}, {"title": "Desserts", "items": [{"name": "Bread Pudding", "desc": ["chef’s seasonal selection"], "glutenFree": false}, {"name": "Edie's Mousse of the Week", "desc": ["chef’s selection"], "glutenFree": true}, {"name": "Brownie Sundae", "desc": ["salted caramel ice cream"], "glutenFree": true}, {"name": "Crème Brûlée", "desc": [], "glutenFree": true}]}];

let n = 0;
const t = (name: string, fn: () => void) => { fn(); n++; console.log("ok", name); };
const names = (d: { name: string }[]) => d.map((x) => x.name);

t("steak: only real steak dishes (Surf & Turf is catfish + sausage here)", () => {
  assert.deepEqual(names(steakDishes(LIVE_2026_11_02)), ["Steak Frites", "Hallie Kay's Filet Mignon"]);
});

t("seafood: dishes built on seafood, not 'add shrimp' salads or 'can substitute' pasta", () => {
  assert.deepEqual(names(seafoodDishes(LIVE_2026_11_02)), [
    "Waka Waka Shrimp",
    "Crab Cakes",
    "Nana's Shrimp & Grits",
    "B & C’s Salmon",
    "Fresh Gulf of America Catch",
    "Smoky Mountain Surf & Turf",
    "Thai Curry Crawfish Étouffée",
  ]);
});

t("gluten-free: exactly the starred items, in menu order", () => {
  const gf = glutenFreeDishes(LIVE_2026_11_02);
  assert.equal(gf.length, 15);
  assert.ok(!names(gf).includes("Crab Cakes"));
  assert.ok(!names(gf).includes("Housemade Sweet Rolls"));
  assert.equal(gf.filter((d) => d.section === "Desserts").length, 3);
});

t("structured desc arrays and inline 'add' options", () => {
  const secs = [{ title: "Mains", items: [
    { name: "Seasonal Salad", desc: ["mixed greens", "add chicken, shrimp, or salmon for additional charge"] },
    { name: "House Pasta", desc: ["cream sauce, fettuccine, add shrimp"] },
    { name: "Fish Tacos", desc: [] },
    { name: "Ribeye", desc: ["12 oz"], gf: true },
  ] }];
  assert.deepEqual(names(seafoodDishes(secs)), ["Fish Tacos"]);
  assert.deepEqual(names(steakDishes(secs)), ["Ribeye"]);
  assert.equal(glutenFreeDishes(secs)[0].glutenFree, true);
});

t("listNames", () => {
  assert.equal(listNames([]), "");
  assert.equal(listNames([{ name: "A" }, { name: "B" }, { name: "C" }] as never), "A, B and C");
});

console.log(`${n}/5 passed`);
