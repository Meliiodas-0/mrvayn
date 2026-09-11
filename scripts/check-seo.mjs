import assert from "node:assert/strict";

// Run against the production preview. No browser, external submissions or writes.
const origin = process.argv[2] ?? "http://localhost:4550";
const canonicalOrigin = "https://www.mrvayn.live";
const read = async (path) => {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, `${path} must return 200`);
  assert(!response.headers.get("x-robots-tag")?.includes("noindex"), `${path} response must be indexable`);
  return response.text();
};
const sitemap = await read("/sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(urls).size, urls.length, "Sitemap URLs must be unique");
assert.equal(urls.length, 9, "Homepage and eight substantive project pages");
assert(!sitemap.includes("<lastmod>"), "Do not report every build as a content update");
const robots = await read("/robots.txt");
assert(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
assert(!robots.includes("Disallow: /"));
const titles = new Set();
const descriptions = new Set();
const assets = new Set();
const home = await read("/");
assert(home.indexOf('id="magviz"') < home.indexOf('id="cricket-broadcast"'), "MagViz precedes Broadcast");
assert(!home.includes("Latest showcase"), "Broadcast no longer has lead billing");
assert(home.includes('href="/work/frame-lab"'), "Frame Lab has a crawlable link");
assert(home.includes('src="/projects/ue-mcp-routing.svg"'));

for (const url of urls) {
  assert(url.startsWith(canonicalOrigin), "Canonical host must be www");
  const path = new URL(url).pathname;
  const html = path === "/" ? home : await read(path);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/g) ?? [];
  assert.equal(canonical.length, 1, `${path}: one canonical`);
  const canonicalHref = canonical[0].match(/href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonicalHref).href, new URL(url).href, `${path}: self-referencing canonical`);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${path}: one h1`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert(title && !titles.has(title), `${path}: unique title`);
  assert(description && !descriptions.has(description), `${path}: unique description`);
  titles.add(title); descriptions.add(description);
  assert(!/<meta name="robots" content="[^"]*noindex/.test(html), `${path}: indexable`);
  assert(html.includes('name="viewport"'), `${path}: responsive viewport`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
  assert(schemas.some(schema => schema["@graph"]?.some(node => node["@type"] === "Person" && node.alternateName === "MrVayn")), `${path}: connected identity`);
  if (path !== "/") {
    assert(home.includes(`href="${path}"`), `${path}: discoverable from homepage`);
    const graph = schemas.find(schema => schema["@graph"]?.some(node => node["@type"] === "CreativeWork"))?.["@graph"];
    assert(graph?.some(node => node["@type"] === "WebPage" && node.url === url), `${path}: project schema URL`);
    assert(graph?.some(node => node["@type"] === "BreadcrumbList"), `${path}: breadcrumbs`);
    for (const label of ["The problem", "The approach", "The result", "Built with"]) assert(html.includes(label), `${path}: case study rendered in HTML`);
  }
  for (const [, src] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) if (src.startsWith("/")) assets.add(src);
  console.log(`PASS ${path}: title, canonical, HTML content, links and structured data`);
}
for (const asset of assets) {
  const response = await fetch(`${origin}${asset}`, { method: "HEAD" });
  assert.equal(response.status, 200, `${asset}: image available`);
}
const missing = await fetch(`${origin}/work/not-a-real-project`);
assert.equal(missing.status, 404, "Unknown project returns a real 404");
console.log(`PASS ${urls.length} indexable pages, ${assets.size} local images, robots, sitemap and 404 handling`);
