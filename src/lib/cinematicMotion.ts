// Opening cinematic only. The cursor game has its own independent animation rig.
export type Point = { x: number; y: number };
export const RIG = { thigh: 11, shin: 11, upper: 9, fore: 9, spine: 17 };
export type CinematicPose = {
  hip: Point; footL: Point; footR: Point; hand: Point; offHand: Point;
  lean: number; sword: number; rotation: number;
  elbow?: Point; pivot?: Point; shoulder?: Point; bladeAspect?: number;
};
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const point = (a: Point, b: Point, t: number): Point => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t) });
const smooth = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };

// Clamp the actual endpoint, not just the distance used to find the joint.
// Both bones keep their lengths even for unreachable or coincident targets.
export function solveLimb(root: Point, target: Point, a: number, b: number, bend: number) {
  const dx = target.x - root.x, dy = target.y - root.y;
  const distance = Math.hypot(dx, dy);
  const d = Math.max(Math.abs(a - b) + .001, Math.min(a + b - .001, distance));
  const ux = distance > 1e-8 ? dx / distance : 0;
  const uy = distance > 1e-8 ? dy / distance : 1;
  const end = { x: root.x + ux * d, y: root.y + uy * d };
  const along = (a * a - b * b + d * d) / (2 * d);
  const height = Math.sqrt(Math.max(0, a * a - along * along));
  const joint = { x: root.x + ux * along - uy * height * bend, y: root.y + uy * along + ux * height * bend };
  return { joint, end };
}

export function chestOf(p: Pick<CinematicPose,"hip"|"lean">): Point {
  return { x: p.hip.x + Math.sin(p.lean) * RIG.spine, y: p.hip.y - Math.cos(p.lean) * RIG.spine };
}

function pose(x: number, height: number, lean: number, hand: [number, number], off: [number, number], sword: number): CinematicPose {
  const hip = { x, y: -height };
  const chest = { x: x + Math.sin(lean) * RIG.spine, y: -height - Math.cos(lean) * RIG.spine };
  return {
    hip, lean, sword, rotation: 0,
    footL: { x: -12, y: 0 }, footR: { x: 12, y: 0 },
    hand: { x: chest.x + hand[0], y: chest.y + hand[1] },
    offHand: { x: chest.x + off[0], y: chest.y + off[1] },
  };
}
function landing(height: number, lean: number) {
  const p = pose(0, height, lean, [-9, -11], [0, 0], -2.05);
  p.offHand = { x: 22, y: 0 };
  return p;
}
const ready = () => pose(0, 17.8, .04, [11, -5], [-7, 10], -.7);
export const HERO_KEYS: ReadonlyArray<readonly [number, CinematicPose]> = [
  [0, landing(13, 1.4)],
  [.55, landing(13, 1.4)],
  [.66, landing(11.4, 1.28)],
  [1.04, landing(12, 1.35)],
  [1.15, landing(12, 1.35)],
  [1.55, ready()],
  [1.74, pose(-2, 16.5, -.18, [-8, -12], [-8, 8], -2.3)],
  [1.95, pose(3, 15.4, .25, [14, -3], [-9, 7], .25)],
  [2.08, pose(2, 16, .18, [11, 9], [-8, 9], .95)],
  // The sword travels over the shoulder as the torso turns, never a face mirror.
  [2.23, pose(0, 17.2, .02, [4, -14], [-8, 9], -1.1)],
  [2.41, pose(2, 16.5, .18, [8, -12], [-7, 10], -.8)],
  [2.6, pose(-3, 15.4, -.25, [-14, -3], [8, 8], -3.4)],
  [2.75, pose(-2, 16, -.18, [-11, 9], [7, 10], -4.05)],
  [3.08, pose(0, 17.4, -.06, [-9, -9], [7, 10], -2.1)],
  [3.4, pose(0, 17.4, .04, [7, -11], [-7, 10], -1)],
  [3.65, ready()],
  [3.86, pose(-1, 16.3, -.15, [6, -12], [-8, 8], -1.4)],
  [4.1, ready()],
  [4.32, pose(1, 16.3, .12, [-9, -9], [8, 8], -2.1)],
  [4.55, ready()],
  [4.72, pose(0, 12.8, .3, [10, 4], [-9, 6], -.2)],
  [4.85, pose(0, 17.8, -.08, [10, -7], [-8, 6], -.6)],
  [5.5, pose(0, 17.8, -.08, [10, -7], [-8, 6], -.6)],
  // Touchdown, compression, recovery, then the victory gesture.
  [5.62, pose(0, 12.8, .42, [11, -3], [-9, 7], -.45)],
  [5.9, pose(0, 17.8, .03, [8, -11], [-7, 10], -1.15)],
  [6.1, pose(0, 17.8, .02, [3, -15], [-7, 10], -1.5)],
  [6.6, pose(0, 17.8, .02, [3, -15], [-7, 10], -1.5)],
];

