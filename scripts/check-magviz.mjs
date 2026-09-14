import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const origin = process.argv[2] ?? "http://localhost:4550";
const root = "/projects/magviz/v9";
const loadProjects = source => {
  const result = {};
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  new Function("exports", outputText)(result);
  return result.projects;
};
const current = loadProjects(readFileSync("src/data/projects.ts", "utf8"));
const previous = loadProjects(execFileSync("git", ["show", "e3982e99539dc5774f5fd9e9096e1a4413dd6514:src/data/projects.ts"], { encoding: "utf8" }));
assert.deepEqual(current.filter(p => p.id !== "magviz"), previous.filter(p => p.id !== "magviz"), "Other project data must remain unchanged");
const magviz = current.find(p => p.id === "magviz");
assert.equal(magviz.role, previous.find(p => p.id === "magviz").role);
assert.equal(magviz.links[0].href, "/work/magviz#full-tour");

for (const [name, expected] of [
  ["preview-20s.mp4", "35be829f599192aa80fac7b0b4a7a6b45b82fc9ab68a18985353d260a270eda0"],
  ["showcase-1080p.mp4", "9c10d305c3d9e109d5d47bd9419517f73afc85012291cdaebb4cdf3a68ee2376"],
]) {
  const bytes = readFileSync(`public${root}/${name}`);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), expected, `${name}: exact supplied revision`);
  const response = await fetch(`${origin}${root}/${name}`, { headers: { Range: "bytes=0-1023" } });
  assert.equal(response.status, 206, `${name}: seeking/range support`);
  assert(response.headers.get("content-type")?.includes("video/mp4"));
  assert.equal((await response.arrayBuffer()).byteLength, 1024);
}
const assets = readdirSync(`public${root}`).sort();
assert.deepEqual(assets, ["poster.webp", "preview-20s.mp4", "showcase-1080p.mp4", "showcase-captions.vtt"], "Only approved public media");
const captions = await fetch(`${origin}${root}/showcase-captions.vtt`);
assert(captions.headers.get("content-type")?.includes("text/vtt"));
const vtt = await captions.text();
assert(vtt.startsWith("WEBVTT"));
assert.equal((vtt.match(/-->/g) ?? []).length, 12);
assert(vtt.includes("00:01:51.700"));

for (const path of ["/", "/work/magviz"]) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert(html.includes(`${root}/poster.webp`));
  assert(!html.includes("1bimzCoh5DpLQ7v1hIzspsM90RO6XA6IX"), "No old Drive upload");
  assert(!html.includes("magviz-sections.mp4"));
  assert(!html.includes('src="/showreel/magviz.webp"'));
  assert(!/<video[\s>]/.test(html), "No mounted media before Play");
  assert(!/<link[^>]+rel="preload"[^>]+\.mp4/.test(html), "No video preload hint");
  if (path === "/") {
    assert(html.includes("Play 20s preview"));
    assert.equal((html.match(/href="\/work\/magviz#full-tour"/g) ?? []).length, 2, "Card and gallery point to the same full tour");
  } else {
    assert(html.includes('id="full-tour"'));
    assert(html.includes("Play full tour / 1:52"));
    for (const text of ["FiveStar", "demonstration inventory", "Inside the project", "3D floor plans", "Inventory Integration"]) assert(html.includes(text), `${path}: current details`);
    assert(html.includes('href="/#contact"'), "Use the existing contact flow");
  }
}
console.log("PASS MagViz: exact films, byte ranges, caption timings/MIME, shared thumbnail, consistent tour links, on-demand playback markup and unchanged surrounding projects");
