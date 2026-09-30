/* LIGHT NOVEL PARODY FACTORY — READER 8.0 */
const id=new URLSearchParams(location.search).get('id');
let novel,index=0;
const readerRoot=()=>document.getElementById('reader');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=(name)=>'lnpf-reader-'+name+'-'+(novel?.id||'unknown');
const getMarks=()=>JSON.parse(localStorage.getItem(key('bookmarks'))||'[]');
const getNote=()=>localStorage.getItem(key('note-'+index))||'';
const saveMarks=v=>localStorage.setItem(key('bookmarks'),JSON.stringify(v));
getNovel(id).then(n=>{
 if(!n){readerRoot().innerHTML='<div class="reader-error"><h1>Novel not found.</h1><a class="button" href="library.html">RETURN TO LIBRARY</a></div>';return}
 novel=n; index=Math.min(Math.max(0,n.position||0),(n.generated?.length||1)-1); render();
}).catch(e=>readerRoot().innerHTML='<div class="reader-error"><h1>Reader storage error.</h1><p>'+esc(e.message)+'</p></div>');

function render(){
 const c=novel.generated?.[index]; if(!c)return;
 const total=novel.generated.length,progress=total<=1?100:Math.round(index/(total-1)*100);
 const theme=localStorage.getItem('lnpf-reader-theme')||'night';
 const marks=getMarks(),marked=marks.includes(index);
 document.body.dataset.readerTheme=theme;
 document.title=novel.title+' · Chapter '+c.number;
 const chapterWords=String(c.text||'').trim().split(/\s+/).filter(Boolean).length;
 const minutes=Math.max(1,Math.ceil(chapterWords/220));
 readerRoot().innerHTML=
 '<div class="reader-progress"><span style="width:'+progress+'%"></span></div>'+
 '<div class="reader-toolbar"><div class="reader-tools-left"><span class="reader-progress-label">'+progress+'% READ · ARC '+(c.arc||'?')+' · '+minutes+' MIN</span></div>'+
 '<div class="reader-tools-right"><button id="chapterMenu">☰ CHAPTERS</button><button id="bookmarkBtn" aria-pressed="'+marked+'">'+(marked?'★ SAVED':'☆ SAVE')+'</button><button id="noteBtn">✎ NOTE</button><button id="themeBtn">◐ THEME</button><button id="fontDown">A−</button><button id="fontUp">A+</button><button id="fullBtn">⛶ FULL</button></div></div>'+
 '<div class="reader-drawer" id="chapterDrawer" hidden><div class="drawer-head"><strong>CHAPTERS</strong><input id="chapterSearch" type="search" placeholder="Search chapter titles…" aria-label="Search chapter titles"></div><div id="chapterList"></div></div>'+
 '<div class="reader-head"><p class="eyebrow">'+esc(novel.title)+'</p><div class="chapter">CHAPTER '+c.number+' / '+novel.chapters+(c.arc?' · ARC '+c.arc:'')+'</div><h1>'+esc(c.title)+'</h1><div class="reader-author">AUTHOR · '+esc(novel.author||'BLLSNVJ21')+'</div><div class="reader-meta">'+(novel.genres||[]).map(esc).join(' · ')+' <span>·</span> '+novel.parody+'% PARODY <span>·</span> '+(c.focus?esc(c.focus):'STORY')+' FOCUS</div></div>'+
 '<div class="reader-note-box" id="noteBox" hidden><label for="readerNote">CHAPTER NOTE</label><textarea id="readerNote" rows="4" placeholder="Write a private note about this novel…">'+esc(getNote())+'</textarea><div><button id="saveNote" class="mini">SAVE NOTE</button><button id="closeNote" class="mini">CLOSE</button></div></div>'+
 '<div class="novel-text" style="--reader-scale:'+getReaderScale()+'">'+formatText(c.text)+'</div>'+
 '<div class="controls"><button id="prevBtn" '+(index===0?'disabled':'')+'>← PREVIOUS</button><span>CHAPTER '+(index+1)+' / '+total+'</span><button id="nextBtn" '+(index===total-1?'disabled':'')+'>NEXT →</button></div>';
 document.getElementById('chapterMenu').onclick=()=>toggleDrawer();
 document.getElementById('bookmarkBtn').onclick=()=>toggleBookmark();
 document.getElementById('noteBtn').onclick=()=>document.getElementById('noteBox').hidden=!document.getElementById('noteBox').hidden;
 document.getElementById('saveNote').onclick=()=>{localStorage.setItem(key('note-'+index),document.getElementById('readerNote').value);document.getElementById('noteBox').hidden=true};
 document.getElementById('closeNote').onclick=()=>document.getElementById('noteBox').hidden=true;
 document.getElementById('themeBtn').onclick=changeTheme;
 document.getElementById('fontDown').onclick=()=>changeFont(-1);
 document.getElementById('fontUp').onclick=()=>changeFont(1);
 document.getElementById('fullBtn').onclick=toggleFullscreen;
 document.getElementById('prevBtn').onclick=prev;
 document.getElementById('nextBtn').onclick=next;
 populateChapterList();
 novel.position=index; saveNovel(novel);
}
function populateChapterList(){
 const root=document.getElementById('chapterList'),search=document.getElementById('chapterSearch');
 const draw=()=>{const q=search.value.trim().toLowerCase();root.innerHTML=novel.generated.map((x,i)=>({x,i})).filter(o=>!q||String(o.x.title).toLowerCase().includes(q)||String(o.x.number).includes(q)).slice(0,1000).map(o=>'<button class="chapter-item '+(o.i===index?'active':'')+'" data-index="'+o.i+'"><span>CH '+o.x.number+'</span><strong>'+esc(o.x.title)+'</strong>'+(getMarks().includes(o.i)?'<b>★</b>':'')+'</button>').join('')||'<p class="muted">No chapters found.</p>';root.querySelectorAll('.chapter-item').forEach(b=>b.onclick=()=>{index=Number(b.dataset.index);render();window.scrollTo({top:0,behavior:'smooth'})})};
 search.oninput=draw;draw();
}
function toggleDrawer(){const d=document.getElementById('chapterDrawer');d.hidden=!d.hidden;if(!d.hidden)document.getElementById('chapterSearch').focus()}
function toggleBookmark(){const marks=getMarks(),i=marks.indexOf(index);i>=0?marks.splice(i,1):marks.push(index);marks.sort((a,b)=>a-b);saveMarks(marks);render()}
function formatText(t){return String(t||'').split(/\n\n+/).map(x=>'<p>'+esc(x.trim())+'</p>').join('')||'<p>Empty chapter.</p>'}
function prev(){if(index>0){index--;render();window.scrollTo({top:0,behavior:'smooth'})}}
function next(){if(index<novel.generated.length-1){index++;render();window.scrollTo({top:0,behavior:'smooth'})}}
function getReaderScale(){return Number(localStorage.getItem('lnpf-reader-scale')||1)}
function changeFont(delta){const s=Math.min(1.35,Math.max(.8,getReaderScale()+delta*.08));localStorage.setItem('lnpf-reader-scale',s.toFixed(2));render()}
function changeTheme(){const themes=['night','sepia','paper'];const t=localStorage.getItem('lnpf-reader-theme')||'night';localStorage.setItem('lnpf-reader-theme',themes[(themes.indexOf(t)+1)%themes.length]);render()}
function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()}
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','BUTTON','SELECT'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a'){e.preventDefault();prev()}if(e.key==='ArrowRight'||e.key.toLowerCase()==='d'){e.preventDefault();next()}if(e.key.toLowerCase()==='f')toggleFullscreen();if(e.key.toLowerCase()==='t')changeTheme();if(e.key.toLowerCase()==='b')toggleBookmark();if(e.key==='+'||e.key==='=')changeFont(1);if(e.key==='-')changeFont(-1)});
let touchX=0;document.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});
document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>70)dx<0?next():prev()},{passive:true});