export function blendPose(a: CinematicPose, b: CinematicPose, t: number): CinematicPose {
  const crossesBody = (a.hand.x - chestOf(a).x) * (b.hand.x - chestOf(b).x) < 0;
  const hand = point(a.hand, b.hand, t);
  // Carry the grip over the head when changing guard sides, rather than taking
  // a straight line through the face.
  const carry = crossesBody ? Math.sin(Math.PI * t) : 0;
  hand.y -= 14 * carry;
  return {
    hip: point(a.hip, b.hip, t), footL: point(a.footL, b.footL, t), footR: point(a.footR, b.footR, t),
    hand, offHand: point(a.offHand, b.offHand, t),
    lean: mix(a.lean, b.lean, t), sword: mix(a.sword, b.sword, t), rotation: mix(a.rotation, b.rotation, t),
  };
}
function shift(p: CinematicPose, y: number): CinematicPose {
  return { ...p, hip: { ...p.hip, y: p.hip.y + y }, footL: { ...p.footL, y: p.footL.y + y }, footR: { ...p.footR, y: p.footR.y + y }, hand: { ...p.hand, y: p.hand.y + y }, offHand: { ...p.offHand, y: p.offHand.y + y }, ...(p.elbow ? { elbow: {x:p.elbow.x,y:p.elbow.y+y} } : {}), ...(p.pivot ? {pivot:{x:p.pivot.x,y:p.pivot.y+y}} : {}) };
}

