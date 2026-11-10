/* ===== Son : ambiances fabriquées par la page + voix du téléphone ===== */
const SND=(()=>{
const AC=window.AudioContext||window.webkitAudioContext;
let ac=null,master=null,bus=null,pb=null,noise=null,pink=null,P=null,timer=0,live=[],volv=.8,muted=false,ducked=false,NAT="ruisseau",vox=null,vq=0;
const volg=()=>muted?0:.47*Math.pow(volv,1.6)*(ducked?.35:1);
function setGain(){if(master)master.gain.setTargetAtTime(volg(),ac.currentTime,.03)}
function initGraph(){
  const comp=ac.createDynamicsCompressor();
  comp.threshold.value=-14;comp.ratio.value=4;comp.attack.value=.003;comp.release.value=.2;
  master=ac.createGain();master.gain.value=volg();master.connect(comp);comp.connect(ac.destination);
  bus=ac.createGain();bus.connect(master);
  const sr=ac.sampleRate;
  noise=ac.createBuffer(1,sr,sr);let d=noise.getChannelData(0);
  for(let i=0;i<sr;i++)d[i]=Math.random()*2-1;
  pink=ac.createBuffer(1,sr*4,sr);d=pink.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for(let i=0;i<d.length;i++){
    const w=Math.random()*2-1;
    b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;
    b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;
    d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11;b6=w*.115926;
  }
  const an=ac.createAnalyser();an.fftSize=2048;comp.connect(an);api.an=an;
}
function init(){
  try{if(!ac)ac=new AC();if(!master)initGraph();if(ac.state==="suspended")ac.resume();return true}catch(e){return false}
}
/* ===== Instruments ===== */
function env(g,t,a,peak,dec){
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec);
}
function mk(type,f,t,d){const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);o.start(t);o.stop(t+d+.05);return o}
function nz(t,d,type,f,q){
  const s=ac.createBufferSource();s.buffer=noise;
  const fl=ac.createBiquadFilter();fl.type=type;fl.frequency.value=f;if(q)fl.Q.value=q;
  s.connect(fl);s.start(t,Math.random()*.5,d+.05);return fl;
}
function kick(t,v){
  const o=mk("sine",150,t,.4),g=ac.createGain();
  o.frequency.exponentialRampToValueAtTime(46,t+.13);
  env(g,t,.002,v,.32);o.connect(g);g.connect(pb);
  const o2=mk("triangle",260,t,.15),g2=ac.createGain();
  o2.frequency.exponentialRampToValueAtTime(90,t+.05);
  env(g2,t,.001,v*.45,.1);o2.connect(g2);g2.connect(pb);
}
function hat(t,v,open){
  const fl=nz(t,open?.25:.06,"highpass",7500),g=ac.createGain();
  env(g,t,.001,v,open?.2:.04);fl.connect(g);g.connect(pb);
}
function clap(t,v){
  const fl=nz(t,.3,"bandpass",1700,.9),g=ac.createGain();
  g.gain.setValueAtTime(.0001,t);
  g.gain.linearRampToValueAtTime(v,t+.002);g.gain.linearRampToValueAtTime(v*.2,t+.011);
  g.gain.linearRampToValueAtTime(v,t+.014);g.gain.linearRampToValueAtTime(v*.2,t+.023);
  g.gain.linearRampToValueAtTime(v,t+.026);g.gain.exponentialRampToValueAtTime(.0001,t+.2);
  fl.connect(g);g.connect(pb);
}
function bass(t,f,d,v){
  const g=ac.createGain(),fl=ac.createBiquadFilter();fl.type="lowpass";fl.Q.value=4;
  fl.frequency.setValueAtTime(1500,t);fl.frequency.exponentialRampToValueAtTime(320,t+.12);
  const o=mk("sawtooth",f,t,d+.1),o2=mk("sine",f,t,d+.1);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.01);
  g.gain.setValueAtTime(v,t+d);g.gain.exponentialRampToValueAtTime(.0001,t+d+.08);
  o.connect(fl);o2.connect(fl);fl.connect(g);g.connect(pb);
}
function pluck(t,f,v){
  const g=ac.createGain(),fl=ac.createBiquadFilter();fl.type="lowpass";
  fl.frequency.setValueAtTime(4200,t);fl.frequency.exponentialRampToValueAtTime(900,t+.18);
  const o=mk("square",f,t,.3),o2=mk("triangle",f*2,t,.3);o2.detune.value=6;
  env(g,t,.003,v,.22);o.connect(fl);o2.connect(fl);fl.connect(g);g.connect(pb);
}
function blip(t,up,v){
  const o=mk("triangle",up?520:900,t,.2),g=ac.createGain();
  o.frequency.exponentialRampToValueAtTime(up?1000:430,t+.17);
  env(g,t,.005,v,.17);o.connect(g);g.connect(pb);
}
function pad(t,notes,d,v){
  for(const f of notes){
    const o=mk("triangle",f,t,d+.6),g=ac.createGain(),fl=ac.createBiquadFilter();
    fl.type="lowpass";fl.frequency.value=1400;
    g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.6);g.gain.setValueAtTime(v,t+d);g.gain.exponentialRampToValueAtTime(.0001,t+d+.6);
    o.connect(fl);fl.connect(g);g.connect(pb);
  }
}
function bell(t){
  [[1318.5,.1,.9],[2637,.035,.5]].forEach(([f,v,dec])=>{const o=mk("sine",f,t,dec+.02),g=ac.createGain();env(g,t,.003,v,dec);o.connect(g);g.connect(pb)});
}
function bowl(t,f){
  [[f,.13,5],[f*2.756,.055,3.2],[f*5.404,.025,1.6]].forEach(([fr,v,dec])=>{const o=mk("sine",fr,t,dec+.05),g=ac.createGain();env(g,t,.01,v,dec);o.connect(g);g.connect(pb)});
}
function drop(t){
  const f=500+Math.random()*1500,o=mk("sine",f,t,.1),g=ac.createGain();
  o.frequency.exponentialRampToValueAtTime(f*(1.5+Math.random()),t+.06);
  env(g,t,.003,.025+Math.random()*.03,.07);o.connect(g);g.connect(pb);
}
function tick(t){
  const fl=nz(t,.03,"bandpass",2500+Math.random()*4500,1.2),g=ac.createGain();
  env(g,t,.001,.05+Math.random()*.05,.02);fl.connect(g);g.connect(pb);
}
function chirp(t){
  const n=2+Math.floor(Math.random()*3),f0=2400+Math.random()*1400;
  for(let j=0;j<n;j++){
    const tj=t+j*(.11+Math.random()*.03),f=f0*(j%2?1.08:1),up=Math.random()<.5;
    const o=mk("sine",f,tj,.1),g=ac.createGain();
    o.frequency.exponentialRampToValueAtTime(up?f*1.35:f*.75,tj+.08);
    env(g,tj,.006,.05,.08);o.connect(g);g.connect(pb);
  }
}

