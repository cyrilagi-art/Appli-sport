/* ===== Moteur de pose : cinématique inverse (profil) + postures libres (face, dessus) ===== */
const FY=183.5,FT=182,FLOOR=186.5,D=Math.PI/180;
const L={th:38,sh:38,to:50,nk:6,hr:10,ua:28,fa:27,ft:9},LEG=L.th+L.sh,ARM=L.ua+L.fa;
const sin=a=>Math.sin(a*D),cos=a=>Math.cos(a*D);
function ik(a,t,l1,l2,pref){
  const dx=t[0]-a[0],dy=t[1]-a[1],raw=Math.hypot(dx,dy)||1e-6,ux=dx/raw,uy=dy/raw;
  let d=raw,gap=0;const mx=l1+l2-.001,mn=Math.abs(l1-l2)+.001;
  if(d>mx){gap=d-mx;d=mx}else if(d<mn)d=mn;
  const x=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-x*x));
  const px=-uy,py=ux,sg=(px*pref[0]+py*pref[1])>=0?1:-1;
  return{mid:[a[0]+ux*x+sg*px*h,a[1]+uy*x+sg*py*h],end:[a[0]+ux*d,a[1]+uy*d],gap};
}
/* Profil. Une clé de pose : hip, t (buste, 0 = vertical, + = penché vers l'avant), h (tête),
   fN/fF chevilles, faN/faF angle du pied, aN/aF angle du bras (0 = vers le bas, 90 = vers l'avant, 180 = vers le haut) ou hN/hF cibles des mains. */
function K(o){
  const p=Object.assign({t:0,h:0,fa:0,kpN:[1,0],kpF:[1,0],ep:[-1,.3],rN:1,rF:1,wt:1},o);
  p.epF=o.epF||p.ep;
  p.faN=o.faN??p.fa;p.faF=o.faF??p.fa;p.fF=o.fF||p.fN;
  const s=[p.hip[0]+L.to*sin(p.t),p.hip[1]-L.to*cos(p.t)];
  const ah=(a,r)=>{const d=Math.min(ARM*r,ARM-.02);return[s[0]+d*sin(a),s[1]+d*cos(a)]};
  p.hN=o.hN||ah(o.aN??0,p.rN);
  p.hF=o.hF||(o.aF!==undefined?ah(o.aF,p.rF):(o.hN||ah(o.aN??0,p.rF)));
  return p;
}
const FIELDS=['hip','t','h','fN','fF','faN','faF','hN','hF','kpN','kpF','ep','epF'];
/* Face / dessus : points cibles, les coudes et genoux sont déduits (IK) sauf si EL/ER/KL/KR sont donnés. */
const FF_IK=['H','N','M','P','WL','WR','AL','AR','TL','TR','QL','QR','EPL','EPR','KPL','KPR'];
const FF_X=['H','N','M','P','WL','WR','AL','AR','TL','TR','QL','QR','EL','ER','KL','KR'];
function F(o){
  const p=Object.assign({EPL:[-1,0],EPR:[1,0],KPL:[-1,0],KPR:[1,0],wt:1},o);
  p.M=o.M||[(p.N[0]+p.P[0])/2,(p.N[1]+p.P[1])/2];
  p.QL=o.QL||p.WL;p.QR=o.QR||p.WR;
  p.TL=o.TL||[p.AL[0]-7,p.AL[1]];p.TR=o.TR||[p.AR[0]+7,p.AR[1]];
  return p;
}
const lerp=(a,b,u)=>a+(b-a)*u;
function mix(A,B,u,fields){const o={};for(const f of (fields||FIELDS))o[f]=Array.isArray(A[f])?A[f].map((v,i)=>lerp(v,B[f][i],u)):lerp(A[f],B[f],u);return o}
function poseAt(ex,s){
  const ks=ex.keys,n=ks.length;let tot=ks.reduce((a,k)=>a+k.wt,0),x;
  if(ex.once){tot-=ks[n-1].wt;x=Math.min(Math.max(s,0),1)*tot}else x=(((s%1)+1)%1)*tot;
  for(let i=0;i<n;i++){
    if(ex.once&&i===n-1)return ks[i];
    if(x<=ks[i].wt||i===n-1){let u=Math.min(1,x/ks[i].wt);if(!ex.lin)u=u*u*(3-2*u);return mix(ks[i],ks[(i+1)%n],u,ex.fields)}
    x-=ks[i].wt}
}
function sAtKey(ex,i){let tot=ex.keys.reduce((a,k)=>a+k.wt,0);if(ex.once)tot-=ex.keys[ex.keys.length-1].wt;let c=0;for(let j=0;j<i;j++)c+=ex.keys[j].wt;return Math.min(1,c/tot)}
function joints(p){
  const hip=p.hip,sh=[hip[0]+L.to*sin(p.t),hip[1]-L.to*cos(p.t)],ha=p.t+p.h;
  const hd=[sh[0]+(L.nk+L.hr)*sin(ha),sh[1]-(L.nk+L.hr)*cos(ha)];
  const lg=(an,fa,kp)=>{const r=ik(hip,an,L.th,L.sh,kp);return{knee:r.mid,ank:r.end,toe:[r.end[0]+L.ft*cos(fa),r.end[1]+L.ft*sin(fa)],gap:r.gap}};
  const ar=(h,e)=>{const r=ik(sh,h,L.ua,L.fa,e);return{el:r.mid,hand:r.end,gap:r.gap}};
  return{hip,sh,hd,legN:lg(p.fN,p.faN,p.kpN),legF:lg(p.fF,p.faF,p.kpF),armN:ar(p.hN,p.ep),armF:ar(p.hF,p.epF)};
}
const P2=(...q)=>q.map(v=>v[0].toFixed(1)+','+v[1].toFixed(1)).join(' ');
const props=ex=>(ex.wall?`<rect class="wl" x="${ex.wall-3}" y="14" width="6" height="${FLOOR-14}"/>`:'')
  +(ex.props||[]).map(r=>`<rect class="wl" x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="2"/>`).join('');
