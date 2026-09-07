import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const load = async path => {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
};
const { HERO_MOTION } = await load("../src/lib/heroMotion.ts");
const { DESKTOP_LETTERS, PHONE_LETTERS } = await load("../src/components/hero/letterforms.ts");
const { letterPose, scrollChapter, readingOpacity, pageOutro } = await load("../src/components/hero/sculptureTimeline.ts");
const { activeSection } = await load("../src/lib/sectionNavigation.ts");
const desktop = { width: 20, height: 10, phone: false, letters: DESKTOP_LETTERS };
const phone = { width: 9, height: 18, phone: true, letters: PHONE_LETTERS };
let checked = 0;
for (const layout of [desktop, phone]) {
  for (let index = 0; index < 6; index++) {
    const atRest = letterPose(index, layout, { distance: 0, chapter: 0, outro: 0 }, HERO_MOTION);
    assert.equal(atRest.x, layout.letters[index][0]);
    assert.equal(atRest.y, layout.letters[index][1]);
    assert.equal(atRest.rz, layout.letters[index][2]);
    assert.equal(atRest.scale, 1);
    const progress = Array.from({ length: 121 }, (_, i) => i / 100);
    const poses = progress.map(distance => letterPose(index, layout, { distance, chapter: 0, outro: 0 }, HERO_MOTION));
    for (const pose of poses) {
      assert.ok(Object.values(pose).every(Number.isFinite));
      assert.ok(pose.scale > 0);
      checked++;
    }
    // Reverse scrolling retraces exactly; there is no one-shot animation state.
    progress.reverse().forEach((distance, i) => {
      assert.deepEqual(letterPose(index, layout, { distance, chapter: 0, outro: 0 }, HERO_MOTION), poses[poses.length - 1 - i]);
    });
    for (let chapter = 1; chapter < 6; chapter++) {
      const before = letterPose(index, layout, { distance: 2, chapter: chapter - 1e-6, outro: 0 }, HERO_MOTION);
      const after = letterPose(index, layout, { distance: 2, chapter, outro: 0 }, HERO_MOTION);
      for (const key of Object.keys(before)) assert.ok(Math.abs(before[key] - after[key]) < .001, `continuous ${chapter}/${key}`);
    }
  }
}
// Portrait letters persist through the reading chapters, not just the opening.
// Use a conservative radius of three glyph units to check parked/exit bounds.
for (const width of [7.5, 9, 12]) {
  for (const height of [14, 18, 22]) {
    const layout = { ...phone, width, height };
    for (let chapter = 0; chapter <= 5; chapter++) {
      for (let index = 0; index < 6; index++) {
        const held = letterPose(index, layout, { distance: 2, chapter, outro: 0 }, HERO_MOTION);
        if (index === chapter) {
          assert.ok(Math.abs(held.x) < width / 2, "Held phone letter intersects viewport");
          assert.equal(held.scale, width * HERO_MOTION.phoneScale, "Phone scale follows width, not height");
          if (chapter < 5) {
            const moving = letterPose(index, layout, { distance: 2, chapter: chapter + .4, outro: 0 }, HERO_MOTION);
            assert.ok(Math.abs(moving.rz - held.rz) > .1, "Letter rolls within its chapter");
          }
        } else {
          assert.ok(Math.abs(held.x) - held.scale * 3 > width / 2, "Unselected phone letters park offscreen");
        }
        const exited = letterPose(index, layout, { distance: 2, chapter, outro: 1 }, HERO_MOTION);
        assert.ok(Math.abs(exited.x) - exited.scale * 3 > width / 2, "All phone geometry clears the footer");
      }
    }
  }
}
for (let i = 0; i <= 500; i++) {
  for (let index = 0; index < 6; index++) {
    const scroll = { distance: 2, chapter: i / 100, outro: 0 };
    const pose = letterPose(index, phone, scroll, HERO_MOTION);
    assert.ok(Object.values(pose).every(Number.isFinite));
    assert.deepEqual(pose, letterPose(index, phone, scroll, HERO_MOTION), "Phone chapters are deterministic");
    checked++;
  }
}
assert.equal(scrollChapter(0, [100, 1000, 2000]), 0);
assert.equal(scrollChapter(1000, [100, 1000, 2000]), 1);
assert.equal(scrollChapter(1500, [100, 1000, 2000]), 1.5);
assert.equal(scrollChapter(3000, [100, 1000, 2000]), 2);
console.log(`Hero scroll: ${checked} poses finite and deterministic. Opening reversal, chapter boundaries, phone holds and footer exit passed.`);

assert.equal(readingOpacity(0, HERO_MOTION.readingOpacity), 1);
assert.ok(Math.abs(readingOpacity(1, HERO_MOTION.readingOpacity) - HERO_MOTION.readingOpacity) < 1e-9);
for (let i = 0; i < 100; i++) {
  assert.ok(readingOpacity(i / 100, .18) >= readingOpacity((i + 1) / 100, .18));
}
for (const height of [568, 812, 950, 1272, 1440]) {
  for (const contactTop of [1200, 7000, 12000]) {
    const maxScroll = contactTop + 600 - height;
    assert.equal(pageOutro(maxScroll, contactTop, maxScroll, height), 1, "Reachable page-end exit");
    assert.equal(pageOutro(0, contactTop, maxScroll, height), 0);
  }
}
const anchors = [{ id: "work", top: 1000 }, { id: "about", top: 4500 }, { id: "skills", top: 6000 }, { id: "contact", top: 8000 }];
assert.equal(activeSection(0, 1000, 8500, anchors), "");
assert.equal(activeSection(1000, 1000, 8500, anchors), "work");
assert.equal(activeSection(4000, 1000, 8500, anchors), "work", "Tall work section retains its active state");
assert.equal(activeSection(5500, 1000, 8500, anchors), "about", "Unlisted sections keep their nav group");
assert.equal(activeSection(6100, 1000, 8500, anchors), "skills");
assert.equal(activeSection(7800, 1000, 7800, anchors), "contact", "Short final section activates at page end");
assert.equal(activeSection(1000, 1000, 8500, anchors), "work", "Reverse navigation is deterministic");
assert.equal(activeSection(0, 1000, 0, []), "");
const luminance = rgb => rgb.map(value => {
  const channel = value / 255;
  return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
}).reduce((sum, channel, i) => sum + channel * [.2126, .7152, .0722][i], 0);
const brightestBackdrop = [7, 8, 11].map(channel => channel * (1 - HERO_MOTION.readingOpacity) + 255 * HERO_MOTION.readingOpacity);
const metaContrast = (luminance([150, 160, 175]) + .05) / (luminance(brightestBackdrop) + .05);
assert.ok(metaContrast >= 4.5, `Reading-layer metadata contrast ${metaContrast}`);
console.log(`Site polish: reading fade, reachable outro, section navigation and worst-case metadata contrast (${metaContrast.toFixed(2)}:1) passed.`);
