/* ===== Programme et interface ===== */
const $=id=>document.getElementById(id);
const LV=[
  {n:"Débutant",w:30,r:20,t:1.25,g:.75,d:"30 s d’effort, 20 s de repos, rythme posé. Tenues du livre raccourcies."},
  {n:"Intermédiaire",w:40,r:15,t:1,g:1,d:"40 s d’effort, 15 s de repos. Tenues du livre à 20 s."},
  {n:"Avancé",w:45,r:10,t:.85,g:1.25,d:"45 s d’effort, 10 s de repos, rythme soutenu. Tenues du livre allongées."}];
const FOC=[["full","Corps entier"],["haut","Haut du corps"],["bas","Bas du corps"],["abdos","Abdos & gainage"],["cardio","Cardio"]];
const POOL={
  full:["squat","pompesg","pompes","g_planche","fentes","boxe","g_cote","mountain","fentearr","g_bassin","jj","planchemd","g_dorsaux","burpees","sqpause","crunch","squatjump","talonsfesses","g_chaise"],
  haut:["pompesg","pompes","g_planche","boxe","g_bras","g_epaules","planchemd","g_cote","g_dorsaux","mountain","burpees","jj"],
  bas:["squat","fentes","fentearr","g_fente","g_chaise","sqpause","g_bassin","mollets","squatjump","highknees","talonsfesses","corde"],
  abdos:["g_planche","g_cote","crunch","g_abdos","g_inv","mountain","planchemd","releve","g_bassin","g_dorsaux","g_plongeon"],
  cardio:["jj","highknees","boxe","squat","talonsfesses","fentes","squatjump","corde","mountain","burpees"]};
const STZ={full:["ep","dos","jb"],haut:["ep","dos"],bas:["jb","dos"],abdos:["dos","ep"],cardio:["jb","dos"]};
const STP={ep:["ecarter","plafond","coude"],dos:["golfeur","genoux","cravate","combine"],jb:["turques","pointes","talonfesse"]};
const STN=[[0,"Sans"],[1,"Court, 5 min"],[2,"Complet, 10 min"]];
const DURS=[10,15,20,30,45];
/* "Exercices" : un ou deux types au choix (corps entier est exclusif) */
const FOCS=c=>[].concat(c.focus).filter(f=>POOL[f]).slice(0,2);
const poolOf=c=>{const f=FOCS(c);if(f.length<2)return POOL[f[0]||"full"];const a=POOL[f[0]],b=POOL[f[1]],o=[];
  for(let i=0;i<Math.max(a.length,b.length);i++){if(a[i]&&!o.includes(a[i]))o.push(a[i]);if(b[i]&&!o.includes(b[i]))o.push(b[i])}return o};
const zonesOf=c=>[...new Set(FOCS(c).flatMap(f=>STZ[f]))];
let CFG={dur:20,lvl:1,focus:["full"],warm:1,rs:1,st:1,mu:1,vx:1,nat:"ruisseau",vol:80,pn:{}};
try{const s=JSON.parse(localStorage.getItem("spc-cfg")||"null");
  if(s&&DURS.includes(s.dur)&&LV[s.lvl]&&FOCS(s).length)CFG={dur:s.dur,lvl:s.lvl,focus:FOCS(s).includes("full")?["full"]:FOCS(s),warm:s.warm?1:0,rs:s.rs===0?0:1,st:[0,1,2].includes(s.st)?s.st:1,mu:s.mu===0?0:1,vx:s.vx===0?0:1,nat:["ruisseau","pluie","foret"].includes(s.nat)?s.nat:"ruisseau",vol:s.vol>=0&&s.vol<=100?+s.vol:80,pn:Object.fromEntries(ZONES.map(z=>[z.k,s.pn&&[1,2].includes(s.pn[z.k])?s.pn[z.k]:0]).filter(x=>x[1]))}}catch(e){}

