/* ===== Exercices ===== */
const STH=FY-LEG+.01;
const toeA=(tx,a)=>[tx-L.ft*cos(a),FY-L.ft*sin(a)];
const ST=K({hip:[120,STH],fN:[120,FY],aN:0});
function plank(sy,hx,o){ // orteils ancrés, corps gainé ; sy = hauteur de l'épaule au-dessus du sol
  const a=55,ank=toeA(36,a),ll=LEG-.01,len=ll+L.to;
  const th=Math.asin(Math.min(1,(ank[1]-(FY-sy))/len))/D;
  const hip=[ank[0]+ll*cos(th),ank[1]-ll*sin(th)],sx=ank[0]+len*cos(th);
  return{p:K(Object.assign({hip,t:90-th,h:8,fN:ank,faN:a,faF:a,hN:[hx??sx,FY],kpN:[0,-1],kpF:[0,-1],ep:[-1,-.3]},o||{})),sx};
}
function kplank(sy,hx){ // pompes sur les genoux
  const kx=64,len=L.th+L.to,th=Math.asin(Math.min(1,sy/len))/D;
  const hip=[kx+L.th*cos(th),FY-L.th*sin(th)],sx=kx+len*cos(th),ank=[kx-L.sh*cos(35),FY-L.sh*sin(35)];
  return{p:K({hip,t:90-th,h:8,fN:ank,faN:215,faF:215,hN:[hx??sx,FY],kpN:[0,1],kpF:[0,1],ep:[-1,-.3]}),sx};
}
const pt=plank(54.9),pb=plank(20,pt.sx);
const kt=kplank(54.9),kb=kplank(20,kt.sx);
const f0=plank(28.2),fpA=plank(28.2,f0.sx+25,{ep:[-.4,1]}),fpB=plank(26.8,f0.sx+25,{ep:[-.4,1]});
const lunge=nf=>{const f=[162,FY],b=toeA(70,55);
  return K({hip:[122,142],t:6,fN:nf?f:b,fF:nf?b:f,faN:nf?0:55,faF:nf?55:0,kpN:nf?[1,0]:[1,.4],kpF:nf?[1,.4]:[1,0],aN:0})};
const mc=n=>{const b=pt.p,dr=[b.hip[0]+8,FY-1];
  return K(Object.assign({},b,{fN:n?dr:b.fN,fF:n?b.fF:dr,faN:n?0:55,faF:n?55:0,kpN:n?[1,-.3]:[0,-1],kpF:n?[0,-1]:[1,-.3]}))};
const sqH=K({hip:[92,153],t:70,h:-30,fN:[112,FY],hN:[150,FY],kpN:[1,-.6],kpF:[1,-.6]});
const air=(lift,arm,o)=>K(Object.assign({hip:[120,STH-lift],fN:[120,FY-lift],fa:35,aN:arm},o||{}));
const sq1=K({hip:[98,142],t:35,h:-12,fN:[120,FY],aN:90});
const sq0=K({hip:[120,STH],fN:[120,FY],aN:90});
const lyDown=o=>K(Object.assign({hip:[120,FT],t:-90,h:20,fN:[172,FY],kpN:[0,-1],kpF:[0,-1],aN:90},o||{}));
const bA=28,bridgeUp=K({hip:[70+50*cos(bA),FT-50*sin(bA)],t:-(90+bA),h:20+bA,fN:[172,FY],kpN:[0,-1],kpF:[0,-1],aN:90});
const rl=b=>K({hip:[130,FT],t:-90,h:20,fN:[130+LEG-.1,FT].map((v,i)=>i?FT-(LEG-.1)*sin(b):130+(LEG-.1)*cos(b)),aN:90,kpN:[0,-1],kpF:[0,-1],wt:b===85||b===0?1.4:1});
const sp=(t,b,arm,h)=>K({hip:[110,FT],t,h,fN:[110-(LEG-.1)*cos(b),FT-(LEG-.1)*sin(b)],faN:180,faF:180,kpN:[0,-1],kpF:[0,-1],aN:arm});
const chair=y=>K({hip:[71,y],fN:[109,FY],hN:[98,141],ep:[-1,.5]});
const calfUp=(()=>{const t=toeA(129,60);return K({hip:[t[0],t[1]-LEG+.01],fN:t,fa:60,aN:0})})();
const hk=n=>{const hy=STH,hx=120,up=[hx+30,hy+30],pl=[hx,FY];
  return K({hip:[hx,hy],t:4,fN:n?up:pl,fF:n?pl:up,faN:n?20:0,faF:n?0:20,aN:n?-35:50,aF:n?50:-35,rN:.6,rF:.6})};
