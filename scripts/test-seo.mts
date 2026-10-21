// node --experimental-strip-types scripts/test-seo.mts [apify-dataset.json]
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { actorInput, ranksFromPages, COOKEVILLE_UULE } from "../src/lib/serpApify.ts";
import { classifySource } from "../src/lib/sourceChannel.ts";

let n = 0;
const t = (name: string, fn: () => void) => { fn(); n++; console.log("ok", name); };

t("uule encodes Cookeville", () => {
  const name = "Cookeville,Tennessee,United States";
  const b64 = Buffer.from(name).toString("base64");
  const lenChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[name.length];
  assert.equal(COOKEVILLE_UULE, `w+CAIQICI${lenChar}${b64}`);
  assert.equal(actorInput(["a", "b"]).queries, "a\nb");
  assert.equal(actorInput([]).maxPagesPerQuery, 2);
});

const page = (term: string, p: number, urls: string[], start = 1) => ({
  searchQuery: { term, page: p },
  organicResults: urls.map((url, i) => ({ url, position: start + i })),
});

t("map block is skipped and page 2 continues", () => {
  const items = [
    page("Fine Dining", 1, ["https://www.google.com/search?q=x", "https://a.com/", "https://b.com/"]),
    page("Fine Dining", 2, ["https://c.com/", "https://www.fozziesdining.com/menu?x=1"], 4),
  ];
  const [r] = ranksFromPages(items);
  assert.equal(r.query, "fine dining");
  assert.equal(r.position, 4);
  assert.equal(r.url, "https://www.fozziesdining.com/menu");
  assert.equal(r.topCompetitor, "a.com");
  assert.equal(r.localPack, true);
});

t("page 2 restarting at 1 is offset", () => {
  const items = [
    page("q", 1, ["https://a.com/", "https://b.com/"]),
    page("q", 2, ["https://fozziesdining.com/"], 1),
  ];
  assert.equal(ranksFromPages(items)[0].position, 3);
});

t("not found is null, empty SERP counts 0", () => {
  const [r] = ranksFromPages([page("q", 1, ["https://a.com/"]), page("e", 1, [])]);
  assert.equal(r.position, null);
  assert.equal(ranksFromPages([page("e", 1, [])])[0].organicCount, 0);
});

t("source buckets", () => {
  assert.equal(classifySource({ referrer: "https://chatgpt.com/" }), "ai-chatgpt");
  assert.equal(classifySource({ utmSource: "chatgpt.com" }), "ai-chatgpt");
  assert.equal(classifySource({ referrer: "https://www.perplexity.ai/search?q=x" }), "ai-perplexity");
  assert.equal(classifySource({ referrer: "https://copilot.microsoft.com/" }), "ai-copilot");
  assert.equal(classifySource({ referrer: "https://gemini.google.com/app" }), "ai-gemini");
  assert.equal(classifySource({ referrer: "https://claude.ai/chat/1" }), "ai-claude");
  assert.equal(classifySource({ referrer: "https://www.google.com/" }), "google");
  assert.equal(classifySource({ referrer: "https://mail.google.com/" }), "email");
  assert.equal(classifySource({ referrer: "https://www.bing.com/" }), "bing");
  assert.equal(classifySource({ referrer: "https://l.instagram.com/?u=x" }), "instagram");
  assert.equal(classifySource({ referrer: "https://www.fozziesdining.com/menu" }), "direct");
  assert.equal(classifySource({ referrer: "" }), "direct");
  assert.equal(classifySource({ referrer: "https://visitcookevilletn.com/eat" }), "other");
  assert.equal(classifySource({ utmSource: "instagram", referrer: "https://google.com/" }), "instagram");
});

const file = process.argv[2];
if (file) {
  t("real Apify dataset parses", () => {
    const ranks = ranksFromPages(JSON.parse(readFileSync(file, "utf8")));
    assert.ok(ranks.length > 0);
    assert.ok(ranks.some((r) => r.position !== null));
    for (const r of ranks) assert.ok(!r.url || /fozziesdining\.com/.test(r.url));
  });
}
console.log(`${n} passed`);