const okEx=(id,pn)=>{const t=EXM[id].pn;return ZONES.every(z=>{const L=(pn||{})[z.k]||0,l=t[z.k]||0;return !(L&&l&&l+L>=3)})};
const ALLP=[...new Set(Object.values(POOL).flat())];
const gdur=(id,lvl)=>{const e=EXM[id];if(!e.hold||!e.d)return LV[lvl].w;return Math.round(e.d*LV[lvl].g/5)*5*(e.sides||1)};
/* --- variété : graine aléatoire + mémoire des 5 dernières séances de chaque profil --- */
let SEED=(Math.random()*2147483647)|0;
const newSeed=()=>{let n;do{n=(Math.random()*2147483647)|0}while(n===SEED);return n};
const mulb=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
function vctx(seed){
  const rnd=mulb(seed),P=typeof curP==="function"&&curP(),h=(P&&P.hist)||[],key=new Map();
  const age=id=>{for(let k=h.length-1,a=1;k>=0;k--,a++)if(h[k].includes(id))return a;return 6};
  return{rnd,sc:id=>{if(!key.has(id))key.set(id,Math.min(age(id),6)+rnd()*2.5);return key.get(id)},
    shuf:a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}};
}
function stretchPlan(c,X){
  if(!c.st)return{ids:[],total:0};
  const cap=Math.min(c.st===1?300:600,Math.floor(c.dur*60*.4)),zs=zonesOf(c),q=zs.map(z=>STP[z].filter(id=>okEx(id,c.pn)).sort((a,b)=>X.sc(b)-X.sc(a))),ids=[];
  let tot=10,more=true;
  while(more){more=false;
    for(const l of q){while(l.length){const id=l.shift(),d=EXM[id].d+5;if(tot+d<=cap){ids.push(id);tot+=d;more=true;break}}}}
  ids.sort((a,b)=>EXM[a].o-EXM[b].o);
  return{ids,total:ids.length?ids.reduce((a,id)=>a+EXM[id].d,0)+10+5*(ids.length-1):0};
}
function build(c,seed){
  const lv=LV[c.lvl],steps=[],X=vctx(seed===undefined?SEED:seed);
  const lvOk=id=>c.lvl>=EXM[id].lv[0]&&c.lvl<=EXM[id].lv[1];
  const RS=c.rs===0?0:lv.r;
  const base=poolOf(c).filter(lvOk),fs=FOCS(c);
  let ids=base.filter(id=>okEx(id,c.pn)),filled=false;
  const dropped=base.filter(id=>!ids.includes(id));
  if(ids.length<4){for(const id of ALLP)if(ids.length<4&&!ids.includes(id)&&lvOk(id)&&okEx(id,c.pn)){ids.push(id);filled=true}}
  if(ids.length<2)return{steps:[],impossible:true,ids:[],warm:[],counts:[],stretch:[],stTotal:0,total:0,efforts:0,cl:0,rounds:0,dropped,filled};
  const warm=c.warm?X.shuf(["jj","squat","highknees"]).filter(id=>okEx(id,c.pn)):[];
  const sp=stretchPlan(c,X);
  const budget=c.dur*60-sp.total-(warm.length?warm.length*40+10:0)-5;
  const cl=Math.min(c.dur<=12?4:c.dur<=25?6:8,ids.length);
  if(ids.length>cl){
    const cat=id=>{const hl=EXM[id].hl;return hl.includes("arms")?"h":hl.includes("legs")?"b":"c"};
    const wp=id=>X.sc(id)-(warm.includes(id)?2.5:0),srt=[...ids].sort((a,b)=>wp(b)-wp(a)),cnt={},sel=[],cap=fs.length>1||fs[0]==="full"?Math.ceil(cl/2):cl,gk=id=>fs.length>1?fs.findIndex(f=>POOL[f].includes(id)):cat(id);
    for(const id of srt){if(sel.length>=cl)break;const k=gk(id);if((cnt[k]||0)<cap){sel.push(id);cnt[k]=(cnt[k]||0)+1}}
    for(const id of srt){if(sel.length>=cl)break;if(!sel.includes(id))sel.push(id)}
    ids=ids.filter(id=>sel.includes(id));
  }
  {const o=Math.floor(X.rnd()*ids.length);ids=[...ids.slice(o),...ids.slice(0,o)]}
  steps.push({k:"rest",ex:warm[0]||ids[0],s:5,lab:"Prépare-toi"});
  warm.forEach(id=>steps.push({k:"warm",ex:id,s:40,lab:"Échauffement"}));
  if(warm.length&&RS)steps.push({k:"rest",ex:ids[0],s:10,lab:"Repos"});
  let acc=0,n=0;const counts=ids.slice(0,cl).map(()=>0);
  for(;;){
    const id=ids[n%cl],d=gdur(id,c.lvl),need=(n?RS:0)+d;
    if(n>=2&&acc+need>budget+15)break;
    if(n&&RS){steps.push({k:"rest",ex:id,s:RS,lab:"Repos"})}
    steps.push({k:"effort",ex:id,s:d,lab:"Effort",rd:Math.floor(n/cl)+1,n:n%cl+1});
    counts[n%cl]++;acc+=need;n++;
    if(n>400)break;
  }
  if(sp.ids.length){
    steps.push({k:"rest",ex:sp.ids[0],s:10,lab:"Retour au calme"});
    sp.ids.forEach((id,j)=>{
      if(j)steps.push({k:"rest",ex:id,s:5,lab:"Prochain étirement"});
      steps.push({k:"stretch",ex:id,s:EXM[id].d,lab:"Étirement"});
    });
  }
  let t=0;steps.forEach(s=>{s.at=t;t+=s.s});
  return{steps,rounds:Math.ceil(n/cl),cl,ids:ids.slice(0,cl),warm,total:t,efforts:n,counts,stretch:sp.ids,stTotal:sp.total,dropped,filled};
}