const hkP=K({hip:[120,STH+.4],t:4,fN:[128,FY],fF:[112,FY],aN:20,aF:20,rN:.6,rF:.6});
const jj=(sp,lift,arm)=>{const ay=FY-lift;
  return K({hip:[130,ay-Math.sqrt((LEG-.02)**2-sp*sp)],fN:[130+sp,ay],fF:[130-sp,ay],faN:0,faF:180,kpN:[1,0],kpF:[-1,0],aN:arm,aF:-arm})};

/* ===== Postures du livre : gainage (profil) ===== */
const hold2=(f,a,b)=>[f(a),f(b)];
// Fente tenue : genou avant à 90°, genou arrière près du sol
const fenteK=y=>K({hip:[128,y],t:2,h:0,fN:[166,FY],fF:toeA(75.5,55),faN:0,faF:55,kpN:[1,0],kpF:[1,.4],hN:[140,y-46],ep:[-1,.3]});
// Planche de côté sur l'avant-bras (vue de profil, tête à gauche)
function sidePl(sy){
  const ax=205,ay=FY-2,len=LEG+L.to-.01,shy=FLOOR-sy,dy=ay-shy,dx=Math.sqrt(len*len-dy*dy),shx=ax-dx;
  const ux=(shx-ax)/len,uy=(shy-ay)/len,hip=[ax+LEG*ux,ay+LEG*uy];
  const t=Math.atan2((shx-hip[0])/L.to,-(shy-hip[1])/L.to)/D;
  return K({hip,t,h:6,fN:[ax,ay],fF:[ax,ay-7],faN:-10,faF:-10,kpN:[0,-1],kpF:[0,-1],hN:[shx-27,shy+28],hF:[hip[0]+3,hip[1]-7],ep:[1,1],epF:[0,-1]});
}
// Planche inversée : dos au sol, bras et jambes tendus en diagonale
const invK=b=>K({hip:[130,FT],t:-78,h:0,fN:[130+(LEG-.1)*cos(b),FT-(LEG-.1)*sin(b)],faN:-b,faF:-b,kpN:[0,-1],kpF:[0,-1],aN:-135});
// Abdos assis : assis en équilibre, genoux pliés, mains jointes devant le visage
const vsitK=k=>K({hip:[110,FT],t:-35,h:25,fN:[176,155+k],fF:[178,157+k],faN:-20,faF:-20,kpN:[0,-1],kpF:[0,-1],hN:[100,122+k],ep:[1,.2]});
// Relevé de bassin : genoux à angle droit en haut
const brK=bA=>K({hip:[70+50*cos(bA),FT-50*sin(bA)],t:-(90+bA),h:20+bA,fN:[146,FY],kpN:[0,-1],kpF:[0,-1],aN:90});
// Relevé d'épaules : appui sur les mains, face au plafond
function revPl(sy){
  const hx=80,hy=FY,sx=hx+14,shy=hy-sy,ax0=0,ay=FY-3,len=LEG+L.to-.01,dy=ay-shy,dx=Math.sqrt(len*len-dy*dy),ax=sx+dx;
  const ux=(ax-sx)/len,uy=(ay-shy)/len,hip=[sx+L.to*ux,shy+L.to*uy];
  const t=Math.atan2((sx-hip[0])/L.to,-(shy-hip[1])/L.to)/D;
  return K({hip,t,h:-12,fN:[ax,ay],fF:[ax,ay],faN:-60,faF:-60,kpN:[0,-1],kpF:[0,-1],hN:[hx,hy],hF:[hx+6,hy],ep:[-1,0]});
}
// Dorsaux / plongeon : sur le ventre, buste et jambes décollés (tête à droite)
const dorK=(t,b,arm,h)=>K({hip:[110,FT],t,h,fN:[110-(LEG-.1)*cos(b),FT-(LEG-.1)*sin(b)],faN:180,faF:180,kpN:[0,-1],kpF:[0,-1],aN:arm});

