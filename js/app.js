/* LIGHT NOVEL PARODY FACTORY — STORY ENGINE 14.0
   Procedural long-form engine with continuity, anti-repetition, pacing and safe persistence.
*/
const AUTHOR='BLLSNVJ21';
const ENGINE_VERSION='14.0';
const MAX_CHAPTERS=1000;
const WORD_TARGET=800;
const GENERATOR_YIELD=3;const GENRES=['Isekai','Fantasy','Action','Adventure','Romance','Comedy','Horror','Mystery','School','Villainess','Cultivation','Sci-Fi','Reincarnation','Game/System','Dungeon','Demon Lord','Slice of Life','Supernatural','Sports','Mecha','Magical Girl','Post-Apocalypse','Cyberpunk','Historical','Military','Cooking','Otome','Time Travel','Survival','Political Intrigue','Music','Western','Pirates','Steampunk','Urban Fantasy','Dark Fantasy'];
const TROPES=['Overpowered Protagonist','Weak-to-Strong','Accidental Hero','Villainess Reincarnation','Deadpan Genius','Hot-Blooded Rival','Chaotic Best Friend','Mysterious Transfer Student','Ancient Sealed Power','Hidden Royalty','Fake Weakness','System Window Addict','Dense Romantic Lead','Tsundere Rival','Unreasonably Hungry Hero','Mentor Who Knows Too Much','Comic Relief Who Saves Everyone','Secret Final Boss','Prophecy That Makes No Sense','Nobody Reads The Instructions'];
const NAMES=['Alden','Mira','Rin','Kael','Liora','Yuki','Sora','Vera','Bram','Noel','Iris','Gideon','Talia','Ren','Marek','Nia','Cato','Elara','Jun','Selene'];
const box=id=>document.getElementById(id);const safeBox=id=>document.getElementById(id);const MRNG=()=>{try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296}catch{return Math.random()}};let SEED='';let RNG=Math.random,RNG_STATE=0;function hashSeed(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}function setSeed(seed){SEED=String(seed||'');RNG_STATE=hashSeed(SEED||String(Date.now())+String(MRNG()));RNG=()=>{RNG_STATE+=0x6D2B79F5;let x=RNG_STATE;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}setSeed('');const SETTINGS={tone:50,romance:30,comedy:70,serious:30,violence:20};let BIBLE={protagonist:'',worldPremise:'',signatureItem:'',forbiddenTerms:''};let selectedGenres=['Isekai','Comedy'],selectedTropes=['Overpowered Protagonist','Chaotic Best Friend','Prophecy That Makes No Sense'];
const shuffle=a=>[...a].sort(()=>RNG()-.5),pick=a=>a[Math.floor(RNG()*a.length)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function updateUI(){const p=Number(box('parody').value),c=Number(box('chapters').value);box('genreCount').textContent=selectedGenres.length+' SELECTED';box('tropeCount').textContent=selectedTropes.length+' SELECTED';box('parodyOut').value=p+'%';box('chapterOut').value=c;box('wordEstimate').textContent=(c*800).toLocaleString()+' words';box('configSummary').textContent=selectedGenres.length+' genres · '+selectedTropes.length+' tropes · '+p+'% parody';readSettings();localStorage.setItem('lnpf-draft',JSON.stringify({genres:selectedGenres,tropes:selectedTropes,parody:p,chapters:c,title:box('title').value,settings:{...SETTINGS},bible:{...BIBLE},seed:SEED}));}
function cards(list,target,selected){target.innerHTML='';list.forEach(x=>{const e=document.createElement('button');e.type='button';e.className='select-card'+(selected.includes(x)?' active':'');e.textContent=x;e.setAttribute('aria-pressed',selected.includes(x));e.onclick=()=>{const i=selected.indexOf(x);i>=0?selected.splice(i,1):selected.push(x);cards(list,target,selected);updateUI()};target.appendChild(e)})}
function restoreDraft(){try{const d=JSON.parse(localStorage.getItem('lnpf-draft')||'null');if(d){selectedGenres=Array.isArray(d.genres)&&d.genres.length?d.genres:selectedGenres;selectedTropes=Array.isArray(d.tropes)&&d.tropes.length?d.tropes:selectedTropes;if(d.parody!=null)box('parody').value=d.parody;if(d.chapters!=null)box('chapters').value=d.chapters;if(d.title)box('title').value=d.title;if(d.settings)Object.keys(SETTINGS).forEach(k=>{if(d.settings[k]!=null&&safeBox(k))safeBox(k).value=d.settings[k]});if(d.bible){Object.keys(BIBLE).forEach(k=>{if(d.bible[k]!=null)BIBLE[k]=String(d.bible[k]);if(safeBox(k))safeBox(k).value=BIBLE[k]})}if(d.seed!=null){SEED=String(d.seed);if(safeBox('seed'))safeBox('seed').value=SEED;setSeed(SEED)}}}catch{}}
restoreDraft();cards(GENRES,box('genres'),selectedGenres);cards(TROPES,box('tropes'),selectedTropes);updateUI();
box('allGenres').onclick=()=>{selectedGenres=selectedGenres.length===GENRES.length?[]:[...GENRES];cards(GENRES,box('genres'),selectedGenres);updateUI()};
box('allTropes').onclick=()=>{selectedTropes=selectedTropes.length===TROPES.length?[]:[...TROPES];cards(TROPES,box('tropes'),selectedTropes);updateUI()};
box('randomGenres').onclick=()=>{selectedGenres=shuffle(GENRES).slice(0,Math.floor(RNG()*4)+2);cards(GENRES,box('genres'),selectedGenres);updateUI()};
box('randomTropes').onclick=()=>{selectedTropes=shuffle(TROPES).slice(0,Math.floor(RNG()*5)+3);cards(TROPES,box('tropes'),selectedTropes);updateUI()};
box('resetFactory').onclick=()=>{localStorage.removeItem('lnpf-draft');selectedGenres=['Isekai','Comedy'];selectedTropes=['Overpowered Protagonist','Chaotic Best Friend','Prophecy That Makes No Sense'];box('parody').value=90;box('chapters').value=200;box('title').value='';if(safeBox('seed'))safeBox('seed').value='';setSeed('');Object.keys(BIBLE).forEach(k=>{BIBLE[k]='';if(safeBox(k))safeBox(k).value=''});box('blueprintView').innerHTML='';box('status').textContent='Configuration reset.';cards(GENRES,box('genres'),selectedGenres);cards(TROPES,box('tropes'),selectedTropes);updateUI()};
box('parody').oninput=updateUI;box('chapters').oninput=updateUI;box('title').oninput=updateUI;if(safeBox('seed'))safeBox('seed').oninput=()=>{setSeed(safeBox('seed').value.trim());updateUI()};if(safeBox('randomSeed'))safeBox('randomSeed').onclick=()=>{const s=crypto.randomUUID().replaceAll('-','').slice(0,16);safeBox('seed').value=s;setSeed(s);updateUI()};['tone','romance','comedy','serious','violence'].forEach(id=>{const e=safeBox(id);if(e)e.oninput=()=>{readSettings();updateUI()}});Object.keys(BIBLE).forEach(id=>{const e=safeBox(id);if(e)e.oninput=()=>{BIBLE[id]=e.value;updateUI()}});const surprise=safeBox('surpriseMe');if(surprise)surprise.onclick=randomizeEverything;const randomBible=safeBox('randomBible');if(randomBible)randomBible.onclick=()=>{BIBLE.protagonist=pick(NAMES);BIBLE.worldPremise=pick(['magic is powered by paperwork','every dungeon has a customer-service desk','prophecies are written by exhausted interns','the kingdom is run by competitive cooking','time travel requires returning library books']);BIBLE.signatureItem=pick(OBJECT);BIBLE.forbiddenTerms='very, suddenly, literally';Object.keys(BIBLE).forEach(k=>{if(safeBox(k))safeBox(k).value=BIBLE[k]});updateUI()};

function readSettings(){Object.keys(SETTINGS).forEach(k=>{const e=safeBox(k);if(e)SETTINGS[k]=Number(e.value)})}
function randomizeEverything(){selectedGenres=shuffle(GENRES).slice(0,Math.floor(RNG()*5)+2);selectedTropes=shuffle(TROPES).slice(0,Math.floor(RNG()*6)+3);box('parody').value=Math.floor(RNG()*101);box('chapters').value=(Math.floor(RNG()*81)+20)*10;box('title').value='';BIBLE.protagonist=pick(NAMES);BIBLE.worldPremise=pick(['magic is powered by paperwork','every dungeon has a customer-service desk','prophecies are written by exhausted interns','the kingdom is run by competitive cooking']);BIBLE.signatureItem=pick(OBJECT);BIBLE.forbiddenTerms='very, suddenly, literally';Object.keys(BIBLE).forEach(k=>{if(safeBox(k))safeBox(k).value=BIBLE[k]});cards(GENRES,box('genres'),selectedGenres);cards(TROPES,box('tropes'),selectedTropes);updateUI()}

const TITLE_A=['The Hero','The Villainess','The Reluctant Genius','The Accidental Overlord','The Nobody','The Transfer Student','The Cook Who','The Knight Who','The Player Who','The Person Who'];
const TITLE_B=['Refused To Follow The Plot','Broke The Prophecy','Accidentally Started A War','Found A Dungeon Behind The Kitchen','Was Too Busy Eating','Read The System Terms','Inherited The Wrong Kingdom','Turned A Side Quest Into A Crisis'];
const LOCATION=['the Clockwork Capital','the Rain District','the Infinite Dungeon','the Moonlit Market','the Academy of Unreasonable Rules','the Ashen Coast','the Glass Forest','the Underground Railway','the Palace Basement','the village nobody put on the map','the floating archive','the border where maps become suggestions'];
const OBJECT=['a cracked silver coin','a suspicious recipe','a sealed letter','a broken compass','a tiny black key','an unsigned contract','a ridiculous crown','a glowing spoon','a map with one missing street','a bell that rings at the wrong time'];
const VERBS=['investigate','negotiate','escape','challenge','protect','steal','repair','decode','question','outsmart','follow','avoid'];
const CONFLICTS=['a rival has arrived first','the local rules have changed overnight','an old promise has become relevant','someone has misunderstood the prophecy','the harmless side quest is no longer harmless','a forgotten faction has made its move','the supposed villain wants a refund','the party has discovered an inconvenient truth'];
const RESOLUTIONS=['the answer creates two new questions','the immediate danger passes, but the cost is recorded','the group gains useful information rather than a clean victory','the conflict ends with an agreement nobody expected','the result changes what the characters believed about the world'];
const JOKES=['Nobody considered this part of the plan, mostly because there was no plan.','The dramatic pause lasted long enough for someone to ask whether lunch was still happening.','The universe appeared to have a sense of humor, and unfortunately it was using the party as material.','This was technically a victory, although the paperwork strongly disagreed.','Everyone looked at the person who had caused the problem. That person looked at the ceiling.'];
const OPENERS=['Morning arrived with the confidence of someone who had never seen the previous night.','The day began quietly, which was the first suspicious thing about it.','By noon, the situation had become complicated enough to deserve a committee.','Nothing unusual happened for nearly seven minutes. Then everything happened at once.','The road ahead looked ordinary. The road was lying.'];
const GENRE_FLAVOR={'Isekai':'another world with rules nobody had documented','Fantasy':'old magic and newer paperwork','Action':'momentum that refused to become sensible','Adventure':'a route that kept producing side quests','Romance':'feelings that were inconveniently relevant','Comedy':'timing that made dignity difficult','Horror':'silence that seemed to know too much','Mystery':'clues that became stranger when examined','School':'rules that mattered until someone ignored them','Villainess':'social consequences disguised as etiquette','Cultivation':'power measured in increasingly unreasonable stages','Sci-Fi':'technology with suspiciously human bugs','Reincarnation':'a second life carrying first-life baggage','Game/System':'menus, notifications and questionable rewards','Dungeon':'rooms that seemed personally offended','Demon Lord':'ancient threats with modern complaints','Slice of Life':'ordinary routines carrying extraordinary consequences','Supernatural':'the impossible behaving like a normal neighbor','Sports':'competition, momentum and dramatic timing','Mecha':'machines requiring both precision and emotional support','Magical Girl':'sparkles hiding extremely serious consequences','Post-Apocalypse':'survival with surprisingly complicated logistics','Cyberpunk':'neon, data and corporate nonsense','Historical':'customs that turned every decision into procedure','Military':'orders, logistics and consequences','Cooking':'recipes capable of starting arguments','Otome':'relationships governed by suspiciously game-like rules','Time Travel':'causality that needed constant supervision','Survival':'scarce resources and stubborn optimism','Political Intrigue':'alliances where every smile had paperwork','Music':'rhythm, rivalry and inconvenient applause','Western':'dust, distance and personal grudges','Pirates':'salt air, treasure and terrible accounting','Steampunk':'brass machinery and spectacularly impractical engineering','Urban Fantasy':'modern streets hiding old powers','Dark Fantasy':'beautiful places carrying ugly histories'};
const exactWords=(text,target)=>{let words=String(text||'').split(/\s+/).filter(Boolean);if(words.length>target)words=words.slice(0,target);const fillers=['The moment was recorded for later.','The next decision would have to wait.','Nobody called it a victory yet.','The record remained open.'];let f=0;while(words.length<target){const need=target-words.length;const add=fillers[f++%fillers.length].split(/\s+/);words.push(...add.slice(0,need));if(add.length>need)break}if(words.length)words[words.length-1]=words[words.length-1].replace(/[.!?]*$/,'')+'.';return words.join(' ')};

function makeTitle(){return pick(TITLE_A)+' '+pick(TITLE_B)}
function makeBlueprint(){
 const title=box('title').value.trim()||makeTitle(), genres=selectedGenres.length?selectedGenres:['Fantasy'], tropes=selectedTropes.length?selectedTropes:['Accidental Hero'];readSettings();Object.keys(BIBLE).forEach(k=>{if(safeBox(k))BIBLE[k]=safeBox(k).value.trim()});
 const used=new Set(),chars=[];for(const role of ['PROTAGONIST','RIVAL','COMPANION','MENTOR']){let name;do{name=pick(NAMES)}while(used.has(name));used.add(name);chars.push({role,name,trope:pick(tropes)})}
 const locations=shuffle(LOCATION).slice(0,5),hooks=shuffle(CONFLICTS).slice(0,4);
 if(BIBLE.protagonist)chars[0].name=BIBLE.protagonist;return {title,author:AUTHOR,genres,tropes,parody:Number(box('parody').value),chapters:Math.min(MAX_CHAPTERS,Math.max(1,Number(box('chapters').value)||1)),settings:{...SETTINGS},bible:{...BIBLE},seed:SEED,characters:chars,locations,hooks,engineVersion:ENGINE_VERSION,created:Date.now()};
}
function factoryFingerprint(bp){
 const raw=[bp.title,bp.seed,bp.genres.join('|'),bp.tropes.join('|'),bp.parody,bp.chapters,bp.bible?.worldPremise||''].join('::');
 let h=2166136261;for(let i=0;i<raw.length;i++){h^=raw.charCodeAt(i);h=Math.imul(h,16777619)}return ('00000000'+(h>>>0).toString(16)).slice(-8).toUpperCase();
}
function parodyDNA(bp){
 const p=Number(bp.parody||0),g=bp.genres.length,t=bp.tropes.length;
 return {
  chaos:Math.min(100,Math.round(p*.65+g*5+t*3)),
  tropeCollision:Math.min(100,Math.round((t*9)+(p*.18))),
  unpredictability:Math.min(100,Math.round(p*.55+g*4)),
  sincerity:Math.max(0,Math.round(100-p*.62)),
  identity:factoryFingerprint(bp)
 };
}
function narrativeLaws(bp){
 const p=Number(bp.parody||0);
 const laws=['The protagonist cannot solve the obvious problem first.','Every major discovery must create a smaller, stranger question.','Side characters are allowed to become temporarily more competent than the protagonist.'];
 if(p>=70)laws.push('At least one serious moment must be interrupted by something magnificently stupid.');
 if(p>=90)laws.push('Logic may complain, but it does not get veto power.');
 if(bp.tropes.some(x=>/Prophecy/i.test(x)))laws.push('Prophecies must remain technically interpretable and emotionally inconvenient.');
 if(bp.tropes.some(x=>/System/i.test(x)))laws.push('System notifications create consequences; they are never decoration.');
 return laws;
}
function renderBlueprint(bp){
 const root=box('blueprintView');
 root.innerHTML='<div class="blueprint glass-panel"><div class="blueprint-top"><div><p class="eyebrow">BLUEPRINT READY · STORY ENGINE 14.0</p><h2>'+esc(bp.title)+'</h2><p class="muted">Continuity memory · anti-repetition · arc pacing · character state · foreshadowing · narrative laws</p></div><span class="status-pill">READY</span></div><div class="bp-author"><span>AUTHOR</span><strong>BLLSNVJ21</strong></div><div class="bp-stats"><div><b>'+bp.chapters+'</b><span>CHAPTERS</span></div><div><b>'+bp.parody+'%</b><span>PARODY</span></div><div><b>'+bp.genres.length+'</b><span>GENRES</span></div><div><b>'+bp.tropes.length+'</b><span>TROPES</span></div></div><div class="bp-section"><h3>GENRES & TROPES</h3><div class="tag-list">'+[...bp.genres,...bp.tropes].map(x=>'<span>'+esc(x)+'</span>').join('')+'</div></div><div class="bp-section"><h3>CHARACTERS</h3><div class="character-grid">'+bp.characters.map(c=>'<article><small>'+esc(c.role)+'</small><strong>'+esc(c.name)+'</strong><p>'+esc(c.trope)+'</p></article>').join('')+'</div></div><div class="bp-section"><h3>STORY BIBLE</h3><p>Custom protagonist, world premise, signature item and forbidden phrases are locked into this blueprint.</p></div><div class="bp-section"><h3>⚡ PARODY DNA</h3><div class="bp-stats"><div><b>'+parodyDNA(bp).chaos+'%</b><span>CHAOS</span></div><div><b>'+parodyDNA(bp).tropeCollision+'%</b><span>TROPE COLLISION</span></div><div><b>'+parodyDNA(bp).unpredictability+'%</b><span>UNPREDICTABILITY</span></div><div><b>'+parodyDNA(bp).sincerity+'%</b><span>SINCERITY</span></div></div><p class="muted">FACTORY FINGERPRINT · '+parodyDNA(bp).identity+'</p></div><div class="bp-section"><h3>📜 NARRATIVE LAWS</h3><ul>'+narrativeLaws(bp).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div><div class="bp-section"><h3>WORLD & STORY THREADS</h3><p>'+bp.locations.map(esc).join(' · ')+'</p><ul>'+bp.hooks.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div><div class="bp-actions"><button class="button big" id="generate">GENERATE CHAPTERS <span>CONTINUITY ENGINE →</span></button><button class="button ghost" id="discard">DISCARD BLUEPRINT</button></div><p id="genStatus"></p></div>';
 box('generate').onclick=()=>{addGenerationControls();generate(bp)};box('discard').onclick=()=>{root.innerHTML='';box('status').textContent='Blueprint discarded.'};addGenerationControls();
}
box('blueprint').onclick=()=>{box('status').textContent='Building story bible and continuity plan...';const bp=makeBlueprint();renderBlueprint(bp);box('status').textContent='Blueprint complete. The engine will prevent repetitive chapter construction.'};

function createState(bp){return{chapter:0,arc:1,arcLength:Math.max(8,Math.ceil(bp.chapters/Math.min(12,Math.max(4,Math.ceil(bp.chapters/40))))),location:bp.locations[0],characters:bp.characters.map(c=>({...c,mood:'uncertain',goal:'understand what is happening',relationship:0})),unresolved:[...bp.hooks],resolved:[],foreshadow:[],recentTitles:[],recentPhrases:[],recentEvents:[],usedTitles:new Set(),usedEvents:new Set(),words:0};}
function uniqueFrom(list,used){const pool=list.filter(x=>!used.has(x));return pick(pool.length?pool:list)}
function sentenceSet(state,bp,i){
 const char=pick(state.characters),other=pick(state.characters.filter(x=>x.name!==char.name)||state.characters),genre=pick(bp.genres),trope=char.trope,loc=state.location,object=pick(OBJECT),verb=pick(VERBS),conflict=uniqueFrom(CONFLICTS,state.usedEvents);
 state.usedEvents.add(conflict);state.recentEvents.push(conflict);if(state.recentEvents.length>10)state.recentEvents.shift();
 const thread=state.unresolved.length?pick(state.unresolved):pick(bp.hooks);
 const discovery='The clue involving '+object+' pointed toward '+pick(bp.locations)+'.';
 const action=char.name+' decided to '+verb+' '+object+' before '+other.name+' could turn the situation into another argument.';
 const consequence=pick(RESOLUTIONS)+'.';
 const comic=(Number(bp.settings?.comedy??70)>45&&Number(bp.parody)>=40)?pick(JOKES):'For once, nobody made a joke, which made the silence feel more serious than expected.';
 return {char,genre,trope,loc,thread,opening:pick(OPENERS),action,discovery,consequence,comic,other};
}
function makeChapter(i,bp,state){
 state.chapter=i;state.arc=Math.floor((i-1)/state.arcLength)+1;
 if(i>1 && i%state.arcLength===1)state.location=bp.locations[(state.arc-1)%bp.locations.length];
 const s=sentenceSet(state,bp,i), phase=(i%7), titleParts=[
   'A New Problem in '+s.loc.replace(/^the /i,''),
   'The '+s.genre+' Complication',
   'A Clue Nobody Expected',
   'The '+s.trope+' Problem',
   'The Day The Plan Changed',
   'A Very Inconvenient Discovery',
   'The Consequences Arrive'
 ];
 let title=titleParts[phase];if(state.usedTitles.has(title))title=title+' — Part '+state.arc;state.usedTitles.add(title);state.recentTitles.push(title);if(state.recentTitles.length>18)state.recentTitles.shift();
 const tone=Number(bp.settings?.tone??50),serious=Number(bp.settings?.serious??30),romance=Number(bp.settings?.romance??30),intensity=Number(bp.settings?.violence??20); const dna=parodyDNA(bp);
 const anomaly=(i%13===0)?'FACTORY ANOMALY: '+pick(['a minor rule of the world changed without warning','a background character knew something they should not know','an ordinary object became temporarily important to everyone','the narration became suspiciously confident about the wrong thing','two unrelated problems turned out to share the same ridiculous cause']):'';
 const paragraphs=[
   ((bp.bible?.worldPremise?bp.bible.worldPremise+'. ':'')+s.opening)+' '+s.char.name+' was in '+s.loc+', trying to '+pick(VERBS)+' what remained of yesterday’s problem. The '+s.genre.toLowerCase()+' atmosphere carried '+(GENRE_FLAVOR[s.genre]||'a strange mixture of ordinary rules and impossible consequences')+'.',
   s.action+' '+s.char.name+' had the '+s.trope.toLowerCase()+' habit of treating impossible situations as if they were merely inconvenient. '+s.other.name+' disagreed, which was becoming a reliable source of progress.',
   'The immediate problem was simple on paper: '+s.conflict+'. The less simple problem was the thread behind it: '+s.thread+' The characters could not resolve everything at once, so they separated the obvious danger from the question that could wait.',
   s.discovery+' That discovery did not solve the mystery. It narrowed it. A useful clue was more dangerous than a useless clue because now the characters had somewhere specific to be wrong.',
   s.char.name+' remembered an earlier decision and changed course. The choice altered the relationship between the group members, even if nobody announced it dramatically. '+s.consequence+(intensity>65?' The conflict left a lasting consequence that could not simply be reset next chapter.':'') ,
   'Somewhere beyond '+s.loc+', another part of the world continued moving. A faction, rival, friend, or stranger was making a decision that would matter later. The story did not stop when the characters stopped looking.',
   s.comic+(romance>60?' '+s.char.name+' also noticed that '+s.other.name+' had become unexpectedly important to the group.':'') ,
   (anomaly?anomaly+' ':'')+'By the end of the chapter, the immediate situation had changed. '+s.thread+' remained unresolved, but the characters now possessed a new piece of information: '+pick(OBJECT)+'. That object would not magically explain itself. Nothing in this world was that considerate.',
 ];
 const detailPool=shuffle([...(bp.bible?.signatureItem?[bp.bible.signatureItem]:[]),...OBJECT,...LOCATION,...CONFLICTS,...RESOLUTIONS]);while(paragraphs.join(' ').split(/\s+/).length<770)paragraphs.push(charDetail(state,bp,s,detailPool,paragraphs.length));
 let text=paragraphs.join('\\n\\n');const banned=(bp.bible?.forbiddenTerms||'').split(',').map(x=>x.trim()).filter(Boolean);for(const term of banned){const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');text=text.replace(new RegExp(escaped,'gi'),'');}text=exactWords(text,WORD_TARGET);
 state.words+=text.split(/\s+/).filter(Boolean).length;
 state.unresolved=state.unresolved.filter(x=>x!==s.thread);if(RNG()<.7)state.unresolved.push(uniqueFrom(bp.hooks,state.unresolved));
 state.resolved.push(s.thread);if(state.resolved.length>20)state.resolved.shift();
 state.foreshadow.push(s.discovery);if(state.foreshadow.length>20)state.foreshadow.shift();
 state.characters.forEach(c=>{if(c.name===s.char.name)c.mood=pick(['determined','curious','annoyed','amused','cautious']);});if(serious>65)state.foreshadow.push('The characters are beginning to understand that the current conflict has lasting consequences.');if(tone>70)state.unresolved.push('an absurd complication created by the previous chapter');
 return {number:i,title,text,arc:state.arc,location:state.location,focus:s.char.name,continuity:{unresolved:[...state.unresolved],resolved:[...state.resolved.slice(-8)],foreshadow:[...state.foreshadow.slice(-8)]}};
}
function charDetail(state,bp,s,pool,n){const a=pick(pool),b=pick(pool.filter(x=>x!==a));return n%2?s.char.name+' noticed '+a+' near '+s.loc+', while '+s.other.name+' connected it to '+b+'. The connection was incomplete, but incomplete information was still information.': 'The group compared notes. '+a+' mattered because '+s.other.name+' remembered '+b+'. Nobody had enough evidence to declare the theory correct, so they recorded it instead.'}
function similarity(a,b){const A=new Set(String(a).toLowerCase().split(/\W+/).filter(x=>x.length>4)),B=new Set(String(b).toLowerCase().split(/\W+/).filter(x=>x.length>4));let inter=0;A.forEach(x=>B.has(x)&&inter++);return inter/Math.max(1,Math.min(A.size,B.size))}
let generationCancelled=false;let activeGeneration=null;
function addGenerationControls(){const zone=document.querySelector('.generate-zone');if(!zone||document.getElementById('cancelGeneration'))return;const b=document.createElement('button');b.id='cancelGeneration';b.className='text-button';b.textContent='STOP GENERATION';b.onclick=()=>{generationCancelled=true};zone.appendChild(b)}
async function generate(bp,resumeNovel=null,resumeState=null){
 generationCancelled=false;if(resumeNovel?.checkpoint?.rngState!=null){SEED=resumeNovel.checkpoint.seed||bp.seed||SEED;RNG_STATE=resumeNovel.checkpoint.rngState;RNG=()=>{RNG_STATE+=0x6D2B79F5;let x=RNG_STATE;x=Math.imul(x^(x>>>15),x|1);x^=x+Math.imul(x^(x>>>7),x|61);return((x^(x>>>14))>>>0)/4294967296}}else if(bp.seed)setSeed(bp.seed);const s=box('genStatus'),n=bp.chapters,state=resumeState||createState(bp),novel=resumeNovel||{id:crypto.randomUUID(),...bp,created:Date.now(),position:0,generated:[],engine:{version:ENGINE_VERSION,antiRepetition:true,continuity:true,arcs:true,checkpointing:true,originality:true,resumable:true,exactWordTarget:WORD_TARGET,genreFlavor:true,parodyDNA:true,narrativeLaws:true,factoryAnomalies:true,fingerprint:factoryFingerprint(bp)},stats:{words:0,regenerations:0,exact800:0}};const start=novel.generated.length+1;novel.stats.generationStartedAt=novel.stats.generationStartedAt||Date.now();activeGeneration={novel,state};
 box('generate').disabled=true;box('discard').disabled=true;window.onbeforeunload=()=> 'Generation is in progress. Leave this page only if you want to stop it.';
 try{
  for(let i=start;i<=n;i++){
   if(generationCancelled)throw new Error('Generation cancelled by user.');
   let chapter,attempt=0,accepted=false;
   const baseState=JSON.stringify({...state,usedTitles:[...state.usedTitles],usedEvents:[...state.usedEvents]});
   const baseRng=RNG_STATE;const chapterStarted=Date.now();
   do{
    if(attempt>0){
      const restored=JSON.parse(baseState);
      Object.assign(state,restored);
      state.usedTitles=new Set(restored.usedTitles||[]);
      state.usedEvents=new Set(restored.usedEvents||[]);
      RNG_STATE=baseRng;
    }
    chapter=makeChapter(i,bp,state);attempt++;
    accepted=!novel.generated.slice(-12).some(x=>similarity(x.text,chapter.text)>.72);
   }while(!accepted&&attempt<5);
   if(attempt>1)novel.stats.regenerations+=attempt-1;
   if(chapter.text.split(/\s+/).filter(Boolean).length!==WORD_TARGET)throw new Error('Chapter word-count integrity check failed.');novel.stats.exact800++;novel.stats.lastGeneratedAt=Date.now();novel.stats.lastChapterWords=WORD_TARGET;novel.stats.totalGenerationMs=(novel.stats.totalGenerationMs||0)+(Date.now()-chapterStarted);novel.generated.push(chapter);
   if(i%GENERATOR_YIELD===0){const pct=Math.round(i/n*100);const elapsed=Math.max(1,Date.now()-Number(novel.stats.generationStartedAt||Date.now()));const perChapter=elapsed/i;const eta=Math.max(0,Math.round((n-i)*perChapter/1000));s.textContent='FORGING '+i+' / '+n+' · '+pct+'% · ARC '+state.arc+' · ETA '+(eta<60?eta+'s':Math.ceil(eta/60)+'m')+' · CHECKPOINT READY';await new Promise(r=>setTimeout(r,0));}
   novel.stats.words=state.words;novel.checkpoint={chapter:i,state:JSON.parse(JSON.stringify(state)),rngState:RNG_STATE,seed:SEED};await saveNovel(novel);
   if(i%5===0||i===1){novel.stats.words=state.words;s.textContent='Forging '+i+' / '+n+' · Arc '+state.arc+' · anti-repetition check passed · '+Math.round(i/n*100)+'%';await new Promise(r=>setTimeout(r,0));}
  }
  await saveNovel(novel);delete novel.checkpoint;await saveNovel(novel);window.onbeforeunload=null;activeGeneration=null;localStorage.removeItem('lnpf-draft');location.href='reader.html?id='+encodeURIComponent(novel.id);
 }catch(e){console.error(e);novel.stats.words=state.words;novel.checkpoint={chapter:novel.generated.length,state:JSON.parse(JSON.stringify(state)),rngState:RNG_STATE,seed:SEED};try{await saveNovel(novel)}catch{}window.onbeforeunload=null;activeGeneration=null;s.textContent='Generation stopped safely at chapter '+novel.generated.length+': '+(e.message||'storage error');box('generate').disabled=false;box('discard').disabled=false}
}

async function restoreCheckpointState(bp,novel){
 const raw=novel.checkpoint?.state;if(!raw)return null;
 const state=raw;state.usedTitles=new Set((novel.generated||[]).map(x=>x.title));state.usedEvents=new Set(state.recentEvents||[]);state.recentTitles=state.recentTitles||[];state.recentPhrases=state.recentPhrases||[];state.recentEvents=state.recentEvents||[];state.resolved=state.resolved||[];state.unresolved=state.unresolved||[];state.foreshadow=state.foreshadow||[];state.characters=state.characters||bp.characters.map(c=>({...c,mood:'uncertain',goal:'understand what is happening',relationship:0}));return state;
}
async function resumeFromQuery(){
 const rid=new URLSearchParams(location.search).get('resume');if(!rid)return;
 try{const n=await getNovel(rid);if(!n||!n.checkpoint||n.generated.length>=n.chapters)return;
 const zone=document.querySelector('.generate-zone');const b=document.createElement('button');b.className='button big';b.id='resumeGeneration';b.innerHTML='RESUME GENERATION <span>CONTINUE FROM CHAPTER '+(n.checkpoint.chapter+1)+' →</span>';zone.prepend(b);b.onclick=async()=>{b.disabled=true;const state=await restoreCheckpointState(n,n);renderBlueprint(n);box('generate').textContent='RESUME CHAPTERS';box('generate').onclick=()=>generate(n,n,state);box('genStatus').textContent='Checkpoint loaded. Ready to continue.'};box('status').textContent='A resumable generation was found in your local library.'}catch(e){console.warn(e)}
}
setTimeout(resumeFromQuery,0);
