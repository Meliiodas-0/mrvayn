import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import ts from "typescript";

const origin = process.argv[2] ?? "http://localhost:4550";
const root = "/projects/magviz/v14";
const loadProjects = source => {
  const result = {};
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  new Function("exports", "require", outputText)(result, () => ({ systemsProjects: [] }));
  return result.projects;
};
const current = loadProjects(readFileSync("src/data/projects.ts", "utf8"));
const magviz = current.find(p => p.id === "magviz");
assert.equal(magviz.role, "Creator, Vayn Studios (commercial)");
assert.equal(magviz.links[0].href, "/work/magviz#full-tour");

for (const [name, expected] of [
  ["preview-40s.mp4", "44ef76940dc7ba88f1067799ee63fae343423f958a291de09e84e0ee183f58a1"],
  ["showcase-1080p.mp4", "cc2bfc2065b2a4025d367713c78a26cec43385433158b6f735a2f7ea8599fb3a"],
]) {
  const bytes = readFileSync(`public${root}/${name}`);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), expected, `${name}: exact supplied revision`);
  const atoms = [];
  for (let offset = 0; offset + 8 <= bytes.length;) {
    const size = bytes.readUInt32BE(offset);
    assert(size >= 8, "Valid MP4 atom size");
    atoms.push(bytes.toString("ascii", offset + 4, offset + 8));
    offset += size;
  }
  assert(atoms.indexOf("moov") >= 0 && atoms.indexOf("moov") < atoms.indexOf("mdat"), "Fast-start metadata before media");
  const response = await fetch(`${origin}${root}/${name}`, { headers: { Range: "bytes=0-1023" } });
  assert.equal(response.status, 206, `${name}: seeking/range support`);
  assert(response.headers.get("content-type")?.includes("video/mp4"));
  assert.equal((await response.arrayBuffer()).byteLength, 1024);
}
const assets = readdirSync(`public${root}`).sort();
assert.deepEqual(assets, ["poster.jpg", "preview-40s.mp4", "showcase-1080p.mp4", "showcase-captions.vtt"], "Only approved public media");
const captions = await fetch(`${origin}${root}/showcase-captions.vtt`);
assert(captions.headers.get("content-type")?.includes("text/vtt"));
const vtt = await captions.text();
assert(vtt.startsWith("WEBVTT"));
assert.equal((vtt.match(/-->/g) ?? []).length, 12);
assert(vtt.includes("00:01:59.200"));

for (const path of ["/", "/work/magviz"]) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert(html.includes(`${root}/poster.jpg`));
  assert(!html.includes("1bimzCoh5DpLQ7v1hIzspsM90RO6XA6IX"), "No old Drive upload");
  assert(!html.includes("magviz-sections.mp4"));
  assert(!html.includes('src="/showreel/magviz.webp"'));
  assert(!/<video[\s>]/.test(html), "No mounted media before Play");
  assert(!/<link[^>]+rel="preload"[^>]+\.mp4/.test(html), "No video preload hint");
  if (path === "/") {
    assert(html.includes("Play 40s preview"));
    assert.equal((html.match(/href="\/work\/magviz#full-tour"/g) ?? []).length, 2, "Card and gallery point to the same full tour");
  } else {
    assert(html.includes('id="full-tour"'));
    assert(html.includes("Play full tour / 1:59"));
    for (const text of ["FiveStar", "demonstration inventory", "Inside the project", "3D floor plans", "Inventory Integration"]) assert(html.includes(text), `${path}: current details`);
    assert(html.includes('href="/#contact"'), "Use the existing contact flow");
  }
}
console.log("PASS MagViz v14: exact supplied films, fast-start atoms, byte ranges, caption timings/MIME, shared thumbnail, tour links and on-demand playback");