/* ===== Étirements (profil) ===== */
// Échauffement du golfeur (le bras levé et le bras vers la cheville sont alignés vu de profil)
const golfA=K({hip:[104,132],t:18,h:0,fN:[140,FY],fF:[134,FY],kpN:[1,0],kpF:[1,0],aN:25,aF:25});
const golfB=t=>K({hip:[96,160],t,h:-35,fN:[140,FY],fF:[134,FY],kpN:[1,0],kpF:[1,0],hN:[143,176],aF:180});
// À genoux (posture de l'enfant) : assis sur les talons, front au sol
const enfK=(arm)=>K({hip:[101,161],t:90,h:60,fN:[94,182.5],fF:[94,182.5],faN:180,faF:180,kpN:[1,.2],kpF:[1,.2],aN:arm,aF:arm,ep:[0,-1]});
const enfA=enfK(-90),enfB=enfK(70);
// Talon-fesse (sur le ventre, tête à droite)
const tfK=g=>K({hip:[110,FT],t:g?84:88,h:g?-18:-22,fN:g?[108,166]:[72,144],fF:[110-(LEG-.1),FT],faN:g?-90:-90,faF:180,
  kpN:[-1,.5],kpF:[0,-1],hN:g?[108,166]:null,aN:88,aF:88,rN:.85,rF:.85,ep:[0,-1]});
// Toilettes turques : accroupi, pieds à plat, buste en avant, mains au sol
const turkK=t=>K({hip:[84,162],t,h:-10,fN:[110,FY],fF:[112,FY],kpN:[1,0],kpF:[1,0],hN:[142,FY-.5],hF:[148,FY-.5],ep:[-1,.4]});
// Sur la pointe des pieds : avant-pieds sur une marche, une main au mur
const STEPX=108,STEPW=46,STEPY=172,WALLX=168;
function ptK(fa){
  const toe=[118,STEPY],ank=[toe[0]-L.ft*cos(fa),toe[1]-L.ft*sin(fa)],hy=ank[1]-LEG+.01,shy=hy-L.to;
  return K({hip:[ank[0],hy],t:3,h:0,fN:ank,fF:ank,faN:fa,faF:fa,hN:[WALLX-5,shy+7],hF:[WALLX-5,shy+7],ep:[-1,.5]});
}

/* ===== Postures libres : de face ===== */
const frK=o=>F(Object.assign({H:[130,42],N:[130,58],P:[130,108],AL:[118,FY],AR:[142,FY]},o));
const armsDown={WL:[114,111],WR:[146,111]};
const ecRelax=frK(armsDown),ecHold=frK({WL:[62.5,58],WR:[197.5,58],QL:[62.5,49],QR:[197.5,49]});
const plRelax=frK(armsDown),plHold=frK({WL:[112,10],WR:[148,10],QL:[120,10],QR:[140,10],EPL:[-1,0],EPR:[1,0]});
const cdRelax=frK(armsDown);
const cdHold=frK({WR:[122,45],WL:[118,75],EPR:[-1,1],EPL:[-1,.6]});

/* ===== Postures libres : du dessus (tête à gauche, tapis) ===== */
const tvK=o=>F(Object.assign({H:[59,100],N:[75,100],M:[100,100],P:[125,100],
  WL:[62,106],WR:[62,94],EL:[62,128],ER:[62,72],
  AL:[158,108],AR:[158,92],KL:[141,104],KR:[141,97],TL:[166,108],TR:[166,92]},o));
const crStart=tvK({});
const crEnd=tvK({KL:[138,138],KR:[136,128],AR:[152,120],TR:[158,124]});
const cbStart=tvK({WL:[52,128],WR:[52,72],EL:[70,128],ER:[70,72],KL:[163,108],AL:[200,108],TL:[209,108],KR:[163,92],AR:[200,92],TR:[209,92]});
const cbBent=tvK({H:[56,105],N:[72,103],M:[98,110],WL:[112,128],WR:[55,92],EL:[92,130],ER:[62,80],
  KL:[150,140],AL:[112,128],TL:[104,134],KR:[163,93],AR:[200,94],TR:[209,94]});
const W=(p,w)=>Object.assign({},p,{wt:w});

