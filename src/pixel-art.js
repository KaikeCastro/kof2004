import {normalActions,specialActions,attackInfo} from './fighters.js';
import {animationPose} from './animation.js';
// Original generated game assets. A chroma-keyed atlas keeps the game dependency-free.
const portraitAtlas=new Image(), fighterAtlas=new Image(), walkAtlas=new Image(), choreographyAtlas=new Image(),specialAtlas=new Image();
const reactionAtlas=new Image(), attackAtlas=new Image();
let reactionKeyed,attackKeyed;const reactionFrames=[],attackFrames=[];
const rioStage=new Image(),brasiliaStage=new Image(),novasFases=new Image();
let keyed,walkKeyed,choreographyKeyed,specialKeyed,ready=false;
const specialFrames=[];
const choreographyFrames=[];
const walkFrames=[];
const frames=[];
const visualStates=new WeakMap();
function imageReady(img,url){return new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error(`Falha ao carregar ${url}`));img.src=url;});}
export async function loadPixelArt(){
  await Promise.all([imageReady(portraitAtlas,'/assets/art/portraits-sheet.png'),imageReady(fighterAtlas,'/assets/art/fighters-sheet.png'),imageReady(walkAtlas,'/assets/art/caminhada.png'),imageReady(choreographyAtlas,'/assets/art/coreografia.png'),imageReady(specialAtlas,'/assets/art/golpes-especiais.png'),imageReady(rioStage,'/assets/art/rio-stage.png'),imageReady(brasiliaStage,'/assets/art/brasilia-stage.png'),imageReady(novasFases,'/assets/art/novas-fases.png'),imageReady(reactionAtlas,'/assets/art/reacoes.png'),imageReady(attackAtlas,'/assets/art/ataques.png')]);
  const rows=[[0,274],[274,514],[514,738],[738,1024]];
  const walkRows=[[0,274],[274,524],[524,776],[776,1024]];
  const choreographyRows=[[0,270],[270,536],[536,730],[730,1024]];
  const specialRows=[[0,246],[246,504],[504,730],[730,1024]];
  // Extract all sheets once, removing key colors and isolated fragments per cell.
  function extractAtlas(image,rows,output){
    const sheet=document.createElement('canvas');sheet.width=image.width;sheet.height=image.height;
    const context=sheet.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
    const data=context.getImageData(0,0,sheet.width,sheet.height);
    for(let p=0;p<data.data.length;p+=4){const r=data.data[p],g=data.data[p+1],b=data.data[p+2];if(r>145&&b>135&&g<115&&r>g*1.65&&b>g*1.6)data.data[p+3]=0;}
    for(let row=0;row<4;row++){output[row]=[];for(let i=0;i<8;i++){
      const left=i*192,right=(i+1)*192,top=rows[row][0],bottom=rows[row][1];
      const width=right-left,height=bottom-top,size=width*height;
      const labels=new Int32Array(size),stack=new Int32Array(size);let label=0,best=0,bestSize=0;
      // Discard fragments from adjacent columns, keeping the largest connected sprite.
      for(let local=0;local<size;local++){
        const x=local%width,y=Math.floor(local/width),pixel=((top+y)*sheet.width+left+x)*4;
        if(labels[local]||data.data[pixel+3]<=100)continue;
        label++;let count=0,head=0;stack[head++]=local;labels[local]=label;
        while(head){
          const pos=stack[--head],px=pos%width,py=Math.floor(pos/width);count++;
          for(const next of [px>0?pos-1:-1,px+1<width?pos+1:-1,py>0?pos-width:-1,py+1<height?pos+width:-1]){
            if(next<0||labels[next])continue;
            const nx=next%width,ny=Math.floor(next/width),np=((top+ny)*sheet.width+left+nx)*4;
            if(data.data[np+3]>100){labels[next]=label;stack[head++]=next;}
          }
        }
        if(count>bestSize){bestSize=count;best=label;}
      }
      let minX=right,maxX=left,minY=bottom,maxY=top;
      for(let local=0;local<size;local++){
        const x=left+local%width,y=top+Math.floor(local/width),pixel=(y*sheet.width+x)*4;
        if(labels[local]===best&&best){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
        else data.data[pixel+3]=0;
      }
      if(maxX<=minX||maxY<=minY)throw new Error(`Quadro ausente: ${row}/${i}`);
      output[row][i]={x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
    }}context.putImageData(data,0,0);return sheet;
  }
  // Older sheets also contain overlapping fragments at cell edges.
  keyed=extractAtlas(fighterAtlas,rows,frames);
  walkKeyed=extractAtlas(walkAtlas,walkRows,walkFrames);
  choreographyKeyed=extractAtlas(choreographyAtlas,choreographyRows,choreographyFrames);
  specialKeyed=extractAtlas(specialAtlas,specialRows,specialFrames);
  reactionKeyed=extractAtlas(reactionAtlas,[[0,300],[300,560],[560,810],[810,1024]],reactionFrames);
  attackKeyed=extractAtlas(attackAtlas,[[0,270],[270,520],[520,750],[750,1024]],attackFrames);
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
  const action=f.action==='guardCounter'?'kick':f.action==='strongPunch'?'punch':f.action==='strongKick'?(f.stance==='crouch'?'sweep':'kick'):(f.action==='special2'||f.action==='super')?'special':f.action;
  const durations={punch:.28,kick:.4,uppercut:.48,sweep:.44,special:([.65,.72,.62,.76,.64,.74,.8,.7][f.index]),cast:.45,grab:.5,dodge:.42};
  const duration=(normalActions.includes(f.action)||specialActions.includes(f.action)?f.actionDuration:durations[action])||0;
  const progress=duration?Math.max(0,Math.min(1,1-f.actionTime/duration)):0;
  // Wind-up, active strike and recovery use separate poses and movement.
  const active=!!attackInfo(f)||(specialActions.includes(f.action)&&progress>.2&&progress<.75);
  const pose=f.blocking?3:active&&(action==='grab'||action==='punch'||action==='uppercut'||action==='special'||action==='cast')?1:active&&(action==='kick'||action==='sweep')?2:0;
  const walking=action==='idle'&&!f.blocking&&f.y===0&&Math.abs(f.vx)>40;
  const walkFrame=Math.floor(f.walk/2)%4;
  let choreography=-1;
  if(f.hp>0&&duration&&progress<.2)choreography=0;
  else if(f.hp>0&&action==='dodge')choreography=2;
  else if(f.hp>0&&active&&action==='sweep')choreography=2;
  else if(f.hp>0&&active&&(action==='uppercut'||action==='special'||(action==='kick'&&progress<.36)))choreography=1;
  else if(f.hp>0&&f.y<0&&!duration)choreography=3;
  let specialPose=-1;
  if(f.hp>0&&(action==='cast'||action==='special'))specialPose=progress<.34?0:progress<.85?1:-1;
  else if(f.hp>0&&action==='victory')specialPose=3;
  else if(f.hp>0&&action==='kick'&&active&&[1,2,3].includes(f.index)&&progress>.36)specialPose=2;
  let reaction=-1,attackFrame=-1;
  if(f.hp<=0){const t=f.koTime||0;reaction=t<.12?0:t<.25?1:t<.48?2:3;}
  else if(action==='hurt')reaction=f.actionTime>(f.reactionDuration||.3)*.5?0:1;
  else if(action==='down'){const elapsed=.85-f.actionTime;reaction=elapsed<.12?0:elapsed<.25?1:elapsed<.45?2:3;}
  else if(action==='rise')reaction=f.actionTime>.2?3:f.actionTime>.1?1:0;
  else if(duration&&(normalActions.includes(f.action)||f.action==='grab'||f.action==='guardCounter')){
    const elapsed=duration-f.actionTime;
    attackFrame=active?(['kick','sweep'].includes(action)?2:1):elapsed<duration*.45?0:3;
  }
  const frame=reaction>=0?reactionFrames[reaction][f.index]:attackFrame>=0?attackFrames[attackFrame][f.index]:specialPose>=0?specialFrames[specialPose][f.index]:choreography>=0?choreographyFrames[choreography][f.index]:walking?walkFrames[walkFrame][f.index]:frames[pose][f.index];
  const frameSource=reaction>=0?reactionKeyed:attackFrame>=0?attackKeyed:specialPose>=0?specialKeyed:choreography>=0?choreographyKeyed:walking?walkKeyed:keyed;const scale=1.16;
  const bounce=f.hp<=0?0:Math.abs(f.vx)>40&&f.y===0?Math.sin(f.walk*2)*3:Math.sin(time*5+f.index)*1.6;
  c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(f.x),Math.round(f.y+bounce));c.scale(f.facing,1);
  if(reaction<0&&(f.crouching||f.stance==='crouch'&&duration)&&f.y===0&&!f.knockedDown)c.scale(1,.67);
  if(f.maxTime>0){c.shadowColor='#ec67ff';c.shadowBlur=14;}
  if(action==='backdash'){c.rotate(-.16);}
  if(action==='victory'&&f.hp>0){const cheer=Math.sin(time*6+f.index);c.translate(0,-Math.max(0,cheer)*5);c.rotate(cheer*.025);}
  if(duration&&f.hp>0&&reaction<0){const pose=animationPose(f);c.translate(pose.shift*.45,-pose.lift*.35);c.rotate(pose.rotation*.35);}
  if(f.y<0&&f.hp>0)c.rotate(Math.max(-.1,Math.min(.1,f.vy/6000)));
  if(action==='idle'&&f.y===0){const stride=Math.abs(f.vx)>40?Math.sin(f.walk)*.035:Math.sin(time*4+f.index)*.008;c.rotate(stride);c.scale(1,1+Math.abs(stride)*.2);}
  if(action==='dodge'){const phase=Math.max(0,Math.min(1,1-f.actionTime/.42));c.globalAlpha=.8;c.translate(0,-4*Math.sin(phase*Math.PI));c.rotate(.12*Math.sin(phase*Math.PI*2));c.scale(.96,.8);}
  if(reaction===2)c.translate(0,-24);
  if(action==='hurt'){const recoil=Math.sin(Math.min(1,f.actionTime/(f.reactionDuration||.3))*Math.PI);c.translate(-8*recoil,0);}
  const w=frame.w*scale,h=frame.h*scale;
  // The torso stays centered as attack poses extend toward the opponent.
  let anchor=reaction>=0||attackFrame>=0?w*.5:specialPose===1||specialPose===2?w*.37:specialPose>=0?w*.5:choreography===2?w*.35:choreography>=0?w*.5:pose===1?w*.32:pose===2?w*.28:w*.5;
  if(f.index===7&&reaction<0&&attackFrame<0&&choreography<0&&specialPose<0)anchor=pose===1?w*.35:w*.48;
  const bobX=Math.abs(f.vx)>40&&pose===0?Math.sin(f.walk)*2:0;
  const previous=visualStates.get(f);
  const changed=previous&&(previous.source!==frameSource||previous.frame.x!==frame.x||previous.frame.y!==frame.y);
  let state=previous;
  if(!state||changed){state={source:frameSource,frame,anchor,w,h,from:changed?{source:previous.source,frame:previous.frame,anchor:previous.anchor,w:previous.w,h:previous.h}:null,started:time};visualStates.set(f,state);}
  // A brief, faint in-between softens pose swaps while leaving the active pose readable.
  const fade=state.from?Math.max(0,1-(time-state.started)/.05):0;
  if(fade>0&&reaction<0&&f.hp>0){
    const before=state.from;c.save();c.globalAlpha*=fade*.16;
    c.drawImage(before.source,before.frame.x,before.frame.y,before.frame.w,before.frame.h,Math.round(-before.anchor+bobX),Math.round(-before.h),Math.round(before.w),Math.round(before.h));c.restore();
  }
  c.drawImage(frameSource,frame.x,frame.y,frame.w,frame.h,Math.round(-anchor+bobX),Math.round(-h),Math.round(w),Math.round(h));
  c.restore();return true;
}

export function drawPixelStage(c,arena){if(!ready)return false;c.save();c.imageSmoothingEnabled=false;if(arena==='salvador'||arena==='saopaulo'){const w=novasFases.width/2;c.drawImage(novasFases,arena==='salvador'?0:w,0,w,novasFases.height,0,0,1280,720);}else c.drawImage(arena==='rio'?rioStage:brasiliaStage,0,0,1280,720);c.restore();return true;}
