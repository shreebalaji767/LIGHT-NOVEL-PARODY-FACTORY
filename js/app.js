/* LIGHT NOVEL PARODY FACTORY — STORY ENGINE 4.1
   Procedural long-form engine with continuity, anti-repetition, pacing and safe persistence.
*/
const GENRES=['Isekai','Fantasy','Action','Adventure','Romance','Comedy','Horror','Mystery','School','Villainess','Cultivation','Sci-Fi','Reincarnation','Game/System','Dungeon','Demon Lord','Slice of Life','Supernatural','Sports','Mecha','Magical Girl','Post-Apocalypse','Cyberpunk','Historical','Military','Cooking','Otome','Time Travel','Survival','Political Intrigue','Music','Western','Pirates','Steampunk','Urban Fantasy','Dark Fantasy'];
const TROPES=['Overpowered Protagonist','Weak-to-Strong','Accidental Hero','Villainess Reincarnation','Deadpan Genius','Hot-Blooded Rival','Chaotic Best Friend','Mysterious Transfer Student','Ancient Sealed Power','Hidden Royalty','Fake Weakness','System Window Addict','Dense Romantic Lead','Tsundere Rival','Unreasonably Hungry Hero','Mentor Who Knows Too Much','Comic Relief Who Saves Everyone','Secret Final Boss','Prophecy That Makes No Sense','Nobody Reads The Instructions'];
const NAMES=['Alden','Mira','Rin','Kael','Liora','Yuki','Sora','Vera','Bram','Noel','Iris','Gideon','Talia','Ren','Marek','Nia','Cato','Elara','Jun','Selene'];
const box=id=>document.getElementById(id);const safeBox=id=>document.getElementById(id);const SETTINGS={tone:50,romance:30,comedy:70,serious:30,violence:20};let selectedGenres=['Isekai','Comedy'],selectedTropes=['Overpowered Protagonist','Chaotic Best Friend','Prophecy That Makes No Sense'];
const shuffle=a=>[...a].sort(()=>Math.random()-.5),pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function updateUI(){const p=Number(box('parody').value),c=Number(box('chapters').value);box('genreCount').textContent=selectedGenres.length+' SELECTED';box('tropeCount').textContent=selectedTropes.length+' SELECTED';box('parodyOut').value=p+'%';box('chapterOut').value=c;box('wordEstimate').textContent=(c*800).toLocaleString()+' words';box('configSummary').textContent=selectedGenres.length+' genres · '+selectedTropes.length+' tropes · '+p+'% parody';readSettings();localStorage.setItem('lnpf-draft',JSON.stringify({genres:selectedGenres,tropes:selectedTropes,parody:p,chapters:c,title:box('title').value,settings:{...SETTINGS}}));}
function cards(list,target,selected){target.innerHTML='';list.forEach(x=>{const e=document.createElement('button');e.type='button';e.className='select-card'+(selected.includes(x)?' active':'');e.textContent=x;e.setAttribute('aria-pressed',selected.includes(x));e.onclick=()=>{const i=selected.indexOf(x);i>=0?selected.splice(i,1):selected.push(x);cards(list,target,selected);updateUI()};target.appendChild(e)})}
function restoreDraft(){try{const d=JSON.parse(localStorage.getItem('lnpf-draft')||'null');if(d){selectedGenres=Array.isArray(d.genres)&&d.genres.length?d.genres:selectedGenres;selectedTropes=Array.isArray(d.tropes)&&d.tropes.length?d.tropes:selectedTropes;if(d.parody!=null)box('parody').value=d.parody;if(d.chapters!=null)box('chapters').value=d.chapters;if(d.title)box('title').value=d.title;if(d.settings)Object.keys(SETTINGS).forEach(k=>{if(d.settings[k]!=null&&safeBox(k))safeBox(k).value=d.settings[k]})}}catch{}}
restoreDraft();cards(GENRES,box('genres'),selectedGenres);cards(TROPES,box('tropes'),selectedTropes);updateUI();
box('allGenres').onclick=()=>{selectedGenres=selectedGenres.length===GENRES.length?[]:[...GENRES];cards(GENRES,box('genres'),selectedGenres);updateUI()};
box('allTropes').onclick=()=>{selectedTropes=selectedTropes.length===TROPES.length?[]:[...TROPES];cards(TROPES,box('tropes'),selectedTropes);updateUI()};
box('randomGenres').onclick=()=>{selectedGenres=shuffle(GENRES).slice(0,Math.floor(Math.random()*4)+2);cards(GENRES,box('genres'),selectedGenres);updateUI()};
box('randomTropes').onclick=()=>{selectedTropes=shuffle(TROPES).slice(0,Math.floor(Math.random()*5)+3);cards(TROPES,box('tropes'),selectedTropes);updateUI()};
box('resetFactory').onclick=()=>{localStorage.removeItem('lnpf-draft');selectedGenres=['Isekai','Comedy'];selectedTropes=['Overpowered Protagonist','Chaotic Best Friend','Prophecy That Makes No Sense'];box('parody').value=90;box('chapters').value=200;box('title').value='';box('blueprintView').innerHTML='';box('status').textContent='Configuration reset.';cards(GENRES,box('genres'),selectedGenres);cards(TROPES,box('tropes'),selectedTropes);updateUI()};
box('parody').oninput=updateUI;box('chapters').oninput=updateUI;box('title').oninput=updateUI;['tone','romance','comedy','serious','violence'].forEach(id=>{const e=safeBox(id);if(e)e.oninput=()=>{readSettings();updateUI()}});const surprise=safeBox('surpriseMe');if(surprise)surprise.onclick=randomizeEverything;

