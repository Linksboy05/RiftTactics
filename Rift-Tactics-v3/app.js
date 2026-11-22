/* Rift Tactics — standalone, browser-saved fan-made planning workspace.
   No backend, build step, API key, or game assets required. */
(() => {
'use strict';
const $ = (s,root=document) => root.querySelector(s);
const $$ = (s,root=document) => [...root.querySelectorAll(s)];
const clone = value => JSON.parse(JSON.stringify(value));
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const initials = name => name.replace(/^(The|Jeff the|Doctor)\s+/i,'').split(/\s|[-&]+/).filter(Boolean).slice(0,2).map(s=>s[0]).join('').toUpperCase();
const slug = id => HERO_BY_ID[id]?.name || id;
const KEY = 'rift-tactics-v1'; // keep existing user saves from v2
const defaults = () => ({
  draft:{mode:'basic',teamA:'TEAM ALPHA',teamB:'TEAM OMEGA',history:[]},
  boards:{},heroNotes:{},currentMap:'training',phase:'Opening attack'
});
let state = defaults();
try {
 const stored = JSON.parse(localStorage.getItem(KEY)||'null');
 if(stored && typeof stored==='object'){
  state = {...state,...stored};
  if(!state.draft || !Array.isArray(state.draft.history)) state.draft=defaults().draft;
  if(!state.boards || typeof state.boards!=='object') state.boards={};
  if(!state.heroNotes || typeof state.heroNotes!=='object') state.heroNotes={};
  if(!MAPS.some(m=>m.id===state.currentMap))state.currentMap='training';
 }
} catch(err){console.warn('Could not load saved workspace',err)}
let storageWarned=false;
function save(){
 try{localStorage.setItem(KEY, JSON.stringify(state));}
 catch(err){if(!storageWarned){notify('Browser storage is full. Changes may not be saved.');storageWarned=true}console.warn(err)}
}
let toastTimer;
function notify(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2900)}
function avatar(hero){
 const img=hero.portrait?`<img src="${escapeHtml(hero.portrait)}" loading="lazy" alt="" onerror="this.remove()" />`:'';
 return `<div class="avatar portrait-avatar" data-role="${hero.role}"><span class="avatar-fallback">${escapeHtml(initials(hero.name))}</span>${img}</div>`;
}
function miniAvatar(hero){return `<span class="mini-avatar portrait-avatar"><span class="avatar-fallback">${escapeHtml(initials(hero.name))}</span>${hero.portrait?`<img loading="lazy" src="${escapeHtml(hero.portrait)}" alt="" onerror="this.remove()"/>`:''}</span>`;}
function roleDescription(hero){return ROLE_TACTICS[hero.role]?.summary || ''}
function go(page){
 if(!['overview','draft','heroes','board'].includes(page))return;
 $$('.page').forEach(el=>el.classList.toggle('active',el.id==='page-'+page));
 $$('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
 $('#breadcrumbPage').textContent=({overview:'COMMAND CENTER',draft:'DRAFT SIMULATOR',heroes:'HERO DATABASE',board:'STRATEGY BOARD'})[page];
 $('#sidebar').classList.remove('open');
 window.scrollTo({top:0,behavior:'auto'});
 if(page==='board')renderBoard();
}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
$$('[data-jump]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.jump)));
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#statHeroes').textContent=HEROES.length;
$('#statMaps').textContent=MAPS.filter(map=>map.image).length;

/* -------------------------------- Draft room -------------------------------- */
const draft=()=>state.draft;
let draftSearch='',draftRole='All',freeTeam='a',freeAction='BAN',rankedTeam='a';
const currentFormat=()=>DRAFT_FORMATS[draft().mode]||DRAFT_FORMATS.basic;
const picks=(team,action)=>draft().history.filter(x=>x.team===team&&x.action===action);
const banTarget = team => team==='a' ? 'b' : 'a';
// Basic/Ranked: global restrictions. Ignite: a ban targets only the opponent's hero pool.
function canChooseHero(id,team,action,mode){
 const history=draft().history;
 if(mode==='ranked')return !history.some(x=>x.team===team && x.action==='PICK' && x.id===id);
 if(mode==='ignite'){
  if(action==='BAN')return !history.some(x=>x.action==='BAN'&&x.team===team&&x.id===id) &&
   !history.some(x=>x.action==='LOCK'&&x.team===banTarget(team)&&x.id===id);
  return !history.some(x=>x.action==='LOCK'&&x.team===team&&x.id===id) &&
   !history.some(x=>x.action==='BAN'&&x.team===banTarget(team)&&x.id===id);
 }
 return !history.some(x=>x.id===id);
}
function turnTitle(team,action,mode){
 const who=team==='a'?(draft().teamA||'TEAM ALPHA'):(draft().teamB||'TEAM OMEGA');
 return `${who} · ${mode==='ranked'?'CHOOSE A TEAM HERO':action==='BAN' ? (mode==='ignite'?'BAN FOR OPPONENT':'BAN A HERO') : 'PROTECT A HERO'}`;
}
function renderDraft(){
 const d=draft(), format=currentFormat(), steps=format.turns, complete=d.mode!=='free'&&d.mode!=='ranked'&&d.history.length>=steps.length;
 $('#draftMode').value=d.mode;
 $('#teamAName').value=d.teamA;
 $('#teamBName').value=d.teamB;
 $('#draftTeamALabel').textContent=d.teamA||'TEAM ALPHA';
 $('#draftTeamBLabel').textContent=d.teamB||'TEAM OMEGA';
 $('#freeformControls').hidden=d.mode!=='free';
 $('#rankedControls').hidden=d.mode!=='ranked';
 $('#draftTeams').classList.toggle('ranked-view',d.mode==='ranked');
 $('#page-draft').classList.toggle('ranked-view',d.mode==='ranked');
 $$('.ranked-side').forEach(b=>b.classList.toggle('active',b.dataset.team===rankedTeam));
 $('#formatGuideTitle').textContent=format.name;
 $('#formatGuideDescription').textContent=format.summary;
 $('#formatGuideDetail').textContent=format.detail;
 $('#formatSourceLink').hidden=!format.source;
 if(format.source)$('#formatSourceLink').href=format.source;
 $$('.ban-limit').forEach(el=>el.textContent=`${format.banLimit} MAX`);
 $$('.lock-limit').forEach(el=>el.textContent=`${format.lockLimit} MAX`);
 $('#draftTurnList').innerHTML=d.mode==='ranked'?'<span class="muted">No bans / locks in this planning preset. Build up to six heroes per team.</span>':steps.length?steps.map(([team,action,phase],i)=>`<span class="turn-chip ${i<d.history.length?'done':i===d.history.length?'current':''}" title="${escapeHtml(turnTitle(team,action,d.mode))}">${String(i+1).padStart(2,'0')} · ${team.toUpperCase()} ${action==='LOCK'?'PROTECT':'BAN'}${phase===1||phase===6?' ↔':''}</span>`).join(''):'<span class="muted">No fixed turn order — use the freeform controls.</span>';
 const turn=steps[Math.min(d.history.length,Math.max(0,steps.length-1))]||['a','BAN'];
 $('#draftStep').textContent=d.mode==='ranked'?'RANKED / COMPOSITION PLANNER':d.mode==='free'?'FREEFORM PRACTICE':complete?'DRAFT COMPLETE':`STEP ${String(d.history.length+1).padStart(2,'0')} / ${steps.length}`;
 $('#draftInstruction').textContent=d.mode==='ranked'?turnTitle(rankedTeam,'PICK',d.mode):d.mode==='free'?turnTitle(freeTeam,freeAction,d.mode):complete?'READY FOR TEAM REVIEW':turnTitle(turn[0],turn[1],d.mode);
 $('#draftExplanation').textContent=complete?'Draft complete. Review each team’s restrictions and protected heroes above.':format.summary;
 $('#phaseTrack').innerHTML=steps.map((step,i)=>`<span class="${i<d.history.length?'done':i===d.history.length?'current':''}" title="${escapeHtml(turnTitle(step[0],step[1],d.mode))}"></span>`).join('');
 for(const team of ['a','b'])for(const action of ['LOCK','BAN']){
  if(d.mode==='ranked' && action==='BAN'){ $(`#${team}Bans`).innerHTML='';continue;}
  const entries=picks(team,d.mode==='ranked'?'PICK':action),limit=d.mode==='ranked'?6:action==='LOCK'?format.lockLimit:format.banLimit;
  const container=$(`#${team}${action==='LOCK'?'Locks':'Bans'}`);
  container.innerHTML=limit?Array.from({length:limit},(_,i)=>{
   const hero=HERO_BY_ID[entries[i]?.id];
   return `<div class="draft-slot ${hero?'filled':''}">${hero?`${miniAvatar(hero)}<span class="slot-name">${escapeHtml(hero.name)}</span>`:`<span>${String(i+1).padStart(2,'0')}</span>`}</div>`;
  }).join(''):'<div class="no-locks">NO PROTECT PHASE IN THIS FORMAT</div>';
 }
 $$('.choice').forEach(b=>b.classList.toggle('active',b.dataset.team===freeTeam&&b.dataset.action===freeAction));
 const pool=HEROES.filter(h=>(draftRole==='All'||h.role===draftRole)&&h.name.toLowerCase().includes(draftSearch));
 $('#draftCount').textContent=`${pool.length}`;
 const [nextTeam,nextAction]=d.mode==='ranked'?[rankedTeam,'PICK']:d.mode==='free'?[freeTeam,freeAction]:turn;
 $('#draftGrid').innerHTML=pool.map(hero=>{
  const entries=d.history.filter(x=>x.id===hero.id),entryLabel=entries.map(x=>`${x.team.toUpperCase()} · ${x.action==='LOCK'?'PROTECTED':'BAN'}`).join(' / ');
  const disabled=d.mode==='ranked'?false:d.mode==='free'?false:complete||!canChooseHero(hero.id,nextTeam,nextAction,d.mode);
  return `<div class="pool-tile"><button class="pool-card ${entries.length?'selected':''}" data-hero="${hero.id}" data-status="${escapeHtml(entryLabel)}" ${disabled?'disabled':''} title="${escapeHtml(hero.name)} · ${hero.role}"><span class="pool-role-tag">${ROLE_TACTICS[hero.role].abbreviation}</span>${avatar(hero)}<span class="pool-name">${escapeHtml(hero.name)}</span></button><button class="pool-info" data-info="${hero.id}" aria-label="View ${escapeHtml(hero.name)} ability information">i</button></div>`;
 }).join('')||'<p class="muted">No heroes match your search.</p>';
 $$('.pool-card').forEach(b=>b.addEventListener('click',()=>chooseHero(b.dataset.hero)));
 $$('.pool-info').forEach(b=>b.addEventListener('click',()=>openHero(b.dataset.info)));
 $('#draftUndo').disabled=d.history.length===0;
}
function chooseHero(id){
 const d=draft(),format=currentFormat();if(!HERO_BY_ID[id])return;
 if(d.mode==='ranked'){
  const existing=d.history.findIndex(x=>x.team===rankedTeam&&x.id===id&&x.action==='PICK');
  if(existing>=0)d.history.splice(existing,1);
  else if(picks(rankedTeam,'PICK').length>=6){notify('Only six heroes per side. Remove a hero to add another.');return;}
  else d.history.push({id,team:rankedTeam,action:'PICK'});
 }else if(d.mode==='free'){
  const existing=d.history.findIndex(x=>x.id===id);
  if(existing!==-1){d.history.splice(existing,1);save();renderDraft();return}
  if(picks(freeTeam,freeAction).length>=(freeAction==='BAN'?format.banLimit:format.lockLimit)){notify('This side has filled its available slots.');return}
  if(!canChooseHero(id,freeTeam,freeAction,d.mode)){notify('Hero already selected.');return}
  d.history.push({id,team:freeTeam,action:freeAction});
 }else{
  if(d.history.length>=format.turns.length)return;
  const [team,action]=format.turns[d.history.length];
  if(!canChooseHero(id,team,action,d.mode)){notify('This hero cannot be selected for the current action.');return}
  d.history.push({id,team,action});
  if(d.history.length===format.turns.length)notify('Draft complete — review both sides.');
 }
 save();renderDraft();
}
$('#draftMode').addEventListener('change',e=>{
 if(draft().history.length&&!confirm('Switching draft format resets current bans and protections. Continue?')){e.target.value=draft().mode;return}
 draft().mode=e.target.value;draft().history=[];save();renderDraft();
});
for(const [id,key] of [['teamAName','teamA'],['teamBName']])$('#'+id).addEventListener('input',e=>{draft()[key]=e.target.value;save();$('#draftTeamALabel').textContent=draft().teamA||'TEAM ALPHA';$('#draftTeamBLabel').textContent=draft().teamB||'TEAM OMEGA';const fmt=currentFormat();if(draft().mode==='ranked')$('#draftInstruction').textContent=turnTitle(rankedTeam,'PICK','ranked');else if(draft().mode==='free')$('#draftInstruction').textContent=turnTitle(freeTeam,freeAction,draft().mode);else if(draft().history.length<fmt.turns.length){const [team,action]=fmt.turns[draft().history.length];$('#draftInstruction').textContent=turnTitle(team,action,draft().mode)}});
$('#draftReset').addEventListener('click',()=>{if(draft().history.length&&!confirm('Reset all bans and protections?'))return;draft().history=[];save();renderDraft();notify('Draft reset.');});
$('#draftUndo').addEventListener('click',()=>{draft().history.pop();save();renderDraft();});
$('#draftSearch').addEventListener('input',e=>{draftSearch=e.target.value.trim().toLowerCase();renderDraft()});
$('#draftRole').addEventListener('change',e=>{draftRole=e.target.value;renderDraft()});
$$('.choice').forEach(el=>el.addEventListener('click',()=>{freeTeam=el.dataset.team;freeAction=el.dataset.action;renderDraft()}));
$$('.ranked-side').forEach(el=>el.addEventListener('click',()=>{rankedTeam=el.dataset.team;renderDraft()}));
if(!DRAFT_FORMATS[state.draft.mode])state.draft.mode='basic';
renderDraft();

/* ------------------------------- Hero database ------------------------------- */
let heroRole='All',heroSearch='';
function renderHeroes(){
 const filtered=HEROES.filter(h=>(heroRole==='All'||h.role===heroRole)&&h.name.toLowerCase().includes(heroSearch));
 $('#heroDatabase').innerHTML=filtered.map(h=>`<button class="database-card" data-hero="${h.id}">${avatar(h)}<h3>${escapeHtml(h.name.toUpperCase())}</h3><span class="role-label">${h.role.toUpperCase()}</span><span class="details-link">VIEW PROFILE</span></button>`).join('')||'<p class="muted">No heroes match that search.</p>';
 $$('.database-card').forEach(b=>b.addEventListener('click',()=>openHero(b.dataset.hero)));
 $$('#heroRolePills button').forEach(b=>b.classList.toggle('active',b.dataset.role===heroRole));
}
function openHero(id){
 const h=HERO_BY_ID[id];if(!h)return;
 const detail=h.playstyle||roleDescription(h);
 const abilities=(h.abilities||[]).map(a=>`<div class="ability"><strong>${escapeHtml(a[0])}</strong><p>${escapeHtml(a[1])}</p></div>`).join('');
 $('#modalBody').innerHTML=`<div class="modal-identity">${avatar(h)}<div><span class="eyebrow">${ROLE_TACTICS[h.role].abbreviation} / HERO FILE</span><h2 id="modalName">${escapeHtml(h.name.toUpperCase())}</h2><p>${escapeHtml(h.role)} class</p></div></div><h3 class="modal-subhead">TACTICAL PROFILE</h3><p class="modal-description">${escapeHtml(detail)}</p><h3 class="modal-subhead">SIGNATURE ABILITIES · CURATED NOTES</h3><div class="abilities-list">${abilities||'<div class="unverified">A named move summary has not been reviewed for this hero yet. View the full ability guide below for attacks, skills and cooldowns.</div>'}</div><h3 class="modal-subhead">SCOUTING NOTES · YOUR TEAM</h3><textarea class="modal-notes" id="modalNotes" placeholder="Counters, dive timing, preferred maps, synergy notes..."></textarea><div class="modal-actions"><a class="official-link" href="https://www.marvelrivals.com/heroes/" target="_blank" rel="noopener">OFFICIAL HERO GALLERY ↗</a><a class="official-link" href="${escapeHtml(h.guide)}" target="_blank" rel="noopener noreferrer">FULL ABILITIES &amp; COOLDOWNS ↗</a><button class="btn lime-btn" id="saveHeroNotes">SAVE NOTES ✓</button></div>`;
 $('#modalNotes').value=state.heroNotes[id]||'';
 $('#saveHeroNotes').addEventListener('click',()=>{state.heroNotes[id]=$('#modalNotes').value;save();notify(`${h.name} notes saved.`)});
 $('#heroModal').hidden=false;
}
$('#closeModal').addEventListener('click',()=>$('#heroModal').hidden=true);
$('#heroModal').addEventListener('click',e=>{if(e.target.id==='heroModal')e.currentTarget.hidden=true});
$('#heroSearch').addEventListener('input',e=>{heroSearch=e.target.value.trim().toLowerCase();renderHeroes()});
$$('#heroRolePills button').forEach(b=>b.addEventListener('click',()=>{heroRole=b.dataset.role;renderHeroes()}));
renderHeroes();

/* ------------------------------ Strategy board ------------------------------ */
let CW=1100,CH=680;
function resizeBoard(width=1100,height=680){
 CW=width;CH=height;canvas.width=CW;canvas.height=CH;
 $('#boardStage').style.aspectRatio=`${CW} / ${CH}`;
}
const canvas=$('#boardCanvas'), ctx=canvas.getContext('2d');
let currentTool='select',currentColor='#c7f964',brushSize=5,tokenHero=null,tokenSide='ally';
let activeDrawing=null,dragToken=null,boardHistory=[],loadedImage=null,loadedImageSrc='';
let zoom=1, isPointerDown=false;
const blankBoard=()=>({strokes:[],tokens:[],notes:'',phase:'Opening attack',background:null});
function board(){return state.boards[state.currentMap] ||= blankBoard()}
const currentMap=()=>MAPS.find(m=>m.id===state.currentMap)||MAPS[0];
function mapOptions(mode){
 const set=MAPS.filter(m=>m.mode===mode);
 const areas=[...new Set(set.map(m=>m.area))];
 $('#mapSelect').innerHTML=areas.map(area=>{
  const entries=set.filter(m=>m.area===area);
  return mode==='Domination'?`<optgroup label="${escapeHtml(area)}">${entries.map(m=>`<option value="${m.id}">${escapeHtml(m.name)}</option>`).join('')}</optgroup>`:entries.map(m=>`<option value="${m.id}">${escapeHtml(m.name)}</option>`).join('');
 }).join('');
}

function setMap(id){
 state.currentMap=id;boardHistory=[];tokenHero=null;currentTool='select';
 $('#mapMode').value=currentMap().mode;mapOptions(currentMap().mode);$('#mapSelect').value=id;
 $('#mapLabel').textContent=(currentMap().mode==='Domination'?currentMap().area+' / ':'')+currentMap().name.toUpperCase();
 $('#mapTypeTag').textContent=currentMap().mode.toUpperCase();
 $('#boardPhase').value=board().phase||'Opening attack';
 $('#strategyNotes').value=board().notes||'';
 syncImage();setTool('select');save();renderBoard();
}
$('#mapMode').addEventListener('change',e=>{const m=MAPS.find(m=>m.mode===e.target.value);if(m)setMap(m.id)});
$('#mapSelect').addEventListener('change',e=>setMap(e.target.value));
$('#boardPhase').addEventListener('change',e=>{board().phase=e.target.value;save();renderBoard()});
$('#strategyNotes').addEventListener('input',e=>{board().notes=e.target.value;save()});
function syncImage(){
 const src=board().background||currentMap().image;
 $('#removeMapImage').hidden=!board().background;
 if(!src){resizeBoard();loadedImage=null;loadedImageSrc='';$('#boardDownload').disabled=false;$('#schematicWarning').hidden=false;$('#schematicWarning').textContent='PRACTICE SCHEMATIC — PICK A REAL LAYOUT ABOVE';renderBoard();return}
 if(src===loadedImageSrc)return;
 loadedImage=null;loadedImageSrc=src;
 $('#boardDownload').disabled=true;
 $('#schematicWarning').hidden=false;
 $('#schematicWarning').textContent='LOADING MAP IMAGE…';
 const img=new Image();
 img.onload=()=>{if((board().background||currentMap().image)===src){resizeBoard(1100,Math.round(1100*img.naturalHeight/img.naturalWidth));loadedImage=img;$('#boardDownload').disabled=false;$('#schematicWarning').hidden=true;renderBoard()}};
 img.onerror=()=>{
  if((board().background||currentMap().image)!==src)return;
  loadedImage=null;resizeBoard();
  $('#boardDownload').disabled=false;
  $('#schematicWarning').hidden=false;
  $('#schematicWarning').textContent='Could not load the bundled map artwork.';
  renderBoard();
 };
 img.src=src;
}
function setTool(t){
 currentTool=t;if(t!=='token')tokenHero=null;
 $$('.board-tool').forEach(b=>b.classList.toggle('active',b.dataset.tool===t));
 $$('.token-item').forEach(b=>b.classList.toggle('active',t==='token'&&b.dataset.hero===tokenHero));
 canvas.classList.toggle('move-cursor',t==='select');
 canvas.classList.remove('dragging');
}
$$('.board-tool').forEach(b=>b.addEventListener('click',()=>setTool(b.dataset.tool)));
$$('.swatch').forEach(b=>b.addEventListener('click',()=>{currentColor=b.dataset.color;$$('.swatch').forEach(x=>x.classList.toggle('active',x===b))}));
$('#brushSize').addEventListener('input',e=>brushSize=+e.target.value);
$$('.side-choice button').forEach(b=>b.addEventListener('click',()=>{tokenSide=b.dataset.side;$$('.side-choice button').forEach(x=>x.classList.toggle('active',x===b))}));
function renderTokenList(){
 const needle=$('#tokenSearch').value.trim().toLowerCase();
 const filtered=HEROES.filter(h=>h.name.toLowerCase().includes(needle));
 $('#tokenList').innerHTML=filtered.map(h=>`<button class="token-item ${currentTool==='token'&&tokenHero===h.id?'active':''}" data-hero="${h.id}" title="Place ${escapeHtml(h.name)}">${miniAvatar(h)}<span>${escapeHtml(h.name)}</span></button>`).join('');
 $$('.token-item').forEach(b=>b.addEventListener('click',()=>{tokenHero=b.dataset.hero;setTool('token');tokenHero=b.dataset.hero;renderTokenList();notify(`Click the board to place ${slug(tokenHero)}.`)}));
}
$('#tokenSearch').addEventListener('input',renderTokenList);
function snapshot(){
 boardHistory.push(JSON.stringify({strokes:board().strokes,tokens:board().tokens}));
 if(boardHistory.length>60)boardHistory.shift();
 $('#boardUndo').disabled=false;
}
function undoBoard(){
 if(!boardHistory.length)return;
 const prev=JSON.parse(boardHistory.pop());board().strokes=prev.strokes;board().tokens=prev.tokens;
 $('#boardUndo').disabled=boardHistory.length===0;
 save();renderBoard();
}
$('#boardUndo').addEventListener('click',undoBoard);
$('#clearBoard').addEventListener('click',()=>{
 if(!board().strokes.length)return;
 if(!confirm('Clear all drawn lines and areas on this map? Hero tokens will stay.'))return;
 snapshot();board().strokes=[];save();renderBoard();notify('Map marks cleared.');
});
$('#boardSave').addEventListener('click',()=>{save();notify('Map plan saved in this browser.')});
function point(ev){const r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(CW,(ev.clientX-r.left)*CW/r.width)),y:Math.max(0,Math.min(CH,(ev.clientY-r.top)*CH/r.height))}}
function distance(p,q){return Math.hypot(p.x-q.x,p.y-q.y)}
function tokenAt(p){for(let i=board().tokens.length-1;i>=0;i--)if(distance(board().tokens[i],p)<28)return i;return -1}
function distSegment(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return distance(p,{x:a.x+t*dx,y:a.y+t*dy})}
function markAt(p){for(let i=board().strokes.length-1;i>=0;i--){const s=board().strokes[i];
  if(s.tool==='pen' && s.points.some((x,j)=>j>0&&distSegment(p,s.points[j-1],x)<17))return i;
  if(s.tool==='arrow'&&distSegment(p,s.start,s.end)<17)return i;
  if(s.tool==='circle'){let dx=s.end.x-s.start.x,dy=s.end.y-s.start.y;const minX=Math.min(s.start.x,s.end.x),maxX=Math.max(s.start.x,s.end.x),minY=Math.min(s.start.y,s.end.y),maxY=Math.max(s.start.y,s.end.y);const rx=Math.max(3,(maxX-minX)/2),ry=Math.max(3,(maxY-minY)/2);const v=Math.sqrt(((p.x-(minX+maxX)/2)/rx)**2+((p.y-(minY+maxY)/2)/ry)**2);if(Math.abs(v-1)<.12)return i;}
 }return -1}
canvas.addEventListener('pointerdown',e=>{
 if(e.button!==0)return;
 e.preventDefault();const p=point(e);
 if(currentTool==='token'&&tokenHero){snapshot();board().tokens.push({...p,id:tokenHero,side:tokenSide});save();renderBoard();return}
 if(currentTool==='eraser'){
  const ti=tokenAt(p);if(ti!==-1){snapshot();board().tokens.splice(ti,1)}
  else{const si=markAt(p);if(si===-1)return;snapshot();board().strokes.splice(si,1)}
  save();renderBoard();return;
 }
 if(currentTool==='select'){
  const i=tokenAt(p);if(i===-1)return;
  snapshot();dragToken=i;isPointerDown=true;canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');return;
 }
 if(['pen','arrow','circle'].includes(currentTool)){
  activeDrawing={tool:currentTool,color:currentColor,size:brushSize,start:p,end:p,points:[p]};
  isPointerDown=true;canvas.setPointerCapture(e.pointerId);renderBoard();
 }
});
canvas.addEventListener('pointermove',e=>{
 if(!isPointerDown)return;const p=point(e);
 if(dragToken!==null){board().tokens[dragToken].x=p.x;board().tokens[dragToken].y=p.y;renderBoard();return}
 if(activeDrawing){activeDrawing.end=p;if(activeDrawing.tool==='pen' && distance(activeDrawing.points[activeDrawing.points.length-1],p)>2)activeDrawing.points.push(p);renderBoard();}
});
function finishPointer(){
 if(!isPointerDown)return;
 isPointerDown=false;canvas.classList.remove('dragging');
 if(activeDrawing){if(activeDrawing.tool==='pen'&&activeDrawing.points.length<2)activeDrawing.points.push({...activeDrawing.start,x:activeDrawing.start.x+.2});snapshot();board().strokes.push(activeDrawing);activeDrawing=null}
 dragToken=null;save();renderBoard();
}
canvas.addEventListener('pointerup',finishPointer);
canvas.addEventListener('pointercancel',finishPointer);
// Resize uploads into reasonable localStorage-friendly data URLs.
$('#mapUpload').addEventListener('change',e=>{
 const file=e.target.files?.[0];if(!file)return;
 if(!file.type.startsWith('image/')){notify('Please select a JPG, PNG or WebP image.');return}
 const reader=new FileReader();reader.onload=()=>{
  const img=new Image();img.onload=()=>{
   const ratio=Math.min(1,1550/img.width,1050/img.height);
   const buffer=document.createElement('canvas');buffer.width=Math.round(img.width*ratio);buffer.height=Math.round(img.height*ratio);
   buffer.getContext('2d').drawImage(img,0,0,buffer.width,buffer.height);
   const src=buffer.toDataURL('image/jpeg',.78);
   board().background=src;loadedImageSrc='';syncImage();save();notify('Image assigned to this map in this browser. Add it to assets/maps/ to share the same PNG with teammates.');
  };img.onerror=()=>notify('Unable to load that image file.');img.src=reader.result;
 };reader.readAsDataURL(file);e.target.value='';
});
$('#removeMapImage').addEventListener('click',()=>{if(!board().background)return;board().background=null;loadedImage=null;loadedImageSrc='';save();syncImage();notify('Using bundled map PNG when available.')});
function setZoom(v){zoom=Math.max(.65,Math.min(2.5,v));$('#boardStage').style.width=`${Math.round(zoom*100)}%`;$('#zoomLabel').textContent=`${Math.round(zoom*100)}%`}
$('#zoomIn').addEventListener('click',()=>setZoom(zoom+.25));
$('#zoomOut').addEventListener('click',()=>setZoom(zoom-.25));
$('#zoomReset').addEventListener('click',()=>setZoom(1));

/* Canvas: intentionally ORIGINAL abstract map schematics, not actual game geometry. */
function line(context,pts,color='#334251',width=3,dash=[]){context.beginPath();context.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>context.lineTo(p[0],p[1]));context.strokeStyle=color;context.lineWidth=width;context.setLineDash(dash);context.lineJoin='round';context.lineCap='round';context.stroke();context.setLineDash([])}
function rect(context,x,y,w,h,fill,stroke='#44505a',r=7){context.beginPath();context.roundRect(x,y,w,h,r);context.fillStyle=fill;context.fill();if(stroke){context.strokeStyle=stroke;context.lineWidth=2;context.stroke()}}
function ring(context,x,y,r,color,width=2){context.beginPath();context.arc(x,y,r,0,Math.PI*2);context.lineWidth=width;context.strokeStyle=color;context.stroke()}
function textCanvas(context,s,x,y,font='700 13px Arial',color='#8e9ca5',align='left'){context.fillStyle=color;context.font=font;context.textAlign=align;context.fillText(s,x,y)}
function baseMap(context){
 const {type,name}=currentMap();
 const gradient=context.createLinearGradient(0,0,CW,CH);gradient.addColorStop(0,'#172533');gradient.addColorStop(.5,'#111923');gradient.addColorStop(1,'#14252b');context.fillStyle=gradient;context.fillRect(0,0,CW,CH);
 for(let x=0;x<=CW;x+=34)line(context,[[x,0],[x,CH]],'#27323d',.65);
 for(let y=0;y<=CH;y+=34)line(context,[[0,y],[CW,y]],'#27323d',.65);
 // Decorative tactical blocks, representative training geometry only.
 if(type==='control'){
   [[55,85,260,120],[785,85,260,120],[55,475,260,125],[785,475,260,125],[345,40,160,150],[595,40,160,150],[345,490,160,150],[595,490,160,150]].forEach((a,i)=>rect(context,...a,i%2?'#202d38':'#1d303b'));
   rect(context,347,225,406,230,'#1a3034','#3c5556',20);
   rect(context,393,267,314,146,'#284046','#4d6b6b',16);
   ring(context,550,340,110,'#637a70',3);ring(context,550,340,79,'#9abf87',3);
   line(context,[[106,340],[340,340]],'#3f6974',48);line(context,[[760,340],[998,340]],'#3f6974',48);
   line(context,[[205,205],[358,250]],'#465765',23);line(context,[[742,250],[896,205]],'#465765',23);
   line(context,[[210,476],[352,427]],'#465765',23);line(context,[[740,427],[897,475]],'#465765',23);
   textCanvas(context,'PRIMARY OBJECTIVE',550,346,'900 18px Arial','#def4ca','center');
   textCanvas(context,'SPAWN A',125,318,'900 15px Arial','#80b9d9');textCanvas(context,'SPAWN B',893,318,'900 15px Arial','#db9b97');
 }else if(type==='escort'){
   [[55,56,325,154],[430,60,270,146],[750,50,300,170],[55,480,285,150],[400,472,315,160],[784,474,275,154]].forEach((a,i)=>rect(context,...a,i%2?'#1f2e3c':'#1c2b37'));
   rect(context,97,238,205,194,'#1e3440');rect(context,397,246,242,188,'#1e3440');rect(context,733,245,229,184,'#1e3440');
   line(context,[[73,349],[260,349],[332,349],[340,245],[515,245],[593,342],[790,342],[795,439],[995,439]],'#3d5a62',64);
   line(context,[[73,349],[260,349],[332,349],[340,245],[515,245],[593,342],[790,342],[795,439],[995,439]],'#8baa93',4,[14,16]);
   [[260,349],[515,245],[790,342]].forEach((p,i)=>{ring(context,p[0],p[1],30,'#b9d58c',3);textCanvas(context,'CP '+(i+1),p[0],p[1]+5,'900 13px Arial','#d3ebb9','center')});
   textCanvas(context,'ESCORT ROUTE / SCHEMATIC',550,37,'900 16px Arial','#91aaa9','center');
 }else{
   [[45,63,265,183],[47,430,270,190],[790,59,265,184],[785,430,260,191],[370,47,355,128],[370,510,355,127]].forEach((a,i)=>rect(context,...a,i%2?'#202d3c':'#1c2e37'));
   rect(context,353,229,393,216,'#1e363c','#506264',13);rect(context,419,280,262,120,'#2a4643','#698c7e',10);
   line(context,[[76,344],[340,344],[550,344],[753,344],[1022,344]],'#5a6f71',68);
   line(context,[[76,344],[340,344],[550,344],[753,344],[1022,344]],'#b1cb9a',3,[12,15]);
   ring(context,550,343,62,'#a2ba96',2);textCanvas(context,'POINT A',550,347,'900 17px Arial','#d9f5b3','center');
   textCanvas(context,'ENTRY',128,328,'900 15px Arial','#7bbfd9');textCanvas(context,'LAST HOLD',891,328,'900 15px Arial','#df999b');
 }
 // Layout callouts and copyright-safe watermark.
 textCanvas(context,'TACTICAL PRACTICE LAYOUT  //  NOT MATCH-ACCURATE',23,28,'800 11px Arial','#6f8290');
 textCanvas(context,name.toUpperCase()+'  /  '+currentMap().mode.toUpperCase(),24,CH-23,'800 12px Arial','#82979b');
 textCanvas(context,'N',CW-32,30,'900 18px Arial','#9faeaa','center');line(context,[[CW-32,39],[CW-32,73]],'#9faeaa',2);
}
function background(context){
 if(loadedImage){
  context.fillStyle='#0c1119';context.fillRect(0,0,CW,CH);
  const scale=Math.min(CW/loadedImage.width,CH/loadedImage.height),w=loadedImage.width*scale,h=loadedImage.height*scale;
  context.drawImage(loadedImage,(CW-w)/2,(CH-h)/2,w,h);
  context.fillStyle='rgba(5,11,17,.12)';context.fillRect(0,0,CW,CH);
  textCanvas(context,'CUSTOM OVERHEAD // '+currentMap().name.toUpperCase(),22,28,'900 12px Arial','#ffffff');
 }else baseMap(context);
}
function drawMark(context,s){
 const end=s.end||s.start;
 context.lineWidth=s.size||4;context.strokeStyle=s.color||'#c7f964';context.fillStyle=s.color||'#c7f964';context.lineCap='round';context.lineJoin='round';
 if(s.tool==='pen'){
  context.beginPath();(s.points||[]).forEach((p,i)=>i?context.lineTo(p.x,p.y):context.moveTo(p.x,p.y));context.stroke();
 }else if(s.tool==='arrow'){
  context.beginPath();context.moveTo(s.start.x,s.start.y);context.lineTo(end.x,end.y);context.stroke();
  const angle=Math.atan2(end.y-s.start.y,end.x-s.start.x),len=15+(s.size||4)*1.3;
  context.beginPath();context.moveTo(end.x,end.y);context.lineTo(end.x-len*Math.cos(angle-.52),end.y-len*Math.sin(angle-.52));context.lineTo(end.x-len*Math.cos(angle+.52),end.y-len*Math.sin(angle+.52));context.closePath();context.fill();
 }else if(s.tool==='circle'){
  const x=Math.min(s.start.x,end.x),y=Math.min(s.start.y,end.y),w=Math.max(2,Math.abs(end.x-s.start.x)),h=Math.max(2,Math.abs(end.y-s.start.y));
  context.beginPath();context.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,2*Math.PI);context.globalAlpha=.12;context.fill();context.globalAlpha=1;context.stroke();
 }
}
const portraitBitmaps=new Map();
function queuePortrait(hero){
 if(!hero?.portrait||portraitBitmaps.has(hero.id))return;
 portraitBitmaps.set(hero.id,null);
 const image=new Image();image.crossOrigin='anonymous';
 image.onload=()=>{portraitBitmaps.set(hero.id,image);renderBoard()};
 image.onerror=()=>portraitBitmaps.set(hero.id,false);
 image.src=hero.portrait;
}
function drawToken(context,t){
 const h=HERO_BY_ID[t.id];if(!h)return;
 const color=t.side==='enemy'?'#ff6d79':'#6bbfff',fill=t.side==='enemy'?'#522b35':'#213f55';
 context.save();context.shadowBlur=15;context.shadowColor='#000b';ring(context,t.x,t.y,25,color,4);context.shadowBlur=0;
 context.beginPath();context.arc(t.x,t.y,23,0,2*Math.PI);context.fillStyle=fill;context.fill();
 context.beginPath();context.arc(t.x,t.y,25,0,Math.PI*2);context.strokeStyle=color;context.lineWidth=3;context.stroke();
 const portrait=portraitBitmaps.get(h.id);
 if(portrait?.complete && portrait.naturalWidth){
  context.save();context.beginPath();context.arc(t.x,t.y,21,0,Math.PI*2);context.clip();context.drawImage(portrait,t.x-22,t.y-22,44,44);context.restore();
 } else {textCanvas(context,initials(h.name),t.x,t.y+6,'900 20px Arial','#ffffff','center');queuePortrait(h)}
 const name=h.name.toUpperCase();context.font='800 11px Arial';const width=Math.min(190,context.measureText(name).width+19);
 rect(context,t.x-width/2,t.y+29,width,22,'#0c1117',color,3);
 textCanvas(context,name,t.x,t.y+44,'800 11px Arial','#edf4ff','center');context.restore();
}
function drawScene(context,scale=1){
 context.save();context.scale(scale,scale);background(context);
 board().strokes.forEach(s=>drawMark(context,s));
 if(activeDrawing)drawMark(context,activeDrawing);
 board().tokens.forEach(t=>drawToken(context,t));
 // Phase identifier.
 rect(context,Math.max(620,CW-248),CH-59,225,35,'rgba(12,17,23,.90)','#506068',4);
 textCanvas(context,(board().phase||'Opening attack').toUpperCase(),CW-134,CH-38,'900 12px Arial','#c9fc69','center');
 context.restore();
}
function renderBoard(){if(!ctx)return;ctx.clearRect(0,0,CW,CH);drawScene(ctx)}
function download(filename,href){const a=document.createElement('a');a.href=href;a.download=filename;document.body.append(a);a.click();a.remove()}
$('#boardDownload').addEventListener('click',()=>{
 if($('#boardDownload').disabled)return;
 const format=$('#imageFormat').value==='png'?'png':'jpeg';
 const scale=1.5;
 const output=document.createElement('canvas');output.width=Math.round(CW*scale);output.height=Math.round(CH*scale);
 const outputContext=output.getContext('2d');
 if(!outputContext){notify('Image export failed: your browser could not create an image canvas.');return}
 const mime=format==='png'?'image/png':'image/jpeg';
 try{
  drawScene(outputContext,scale);
  const filename=`${state.currentMap}-${(board().phase||'plan').toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Date.now()}.${format==='png'?'png':'jpg'}`;
  if(typeof output.toBlob!=='function'){
   const dataUrl=output.toDataURL(mime,format==='png'?undefined:.88);
   download(filename,dataUrl);
   notify(`${format==='png'?'PNG':'JPG'} exported — ready to upload to Discord.`);
   return;
  }
  output.toBlob(blob=>{
   if(!blob){notify('Image export failed. Please retry.');return}
   const url=URL.createObjectURL(blob);
   download(filename,url);
   setTimeout(()=>URL.revokeObjectURL(url),6000);
   const size=blob.size>=1048576?(blob.size/1048576).toFixed(2)+' MB':Math.round(blob.size/1024)+' KB';
   notify(`${format==='png'?'PNG':'JPG'} exported (${size}) — ready to upload to Discord.`);
  },mime,format==='png'?undefined:.88);
 }catch(err){
  console.warn('Image export failed',err);
  notify('Image export failed. Try again after the map finishes loading.');
 }
});
setMap(state.currentMap);renderTokenList();$('#boardUndo').disabled=true;

document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){$('#heroModal').hidden=true;$('#sidebar').classList.remove('open');return}
 const editable=['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName);
 if(editable||!$('#page-board').classList.contains('active'))return;
 if(e.ctrlKey&&e.key.toLowerCase()==='z'){e.preventDefault();undoBoard();return}
 const keys={v:'select',p:'pen',a:'arrow',c:'circle',e:'eraser'};
 if(keys[e.key.toLowerCase()])setTool(keys[e.key.toLowerCase()]);
});
})();
