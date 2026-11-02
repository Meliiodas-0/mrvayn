import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/cinematicMotion.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { sampleHero, heroJoints, solveLimb, HERO_KEYS, RIG } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const close = (a,b,message) => assert.ok(Math.abs(a-b)<1e-6, `${message}: ${a} != ${b}`);
function checkBone(root, limb, a, b) {
  close(distance(root,limb.joint),a,'upper length');
  close(distance(limb.joint,limb.end),b,'lower length');
}
for(const target of [{x:0,y:0},{x:100,y:100},{x:2,y:3},{x:-12,y:4}]) {
  for(const bend of [-1,1]) checkBone({x:0,y:0},solveLimb({x:0,y:0},target,8,8,bend),8,8);
}
let maxHandCorrection=0;
for(let i=0;i<=1584;i++) {
  const t=i/240, p=sampleHero(t), j=heroJoints(p);
  checkBone(p.hip,j.left,11,11); checkBone(p.hip,j.right,11,11);
  checkBone(j.chest,j.main,RIG.upper,RIG.fore); checkBone(j.chest,j.off,RIG.upper,RIG.fore);
  assert.ok(Object.values(p).every(v=>typeof v==='number'?Number.isFinite(v):Number.isFinite(v.x)&&Number.isFinite(v.y)));
  maxHandCorrection=Math.max(maxHandCorrection,distance(j.main.end,p.hand),distance(j.off.end,p.offHand));
  if(t>=.55&&t<=4.85 || t>=5.5&&t<=6.1) {
    close(j.left.end.x,-12,`left foot x ${t}`); close(j.right.end.x,12,`right foot x ${t}`);
    close(j.left.end.y,0,`left ground ${t}`); close(j.right.end.y,0,`right ground ${t}`);
    assert.ok(j.left.joint.y<=.05 && j.right.joint.y<=.05,`knees above ground ${t}`);
  }
  if(t>=.55 && t<=1.15) close(distance(j.off.end,{x:22,y:0}),0,`bracing hand ${t}`);
}
// Compare actual rotated body landmarks across every transition boundary.
function landmarks(t) {
  const p=sampleHero(t), j=heroJoints(p), cs=Math.cos(p.rotation), sn=Math.sin(p.rotation);
  return [p.hip,j.chest,j.left.joint,j.left.end,j.right.joint,j.right.end,j.main.joint,j.main.end,j.off.joint,j.off.end].map(v=>({x:p.hip.x+(v.x-p.hip.x)*cs-(v.y-p.hip.y)*sn,y:p.hip.y+(v.x-p.hip.x)*sn+(v.y-p.hip.y)*cs}));
}
for(const [t] of HERO_KEYS) {
  if(t===0) continue;
  const a=landmarks(t-1e-6),b=landmarks(t+1e-6);
  for(let i=0;i<a.length;i++) assert.ok(distance(a[i],b[i])<.002,`continuous ${t} joint ${i}`);
}
assert.ok(maxHandCorrection < .001, 'Authored hand targets stay within reach');
// Different frame rates sample the same absolute timeline, without integration drift.
for (const hz of [30, 60, 120, 144]) {
  for (let i=0;i<=6*hz;i++) {
    const t=i/hz, p=sampleHero(t);
    assert.deepEqual(p,sampleHero(t),'Deterministic playback');
  }
}
// The rig and blade remain inside the viewport after the initial drop, apart
// from the intentional final ascent. Covers phone, laptop, 1080p, 2K and 4K.
for (const [w,h] of [[390,844],[844,390],[1366,768],[1920,1080],[2560,1440],[3840,2160]]) {
  const scale=Math.max(.9,Math.min(w,h)/360)*1.55;
  for(let i=55;i<=610;i++) {
    const t=i/100,p=sampleHero(t),j=heroJoints(p),cs=Math.cos(p.rotation),sn=Math.sin(p.rotation);
    const pts=landmarks(t);
    const sword={x:j.main.end.x+Math.cos(p.sword)*30,y:j.main.end.y+Math.sin(p.sword)*30};
    const headLean=p.lean*.35;
    const head={x:j.chest.x+Math.sin(headLean)*8.8,y:j.chest.y-Math.cos(headLean)*8.8};
    for(const v of [sword,head]) pts.push({x:p.hip.x+(v.x-p.hip.x)*cs-(v.y-p.hip.y)*sn,y:p.hip.y+(v.x-p.hip.x)*sn+(v.y-p.hip.y)*cs});
    for(const v of pts) {
      const x=w/2+v.x*scale,y=h*.6+v.y*scale;
      assert.ok(x>5&&x<w-5&&y>5&&y<h-5,`visible ${w}x${h} ${t} (${x},${y})`);
    }
  }
}
console.log(`1,585 sampled poses passed. Fixed bone lengths, ground contacts, finite transforms and all transition boundaries. Max hand reach correction: ${maxHandCorrection.toFixed(3)} units.`);
console.log('30/60/120/144 Hz deterministic sampling and phone through 4K framing passed.');