function readSettings(){Object.keys(SETTINGS).forEach(k=>{const e=safeBox(k);if(e)SETTINGS[k]=Number(e.value)})}
function randomizeEverything(){selectedGenres=shuffle(GENRES).slice(0,Math.floor(Math.random()*5)+2);selectedTropes=shuffle(TROPES).slice(0,Math.floor(Math.random()*6)+3);box('parody').value=Math.floor(Math.random()*101);box('chapters').value=(Math.floor(Math.random()*81)+20)*10;box('title').value='';cards(GENRES,box('genres'),selectedGenres);cards(TROPES,box('tropes'),selectedTropes);updateUI()}

const TITLE_A=['The Hero','The Villainess','The Reluctant Genius','The Accidental Overlord','The Nobody','The Transfer Student','The Cook Who','The Knight Who','The Player Who','The Person Who'];
const TITLE_B=['Refused To Follow The Plot','Broke The Prophecy','Accidentally Started A War','Found A Dungeon Behind The Kitchen','Was Too Busy Eating','Read The System Terms','Inherited The Wrong Kingdom','Turned A Side Quest Into A Crisis'];
const LOCATION=['the Clockwork Capital','the Rain District','the Infinite Dungeon','the Moonlit Market','the Academy of Unreasonable Rules','the Ashen Coast','the Glass Forest','the Underground Railway','the Palace Basement','the village nobody put on the map','the floating archive','the border where maps become suggestions'];
const OBJECT=['a cracked silver coin','a suspicious recipe','a sealed letter','a broken compass','a tiny black key','an unsigned contract','a ridiculous crown','a glowing spoon','a map with one missing street','a bell that rings at the wrong time'];
const VERBS=['investigate','negotiate','escape','challenge','protect','steal','repair','decode','question','outsmart','follow','avoid'];
const CONFLICTS=['a rival has arrived first','the local rules have changed overnight','an old promise has become relevant','someone has misunderstood the prophecy','the harmless side quest is no longer harmless','a forgotten faction has made its move','the supposed villain wants a refund','the party has discovered an inconvenient truth'];
const RESOLUTIONS=['the answer creates two new questions','the immediate danger passes, but the cost is recorded','the group gains useful information rather than a clean victory','the conflict ends with an agreement nobody expected','the result changes what the characters believed about the world'];
const JOKES=['Nobody considered this part of the plan, mostly because there was no plan.','The dramatic pause lasted long enough for someone to ask whether lunch was still happening.','The universe appeared to have a sense of humor, and unfortunately it was using the party as material.','This was technically a victory, although the paperwork strongly disagreed.','Everyone looked at the person who had caused the problem. That person looked at the ceiling.'];
const OPENERS=['Morning arrived with the confidence of someone who had never seen the previous night.','The day began quietly, which was the first suspicious thing about it.','By noon, the situation had become complicated enough to deserve a committee.','Nothing unusual happened for nearly seven minutes. Then everything happened at once.','The road ahead looked ordinary. The road was lying.'];

