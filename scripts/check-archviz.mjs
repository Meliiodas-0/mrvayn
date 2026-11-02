import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const origin = process.argv[2] ?? 'http://localhost:4550';
const html = async path => { const r = await fetch(origin + path); assert.equal(r.status,200,path); return r.text(); };
const home = await html('/');
for (const id of ['archviz','magviz','marina-terrace']) assert.equal((home.match(new RegExp(`id="${id}"`,'g')) ?? []).length,1,`${id} occurs once`);
assert.ok(!home.includes('id="palm-jumeirah"'), 'Palm is not a separate project');
assert.ok(home.indexOf('id="archviz"') < home.indexOf('id="magviz"'));
assert.ok(home.indexOf('id="marina-terrace"') < home.indexOf('id="cricket-broadcast"'));
assert.ok(home.includes('/projects/magviz/v14/poster.jpg'));
const sitemap = await html('/sitemap.xml');
assert.ok(!sitemap.includes('https://www.mrvayn.live/work/palm-jumeirah'));
const legacy = await fetch(origin + '/work/palm-jumeirah', { redirect: 'manual' });
assert.equal(legacy.status, 308);
assert.equal(legacy.headers.get('location'), '/work/marina-terrace');
for(const id of ['marina-terrace']) {
  const path = `/work/${id}`, page = await html(path);
  assert.ok(home.includes(`href="${path}"`));
  assert.ok(sitemap.includes(`https://www.mrvayn.live${path}`));
  assert.ok(page.includes(`rel="canonical" href="https://www.mrvayn.live${path}"`));
  assert.equal((page.match(/<h1[\s>]/g) ?? []).length,1);
  assert.ok(page.includes('Render details'));
  assert.ok(page.includes('href="/#archviz"'));
  assert.ok(!page.includes('The problem'), 'Render pages do not invent a problem/approach/result');
  const visibleCopy = page.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ');
  assert.ok(!/\bstudy\b/i.test(visibleCopy), 'Render copy does not call the scene a study');
  assert.ok(page.includes('/projects/archviz/marina-terrace/cover.webp'), 'Terrace remains the hero');
  assert.ok(page.includes('/projects/archviz/palm-jumeirah/cover.webp'), 'Palm aerial is in the gallery');
  assert.ok(!page.includes('architecture.webp') && !page.includes('architecture-original.png'), 'No close-up');
  for(const [,src] of page.matchAll(/(?:src|href)="(\/projects\/archviz\/[^"?]+)"/g)) {
    const r=await fetch(origin+src,{method:'HEAD'}); assert.equal(r.status,200,src);
  }
}
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
for(const [source, output] of [
  ['reference-realism-20261029-r02/FINAL_RENDERS/sunset_2026-10-29_22-17-44_IST.png','marina-terrace/original.png'],
  ['palm-realism-20261021/final-crystal-wide-2560.png','palm-jumeirah/original.png'],
]) assert.equal(hash(`D:/claude max/archviz-template/deliverables/${source}`),hash(new URL(`../public/projects/archviz/${output}`,import.meta.url)),'Original image preserved');
console.log('ArchViz collection: one combined render project, terrace hero, Palm aerial gallery, legacy redirect, sitemap, assets and original-image hashes passed.');
