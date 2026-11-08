// Independent of the cursor game's rig and appearance.
export const CINEMATIC_STYLE = { speed: 1, stroke: 1.45, enemyOpacity: .52, impact: .7, crowdDistance: 1, shake: .75 };
export const CINEMATIC_TUNING_EVENT = "portfolio:cinematic-tuning";
export function cinematicLayout(width: number, height: number, deviceRatio = 1) {
  return {
    unit: Math.min(width / 480, height / 480) * 1.65,
    ground: height * (width < 640 ? .58 : .64),
    pixelRatio: Math.min(deviceRatio, 2, Math.sqrt(5_000_000 / (width * height))),
  };
}

export function cinematicCrowd(index:number,time:number,width:number,unit:number,distance=1) {
  const clamp=(v:number)=>Math.max(0,Math.min(1,v));
  const smooth=(v:number)=>{const p=clamp(v);return p*p*(3-2*p);};
  const stage=[[-66,-10],[-47,14],[-30,-46],[30,-46],[47,14],[66,-10]];
  const [offset,depth]=stage[index], arrival=smooth((time-2.88)/.8);
  const pressure=smooth((time-3.55)/.8), recoil=1-(1-clamp((time-5.08)/.55))**3;
  const spread=(1.5-.5*pressure)*distance;
  const feintTime=[3.48,3.73,4.43,3.98,4.11,4.58][index];
  const feint=smooth((time-feintTime+.18)/.18)*(1-smooth((time-feintTime)/.2))*(index===1||index===4?1:.55);
  return {
    x:offset*unit*spread+Math.sign(offset)*((1-arrival)*width*.55+recoil*120*unit-feint*9*unit),
    y:depth*unit, scale:(depth<0?.84:.98)*unit, face:offset<0?1:-1,
    alpha:arrival*(1-recoil)*(depth<-20?.65:depth>0?1:.85),
    stride:((1-smooth((arrival-.55)/.45))+.3*Math.sin(pressure*Math.PI))*(1-recoil),
    gait:(time-2.88)*17+index*.8, tumble:Math.sign(offset)*recoil,
    foreground:depth>0, pressure:feint,
  };
}

// Absolute-time impulses stay deterministic at every display refresh rate.
// Shake is measured in CSS pixels, not multiplied by the 4K scene scale.
export function cinematicImpact(time:number) {
  const impulse=(start:number,duration:number)=>{
    const age=time-start;
    return age<0||age>=duration?0:Math.sin(Math.min(1,age/.018)*Math.PI/2)*(1-age/duration)**3;
  };
  const hit=impulse(5.08,.28), landing=impulse(5.5,.2);
  const first=impulse(1.95,.17),second=impulse(2.6,.19);
  return {
    hit,landing,
    shakeX:hit*(Math.sin((time-5.08)*97)*5+Math.sin((time-5.08)*151)*1.5)+first*Math.sin((time-1.95)*99)*3-second*Math.sin((time-2.6)*93)*3.4,
    shakeY:hit*Math.cos((time-5.08)*119)*3.7+landing*Math.sin((time-5.5)*103)*2.5+first*Math.cos((time-1.95)*107)*1.5+second*Math.cos((time-2.6)*103)*1.7,
    burst:Math.max(0,Math.min(1,(time-5.08)/.52)),
  };
}

export function cinematicStrikeReaction(age:number){
  const clamp=(v:number)=>Math.max(0,Math.min(1,v));
  const smooth=(v:number)=>{const k=clamp(v);return k*k*(3-2*k);};
  const flight=clamp((age-.045)/.44);
  return {
    stagger:smooth(age/.012)*(1-smooth((age-.055)/.14)),
    travel:1-(1-clamp((age-.045)/.4))**3,
    lift:Math.sin(flight*Math.PI)*13,
    tumble:(1-(1-clamp((age-.02)/.36))**3)*1.05,
    opacity:1-smooth((age-.2)/.29),
  };
}