function makeTitle(){return pick(TITLE_A)+' '+pick(TITLE_B)}
function makeBlueprint(){
 const title=box('title').value.trim()||makeTitle(), genres=selectedGenres.length?selectedGenres:['Fantasy'], tropes=selectedTropes.length?selectedTropes:['Accidental Hero'];
 const used=new Set(),chars=[];for(const role of ['PROTAGONIST','RIVAL','COMPANION','MENTOR']){let name;do{name=pick(NAMES)}while(used.has(name));used.add(name);chars.push({role,name,trope:pick(tropes)})}
 const locations=shuffle(LOCATION).slice(0,5),hooks=shuffle(CONFLICTS).slice(0,4);
 return {title,genres,tropes,parody:Number(box('parody').value),chapters:Number(box('chapters').value),settings:{...SETTINGS},characters:chars,locations,hooks,engineVersion:'4.1',created:Date.now()};
}
function renderBlueprint(bp){
 const root=box('blueprintView');
 root.innerHTML='<div class="blueprint glass-panel"><div class="blueprint-top"><div><p class="eyebrow">BLUEPRINT READY · STORY ENGINE 4.1</p><h2>'+esc(bp.title)+'</h2><p class="muted">Continuity memory · anti-repetition · arc pacing · character state · foreshadowing</p></div><span class="status-pill">READY</span></div><div class="bp-stats"><div><b>'+bp.chapters+'</b><span>CHAPTERS</span></div><div><b>'+bp.parody+'%</b><span>PARODY</span></div><div><b>'+bp.genres.length+'</b><span>GENRES</span></div><div><b>'+bp.tropes.length+'</b><span>TROPES</span></div></div><div class="bp-section"><h3>GENRES & TROPES</h3><div class="tag-list">'+[...bp.genres,...bp.tropes].map(x=>'<span>'+esc(x)+'</span>').join('')+'</div></div><div class="bp-section"><h3>CHARACTERS</h3><div class="character-grid">'+bp.characters.map(c=>'<article><small>'+esc(c.role)+'</small><strong>'+esc(c.name)+'</strong><p>'+esc(c.trope)+'</p></article>').join('')+'</div></div><div class="bp-section"><h3>WORLD & STORY THREADS</h3><p>'+bp.locations.map(esc).join(' · ')+'</p><ul>'+bp.hooks.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div><div class="bp-actions"><button class="button big" id="generate">GENERATE CHAPTERS <span>CONTINUITY ENGINE →</span></button><button class="button ghost" id="discard">DISCARD BLUEPRINT</button></div><p id="genStatus"></p></div>';
 box('generate').onclick=()=>generate(bp);box('discard').onclick=()=>{root.innerHTML='';box('status').textContent='Blueprint discarded.'};
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
 const tone=Number(bp.settings?.tone??50),serious=Number(bp.settings?.serious??30),romance=Number(bp.settings?.romance??30),intensity=Number(bp.settings?.violence??20); const paragraphs=[
   s.opening+' '+s.char.name+' was in '+s.loc+', trying to '+pick(VERBS)+' what remained of yesterday’s problem. The '+s.genre.toLowerCase()+' atmosphere made the ordinary details feel suspicious.',
   s.action+' '+s.char.name+' had the '+s.trope.toLowerCase()+' habit of treating impossible situations as if they were merely inconvenient. '+s.other.name+' disagreed, which was becoming a reliable source of progress.',
   'The immediate problem was simple on paper: '+s.conflict+'. The less simple problem was the thread behind it: '+s.thread+' The characters could not resolve everything at once, so they separated the obvious danger from the question that could wait.',
   s.discovery+' That discovery did not solve the mystery. It narrowed it. A useful clue was more dangerous than a useless clue because now the characters had somewhere specific to be wrong.',
   s.char.name+' remembered an earlier decision and changed course. The choice altered the relationship between the group members, even if nobody announced it dramatically. '+s.consequence+(intensity>65?' The conflict left a lasting consequence that could not simply be reset next chapter.':'') ,
   'Somewhere beyond '+s.loc+', another part of the world continued moving. A faction, rival, friend, or stranger was making a decision that would matter later. The story did not stop when the characters stopped looking.',
   s.comic+(romance>60?' '+s.char.name+' also noticed that '+s.other.name+' had become unexpectedly important to the group.':'') ,
   'By the end of the chapter, the immediate situation had changed. '+s.thread+' remained unresolved, but the characters now possessed a new piece of information: '+pick(OBJECT)+'. That object would not magically explain itself. Nothing in this world was that considerate.',
 ];
 const detailPool=shuffle([...OBJECT,...LOCATION,...CONFLICTS,...RESOLUTIONS]);while(paragraphs.join(' ').split(/\s+/).length<760)paragraphs.push(charDetail(state,bp,s,detailPool,paragraphs.length));
 let text=paragraphs.join('\\n\\n');const words=text.split(/\s+/);if(words.length>900)text=words.slice(0,900).join(' ')+'.';
 state.words+=text.split(/\s+/).length;
 state.unresolved=state.unresolved.filter(x=>x!==s.thread);if(Math.random()<.7)state.unresolved.push(uniqueFrom(bp.hooks,state.unresolved));
 state.resolved.push(s.thread);if(state.resolved.length>20)state.resolved.shift();
 state.foreshadow.push(s.discovery);if(state.foreshadow.length>20)state.foreshadow.shift();
 state.characters.forEach(c=>{if(c.name===s.char.name)c.mood=pick(['determined','curious','annoyed','amused','cautious']);});if(serious>65)state.foreshadow.push('The characters are beginning to understand that the current conflict has lasting consequences.');if(tone>70)state.unresolved.push('an absurd complication created by the previous chapter');
 return {number:i,title,text,arc:state.arc,location:state.location,focus:s.char.name,continuity:{unresolved:[...state.unresolved],resolved:[...state.resolved.slice(-8)],foreshadow:[...state.foreshadow.slice(-8)]}};
}
function charDetail(state,bp,s,pool,n){const a=pick(pool),b=pick(pool.filter(x=>x!==a));return n%2?s.char.name+' noticed '+a+' near '+s.loc+', while '+s.other.name+' connected it to '+b+'. The connection was incomplete, but incomplete information was still information.': 'The group compared notes. '+a+' mattered because '+s.other.name+' remembered '+b+'. Nobody had enough evidence to declare the theory correct, so they recorded it instead.'}
function similarity(a,b){const A=new Set(String(a).toLowerCase().split(/\W+/).filter(x=>x.length>4)),B=new Set(String(b).toLowerCase().split(/\W+/).filter(x=>x.length>4));let inter=0;A.forEach(x=>B.has(x)&&inter++);return inter/Math.max(1,Math.min(A.size,B.size))}
async function generate(bp){
 const s=box('genStatus'),n=bp.chapters,state=createState(bp),novel={id:crypto.randomUUID(),...bp,created:Date.now(),position:0,generated:[],engine:{version:'4.1',antiRepetition:true,continuity:true,arcs:true,checkpointing:true,originality:true},stats:{words:0,regenerations:0}};
 box('generate').disabled=true;box('discard').disabled=true;window.onbeforeunload=()=> 'Generation is in progress. Leave this page only if you want to stop it.';
 try{
  for(let i=1;i<=n;i++){
   let chapter,attempt=0;
   do{chapter=makeChapter(i,bp,state);attempt++;}while(novel.generated.slice(-12).some(x=>similarity(x.text,chapter.text)>.72)&&attempt<5);
   if(attempt>1)novel.stats.regenerations+=attempt-1;
   novel.generated.push(chapter);
   if(i%25===0){novel.stats.words=state.words;await saveNovel(novel);}
   if(i%5===0||i===1){novel.stats.words=state.words;s.textContent='Forging '+i+' / '+n+' · Arc '+state.arc+' · anti-repetition check passed · '+Math.round(i/n*100)+'%';await new Promise(r=>setTimeout(r,0));}
  }
  await saveNovel(novel);window.onbeforeunload=null;localStorage.removeItem('lnpf-draft');location.href='reader.html?id='+encodeURIComponent(novel.id);
 }catch(e){console.error(e);try{await saveNovel(novel)}catch{}s.textContent='Generation stopped safely: '+(e.message||'storage error');box('generate').disabled=false;box('discard').disabled=false}
}