/* ===== Ambiance de nature : bruit rose filtré, modulé lentement ===== */
function ls(n,t0,t1,off){n.start(t0,off||0);if(t1<1e8)n.stop(t1+1.5);else live.push(n)}
function pinkSrc(t0,t1){
  const s=ac.createBufferSource();s.buffer=pink;s.loop=true;s.playbackRate.value=.92+Math.random()*.16;
  ls(s,t0,t1,Math.random()*3);return s;
}
function band(t0,t1,type,f,q,gain,lfoHz,depth,fdepth){
  const s=pinkSrc(t0,t1),fl=ac.createBiquadFilter(),g=ac.createGain();
  fl.type=type;fl.frequency.value=f;fl.Q.value=q;g.gain.value=gain;
  s.connect(fl);fl.connect(g);g.connect(pb);
  if(lfoHz&&depth){const o=ac.createOscillator(),od=ac.createGain();o.frequency.value=lfoHz;od.gain.value=depth;o.connect(od);od.connect(g.gain);ls(o,t0,t1,0)}
  if(lfoHz&&fdepth){const o=ac.createOscillator(),od=ac.createGain();o.frequency.value=lfoHz*1.7+.05;od.gain.value=f*fdepth;o.connect(od);od.connect(fl.frequency);ls(o,t0,t1,0)}
}
const AG=15;
function amb(kind,t0,t1){
  if(kind==="ruisseau"||kind==="foret"){
    const k=(kind==="foret"?.55:1)*AG;
    band(t0,t1,"bandpass",350,.8,.09*k,.31,.04*k,.2);
    band(t0,t1,"bandpass",800,1.1,.08*k,.43,.035*k,.25);
    band(t0,t1,"bandpass",1900,1.5,.045*k,.57,.02*k,.2);
    band(t0,t1,"bandpass",3800,2,.022*k,.71,.01*k,.15);
  }
  if(kind==="pluie"){
    band(t0,t1,"highpass",1800,.7,.10*AG,.12,.015*AG,0);
    band(t0,t1,"bandpass",5200,.6,.06*AG,.17,.01*AG,0);
    band(t0,t1,"bandpass",320,.7,.03*AG,.09,.01*AG,0);
  }
  if(kind==="foret"){
    band(t0,t1,"bandpass",520,1.4,.07*AG,.07,.04*AG,.3);
    band(t0,t1,"bandpass",880,3,.02*AG,.11,.01*AG,.2);
  }
}
/* ===== Motifs : La mineur, Do, Sol, Ré ===== */
const ROOT=[110,130.81,98,146.83];
const CH=[[440,523.25,659.25],[523.25,659.25,783.99],[392,493.88,587.33],[587.33,739.99,880]];
const BASS={0:1,3:1,6:2,8:1,10:1.5,12:1,14:2};
const ARP=[0,2,6,8,11,14],ARPN=[0,1,2,1,2,1];
function forceStep(i,t,sd){
  const bar=Math.floor(i/16)%4,s=i%16,r=ROOT[bar],c=CH[bar];
  if(s%4===0)kick(t,.9);
  if(s===4||s===12)clap(t,.34);
  if(s%4===2)hat(t,.1,true);else hat(t,s%4===0?.05:s%4===1?.025:.032,false);
  if(BASS[s])bass(t,r*BASS[s],sd*2.3,.3);
  const k=ARP.indexOf(s);if(k>=0)pluck(t,c[ARPN[k]],.07);
  if(s===0)blip(t,false,.2);
  if(s===8)blip(t,true,.2);
}
const CB=[1,1,2,1,1,1,2,1.5];
function cardioStep(i,t,sd){
  const bar=Math.floor(i/16)%4,s=i%16,r=ROOT[bar],c=CH[bar];
  if(s%4===0)kick(t,.85);
  if(s===14)kick(t,.4);
  if(s===4||s===12)clap(t,.32);
  if(s%4===2)hat(t,.1,true);else hat(t,s%2?.035:.055,false);
  if(s%2===0)bass(t,r*CB[s/2],sd*1.7,.26);
  if(s%2===0)pluck(t,c[(s/2)%3]*(s===14?2:1),.05);
}
function staticStep(i,t,sd){
  const bar=Math.floor(i/16)%4,s=i%16,c=CH[bar];
  if(s%4===0)kick(t,s===0?.55:.38);
  if(s%4===2)hat(t,.03,false);
  if(s===0){bass(t,ROOT[bar],sd*15,.2);pad(t,c.map(f=>f/2),sd*16,.05)}
  if(i>0&&i%40===0)bell(t);
}
const RP={0:2,6:1,10:0};
function restStep(i,t,sd){
  const bar=Math.floor(i/16)%4,s=i%16,c=CH[bar];
  if(s===0){pad(t,c.map(f=>f/2),sd*16,.07);kick(t,.45);bass(t,ROOT[bar],sd*5,.16)}
  if(s%4===2)hat(t,.03,false);
  if(RP[s]!==undefined)pluck(t,c[RP[s]],.045);
}
function zenStep(i,t,sd){
  const k=P.zk;
  if(i%64===0)pad(t,[110,164.81,220,329.63],sd*64,.035);
  if(i===6||(i>6&&(i-6)%64===0))bowl(t,220);
  if(k==="ruisseau"){for(let n=0;n<2;n++)if(Math.random()<.45)drop(t+Math.random()*sd)}
  if(k==="foret"){
    if(Math.random()<.2)drop(t+Math.random()*sd);
    if(Math.random()<.055)chirp(t+Math.random()*sd);
  }
  if(k==="pluie"){for(let n=0;n<4;n++)if(Math.random()<.5)tick(t+Math.random()*sd)}
}
const KB={cardio:{bpm:144,fn:cardioStep,g:1.35},force:{bpm:120,fn:forceStep,g:1},stat:{bpm:60,fn:staticStep,g:1},zen:{bpm:60,fn:zenStep,g:1},rest:{bpm:76,fn:restStep,g:1}};