/* --- profils (stockés uniquement sur l'appareil) --- */
const cleanPn=x=>Object.fromEntries(ZONES.map(z=>[z.k,x&&[1,2].includes(x[z.k])?x[z.k]:0]).filter(e=>e[1]));
const num=v=>{v=+v;return isFinite(v)&&v>0?v:0};
const cleanP=o=>({id:String(o.id||"p"+Date.now()).slice(0,16),n:String(o.n||"").slice(0,20),sx:o.sx==="f"||o.sx==="h"?o.sx:"",a:num(o.a),h:num(o.h),w:num(o.w),lvl:LV[o.lvl]?o.lvl:1,pn:cleanPn(o.pn),hist:Array.isArray(o.hist)?o.hist.slice(-5).map(a=>Array.isArray(a)?a.filter(id=>EXM[id]).slice(0,40):[]):[]});
let PROF=null;
try{const s=JSON.parse(localStorage.getItem("spc-prof")||"null");if(s&&Array.isArray(s.list)&&s.list.length){PROF={cur:s.cur,list:s.list.slice(0,8).map(cleanP)}}}catch(e){}
if(!PROF)PROF={cur:"p1",list:[cleanP({id:"p1",n:"Moi",pn:CFG.pn,lvl:CFG.lvl})]};
if(!PROF.list.some(p=>p.id===PROF.cur))PROF.cur=PROF.list[0].id;
const curP=()=>PROF.list.find(p=>p.id===PROF.cur);
CFG.pn=curP().pn;CFG.lvl=curP().lvl;
function save(){const p=curP();p.pn=CFG.pn;p.lvl=CFG.lvl;try{localStorage.setItem("spc-cfg",JSON.stringify(CFG));localStorage.setItem("spc-prof",JSON.stringify(PROF))}catch(e){}}
const minor=p=>p.a>0&&p.a<18;
const kcalOk=p=>p.sx&&p.a>=18&&p.a<=99&&p.h>=120&&p.h<=220&&p.w>=30&&p.w<=250;
/* Dépense = MET (Compendium of Physical Activities) × métabolisme de repos horaire (Mifflin-St Jeor). Estimation à ± 20 %. */
const MET={rest:1.5,zen:2.3,cardio:7.5,warm:5,stat:2.8,force:3.8};
function kcalOf(p,steps,upTo,part){
  if(!kcalOk(p))return null;
  const rmr=(10*p.w+6.25*p.h-5*p.a+(p.sx==="h"?5:-161))/24;let tot=0,sec=0;
  steps.forEach((st,i)=>{const d=i<upTo?st.s:i===upTo?Math.min(st.s,part):0;if(d<=0)return;tot+=MET[akind(st,EXM[st.ex])]*rmr*d/3600;sec+=d});
  return{tot,rest:rmr*sec/3600};
}
const r5=x=>Math.max(5,Math.round(x/5)*5);
function kcalTxt(p,k){
  if(minor(p))return"Pas de calories affichées pour les moins de 18 ans.";
  if(!k)return"Renseigne sexe, âge, taille et poids pour estimer la dépense en calories.";
  return"Dépense estimée : environ "+r5(k.tot)+" kcal (à ± 20 %), dont "+r5(k.rest)+" que tu aurais dépensées au repos.";
}
let pdT=0;
function renderProf(){
  const p=curP();
  chips("c-prof",[...PROF.list.map(q=>[q.id,q.n||"Sans nom"]),...(PROF.list.length<8?[["+","＋ Ajouter"]]:[])],v=>v===PROF.cur,v=>{
    if(v==="+"){const q=cleanP({id:"p"+Date.now(),n:"Profil "+(PROF.list.length+1),lvl:CFG.lvl});PROF.list.push(q);PROF.cur=q.id}else PROF.cur=v;
    CFG.pn=curP().pn;CFG.lvl=curP().lvl});
  chips("c-sx",[["f","Femme"],["h","Homme"]],v=>v===p.sx,v=>{p.sx=v});
  $("f-n").value=p.n;$("f-a").value=p.a||"";$("f-h").value=p.h||"";$("f-w").value=p.w||"";
  $("h-prof").textContent=minor(p)?"Moins de 18 ans : la séance est adaptée aux critères choisis, sans calcul de calories.":"Âge, taille et poids servent uniquement à estimer les calories (adultes). Ces données restent sur cet appareil.";
  const d=$("b-pdel");d.disabled=PROF.list.length<2;d.textContent="Supprimer ce profil";
}
["f-n","f-a","f-h","f-w"].forEach(id=>$(id).addEventListener("input",()=>{
  const p=curP();p.n=$("f-n").value.slice(0,20);p.a=num($("f-a").value);p.h=num($("f-h").value);p.w=num($("f-w").value);save();
  const nm=document.querySelector("#c-prof .chip[aria-pressed='true']");if(nm)nm.textContent=p.n||"Sans nom";
  $("h-prof").textContent=minor(p)?"Moins de 18 ans : la séance est adaptée aux critères choisis, sans calcul de calories.":"Âge, taille et poids servent uniquement à estimer les calories (adultes). Ces données restent sur cet appareil.";
  renderSetup(true)}));
