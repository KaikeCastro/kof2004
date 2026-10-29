// Original generated game assets. A chroma-keyed atlas keeps the game dependency-free.
const portraitAtlas=new Image(), fighterAtlas=new Image(), walkAtlas=new Image(), choreographyAtlas=new Image(),specialAtlas=new Image();
const rioStage=new Image(),brasiliaStage=new Image(),novasFases=new Image();
let keyed,walkKeyed,choreographyKeyed,specialKeyed,ready=false;
const specialFrames=[];
const choreographyFrames=[];
const walkFrames=[];
const frames=[];
function imageReady(img,url){return new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error(`Falha ao carregar ${url}`));img.src=url;});}
export async function loadPixelArt(){
  await Promise.all([imageReady(portraitAtlas,'/assets/art/portraits-sheet.png'),imageReady(fighterAtlas,'/assets/art/fighters-sheet.png'),imageReady(walkAtlas,'/assets/art/caminhada.png'),imageReady(choreographyAtlas,'/assets/art/coreografia.png'),imageReady(specialAtlas,'/assets/art/golpes-especiais.png'),imageReady(rioStage,'/assets/art/rio-stage.png'),imageReady(brasiliaStage,'/assets/art/brasilia-stage.png'),imageReady(novasFases,'/assets/art/novas-fases.png')]);
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
  walkKeyed=document.createElement('canvas');walkKeyed.width=walkAtlas.width;walkKeyed.height=walkAtlas.height;
  const wc=walkKeyed.getContext('2d',{willReadFrequently:true});wc.drawImage(walkAtlas,0,0);const wp=wc.getImageData(0,0,walkKeyed.width,walkKeyed.height);
  for(let p=0;p<wp.data.length;p+=4){const r=wp.data[p],g=wp.data[p+1],b=wp.data[p+2];if(r>145&&b>135&&g<115&&r>g*1.65&&b>g*1.6)wp.data[p+3]=0;}
  wc.putImageData(wp,0,0);
  const walkRows=[[0,274],[274,524],[524,776],[776,1024]];
  for(let row=0;row<4;row++){walkFrames[row]=[];for(let i=0;i<8;i++){
    const left=i*192,right=(i+1)*192;let minX=right,maxX=left,minY=walkRows[row][1],maxY=walkRows[row][0];
    for(let y=walkRows[row][0];y<walkRows[row][1];y++)for(let x=left;x<right;x++){if(wp.data[(y*walkKeyed.width+x)*4+3]>100){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}
    walkFrames[row][i]={x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
  }}
  choreographyKeyed=document.createElement('canvas');choreographyKeyed.width=choreographyAtlas.width;choreographyKeyed.height=choreographyAtlas.height;
  const cc=choreographyKeyed.getContext('2d',{willReadFrequently:true});cc.drawImage(choreographyAtlas,0,0);const cp=cc.getImageData(0,0,choreographyKeyed.width,choreographyKeyed.height);
  for(let p=0;p<cp.data.length;p+=4){const r=cp.data[p],g=cp.data[p+1],b=cp.data[p+2];if(r>145&&b>135&&g<115&&r>g*1.65&&b>g*1.6)cp.data[p+3]=0;}
  cc.putImageData(cp,0,0);
  const choreographyRows=[[0,270],[270,536],[536,730],[730,1024]];
  for(let row=0;row<4;row++){choreographyFrames[row]=[];for(let i=0;i<8;i++){
    const left=i*192,right=(i+1)*192;let minX=right,maxX=left,minY=choreographyRows[row][1],maxY=choreographyRows[row][0];
    for(let y=choreographyRows[row][0];y<choreographyRows[row][1];y++)for(let x=left;x<right;x++){if(cp.data[(y*choreographyKeyed.width+x)*4+3]>100){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}
    choreographyFrames[row][i]={x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
  }}
  specialKeyed=document.createElement('canvas');specialKeyed.width=specialAtlas.width;specialKeyed.height=specialAtlas.height;
  const sc=specialKeyed.getContext('2d',{willReadFrequently:true});sc.drawImage(specialAtlas,0,0);const sp=sc.getImageData(0,0,specialKeyed.width,specialKeyed.height);
  for(let p=0;p<sp.data.length;p+=4){const r=sp.data[p],g=sp.data[p+1],b=sp.data[p+2];if(r>145&&b>135&&g<115&&r>g*1.65&&b>g*1.6)sp.data[p+3]=0;}
  sc.putImageData(sp,0,0);
  const specialRows=[[0,246],[246,504],[504,730],[730,1024]];
  for(let row=0;row<4;row++){specialFrames[row]=[];for(let i=0;i<8;i++){
    const left=i*192,right=(i+1)*192;let minX=right,maxX=left,minY=specialRows[row][1],maxY=specialRows[row][0];
    for(let y=specialRows[row][0];y<specialRows[row][1];y++)for(let x=left;x<right;x++){if(sp.data[(y*specialKeyed.width+x)*4+3]>100){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}
    specialFrames[row][i]={x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
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
  const durations={punch:.28,kick:.4,uppercut:.48,sweep:.44,special:.65,cast:.45};
  const duration=durations[f.action]||0;
  const progress=duration?Math.max(0,Math.min(1,1-f.actionTime/duration)):0;
  // Wind-up, active strike and recovery use separate poses and movement.
  const active=duration&&progress>.14&&progress<.8;
  const pose=f.blocking?3:active&&(f.action==='punch'||f.action==='uppercut'||f.action==='special'||f.action==='cast')?1:active&&(f.action==='kick'||f.action==='sweep')?2:0;
  const walking=f.action==='idle'&&!f.blocking&&f.y===0&&Math.abs(f.vx)>40;
  const walkFrame=Math.floor(f.walk/2)%4;
  let choreography=-1;
  if(f.hp>0&&duration&&progress<.2)choreography=0;
  else if(f.hp>0&&active&&f.action==='sweep')choreography=2;
  else if(f.hp>0&&active&&(f.action==='uppercut'||f.action==='special'||(f.action==='kick'&&progress<.36)))choreography=1;
  else if(f.hp>0&&f.y<0&&!duration)choreography=3;
  let specialPose=-1;
  if(f.hp>0&&(f.action==='cast'||f.action==='special'))specialPose=progress<.34?0:progress<.85?1:-1;
  else if(f.hp>0&&f.action==='victory')specialPose=3;
  else if(f.hp>0&&f.action==='kick'&&active&&[1,2,3].includes(f.index)&&progress>.36)specialPose=2;
  const frame=specialPose>=0?specialFrames[specialPose][f.index]:choreography>=0?choreographyFrames[choreography][f.index]:walking?walkFrames[walkFrame][f.index]:frames[pose][f.index];const scale=1.16;
  const bounce=f.hp<=0?0:Math.abs(f.vx)>40&&f.y===0?Math.sin(f.walk*2)*3:Math.sin(time*5+f.index)*1.6;
  c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(f.x),Math.round(f.y+bounce));c.scale(f.facing,1);
  if(duration&&f.hp>0){const thrust=Math.sin(progress*Math.PI);c.translate(thrust*(f.action==='special'?20:9),0);c.rotate((f.action==='sweep'?.07:-.035)*thrust);}
  if(f.y<0&&f.hp>0)c.rotate(Math.max(-.1,Math.min(.1,f.vy/6000)));
  if(f.action==='idle'&&f.y===0){const stride=Math.abs(f.vx)>40?Math.sin(f.walk)*.035:Math.sin(time*4+f.index)*.008;c.rotate(stride);c.scale(1,1+Math.abs(stride)*.2);}
  if(f.hp<=0){c.translate(0,-5);c.rotate(-Math.PI/2);}
  else if(f.action==='hurt'){c.rotate(-.12);c.globalAlpha=.65+Math.sin(time*65)*.25;}
  const w=frame.w*scale,h=frame.h*scale;
  // The torso stays centered as attack poses extend toward the opponent.
  let anchor=specialPose===1||specialPose===2?w*.37:specialPose>=0?w*.5:choreography===2?w*.35:choreography>=0?w*.5:pose===1?w*.32:pose===2?w*.28:w*.5;
  if(f.index===7&&choreography<0&&specialPose<0)anchor=pose===1?w*.35:w*.48;
  const bobX=Math.abs(f.vx)>40&&pose===0?Math.sin(f.walk)*2:0;
  c.drawImage(specialPose>=0?specialKeyed:choreography>=0?choreographyKeyed:walking?walkKeyed:keyed,frame.x,frame.y,frame.w,frame.h,Math.round(-anchor+bobX),Math.round(-h),Math.round(w),Math.round(h));
  c.restore();return true;
}

export function drawPixelStage(c,arena){if(!ready)return false;c.save();c.imageSmoothingEnabled=false;if(arena==='salvador'||arena==='saopaulo'){const w=novasFases.width/2;c.drawImage(novasFases,arena==='salvador'?0:w,0,w,novasFases.height,0,0,1280,720);}else c.drawImage(arena==='rio'?rioStage:brasiliaStage,0,0,1280,720);c.restore();return true;}