/* ===== Phases pilotées par la séance ===== */
function pump(){
  if(!P||!ac)return;
  const horizon=ac.currentTime+1;
  while(P.nextT<horizon&&P.nextT<P.end-1e-6){
    const kb=KB[P.k],sd=60/kb.bpm/4;
    if(P.nextT<ac.currentTime-.03){P.step++;P.nextT+=sd;continue}
    kb.fn(P.step,P.nextT,sd);P.step++;P.nextT+=sd;
  }
}
function endPhase(){
  if(!pb||!ac)return;
  const g=pb.gain,t=ac.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(Math.max(g.value,.0001),t);g.setTargetAtTime(0,t,.08);
  const old=pb;setTimeout(()=>{try{old.disconnect()}catch(e){}},1500);pb=null;P=null;
}
function phase(kind,dur){
  if(!init())return;
  endPhase();
  const at=ac.currentTime+.05,kb=KB[kind];
  P={k:kind,end:at+dur,step:0,nextT:at,zk:NAT};
  pb=ac.createGain();pb.connect(bus);
  const fi=kind==="zen"?1.5:.25,fo=kind==="zen"?.9:.35,g=kb.g;
  pb.gain.setValueAtTime(.0001,at);pb.gain.linearRampToValueAtTime(g,at+fi);
  pb.gain.setValueAtTime(g,Math.max(at+fi,P.end-fo));pb.gain.linearRampToValueAtTime(.0001,P.end+fo);
  if(kind==="zen")amb(NAT,at,P.end);
  clearInterval(timer);timer=setInterval(pump,100);pump();
}
function stopPhase(){endPhase();clearInterval(timer);timer=0}
function ubeep(f,d){
  if(!init())return;
  const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();
  o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.3,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(bus);o.start(t);o.stop(t+d+.03);
}
/* ===== Voix : synthèse vocale du téléphone ===== */
const hasVoice=()=>"speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;
function pickVoice(){
  try{const v=speechSynthesis.getVoices();
    vox=v.find(x=>/^fr[-_]FR/i.test(x.lang)&&x.localService)||v.find(x=>/^fr[-_]FR/i.test(x.lang))||v.find(x=>/^fr/i.test(x.lang))||null}catch(e){}
}
if(hasVoice()){pickVoice();try{speechSynthesis.addEventListener("voiceschanged",pickVoice)}catch(e){}}
function speak(text){
  api.last=text;
  if(!hasVoice()||!text)return;
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);u.lang="fr-FR";if(vox)u.voice=vox;u.rate=1;u.pitch=1;u.volume=1;
    const my=++vq;
    u.onstart=()=>{ducked=true;setGain()};
    const done=()=>{if(my===vq){ducked=false;setGain()}};
    u.onend=done;u.onerror=done;
    if(muted)return;
    speechSynthesis.speak(u);
  }catch(e){}
}
function cancel(){vq++;ducked=false;setGain();try{hasVoice()&&speechSynthesis.cancel()}catch(e){}}
const api={init,phase,stopPhase,beep:ubeep,speak,cancel,hasVoice,last:"",an:null,
  setVol(v){volv=v;setGain()},
  setMute(m){muted=m;setGain();if(m)cancel()},
  setNat(n){NAT=n},
  suspend(){try{ac&&ac.suspend();hasVoice()&&speechSynthesis.pause()}catch(e){}},
  resume(){try{ac&&ac.resume();hasVoice()&&speechSynthesis.resume()}catch(e){}}};
return api;
})();