const hold=(a,b)=>[W(a,1),W(b||a,1)];
const GE={lv:[0,2],hold:1,lin:1,d:20,fx:1,p:4,br:.9,ki:0};
const NEWEX=[
{id:"g_fente",n:"Fente tenue",m:"Cuisses · fessiers · gainage",c:"Un grand pas, pied avant à plat. Genou avant à angle droit, genou arrière à quelques centimètres du sol, buste droit. Tu changes de côté à mi-temps.",
  hl:["legs","core"],sides:2,keys:hold(fenteK(145.5),fenteK(147)),...GE},
{id:"g_chaise",n:"Chaise contre le mur",m:"Cuisses · fessiers",c:"Dos au mur, pieds à environ 15 cm. Descends jusqu’à plier les genoux à angle droit, dos bien droit, comme assis sur une chaise imaginaire. Tiens.",
  hl:["legs"],wall:60,keys:hold(chair(145.5),chair(146.4)),...GE,br:0},
{id:"g_planche",n:"Planche avant-bras",m:"Abdos · dos · épaules",c:"Avant-bras au sol, coudes sous les épaules. Jambes, dos et tête sur la même ligne, regard vers le sol, ventre rentré. Respire : 2 s pour inspirer, 2 s pour expirer.",
  hl:["core"],keys:hold(fpA.p,fpB.p),...GE},
{id:"g_cote",n:"Planche de côté",m:"Obliques · gainage",c:"En appui sur un avant-bras, l’autre main sur la hanche. Jambes, colonne et tête alignées, regard droit devant. Respire. Tu changes de côté à mi-temps.",
  hl:["core"],sides:2,keys:hold(sidePl(31.5),sidePl(30.5)),...GE,lv:[1,2]},
{id:"g_bras",n:"Planche bras tendus",m:"Épaules · abdos · bras",c:"Comme la planche, mais bras tendus et jambes un peu écartées, en appui sur la pointe des pieds. Corps aligné, regard vers le sol.",
  hl:["core","arms"],keys:hold(pt.p,plank(54,pt.sx).p),...GE},
{id:"g_inv",n:"Planche inversée",m:"Abdos · dos",c:"Sur le dos, bras et jambes tendus à 45°, chevilles collées. Bras, tête, épaules et dos sur le même axe. Serre les fessiers. Si le bas du dos tire, change un peu les angles.",
  hl:["core","legs"],keys:hold(invK(30),invK(33)),...GE,lv:[1,2]},
{id:"g_abdos",n:"Abdos assis",m:"Abdos",c:"Assis, décolle les pieds du sol, jambes et bras pliés, mains jointes devant le visage. Respire lentement en comptant.",
  hl:["core"],keys:hold(vsitK(0),vsitK(3)),...GE,lv:[1,2]},
{id:"g_bassin",n:"Relevé de bassin",m:"Fessiers · cuisses · gainage",c:"Sur le dos, bras le long du corps, pieds écartés comme le bassin. Appuie sur les épaules et monte les fesses jusqu’à l’angle droit aux genoux. Regard au plafond.",
  hl:["legs","core"],keys:hold(brK(44),brK(45.5)),...GE},
{id:"g_epaules",n:"Relevé d’épaules",m:"Épaules · bras · dos",c:"Sur le dos, en appui sur les mains, bras tendus dans l’axe des épaules. Tête, épaules, dos et bassin alignés, regard au plafond.",
  hl:["arms","core"],keys:hold(revPl(53),revPl(51.5)),...GE,lv:[1,2]},
{id:"g_dorsaux",n:"Dorsaux",m:"Dos · fessiers",c:"Sur le ventre, bras le long du corps. Décolle buste, bras et jambes en serrant les fessiers, tête droite, regard à l’horizontale.",
  hl:["core","legs"],keys:hold(dorK(72,18,-100,18),dorK(70,16,-100,20)),...GE,br:0},
{id:"g_plongeon",n:"Plongeon à plat",m:"Dorsaux · lombaires · fessiers",c:"Sur le ventre, bras tendus devant, jambes jointes. Décolle bras et jambes, regard droit devant. Au début, tu peux ne lever que les bras ou que les jambes.",
  hl:["core","legs"],keys:hold(dorK(76,16,105,14),dorK(74,14,105,16)),...GE,br:0,lv:[1,2]}
];
const ST0={hl:[],stretch:1,fx:1};
const STRETCH=[
{id:"ecarter",n:"Écarter les murs",m:"Épaules · pectoraux",c:"Bras levés sur les côtés, poignets pliés, paumes vers l’extérieur. Pousse comme pour écarter deux murs, épaules basses, 7 secondes, puis relâche. 7 fois.",
  z:"ep",o:1,d:56,p:8,reps:7,view:"front",fields:FF_IK,keys:[W(ecRelax,1.2),W(ecHold,5),W(ecHold,.8)],ki:1,...ST0},
{id:"plafond",n:"Soulever le plafond",m:"Épaules · pectoraux",c:"Bras au-dessus de la tête, poignets pliés, paumes vers le ciel. Pousse le plafond, épaules basses, 7 secondes, puis relâche. 7 fois.",
  z:"ep",o:2,d:56,p:8,reps:7,view:"front",fields:FF_IK,keys:[W(plRelax,1.2),W(plHold,5),W(plHold,.8)],ki:1,...ST0},
{id:"coude",n:"Coude vers l’arrière",m:"Épaules",c:"Attrape ton coude avec l’autre main, lève l’épaule puis rentre-la. Pousse le coude vers l’épaule opposée, trouve la position la plus confortable et respire lentement. Puis change de bras.",
  z:"ep",o:3,d:180,sides:2,once:1,br:.7,view:"front",fields:FF_IK,keys:[W(cdRelax,.06),W(cdHold,.94),W(cdHold,1)],ki:1,...ST0},
{id:"golfeur",n:"Échauffement du golfeur",m:"Dos · rotateurs du tronc",c:"Genoux fléchis. Tourne le buste, lève un bras vers le plafond en le regardant, l’autre main vers la cheville. Tiens 7 secondes en respirant profondément, puis change de côté.",
  z:"dos",o:4,d:60,sides:2,p:10,reps:3,keys:[W(golfA,1.5),W(golfB(50),6),W(golfB(50),1.5)],ki:1,...ST0},
{id:"genoux",n:"À genoux",m:"Dos · côtes",c:"Assis sur les talons, front au sol, bras le long du corps : 1 minute. Puis tends les bras loin devant, menton rentré, dos, tête et bras alignés : 1 minute.",
  z:"dos",o:7,d:120,once:1,br:.6,keys:[W(enfA,.45),W(enfA,.05),W(enfB,.45),W(enfB,1)],ki:3,...ST0},
{id:"cravate",n:"Cravate de genoux",m:"Lombaires · fessiers",c:"Sur le dos, mains sous la nuque, lombaires au sol. Pose un genou sur l’autre et pousse-le jusqu’au sol, le pied du dessous reste posé. Le thorax ne bouge pas. 7 fois de chaque côté.",
  z:"dos",o:8,d:56,sides:2,p:4,reps:7,view:"top",fields:FF_X,flip:"v",keys:[W(crStart,1.5),W(crEnd,.5),W(crEnd,1.5)],ki:1,...ST0},
{id:"combine",n:"Raccourcissement combiné",m:"Carré des lombes · fessiers",c:"Sur le ventre, attrape ta cheville par l’arrière et incline le buste du côté de la jambe pliée. Cherche la position la plus confortable, respire lentement. Puis change de côté.",
  z:"dos",o:9,d:180,sides:2,once:1,br:.7,view:"top",fields:FF_X,flip:"v",keys:[W(cbStart,.07),W(cbBent,.93),W(cbBent,1)],ki:1,...ST0},
{id:"talonfesse",n:"Talon-fesse",m:"Cuisses (quadriceps)",c:"Sur le ventre, plie le genou et amène le talon vers la fesse, puis attrape la cheville pour accentuer. 7 secondes, 7 fois, puis change de jambe.",
  z:"jb",o:10,d:112,sides:2,p:8,reps:7,keys:[W(tfK(0),1.2),W(tfK(1),5),W(tfK(1),.8)],ki:1,...ST0},
{id:"turques",n:"Toilettes turques",m:"Cuisses · chevilles · tendon d’Achille",c:"Accroupi, pieds bien à plat, buste légèrement penché en avant, mains au sol. Respire et laisse les chevilles s’assouplir.",
  z:"jb",o:5,d:30,p:5,br:.7,lin:1,hold:1,keys:[W(turkK(58),1),W(turkK(55),1)],ki:0,...ST0},
{id:"pointes",n:"Sur la pointe des pieds",m:"Tendon d’Achille · mollets",c:"Une main au mur, avant-pieds sur une marche, talons dans le vide. Monte sur la pointe en inspirant, puis descends les talons le plus bas possible en expirant, 7 secondes. 7 fois.",
  z:"jb",o:6,d:56,p:8,reps:7,props:[[STEPX,STEPY,STEPW,FLOOR-STEPY],[WALLX-3,14,6,FLOOR-14]],keys:[W(ptK(60),1.2),W(ptK(-35),5),W(ptK(-35),.8)],ki:1,...ST0}
];

