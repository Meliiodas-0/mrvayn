"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { readThemeColors } from "@/lib/themeColors";
import { sampleHero, sampleEnemy, scarfCurve, chestOf, solveLimb, RIG, type Point } from "@/lib/cinematicMotion";
import { CINEMATIC_STYLE, CINEMATIC_TUNING_EVENT, cinematicLayout, cinematicCrowd, cinematicImpact } from "@/lib/cinematicStyle";
import { cinematicCopy } from "@/data/cinematic";
import { createAshTitle } from "@/lib/cinematicAsh";

const END = 8.7;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
const out = (n: number) => 1 - (1 - clamp(n)) ** 3;
type Pose = { hip: Point; chest: Point; footL: Point; footR: Point; hand: Point; offHand: Point; lean: number; sword: number; rotation: number; elbow?: Point; pivot?: Point; shoulder?: Point; bladeAspect?: number };

export function BootSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const skipRef = useRef(false);
  const [show, setShow] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const time = useMotionValue(0);
  const titleOpacity = useTransform(time, [6.15, 6.65, 7.12, 7.5], [0, 1, 1, 0]);
  const titleY = useTransform(time, [6.15, 6.8], [12, 0]);
  const overlayOpacity = useTransform(time, [0, 7.85, END], [1, 1, 0]);
  const done = useCallback(() => {
    document.documentElement.dataset.boot = "done";
    setShow(false);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPreviewMode(process.env.NODE_ENV === "development" && params.get("cine") === "play");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { done(); return; }
    let seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch { /* Session storage can be unavailable. */ }
    if (params.has("cine") || !seen) { document.documentElement.dataset.boot="play"; setShow(true); }
    else done();
  }, [done]);

  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) { done(); return; }
    const C = readThemeColors();
    let settings = { ...CINEMATIC_STYLE };
    let drawTitle:ReturnType<typeof createAshTitle>=()=>{};
    let cancelled=false;
    const prepareTitle=()=>{
      const label=titleRef.current;if(!label)return;
      const style=getComputedStyle(label);
      try{
        drawTitle=createAshTitle(cinematicCopy.title,style.fontFamily,parseFloat(style.fontSize),C.bone);
        label.style.visibility="";
      }catch{
        // Privacy modes can block pixel sampling. Retain a readable text exit.
        drawTitle=()=>{};label.style.visibility="visible";
      }
    };
    let W = 0, H = 0, U = 1, cx = 0, ground = 0;
    const resize = () => {
      W = innerWidth; H = innerHeight;
      const layout = cinematicLayout(W, H, devicePixelRatio || 1), dpr = layout.pixelRatio;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      U = layout.unit; cx = W / 2; ground = layout.ground;
      prepareTitle();
    };
    resize(); addEventListener("resize", resize);
    void document.fonts.ready.then(()=>{
      if(cancelled)return;prepareTitle();
      const frozen=new URLSearchParams(location.search).get("cine");
      if(frozen!==null&&frozen!=="play")render(Number(frozen)||0);
    });
    const tune = (event: Event) => {
      settings = { ...CINEMATIC_STYLE, ...(event as CustomEvent).detail };
      const frozen = new URLSearchParams(location.search).get("cine");
      if (frozen !== null && frozen !== "play") render(Number(frozen) || 0);
    };
    if (process.env.NODE_ENV === "development") addEventListener(CINEMATIC_TUNING_EVENT, tune);

    function line(points: Point[], color: string, alpha: number, width: number) {
      ctx!.strokeStyle = color; ctx!.globalAlpha = alpha; ctx!.lineWidth = width;
      ctx!.beginPath(); ctx!.moveTo(points[0].x, points[0].y);
      for (const p of points.slice(1)) ctx!.lineTo(p.x, p.y);
      ctx!.stroke();
    }
    function shadow(x: number, y: number, size: number, alpha: number) {
      ctx!.fillStyle = C.mist; ctx!.globalAlpha = alpha;
      ctx!.beginPath(); ctx!.ellipse(x, y + 2 * U, size * 15, size * 1.4, 0, 0, Math.PI * 2); ctx!.fill();
    }
    function figure(p: Pose, s: number, color: string, alpha: number, face = 1, accent = false, t = 0) {
      const joint = (root: Point, target: Point, a: number, b: number, bend: number) => solveLimb(root, target, a * s, b * s, bend);
      const legs = [joint(p.hip, p.footL, RIG.thigh, RIG.shin, -face), joint(p.hip, p.footR, RIG.thigh, RIG.shin, -face)];
      const arms = [joint(p.chest, p.offHand, RIG.upper, RIG.fore, face), p.elbow ? {joint:p.elbow,end:p.hand} : joint(p.chest, p.hand, RIG.upper, RIG.fore, face)];
      const neck = { x: p.chest.x + Math.sin(p.lean * .35) * 3 * s, y: p.chest.y - Math.cos(p.lean * .35) * 3 * s };
      const head = { x: neck.x, y: neck.y - 4 * s };
      const pivot=p.pivot??p.hip;
      if(accent){
        const worldNeck=(pose:Pose)=>{
          const v={x:pose.chest.x+Math.sin(pose.lean*.35)*3*s,y:pose.chest.y-Math.cos(pose.lean*.35)*3*s};
          const root=pose.pivot??pose.hip, cs=Math.cos(pose.rotation),sn=Math.sin(pose.rotation);
          return {x:root.x+(v.x-root.x)*cs-(v.y-root.y)*sn,y:root.y+(v.x-root.x)*sn+(v.y-root.y)*cs};
        };
        const anchor=worldNeck(p),previous=worldNeck(heroAt(Math.max(0,t-.04)).pose);
        const tail=scarfCurve(t,{x:(anchor.x-previous.x)/s,y:(anchor.y-previous.y)/s}).map(v=>({x:anchor.x+v.x*s,y:anchor.y+v.y*s}));
        ctx!.beginPath();ctx!.moveTo(tail[0].x,tail[0].y);
        for(let i=1;i<tail.length-1;i++)ctx!.quadraticCurveTo(tail[i].x,tail[i].y,(tail[i].x+tail[i+1].x)/2,(tail[i].y+tail[i+1].y)/2);
        ctx!.lineTo(tail[tail.length-1].x,tail[tail.length-1].y);
        ctx!.strokeStyle=C.surge;ctx!.globalAlpha=alpha*.75;ctx!.lineWidth=settings.stroke*s*.72;ctx!.stroke();
      }
      ctx!.save(); ctx!.translate(pivot.x, pivot.y); ctx!.rotate(p.rotation); ctx!.translate(-pivot.x, -pivot.y);
      const stroke = settings.stroke * s;
      line([p.hip, legs[0].joint, legs[0].end], color, alpha * .42, stroke);
      line([p.chest, arms[0].joint, arms[0].end], color, alpha * .48, stroke);
      line([p.hip, p.chest, neck], color, alpha, stroke);
      line([p.hip, legs[1].joint, legs[1].end], color, alpha, stroke);
      line([p.chest, p.shoulder??p.chest, arms[1].joint, arms[1].end], color, alpha, stroke);
      ctx!.globalAlpha = alpha; ctx!.strokeStyle = color; ctx!.lineWidth = stroke * .85;
      ctx!.beginPath(); ctx!.arc(head.x, head.y, 3.6 * s, 0, Math.PI * 2);
      ctx!.fillStyle=C.void; ctx!.fill(); ctx!.stroke();
      if (accent) {
        line([{ x: neck.x - 2.2 * s, y: neck.y + s }, { x: neck.x + 2 * s, y: neck.y + 1.8 * s }], C.surge, alpha * .85, stroke * .9);
      }
      // Defined hilt and thin blade keep the hand and wrist readable.
      const grip = arms[1].end, dx = Math.cos(p.sword), dy = Math.sin(p.sword)*(p.bladeAspect??1);
      const guard={x:grip.x+dx*3.6*s,y:grip.y+dy*3.6*s};
      line([{x:grip.x-dx*2.5*s,y:grip.y-dy*2.5*s},guard],C.mist,alpha,stroke*.85);
      line([{ x: guard.x - dy * 2 * s, y: guard.y + dx * 2 * s }, { x: guard.x + dy * 2 * s, y: guard.y - dx * 2 * s }], C.volt, alpha, stroke * .65);
      line([guard, { x: grip.x + dx * 27 * s, y: grip.y + dy * 27 * s }], color, alpha * .85, stroke * .65);
      // A small closed grip surrounds the handle behind the guard, exactly at
      // the IK wrist endpoint, rather than ending the forearm on the blade.
      ctx!.beginPath();ctx!.arc(grip.x,grip.y,1.15*s,0,Math.PI*2);
      ctx!.fillStyle=C.void;ctx!.globalAlpha=alpha;ctx!.fill();
      ctx!.strokeStyle=color;ctx!.lineWidth=stroke*.7;ctx!.stroke();
      ctx!.restore();
    }
    function enemy(x: number, y: number, s: number, face: number, t: number, alpha: number, tumble = 0, stride = 0, pressure=0, phase=0) {
      const p=sampleEnemy(t,phase,face,stride,pressure);
      const abs=(v:Point)=>({x:x+v.x*s,y:y+v.y*s});
      shadow(x, y, s, alpha * .05);
      figure({...p,hip:abs(p.hip),chest:abs(p.chest),footL:abs(p.footL),footR:abs(p.footR),hand:abs(p.hand),offHand:abs(p.offHand),rotation:tumble},s,C.mist,alpha,face);
    }
    function heroAt(t: number): { pose: Pose; scale: number } {
      const scale = 1.4 * U, hero = sampleHero(Math.min(t, 6.1), H * .85 / scale), chest = chestOf(hero);
      const abs = (p: Point) => ({ x: cx + p.x * scale, y: ground + p.y * scale });
      return { scale, pose: { hip: abs(hero.hip), chest: abs(chest), footL: abs(hero.footL), footR: abs(hero.footR), hand: abs(hero.hand), offHand: abs(hero.offHand), lean: hero.lean, sword: hero.sword, rotation: hero.rotation, bladeAspect:hero.bladeAspect, ...(hero.elbow?{elbow:abs(hero.elbow)}:{}), ...(hero.pivot?{pivot:abs(hero.pivot)}:{}), ...(hero.shoulder?{shoulder:abs(hero.shoulder)}:{}) } };
    }
    function slash(t: number, hit: number, side: number) {
      const progress = clamp((t - hit + .13) / .29);
      if (progress <= 0 || progress >= 1) return;
      const tipTrail=Array.from({length:7},(_,i)=>{
        const {pose,scale}=heroAt(t-(6-i)*.008);
        return {x:pose.hand.x+Math.cos(pose.sword)*27*scale,y:pose.hand.y+Math.sin(pose.sword)*(pose.bladeAspect??1)*27*scale};
      });
      ctx!.save(); ctx!.globalAlpha = Math.sin(progress * Math.PI) * .42 * settings.impact;
      line(tipTrail,C.surge,Math.sin(progress*Math.PI)*.42*settings.impact,1.1*U);
      const k = clamp((t - hit) / .22);
      if (k > 0) for (let i = -1; i <= 1; i++) line([{ x: cx + side * 60 * U, y: ground - 30 * U }, { x: cx + side * (64 + 16 * k) * U, y: ground - (30 + i * 12 * k) * U }], C.bone, (1 - k) * .7, U);
      ctx!.restore();
    }
    function flipTrail(t:number,alpha:number){
      if(t<=4.93||t>=5.44)return;
      const strength=smooth((t-4.93)/.08)*(1-smooth((t-5.27)/.17))*settings.impact;
      const tip=(at:number)=>{
        const {pose:p,scale}=heroAt(at),root=p.pivot??p.hip;
        const x=p.hand.x+Math.cos(p.sword)*27*scale,y=p.hand.y+Math.sin(p.sword)*27*scale;
        const cs=Math.cos(p.rotation),sn=Math.sin(p.rotation);
        return {x:root.x+(x-root.x)*cs-(y-root.y)*sn,y:root.y+(x-root.x)*sn+(y-root.y)*cs};
      };
      const trail=Array.from({length:19},(_,i)=>tip(t-(18-i)*.006));
      line(trail,C.surge,alpha*strength*.16,5*U);
      for(let i=1;i<trail.length;i++)line([trail[i-1],trail[i]],i>14?C.bone:C.surge,alpha*strength*(i/18)*.7,(.4+i/30)*U);
    }
    function finisherFx(t:number,alpha:number){
      const age=t-5.08, strength=settings.impact*alpha;
      if(age>=0&&age<.65){
        const k=clamp(age/.52),radius=(22+out(k)*155)*U;
        // A local light bloom, never a full-screen flash.
        const glow=ctx!.createRadialGradient(cx,ground-16*U,0,cx,ground-16*U,145*U);
        glow.addColorStop(0,C.surge);glow.addColorStop(1,"transparent");
        ctx!.fillStyle=glow;ctx!.globalAlpha=(1-clamp(age/.24))**2*.12*strength;
        ctx!.fillRect(cx-145*U,ground-161*U,290*U,290*U);
        for(let ring=0;ring<2;ring++){
          ctx!.beginPath();ctx!.ellipse(cx,ground+2*U,radius*(1-ring*.12),radius*.115,0,0,Math.PI*2);
          ctx!.strokeStyle=ring?C.bone:C.surge;ctx!.lineWidth=(ring?.65:1.25)*U;
          ctx!.globalAlpha=(1-k)**2*(ring?.42:.65)*strength;ctx!.stroke();
        }
        // Seeded directions give stable sparks without allocations or RNG.
        for(let i=0;i<24;i++){
          const angle=(i*2.399963)%(Math.PI*2), speed=55+(i*37%95);
          const travel=(i%5)*3+age*speed, x=cx+Math.cos(angle)*travel*U;
          const y=ground-15*U+Math.sin(angle)*travel*.55*U+age*age*26*U;
          const length=(2+(i%4))*U*(1-k);
          line([{x,y},{x:x-Math.cos(angle)*length,y:y-Math.sin(angle)*length*.45}],i%4?C.bone:C.surge,(1-k)**2*.8*strength,(i%3?.65:1)*U);
        }
        // Opponent contact flecks travel with the initial outward knockback.
        if(age<.24)for(let i=0;i<6;i++){
          const c=cinematicCrowd(i,t,W,U,settings.crowdDistance);
          for(let j=0;j<3;j++){
            const x=cx+c.x+c.face*(j*4+age*50)*U,y=ground+c.y-(21+j*4)*U;
            line([{x,y},{x:x-c.face*4*U,y:y-(j-1)*3*U}],C.bone,(1-age/.24)*.5*strength,.8*U);
          }
        }
      }
      for(const [start,power] of [[4.85,.35],[5.5,.65]]){
        const age=t-start;if(age<=0||age>=.34)continue;
        const k=age/.34;
        for(const side of [-1,1])for(let i=0;i<5;i++){
          const x=cx+side*(8+out(k)*(16+i*6))*U,y=ground-(Math.sin(k*Math.PI)*(1+i*.7))*U;
          line([{x,y},{x:x-side*(3+i)*U,y:y+.4*U}],C.mist,(1-k)**2*power*strength,.8*U);
        }
      }
    }
    function render(t: number) {
      time.set(t);
      // Prewarm only during the quiet title hold, after the fight has finished.
      if(t>=6.65&&document.documentElement.dataset.heroPrepare!=="1")document.documentElement.dataset.heroPrepare="1";
      ctx!.clearRect(0, 0, W, H); ctx!.fillStyle = C.void; ctx!.globalAlpha = 1; ctx!.fillRect(0, 0, W, H);
      ctx!.lineCap = "round"; ctx!.lineJoin = "round";
      drawTitle(ctx!,t,cx,H/2-19);
      const sceneAlpha = 1 - smooth((t - 6.05) / .45);
      if (sceneAlpha <= 0) return;
      ctx!.save();
      const impact=cinematicImpact(t),shake=settings.shake*(W<640?.55:1);
      ctx!.translate(impact.shakeX*shake,impact.shakeY*shake);
      const floor = ctx!.createLinearGradient(cx - 180 * U, ground, cx + 180 * U, ground);
      floor.addColorStop(0, "transparent"); floor.addColorStop(.5, C.steel); floor.addColorStop(1, "transparent");
      ctx!.strokeStyle = floor; ctx!.globalAlpha = sceneAlpha * .45; ctx!.lineWidth = .6;
      ctx!.beginPath(); ctx!.moveTo(cx - 180 * U, ground + 3 * U); ctx!.lineTo(cx + 180 * U, ground + 3 * U); ctx!.stroke();
      const drawHero = () => {
        const { pose, scale } = heroAt(t);
        const height = Math.abs(pose.footL.y - ground);
        shadow(cx, ground, scale * (1 - Math.min(.6, height / H)), sceneAlpha * .055);
        figure(pose, scale, C.bone, sceneAlpha, 1, true, t);
        slash(t, 1.95, 1); slash(t, 2.6, -1);
      };
      for (const [side, start, hit] of [[1, 1.4, 1.95], [-1, 2.08, 2.6]]) {
        if (t < start || t > hit + .5) continue;
        const approach = out((t - start) / (hit - start - .12)), recoil = out((t - hit) / .5);
        const x = cx + side * ((1 - approach) * (W / 2 + 40 * U) + 65 * U + recoil * 115 * U);
        const stride=(1-smooth((approach-.65)/.35))*(1-recoil);
        enemy(x, ground, 1.15 * U, -side, t, settings.enemyOpacity * sceneAlpha * (1 - recoil), side * recoil * .9,stride,0,side*1.7);
      }
      const drawCrowd=(foreground:boolean)=>{
        if(t<=2.88||t>=5.64)return;
        for(let i=0;i<6;i++){
          const c=cinematicCrowd(i,t,W,U,settings.crowdDistance);
          if(c.foreground!==foreground)continue;
          enemy(cx+c.x,ground+c.y,c.scale,c.face,t,settings.enemyOpacity*sceneAlpha*c.alpha,c.tumble,c.stride,c.pressure,i*1.37);
        }
      };
      drawCrowd(false);
      finisherFx(t,sceneAlpha);flipTrail(t,sceneAlpha);
      drawHero(); drawCrowd(true); ctx!.restore(); ctx!.globalAlpha = 1;
    }
    const cine = new URLSearchParams(location.search).get("cine");
    let frame = 0, timer: ReturnType<typeof setTimeout> | undefined;
    let previous = performance.now(), elapsed = 0;
    const loop = (now: number) => {
      elapsed += Math.min((now - previous) / 1000, .05) * settings.speed; previous = now;
      if (skipRef.current) { skipRef.current = false; elapsed = Math.max(elapsed, END - .22); }
      if (elapsed >= END) { done(); return; }
      render(elapsed); frame = requestAnimationFrame(loop);
    };
    if (cine !== null && cine !== "play") frame = requestAnimationFrame(() => render(Number(cine) || 0));
    else { frame = requestAnimationFrame(loop); timer = setTimeout(done, END / .8 * 1000 + 300); }
    const skip = () => { skipRef.current = true; };
    addEventListener("keydown", skip, { once: true });
    return () => { cancelled=true;cancelAnimationFrame(frame); clearTimeout(timer); removeEventListener("resize", resize); removeEventListener("keydown", skip); removeEventListener(CINEMATIC_TUNING_EVENT, tune); };
  }, [show, done, time]);

  return <>
    {show && <motion.div data-testid="boot-cinematic" className="fixed inset-0 z-boot bg-void" style={{ opacity: overlayOpacity }}>
      <canvas ref={canvasRef} aria-hidden className="block h-full w-full" onClick={() => { skipRef.current = true; }} />
      <motion.div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center" style={{ opacity: titleOpacity, y: titleY }}>
        <p ref={titleRef} aria-hidden className="invisible font-display font-medium text-bone" style={{ fontSize: "clamp(38px, 7.5vw, 108px)", letterSpacing: "-.045em", lineHeight: 1.1 }}>{cinematicCopy.title}</p>
        <p className="mt-5 text-mist" style={{ fontSize: "clamp(11px, 1vw, 15px)", letterSpacing: ".03em" }}>{cinematicCopy.subtitle}</p>
      </motion.div>
      <button type="button" className="absolute inline-flex min-h-11 items-center px-4 text-xs text-mist transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" style={{bottom:"max(20px, env(safe-area-inset-bottom))",left:"max(20px, env(safe-area-inset-left))"}} onClick={() => { skipRef.current = true; }}>{cinematicCopy.skip}</button>
    </motion.div>}
    {previewMode && <a href="/?cine=play" data-solid data-testid="boot-preview-replay" className="fixed left-4 top-4 z-[2147483646] inline-flex min-h-11 items-center rounded-full border border-white/15 bg-black/80 px-4 text-xs text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{cinematicCopy.replay}</a>}
  </>;
}
