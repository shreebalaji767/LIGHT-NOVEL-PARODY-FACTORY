/* LIGHT NOVEL PARODY FACTORY — READER 14.0 */
const id=new URLSearchParams(location.search).get('id');
let novel,index=0,chapterList=[],currentChapter=null;

const root=()=>document.getElementById('reader');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey=(kind,i=index)=>'lnpf-reader-'+kind+'-'+(novel?.id||'unknown')+(i==null?'':'-'+i);
const marks=()=>{try{return JSON.parse(localStorage.getItem(storageKey('bookmarks'))||'[]')}catch{return[]}};
const saveMarks=v=>localStorage.setItem(storageKey('bookmarks'),JSON.stringify(v));

async function boot(){
 try{
  novel=await getNovelMeta(id);
  if(!novel){showError('Novel not found.');return}
  chapterList=await getChapterList(id);
  if(!chapterList.length){showError('No chapters found.');return}
  index=Math.min(Math.max(0,Number(novel.position||0)),chapterList.length-1);
  await loadChapter(index);
 }catch(e){showError('Reader storage error.',e.message)}
}
function showError(title,detail=''){root().innerHTML='<div class="reader-error"><h1>'+esc(title)+'</h1><p>'+esc(detail)+'</p><a class="button" href="library.html">RETURN TO LIBRARY</a></div>'}
async function loadChapter(i){index=Math.min(Math.max(0,Number(i)),chapterList.length-1);currentChapter=await getChapter(id,index);render()}
function render(){
 const c=currentChapter;if(!c)return;
 const total=chapterList.length,chapterProgress=total<=1?100:Math.round(index/(total-1)*100);
 const scrollKey=storageKey('scroll');const theme=localStorage.getItem('lnpf-reader-theme')||'night';
 const marked=marks().includes(index);document.body.dataset.readerTheme=theme;document.title=novel.title+' · Chapter '+c.number;
 const words=String(c.text||'').trim().split(/\s+/).filter(Boolean).length;
 const minutes=Math.max(1,Math.ceil(words/220));
 root().innerHTML='<div class="reader-progress"><span id="scrollProgress" style="width:0%"></span></div>'+
 '<div class="reader-toolbar"><div class="reader-tools-left"><span class="reader-progress-label">'+chapterProgress+'% BOOK · ARC '+(c.arc||'?')+' · '+minutes+' MIN · '+words+' WORDS</span></div>'+
 '<div class="reader-tools-right"><button id="chapterMenu">☰ CHAPTERS</button><button id="bookmarkBtn" aria-pressed="'+marked+'">'+(marked?'★ SAVED':'☆ SAVE')+'</button><button id="noteBtn">✎ NOTE</button><button id="themeBtn">◐ THEME</button><button id="fontDown">A−</button><button id="fontUp">A+</button><button id="exportBtn">⇩ EXPORT</button><button id="fullBtn">⛶ FULL</button></div></div>'+
 '<div class="reader-drawer" id="chapterDrawer" hidden><div class="drawer-head"><strong>CHAPTERS · '+total+'</strong><input id="chapterSearch" type="search" placeholder="Search chapter titles…" aria-label="Search chapter titles"></div><div id="chapterList"></div></div>'+
 '<div class="reader-head"><p class="eyebrow">'+esc(novel.title)+'</p><div class="chapter">CHAPTER '+c.number+' / '+novel.chapters+(c.arc?' · ARC '+c.arc:'')+'</div><h1>'+esc(c.title)+'</h1><div class="reader-author">AUTHOR · '+esc(novel.author||'BLLSNVJ21')+'</div><div class="reader-meta">'+(novel.genres||[]).map(esc).join(' · ')+' <span>·</span> '+novel.parody+'% PARODY <span>·</span> '+(c.focus?esc(c.focus):'STORY')+' FOCUS</div></div>'+
 '<div class="reader-note-box" id="noteBox" hidden><label for="readerNote">CHAPTER NOTE</label><textarea id="readerNote" rows="4" placeholder="Write a private note about this chapter…">'+esc(localStorage.getItem(storageKey('note'))||'')+'</textarea><div><button id="saveNote" class="mini">SAVE NOTE</button><button id="closeNote" class="mini">CLOSE</button></div></div>'+
 '<div class="novel-text" style="--reader-scale:'+getScale()+'">'+formatText(c.text)+'</div>'+
 '<div class="controls"><button id="prevBtn" '+(index===0?'disabled':'')+'>← PREVIOUS</button><span>CHAPTER '+(index+1)+' / '+total+'</span><button id="nextBtn" '+(index===total-1?'disabled':'')+'>NEXT →</button></div>';
 bindControls();populateChapterList();updateNovelMeta(id,{position:index}).catch(()=>{});
 setTimeout(()=>{const saved=Number(localStorage.getItem(scrollKey)||0);if(saved)scrollTo({top:saved,behavior:'auto'});updateScrollProgress()},0);
}
function bindControls(){
 document.getElementById('chapterMenu').onclick=toggleDrawer;
 document.getElementById('bookmarkBtn').onclick=toggleBookmark;
 document.getElementById('noteBtn').onclick=()=>document.getElementById('noteBox').hidden=!document.getElementById('noteBox').hidden;
 document.getElementById('saveNote').onclick=()=>{localStorage.setItem(storageKey('note'),document.getElementById('readerNote').value);document.getElementById('noteBox').hidden=true};
 document.getElementById('closeNote').onclick=()=>document.getElementById('noteBox').hidden=true;
 document.getElementById('themeBtn').onclick=changeTheme;
 document.getElementById('fontDown').onclick=()=>changeFont(-1);
 document.getElementById('fontUp').onclick=()=>changeFont(1);
 document.getElementById('exportBtn').onclick=exportBook;
 document.getElementById('fullBtn').onclick=toggleFullscreen;
 document.getElementById('prevBtn').onclick=prev;document.getElementById('nextBtn').onclick=next;
}
function populateChapterList(){
 const list=document.getElementById('chapterList'),search=document.getElementById('chapterSearch');
 const draw=()=>{const q=search.value.trim().toLowerCase();list.innerHTML=chapterList.map((x,i)=>({x,i})).filter(o=>!q||String(o.x.title).toLowerCase().includes(q)||String(o.x.number).includes(q)).map(o=>'<button class="chapter-item '+(o.i===index?'active':'')+'" data-index="'+o.i+'"><span>CH '+o.x.number+'</span><strong>'+esc(o.x.title)+'</strong>'+(marks().includes(o.i)?'<b>★</b>':'')+'</button>').join('')||'<p class="muted">No chapters found.</p>';list.querySelectorAll('.chapter-item').forEach(b=>b.onclick=async()=>{await loadChapter(Number(b.dataset.index));toggleDrawer();scrollTo({top:0,behavior:'smooth'})})};
 search.oninput=draw;draw();
}
function toggleDrawer(){const d=document.getElementById('chapterDrawer');d.hidden=!d.hidden;if(!d.hidden)document.getElementById('chapterSearch').focus()}
function toggleBookmark(){const a=marks(),i=a.indexOf(index);i>=0?a.splice(i,1):a.push(index);a.sort((x,y)=>x-y);saveMarks(a);render()}
function formatText(t){return String(t||'').split(/\n\n+/).map(x=>'<p>'+esc(x.trim())+'</p>').join('')||'<p>Empty chapter.</p>'}
function updateScrollProgress(){const max=document.documentElement.scrollHeight-innerHeight,p=max<=0?100:Math.round(scrollY/max*100),bar=document.getElementById('scrollProgress');if(bar)bar.style.width=Math.max(0,Math.min(100,p))+'%';if(novel)localStorage.setItem(storageKey('scroll'),String(Math.round(scrollY)))}
window.addEventListener('scroll',updateScrollProgress,{passive:true});
async function prev(){if(index>0){await loadChapter(index-1);scrollTo({top:0,behavior:'smooth'})}}
async function next(){if(index<chapterList.length-1){await loadChapter(index+1);scrollTo({top:0,behavior:'smooth'})}}
function getScale(){return Number(localStorage.getItem('lnpf-reader-scale')||1)}
function changeFont(d){localStorage.setItem('lnpf-reader-scale',Math.min(1.35,Math.max(.8,getScale()+d*.08)).toFixed(2));render()}
function changeTheme(){const a=['night','sepia','paper'],t=localStorage.getItem('lnpf-reader-theme')||'night';localStorage.setItem('lnpf-reader-theme',a[(a.indexOf(t)+1)%a.length]);render()}
function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()}
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','BUTTON','SELECT'].includes(document.activeElement?.tagName))return;const k=e.key.toLowerCase();if(e.key==='ArrowLeft'||k==='a'){e.preventDefault();prev()}else if(e.key==='ArrowRight'||k==='d'){e.preventDefault();next()}else if(k==='f')toggleFullscreen();else if(k==='t')changeTheme();else if(k==='b')toggleBookmark();else if(e.key==='+'||e.key==='=')changeFont(1);else if(e.key==='-')changeFont(-1);else if(e.key==='Home'){e.preventDefault();scrollTo({top:0,behavior:'smooth'})}else if(e.key==='End'){e.preventDefault();scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'})}});
let touchX=0;document.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>70)dx<0?next():prev()},{passive:true});
async function exportBook(){try{const rows=[];for(let i=0;i<chapterList.length;i++){const c=await getChapter(id,i);if(c)rows.push(c)}const md='# '+novel.title+'\\n\\n**AUTHOR · '+(novel.author||'BLLSNVJ21')+'**\\n\\n'+rows.map(c=>'## Chapter '+c.number+' — '+c.title+'\\n\\n'+String(c.text||'')).join('\\n\\n');const blob=new Blob([md],{type:'text/markdown;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(novel.title||'novel').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()+'-by-'+(novel.author||'BLLSNVJ21').toLowerCase()+'.md';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}catch(e){alert('Book export failed: '+e.message)}}
boot();