/* ===== Exercices ajoutés : variété (poses de profil dessinées pour l'appli) ===== */
// Talons-fesses : course sur place, le talon vient près des fessiers
const tfk=n=>{const pl=[120,FY],kick=[107,115];
  return K({hip:[120,STH-1],t:4,fN:n?kick:pl,fF:n?pl:kick,faN:n?100:0,faF:n?0:100,kpN:n?[0,1]:[1,0],kpF:n?[1,0]:[0,1],aN:n?-35:50,aF:n?50:-35,rN:.6,rF:.6})};
const tfP=K({hip:[120,STH+.4],t:4,fN:[128,FY],fF:[112,FY],aN:20,aF:20,rN:.6,rF:.6});
// Boxe dans le vide : garde basse, un bras part droit devant, l'autre protège le menton
const bxk=n=>{const t=10,hy=112,sx=118+L.to*sin(t),sy=hy-L.to*cos(t),g=[sx+10,sy-4],p=[sx+ARM-2,sy-1];
  return K({hip:[118,hy],t,h:-2,fN:[138,FY],fF:[102,FY],kpN:[1,0],kpF:[1,0],hN:n?p:g,hF:n?g:p,ep:[0,1],epF:[0,1]})};
const bxG=(()=>{const t=10,hy=112,sx=118+L.to*sin(t),sy=hy-L.to*cos(t),g=[sx+10,sy-4];
  return K({hip:[118,hy],t,h:-2,fN:[138,FY],fF:[102,FY],kpN:[1,0],kpF:[1,0],hN:g,hF:g,ep:[0,1],epF:[0,1]})})();
// Fente arrière : le pied avant reste en place, la jambe arrière recule
const rlg=nf=>{const f=[120,FY],b=toeA(28,55);
  return K({hip:[80,142],t:6,fN:nf?f:b,fF:nf?b:f,faN:nf?0:55,faF:nf?55:0,kpN:nf?[1,0]:[1,.4],kpF:nf?[1,.4]:[1,0],aN:0})};
// Squat avec pause en bas
const sqPause=[Object.assign({},sq0,{wt:.9}),Object.assign({},sq1,{wt:.9}),Object.assign({},sq1,{wt:1.4})];
// Planche montée-descente : avant-bras, puis mains
const pdA=Object.assign({},fpA.p,{wt:1}),pdB=Object.assign({},pt.p,{wt:1});
// Corde à sauter imaginaire
const crBase=K({hip:[120,STH],fN:[120,FY],aN:55,rN:.55}),crUp=air(14,55,{rN:.55,fa:35});

const MORE=[
{id:"talonsfesses",n:"Talons-fesses",m:"Cuisses · cardio",c:"Cours sur place en ramenant chaque talon vers les fessiers. Reste léger sur l’avant des pieds.",lv:[0,2],p:.8,rp:2,hl:["legs"],keys:[tfk(true),tfP,tfk(false),tfP],ki:0},
{id:"boxe",n:"Boxe dans le vide",m:"Épaules · bras · cardio",c:"Genoux souples, poings près du menton. Envoie un bras puis l’autre droit devant, en tournant légèrement les épaules.",lv:[0,2],p:1,rp:2,hl:["arms","core"],keys:[bxk(true),bxG,bxk(false),bxG],ki:0},
{id:"fentearr",n:"Fentes arrière",m:"Cuisses · fessiers",c:"Recule une jambe, genou arrière vers le sol, buste droit. Reviens debout et alterne.",lv:[0,2],p:5,rp:2,hl:["legs"],keys:[ST,rlg(true),ST,rlg(false)],ki:1},
{id:"sqpause",n:"Squats avec pause",m:"Cuisses · fessiers",c:"Descends cuisses à l’horizontale, marque une pause d’une seconde en bas, puis remonte en poussant dans les talons.",lv:[0,2],p:4.2,hl:["legs"],keys:sqPause,ki:1},
{id:"planchemd",n:"Planche montée-descente",m:"Abdos · épaules · triceps",c:"En planche sur les avant-bras, pose une main puis l’autre pour te hisser sur les mains, puis redescends. Garde le corps aligné.",lv:[1,2],p:4,hl:["arms","core"],keys:[pdA,pdB],ki:1},
{id:"corde",n:"Corde à sauter imaginaire",m:"Mollets · cardio",c:"Petits sauts légers sur l’avant des pieds, poignets qui tournent comme avec une corde. Reçois-toi en souplesse.",lv:[0,2],p:.5,air:1,hl:["legs"],keys:[crBase,crUp],ki:0}
];
MORE.forEach(e=>{if(!e.fields)e.fields=FIELDS;EX.push(e);EXM[e.id]=e});