const DYN=[{id:"squat",n:"Squats",m:"Cuisses · fessiers",c:"Dos droit, genoux dans l’axe des pieds. Descends cuisses à l’horizontale.",lv:[0,2],p:3,hl:["legs"],keys:[sq0,sq1]},
{id:"fentes",n:"Fentes alternées",m:"Cuisses · fessiers",c:"Grand pas, genou arrière vers le sol, buste droit. Alterne les jambes.",lv:[0,2],p:5,rp:2,hl:["legs"],keys:[ST,lunge(true),ST,lunge(false)],ki:1},
{id:"pompes",n:"Pompes",m:"Pectoraux · triceps · gainage",c:"Corps gainé comme une planche, coudes à 45°, poitrine près du sol.",lv:[1,2],p:3.2,hl:["arms","core"],keys:[pt.p,pb.p]},
{id:"pompesg",n:"Pompes sur les genoux",m:"Pectoraux · triceps",c:"Genoux au sol, dos et bassin alignés, descends la poitrine vers le sol.",lv:[0,0],p:3.2,hl:["arms","core"],keys:[kt.p,kb.p]},
{id:"mountain",n:"Mountain climbers",m:"Abdos · épaules · cardio",c:"Mains sous les épaules, ramène les genoux vers la poitrine en alternant.",lv:[1,2],p:1,rp:2,hl:["core","legs"],keys:[mc(true),mc(false)]},
{id:"burpees",n:"Burpees",m:"Corps entier · cardio",c:"Accroupi, planche, retour, puis saute les bras en l’air.",lv:[2,2],p:3.6,hl:["legs","arms","core"],air:1,keys:[Object.assign({},ST,{wt:.8}),Object.assign({},sqH,{wt:.5}),Object.assign({},pt.p,{wt:.5}),Object.assign({},sqH,{wt:.7}),air(26,165,{wt:.6})],ki:2},
{id:"crunch",n:"Crunchs",m:"Abdominaux",c:"Menton relevé, enroule les épaules vers le bassin, souffle en montant.",lv:[0,2],p:2.4,hl:["core"],keys:[lyDown(),lyDown({t:-55,h:6})],ki:1},
{id:"releve",n:"Relevés de jambes",m:"Abdos bas",c:"Bas du dos plaqué au sol, jambes tendues, redescends sans poser les talons.",lv:[1,2],p:3.6,lin:1,hl:["core","legs"],keys:[0,30,60,85,60,30].map(rl),ki:3},
{id:"mollets",n:"Montées sur pointes",m:"Mollets",c:"Monte sur la pointe des pieds, marque une courte pause en haut.",lv:[0,2],p:2.2,hl:["legs"],keys:[ST,calfUp],ki:1},
{id:"highknees",n:"Montées de genoux",m:"Cuisses · cardio",c:"Genoux à hauteur du bassin, bras qui accompagnent, reste léger.",lv:[0,2],p:.8,rp:2,hl:["legs"],keys:[hk(true),hkP,hk(false),hkP]},
{id:"jj",n:"Jumping jacks",m:"Corps entier · cardio",c:"Écarte jambes et bras en sautant, referme en revenant.",lv:[0,2],p:1.2,air:1,hl:["arms","legs"],keys:[jj(7,0,10),jj(20,13,85),jj(34,0,160),jj(20,13,85)],ki:2},
{id:"squatjump",n:"Squats sautés",m:"Cuisses · explosivité",c:"Descends, puis explose vers le haut. Reçois-toi en souplesse.",lv:[1,2],p:1.8,air:1,hl:["legs"],keys:[Object.assign({},sq1,{aN:-40,wt:.7}),air(26,150,{wt:1.1})],ki:0}];
const EX=[...DYN,...NEWEX,...STRETCH];
EX.forEach(e=>{if(!e.fields)e.fields=FIELDS});
const EXM=Object.fromEntries(EX.map(e=>[e.id,e]));
