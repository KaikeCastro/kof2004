// Original generated game assets. A chroma-keyed atlas keeps the game dependency-free.
const portraitAtlas=new Image(), fighterAtlas=new Image();
const rioStage=new Image(),brasiliaStage=new Image(),novasFases=new Image();
let keyed,ready=false;
const frames=[];
function imageReady(img,url){return new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error(`Falha ao carregar ${url}`));img.src=url;});}
export async function loadPixelArt(){
  await Promise.all([imageReady(portraitAtlas,'/assets/art/portraits-sheet.png'),imageReady(fighterAtlas,'/assets/art/fighters-sheet.png'),imageReady(rioStage,'/assets/art/rio-stage.png'),imageReady(brasiliaStage,'/assets/art/brasilia-stage.png'),imageReady(novasFases,'/assets/art/novas-fases.png')]);
  keyed=document.createElement('canvas');keyed.width=fighterAtlas.width;keyed.height=fighterAtlas.height;
  const c=keyed.getContext('2d',{willReadFrequently:true});c.drawImage(fighterAtlas,0,0);const pixels=c.getImageData(0,0,keyed.width,keyed.height);
  for(let p=0;p<pixels.data.length;p+=4){const r=pixels.data[p],g=pixels.data[p+1],b=pixels.data[p+2];if(r>145&&b>135&&g<115&&r>g*1.65&&b>g*1.6)pixels.data[p+3]=0;}
  c.putImageData(pixels,0,0);
  const rows=[[0,274],[274,514],[514,738],[738,1024]];
  const columns=[[0,200],[200,396],[396,591],[571,779],[779,965],[952,1152],[1137,1352],[1320,1536]];
  // Poses have slightly different cell extents. Store tight bounds, with the feet as the anchor.
  for(let pose=0;pose<4;pose++){frames[pose]=[];for(let i=0;i<8;i++){
    let [left,right]=columns[i];
    if(pose===0){left=i*192;right=(i+1)*192;}
    if(pose===2){left=[0,200,384,574,771,959,1140,1320][i];right=[200,384,574,771,959,1140,1330,1536][i];}
    if(pose===3){left=i*192;right=(i+1)*192;}
    let minX=right,maxX=left,minY=rows[pose][1],maxY=rows[pose][0];
    for(let y=rows[pose][0];y<rows[pose][1];y++)for(let x=left;x<right;x++){const p=(y*keyed.width+x)*4;if(pixels.data[p+3]>100){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}
    frames[pose][i]={x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
  }}
  ready=true;
}
export function drawPixelPortrait(c,index,w,h){
  if(!ready)return false;c.save();c.imageSmoothingEnabled=false;
  const sw=portraitAtlas.width/4,sh=portraitAtlas.height/2;
  // Draw through a low-resolution canvas for authentic large, crisp pixels.
  const mini=document.createElement('canvas');mini.width=128;mini.height=144;const mc=mini.getContext('2d');mc.imageSmoothingEnabled=false;mc.drawImage(portraitAtlas,index%4*sw,Math.floor(index/4)*sh,sw,sh,0,0,128,144);
  c.drawImage(mini,0,0,w,h);c.restore();return true;
}
export function pixelPortraitURL(index){const c=document.createElement('canvas');c.width=128;c.height=144;drawPixelPortrait(c.getContext('2d'),index,128,144);return c.toDataURL();}
export function drawPixelFighter(c,f,time){
  if(!ready)return false;
  const pose=f.blocking?3:(f.action==='punch'||f.action==='uppercut')?1:(f.action==='kick'||f.action==='sweep')?2:f.action==='special'?1:0;
  const frame=frames[pose][f.index];const scale=1.16;
  const bounce=f.hp<=0?0:Math.abs(f.vx)>40&&f.y===0?Math.sin(f.walk*2)*3:Math.sin(time*5+f.index)*1.6;
  c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(f.x),Math.round(f.y+bounce));c.scale(f.facing,1);
  if(f.action==='idle'&&f.y===0){const stride=Math.abs(f.vx)>40?Math.sin(f.walk)*.035:Math.sin(time*4+f.index)*.008;c.rotate(stride);c.scale(1,1+Math.abs(stride)*.2);}
  if(f.hp<=0){c.translate(0,-5);c.rotate(-Math.PI/2);}
  else if(f.action==='hurt'){c.rotate(-.12);c.globalAlpha=.65+Math.sin(time*65)*.25;}
  const w=frame.w*scale,h=frame.h*scale;
  // The torso stays centered as attack poses extend toward the opponent.
  let anchor=pose===1?w*.32:pose===2?w*.28:w*.5;
  if(f.index===7)anchor=pose===1?w*.35:w*.48;
  const bobX=Math.abs(f.vx)>40&&pose===0?Math.sin(f.walk)*2:0;
  c.drawImage(keyed,frame.x,frame.y,frame.w,frame.h,Math.round(-anchor+bobX),Math.round(-h),Math.round(w),Math.round(h));
  c.restore();return true;
}

export function drawPixelStage(c,arena){if(!ready)return false;c.save();c.imageSmoothingEnabled=false;if(arena==='salvador'||arena==='saopaulo'){const w=novasFases.width/2;c.drawImage(novasFases,arena==='salvador'?0:w,0,w,novasFases.height,0,0,1280,720);}else c.drawImage(arena==='rio'?rioStage:brasiliaStage,0,0,1280,720);c.restore();return true;}
