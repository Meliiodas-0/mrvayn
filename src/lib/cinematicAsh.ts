// Built once from the actual title glyphs, not a rectangular particle overlay.
export const ASH_START=7.12;
export const ASH_END=8.65;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const noise=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
export function ashFragment(time:number,x:number,y:number,seed:number) {
  const release=ASH_START+x*.65+y*.06+noise(seed)*.12;
  const age=Math.max(0,time-release),life=.52+noise(seed+3)*.24;
  return {
    released:time>=release,
    dx:age*(24+noise(seed+1)*48)+Math.sin(age*8+seed)*age*13,
    dy:-age*(26+noise(seed+2)*44)-age*age*18,
    alpha:1-clamp(age/life),scale:1-clamp(age/life)*.8,
    rotation:age*(noise(seed+4)-.5)*5,
  };
}

export function createAshTitle(text:string,family:string,size:number,color:string) {
  const mask=document.createElement("canvas"),ink=mask.getContext("2d",{willReadFrequently:true});
  if(!ink)throw new Error("Title canvas unavailable");
  const font=`500 ${size}px ${family}`,tracking=-size*.045;
  ink.font=font;
  const chars=[...text],width=chars.reduce((sum,c)=>sum+ink.measureText(c).width,0)+tracking*(chars.length-1);
  const metrics=ink.measureText(text),ascent=metrics.actualBoundingBoxAscent||size*.8,descent=metrics.actualBoundingBoxDescent||size*.2;
  mask.width=Math.ceil(width+8);mask.height=Math.ceil(ascent+descent+8);
  ink.font=font;ink.fillStyle=color;ink.textBaseline="alphabetic";
  let pen=4;
  for(const c of chars){ink.fillText(c,pen,4+ascent);pen+=ink.measureText(c).width+tracking;}
  const pixels=ink.getImageData(0,0,mask.width,mask.height).data;
  const cell=Math.max(2,Math.ceil(Math.sqrt(mask.width*mask.height/4500)));
  const grains:Array<{x:number;y:number;seed:number}>=[];
  for(let y=0;y<mask.height;y+=cell)for(let x=0;x<mask.width;x+=cell){
    let visible=false;
    for(let py=y;py<Math.min(y+cell,mask.height)&&!visible;py++)for(let px=x;px<Math.min(x+cell,mask.width);px++)if(pixels[(py*mask.width+px)*4+3]>20){visible=true;break;}
    if(visible)grains.push({x,y,seed:grains.length+1});
  }
  const remaining=document.createElement("canvas");remaining.width=mask.width;remaining.height=mask.height;
  const rest=remaining.getContext("2d");
  if(!rest)throw new Error("Title mask unavailable");
  return (ctx:CanvasRenderingContext2D,time:number,cx:number,cy:number)=>{
    const enter=clamp((time-6.15)/.5),alpha=enter*enter*(3-2*enter);
    if(alpha<=0||time>=ASH_END||!rest)return;
    const left=cx-mask.width/2,top=cy-mask.height/2+12*(1-clamp((time-6.15)/.65));
    ctx.save();ctx.globalAlpha=alpha;
    if(time<ASH_START){ctx.drawImage(mask,left,top);ctx.restore();return;}
    rest.clearRect(0,0,mask.width,mask.height);rest.drawImage(mask,0,0);
    for(const g of grains){
      const p=ashFragment(time,g.x/mask.width,g.y/mask.height,g.seed);
      if(!p.released)continue;
      rest.clearRect(g.x,g.y,cell,cell);
      if(p.alpha<=0)continue;
      ctx.save();ctx.globalAlpha=p.alpha*.85;
      ctx.translate(left+g.x+cell/2+p.dx,top+g.y+cell/2+p.dy);ctx.rotate(p.rotation);
      // Each flake carries the sampled glyph coverage, including anti-aliased edges.
      const sw=Math.min(cell,mask.width-g.x),sh=Math.min(cell,mask.height-g.y);
      ctx.drawImage(mask,g.x,g.y,sw,sh,-sw*p.scale/2,-sh*p.scale/2,sw*p.scale,sh*p.scale);
      ctx.restore();
    }
    ctx.globalAlpha=1;ctx.drawImage(remaining,left,top);ctx.restore();
  };
}
