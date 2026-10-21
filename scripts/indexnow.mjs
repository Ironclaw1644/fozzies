#!/usr/bin/env node
// IndexNow ping (Bing, Yandex, Seznam, Naver). Bing's index feeds ChatGPT search
// and Copilot, so run this after every production deploy:
//   pnpm indexnow                 # every sitemap URL + /llms.txt
//   pnpm indexnow /menu /about    # just these paths
// The key is public by design: IndexNow verifies it at /<key>.txt (public/).
const KEY = "f2c78ee873e79940ad1875a3b976b8af";
const SITE = process.env.SITE_URL || "https://www.fozziesdining.com";
const host = new URL(SITE).host;

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  return [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urls = args.length
  ? args.map((p) => new URL(p, SITE).toString())
  : [...(await sitemapUrls()), `${SITE}/llms.txt`];

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: [...new Set(urls)] }),
});
console.log(`IndexNow ${res.status} for ${urls.length} URLs`);
if (!res.ok && res.status !== 202) process.exit(1);