$("b-pdel").onclick=()=>{const d=$("b-pdel");
  if(!pdT){pdT=setTimeout(()=>{pdT=0;d.textContent="Supprimer ce profil"},3000);d.textContent="Touche encore pour confirmer";return}
  clearTimeout(pdT);pdT=0;PROF.list=PROF.list.filter(q=>q.id!==PROF.cur);PROF.cur=PROF.list[0].id;CFG.pn=curP().pn;CFG.lvl=curP().lvl;save();renderSetup()};
const thumb=ex=>`<svg viewBox="0 0 260 200" aria-hidden="true">${render(ex,sAtKey(ex,ex.ki??1),0,0)}</svg>`;
const row=(ex,right,cls)=>`<li class="${cls||""}"><div class="th">${thumb(ex)}</div><div><b>${ex.n}</b><span>${ex.m}</span></div><em>${right}</em></li>`;

function chips(id,items,isOn,pick){
  const box=$(id);box.innerHTML="";
  items.forEach(([v,label])=>{const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=label;
    b.setAttribute("aria-pressed",isOn(v));b.onclick=()=>{pick(v);save();renderSetup()};box.appendChild(b)});
}

const PLV=["aucune","gêne","douleur"];
function bodyHTML(){
  const lv=k=>CFG.pn[k]||0;
  const sil=o=>`<circle class="sh" cx="${55+o}" cy="22" r="13"/><g class="sil"><line x1="${55+o}" y1="34" x2="${55+o}" y2="46" style="stroke-width:9"/><line x1="${28+o}" y1="54" x2="${82+o}" y2="54" style="stroke-width:15"/><line x1="${55+o}" y1="52" x2="${55+o}" y2="112" style="stroke-width:34"/><line x1="${27+o}" y1="58" x2="${20+o}" y2="108" style="stroke-width:10"/><line x1="${83+o}" y1="58" x2="${90+o}" y2="108" style="stroke-width:10"/><line x1="${45+o}" y1="118" x2="${43+o}" y2="190" style="stroke-width:15"/><line x1="${65+o}" y1="118" x2="${67+o}" y2="190" style="stroke-width:15"/></g>`;
  const Zs={ep:[[28,56,12,11],[82,56,12,11]],po:[[20,108,9,9],[90,108,9,9]],ge:[[43,152,11,11],[67,152,11,11]],ce:[[185,38,11,10]],lo:[[185,98,21,13]],ac:[[172,180,9,9],[198,180,9,9]]};
  let z="";
  for(const Z of ZONES){const L=lv(Z.k);
    z+=`<g class="zg" data-z="${Z.k}" data-lv="${L}" tabindex="0" role="button" aria-label="${Z.n} : ${PLV[L]}">${Zs[Z.k].map(([x,y,rx,ry])=>`<ellipse class="zh" cx="${x}" cy="${y}" rx="${rx+7}" ry="${ry+7}"/><ellipse class="zn" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join("")}<title>${Z.n}</title></g>`}
  return `<svg class="body" viewBox="0 0 240 205" role="group" aria-label="Silhouette, de face et de dos">${sil(0)}${sil(130)}<text x="55" y="203" text-anchor="middle">Face</text><text x="185" y="203" text-anchor="middle">Dos</text>${z}</svg>`;
}
function cycZone(k){
  const n=((CFG.pn[k]||0)+1)%3;if(n)CFG.pn[k]=n;else delete CFG.pn[k];
  save()
  renderSetup();const g=document.querySelector(`.zg[data-z="${k}"]`);if(g)g.focus({preventScroll:true});
}
function renderPain(){
  $("c-body").innerHTML=bodyHTML();
  $("c-body").querySelectorAll(".zg").forEach(g=>{g.onclick=()=>cycZone(g.dataset.z);g.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();cycZone(g.dataset.z)}}});
  const box=$("c-pn");box.innerHTML="";
  ZONES.forEach(z=>{const L=CFG.pn[z.k]||0,b=document.createElement("button");b.type="button";b.className="chip pz";b.dataset.lv=L;
    b.innerHTML=`${z.n}<small>${PLV[L]}</small>`;b.onclick=()=>cycZone(z.k);box.appendChild(b)});
}

function renderSetup(keep){
  const lv0=LV[CFG.lvl];
  chips("c-dur",DURS.map(d=>[d,d+" min"]),v=>v===CFG.dur,v=>CFG.dur=v);
  chips("c-lvl",LV.map((l,i)=>[i,l.n]),v=>v===CFG.lvl,v=>CFG.lvl=v);
  chips("c-focus",FOC,v=>FOCS(CFG).includes(v),v=>{const cur=FOCS(CFG);let n;
    if(v==="full")n=["full"];else{n=cur.filter(x=>x!=="full");if(n.includes(v)){if(n.length>1)n=n.filter(x=>x!==v)}else{n.push(v);if(n.length>2)n.shift()}}
    CFG.focus=n});
  chips("c-rs",[[1,"Avec repos"],[0,"Sans repos"]],v=>v===CFG.rs,v=>CFG.rs=v);
  $("h-rs").textContent=CFG.rs?"Repos de "+lv0.r+" s entre les exercices (selon le niveau).":"Les exercices s’enchaînent sans pause : le coach annonce le suivant pendant l’effort.";
  chips("c-warm",[[1,"Avec, 2 min"],[0,"Sans"]],v=>v===CFG.warm,v=>CFG.warm=v);
  chips("c-st",STN,v=>v===CFG.st,v=>CFG.st=v);
  chips("c-mu",[[1,"Avec"],[0,"Sans"]],v=>v===CFG.mu,v=>CFG.mu=v);
  chips("c-vx",[[1,"Avec"],[0,"Sans"]],v=>v===CFG.vx,v=>{CFG.vx=v;if(!v)SND.cancel()});
  chips("c-nat",[["ruisseau","Ruisseau"],["pluie","Pluie"],["foret","Forêt"]],v=>v===CFG.nat,v=>CFG.nat=v);
  $("vol").value=CFG.vol;$("vol-o").textContent=CFG.vol+" %";
  $("h-vx").textContent=SND.hasVoice()?"La voix annonce chaque exercice et résume la consigne. C’est la voix de ton téléphone.":"La voix n’est pas disponible sur cet appareil ou ce navigateur.";
  $("h-lvl").textContent=LV[CFG.lvl].d;
  if(!keep)renderProf();
  renderPain();
  const b=build(CFG),lv=LV[CFG.lvl],anyPn=Object.keys(CFG.pn).length>0;
  $("b-start").disabled=!!b.impossible;
  $("h-adapt").textContent=b.impossible?"Avec toutes ces zones, aucun exercice n’est proposé. Retire une zone, ou vois un professionnel de santé."
    :anyPn?(b.dropped.length?"Adapté à tes douleurs : retiré "+b.dropped.map(id=>EXM[id].n.toLowerCase()).join(", ")+(b.filled?". Complété avec des exercices d’autres zones.":"."):"Adapté à tes douleurs : rien à retirer dans cette zone."):"";
  $("h-adapt").style.color=b.impossible?"var(--pain2)":"";
  if(b.impossible){$("h-kcal").textContent="";$("plan").innerHTML="";$("list").innerHTML="";$("t-st").hidden=$("list-st").hidden=true;return}
  $("h-st").textContent=CFG.st?"Étirements tirés du livre d’ostéopathie, choisis selon la zone travaillée.":"Pas d’étirements en fin de séance.";
  $("plan").innerHTML=`<div class="st"><b>${Math.round(b.total/60)}</b><span>minutes au total</span></div>`
    +`<div class="st"><b>${b.efforts}</b><span>efforts, circuit de ${b.cl} exercices</span></div>`
    +(b.stTotal?`<div class="st"><b>${Math.round(b.stTotal/60)}</b><span>minutes d’étirements</span></div>`:`<div class="st"><b>${lv.w}/${CFG.rs?lv.r:0}</b><span>secondes effort / repos</span></div>`);
  $("list").innerHTML=b.warm.map(id=>row(EXM[id],"40 s","w")).join("")+b.ids.map((id,j)=>row(EXM[id],"× "+b.counts[j]+(EXM[id].hold?" · "+gdur(id,CFG.lvl)+" s":""))).join("");
  $("h-kcal").textContent=kcalTxt(curP(),kcalOf(curP(),b.steps,b.steps.length,0));
  $("t-st").hidden=$("list-st").hidden=!b.stretch.length;
  $("list-st").innerHTML=b.stretch.map(id=>row(EXM[id],fmt(EXM[id].d),"s")).join("");
}

/* --- séance --- */
let B=null,S=null,raf=0,snd=true,wake=null,quitT=0;
const IC={
  pause:'<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>',
  play:'<svg viewBox="0 0 24 24"><path d="M7 4.5l12 7.5-12 7.5z"/></svg>',
  on:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 010 7"/></svg>',
  off:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6"/></svg>'};
const beep=(f,d)=>{if(snd)SND.beep(f,d)};
const CARD=["jj","highknees","burpees","mountain","squatjump","talonsfesses","boxe","corde"];
const akind=(st,ex)=>st.k==="rest"?"rest":st.k==="stretch"?"zen":st.k==="warm"?"cardio":ex.hold?"stat":CARD.includes(ex.id)?"cardio":"force";
const summ=c=>{const p=c.split(/(?<=[.!?])\s+/);let o=p[0];if(p[1]&&(o+" "+p[1]).length<=175)o+=" "+p[1];return o};
function voiceFor(st,ex){
  if(st.k==="rest"){
    if(st.lab==="Prépare-toi")return"Prépare-toi. On commence par : "+ex.n+".";
    if(st.lab==="Retour au calme")return"Retour au calme. On enchaîne avec les étirements. Premier : "+ex.n+".";
    if(st.lab==="Prochain étirement")return"Prochain : "+ex.n+".";
    return st.s>=10?"Repos. Ensuite : "+ex.n+".":"";
  }
  const first=!S.said[ex.id];S.said[ex.id]=1;
  const pre=st.k==="warm"?"Échauffement. ":"";
  return pre+ex.n+". "+(first?summ(ex.c):"C’est reparti.");
}
function show(v){["setup","play","done"].forEach(k=>{$("v-"+k).hidden=k!==v});window.scrollTo(0,0)}
const fmt=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
function setPauseBtn(){const b=$("b-pause");b.innerHTML=S&&S.pause?IC.play:IC.pause;b.setAttribute("aria-label",S&&S.pause?"Reprendre":"Pause")}
/* --- écran allumé pendant la séance : Wake Lock, plus une petite vidéo muette en secours (iPhone en appli installée) --- */
const NOSLEEP="data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAMqbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAA+gAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAlR0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+gAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAACAAAAAgAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPoAAAAAAABAAAAAAHMbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAABAAAAAQABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABd21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAATdzdGJsAAAAt3N0c2QAAAAAAAAAAQAAAKdhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAACAAIABIAAAASAAAAAAAAAABFUxhdmM2MC4zMS4xMDIgbGlieDI2NAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAK/+EAFmdCwAraJbARAAADAAEAAAMABA8SJqABAARozg/IAAAAEHBhc3AAAAABAAAAAQAAABRidHJ0AAAAAAAAFHAAABRwAAAAGHN0dHMAAAAAAAAAAQAAAAIAACAAAAAAFHN0c3MAAAAAAAAAAQAAAAEAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAIAAAABAAAAHHN0c3oAAAAAAAAAAAAAAAIAAAKEAAAACgAAABRzdGNvAAAAAAAAAAEAAANaAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY2MC4xNi4xMDAAAAAIZnJlZQAAApZtZGF0AAACbAYF//9o3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzEwOCAzMWUxOWY5IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMyAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTAgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9MSBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTAgd2VpZ2h0cD0wIGtleWludD0yIGtleWludF9taW49MSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTIgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAEGWIhAU///8PRQABPf8nXXgAAAAGQZogEvLA";
let nsv=null;
function keepAwake(){
  try{if(navigator.wakeLock&&!wake){navigator.wakeLock.request("screen").then(w=>{wake=w;w.addEventListener("release",()=>{if(wake===w)wake=null})}).catch(()=>{})}}catch(e){}
  try{
    if(!nsv){nsv=document.createElement("video");nsv.setAttribute("playsinline","");nsv.setAttribute("muted","");nsv.setAttribute("aria-hidden","true");nsv.muted=true;nsv.loop=true;nsv.src=NOSLEEP;
      nsv.style.cssText="position:fixed;width:2px;height:2px;opacity:.02;pointer-events:none;left:0;bottom:0";document.body.appendChild(nsv)}
    const p=nsv.play();p&&p.catch&&p.catch(()=>{});
  }catch(e){}
}
function releaseAwake(){
  try{wake&&wake.release()}catch(e){}wake=null;
  try{if(nsv){nsv.pause();nsv.remove()}}catch(e){}nsv=null;
}
function audioCheck(){
  if(!S||S.pause)return;
  const r=SND.revive();
  if(r==="rebuilt"){const st=B.steps[S.i],ex=EXM[st.ex];SND.setVol(CFG.vol/100);SND.setNat(CFG.nat);SND.setMute(!snd);if(CFG.mu&&snd)SND.phase(akind(st,ex),Math.max(1,st.s-S.t/1000))}
}
setInterval(audioCheck,1500);
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&S){keepAwake();audioCheck()}});
addEventListener("pageshow",()=>{if(S){keepAwake();audioCheck()}});
document.addEventListener("pointerdown",()=>{if(S)audioCheck()},true);
function startRun(){
  if(build(CFG).impossible)return;
  snd=true;SND.fresh();SND.setVol(CFG.vol/100);SND.setNat(CFG.nat);SND.setMute(false);
  keepAwake();
  B=build(CFG);
  {const P=curP();P.hist=[...(P.hist||[]),[...new Set(B.steps.filter(s=>s.k==="effort"||s.k==="stretch").map(s=>s.ex))]].slice(-5);save();SEED=newSeed()}
  S={i:0,t:0,last:performance.now(),pause:false,lb:0,said:{}};
  $("p-strip").innerHTML=B.steps.map(s=>`<i class="${s.k}"></i>`).join("");
  $("b-snd").innerHTML=snd?IC.on:IC.off;setPauseBtn();show("play");enter(true);
  cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
}
const sideTxt=(ex,sd)=>ex.sides?"Côté "+(sd+1)+" sur "+ex.sides:"";
function enter(first){
  const st=B.steps[S.i],ex=EXM[st.ex];S.lb=0;S.sd=0;
  $("app").dataset.phase=st.k;$("p-label").textContent=st.lab;
  $("p-name").textContent=ex.n;
  $("p-cue").textContent=st.k==="rest"?(st.lab==="Prépare-toi"?"Première position, on démarre dans quelques secondes.":(st.lab==="Retour au calme"?"Respire, on enchaîne avec les étirements. Voici le premier.":st.lab==="Prochain étirement"?"Installe-toi pour l’étirement suivant.":"Récupère. Voici la prochaine position.")):ex.c;
  $("p-cl").textContent=st.k==="rest"?"Ensuite":sideTxt(ex,0)||(ex.hold||ex.once?"Tenue":"Répétition");
  const nx=B.steps.slice(S.i+1).find(s=>s.k!=="rest");
  $("p-next").textContent=st.k==="effort"&&nx?(B.steps[S.i+1].k==="rest"?"Après le repos : ":"Ensuite : ")+EXM[nx.ex].n:(st.k==="effort"?"Dernier effort, tout donner.":(st.k==="warm"?"Monte progressivement en intensité.":""));
  [...$("p-strip").children].forEach((e,i)=>{e.classList.toggle("done",i<S.i);e.classList.toggle("cur",i===S.i);if(i!==S.i)e.style.removeProperty("--p")});
  if(!first)beep(st.k==="rest"?440:880,st.k==="rest"?.18:.3);
  if(CFG.mu)SND.phase(akind(st,ex),st.s);else SND.stopPhase();
  if(CFG.vx&&snd){const t=voiceFor(st,ex);if(t)SND.speak(t);else SND.cancel()}
}
function tick(now){
  if(!S)return;
  const dt=Math.min(now-S.last,60000);S.last=now;
  if(!S.pause){
    S.t+=dt;
    while(S.t>=B.steps[S.i].s*1000){
      S.t-=B.steps[S.i].s*1000;
      if(++S.i>=B.steps.length){finish(true);return}
      enter();
    }
  }
  frame();raf=requestAnimationFrame(tick);
}
function frame(){
  const st=B.steps[S.i],ex=EXM[st.ex],el=S.t/1000,rem=st.s-el,r=Math.ceil(rem),rest=st.k==="rest";
  $("p-time").textContent=r;$("p-time").style.fontSize=r>=100?"clamp(44px,14vw,60px)":"";
  if(r<=3&&r>=1&&S.lb!==r){S.lb=r;if(!S.pause)beep(660,.09)}
  let side=0,loc=el,T=st.s;
  if(!rest&&ex.sides){T=st.s/ex.sides;side=Math.min(ex.sides-1,Math.floor(el/T));loc=el-side*T}
  if(side!==S.sd){S.sd=side;$("p-cl").textContent=sideTxt(ex,side);if(!S.pause){beep(520,.25);if(CFG.vx&&snd)SND.speak("Change de côté.")}}
  const per=ex.fx?ex.p:ex.p*LV[CFG.lvl].t,rp=ex.rp||1;
  const s=rest?0:ex.once?loc/T:loc/per;
  $("p-svg").innerHTML=render(ex,s,side,el);
  const n=Math.floor(s*rp)+1,cv=rest?ex.n.split(" ")[0]:(ex.hold||ex.once?"Tiens":(ex.reps?Math.min(n,ex.reps)+"/"+ex.reps:n));
  $("p-cv").textContent=cv;
  if(rest)$("p-cv").style.fontSize="22px";else $("p-cv").style.removeProperty("font-size");
  const cur=$("p-strip").children[S.i];if(cur)cur.style.setProperty("--p",(el/st.s*100).toFixed(1)+"%");
  $("p-left").textContent="Reste "+fmt(B.total-st.at-el);
}
function go(i){
  if(!S)return;S.i=Math.max(0,i);S.t=0;S.last=performance.now();
  if(S.i>=B.steps.length){finish(true);return}
  enter();frame();
}
function finish(full){
  const done=S?B.steps.filter((s,i)=>s.k==="effort"&&(full||i<S.i)).length:0;
  const secs=S?(full?B.total:B.steps[S.i].at+S.t/1000):0,seen=[];
  if(S)B.steps.forEach((s,i)=>{if(s.k!=="rest"&&(full||i<=S.i)&&!seen.includes(s.ex))seen.push(s.ex)});
  const P=curP(),kc=S?kcalOf(P,B.steps,full?B.steps.length:S.i,full?0:S.t/1000):null;
  cancelAnimationFrame(raf);S=null;SND.stopPhase();SND.cancel();releaseAwake();
  $("app").dataset.phase="effort";
  $("d-stats").innerHTML=`<div class="st"><b>${fmt(secs)}</b><span>temps d’entraînement</span></div><div class="st"><b>${done}</b><span>efforts réalisés sur ${B.efforts}</span></div><div class="st"><b>${seen.length}</b><span>exercices différents</span></div>`;
  $("d-kcal").textContent=minor(P)?"":kcalTxt(P,kc);
  $("d-h").textContent=P.n?"Bien joué, "+P.n+".":"Bien joué.";
  $("d-list").innerHTML=seen.map(id=>row(EXM[id],"")).join("");
  if(full){beep(880,.2);setTimeout(()=>beep(1175,.35),220);if(CFG.vx&&snd)setTimeout(()=>SND.speak("Séance terminée. Bravo !"),700)}
  show("done");
}
$("b-start").onclick=startRun;
$("b-shuf").onclick=()=>{SEED=newSeed();renderSetup(true)};
$("b-again").onclick=startRun;
$("b-edit").onclick=()=>{renderSetup();show("setup")};
$("b-pause").onclick=()=>{if(!S)return;S.pause=!S.pause;S.last=performance.now();setPauseBtn();S.pause?SND.suspend():SND.resume()};
$("b-next").onclick=()=>go(S.i+1);
$("b-prev").onclick=()=>go(S.t>2500?S.i:S.i-1);
$("b-snd").onclick=()=>{snd=!snd;SND.setMute(!snd);$("b-snd").innerHTML=snd?IC.on:IC.off};
$("vol").addEventListener("input",()=>{CFG.vol=+$("vol").value;$("vol-o").textContent=CFG.vol+" %";SND.setVol(CFG.vol/100);save()});
$("b-quit").onclick=()=>{
  const b=$("b-quit");
  if(!quitT){quitT=setTimeout(()=>{quitT=0;b.setAttribute("aria-label","Terminer la séance");b.style.removeProperty("background");b.style.removeProperty("color")},3000);
    b.setAttribute("aria-label","Confirmer l’arrêt");b.style.background="var(--ph)";b.style.color="var(--on)";$("p-cue").textContent="Touche encore la croix pour terminer la séance.";return}
  clearTimeout(quitT);quitT=0;b.setAttribute("aria-label","Terminer la séance");b.style.removeProperty("background");b.style.removeProperty("color");finish(false);
};
document.addEventListener("keydown",e=>{if(e.code==="Space"&&S&&!$("v-play").hidden&&document.activeElement.tagName!=="BUTTON"){e.preventDefault();$("b-pause").click()}});
renderSetup();
