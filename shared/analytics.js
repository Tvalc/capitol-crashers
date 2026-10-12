/* AdsToAid: optional, explicit product events. Public PostHog project token. */
(()=>{
 'use strict';
 if(window.ArcadeAnalytics)return;
 const KEY='a2a-analytics-consent-v1',VISIT='a2a-analytics-last-visit-v1';
 const CENTRAL='https://politicalarcades.com',FRAME='https://capitolcrashers.com';
 const embedded=location.origin===FRAME&&window.parent!==window;
 const paths={'/horse/':'vote','/housing-stack/':'housing_stack','/outreach-route/':'every_kid_can_see','/pothole-party/':'pothole_party','/capitol-crashers/':'capitol_crashers','/play/':'capitol_crashers'};
 const game=paths[location.pathname]||null;
 const allowed=new Set(['game_started','resources_earned','city_built','city_created','return_visit','patreon_clicked','analytics_ready']);
 const resources=new Set(['housing','streets','recreation','care','policy']);
 const games=new Set(Object.values(paths));
 const kinds=new Set(['homes','park','court','clinic','kitchen','fountain','road']);
 let consent=null,loading=false,loaded=false,panel=null;
 const queue=[];
 const signal=()=>navigator.globalPrivacyControl===true||navigator.doNotTrack==='1';
 try{consent=localStorage.getItem(KEY);}catch{}
 if(signal())consent='no';
 function clean(data={}){
  const out={};
  if(games.has(data.game))out.game=data.game;
  if(resources.has(data.resource))out.resource=data.resource;
  if(kinds.has(data.kind))out.kind=data.kind;
  if(Number.isFinite(data.amount)&&data.amount>0&&data.amount<=10000)out.amount=data.amount;
  if(Number.isFinite(data.days_since_visit))out.days_since_visit=Math.min(3650,Math.max(0,Math.floor(data.days_since_visit)));
  return out;
 }
 function capture(name,data={}){
  if(!allowed.has(name))return;
  const props=clean(data);
  if(embedded){window.parent.postMessage({channel:'a2a-analytics-v1',name,properties:props},CENTRAL);return;}
  if(consent!=='yes'||signal())return;
  const event={...props,site:'adstoaid',page:location.pathname,is_test:new URLSearchParams(location.search).get('analytics_test')==='1'};
  if(loaded)window.posthog.capture(name,event);
  else if(queue.length<50)queue.push([name,event]);
 }
 function safeUrl(value){try{const u=new URL(value);return u.origin+u.pathname;}catch{return '';}}
 function init(){
  if(embedded||loading||loaded||consent!=='yes'||signal())return;
  if(window.posthog?.__loaded){window.posthog.opt_in_capturing();loaded=true;return;}
  loading=true;
  // PostHog's browser loader queue. The SDK drains _i when array.js arrives.
  const ph=window.posthog=window.posthog||[];
  if(!ph.__SV){ph._i=[];ph.init=(token,config)=>ph._i.push([token,config,'posthog']);ph.capture=function(){ph.push(['capture',...arguments]);};ph.__SV=1;}
  ph.init('phc_t5qo6nMQiZWJB3wXMwQjzrvgUK6LTbPGzM8VkKmNVPFH',{
   api_host:'https://us.i.posthog.com',defaults:'2026-05-30',person_profiles:'identified_only',
   autocapture:false,capture_pageview:false,capture_pageleave:false,disable_session_recording:true,
   disable_surveys:true,advanced_disable_feature_flags:true,capture_performance:false,
   respect_dnt:true,ip:false,
   before_send(event){
    const p=event.properties||{};
    // Do not transmit query strings, reward-transfer fragments, names or form contents.
    for(const key of Object.keys(p))if(/url|referrer/i.test(key)&&typeof p[key]==='string')p[key]=safeUrl(p[key]);
    delete p.$set;delete p.$set_once;
    return event;
   },
   loaded(sdk){
    if(consent!=='yes'||signal()){sdk.opt_out_capturing({clear_persistence:true});return;}
    loaded=true;loading=false;
    sdk.capture('$pageview',{site:'adstoaid',page:location.pathname,$current_url:location.origin+location.pathname,is_test:new URLSearchParams(location.search).get('analytics_test')==='1'});
    capture('analytics_ready');
    for(const [name,data]of queue.splice(0))sdk.capture(name,data);
    try{const now=Date.now(),prior=Number(localStorage.getItem(VISIT));if(prior&&now-prior>=1800000)capture('return_visit',{days_since_visit:(now-prior)/86400000});localStorage.setItem(VISIT,String(now));}catch{}
   }
  });
  if(ph.__loaded)return;
  const script=document.createElement('script');script.async=true;script.crossOrigin='anonymous';
  script.src='https://us-assets.i.posthog.com/static/array.js';
  script.onerror=()=>{loading=false;queue.length=0;};document.head.append(script);
 }
 function choose(value){
  consent=value;try{localStorage.setItem(KEY,value);}catch{}
  panel?.remove();panel=null;
  if(value==='yes'){
   if(window.posthog?.__loaded){window.posthog.opt_in_capturing();loaded=true;capture('analytics_ready');}
   else init();
  }else{
   queue.length=0;window.posthog?.opt_out_capturing?.({clear_persistence:true});
   try{localStorage.removeItem(VISIT);}catch{}
  }
 }
 function choices(){
  if(embedded||panel)return;
  panel=document.createElement('section');panel.id='a2a-analytics-choice';panel.setAttribute('aria-label','Optional analytics');
  const text=document.createElement('p');text.textContent='Help improve the arcade? Allow optional analytics to measure game use and return visits. No session recordings.';
  const actions=document.createElement('div');
  for(const [label,value]of [['Allow analytics','yes'],['No thanks','no']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>choose(value);if(value==='yes'&&signal()){b.disabled=true;b.title='Your browser privacy signal is enabled.';}actions.append(b);}
  const link=document.createElement('a');link.href=CENTRAL+'/privacy.html#analytics';link.textContent='Privacy';actions.append(link);panel.append(text,actions);document.body.append(panel);
 }
 function earned(){try{const s=JSON.parse(localStorage.getItem('pa-player-city-v1'));const e={...s?.earned};e.recreation=(e.recreation||0)+(s?.recreationQuarters||0)/4;return e;}catch{return {};}}
 let baseline=earned();
 const rememberVisit=()=>{if(!embedded&&consent==='yes'&&!signal())try{localStorage.setItem(VISIT,String(Date.now()));}catch{}};
 window.addEventListener('pagehide',rememberVisit);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)rememberVisit();});
 window.addEventListener('city-rewards-updated',()=>{const next=earned();for(const resource of resources){const amount=(next[resource]||0)-(baseline[resource]||0);if(amount>0)capture('resources_earned',{game,resource,amount});}baseline=next;});
 window.addEventListener('storage',e=>{
  if(e.key==='pa-player-city-v1')baseline=earned();
  if(e.key===KEY){consent=e.newValue;panel?.remove();panel=null;if(consent==='yes')init();else{queue.length=0;window.posthog?.opt_out_capturing?.({clear_persistence:true});}}
 });
 window.addEventListener('message',e=>{
  if(embedded||e.origin!==FRAME||e.source!==document.querySelector('iframe[data-city-game]')?.contentWindow||e.data?.channel!=='a2a-analytics-v1')return;
  // Resource receipts are measured after the parent saves them, never twice from the iframe.
  if(e.data.name==='game_started')capture('game_started',{game:'capitol_crashers'});
  if(e.data.name==='patreon_clicked')capture('patreon_clicked',{game:'capitol_crashers'});
 });
 document.addEventListener('click',e=>{const a=e.target.closest?.('a[href]');if(!a)return;try{const host=new URL(a.href).hostname;if(host==='patreon.com'||host==='www.patreon.com')capture('patreon_clicked',{game});}catch{}});
 window.ArcadeAnalytics={capture,choices};
 const mount=()=>{
  if(embedded)return;
  const style=document.createElement('style');style.textContent='#a2a-analytics-choice{position:fixed;z-index:9999;bottom:12px;left:12px;right:12px;max-width:560px;margin:auto;background:#132b36;color:#f8f5e9;border:1px solid #92b5ae;border-radius:12px;padding:14px;box-shadow:0 5px 30px #0008;font:14px/1.45 system-ui;box-sizing:border-box}#a2a-analytics-choice p{margin:0 0 10px;color:inherit;font:inherit}#a2a-analytics-choice div{display:flex;gap:8px;align-items:center;flex-wrap:wrap}#a2a-analytics-choice button{min-height:44px;padding:8px 12px;border:1px solid #a9c3be;border-radius:7px;font:700 13px system-ui;cursor:pointer;background:#e8c56c;color:#132b36}#a2a-analytics-choice button+button{background:transparent;color:#f8f5e9}#a2a-analytics-choice a{color:#b7e8db;font:13px system-ui;padding:8px}#a2a-analytics-choice button:focus-visible,#a2a-analytics-choice a:focus-visible{outline:3px solid #fff;outline-offset:2px}';document.head.append(style);
  for(const button of document.querySelectorAll('[data-analytics-settings]'))button.addEventListener('click',choices);
  if(consent==='yes')init();else if(consent!=='no')choices();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