// Shape-preserving cubic tracks retain velocity through breakdowns. Only true
// reversals and the deliberate contact hold settle to zero velocity.
type Key = readonly [number, number];
function curve(keys: readonly Key[], time: number) {
  if(time<=keys[0][0]) return keys[0][1];
  if(time>=keys[keys.length-1][0]) return keys[keys.length-1][1];
  const i=keys.findIndex(k=>k[0]>time)-1, [ta,a]=keys[i], [tb,b]=keys[i+1], span=tb-ta, u=(time-ta)/span;
  const tangent=(j:number)=>{
    if(j===0||j===keys.length-1)return 0;
    const left=(keys[j][1]-keys[j-1][1])/(keys[j][0]-keys[j-1][0]);
    const right=(keys[j+1][1]-keys[j][1])/(keys[j+1][0]-keys[j][0]);
    return left*right<=0?0:2*left*right/(left+right);
  };
  return (2*u**3-3*u*u+1)*a+(u**3-2*u*u+u)*span*tangent(i)+(-2*u**3+3*u*u)*b+(u**3-u*u)*span*tangent(i+1);
}
const armAngles=(p:CinematicPose)=>{
  const chest=chestOf(p), limb=solveLimb(chest,p.hand,RIG.upper,RIG.fore,1);
  return [Math.atan2(limb.joint.y-chest.y,limb.joint.x-chest.x),Math.atan2(limb.end.y-limb.joint.y,limb.end.x-limb.joint.x)];
};
// time, pelvis x, pelvis height, chest lean, upper-arm angle, forearm angle, blade
const initial=ready(), final=HERO_KEYS.find(([t])=>t===3.08)![1];
const initialArm=armAngles(initial), finalArm=armAngles(final);
const ATTACK_KEYS = [
  [1.55,0,17.8,.04,...initialArm,initial.sword],
  [1.72,-3,15,-.22,-1.15,-2.6,-2.05],
  [1.82,-2,14.8,-.16,-1.12,-2.58,-2.1],
  [1.95,4,14.8,.28,.28,-.18,.12],
  [1.974,4,14.8,.28,.28,-.18,.12],
  [2.055,3.5,15,.26,.6,.15,.78],
  // Sink onto the lead leg, then sweep through a horizontal half-turn toward
  // the rear attacker. Unwrapped angles prevent an overhead return swing.
  [2.23,3,14.8,.35,.48,-.18,.18],
  [2.43,4,12,.7,.7,.05,.22],
  [2.49,2,11.8,.3,1.5,.85,1.35],
  [2.6,-4,12,-.65,2.9,2.45,3.32],
  [2.624,-4,12,-.65,2.9,2.45,3.32],
  [2.71,-3.5,13,-.5,3.35,2.85,3.65],
  [3.08,0,17.4,-.06,finalArm[0],finalArm[1]>0?finalArm[1]-Math.PI*2:finalArm[1],final.sword],
  // The near pair presses in: a retreating parry, opposite-side recoil, then
  // a compressed guard. Feet stay grounded while the weight changes sides.
  [3.45,-1,16.5,-.12,-1.9,-2.6,-2.1],
  [3.78,4,13.8,.38,-1.1,-1.95,-1.65],
  [3.91,2,14.6,.15,-1.25,-2.1,-1.8],
  [4.16,-4,13.4,-.4,-1.9,-2.65,-2.3],
  [4.3,-2,14.5,-.18,-1.7,-2.5,-2.05],
  [4.55,0,17.8,.04,...initialArm,initial.sword],
];
const ATTACK_TRACKS=Array.from({length:7},(_,column)=>{
  let previous=0;
  return ATTACK_KEYS.map((k,index)=>{
    let value=column===5?k[5]-k[4]:k[column];
    if(index>0&&(column===4||column===6)){
      while(value-previous>Math.PI)value-=Math.PI*2;
      while(value-previous<-Math.PI)value+=Math.PI*2;
    }
    previous=value;
    return [k[0],value] as const;
  });
});
function attackAt(t:number, fallback:CinematicPose):CinematicPose {
  const channel=(column:number, offset=0)=>curve(ATTACK_TRACKS[column],t+offset);
  const envelope=smooth((t-1.55)/.12)*(1-smooth((t-2.92)/.16));
  const hip={x:channel(1,.028*envelope),y:-channel(2,.028*envelope)};
  const lean=channel(3,.018*envelope), chest=chestOf({...fallback,hip,lean});
  const shoulder={x:chest.x+3*envelope,y:chest.y};
  const upper=channel(4,.012*envelope), fore=upper+channel(5), sword=channel(6,-.008*envelope);
  const elbow={x:shoulder.x+Math.cos(upper)*RIG.upper,y:shoulder.y+Math.sin(upper)*RIG.upper};
  const hand={x:elbow.x+Math.cos(fore)*RIG.fore,y:elbow.y+Math.sin(fore)*RIG.fore};
  const oldChest=chestOf(fallback);
  const freeArm=smooth((t-1.55)/.12)*(1-smooth((t-4.43)/.12));
  let offHand=point(
    {x:chest.x+fallback.offHand.x-oldChest.x,y:chest.y+fallback.offHand.y-oldChest.y},
    {x:chest.x+Math.max(-9,Math.min(0,-6-lean*20)),y:chest.y+10},freeArm,
  );
  const pressure=smooth((t-3.4)/.2)*(1-smooth((t-4.3)/.25));
  offHand=point(offHand,{x:chest.x-7+lean*12,y:chest.y+3},pressure);
  // A horizontal sweep is foreshortened in this side-on camera. Keep its tip
  // above the floor instead of drawing a vertical semicircle through it.
  const sweep=smooth((t-2.23)/.2)*(1-smooth((t-2.71)/.37));
  return {...fallback,hip,lean,shoulder,elbow,hand,offHand,sword,bladeAspect:1-.84*sweep};
}

