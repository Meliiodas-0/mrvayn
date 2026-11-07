import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/cinematicMotion.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { sampleHero, sampleEnemy, scarfCurve, heroJoints, solveLimb, HERO_KEYS, RIG } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const styleSource = readFileSync(new URL('../src/lib/cinematicStyle.ts', import.meta.url), 'utf8');
const styleOutput = ts.transpileModule(styleSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { cinematicLayout, cinematicCrowd, cinematicImpact } = await import(`data:text/javascript;base64,${Buffer.from(styleOutput).toString('base64')}`);
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
  checkBone(j.shoulder,j.main,RIG.upper,RIG.fore); checkBone(j.chest,j.off,RIG.upper,RIG.fore);
  if(p.elbow){
    const a={x:j.main.joint.x-j.shoulder.x,y:j.main.joint.y-j.shoulder.y};
    const b={x:j.main.end.x-j.main.joint.x,y:j.main.end.y-j.main.joint.y};
    assert.ok(a.x*b.y-a.y*b.x<0,`No elbow bend reversal at ${t}`);
  }
  assert.ok(Object.values(p).every(v=>typeof v==='number'?Number.isFinite(v):Number.isFinite(v.x)&&Number.isFinite(v.y)));
  maxHandCorrection=Math.max(maxHandCorrection,distance(j.main.end,p.hand),distance(j.off.end,p.offHand));
  // Use the rendered head and blade proportions, before the shared body turn.
  const head={x:j.chest.x+Math.sin(p.lean*.35)*3,y:j.chest.y-Math.cos(p.lean*.35)*3-4};
  const blade={x:Math.cos(p.sword)*27,y:Math.sin(p.sword)*(p.bladeAspect??1)*27};
  const projection=Math.max(0,Math.min(1,((head.x-j.main.end.x)*blade.x+(head.y-j.main.end.y)*blade.y)/(blade.x**2+blade.y**2)));
  const nearest={x:j.main.end.x+blade.x*projection,y:j.main.end.y+blade.y*projection};
  assert.ok(distance(head,nearest)>4.8,`Blade clears face at ${t}`);
  if(t>=2.23&&t<=2.75)assert.ok(j.main.end.y+blade.y<0,`Low sweep clears the floor at ${t}`);
  if(t>=.55&&t<=4.85 || t>=5.5&&t<=6.1) {
    close(j.left.end.x,-12,`left foot x ${t}`); close(j.right.end.x,12,`right foot x ${t}`);
    close(j.left.end.y,0,`left ground ${t}`); close(j.right.end.y,0,`right ground ${t}`);
    assert.ok(j.left.joint.y<=.05 && j.right.joint.y<=.05,`knees above ground ${t}`);
  }
  if(t>=.55 && t<=1.15) close(distance(j.off.end,{x:22,y:0}),0,`bracing hand ${t}`);
}
// Compare actual rotated body landmarks across every transition boundary.
function landmarks(t) {
  const p=sampleHero(t), j=heroJoints(p), cs=Math.cos(p.rotation), sn=Math.sin(p.rotation), pivot=p.pivot??p.hip;
  return [p.hip,j.chest,j.left.joint,j.left.end,j.right.joint,j.right.end,j.main.joint,j.main.end,j.off.joint,j.off.end].map(v=>({x:pivot.x+(v.x-pivot.x)*cs-(v.y-pivot.y)*sn,y:pivot.y+(v.x-pivot.x)*sn+(v.y-pivot.y)*cs}));
}
for(const [t] of [...HERO_KEYS,...[1.72,1.82,1.974,2.055,2.23,2.43,2.49,2.624,2.71].map(t=>[t])]) {
  if(t===0) continue;
  const a=landmarks(t-1e-6),b=landmarks(t+1e-6);
  for(let i=0;i<a.length;i++) assert.ok(distance(a[i],b[i])<.002,`continuous ${t} joint ${i}`);
}
assert.ok(maxHandCorrection < .001, 'Authored hand targets stay within reach');
const angularSpeed=t=>Math.abs(sampleHero(t+.001).rotation-sampleHero(t-.001).rotation)/.002;
for(let i=0;i<=8100;i++){
  const t=i/1000,fx=cinematicImpact(t);
  assert.deepEqual(fx,cinematicImpact(t),'Finisher effects are deterministic');
  assert.ok(Math.abs(fx.shakeX)<=6.5&&Math.abs(fx.shakeY)<=6.2,'Camera impulse has a bounded CSS-pixel amplitude');
  if(t<5.08||t>=5.7)assert.ok(fx.shakeX===0&&fx.shakeY===0,'No camera shake outside impact/landing');
  const before=cinematicImpact(t-1e-6),after=cinematicImpact(t+1e-6);
  assert.ok(Math.abs(before.shakeX-after.shakeX)<.01&&Math.abs(before.shakeY-after.shakeY)<.01,'Camera impulse starts and settles continuously');
}
assert.ok(Math.abs(cinematicCrowd(1,5.079,1920,1).tumble)===0,'Crowd holds until the flip connects');
assert.ok(Math.abs(cinematicCrowd(1,5.2,1920,1).tumble)>.4,'Crowd recoils with the finisher burst');
for(let enemy=0;enemy<6;enemy++){
  const phase=enemy*1.37,face=enemy<3?1:-1;
  const a=sampleEnemy(4.4,phase,face,0),b=sampleEnemy(4.55,phase,face,0);
  assert.ok(distance(a.hand,b.hand)>.05,'Every settled opponent has an active guard');
  assert.notEqual(a.sword,b.sword,'Opponent blades track with their guards');
  for(let i=0;i<600;i++){
    const p=sampleEnemy(i/100,phase,face,(i%100)/100,.5);
    checkBone(p.hip,solveLimb(p.hip,p.footL,11,11,-face),11,11);
    close(distance(p.chest,solveLimb(p.chest,p.hand,9,9,face).end),distance(p.chest,p.hand),'Sword hand target reachable');
  }
}
for(let i=0;i<600;i++){
  const t=i/100,a=scarfCurve(t,{x:3,y:-2}),b=scarfCurve(t+1e-5,{x:3,y:-2});
  close(distance(a[0],{x:0,y:0}),0,'Scarf stays attached at its neck anchor');
  for(let k=0;k<a.length;k++)assert.ok(distance(a[k],b[k])<.001,'Wind motion is continuous');
  assert.ok(a[a.length-1].x<-10,'Scarf trails in the wind direction');
}
assert.ok(Math.abs(sampleHero(2.6).sword-sampleHero(2.43).sword-Math.PI)<.1,'Second strike sweeps a half-turn');
assert.ok(sampleHero(2.6).hip.y>-13,'Second strike bends low');
assert.ok(sampleHero(3.78).hip.x>3&&sampleHero(4.16).hip.x<-3,'Crowd pressure forces opposite weight shifts');
assert.ok(cinematicCrowd(1,3.73,1920,1).pressure>.9&&cinematicCrowd(4,4.11,1920,1).pressure>.9,'Close pair feints match recoil beats');
assert.ok(angularSpeed(5.14)>angularSpeed(4.9)*2,'Tucked rotation is faster than takeoff');
assert.ok(angularSpeed(5.14)>angularSpeed(5.46)*2,'Opening brakes the turn before touchdown');
const flightHeight=t=>(sampleHero(t).pivot??sampleHero(t).hip).y;
assert.ok(flightHeight(5.175)<flightHeight(4.95),'Flight apex rises above takeoff');
for(let i=0;i<6;i++){
  const outer=cinematicCrowd(i,3.7,1920,1), near=cinematicCrowd(i,4.45,1920,1);
  assert.ok(Math.abs(near.x)<Math.abs(outer.x),'Crowd presses closer after arriving');
  assert.ok(Math.abs(near.x)<=66,'Crowd finishes close to the hero');
  for(const t of [3.68,4.35,4.85]){
    const a=cinematicCrowd(i,t-1e-6,1920,1),b=cinematicCrowd(i,t+1e-6,1920,1);
    assert.ok(Math.abs(a.stride-b.stride)<.001,'Walk/idle/recoil stride stays continuous');
  }
}
// Different frame rates sample the same absolute timeline, without integration drift.
for (const hz of [30, 60, 120, 144]) {
  for (let i=0;i<=6*hz;i++) {
    const t=i/hz, p=sampleHero(t);
    assert.deepEqual(p,sampleHero(t),'Deterministic playback');
  }
}
// The rig and blade remain inside the viewport after the initial drop, apart
// from the intentional final ascent. Covers phone, laptop, 1080p, 2K and 4K.
for (const [w,h] of [[320,568],[320,740],[390,844],[412,915],[568,320],[844,390],[600,600],[768,1024],[1024,768],[1366,768],[1536,864],[1920,1080],[2560,1440],[3440,1440],[3840,2160],[5120,1440]]) {
  const layout=cinematicLayout(w,h,3), scale=layout.unit*1.4;
  assert.ok(w*h*layout.pixelRatio**2 <= 5_000_001,'Canvas raster budget capped');
  for(let i=55;i<=610;i++) {
    const t=i/100,p=sampleHero(t),j=heroJoints(p),cs=Math.cos(p.rotation),sn=Math.sin(p.rotation);
    const pts=landmarks(t);
    const sword={x:j.main.end.x+Math.cos(p.sword)*30,y:j.main.end.y+Math.sin(p.sword)*(p.bladeAspect??1)*30};
    const headLean=p.lean*.35;
    const head={x:j.chest.x+Math.sin(headLean)*8.8,y:j.chest.y-Math.cos(headLean)*8.8};
    const pivot=p.pivot??p.hip;
    for(const v of [sword,head]) pts.push({x:pivot.x+(v.x-pivot.x)*cs-(v.y-pivot.y)*sn,y:pivot.y+(v.x-pivot.x)*sn+(v.y-pivot.y)*cs});
    for(const v of pts) {
      const x=w/2+v.x*scale,y=layout.ground+v.y*scale;
      assert.ok(x>5&&x<w-5&&y>5&&y<h-5,`visible ${w}x${h} ${t} (${x},${y})`);
    }
  }
}
console.log(`1,585 sampled poses passed. Fixed bone lengths, ground contacts, finite transforms and all transition boundaries. Max hand reach correction: ${maxHandCorrection.toFixed(3)} units.`);
console.log('30/60/120/144 Hz deterministic sampling and phone through 4K framing passed.');
