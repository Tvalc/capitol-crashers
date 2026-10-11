const art={};
for(const name of ['canister45','gas45','soundwave45','empty-coat45']){
  if(typeof Image==='undefined')break;
  const im=new Image();im.src=`assets/sprites/bovino/${name}.webp`;art[name]=im;
}
function image(ctx,name,x,y,w,h){const im=art[name];if(im?.complete&&im.naturalWidth)ctx.drawImage(im,x-w/2,y-h,w,h);}
export function drawBovinoHazards(ctx,game,cam){
  for(const h of game.bovinoHazards||[]){
    ctx.save();const x=h.x-cam,y=h.y-h.z;
    if(h.kind==='bovino-canister'&&h.active){
      ctx.globalAlpha=Math.min(1,h.life/.35);
      image(ctx,'gas45',x,h.y+12,145,72);
    }else if(h.kind==='bovino-canister'){
      ctx.translate(x,y);ctx.rotate(h.dropped?0:h.age*9);
      image(ctx,'canister45',0,15,25,35);
    }else{
      ctx.translate(x,y);ctx.scale(h.vx<0?-1:1,1);
      ctx.globalAlpha=Math.min(1,h.life/.2);
      image(ctx,'soundwave45',0,30,60,75);
    }ctx.restore();
  }
  for(const c of game.bovinoCoats||[]){
    ctx.save();ctx.translate(c.x-cam+c.facing*c.age*90,c.y-90-200*c.age+130*c.age*c.age);
    ctx.rotate(c.facing*c.age*2.8);ctx.globalAlpha=Math.min(1,(c.life-c.age)/.35);
    image(ctx,'empty-coat45',0,100,160,240);ctx.restore();
  }
}
