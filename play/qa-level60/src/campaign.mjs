// Two chapters, four checkpoint stages each. Environment ids refer to existing
// approved art; stageKey is the unique progression/save identity.
export function buildCampaign({rally,studio}) {
 const streetScenery = {
   'the-block': [['nyc-lamp',80,82,330],['scenery-pantry-night',305,195,218],['scenery-planter-night',1200,165,150],['nyc-lamp',1740,82,330]],
   'eviction-row': [['nyc-lamp',120,82,330],['scenery-kiosk-night',680,175,210],['scenery-planter-night',1480,165,150],['nyc-lamp',2090,82,330],['scenery-kiosk-night',2670,175,210]],
   'the-checkpoint': [['scenery-bus-stop-night',330,280,280],['nyc-lamp',850,82,330],['scenery-kiosk-night',1610,175,210],['nyc-lamp',2290,82,330]],
   'landlords-rally': [['nyc-lamp',100,82,330],['scenery-planter-night',590,165,150],['nyc-lamp',1850,82,330],['scenery-planter-night',2120,165,150]]
 };
 const wave=(at,kinds,hint='')=>({at,hint,group:kinds.map((kind,i)=>({kind,dx:60+i*180,y:495+(i%3)*60}))});
 const stage=(base,key,name,chapter,part,length,waves,citizens,extra={})=>({
   ...base,stageKey:key,name,chapter,part,length,waves,citizens,panel:null,
   architecture:({'the-block':'block-facade','eviction-row':'eviction-facade','the-checkpoint':'checkpoint-facade','landlords-rally':'rally-facade'})[key]||null,
   chapterEnd:part===4,policy:part===4?base.policy:'CHECKPOINT REACHED',
   line:`Chapter ${chapter} · ${part}/4 · ${name}`,clear:'Checkpoint reached.',
   pickups:base.pickups.filter(p=>p.x<length-200),props:base.props.filter(p=>p.x<length-200),
   scenery:streetScenery[key]?.map(([art,x,w,h])=>({art,x,y:459,w,h})) || (base.scenery||[]).filter(p=>p.x<length-100),...extra
 });
 return [
 stage(rally,'the-block','The Block',1,1,2600,[
   wave(400,['ice_bro'],'Sidestep, then punish the missed swing.'),
   wave(900,['ice_bro','ice_bro'],'Throw one into the other.'),
   wave(1700,['ice_bro','ice_bro','ice_bro'],'Keep the neighbors safe.')
 ],[{kind:'hungry',x:300,y:610},{kind:'evicted',x:740,y:500},{kind:'worker',x:1450,y:620}]),
 stage(rally,'eviction-row','Eviction Row',1,2,3000,[
   wave(400,['giuliani'],'Bait the briefcase swing. Hit during recovery.'),
   wave(1100,['ice_bro','giuliani']),wave(2100,['ice_bro','ice_bro','cruz'])
 ],[{kind:'witness',x:300,y:560},{kind:'evicted',x:950,y:500},{kind:'hungry',x:1780,y:610}]),
 stage(rally,'the-checkpoint','The Checkpoint',1,3,2700,[
   wave(420,['ice_bro','ice_bro']),wave(1100,['bovino'],'Interrupt the canister before it leaves his hand.'),
   wave(1850,['ice_bro','ice_bro'])
 ],[{kind:'sick',x:300,y:600},{kind:'worker',x:1900,y:620}]),
 stage(rally,'landlords-rally',"The Landlord’s Rally",1,4,2300,[
   wave(420,['ice_bro','ice_bro']),
   {at:1050,boss:true,bossName:'The Landlord',group:[{kind:'trump',dx:180,y:550}],
    support:{kind:'vance',delay:9,hpFraction:.78}}
 ],[{kind:'witness',x:300,y:560}],{panel:'p27'}),
 stage(studio,'station-exterior','Outside the Station',2,1,3400,[
   wave(420,['ice_bro','beck'],'The second swing is the trap. Wait, then counter.'),
   wave(1200,['bovino'],'Interrupt the canisters before they leave his hands.'),
   wave(2250,['ice_bro','ice_bro','beck'],'Use a throw to make room for the witness.')
 ],[{kind:'worker',x:300,y:600},{kind:'witness',x:900,y:610}],{setArt:'station',planes:[],scenery:[
   {art:'debate-camera',x:680,y:475,w:90},{art:'nyc-lamp',x:1500,y:459,w:82},{art:'debate-camera',x:2850,y:475,w:95}
 ]}),
 stage(studio,'spin-room','The Spin Room',2,2,2800,[
   wave(420,['beck','ice_bro']),wave(1100,['greene','ice_bro'],'Break the relays; the operator is out of reach.'),
   wave(1950,['beck','ice_bro','ice_bro'])
 ],[{kind:'sick',x:300,y:600},{kind:'hungry',x:1700,y:620}],{setArt:'spin',indoor:true,planes:[],props:[],scenery:[
   {art:'debate-camera',x:670,y:472,w:90},{art:'debate-lectern-blue',x:1650,y:466,w:100}
 ]}),
 stage(studio,'empty-lectern','Backstage Security',2,3,2900,[
   wave(420,['ice_bro','ice_bro']),
   wave(1050,['beck','ice_bro'],'Wait out the second swing, then counter.'),
   {at:1850,boss:true,bossName:'Backstage Security',hint:'Watch the transformation. Give the landing room, then counter.',group:[{kind:'pete',dx:180,y:550}]}
 ],[{kind:'witness',x:300,y:560},{kind:'worker',x:1500,y:610}],{setArt:'backstage',indoor:true,planes:[],scenery:[
   {art:'debate-camera',x:760,y:470,w:90},{art:'debate-camera',x:2440,y:470,w:95}
 ]}),
 stage(studio,'live-debate','Live Debate',2,4,2300,[
   wave(420,['ice_bro','ice_bro']),
   {at:1000,boss:true,bossName:'Live Debate',group:[{kind:'rogers',dx:200,y:560}]}
 ],[{kind:'witness',x:300,y:560}],{panel:'p37',id:'debate',indoor:true,setArt:'spin',planes:[],signs:[],marks:[],props:[],scenery:[
   {art:'debate-lectern-blue',x:1175,y:449,w:105},
   {art:'debate-lectern-red',x:2070,y:449,w:105},
   {art:'debate-camera',x:2190,y:449,w:75}
 ]})
 ];
}