const wrapFlip=(s,f)=>f==="h"?`<g transform="translate(260 0) scale(-1 1)">${s}</g>`:f==="v"?`<g transform="translate(0 200) scale(1 -1)">${s}</g>`:s;
function fig(j,ex,flip){
  const hl=g=>ex.hl.includes(g)?' hl':'';
  const leg=l=>`<polyline class="lm${hl('legs')}" points="${P2(j.hip,l.knee,l.ank,l.toe)}"/>`;
  const arm=a=>`<polyline class="lm${hl('arms')}" points="${P2(j.sh,a.el,a.hand)}"/>`;
  return wrapFlip(props(ex)
    +`<rect class="fl" x="0" y="${FLOOR}" width="260" height="14"/><line class="fe" x1="0" x2="260" y1="${FLOOR}" y2="${FLOOR}"/>`
    +`<g class="far">${leg(j.legF)}${arm(j.armF)}</g>`
    +`<line class="tor${hl('core')}" x1="${j.hip[0].toFixed(1)}" y1="${j.hip[1].toFixed(1)}" x2="${j.sh[0].toFixed(1)}" y2="${j.sh[1].toFixed(1)}"/>`
    +`<polyline class="lm" points="${P2(j.sh,j.hd)}"/>`
    +`<circle class="hd" cx="${j.hd[0].toFixed(1)}" cy="${j.hd[1].toFixed(1)}" r="${L.hr}"/>`
    +`<g>${leg(j.legN)}${arm(j.armN)}</g>`,flip&&!ex.wall&&!ex.props?flip:null);
}
/* ----- postures libres (de face, du dessus) ----- */
const vsub=(a,b)=>[a[0]-b[0],a[1]-b[1]],vadd=(a,b)=>[a[0]+b[0],a[1]+b[1]],vmul=(a,k)=>[a[0]*k,a[1]*k];
const vnorm=a=>{const m=Math.hypot(a[0],a[1])||1;return[a[0]/m,a[1]/m]};
const vperp=a=>[-a[1],a[0]];
function jointsF(p,ex){
  const dN=vnorm(vsub(p.M,p.N)),dP=vnorm(vsub(p.P,p.M));
  const sL=vadd(p.N,vmul(vperp(dN),14)),sR=vsub(p.N,vmul(vperp(dN),14));
  const iL=vadd(p.P,vmul(vperp(dP),8)),iR=vsub(p.P,vmul(vperp(dP),8));
  const x=ex.fields===FF_X;
  const ar=(s,w,ep,el)=>{if(x)return{el,hand:w,gap:0};const r=ik(s,w,L.ua,L.fa,ep);return{el:r.mid,hand:r.end,gap:r.gap}};
  const lg=(i,a,tp,kp,kn)=>{if(x)return{knee:kn,ank:a,toe:tp,gap:0};const r=ik(i,a,L.th,L.sh,kp);return{knee:r.mid,ank:r.end,toe:tp,gap:r.gap}};
  return{H:p.H,N:p.N,M:p.M,P:p.P,sL,sR,iL,iR,QL:p.QL,QR:p.QR,
    armL:ar(sL,p.WL,p.EPL,p.EL),armR:ar(sR,p.WR,p.EPR,p.ER),legL:lg(iL,p.AL,p.TL,p.KPL,p.KL),legR:lg(iR,p.AR,p.TR,p.KPR,p.KR)};
}
function figF(j,ex,flip){
  const hl=g=>ex.hl.includes(g)?' hl':'';
  const top=ex.view==="top";
  const arm=(s,a,q)=>{const pm=Math.hypot(q[0]-a.hand[0],q[1]-a.hand[1])>.6;
    return `<polyline class="lm${hl('arms')}" points="${P2(s,a.el,a.hand)}"/>`+(pm?`<line class="lm${hl('arms')}" style="stroke-width:4" x1="${q[0].toFixed(1)}" y1="${q[1].toFixed(1)}" x2="${(2*a.hand[0]-q[0]).toFixed(1)}" y2="${(2*a.hand[1]-q[1]).toFixed(1)}"/>`:'')};
  const leg=(i,l)=>`<polyline class="lm${hl('legs')}" points="${P2(i,l.knee,l.ank,l.toe)}"/>`;
  const bg=top?`<rect class="mat" x="10" y="52" width="240" height="96" rx="12"/>`
    :`<rect class="fl" x="0" y="${FLOOR}" width="260" height="14"/><line class="fe" x1="0" x2="260" y1="${FLOOR}" y2="${FLOOR}"/>`;
  return wrapFlip(bg+leg(j.iL,j.legL)+leg(j.iR,j.legR)
    +`<polyline class="tor${hl('core')}" points="${P2(j.N,j.M,j.P)}"/>`
    +`<line class="lm" x1="${j.sL[0].toFixed(1)}" y1="${j.sL[1].toFixed(1)}" x2="${j.sR[0].toFixed(1)}" y2="${j.sR[1].toFixed(1)}"/>`
    +`<line class="lm" x1="${j.iL[0].toFixed(1)}" y1="${j.iL[1].toFixed(1)}" x2="${j.iR[0].toFixed(1)}" y2="${j.iR[1].toFixed(1)}"/>`
    +`<polyline class="lm" points="${P2(j.N,j.H)}"/>`
    +`<circle class="hd" cx="${j.H[0].toFixed(1)}" cy="${j.H[1].toFixed(1)}" r="${L.hr}"/>`
    +arm(j.sL,j.armL,j.QL)+arm(j.sR,j.armR,j.QR),flip);
}
/* Point d'entrée commun : pose à l'instant s, côté (0/1), respiration br (degrés / pixels). */
function render(ex,s,side,ph){
  const p=poseAt(ex,s),fl=ex.sides&&side?ex.flip||"h":null;
  if(ex.view){
    const q=Object.assign({},p);
    if(ex.br){const b=ex.br*Math.sin(ph*1.25);q.H=[p.H[0],p.H[1]+b];q.N=[p.N[0],p.N[1]+b*.6]}
    return figF(jointsF(q,ex),ex,fl);
  }
  const q=Object.assign({},p);
  if(ex.br)q.t=p.t+ex.br*Math.sin(ph*1.25);
  return fig(joints(q),ex,fl);
}