export function sampleHero(t: number, dropHeight = 200): CinematicPose {
  let index = HERO_KEYS.findIndex(([time]) => time > t);
  if (index < 0) index = HERO_KEYS.length - 1;
  index = Math.max(1, index);
  const [aTime, a] = HERO_KEYS[index - 1], [bTime, b] = HERO_KEYS[index];
  let p = blendPose(a, b, smooth((t - aTime) / (bTime - aTime)));
  if(t>=1.55&&t<=4.55)p=attackAt(t,p);
  // Let the free arm hang naturally in grounded guards, rather than holding a
  // right-angled elbow beside the shoulder. Preserve the braced landing/tuck.
  const relaxed = smooth((t - 1.15) / .4) * (1 - smooth((t - 4.55) / .3)) + smooth((t - 5.5) / .4);
  p.offHand.y += 5 * relaxed;
  p.offHand = solveLimb(chestOf(p), p.offHand, RIG.upper, RIG.fore, 1).end;
  if(!p.elbow)p.hand = solveLimb(chestOf(p), p.hand, RIG.upper, RIG.fore, 1).end;
  if (t < .55) p = shift(p, -(1 - clamp(t / .55) ** 2) * dropHeight);
  if (t >= 4.85 && t <= 5.5) {
    const k = (t - 4.85) / .65;
    const tuck = smooth(k / .18) * (1 - smooth((k - .65) / .26));
    const chest = chestOf(p);
    p.footL = point(p.footL, { x: -6, y: p.hip.y + 8 }, tuck);
    p.footR = point(p.footR, { x: 8, y: p.hip.y + 7 }, tuck);
    p.hand = point(p.hand, { x: chest.x + 9, y: chest.y + 1 }, tuck);
    p.offHand = point(p.offHand, { x: chest.x - 7, y: chest.y + 6 }, tuck);
    p.rotation = -Math.PI * 2 * curve([[0,0],[.16,.055],[.32,.24],[.58,.73],[.82,.965],[1,1]],k);
    p.pivot={x:p.hip.x,y:p.hip.y-8};
    p = shift(p, -4*k*(1-k)*48);
  }
  if (t > 6.1) p = shift(p, -(clamp((t - 6.1) / .5) ** 3) * 90);
  return p;
}

export function heroJoints(p: CinematicPose) {
  const chest = chestOf(p);
  return { chest, shoulder:p.shoulder??chest, left: solveLimb(p.hip, p.footL, RIG.thigh, RIG.shin, -1), right: solveLimb(p.hip, p.footR, RIG.thigh, RIG.shin, -1), main: p.elbow ? {joint:p.elbow,end:p.hand} : solveLimb(chest, p.hand, RIG.upper, RIG.fore, 1), off: solveLimb(chest, p.offHand, RIG.upper, RIG.fore, 1) };
}

// Independent phases give each opponent breathing, weight changes and guard
// tracking without turning a planted stance into a looping walk in place.
export function sampleEnemy(time:number,phase:number,face:number,stride:number,pressure=0) {
  const beat=time*4.2+phase, settle=1-clamp(stride);
  const weight=Math.sin(beat)*1.6*settle;
  const hip={x:weight,y:-17.6+Math.sin(beat*2)*.55*settle+pressure*2};
  const lean=face*(.08+pressure*.3)+Math.sin(beat+.6)*.055*settle;
  const chest=chestOf({hip,lean}), step=Math.sin(time*17+phase)*stride;
  const guard=Math.sin(beat*.8+.7)*.11;
  return {
    hip,chest,lean,rotation:0,
    footL:{x:-7+step*5,y:-Math.max(0,step)*4},
    footR:{x:7-step*5,y:-Math.max(0,-step)*4},
    hand:{x:chest.x+face*(10+pressure*4),y:chest.y-4+Math.sin(beat+.4)*1.5+pressure*3},
    offHand:{x:chest.x-face*6,y:chest.y+12+Math.sin(beat-1)*1.2},
    sword:face>0?-.8+guard+pressure*.65:Math.PI+.8-guard-pressure*.65,
  };
}

export function scarfCurve(time:number,velocity:Point):Point[] {
  const dragX=Math.max(-7,Math.min(7,-velocity.x*.7));
  const dragY=Math.max(-8,Math.min(8,-velocity.y*.7));
  return Array.from({length:19},(_,i)=>{
    const u=i/18, wave=Math.sin(time*9-u*7)*2.1+Math.sin(time*5.3-u*11)*.65;
    return {x:-18*u+dragX*u*u,y:1.2*u+wave*u+dragY*u*u};
  });
}
