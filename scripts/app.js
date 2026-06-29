(function(){
  function seedFor(str){var s=0;for(var i=0;i<str.length;i++)s=(s*31+str.charCodeAt(i))%999983;return s;}
  // build a stable 7-entry timeline: real signals first, then synthetic older ones
  var TL_TIMES=["7h","11h","16h","22h","1d","2d","3d","4d","5d"];
  function timelineFor(id){
    var real=(SIGNALS[id]||[]).slice();
    var out=real.slice();
    var seed=seedFor(id);
    var i=0;
    while(out.length<7){
      var ev=TL_EVENTS[(seed+i*5)%TL_EVENTS.length];
      var src=TL_SRC[(seed+i*3)%TL_SRC.length];
      out.push({src:src,head:ev.t,time:TL_TIMES[Math.min(out.length, TL_TIMES.length-1)],dir:ev.d,m:ev.m});
      i++;
    }
    // normalize timestamps to read oldest→down the list
    for(var k=0;k<out.length;k++){ if(!out[k].time) out[k].time=TL_TIMES[Math.min(k,TL_TIMES.length-1)]; }
    return out.slice(0,7);
  }
  var liveTL={id:null, items:[], timer:null};
  function liveEventFor(id){
    var ev=TL_EVENTS[Math.floor(Math.random()*TL_EVENTS.length)];
    var src=TL_SRC[Math.floor(Math.random()*TL_SRC.length)];
    return {src:src,head:ev.t,time:"now",dir:ev.d,m:ev.m,live:true};
  }
  function ageLabel(prev){ // bump a "now" item to a real age once a newer one arrives
    if(prev==='now')return '1m';
    var n=parseInt(prev,10)||1;
    if(prev.indexOf('m')>=0)return (n+3)+'m';
    return prev;
  }
  function renderTimeline(){
    var host=document.getElementById('d-signals'); if(!host)return;
    host.innerHTML=liveTL.items.slice(0,7).map(sigRow).join('');
  }
  function startLiveTL(){
    stopLiveTL();
    liveTL.timer=setInterval(function(){
      var det=document.getElementById('s-detail');
      if(!det||!det.classList.contains('active')){return;}
      // age the current entries, prepend a fresh "now" event, keep 7
      liveTL.items.forEach(function(it){ if(it.live){it.live=false;} it.time=it.time==='now'?'1m':it.time; });
      liveTL.items.unshift(liveEventFor(liveTL.id));
      liveTL.items=liveTL.items.slice(0,7);
      renderTimeline();
      var first=document.querySelector('#d-signals .sigrow'); if(first){first.classList.add('sig-in');}
    }, 4200);
  }
  function stopLiveTL(){ if(liveTL.timer){clearInterval(liveTL.timer);liveTL.timer=null;} }
  function curOf(id){return CUR[id]||{calls:10,hit:0.7,rallied:20,yf:0,col:"#D8C9A4"};}
  var LOCK=7, FEE=0.94;
  var positions=[], record={won:0,lost:0}, balance=500, currentId="humanoidrobots", carousel={}, leadSlide={}, vio;
  // portfolio ledger — running history of balance changes
  var ledger=[{kind:'open',label:'Opening balance',delta:500,bal:500,t:Date.now()-86400000*9}];
  function ledgerAdd(kind,label,delta){ balance+=delta; ledger.push({kind:kind,label:label,delta:delta,bal:balance,t:Date.now()}); }
  function netPL(){var p=0;ledger.forEach(function(e){if(e.kind==='win'||e.kind==='loss')p+=e.delta;});return p;}
  // seed a little demo history + open positions so the page is meaningful
  (function seedSignals(){
    ledgerAdd('add','Added credits',1000);
    // a couple of settled bets in the past
    ledgerAdd('stake','Placed · GTA VI',-200); ledgerAdd('win','Won · GTA VI',320);
    ledgerAdd('stake','Placed · Bird Flu',-150); ledgerAdd('loss','Lost · Bird Flu',-150);
    record.won=1; record.lost=1;
    // open positions currently live
    positions.push({id:'humanoidrobots',dir:'rise',stake:250,lev:2,entry:540,target:600,profit:300,payout:550,status:'open',day:3,placedAt:Date.now()-3600000*5});
    positions.push({id:'claude',dir:'rise',stake:120,lev:1,entry:500,target:540,profit:84,payout:204,status:'open',day:2,placedAt:Date.now()-3600000*20});
    // reflect the two open stakes in the ledger + balance
    ledgerAdd('stake','Placed · Humanoid Robots',-250);
    ledgerAdd('stake','Placed · Claude',-120);
  })();
  var HANDLES=["lina.eth","tomi","amaka","devon","sora","mira.eth","kojo","val"];
  var AVCOL=["#D8C9A4","#A9C7C2","#C9B0A0","#9aa6c9","#cdb4d8","#b8c9a0"];

  // ===== User badges — earned marks of standing/success =====
  // each badge: id -> {label, title (tooltip), svg path(s), color}
  var BADGE_DEFS={
    verified:{label:'Verified',svg:'<path d="M12 2l2.4 2.1 3.1-.4 1 3 2.8 1.4-1.1 3 1.1 3-2.8 1.4-1 3-3.1-.4L12 22l-2.4-2.1-3.1.4-1-3L2.7 14.4l1.1-3-1.1-3L5.5 4l1-3 3.1.4z"/><path class="bcheck" d="M8.5 12.2l2.3 2.3 4.6-4.8" fill="none" stroke="#0B0C0F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',color:'#4DA3FF',solid:true},
    top:{label:'Top Curator',svg:'<path d="M3 8l4.5 3L12 4l4.5 7L21 8l-1.8 10H4.8L3 8z"/>',color:'#F2B33D',solid:true},
    og:{label:'OG · early member',svg:'<path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8z"/>',color:'#A98BFF',solid:true},
    event:{label:'Event champion',svg:'<path d="M7 4h10v3a5 5 0 0 1-10 0V4z"/><path d="M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 13h4v3h-4z"/><path d="M8 20h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',color:'#54D9A6',solid:true},
    streak:{label:'Hot streak',svg:'<path d="M12 2c1 3-1 4-1 6 0 1.5 1 2 1 2s2-1 2-3c2 1.5 4 4 4 7a6 6 0 0 1-12 0c0-3 3-6 4-8 .8-1.6 1.5-2.5 2-4z"/>',color:'#FF7A4D',solid:true}
  };
  // assign badges per user — more/better badges read as more successful
  var USER_BADGES={
    "@thequietedit":["verified","top","streak"],
    "@viceloop":["verified","top","event"],
    "@claudehead":["verified","top","og"],
    "@eloquent":["verified","top"],
    "@parlay":["verified","streak"],
    "@pacers":["verified","event"],
    "@jerry":["verified","og"],
    "@popmart":["verified","streak"],
    "@redcandle":["streak"],
    "@shipfast":["verified","og"],
    "@barry":["verified"],
    "@dirkdiggler":["verified"],
    "@dumb":["og"],
    "@you":[]
  };
  function badgesFor(handle){return USER_BADGES[handle]||[];}
  function badgeIconHTML(bid){var d=BADGE_DEFS[bid];if(!d)return '';
    return '<span class="ubadge" data-badge="'+bid+'" title="'+d.label+'" style="color:'+d.color+'"><svg viewBox="0 0 24 24" fill="'+(d.solid?'currentColor':'none')+'">'+d.svg+'</svg></span>';}
  function badgeRow(handle,max){var b=badgesFor(handle);if(max)b=b.slice(0,max);return b.map(badgeIconHTML).join('');}
  // a username + its badges, as a tappable chip
  function userChip(handle,maxBadges){
    return '<span class="uchip"><span class="post-u" data-user="'+handle+'">'+handle+'</span>'+
      (badgesFor(handle).length?'<span class="ubadges">'+badgeRow(handle,maxBadges)+'</span>':'')+'</span>';
  }

  function fmt(n){return Math.round(n).toLocaleString();}
  function mult(t,dir){var s=(dir==='rise'?t.sent:100-t.sent)/100; return Math.max(1.08,FEE/Math.max(0.05,s));}

  function clipHTML(c){return '<div class="clip" style="--c1:'+c[0]+';--c2:'+c[1]+';--c3:'+(c[2]||c[1])+'"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span><span class="grain"></span></div>';}
  function mediaHTML(t,m){
    if(m.k==='img'){
      if(m.vsrc){
        // Clip slide: paint the poster (first frame) as the background immediately, so scrolling
        // never shows the animated gradient flashing before the video is ready. No tint over clips.
        var poster=m.poster||m.vsrc.replace(/\.mp4(\?.*)?$/,'.jpg');
        return '<div class="media" data-vsrc="'+m.vsrc+'" data-poster="'+poster+'" style="background:#0f0f13"></div>';
      }
      return '<div class="media">'+clipHTML(t.theme)+'<div class="vtint" style="--c1:'+t.theme[0]+';--c3:'+t.theme[2]+'"></div></div>';
    }
    if(m.k==='quote')return '<div class="media quote">'+clipHTML([m.c[0],m.c[1]||m.c[0],m.c[2]||m.c[0]])+'<div class="qscrim"></div><div class="qinner"><p>'+m.q+'</p></div></div>';
    return '<div class="media">'+clipHTML(m.c)+'</div>';
  }
  // ===== Pro mode: one candlestick trader chart over the blurred video =====
  // Faint at rest (video shows through) -> full & forward on hold (live + crosshair).
  var candleData={};
  function lcg(s){return (s*9301+49297)%233280;}

  // ---- candlestick chart ----
  var CDN='#F7931A'; // down = solid orange ; up = hollow white
  // plot area (% of card): main 16..58, volume 64..78, x 4..84 (right gutter = price axis)
  var CX0=4,CX1=84,CTOP=14,CBOT=51,CVTOP=57,CVBOT=68;
  function seedCandles(t){
    var seed=t.deg*13+101,n=28,base=t.deg||500,price=base*0.93,cs=[];
    for(var i=0;i<n;i++){seed=lcg(seed);var r1=seed/233280;seed=lcg(seed);var r2=seed/233280;
      var o=price,c=o+(r1-0.5)*base*0.04+(t.up?base*0.004:-base*0.004);
      c=Math.max(base*0.62,Math.min(base*1.22,c));
      cs.push({o:o,c:c,hi:Math.max(o,c)+r2*base*0.018,lo:Math.min(o,c)-(1-r2)*base*0.018,v:0.35+r2*0.65});price=c;}
    cs[n-1].c=base;
    return {candles:cs,seed:seed,tk:0,base:base};
  }
  // gentle live tick: nudge last candle; append a fresh candle every 6 ticks
  function tickCandle(id){var cd=candleData[id];if(!cd)return;var cs=cd.candles,last=cs[cs.length-1];
    cd.tk++; cd.seed=lcg(cd.seed);var r=cd.seed/233280;
    if(cd.tk%6===0){var o=last.c;cd.seed=lcg(cd.seed);var r2=cd.seed/233280;
      var c=o+(r-0.5)*cd.base*0.018;
      cs.push({o:o,c:c,hi:Math.max(o,c)+r2*cd.base*0.008,lo:Math.min(o,c)-(1-r2)*cd.base*0.008,v:0.35+r2*0.65});
      if(cs.length>28)cs.shift();
    }else{var step=(r-0.5)*cd.base*0.01;
      last.c=Math.max(last.o*0.96,Math.min(last.o*1.04,last.c+step));
      last.hi=Math.max(last.hi,last.c);last.lo=Math.min(last.lo,last.c);}
  }
  function candleScale(cd){var cs=cd.candles,his=[],los=[],vs=[];
    cs.forEach(function(k){his.push(k.hi);los.push(k.lo);vs.push(k.v);});
    var hi=Math.max.apply(null,his),lo=Math.min.apply(null,los),pad=(hi-lo)*0.08||5;
    return {mn:lo-pad,mx:hi+pad,vmax:Math.max.apply(null,vs),n:cs.length};
  }
  function candleSVG(cd,sc){var cs=cd.candles,n=sc.n,cw=(CX1-CX0)/n,bw=cw*0.6,svg='';
    function Y(v){return (CBOT-((v-sc.mn)/(sc.mx-sc.mn))*(CBOT-CTOP)).toFixed(2);}
    for(var g=0;g<=4;g++){var gy=(CTOP+(CBOT-CTOP)*g/4).toFixed(2);
      svg+='<line x1="'+CX0+'" y1="'+gy+'" x2="'+CX1+'" y2="'+gy+'" stroke="rgba(255,255,255,.08)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>';}
    cs.forEach(function(k,i){var xc=CX0+(i+0.5)*cw,up=k.c>=k.o,col=up?'rgba(255,255,255,.95)':CDN;
      var bt=+Y(Math.max(k.o,k.c)),bb=+Y(Math.min(k.o,k.c)),bh=Math.max(0.4,bb-bt);
      svg+='<line x1="'+xc.toFixed(2)+'" y1="'+Y(k.hi)+'" x2="'+xc.toFixed(2)+'" y2="'+Y(k.lo)+'" stroke="'+col+'" stroke-width="1" vector-effect="non-scaling-stroke"/>';
      if(up)svg+='<rect x="'+(xc-bw/2).toFixed(2)+'" y="'+bt+'" width="'+bw.toFixed(2)+'" height="'+bh.toFixed(2)+'" fill="rgba(11,12,16,.25)" stroke="rgba(255,255,255,.95)" stroke-width="1" vector-effect="non-scaling-stroke"/>';
      else svg+='<rect x="'+(xc-bw/2).toFixed(2)+'" y="'+bt+'" width="'+bw.toFixed(2)+'" height="'+bh.toFixed(2)+'" fill="'+CDN+'"/>';});
    cs.forEach(function(k,i){var xc=CX0+(i+0.5)*cw,up=k.c>=k.o,vh=(k.v/sc.vmax)*(CVBOT-CVTOP);
      svg+='<rect x="'+(xc-bw/2).toFixed(2)+'" y="'+(CVBOT-vh).toFixed(2)+'" width="'+bw.toFixed(2)+'" height="'+vh.toFixed(2)+'" fill="'+(up?'rgba(255,255,255,.42)':'rgba(247,147,26,.55)')+'"/>';});
    var last=cs[n-1].c;
    svg+='<line x1="'+CX0+'" y1="'+Y(last)+'" x2="'+CX1+'" y2="'+Y(last)+'" stroke="#FFD43B" stroke-width="0.8" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>';
    return svg;
  }
  function candleSVGTag(cd,sc){return '<svg class="candlesvg" viewBox="0 0 100 100" preserveAspectRatio="none">'+candleSVG(cd,sc)+'</svg>';}
  function renderCandles(el){var id=el.getAttribute('data-cid'),cd=candleData[id];if(!cd)return;
    var sc=candleScale(cd);
    var svg=el.querySelector('.candleholder'); if(svg)svg.innerHTML=candleSVGTag(cd,sc);
    var ax=el.querySelector('.priceaxis');
    if(ax){var h='';for(var t=0;t<=4;t++){var val=sc.mx-(sc.mx-sc.mn)*t/4,y=(CTOP+(CBOT-CTOP)*t/4);
      h+='<span class="pax-l" style="top:'+y.toFixed(2)+'%">'+Math.round(val)+'°</span>';}ax.innerHTML=h;}
    var last=cd.candles[sc.n-1].c, ly=(CBOT-((last-sc.mn)/(sc.mx-sc.mn))*(CBOT-CTOP));
    var pill=el.querySelector('.pricepill'); if(pill){pill.style.top=ly.toFixed(2)+'%';pill.textContent=Math.round(last)+'°';}
  }

  function chartHTML(t,id){
    if(!candleData[id])candleData[id]=seedCandles(t);
    var cn=(leadSlide[id]||0);if(cn>=vcount(id))cn=0;
    var vid=(t.img?'<img class="vid chartvid" src="'+t.img+'" alt="" onerror="this.style.display=\'none\'">':'');
    var vs=vcount(id)?clipAttrs(id,cn+1,false,' data-vchart="1"'):'';
    return '<div class="media chartmedia"'+vs+' data-cid="'+id+'">'+vid+
      '<div class="chartvtint"></div><div class="chartglow"></div>'+
      '<div class="candlelayer">'+
        '<div class="svgholder candleholder">'+candleSVGTag(candleData[id],candleScale(candleData[id]))+'</div>'+
        '<div class="priceaxis"></div><div class="pricepill"></div>'+
        '<div class="timeaxis"><span style="left:11%;top:71%">3w</span><span style="left:35%;top:71%">2w</span><span style="left:59%;top:71%">1w</span><span style="left:82%;top:71%">now</span></div>'+
      '</div>'+
      '<div class="chartcross"><span class="cc-line"></span><span class="cc-read"></span></div>'+
      '</div>';
  }

  // REST: gentle ambient drift of the (faint) candle chart on every visible card
  function tickCharts(){if(!proMode||!document.getElementById('s-feed').classList.contains('active'))return;
    document.querySelectorAll('#s-feed .chartmedia:not(.holding)').forEach(function(el){
      if(!isNearViewport(el,120)||!candleData[el.getAttribute('data-cid')])return;
      tickCandle(el.getAttribute('data-cid')); renderCandles(el);});
  }
  setInterval(tickCharts,2200);
  // HOLD: faster real-time candle updates + crosshair on the held card
  var holdFast=null,pressTimer=null,pStart=null;
  function startFast(el){stopFast();holdFast=setInterval(function(){
    tickCandle(el.getAttribute('data-cid')); renderCandles(el);
    var read=el.querySelector('.cc-read'); if(read&&read.dataset.x)chartCross(el,+read.dataset.x);
  },1100);}
  function stopFast(){if(holdFast){clearInterval(holdFast);holdFast=null;}}
  function chartCross(cm,clientX){
    var r=cm.getBoundingClientRect();var x=Math.max(0,Math.min(1,(clientX-r.left)/r.width));
    var line=cm.querySelector('.cc-line'),read=cm.querySelector('.cc-read');
    if(line)line.style.left=(x*100)+'%';
    var cd=candleData[cm.getAttribute('data-cid')];
    if(read&&cd){var cs=cd.candles,px=Math.max(0,Math.min(1,(x*100-CX0)/(CX1-CX0)));
      var idx=Math.min(cs.length-1,Math.max(0,Math.round(px*(cs.length-1))));
      read.style.left=(x*100)+'%';read.dataset.x=clientX;read.textContent=Math.round(cs[idx].c)+'°';}
  }
  function promoteHold(el,clientX){
    if(el.classList.contains('holding'))return;
    el.classList.add('holding');
    renderCandles(el);
    if(clientX!=null)chartCross(el,clientX);
    startFast(el);
  }
  // press-and-hold -> hold state; vertical drag = feed scroll, cancels.
  document.addEventListener('pointerdown',function(e){
    var cm=e.target.closest('#s-feed .chartmedia');if(!cm)return;
    endHold();
    pStart={x:e.clientX,y:e.clientY,el:cm};
    pressTimer=setTimeout(function(){promoteHold(cm,null);},200);
  },{passive:true});
  document.addEventListener('pointermove',function(e){
    if(!pStart)return; var cm=pStart.el, dx=e.clientX-pStart.x, dy=e.clientY-pStart.y;
    if(cm.classList.contains('holding')){chartCross(cm,e.clientX);return;}
    if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){endHold();return;}
    if(Math.abs(dx)>8){clearTimeout(pressTimer);promoteHold(cm,e.clientX);}
  },{passive:true});
  function endHold(){
    clearTimeout(pressTimer);stopFast();pStart=null;
    document.querySelectorAll('.chartmedia.holding').forEach(function(c){c.classList.remove('holding');});
  }
  document.addEventListener('pointerup',endHold);
  document.addEventListener('pointercancel',endHold);

  var feed=document.getElementById('feed');
  vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;
    if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}});},{root:feed,threshold:.55});

  function vcount(id){return CLIPS[id]||0;}
  function clipSrc(id,n,thumb){return (thumb?'media/thumbs/':'media/')+id+'/0'+n+'.mp4';}
  function clipPoster(id,n){return 'media/'+id+'/0'+n+'.jpg';}
  function clipAttrs(id,n,thumb,extra){return ' data-vsrc="'+clipSrc(id,n,thumb)+'" data-poster="'+clipPoster(id,n)+'"'+(extra||'');}
  function previewClipId(id){if(vcount(id))return id;var rel=SUBMAP[id]||[];
    for(var i=0;i<rel.length;i++){if(vcount(rel[i][0]))return rel[i][0];}
    return null;}
  var isPhone=!!(window.matchMedia&&window.matchMedia('(max-width:600px)').matches);
  // ===== Hard cap on simultaneously-decoding videos. iOS Safari has a small limit on live video
  //       decoders/memory; in Pro mode (charts + clips) this is what tips it into a crash. We keep
  //       at most MAXVIDS mounted and free the oldest first — no feature is removed, just bounded. =====
  var MAXVIDS = isPhone ? 4 : 12;
  var _vlive = []; var _pf = {};
  // Cache-bust clips by version so re-encodes (same filename) always refetch instead of serving a
  // stale, oversized file from the browser cache. Bump ASSET_V whenever the .mp4s are re-encoded.
  var ASSET_V = 'v20260629d';
  function withV(u){ return u + (u.indexOf('?')>=0?'&':'?') + ASSET_V; }
  // Prefetch only off-phone. Mobile Safari is far more constrained by media memory than network here.
  function prefetchURL(u){ if(!u||isPhone)return; u=withV(u); if(_pf[u])return; _pf[u]=1;
    try{ fetch(u,{cache:'force-cache'}).then(function(r){return r&&r.blob&&r.blob();}).catch(function(){}); }catch(e){} }
  function prefetchAhead(el){ if(!el.closest)return; var tp=el.closest('.topic'); if(!tp)return;
    var nx=tp.nextElementSibling,c=0;
    while(nx&&c<3){ var m=nx.querySelector&&nx.querySelector('[data-vsrc]'); if(m)prefetchURL(m.getAttribute('data-vsrc')); nx=nx.nextElementSibling; c++; } }
  // Lazy mount: only on-screen videos exist as <video> elements, so iOS never runs out of memory.
  var vmount=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting&&isActiveMediaTarget(e.target))mountVid(e.target);else unmountVid(e.target);});},{root:null,rootMargin:'350px',threshold:.2});
  function isActiveMediaTarget(el){
    var s=el&&el.closest&&el.closest('.screen');
    if(s&&!s.classList.contains('active'))return false;
    var track=el&&el.closest&&el.closest('[data-track]');
    if(track&&track.closest('.topic')&&el.getAttribute('data-slide-mount')!=='1')return false;
    return true;
  }
  function isNearViewport(el,margin){var r=el.getBoundingClientRect(),m=margin==null?260:margin;
    return r.bottom>=-m&&r.top<=window.innerHeight+m&&r.right>=-m&&r.left<=window.innerWidth+m;}
  function posterFor(el){var src=el.getAttribute('data-vsrc');return el.getAttribute('data-poster')||(src?src.replace(/\.mp4(\?.*)?$/,'.jpg'):'');}
  function applyMediaPoster(el){if(el._posterSet)return;var poster=posterFor(el);if(!poster)return;
    el.style.backgroundImage='url("'+poster+'")';el.style.backgroundSize='cover';el.style.backgroundPosition='center';el._posterSet=1;}
  function _teardownVid(el){var v=el._v;if(!v)return;try{v.pause();v.removeAttribute('src');v.load();}catch(e){}v.remove();el._v=null;
    var _tnt=el.querySelector('.vtint');if(_tnt)_tnt.style.display='';}
  function mountVid(el){
    if(el._v||!el.getAttribute('data-vsrc')||!isActiveMediaTarget(el))return;
    var src=el.getAttribute('data-vsrc');
    var poster=posterFor(el); // first-frame still: shows instantly, no gradient flash
    applyMediaPoster(el);
    var v=document.createElement('video');
    v.className='vid'+(el.hasAttribute('data-vchart')?' chartvid':'');
    v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.preload=isPhone?'metadata':'auto';v.style.zIndex='1';
    v.setAttribute('poster',poster);
    // Keep the same still on the card itself so unmount (scroll-away) reveals the frame, not the gradient.
    v.addEventListener('error',function(){if(el._v===v)el._v=null;v.remove();});
    v.src=withV(src);
    el.appendChild(v);el._v=v;
    // Drop the theme-color wash over the actual video (kept only for no-clip placeholder cards).
    var _tnt=el.querySelector('.vtint');if(_tnt)_tnt.style.display='none';
    var p=v.play();if(p&&p.catch)p.catch(function(){});
    // enforce the global decoder cap (free the oldest-mounted that's no longer this one)
    _vlive.push(el);
    while(_vlive.length>MAXVIDS){ var old=_vlive.shift(); if(old!==el)_teardownVid(old); }
    prefetchAhead(el);
  }
  function unmountVid(el){var i=_vlive.indexOf(el);if(i>=0)_vlive.splice(i,1);_teardownVid(el);}
  function observeVids(container){if(!container)return;container.querySelectorAll('[data-vsrc]').forEach(function(el){vmount.observe(el);});}
  function releaseMediaIn(container){if(!container)return;container.querySelectorAll('[data-vsrc]').forEach(function(el){unmountVid(el);try{vmount.unobserve(el);}catch(e){}});}
  function refreshActiveMedia(container){container=container||document.querySelector('.screen.active');if(!container)return;
    observeVids(container);
    container.querySelectorAll('[data-vsrc]').forEach(function(el){
      if(isActiveMediaTarget(el)&&isNearViewport(el,isPhone?180:360)){applyMediaPoster(el);mountVid(el);}else unmountVid(el);
    });}
  // Images for a trend: the multi-image array if present, else the single hero image.
  function imgsOf(t){var arr=[];if(t.img)arr.push(t.img);if(t.imgs)t.imgs.forEach(function(u){if(arr.indexOf(u)<0)arr.push(u);});return arr;}
  // Feed media = 3 image slides (padded from the trend's images), plus the editorial quote.
  function mediaItemsOf(t){
    var imgs=imgsOf(t);
    var items=[];
    for(var n=0;n<3;n++){ items.push({k:'img', u: imgs.length?imgs[n%imgs.length]:null, vsrc:(n<vcount(t.id)?clipSrc(t.id,n+1,false):null), poster:(n<vcount(t.id)?clipPoster(t.id,n+1):null) }); }
    for(var i=0;i<t.media.length;i++){var k=t.media[i].k;if(k!=='img'&&k!=='vid')items.push(t.media[i]);}
    return items;
  }
  function topicHTML(t,id){
    var items=mediaItemsOf(t);
    var niche=t.kind==='niche';
    var cur=CUR[id]||{calls:10,hit:0.7,rallied:20,yf:0,col:"#D8C9A4"};
    var right=Math.round(cur.hit*cur.calls);
    var follow=(cur.yf||0);
    var faces='';
    for(var fi=0;fi<Math.min(follow,3);fi++){faces+='<i style="background:'+AVCOL[(fi+t.deg)%AVCOL.length]+'"></i>';}
    var hint='';
    var sentLabel=(t.up?'▲ ':'▼ ')+t.sent+'%';
    var social=(!proMode)
      ? '<span class="dotsep">·</span><span class="nh-count"><b>'+t.fc+'</b> curators</span>'
        +(follow>0?'<span class="dotsep">·</span><span class="nh-follow"><span class="facepile">'+faces+'</span><b>'+follow+'</b> you follow</span>':'')
      : '';
    var curator='<div class="curator">'+
        '<span class="cav" style="background:'+cur.col+'"></span>'+
        '<span class="byline" data-user="'+t.user+'" role="button">'+t.user+'</span>'+
        social+'</div>';
    var media=proMode?chartHTML(t,id):items.map(function(m){return mediaHTML(t,m);}).join('');
    return '<div class="mtrack" data-track>'+media+'</div>'+
      '<div class="scrim-bot"></div>'+
      '<div class="fmeta" data-go role="button">'+
        '<div class="metarow"><span class="deg'+(t.up?'':' dn')+'">'+t.deg+'°</span><span class="sentmini '+(t.up?'up':'dn')+'">'+sentLabel+'</span></div>'+
        '<div class="trow"><div class="tname">'+t.name+'</div></div>'+
        curator+
        hint+
      '</div>';
  }

  function renderFeed(kind){
    feedKind=kind;
    releaseMediaIn(feed);
    feed.innerHTML='';
    (ORDERS[kind]||order).forEach(function(id){
      var t=T[id]; carousel[id]={i:0,n:proMode?1:mediaItemsOf(t).length};
      var el=document.createElement('article'); el.className='topic'+(t.kind==='niche'?' niche':''); el.setAttribute('data-id',id);
      el.innerHTML=topicHTML(t,id);
      feed.appendChild(el);
      wireCarousel(el,id);
      if(leadSlide[id])setSlide(el,id,leadSlide[id],true);
    });
    observeVids(feed);
    setBal();
    feed.scrollTop=0;
    fitTitles();
    refreshActiveMedia(feed);
  }
  // Shrink each feed title so it always fits on one line beside the degree/percentage.
  function fitTitles(){
    feed.querySelectorAll('.fmeta .tname').forEach(function(el){
      el.style.fontSize='';
      var avail=el.clientWidth; if(!avail) return;
      var need=el.scrollWidth, max=32, min=18;
      if(need>avail){
        var size=Math.max(min,Math.floor(max*avail/need));
        el.style.fontSize=size+'px';
        var guard=0;
        while(size>min && el.scrollWidth>el.clientWidth && guard++<24){size-=1;el.style.fontSize=size+'px';}
      }
    });
  }
  var fitT; window.addEventListener('resize',function(){clearTimeout(fitT);fitT=setTimeout(fitTitles,120);});

  function slideDelta(k,pos,n){
    var d=k-pos;
    if(n>1){if(d>n/2)d-=n;if(d<-n/2)d+=n;}
    return d;
  }
  function renderCubePosition(el,id,pos,instant){
    var c=carousel[id],track=el.querySelector('[data-track]');if(!c||!track)return;
    var slides=track.querySelectorAll('.media'),reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var wasDragging=track.classList.contains('dragging');
    if(instant&&!wasDragging)track.classList.add('dragging');
    slides.forEach(function(sl,k){
      var d=slideDelta(k,pos,c.n),ad=Math.abs(d),vis=ad<=1.04;
      sl.setAttribute('data-slide-visible',vis?'1':'0');
      sl.setAttribute('data-slide-mount',ad<.62?'1':'0');
      sl.style.visibility=vis?'visible':'hidden';
      sl.style.pointerEvents=ad<.08?'auto':'none';
      sl.style.zIndex=String(1000-Math.round(ad*100));
      if(reduced){
        sl.style.opacity=ad<.5?'1':'0';
        sl.style.transform='translate3d(0,0,0)';
        return;
      }
      var x=Math.max(-54,Math.min(54,d*54));
      var angle=Math.max(-90,Math.min(90,-d*90));
      var z=-Math.min(120,ad*72);
      sl.style.transformOrigin=d<0?'right center':(d>0?'left center':'center center');
      sl.style.opacity=vis?String(ad>=.98?0:Math.max(.38,1-ad*.35)):'0';
      sl.style.transform=vis
        ? 'translate3d('+x+'%,0,'+z+'px) rotateY('+angle+'deg)'
        : 'translate3d('+(d>0?92:-92)+'%,0,-140px) rotateY('+(d>0?-90:90)+'deg)';
    });
    if(instant&&!wasDragging){void track.offsetWidth;track.classList.remove('dragging');}
  }
  function setSlide(el,id,i,instant){
    var c=carousel[id];if(!c)return;
    c.i=((i%c.n)+c.n)%c.n;
    renderCubePosition(el,id,c.i,instant);
    refreshActiveMedia(el);
  }
  function wireCarousel(el,id){
    var track=el.querySelector('[data-track]'),c=carousel[id],x0=0,y0=0,t0=0,axis='',pid=null,start=0;
    if(!track||!c)return;
    renderCubePosition(el,id,c.i,true);
    if(c.n<2){
      track.addEventListener('pointerdown',function(e){
        if(e.button!=null&&e.button!==0)return;
        x0=e.clientX;y0=e.clientY;t0=Date.now();pid=e.pointerId;
      });
      track.addEventListener('pointerup',function(e){
        if(pid!==e.pointerId)return;
        var dx=e.clientX-x0,dy=e.clientY-y0,dt=Math.max(1,Date.now()-t0);
        if(Math.abs(dx)<8&&Math.abs(dy)<8&&dt<350)openDetail(id);
        pid=null;
      });
      track.addEventListener('pointercancel',function(e){if(pid===e.pointerId)pid=null;});
      return;
    }
    track.addEventListener('pointerdown',function(e){
      if(e.button!=null&&e.button!==0)return;
      x0=e.clientX;y0=e.clientY;t0=Date.now();axis='';pid=e.pointerId;start=c.i;
    });
    track.addEventListener('pointermove',function(e){
      if(pid!==e.pointerId)return;
      var dx=e.clientX-x0,dy=e.clientY-y0,adx=Math.abs(dx),ady=Math.abs(dy);
      if(!axis&&(adx>8||ady>8))axis=adx>ady*1.15?'x':'y';
      if(axis!=='x')return;
      if(track.setPointerCapture){try{track.setPointerCapture(pid);}catch(err){}}
      e.preventDefault();
      track.classList.add('dragging');
      var w=Math.max(1,track.clientWidth),delta=Math.max(-1,Math.min(1,-dx/w));
      renderCubePosition(el,id,start+delta,true);
      refreshActiveMedia(el);
    });
    function end(e){
      if(pid!==e.pointerId)return;
      var dx=e.clientX-x0,dy=e.clientY-y0,dt=Math.max(1,Date.now()-t0),adx=Math.abs(dx);
      track.classList.remove('dragging');
      if(axis==='x'){
        var quick=adx/dt>.45,far=adx>track.clientWidth*.18;
        setSlide(el,id,start+(far||quick?(dx<0?1:-1):0));
      }else if(adx<8&&Math.abs(dy)<8&&dt<350){openDetail(id);}
      if(track.releasePointerCapture){try{track.releasePointerCapture(pid);}catch(err){}}
      pid=null;axis='';
    }
    track.addEventListener('pointerup',end);
    track.addEventListener('pointercancel',function(e){
      if(pid!==e.pointerId)return;
      track.classList.remove('dragging');
      setSlide(el,id,start,true);
      pid=null;axis='';
    });
  }

  function setBal(){var b=document.querySelectorAll('[data-bal]');for(var i=0;i<b.length;i++)b[i].textContent=fmt(balance);
    var fb=document.getElementById('fc-bal');if(fb)fb.textContent=fmt(balance);}

  var screens={feed:'s-feed',explore:'s-explore',detail:'s-detail',forecasts:'s-forecasts',taste:'s-taste',profile:'s-profile',settings:'s-settings',collection:'s-collection',timeline:'s-timeline',posts:'s-posts',saved:'s-saved',stub:'s-stub',userlist:'s-userlist',postdetail:'s-postdetail',notif:'s-notif',editprofile:'s-editprofile',security:'s-security',help:'s-help',invite:'s-invite',article:'s-article',signaldetail:'s-signaldetail'};
  function currentScreenKey(){var k='feed';Object.keys(screens).forEach(function(key){if(document.getElementById(screens[key]).classList.contains('active'))k=key;});return k;}
  var phoneShell=document.getElementById('phone');
  function lockPhoneShellScroll(){if(!phoneShell)return;if(phoneShell.scrollTop)phoneShell.scrollTop=0;if(phoneShell.scrollLeft)phoneShell.scrollLeft=0;}
  if(phoneShell)phoneShell.addEventListener('scroll',lockPhoneShellScroll,{passive:true});
  function cleanupInactiveMedia(activeTab){
    Object.keys(screens).forEach(function(k){if(k!==activeTab)releaseMediaIn(document.getElementById(screens[k]));});
  }
  function activateScreenMedia(tab){var sid=screens[tab],el=sid&&document.getElementById(sid);if(el)refreshActiveMedia(el);}
  var navStack=[];
  var ROOTS=['feed','explore','forecasts','posts','taste'];
  function show(tab,isBack){
    var cur=currentScreenKey();
    if(!isBack){ if(ROOTS.indexOf(tab)>=0){navStack=[];} else if(cur!==tab){navStack.push(cur);} }
    Object.keys(screens).forEach(function(k){document.getElementById(screens[k]).classList.toggle('active',k===tab);});
    lockPhoneShellScroll();
    var SUBS=['detail','profile','settings','collection','timeline','saved','stub','userlist','postdetail','notif','editprofile','security','help','invite','article','signaldetail'];
    var sub=SUBS.indexOf(tab)>=0;
    var navKey=sub?null:tab;
    document.querySelector('.tabbar').style.display=(sub&&tab!=='profile')?'none':'';
    document.querySelectorAll('.tabbar button').forEach(function(b){b.setAttribute('aria-current',b.getAttribute('data-tab')===navKey?'true':'false');});
    if(navKey)moveInd();
    if(tab!=='detail')stopLiveTL();
    if(tab!=='feed')endHold();
    cleanupInactiveMedia(tab);
    if(tab==='forecasts')renderForecasts();
    if(tab==='taste')renderTaste();
    if(tab==='explore')renderExplore();
    if(tab==='posts')renderPosts();
    activateScreenMedia(tab);
  }
  function goBack(){var prev=navStack.length?navStack.pop():'feed';show(prev,true);}

  // ===== Search / Markets =====
  // Watchlist (favourites) + market helpers
  var favs={}, proMarketSort='gainers', alerts={}, alDir='above';
  // search filter state + option data
  var exFilters={when:'today',sort:'trending',country:'us',city:'all'};
  var WHEN_OPTS=[['today','Today','Trends moving in the last 24 hours'],['week','This week','Activity from the past 7 days'],['month','This month','Activity from the past 30 days'],['all','All time','Every trend on record']];
  var SORT_OPTS=[['trending','Trending','Hottest right now'],['latest','Latest','Biggest recent moves'],['newest','Newest','Most recently added'],['oldest','Oldest','Longest-running trends']];
  // top 20 most economically developed countries, each with major cities
  var LOC_COUNTRIES=[
    ['us','United States','🇺🇸',['New York','Los Angeles','Chicago','San Francisco','Miami']],
    ['cn','China','🇨🇳',['Shanghai','Beijing','Shenzhen','Guangzhou','Hong Kong']],
    ['jp','Japan','🇯🇵',['Tokyo','Osaka','Yokohama','Nagoya','Fukuoka']],
    ['de','Germany','🇩🇪',['Berlin','Munich','Frankfurt','Hamburg','Cologne']],
    ['in','India','🇮🇳',['Mumbai','Delhi','Bengaluru','Hyderabad','Chennai']],
    ['gb','United Kingdom','🇬🇧',['London','Manchester','Birmingham','Edinburgh','Bristol']],
    ['fr','France','🇫🇷',['Paris','Lyon','Marseille','Toulouse','Nice']],
    ['it','Italy','🇮🇹',['Rome','Milan','Naples','Turin','Florence']],
    ['ca','Canada','🇨🇦',['Toronto','Vancouver','Montreal','Calgary','Ottawa']],
    ['br','Brazil','🇧🇷',['São Paulo','Rio de Janeiro','Brasília','Belo Horizonte','Porto Alegre']],
    ['kr','South Korea','🇰🇷',['Seoul','Busan','Incheon','Daegu','Daejeon']],
    ['au','Australia','🇦🇺',['Sydney','Melbourne','Brisbane','Perth','Adelaide']],
    ['es','Spain','🇪🇸',['Madrid','Barcelona','Valencia','Seville','Bilbao']],
    ['mx','Mexico','🇲🇽',['Mexico City','Guadalajara','Monterrey','Puebla','Cancún']],
    ['id','Indonesia','🇮🇩',['Jakarta','Surabaya','Bandung','Medan','Bali']],
    ['nl','Netherlands','🇳🇱',['Amsterdam','Rotterdam','The Hague','Utrecht','Eindhoven']],
    ['sa','Saudi Arabia','🇸🇦',['Riyadh','Jeddah','Mecca','Medina','Dammam']],
    ['ch','Switzerland','🇨🇭',['Zurich','Geneva','Basel','Bern','Lausanne']],
    ['tr','Turkey','🇹🇷',['Istanbul','Ankara','Izmir','Bursa','Antalya']],
    ['se','Sweden','🇸🇪',['Stockholm','Gothenburg','Malmö','Uppsala','Lund']]
  ];
  function isFav(id){return !!favs[id];}
  function toggleFav(id){favs[id]=!favs[id];}
  function trendChg(t){var s=((t.deg*13+t.sent)%88)/10+0.6; return +( (t.up?1:-1)*s ).toFixed(2);}
  function trendVol(t){return (t.fc||100)*2400;}
  function sparkSVG(id,up){var t=T[id],seed=t.deg*7+3,n=18,pts=[],v=50,i;
    for(i=0;i<n;i++){seed=lcg(seed);var r=seed/233280;v=Math.max(18,Math.min(82,v+(r-0.5)*15+(up?1.1:-1.1)));pts.push(v);}
    var mn=Math.min.apply(null,pts),mx=Math.max.apply(null,pts),rng=(mx-mn)||1;
    var d=pts.map(function(p,k){return (k/(n-1)*100).toFixed(1)+','+(96-((p-mn)/rng)*92).toFixed(1);}).join(' ');
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="'+d+'" fill="none" stroke="'+(up?'#54D9A6':'#E0635A')+'" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>';
  }
  function marketRowHTML(id){var t=T[id],chg=trendChg(t),up=chg>=0;
    return '<div class="mkt-row" data-go-trend="'+id+'">'+
      '<button class="mkt-star'+(isFav(id)?' on':'')+'" data-fav="'+id+'" aria-label="Watchlist">★</button>'+
      '<span class="mkt-id"><b>'+t.name+'</b><small>'+fmt(trendVol(t))+' ◇ vol</small></span>'+
      '<span class="mkt-spark">'+sparkSVG(id,up)+'</span>'+
      '<span class="mkt-px"><b>'+t.deg+'°</b><span class="mkt-chg '+(up?'up':'dn')+'">'+(up?'+':'')+chg.toFixed(2)+'%</span></span>'+
    '</div>';
  }
  function marketIds(q){
    var ids=order.filter(function(id){
      if(proMarketSort==='watch'&&!isFav(id))return false;
      if(!q)return true;var t=T[id];return (t.name+' '+t.user+' '+t.zone+' '+t.kind).toLowerCase().indexOf(q)>=0;});
    ids.sort(function(a,b){
      if(proMarketSort==='volume')return trendVol(T[b])-trendVol(T[a]);
      var ca=trendChg(T[a]),cb=trendChg(T[b]);
      return proMarketSort==='losers'?ca-cb:cb-ca;});
    return ids;
  }
  var exIds=[], exShown=0, EX_BATCH=isPhone?8:14, exScrollTick=false;
  function renderExploreChunk(reset){
    var list=document.getElementById('ex-list');if(!list)return;
    if(reset){releaseMediaIn(list);list.innerHTML='';exShown=0;}
    var next=Math.min(exShown+EX_BATCH,exIds.length);
    if(next>exShown){
      list.insertAdjacentHTML('beforeend',exIds.slice(exShown,next).map(exRowHTML).join(''));
      exShown=next;
      observeVids(list);
      refreshActiveMedia(list);
    }
  }
  function maybeLoadExploreMore(){
    if(currentScreenKey()!=='explore'||exShown>=exIds.length)return;
    var sc=document.querySelector('#s-explore .scrollarea');if(!sc)return;
    if(sc.scrollTop+sc.clientHeight>=sc.scrollHeight-520)renderExploreChunk(false);
  }
  function renderExplore(){
    var q=(document.getElementById('ex-search').value||'').trim().toLowerCase();
    var title=document.querySelector('#s-explore .shead h1');
    var list=document.getElementById('ex-list');
    if(proMode){
      if(title)title.textContent='Markets';
      document.querySelectorAll('#mkt-bar button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-sort')===proMarketSort);});
      var ids=marketIds(q);
      exIds=[];exShown=0;releaseMediaIn(list);
      list.innerHTML=ids.map(marketRowHTML).join('');
      document.getElementById('ex-empty').textContent=proMarketSort==='watch'?'Your watchlist is empty. Tap ★ on any market.':'No trends match that search.';
      document.getElementById('ex-empty').style.display=ids.length?'none':'block';
      return;
    }
    if(title)title.textContent='Search';
    var ids2=order.filter(function(id){
      if(!q)return true;var t=T[id];return (t.name+' '+t.user+' '+t.zone+' '+t.kind).toLowerCase().indexOf(q)>=0;});
    ids2=ids2.slice();
    var sk=exFilters.sort;
    if(sk==='latest'||sk==='trending'){ids2.sort(function(a,b){return trendChg(T[b])-trendChg(T[a]);});}
    else if(sk==='newest'){ids2.sort(function(a,b){return (exSeed(b)-exSeed(a));});}
    else if(sk==='oldest'){ids2.sort(function(a,b){return (exSeed(a)-exSeed(b));});}
    exIds=ids2;
    renderExploreChunk(true);
    document.getElementById('ex-empty').textContent='No trends match that search.';
    document.getElementById('ex-empty').style.display=ids2.length?'none':'block';
  }
  function exSeed(id){var s=0;for(var i=0;i<id.length;i++)s=(s*31+id.charCodeAt(i))%99991;return s;}
  // ---- search filter sheets ----
  var locView=null; // null = country list, else country code = city list
  function foptHTML(val,label,sub,selected,extraAttr){
    return '<button class="fopt" '+(extraAttr||('data-val="'+val+'"'))+' aria-selected="'+(selected?'true':'false')+'">'+
      '<span class="fopt-tx"><span>'+label+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</span>'+
      '<svg class="fopt-ck" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></button>';
  }
  function renderFilterSheets(){
    document.getElementById('fwhen-list').innerHTML=WHEN_OPTS.map(function(o){return foptHTML(o[0],o[1],o[2],exFilters.when===o[0]);}).join('');
    document.getElementById('fsort-list').innerHTML=SORT_OPTS.map(function(o){return foptHTML(o[0],o[1],o[2],exFilters.sort===o[0]);}).join('');
    renderLocSheet();
  }
  function countryById(code){for(var i=0;i<LOC_COUNTRIES.length;i++)if(LOC_COUNTRIES[i][0]===code)return LOC_COUNTRIES[i];return LOC_COUNTRIES[0];}
  function renderLocSheet(){
    var list=document.getElementById('floc-list'),back=document.getElementById('floc-back'),h=document.getElementById('floc-h'),sub=document.getElementById('floc-sub');
    if(!list)return;
    if(!locView){
      back.hidden=true; h.textContent='Location'; sub.textContent='Choose a country, then a city.';
      list.innerHTML=LOC_COUNTRIES.map(function(c){
        var sel=exFilters.country===c[0];
        return foptHTML(null,c[2]+'  '+c[1],sel?(exFilters.city==='all'?'All cities':exFilters.city):c[3].length+' cities',sel,'data-country="'+c[0]+'"');
      }).join('');
    }else{
      var c=countryById(locView);
      back.hidden=false; h.textContent=c[2]+' '+c[1]; sub.textContent='Choose a city.';
      var rows=foptHTML(null,'All of '+c[1],'Every city',exFilters.country===c[0]&&exFilters.city==='all','data-city="all" data-country="'+c[0]+'"');
      rows+=c[3].map(function(city){return foptHTML(null,city,'',exFilters.country===c[0]&&exFilters.city===city,'data-city="'+city+'" data-country="'+c[0]+'"');}).join('');
      list.innerHTML=rows;
    }
  }
  function openFilterSheet(which){
    closeAll();
    if(which==='loc'){locView=(exFilters.country&&exFilters.city!=='all')?exFilters.country:null;}
    renderFilterSheets();
    var id=which==='when'?'fsheet-when':which==='sort'?'fsheet-sort':'fsheet-loc';
    document.getElementById(id).classList.add('open'); scrim.classList.add('open');
  }
  function syncFilterLabels(){
    var w=WHEN_OPTS.filter(function(o){return o[0]===exFilters.when;})[0];
    var s=SORT_OPTS.filter(function(o){return o[0]===exFilters.sort;})[0];
    document.getElementById('exf-when-lbl').textContent=w?w[1]:'Today';
    document.getElementById('exf-sort-lbl').textContent=s?s[1]:'Trending';
    var c=countryById(exFilters.country);
    document.getElementById('exf-loc-lbl').textContent=(exFilters.city&&exFilters.city!=='all')?exFilters.city:c[0].toUpperCase();
  }
  document.getElementById('ex-search').addEventListener('input',renderExplore);
  var exScroll=document.querySelector('#s-explore .scrollarea');
  if(exScroll)exScroll.addEventListener('scroll',function(){
    if(exScrollTick)return;exScrollTick=true;
    requestAnimationFrame(function(){exScrollTick=false;maybeLoadExploreMore();});
  },{passive:true});
  function moveInd(){var a=document.querySelector('.tabbar button[aria-current=true]');if(!a)return;
    var ind=document.getElementById('tab-ind');ind.style.left=a.offsetLeft+'px';ind.style.width=a.offsetWidth+'px';}

  function renderRecent(t){var out='';
    for(var i=0;i<3;i++){var rise=((t.deg+i*7)%100)<t.sent;var h=HANDLES[(i*3+t.deg)%HANDLES.length];
      var col=AVCOL[(i+t.deg)%AVCOL.length];var stake=[10,50,200][(i+t.deg)%3];
      out+='<div class="frow"><span class="fav" style="background:'+col+'"></span><span class="fu">@'+h+'</span>'+
        '<span class="fd '+(rise?'rise':'cool')+'">'+(rise?'▲ Rise':'▼ Cool')+' '+stake+'</span></div>';}
    return out;}

  function carTiles(t,id){
    var imgs=imgsOf(t),tiles=[];
    for(var i=0;i<3;i++){var u=imgs.length?imgs[i%imgs.length]:null;var a=t.theme[i%3],b=t.theme[(i+1)%3];
      var vs=(i<vcount(id))?clipAttrs(id,i+1,false):'';
      tiles.push('<button class="dtile" data-feedgo="'+id+'" data-feedidx="'+i+'"'+vs+' style="background:linear-gradient('+(140+i*22)+'deg,'+a+','+b+')">'+
        (u?'<img class="dtile-vid" src="'+u+'" alt="" onerror="this.style.display=\'none\'">':'')+'</button>');}
    return tiles.join('');
  }
  function openFeedAt(id,slide){var k=T[id].kind;
    if(slide!=null&&!isNaN(slide))leadSlide[id]=slide;
    setSwitcher(k);
    var ix=(ORDERS[k]||order).indexOf(id), topics=feed.querySelectorAll('.topic');
    if(topics[ix]){
      if(topics[ix].scrollIntoView)topics[ix].scrollIntoView({block:'start'});
      if(leadSlide[id]!=null&&carousel[id])setSlide(topics[ix],id,leadSlide[id],true);
    }
    show('feed');
    kickVideos();}
  // ===== Pro mode trend page (NOISE exchange, multi-pane) =====
  var proTF='4H', proChartStore={};
  var TFVOL={'15m':0.014,'1H':0.024,'4H':0.038,'1D':0.055,'1W':0.085};
  var TFTIME={'15m':['45m','30m','15m','now'],'1H':['3h','2h','1h','now'],'4H':['12h','8h','4h','now'],'1D':['3d','2d','1d','now'],'1W':['3w','2w','1w','now']};
  var MC={a:'#F2B33D',b:'#8AA1F2',c:'#54D9A6',up:'#54D9A6',dn:'#E0635A'}; // amber / blue / green (prototype palette)
  var AX0=2, AX1=88;
  function seedProCandles(t,tf){
    var seed=t.deg*17+tf.length*131+7, n=60, base=t.deg||500, vol=TFVOL[tf]||0.038, price=base*0.85, cs=[];
    for(var i=0;i<n;i++){seed=lcg(seed);var r1=seed/233280;seed=lcg(seed);var r2=seed/233280;
      var o=price,c=o+(r1-0.5)*base*vol*2+(t.up?base*vol*0.10:-base*vol*0.10);
      c=Math.max(base*0.5,Math.min(base*1.45,c));
      cs.push({o:o,c:c,hi:Math.max(o,c)+r2*base*vol,lo:Math.min(o,c)-(1-r2)*base*vol,v:0.3+r2*0.7});price=c;}
    var delta=base-cs[n-1].c; cs.forEach(function(k){k.o+=delta;k.c+=delta;k.hi+=delta;k.lo+=delta;});
    return {candles:cs,base:base,up:t.up,seed:seed,fc:t.fc||100};
  }
  function sma(v,p){var o=[];for(var i=0;i<v.length;i++){var s=0,k=0;for(var j=Math.max(0,i-p+1);j<=i;j++){s+=v[j];k++;}o.push(s/k);}return o;}
  function ema(v,p){var o=[],k=2/(p+1),pr;for(var i=0;i<v.length;i++){pr=i?v[i]*k+pr*(1-k):v[0];o.push(pr);}return o;}
  function rsiCalc(c,p){var o=[],g=0,l=0;for(var i=0;i<c.length;i++){if(!i){o.push(50);continue;}var ch=c[i]-c[i-1],gg=ch>0?ch:0,ll=ch<0?-ch:0;
    if(i<=p){g+=gg;l+=ll;if(i===p){g/=p;l/=p;o.push(100-100/(1+(l?g/l:100)));}else o.push(50);}else{g=(g*(p-1)+gg)/p;l=(l*(p-1)+ll)/p;o.push(100-100/(1+(l?g/l:100)));}}return o;}
  function Xc(i,n){return AX0+(i+0.5)*((AX1-AX0)/n);}
  function poly(arr,Yf,n,col,w){return '<polyline points="'+arr.map(function(v,i){return Xc(i,n).toFixed(2)+','+Yf(v).toFixed(2);}).join(' ')+'" fill="none" stroke="'+col+'" stroke-width="'+(w||1)+'" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>';}
  function svgWrap(inner){return '<svg viewBox="0 0 100 100" preserveAspectRatio="none">'+inner+'</svg>';}
  function setHTML(id,html){var e=document.getElementById(id);if(e)e.innerHTML=html;}
  function leg(items){return items.map(function(x){return '<b style="color:'+x[1]+'">'+x[0]+'</b>';}).join('');}

  function renderProAll(id){
    var cd=proChartStore[id];if(!cd)return;
    var cs=cd.candles,n=cs.length,closes=cs.map(function(k){return k.c;});
    var cw=(AX1-AX0)/n, bw=cw*0.6;
    // ---------- MAIN: candles + MA(7/25/99) ----------
    var his=cs.map(function(k){return k.hi;}),los=cs.map(function(k){return k.lo;});
    var hi=Math.max.apply(null,his),lo=Math.min.apply(null,los),pad=(hi-lo)*0.06||5,mn=lo-pad,mx=hi+pad;
    function MY(v){return 4+(1-(v-mn)/(mx-mn))*92;}
    var ma7=sma(closes,7),ma25=sma(closes,25),ma99=sma(closes,99),ms='';
    for(var g=0;g<=3;g++){var gy=(4+92*g/3).toFixed(2);ms+='<line x1="'+AX0+'" y1="'+gy+'" x2="'+AX1+'" y2="'+gy+'" stroke="rgba(255,255,255,.05)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>';}
    cs.forEach(function(k,i){var xc=Xc(i,n),up=k.c>=k.o,col=up?MC.up:MC.dn,bt=MY(Math.max(k.o,k.c)),bb=MY(Math.min(k.o,k.c)),bh=Math.max(0.4,bb-bt);
      ms+='<line x1="'+xc.toFixed(2)+'" y1="'+MY(k.hi).toFixed(2)+'" x2="'+xc.toFixed(2)+'" y2="'+MY(k.lo).toFixed(2)+'" stroke="'+col+'" stroke-width="0.7" vector-effect="non-scaling-stroke"/>'+
        '<rect x="'+(xc-bw/2).toFixed(2)+'" y="'+bt.toFixed(2)+'" width="'+bw.toFixed(2)+'" height="'+bh.toFixed(2)+'" fill="'+col+'"/>';});
    ms+=poly(ma7,MY,n,MC.a)+poly(ma25,MY,n,MC.b)+poly(ma99,MY,n,MC.c);
    var last=closes[n-1];
    ms+='<line x1="'+AX0+'" y1="'+MY(last).toFixed(2)+'" x2="'+AX1+'" y2="'+MY(last).toFixed(2)+'" stroke="#F2B33D" stroke-width="0.6" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>';
    setHTML('pd-svg-main',svgWrap(ms));
    var ah='';for(var t1=0;t1<=4;t1++){var val=mx-(mx-mn)*t1/4,y=4+92*t1/4;ah+='<span class="pd-axl" style="top:'+y.toFixed(2)+'%">'+Math.round(val)+'</span>';}
    ah+='<span class="pd-pill" style="top:'+MY(last).toFixed(2)+'%">'+Math.round(last)+'°</span>';
    setHTML('pd-ax-main',ah);
    setHTML('pd-leg-main',leg([['MA(7) '+Math.round(ma7[n-1]),MC.a],['MA(25) '+Math.round(ma25[n-1]),MC.b],['MA(99) '+Math.round(ma99[n-1]),MC.c]]));
    // ---------- VOLUME ----------
    var vols=cs.map(function(k){return k.v;}),vmax=Math.max.apply(null,vols)*1.15;
    function VY(v){return 96-(v/vmax)*92;}
    var vs='';cs.forEach(function(k,i){var xc=Xc(i,n),up=k.c>=k.o,y=VY(k.v);
      vs+='<rect x="'+(xc-bw/2).toFixed(2)+'" y="'+y.toFixed(2)+'" width="'+bw.toFixed(2)+'" height="'+(96-y).toFixed(2)+'" fill="'+(up?'rgba(84,217,166,.45)':'rgba(224,99,90,.45)')+'"/>';});
    var vma5=sma(vols,5),vma10=sma(vols,10);
    vs+=poly(vma5,VY,n,MC.a)+poly(vma10,VY,n,MC.b);
    if(!isPhone)setHTML('pd-svg-vol',svgWrap(vs));
    function volDisp(v){return fmt(Math.round(v*cd.fc*3000));}
    setHTML('pd-leg-vol',leg([['Vol '+volDisp(vols[n-1])+' ◇','var(--muted)'],['MA(5) '+volDisp(vma5[n-1]),MC.a],['MA(10) '+volDisp(vma10[n-1]),MC.b]]));
    setHTML('pd-ax-vol','<span class="pd-axl" style="top:10%">'+volDisp(vmax)+'</span>');
    // ---------- RSI(6/12/24) ----------
    var r6=rsiCalc(closes,6),r12=rsiCalc(closes,12),r24=rsiCalc(closes,24);
    function RY(v){return 4+(1-v/100)*92;}
    var rs='<line x1="'+AX0+'" y1="'+RY(70).toFixed(2)+'" x2="'+AX1+'" y2="'+RY(70).toFixed(2)+'" stroke="rgba(255,255,255,.13)" stroke-width="0.5" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>'+
      '<line x1="'+AX0+'" y1="'+RY(30).toFixed(2)+'" x2="'+AX1+'" y2="'+RY(30).toFixed(2)+'" stroke="rgba(255,255,255,.13)" stroke-width="0.5" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>';
    rs+=poly(r6,RY,n,MC.a)+poly(r12,RY,n,MC.b)+poly(r24,RY,n,MC.c);
    if(!isPhone)setHTML('pd-svg-rsi',svgWrap(rs));
    setHTML('pd-ax-rsi','<span class="pd-axl" style="top:'+RY(70).toFixed(2)+'%">70</span><span class="pd-axl" style="top:'+RY(30).toFixed(2)+'%">30</span>');
    setHTML('pd-leg-rsi',leg([['RSI(6) '+r6[n-1].toFixed(1),MC.a],['RSI(12) '+r12[n-1].toFixed(1),MC.b],['RSI(24) '+r24[n-1].toFixed(1),MC.c]]));
    // ---------- MACD ----------
    var e12=ema(closes,12),e26=ema(closes,26),dif=closes.map(function(_,i){return e12[i]-e26[i];}),dea=ema(dif,9),hist=dif.map(function(v,i){return v-dea[i];});
    var maxAbs=1;[].concat(dif,dea,hist).forEach(function(v){if(Math.abs(v)>maxAbs)maxAbs=Math.abs(v);});
    function DY(v){return 50-(v/maxAbs)*44;}
    var ds='<line x1="'+AX0+'" y1="50" x2="'+AX1+'" y2="50" stroke="rgba(255,255,255,.1)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>';
    hist.forEach(function(v,i){var xc=Xc(i,n),top=Math.min(DY(v),DY(0)),h=Math.abs(DY(v)-DY(0));
      ds+='<rect x="'+(xc-bw/2).toFixed(2)+'" y="'+top.toFixed(2)+'" width="'+bw.toFixed(2)+'" height="'+Math.max(0.3,h).toFixed(2)+'" fill="'+(v>=0?'rgba(84,217,166,.6)':'rgba(224,99,90,.6)')+'"/>';});
    ds+=poly(dif,DY,n,MC.a)+poly(dea,DY,n,MC.b);
    if(!isPhone)setHTML('pd-svg-macd',svgWrap(ds));
    setHTML('pd-ax-macd','<span class="pd-axl" style="top:50%">0</span>');
    setHTML('pd-leg-macd',leg([['DIF '+dif[n-1].toFixed(1),MC.a],['DEA '+dea[n-1].toFixed(1),MC.b],['MACD '+hist[n-1].toFixed(1),'var(--muted)']]));
    cd.calc={n:n,mn:mn,mx:mx,cs:cs,ma7:ma7,ma25:ma25,ma99:ma99,vols:vols,vma5:vma5,vma10:vma10,r6:r6,r12:r12,r24:r24,dif:dif,dea:dea,hist:hist,volDisp:volDisp};
  }
  // update all pane legends to a hovered candle index (used by the crosshair)
  function setLegendsAt(id,idx){
    var c=(proChartStore[id]||{}).calc;if(!c)return;idx=Math.max(0,Math.min(c.n-1,idx));
    setHTML('pd-leg-main',leg([['MA(7) '+Math.round(c.ma7[idx]),MC.a],['MA(25) '+Math.round(c.ma25[idx]),MC.b],['MA(99) '+Math.round(c.ma99[idx]),MC.c]]));
    setHTML('pd-leg-vol',leg([['Vol '+c.volDisp(c.vols[idx])+' ◇','var(--muted)'],['MA(5) '+c.volDisp(c.vma5[idx]),MC.a],['MA(10) '+c.volDisp(c.vma10[idx]),MC.b]]));
    setHTML('pd-leg-rsi',leg([['RSI(6) '+c.r6[idx].toFixed(1),MC.a],['RSI(12) '+c.r12[idx].toFixed(1),MC.b],['RSI(24) '+c.r24[idx].toFixed(1),MC.c]]));
    setHTML('pd-leg-macd',leg([['DIF '+c.dif[idx].toFixed(1),MC.a],['DEA '+c.dea[idx].toFixed(1),MC.b],['MACD '+c.hist[idx].toFixed(1),'var(--muted)']]));
  }
  // make the chart interactive: drag/hover a crosshair, read values across every pane
  function attachProCross(id){
    var panes=document.getElementById('pd-panes');if(!panes)return;
    var mainGraph=panes.querySelector('.pd-graph');
    var vline=document.getElementById('pd-vline'),hline=document.getElementById('pd-hline'),ctag=document.getElementById('pd-ctag'),tip=document.getElementById('pd-tip');
    function at(cx,cy){
      var c=(proChartStore[id]||{}).calc;if(!c)return;var pr=panes.getBoundingClientRect(),n=c.n;
      var xf=(cx-pr.left)/pr.width*100, idx=Math.round((xf-AX0)/((AX1-AX0)/n)-0.5);idx=Math.max(0,Math.min(n-1,idx));
      panes.classList.add('crossing');
      vline.style.left=Xc(idx,n).toFixed(2)+'%';
      setLegendsAt(id,idx);
      var k=c.cs[idx];tip.innerHTML='<i>O</i>'+Math.round(k.o)+' <i>H</i>'+Math.round(k.hi)+' <i>L</i>'+Math.round(k.lo)+' <i>C</i>'+Math.round(k.c)+'°';
      var mg=mainGraph.getBoundingClientRect(),yin=cy-mg.top;
      if(yin>=0&&yin<=mg.height){var yp=yin/mg.height*100;
        hline.style.top=yp.toFixed(2)+'%';hline.style.display='block';
        var price=c.mn+(c.mx-c.mn)*(1-(yp-4)/92);
        ctag.style.top=yp.toFixed(2)+'%';ctag.textContent=Math.round(price)+'°';ctag.style.display='block';
      }else{hline.style.display='none';ctag.style.display='none';}
    }
    function end(){panes.classList.remove('crossing');hline.style.display='none';ctag.style.display='none';var c=(proChartStore[id]||{}).calc;if(c)setLegendsAt(id,c.n-1);}
    panes.addEventListener('pointerdown',function(e){at(e.clientX,e.clientY);});
    panes.addEventListener('pointermove',function(e){if(panes.classList.contains('crossing')||e.pointerType==='mouse')at(e.clientX,e.clientY);});
    panes.addEventListener('pointerup',end);
    panes.addEventListener('pointercancel',end);
    panes.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse')end();});
  }
  function proBookHTML(t){
    var base=t.deg||500, seed=base*7+3, asks=[],bids=[],i,r;
    for(i=1;i<=5;i++){seed=lcg(seed);r=seed/233280;asks.push({px:Math.round(base+i*base*0.013),sz:Math.round(60+r*900)});}
    for(i=1;i<=5;i++){seed=lcg(seed);r=seed/233280;bids.push({px:Math.round(base-i*base*0.013),sz:Math.round(60+r*900)});}
    var mx=Math.max.apply(null,asks.concat(bids).map(function(x){return x.sz;}));
    var h='<div class="pd-colh"><span>Price (°)</span><span>Size ◇</span></div>';
    asks.slice().reverse().forEach(function(a){h+='<div class="pd-row cool"><span class="pd-depth" style="width:'+(a.sz/mx*100).toFixed(0)+'%"></span><span class="pd-px">'+a.px+'°</span><span class="pd-sz">'+fmt(a.sz)+'</span></div>';});
    h+='<div class="pd-mid"><span class="pd-mid-deg'+(t.up?'':' dn')+'" id="pd-mid-deg">'+t.deg.toFixed(2)+'°</span><span class="pd-mid-lbl"><span id="pd-mid-sent">'+(t.up?'▲ ':'▼ ')+t.sent.toFixed(2)+'%</span> Rise backing</span></div>';
    bids.forEach(function(bd){h+='<div class="pd-row rise"><span class="pd-depth" style="width:'+(bd.sz/mx*100).toFixed(0)+'%"></span><span class="pd-px">'+bd.px+'°</span><span class="pd-sz">'+fmt(bd.sz)+'</span></div>';});
    return h;
  }
  function proDetailHTML(t,id){
    var cd=proChartStore[id],cs=cd.candles,his=cs.map(function(k){return k.hi;}),los=cs.map(function(k){return k.lo;});
    var hi=Math.round(Math.max.apply(null,his)),lo=Math.round(Math.min.apply(null,los));
    var vol=fmt(Math.round((t.fc||100)*2400));
    var tfs=['15m','1H','4H','1D','1W'].map(function(x){return '<button data-tf="'+x+'"'+(x===proTF?' class="on"':'')+'>'+x+'</button>';}).join('');
    var times=(TFTIME[proTF]||['','','','now']).map(function(lbl,i){return '<span style="left:'+(10+i*27)+'%">'+lbl+'</span>';}).join('');
    function pane(key,h,extra){return '<div class="pd-pane"><div class="pd-legend" id="pd-leg-'+key+'"></div><div class="pd-graph" style="height:'+h+'px"><div class="svgholder" id="pd-svg-'+key+'"></div><div class="pd-axis" id="pd-ax-'+key+'"></div>'+(extra||'')+'</div></div>';}
    return '<div class="pd-head">'+
        '<div class="pd-id"><span class="pd-name">'+t.name+'</span><span class="pd-user" data-user="'+t.user+'" role="button">'+t.user+'</span></div>'+
        '<div class="pd-price"><span class="pd-deg'+(t.up?'':' dn')+'" id="pd-deg">'+t.deg.toFixed(2)+'°</span><span class="pd-chg '+(t.up?'up':'dn')+'" id="pd-chg">'+(t.up?'▲ ':'▼ ')+t.sent.toFixed(2)+'%</span></div>'+
      '</div>'+
      '<div class="pd-sub">24h High <b>'+hi+'°</b> · Low <b>'+lo+'°</b> · Vol <b>'+vol+' ◇</b> · <b>'+(t.fc||'—')+'</b> curators</div>'+
      '<div class="pd-actions">'+
        '<button class="pd-act'+(isFav(id)?' on':'')+'" data-fav="'+id+'"><b class="star">★</b> '+(isFav(id)?'Watching':'Watchlist')+'</button>'+
        '<button class="pd-act" id="pd-alert-btn">+ Price alert</button>'+
      '</div>'+
      '<div class="pd-alertbox" id="pd-alertbox" style="display:none;">'+
        '<button class="al-dir on" data-aldir="above">Above</button><button class="al-dir" data-aldir="below">Below</button>'+
        '<input id="al-val" type="number" inputmode="numeric" placeholder="Degree °" value="'+t.deg+'">'+
        '<button class="al-save" id="al-save">Set</button>'+
      '</div>'+
      '<div class="pd-tf">'+tfs+'</div>'+
      '<div class="pd-panes" id="pd-panes">'+
        pane('main',218,'<div class="pd-time">'+times+'</div><div class="pd-hline" id="pd-hline"></div><span class="pd-ctag" id="pd-ctag"></span><div class="pd-tip" id="pd-tip"></div>')+
        pane('vol',72)+pane('rsi',74)+pane('macd',74)+
        '<div class="pd-vline" id="pd-vline"></div>'+
      '</div>'+
      '<div class="pd-book-h"><span>Order book</span><span class="pd-spread">Rise vs Cool · ◇ credits</span></div>'+
      proBookHTML(t);
  }
  function buildProDetail(id){
    var t=T[id]; proChartStore[id]=seedProCandles(t,proTF);
    document.getElementById('d-pro').innerHTML=proDetailHTML(t,id);
    renderProAll(id);
    attachProCross(id);
  }
  // timeframe controls
  document.addEventListener('click',function(e){
    var tf=e.target.closest('.pd-tf button');
    if(tf){proTF=tf.getAttribute('data-tf');buildProDetail(currentId);return;}
  });
  // gentle live tick for the open pro trend page
  setInterval(function(){
    var det=document.getElementById('s-detail');
    if(!proMode||!det.classList.contains('active')||!det.classList.contains('prodetail'))return;
    var panes=document.getElementById('pd-panes'); if(panes&&panes.classList.contains('crossing'))return; // paused while scrubbing
    var cd=proChartStore[currentId];if(!cd)return;var cs=cd.candles,last=cs[cs.length-1];
    cd.seed=lcg(cd.seed);var r=cd.seed/233280;var step=(r-0.5)*cd.base*0.006;
    last.c=Math.max(last.o*0.97,Math.min(last.o*1.03,last.c+step));
    last.hi=Math.max(last.hi,last.c);last.lo=Math.min(last.lo,last.c);
    renderProAll(currentId);
  },2200);

  // live per-second jitter of the pro trend degree + sentiment %, shown to 3 decimals
  setInterval(function(){
    var det=document.getElementById('s-detail');
    if(!proMode||!det.classList.contains('active')||!det.classList.contains('prodetail'))return;
    var t=T[currentId]; if(!t)return;
    var degEl=document.getElementById('pd-deg'), chgEl=document.getElementById('pd-chg');
    if(degEl){degEl.textContent=(t.deg+(Math.random()-0.5)*0.5).toFixed(2)+'°';}
    if(chgEl){chgEl.textContent=(t.up?'▲ ':'▼ ')+Math.max(0,Math.min(100,t.sent+(Math.random()-0.5)*0.5)).toFixed(2)+'%';}
    var midDeg=document.getElementById('pd-mid-deg'), midSent=document.getElementById('pd-mid-sent');
    if(midDeg){midDeg.textContent=(t.deg+(Math.random()-0.5)*0.5).toFixed(2)+'°';}
    if(midSent){midSent.textContent=(t.up?'▲ ':'▼ ')+Math.max(0,Math.min(100,t.sent+(Math.random()-0.5)*0.5)).toFixed(2)+'%';}
  },1000);

  // ===== Sub-trends + simulated dependency =====
  var subSim=null;
  function netPull(id){var t=T[id];if(!t||!t.sub)return 0;var s=0;t.sub.forEach(function(x){var st=T[x.id];if(st)s+=(x.impact/100)*(st.chg||0);});return s;}
  function renderSubs(id){
    var t=T[id],host=document.getElementById('d-subs');if(!host||!t.sub)return;
    releaseMediaIn(host);
    host.innerHTML=t.sub.map(function(x,i){var st=T[x.id];if(!st)return '';
      var up=(st.chg||0)>=0,chg=(up?'+':'')+Math.round(st.chg||0)+'%';
      // Play a clip on the related-trend card when that sub-trend has clips.
      var vs=vcount(x.id)?clipAttrs(x.id,(i%vcount(x.id))+1,true):'';
      return '<button class="subcard" data-go-trend="'+x.id+'">'+
        '<span class="subcard-img"'+vs+' style="background:linear-gradient(150deg,'+st.theme[0]+','+(st.theme[2]||st.theme[1])+')">'+(st.img?'<img src="'+st.img+'" alt="" onerror="this.style.display=\'none\'">':'')+'</span>'+
        '<span class="subcard-nm">'+st.name+'</span>'+
        '<span class="subcard-row"><span class="subcard-deg">'+Math.round(st.deg)+'°</span><span class="subcard-chg '+(up?'up':'dn')+'">'+chg+'</span></span>'+
        '<span class="subcard-imp">'+x.impact+'% impact</span></button>';
    }).join('');
    refreshActiveMedia(host);
    var nd=Math.round(netPull(id)*(t.deg/100)*0.4),el=document.getElementById('d-subnet');
    if(el)el.innerHTML='<span class="sn-live"></span>Forces pulling this trend <b class="'+(nd>=0?'up':'dn')+'">'+(nd>=0?'+':'')+nd+'°</b> right now';
  }
  // Live-update only the numbers on the related cards. Rebuilding innerHTML here would tear
  // down and recreate every sub-card video each tick -> visible flashing. Update text in place.
  function updateSubsStats(id){
    var t=T[id],host=document.getElementById('d-subs');if(!host||!t.sub)return;
    var cards=host.querySelectorAll('.subcard');
    t.sub.forEach(function(x,i){var st=T[x.id],card=cards[i];if(!st||!card)return;
      var up=(st.chg||0)>=0,chg=(up?'+':'')+Math.round(st.chg||0)+'%';
      var dg=card.querySelector('.subcard-deg');if(dg)dg.textContent=Math.round(st.deg)+'°';
      var cg=card.querySelector('.subcard-chg');if(cg){cg.textContent=chg;cg.className='subcard-chg '+(up?'up':'dn');}
    });
    var nd=Math.round(netPull(id)*(t.deg/100)*0.4),el=document.getElementById('d-subnet');
    if(el)el.innerHTML='<span class="sn-live"></span>Forces pulling this trend <b class="'+(nd>=0?'up':'dn')+'">'+(nd>=0?'+':'')+nd+'°</b> right now';
  }
  setInterval(function(){
    var det=document.getElementById('s-detail');
    if(proMode||!det.classList.contains('active')||!subSim||currentId!==subSim.id)return;
    var t=T[currentId];if(!t||!t.sub)return;
    t.sub.forEach(function(x){var st=T[x.id];if(!st)return;st.seed=lcg(st.seed||(st.deg*7+3));var r=st.seed/233280;
      st.chg=Math.max(-30,Math.min(40,(st.chg||0)+(r-0.5)*2.4));st.deg=Math.round(Math.max(50,st.deg+(r-0.5)*1.6));});
    var target=subSim.base+netPull(currentId)*(subSim.base/100)*0.4;
    subSim.deg+=(target-subSim.deg)*0.25;
    var dd=document.getElementById('d-deg');if(dd)dd.textContent=Math.round(subSim.deg)+'°';
    updateSubsStats(currentId);
  },2600);

  function openDetail(id){
    currentId=id; var t=T[id];
    var det=document.getElementById('s-detail');
    if(proMode){
      det.classList.add('prodetail');
      buildProDetail(id);
      show('detail');
      var sap=document.querySelector('#s-detail .scrollarea');if(sap)sap.scrollTop=0;
      return;
    }
    det.classList.remove('prodetail');
    var car=document.getElementById('d-car'); releaseMediaIn(car); car.innerHTML=carTiles(t,id); car.scrollLeft=0;
    observeVids(car);
    document.getElementById('d-name').textContent=t.name;
    document.getElementById('d-user').textContent=t.user;
    var dfb=document.getElementById('d-follow');
    if(dfb){dfb.setAttribute('data-fav',id);dfb.classList.toggle('on',isFav(id));}
    var dsoc=document.getElementById('d-social');
    if(t.kind==='niche'){var dc=CUR[id]||{yf:0},dfollow=dc.yf||0,df='';
      for(var dk=0;dk<Math.min(dfollow,3);dk++){df+='<i style="background:'+AVCOL[(dk+t.deg)%AVCOL.length]+'"></i>';}
      dsoc.innerHTML='<b>'+t.fc+'</b> curators'+(dfollow>0?'<span class="dh-dot">·</span><span class="facepile">'+df+'</span><b>'+dfollow+'</b> you follow':'');
      dsoc.style.display='';
    }else{dsoc.style.display='none';dsoc.innerHTML='';}
    var ddesc=document.getElementById('d-desc');
    if(t.rel){ddesc.textContent=t.rel;ddesc.style.display='';}else{ddesc.style.display='none';}
    if(t.sub&&t.sub.length){subSim={id:id,base:t.deg,deg:t.deg};renderSubs(id);document.getElementById('sec-subs').style.display='';}
    else{subSim=null;document.getElementById('sec-subs').style.display='none';}
    var dd=document.getElementById('d-deg'); dd.textContent=Math.round(t.deg)+'°'; dd.className='deg'+(t.up?'':' dn');
    var sm=document.getElementById('d-smini'); sm.className='sentmini '+(t.up?'up':'dn'); sm.textContent=(t.up?'▲ ':'▼ ')+t.sent+'%';
    var cur=curOf(id);
    document.getElementById('d-user').setAttribute('data-user',t.user);
    liveTL.id=id; liveTL.items=timelineFor(id);
    renderTimeline();
    startLiveTL();
    var dcIm=imgsOf(t);
    var dcur=document.getElementById('d-curators');releaseMediaIn(dcur);
    dcur.innerHTML=(COLLECTIONS[id]||[]).map(function(cl,i){
      var u=dcIm.length?dcIm[i%dcIm.length]:null;
      // Collections aren't a single trend, so recycle a clip from a member trend that has one.
      var members=(window.COLL_TRENDS&&COLL_TRENDS[id+'#'+i])||[id], cvs='';
      for(var mi=0;mi<members.length;mi++){var mm=members[mi];if(vcount(mm)){cvs=clipAttrs(mm,(i%vcount(mm))+1,true);break;}}
      return '<div class="cs-card" data-collection="'+i+'"><span class="cs-cover"'+cvs+' style="background-image:'+(u?'url('+u+'),':'')+'linear-gradient('+(120+i*40)+'deg,'+t.theme[0]+','+t.theme[2]+');background-size:cover;background-position:center"></span>'+
        '<div class="cs-ct">'+cl.coll+'</div><div class="cs-cby">'+cl.u+'</div></div>';
    }).join('');
    refreshActiveMedia(document.getElementById('d-curators'));
    document.getElementById('sec-moves').style.display=(liveTL.items&&liveTL.items.length)?'':'none';
    document.getElementById('sec-colls').style.display=(COLLECTIONS[id]&&COLLECTIONS[id].length)?'':'none';
    show('detail');
    var sa=document.querySelector('#s-detail .scrollarea');if(sa)sa.scrollTop=0;
  }

  var profileReturn='feed';
  var toastT;
  function showToast(msg){var el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('on');},1600);}
  // color helpers for themed flair accent (pick brightest theme color, lighten to stay readable on dark)
  function _rgb(hex){var c=hex.replace('#','');return [parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)];}
  function lum(hex){var r=_rgb(hex);return 0.299*r[0]+0.587*r[1]+0.114*r[2];}
  function lighten(hex,amt){var r=_rgb(hex).map(function(x){return Math.round(x+(255-x)*amt);});return '#'+r.map(function(x){return ('0'+x.toString(16)).slice(-2);}).join('');}
  function accentOf(theme){var best=theme[0];theme.forEach(function(h){if(lum(h)>lum(best))best=h;});var g=0;while(lum(best)<165&&g<6){best=lighten(best,0.22);g++;}return best;}
  function trendRowHTML(id){var t=T[id];if(!t)return '';
    var rvs=vcount(id)?clipAttrs(id,1,true):'';
    return '<div class="trend-row" data-go-trend="'+id+'"><span class="trend-sw"'+rvs+' style="background-color:#16161c;background-image:'+(t.img?'url('+t.img+'),':'')+'linear-gradient(135deg,'+t.theme[0]+','+t.theme[2]+');background-size:cover;background-position:center"></span>'+
      '<div class="trend-id"><div class="trend-nm">'+t.name+'</div><div class="trend-meta">'+t.fc+' curators · '+(t.kind==='niche'?'Niche':'Trending')+'</div></div>'+
      '<span class="trend-deg '+(t.up?'':'dn')+'">'+t.deg+'°</span></div>';}
  function exRowHTML(id){var t=T[id];
    var imgs=imgsOf(t),tiles='';
    for(var i=0;i<6;i++){
      var u=imgs[i%(imgs.length||1)];
      var a=t.theme[i%3],bcol=t.theme[(i+1)%3];
      var bg=(u?'url('+u+'),':'')+'linear-gradient('+(140+i*18)+'deg,'+a+','+bcol+')';
      var vs=vcount(id)?clipAttrs(id,(i%vcount(id))+1,true):'';
      tiles+='<span class="ex-tile"'+vs+' style="background-image:'+bg+'"></span>';
    }
    return '<div class="trend-row ex-row" data-go-trend="'+id+'">'+
      '<div class="ex-car-wrap"><div class="ex-car">'+tiles+'</div><div class="ex-car-fade"></div></div>'+
      '<div class="ex-copy"><span class="ex-deg '+(t.up?'':'dn')+'">'+t.deg+'°</span>'+
        '<div class="trend-nm">'+t.name+'</div>'+
        '<div class="trend-meta">'+t.fc+' curators</div></div></div>';}
  function openProfile(handle){
    var p=PROFILES[handle]; if(!p)return;
    var lead=(p.leads&&p.leads.length)?p.leads[0]:null;
    var c=lead?curOf(lead):{calls:p.calls||0,hit:p.hit||0,rallied:0,col:p.col||'#9aa6c9'};
    // most active trend = highest-degree trend they lead or are active on (drives the banner + accent)
    var cand=(p.leads||[]).concat(p.active||[]).filter(function(id){return T[id];});
    var actId=cand[0]||Object.keys(T)[0];
    cand.forEach(function(id){if(T[id].deg>T[actId].deg)actId=id;});
    var at=T[actId], s=document.getElementById('s-profile');
    var acc=accentOf(at.theme), acc2=lighten(at.theme[2],0.28);
    s.style.setProperty('--pf-accent',acc);
    s.style.setProperty('--pf-c0',acc);
    s.style.setProperty('--pf-c2',acc2);
    document.getElementById('pf-banner').style.background='linear-gradient(120deg,'+at.theme[0]+','+at.theme[1]+' 38%,'+at.theme[2]+' 70%,'+at.theme[0]+')';
    var tier=c.hit>=0.85?'✦ Tastemaker':(c.hit>=0.7?'✦ Curator':'✦ Scout');
    document.getElementById('pf-badge').textContent=tier;
    var crest='';
    if(p.followers>=1000)crest+='<span class="crest verified" title="Verified curator"><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg></span>';
    if(c.hit>=0.85)crest+='<span class="crest top" title="Top tastemaker">♛</span>';
    if(c.calls>=30)crest+='<span class="crest active" title="Highly active">✦</span>';
    document.getElementById('pf-crest').innerHTML=crest;
    var flair=(p.followers>=1000||c.hit>=0.85);
    document.getElementById('s-profile').classList.toggle('flair',flair);
    document.getElementById('pf-av').style.background=c.col;
    document.getElementById('pf-name').innerHTML=handle+(badgesFor(handle).length?'<span class="ubadges pf-ubadges">'+badgeRow(handle)+'</span>':'');
    document.getElementById('pf-tag').textContent=p.tag;
    document.getElementById('pf-foll').textContent=fmt(p.followers);
    document.getElementById('pf-following').textContent=fmt(p.following!=null?p.following:Math.round(p.followers*0.3+8));
    document.getElementById('pf-right').textContent=c.hit?Math.round(c.hit*100)+'%':'—';
    document.getElementById('pf-calls').textContent=c.calls;
    currentProfile=handle;
    // Plain-language, earned-only badges (never repeat the stat numbers).
    var badges=[];
    if(c.hit>=0.85)badges.push({t:'Top 5% accuracy',gold:true});
    else if(c.hit>=0.78)badges.push({t:'Top 20% accuracy',gold:true});
    if(c.hit>=0.8)badges.push({t:'Calls trends early'});
    if(c.hit>=0.7&&p.domains&&handle!=='@you')badges.push({t:'Known for '+p.domains.split(' · ')[0]});
    document.getElementById('pf-badges').innerHTML=badges.map(function(b){return '<span class="pf-badge2'+(b.gold?' gold':'')+'">'+b.t+'</span>';}).join('');
    var leadsEmpty=!(p.leads&&p.leads.length);
    document.getElementById('pf-leads-h').style.display=leadsEmpty?'none':'';
    document.getElementById('pf-leads').style.display=leadsEmpty?'none':'';
    releaseMediaIn(document.getElementById('pf-leads'));releaseMediaIn(document.getElementById('pf-active'));
    document.getElementById('pf-leads').innerHTML=(p.leads||[]).map(trendRowHTML).join('');
    document.getElementById('pf-active').innerHTML=(p.active||[]).map(trendRowHTML).join('');
    ['pf-leads','pf-active'].forEach(function(gid){refreshActiveMedia(document.getElementById(gid));});
    var pf=document.getElementById('pf-follow'); pf.classList.remove('on');
    if(handle==='@you'){pf.dataset.self='1';pf.textContent='Edit profile';}else{pf.dataset.self='';pf.textContent='Follow';}
    profileReturn=currentScreenKey();
    show('profile');
    var sa=document.querySelector('#s-profile .scrollarea');if(sa)sa.scrollTop=0;
  }

  // ===== Followers / Following =====
  var currentProfile='@you', userlistReturn='profile', ulHandle='@you', ulKind='followers';
  function userRowHTML(handle){var p=PROFILES[handle];if(!p)return '';
    var lead=(p.leads&&p.leads.length)?p.leads[0]:null, c=lead?curOf(lead):{col:p.col||'#9aa6c9',hit:p.hit||0};
    var chk=(p.followers>=1000)?'<span class="ucheck"><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg></span>':'';
    return '<div class="urow" data-user="'+handle+'"><span class="uav" style="background:'+c.col+'"></span>'+
      '<div class="uid"><div class="unm">'+handle+chk+'</div><div class="usub">'+fmt(p.followers)+' followers</div></div>'+
      '<button class="cb-follow sm">Follow</button></div>';}
  function followSet(handle,kind){
    var all=Object.keys(PROFILES).filter(function(h){return h!==handle&&h!=='@you';});
    return kind==='following'?all.slice(0,3):all;}
  function renderUserList(){
    document.querySelectorAll('.ultab').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-ultab')===ulKind);});
    var set=followSet(ulHandle,ulKind);
    document.getElementById('ul-list').innerHTML=set.length?set.map(userRowHTML).join(''):'<div class="stub-d" style="padding:20px 2px;">No one yet.</div>';}
  function openFollowList(handle,kind){ulHandle=handle;ulKind=kind;userlistReturn=currentScreenKey();
    document.getElementById('ul-title').textContent=handle;renderUserList();show('userlist');
    var sa=document.querySelector('#s-userlist .scrollarea');if(sa)sa.scrollTop=0;}

  // ===== Post detail + threaded comments =====
  var COMMENTS={
    0:[{id:1,u:"@eloquent",t:"2h",text:"the agent demos sold me, not the chat. quietly replaced three tools.",up:5,replies:[
         {id:2,u:"@jerry",t:"1h",text:"same. it's the default for real work now",up:2,replies:[]}]},
       {id:3,u:"@parlay",t:"1h",text:"benchmarks finally match the vibes",up:3,replies:[]}],
    1:[{id:4,u:"@pacers",t:"4h",text:"if that coastline read is right the map is insane",up:6,replies:[]}],
    2:[{id:5,u:"@dirkdiggler",t:"7h",text:"run club then coffee is the actual meta now",up:3,replies:[]}]
  };
  var postdetailReturn='posts', curPost=0, cmtVotes={}, cmtCounter=6, cmtSort='best', replyTo=null, cmtCollapsed={};
  var CSORT_LABEL={best:'Best',top:'Top',new:'New'};
  function avatarColor(handle,fallbackTrend){var p=PROFILES[handle];var lead=(p&&p.leads&&p.leads.length)?p.leads[0]:fallbackTrend;return curOf(lead).col;}
  function cScore(n){var v=cmtVotes[n.id]||'';return n.up+(v==='up'?1:0)-(v==='down'?1:0);}
  function sortNodes(arr){var a=arr.slice();a.sort(function(x,y){
    if(cmtSort==='new')return timeVal(x.t)-timeVal(y.t);
    if(cmtSort==='top')return cScore(y)-cScore(x);
    return (cScore(y)-cScore(x))||(timeVal(x.t)-timeVal(y.t));});return a;}
  function findNode(pid,id){var f=null;(function w(a){(a||[]).forEach(function(n){if(n.id===id)f=n;else w(n.replies);});})(COMMENTS[pid]||[]);return f;}
  function countComments(pid){var c=0;(function w(a){(a||[]).forEach(function(n){c++;w(n.replies);});})(COMMENTS[pid]||[]);return c;}
  function openPost(pid){curPost=pid;postdetailReturn=currentScreenKey();replyTo=null;cmtSort='best';renderPostDetail();show('postdetail');
    var ctx=document.getElementById('pd-ctx');if(ctx)ctx.classList.remove('on');
    var inp=document.getElementById('pd-reply');if(inp){inp.value='';inp.placeholder='Add a comment…';}
    var sa=document.querySelector('#s-postdetail .scrollarea');if(sa)sa.scrollTop=0;}
  function descCount(node){var c=0;(node.replies||[]).forEach(function(r){c+=1+descCount(r);});return c;}
  function commentNodeHTML(node){var v=cmtVotes[node.id]||'',likes=cScore(node);
    var kids='';
    if(node.replies&&node.replies.length){
      if(cmtCollapsed[node.id]){var n=descCount(node);
        kids='<button class="cmt-more" data-ctoggle="'+node.id+'"><span class="pm">+</span>'+n+' more repl'+(n>1?'ies':'y')+'</button>';
      }else{
        kids='<div class="cmt-thread"><button class="thread-rail" data-ctoggle="'+node.id+'" aria-label="Collapse replies"><span class="rail-min">−</span></button>'+
          '<div class="cmt-children">'+sortNodes(node.replies).map(commentNodeHTML).join('')+'</div></div>';
      }
    }
    return '<div class="cmt"><span class="cav" data-user="'+node.u+'" style="background:'+avatarColor(node.u,POSTS[curPost].id)+'"></span>'+
      '<div class="cmain"><div class="ctop"><b>'+node.u+'</b><span class="ubadges">'+badgeRow(node.u,3)+'</span> · '+node.t+(node.t==='now'?'':' ago')+'</div>'+
      '<div class="ctext">'+node.text+'</div>'+
      '<div class="cmt-react">'+
        '<span class="cr like'+(v==='up'?' on':'')+'" data-cvote="up" data-cid="'+node.id+'">'+ICON_UP+' '+likes+'</span>'+
        '<span class="cr dislike'+(v==='down'?' on':'')+'" data-cvote="down" data-cid="'+node.id+'">'+ICON_DOWN+'</span>'+
        '<span class="cr" data-creply="'+node.id+'">'+ICON_CMT+' Reply</span>'+
        '<span class="cr" data-share>'+ICON_SHARE+' Share</span></div>'+
      kids+'</div></div>';}
  function renderComments(){var top=COMMENTS[curPost]||[];
    document.getElementById('pd-comments').innerHTML=top.length?sortNodes(top).map(commentNodeHTML).join(''):'<div class="stub-d" style="padding:14px 2px;">No comments yet. Start the thread.</div>';}
  function renderPostDetail(){
    var p=POSTS[curPost], t=T[p.id];
    var v=postVotes[curPost]||'', shown=p.up+(v==='up'?1:0)-(v==='down'?1:0), n=countComments(curPost);
    releaseMediaIn(document.getElementById('pd-content'));
    document.getElementById('pd-content').innerHTML=
      '<div class="pd-post">'+
        '<span class="post-th pd-th" data-go-trend="'+p.id+'"'+(vcount(p.id)?clipAttrs(p.id,(curPost%vcount(p.id))+1,true):'')+' style="background-image:'+(t.img?'url('+t.img+'),':'')+'linear-gradient(135deg,'+t.theme[0]+','+t.theme[2]+');background-size:cover;background-position:center"></span>'+
        '<div class="pd-meta">'+
          '<span class="post-trend" data-go-trend="'+p.id+'">'+t.name+'</span><span class="post-sep">·</span>'+
          userChip(p.u)+'<span class="post-sep">·</span><span class="post-time">'+p.t+' ago</span></div>'+
        '<div class="pd-body">'+p.text+'</div>'+
        '<div class="post-react"><span class="pr vote up'+(v==='up'?' on':'')+'" data-vote="up" data-pid="'+curPost+'">'+ICON_UP+' '+shown+'</span>'+
          '<span class="pr vote down'+(v==='down'?' on':'')+'" data-vote="down" data-pid="'+curPost+'">'+ICON_DOWN+'</span>'+
          '<span class="pr static">'+ICON_CMT+' '+n+'</span><span class="pr" data-share>'+ICON_SHARE+' Share</span></div></div>'+
      '<div class="pd-cmt-h"><span>'+n+' comments</span><button class="exf exf-inline" id="cmt-sort" data-csortsheet><span id="cmt-sort-lbl">'+CSORT_LABEL[cmtSort]+'</span><svg class="exf-car" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button></div>'+
      '<div id="pd-comments"></div>';
    refreshActiveMedia(document.getElementById('pd-content'));
    renderComments();
  }
  function setReplyTo(cid){replyTo=cid;var node=findNode(curPost,cid);
    document.getElementById('pd-ctx-u').textContent=node?node.u:'';
    document.getElementById('pd-ctx').classList.add('on');
    var inp=document.getElementById('pd-reply');inp.placeholder='Reply to '+(node?node.u:'')+'…';inp.focus();}
  function clearReplyTo(){replyTo=null;document.getElementById('pd-ctx').classList.remove('on');
    document.getElementById('pd-reply').placeholder='Add a comment…';}
  function sendReply(){var inp=document.getElementById('pd-reply'),txt=(inp.value||'').trim();if(!txt)return;
    var node={id:cmtCounter++,u:"@you",t:"now",text:txt,up:0,replies:[]};
    if(replyTo){var parent=findNode(curPost,replyTo);if(parent)(parent.replies=parent.replies||[]).push(node);}
    else{(COMMENTS[curPost]=COMMENTS[curPost]||[]).push(node);}
    inp.value='';clearReplyTo();renderPostDetail();
    var sa=document.querySelector('#s-postdetail .scrollarea');if(sa)sa.scrollTop=sa.scrollHeight;}

  // ===== Compose (new post) — Reddit-style trend picker =====
  var cmpTrend=null;
  function setCmpPost(){var btn=document.getElementById('cmp-post'),txt=(document.getElementById('cmp-text').value||'').trim();
    btn.dataset.mode=(cmpTrend&&txt)?'ready':'disabled';btn.style.opacity=(cmpTrend&&txt)?'1':'.5';}
  function cmpRenderOpts(q){q=(q||'').toLowerCase();
    var ids=ORDERS.all.filter(function(id){return !q||T[id].name.toLowerCase().indexOf(q)>=0;});
    var list=document.getElementById('cmp-dd-list'),dd=document.getElementById('cmp-dd');
    releaseMediaIn(list);
    document.getElementById('cmp-dd-list').innerHTML=ids.length?ids.map(function(id){var t=T[id];
      var vid=previewClipId(id),vs=vid?clipAttrs(vid,1,true):'';
      return '<button class="cmp-opt" data-cmptrend="'+id+'"><span class="cmp-opt-media"'+vs+' style="background-image:'+(t.img?'url('+t.img+'),':'')+'linear-gradient(150deg,'+t.theme[0]+','+t.theme[1]+' 55%,'+t.theme[2]+');"></span><span class="cmp-opt-nm">'+t.name+'</span></button>';
    }).join(''):'<div class="cmp-opt-empty">No trends match.</div>';
    if(dd&&!dd.hidden)refreshActiveMedia(dd);}
  function cmpPickTrend(id){cmpTrend=id;var t=T[id];
    document.getElementById('cmp-sel-label').textContent=t.name;
    var sw=document.getElementById('cmp-sel-sw');sw.style.display='block';sw.style.background='linear-gradient(135deg,'+t.theme[0]+','+t.theme[2]+')';
    var dd=document.getElementById('cmp-dd');releaseMediaIn(dd);dd.hidden=true;setCmpPost();
    document.getElementById('cmp-text').focus();}
  function openCompose(){cmpTrend=null;
    document.getElementById('cmp-sel-label').textContent='Select trend';
    document.getElementById('cmp-sel-sw').style.display='none';
    document.getElementById('cmp-dd').hidden=true;
    document.getElementById('cmp-search').value='';cmpRenderOpts('');
    document.getElementById('cmp-text').value='';setCmpPost();
    sheet.classList.remove('open');addsheet.classList.remove('open');cmpsheet.classList.add('open');scrim.classList.add('open');}
  function submitPost(){if(document.getElementById('cmp-post').dataset.mode!=='ready')return;
    var txt=document.getElementById('cmp-text').value.trim();
    POSTS.push({id:cmpTrend,u:"@you",t:"now",text:txt,up:0,c:0});
    closeAll();postsSort='new';renderPosts();show('posts');}

  var collectionReturn='detail', collCtx={trendId:null,idx:0};
  function openCollection(trendId,idx){
    var t=T[trendId], cl=(COLLECTIONS[trendId]||[])[idx]; if(!cl)return;
    collCtx={trendId:trendId,idx:idx};
    var ids=(window.COLL_TRENDS&&COLL_TRENDS[trendId+'#'+idx])||[trendId];
    document.getElementById('coll-title').textContent=cl.coll;
    document.getElementById('coll-sub').textContent=ids.length+' trends'+(cl.u&&cl.u!=='@noise'?' · curated by '+cl.u:'');
    renderCollGallery(ids);
    collectionReturn=currentScreenKey();
    show('collection');
    var gw=document.getElementById('coll-grid-wrap'); if(gw)gw.scrollTop=0;
  }
  function renderCollGallery(ids){
    var grid=document.getElementById('coll-grid');
    releaseMediaIn(grid);
    grid.innerHTML=ids.map(function(id,gi){var s=T[id];if(!s)return '';
      var g='linear-gradient(160deg,'+s.theme[0]+','+(s.theme[2]||s.theme[1])+')';
      var im=imgsOf(s),u=im.length?im[0]:null;
      var gvs=vcount(id)?clipAttrs(id,(gi%vcount(id))+1,true):'';
      return '<button class="gcard" data-go-trend="'+id+'">'+
        '<span class="gcard-img"'+gvs+' style="background-image:'+(u?'url('+u+'),':'')+g+';background-size:cover;background-position:center"></span>'+
        '<span class="gcard-deg">'+Math.round(s.deg)+'°</span>'+
        '<span class="gcard-nm">'+s.name+'</span></button>';
    }).join('');
    refreshActiveMedia(grid);
  }
  function openLightbox(grad,cap){document.getElementById('lb-img').style.background=grad;
    document.getElementById('lb-cap').textContent=cap;document.getElementById('lightbox').classList.add('open');}
  function closeLightbox(){document.getElementById('lightbox').classList.remove('open');}

  // ===== Timeline (full event list for a trend) =====
  var timelineReturn='detail';
  function sigRow(s){var isNow=(s.time==='now');return '<div class="sigrow'+(s.live?' sig-live':'')+'" data-art="'+encodeURIComponent(JSON.stringify({src:s.src,head:s.head,time:s.time,dir:s.dir,m:s.m}))+'"><span class="sig-dir '+s.dir+'">'+(s.dir==='up'?'▲':'▼')+'</span>'+
    '<div class="sig-main"><div class="sig-head">'+s.head+'</div><div class="sig-sub">'+(s.live?'<span class="sig-livedot"></span>':'')+s.src+' · '+(isNow?'just now':s.time+' ago')+'</div></div>'+
    '<span class="sig-mag '+s.dir+'">'+(s.dir==='up'?'+':'−')+s.m+'°</span></div>';}
  var articleReturn='timeline';
  function openArticle(s){
    document.getElementById('art-src').textContent=s.src+' · '+s.time+' ago';
    document.getElementById('art-title').textContent=s.head;
    var mv=document.getElementById('art-move');mv.textContent=(s.dir==='up'?'+':'−')+s.m+'°';mv.className='art-move '+(s.dir==='up'?'up':'dn');
    var dir=s.dir==='up'?'pushed the degree up':'pulled the degree down';
    document.getElementById('art-body').innerHTML=
      '<p>'+s.head+'.</p>'+
      '<p>Picked up by <b>'+s.src+'</b> about '+s.time+' ago, this is one of the signals that '+dir+' by <b>'+(s.dir==='up'?'+':'−')+s.m+'°</b> on NOISE.</p>'+
      '<p>Curators flagged it as part of the wider shift around this trend — the kind of moment that moves attention before the mainstream catches on. Read it next to the other moves to see how the momentum is building.</p>'+
      '<p class="art-foot">Sample editorial for the demo. In the live product this opens the original story or clip from '+s.src+'.</p>';
    articleReturn=currentScreenKey();show('article');
    var sa=document.querySelector('#s-article .scrollarea');if(sa)sa.scrollTop=0;}
  function openTimeline(id){var t=T[id];
    var all=timelineFor(id).concat([
      {src:"Substack",head:"A newsletter flags it as one to watch",time:"1w",dir:"up",m:4},
      {src:"Reddit",head:"Early threads start to form",time:"2w",dir:"up",m:3},
      {src:"TikTok",head:"First clips begin circulating",time:"3w",dir:"up",m:2},
      {src:"NOISE",head:t.name+" added to the board",time:"1mo",dir:"up",m:2}]);
    document.getElementById('tl-name').textContent=t.name;
    document.getElementById('tl-list').innerHTML=all.map(sigRow).join('');
    timelineReturn=currentScreenKey();
    show('timeline');
    var sa=document.querySelector('#s-timeline .scrollarea');if(sa)sa.scrollTop=0;
  }

  // ===== Saved + stub destinations (no dead taps) =====
  var savedReturn='feed', stubReturn='feed';
  function renderWatchlist(){
    var ids=order.filter(isFav), list=document.getElementById('saved-list');
    if(!ids.length){list.innerHTML='<div class="wl-empty">No trends in your watchlist yet.<br>Tap the ★ on a trend page or in Markets to start tracking one.</div>';return;}
    list.innerHTML=ids.map(function(id){
      return trendRowHTML(id).replace('<div class="trend-row" data-go-trend="'+id+'">','<div class="trend-row wl-row" data-go-trend="'+id+'"><button class="wl-x" data-fav="'+id+'" aria-label="Remove from watchlist">★</button>');
    }).join('');
  }
  function openSaved(){
    renderWatchlist();
    savedReturn=currentScreenKey();show('saved');
    var sa=document.querySelector('#s-saved .scrollarea');if(sa)sa.scrollTop=0;
  }
  function openStub(title){document.getElementById('stub-title').textContent=title||'Coming soon';
    stubReturn=currentScreenKey();show('stub');}

  // ===== Notifications =====
  var subReturn='feed';
  var NOTIFS=[
    {kind:"resolve",icon:"check",iconbg:"#54D9A6",text:"Your <b>Rise</b> call on <b>Claude</b> resolved <b>+240 credits</b>",time:"2h",unread:true,go:{t:"detail",a:"claude"}},
    {kind:"reply",av:"@viceloop",text:"<b>@viceloop</b> replied to your comment on <b>GTA VI</b>",time:"5h",unread:true,go:{t:"post",a:1}},
    {kind:"follow",av:"@thequietedit",text:"<b>@thequietedit</b> started following you",time:"8h",unread:true,go:{t:"profile",a:"@thequietedit"}},
    {kind:"move",icon:"trend",iconbg:"#F2B33D",text:"<b>Humanoid Robots</b> jumped <b>+16°</b> in the last day",time:"1d",unread:false,go:{t:"detail",a:"humanoidrobots"}},
    {kind:"like",av:"@pacers",text:"<b>@pacers</b> and 4 others liked your post",time:"2d",unread:false,go:{t:"post",a:0}}
  ];
  function unreadCount(){return NOTIFS.filter(function(n){return n.unread;}).length;}
  function updateBellDot(){var d=document.querySelector('.bell-dot');if(d)d.style.display=unreadCount()>0?'block':'none';}
  var IC_CHECK='<svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg>';
  var IC_TREND='<svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 7-7M21 8v5M21 8h-5"/></svg>';
  function openNotif(){
    document.getElementById('notif-list').innerHTML=NOTIFS.map(function(n,i){
      var av=n.av?('<span class="nf-av" style="background:'+avatarColor(n.av,Object.keys(T)[0])+'"></span>')
        :('<span class="nf-av" style="background:'+n.iconbg+'">'+(n.icon==='check'?IC_CHECK:IC_TREND)+'</span>');
      return '<div class="notif" data-notif="'+i+'">'+av+'<div class="nf-main"><div class="nf-text">'+n.text+'</div><div class="nf-time">'+n.time+' ago</div></div>'+(n.unread?'<span class="nf-dot"></span>':'')+'</div>';
    }).join('')||'<div class="stub-d" style="padding:20px 2px;">No notifications yet.</div>';
    subReturn=currentScreenKey();show('notif');
    var sa=document.querySelector('#s-notif .scrollarea');if(sa)sa.scrollTop=0;
    NOTIFS.forEach(function(n){n.unread=false;});updateBellDot();
  }
  function notifGo(i){var n=NOTIFS[i];if(!n)return;n.unread=false;updateBellDot();var g=n.go;
    if(g.t==='detail')openDetail(g.a);else if(g.t==='post')openPost(g.a);else if(g.t==='profile')openProfile(g.a);}

  // ===== Edit profile (avatar / name / bio) =====
  var MY_SW=["#aab2c8","#E0573A","#3FA66A","#9B6BFF","#E48FC0","#36617A","#F2B33D","#19C2C2"];
  function openEdit(){var p=PROFILES['@you'];
    document.getElementById('edit-av').style.background=p.col;
    document.getElementById('edit-name').value=p.name||'@you';
    document.getElementById('edit-bio').value=p.tag;
    document.getElementById('edit-sw').innerHTML=MY_SW.map(function(c){return '<span class="sw'+(c===p.col?' on':'')+'" data-sw="'+c+'" style="background:'+c+'"></span>';}).join('');
    subReturn=currentScreenKey();show('editprofile');}
  function saveEdit(){var p=PROFILES['@you'];
    var nm=(document.getElementById('edit-name').value||'').trim();
    p.name=nm||'@you';p.tag=(document.getElementById('edit-bio').value||'').trim()||'Just getting started on NOISE.';
    var sel=document.querySelector('#edit-sw .sw.on');if(sel)p.col=sel.getAttribute('data-sw');
    showToast('Profile saved');openProfile('@you');}

  // ===== Help FAQ =====
  var FAQ=[
    {q:"What is a degree?",a:"A trend’s degree (0–700) is its live relevance score — how much real attention and momentum it has right now, set by the community and the signals moving it."},
    {q:"What does it mean to Signal?",a:"Signalling is staking credits on where a trend is heading — Rise or Cool. If the degree moves your way by the lock date, you win credits."},
    {q:"How do credits work?",a:"Credits are the in-app currency you use to signal. You can top up in Credits & wallet. They’re for the demo — no real money moves."},
    {q:"What makes a trend cool down?",a:"Attention fading, no fresh work, time decay, or the real-world signal behind it going quiet. The Moves list shows what pushed each shift."},
    {q:"What’s the difference between Trending and Niche?",a:"Trending is what already has full momentum. Niche is small but devoted — a tiny crowd with high conviction that something could pop."}
  ];
  function openHelp(){
    document.getElementById('faq-list').innerHTML=FAQ.map(function(f,i){
      return '<div class="faq-item" data-faq="'+i+'"><button class="faq-q">'+f.q+'<span class="fq-ic">+</span></button><div class="faq-a"><p>'+f.a+'</p></div></div>';
    }).join('');
    subReturn=currentScreenKey();show('help');
    var sa=document.querySelector('#s-help .scrollarea');if(sa)sa.scrollTop=0;}
  function openSecurity(){subReturn=currentScreenKey();show('security');}
  function openInvite(){subReturn=currentScreenKey();show('invite');}

  // ===== Posts (community posts per trend) =====
  var ICON_UP='<svg viewBox="0 0 24 24"><path d="M7 10v10M7 10l3.2-7a1.8 1.8 0 0 1 3.3 1.4L13 9h5a2 2 0 0 1 2 2.3l-1.1 7A2 2 0 0 1 16.9 20H7z"/></svg>';
  var ICON_DOWN='<svg viewBox="0 0 24 24"><path d="M17 14V4M17 14l-3.2 7a1.8 1.8 0 0 1-3.3-1.4L11 15H6a2 2 0 0 1-2-2.3l1.1-7A2 2 0 0 1 7.1 4H17z"/></svg>';
  var ICON_CMT='<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.3 7.3L3 21l1.7-6.7A8 8 0 1 1 21 12z"/></svg>';
  var ICON_SHARE='<svg viewBox="0 0 24 24"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"/></svg>';
  var postsSort='best';
  var postsWhen='today';
  var postVotes={};
  function timeVal(s){var n=parseInt(s,10)||0;if(s.indexOf('mo')>=0)return n*720;if(s.indexOf('w')>=0)return n*168;if(s.indexOf('d')>=0)return n*24;return n;}
  function renderPosts(){
    var q=((document.getElementById('posts-search')||{}).value||'').trim().toLowerCase();
    var arr=POSTS.slice();
    if(q){arr=arr.filter(function(p){var t=T[p.id];return (p.text+' '+p.u+' '+(t?t.name:'')).toLowerCase().indexOf(q)>=0;});}
    if(postsWhen!=='all'){var lim=postsWhen==='today'?24:postsWhen==='week'?168:720;arr=arr.filter(function(p){return timeVal(p.t)<=lim;});}
    if(postsSort==='new'){arr.sort(function(a,b){return timeVal(a.t)-timeVal(b.t);});}
    else if(postsSort==='top'){arr.sort(function(a,b){return b.up-a.up;});}
    else{arr.sort(function(a,b){return (b.up/Math.pow(timeVal(b.t)+2,0.8))-(a.up/Math.pow(timeVal(a.t)+2,0.8));});}
    var postsList=document.getElementById('posts-list');releaseMediaIn(postsList);
    postsList.innerHTML=arr.map(function(p){var t=T[p.id];
      var pid=POSTS.indexOf(p), v=postVotes[pid]||'', shown=p.up+(v==='up'?1:0)-(v==='down'?1:0);
      var pvs=vcount(p.id)?clipAttrs(p.id,(pid%vcount(p.id))+1,true):'';
      return '<div class="post" data-post="'+pid+'">'+
        '<span class="post-media" data-go-trend="'+p.id+'"'+pvs+' style="background-image:'+(t.img?'url('+t.img+'),':'')+'linear-gradient(150deg,'+t.theme[0]+','+t.theme[1]+' 55%,'+t.theme[2]+');background-size:cover;background-position:center"></span>'+
        '<div class="post-main">'+
          '<div class="post-top"><span class="post-av" data-user="'+p.u+'" style="background:'+avatarColor(p.u,p.id)+'"></span>'+
            '<span class="post-trend" data-go-trend="'+p.id+'">'+t.name+'</span>'+
            '<span class="post-deg" data-go-trend="'+p.id+'">'+t.deg+'°</span><span class="post-sep">·</span>'+
            '<span class="post-u" data-user="'+p.u+'">'+p.u+'</span><span class="ubadges">'+badgeRow(p.u,3)+'</span><span class="post-sep">·</span><span class="post-time">'+p.t+' ago</span></div>'+
          '<div class="post-body">'+p.text+'</div>'+
          '<div class="post-react"><span class="pr vote up'+(v==='up'?' on':'')+'" data-vote="up" data-pid="'+pid+'">'+ICON_UP+' '+shown+'</span>'+
            '<span class="pr vote down'+(v==='down'?' on':'')+'" data-vote="down" data-pid="'+pid+'">'+ICON_DOWN+'</span>'+
            '<span class="pr static">'+ICON_CMT+' '+countComments(pid)+'</span><span class="pr" data-share>'+ICON_SHARE+' Share</span></div>'+
        '</div>'+
      '</div>';
    }).join('');
    // Play clips on the post placeholders (only 8 posts, all map to trends with clips).
    var _pl=document.getElementById('posts-list');
    refreshActiveMedia(_pl);
    var pe=document.getElementById('posts-empty'); if(pe)pe.style.display=arr.length?'none':'block';
  }
  var POSTSORT_OPTS=[['best','Best','Smartest mix of hot & recent'],['top','Top','Most upvoted'],['new','New','Most recent first']];
  var POSTWHEN_OPTS=[['today','Today','Posted in the last 24 hours'],['week','This week','Past 7 days'],['month','This month','Past 30 days'],['all','All time','Every post']];
  function syncPostsLabels(){
    var s=POSTSORT_OPTS.filter(function(o){return o[0]===postsSort;})[0];
    var w=POSTWHEN_OPTS.filter(function(o){return o[0]===postsWhen;})[0];
    var sl=document.getElementById('posts-sort-lbl'); if(sl)sl.textContent=s?s[1]:'Best';
    var wl=document.getElementById('posts-when-lbl'); if(wl)wl.textContent=w?w[1]:'Today';
  }
  function renderPostSheets(){
    var sl=document.getElementById('psort-list'); if(sl)sl.innerHTML=POSTSORT_OPTS.map(function(o){return foptHTML(o[0],o[1],o[2],postsSort===o[0]);}).join('');
    var wl=document.getElementById('pwhen-list'); if(wl)wl.innerHTML=POSTWHEN_OPTS.map(function(o){return foptHTML(o[0],o[1],o[2],postsWhen===o[0]);}).join('');
  }
  function openPostSheet(which){closeAll();renderPostSheets();
    var id=which==='sort'?'psheet-sort':'psheet-when';
    document.getElementById(id).classList.add('open'); scrim.classList.add('open');}
  var CSORT_OPTS=[['best','Best','Smartest mix of votes & recency'],['top','Top','Most upvoted first'],['new','New','Most recent first']];
  function openCommentSortSheet(){closeAll();
    var cl=document.getElementById('csort-list');
    if(cl)cl.innerHTML=CSORT_OPTS.map(function(o){return foptHTML(o[0],o[1],o[2],cmtSort===o[0]);}).join('');
    document.getElementById('csheet-sort').classList.add('open'); scrim.classList.add('open');}
  var psi=document.getElementById('posts-search'); if(psi)psi.addEventListener('input',renderPosts);

  document.addEventListener('click',function(e){
    if(e.target.closest('#prof-back')||e.target.closest('#set-back')||e.target.closest('#saved-back')||e.target.closest('#stub-back')||e.target.closest('#ul-back')||e.target.closest('#pd-back')||e.target.closest('#det-back')||e.target.closest('#notif-back')||e.target.closest('#edit-back')||e.target.closest('#sec-back')||e.target.closest('#help-back')||e.target.closest('#inv-back')||e.target.closest('#sig-back')){goBack(); return;}
    var fg=e.target.closest('[data-feedgo]'); if(fg){openFeedAt(fg.getAttribute('data-feedgo'), parseInt(fg.getAttribute('data-feedidx'),10)); return;}
    var artb=e.target.closest('#art-back'); if(artb){goBack(); return;}
    var art=e.target.closest('[data-art]'); if(art){openArticle(JSON.parse(decodeURIComponent(art.getAttribute('data-art')))); return;}
    var nfr=e.target.closest('[data-notif]'); if(nfr){notifGo(+nfr.getAttribute('data-notif')); return;}
    var fq=e.target.closest('.faq-q'); if(fq){fq.parentElement.classList.toggle('open'); return;}
    var esw=e.target.closest('[data-sw]'); if(esw){document.querySelectorAll('#edit-sw .sw').forEach(function(x){x.classList.remove('on');});esw.classList.add('on');document.getElementById('edit-av').style.background=esw.getAttribute('data-sw'); return;}
    var esv=e.target.closest('#edit-save'); if(esv){saveEdit(); return;}
    var icp=e.target.closest('#inv-copy'); if(icp){showToast('Link copied'); return;}
    var ish=e.target.closest('#inv-share'); if(ish){showToast('Share sheet (demo)'); return;}
    var lgt=e.target.closest('[data-logout]'); if(lgt){closeDrawer();showToast('Logged out (demo)');show('feed'); return;}
    var tst=e.target.closest('[data-toast]'); if(tst){showToast(tst.getAttribute('data-toast')); return;}
    var fls=e.target.closest('[data-followlist]'); if(fls){openFollowList(currentProfile,fls.getAttribute('data-followlist')); return;}
    var ult=e.target.closest('.ultab'); if(ult){ulKind=ult.getAttribute('data-ultab');renderUserList(); return;}
    var fab=e.target.closest('#post-fab'); if(fab){openCompose(); return;}
    var fbell=e.target.closest('#feed-bell'); if(fbell){openNotif(); return;}
    var csl=e.target.closest('#cmp-select'); if(csl){var dd=document.getElementById('cmp-dd');dd.hidden=!dd.hidden;if(!dd.hidden){document.getElementById('cmp-search').focus();refreshActiveMedia(dd);}else{releaseMediaIn(dd);} return;}
    var cx=e.target.closest('#cmp-x'); if(cx){closeAll(); return;}
    var cc=e.target.closest('[data-cmptrend]'); if(cc){cmpPickTrend(cc.getAttribute('data-cmptrend')); return;}
    var cp=e.target.closest('#cmp-post'); if(cp){submitPost(); return;}
    var pds=e.target.closest('#pd-send'); if(pds){sendReply(); return;}
    var cms=e.target.closest('[data-csortsheet]'); if(cms){openCommentSortSheet(); return;}
    var cso=e.target.closest('#csort-list .fopt'); if(cso){cmtSort=cso.getAttribute('data-val');var cl=document.getElementById('cmt-sort-lbl');if(cl)cl.textContent=CSORT_LABEL[cmtSort];closeAll();renderPostDetail(); return;}
    var ctg=e.target.closest('[data-ctoggle]'); if(ctg){var tid=+ctg.getAttribute('data-ctoggle');cmtCollapsed[tid]=!cmtCollapsed[tid];renderComments(); return;}
    var cv=e.target.closest('[data-cvote]'); if(cv){var cid=+cv.getAttribute('data-cid'),cd=cv.getAttribute('data-cvote');cmtVotes[cid]=(cmtVotes[cid]===cd)?'':cd;renderComments(); return;}
    var crp=e.target.closest('[data-creply]'); if(crp){setReplyTo(+crp.getAttribute('data-creply')); return;}
    var ctxx=e.target.closest('#pd-ctx-x'); if(ctxx){clearReplyTo(); return;}
    if(e.target.id==='drawer-scrim'){closeDrawer(); return;}
    var drow=e.target.closest('.dr-row'); if(drow){closeDrawer();
      if(drow.getAttribute('data-user')){openProfile(drow.getAttribute('data-user'));return;}
      if(drow.hasAttribute('data-drawer-add')){openAdd();return;}
      if(drow.hasAttribute('data-saved')){openSaved();return;}
      var dopen=drow.getAttribute('data-open'); if(dopen){if(dopen==='security')openSecurity();else if(dopen==='invite')openInvite();else if(dopen==='help')openHelp();return;}
      if(drow.hasAttribute('data-stub')){openStub(drow.getAttribute('data-stub'));return;}
      var dtab=drow.getAttribute('data-tab'); if(dtab){if(dtab==='settings')settingsReturn=currentScreenKey();show(dtab);} return;}
    var dlo=e.target.closest('#dr-logout'); if(dlo){closeDrawer(); showToast('Logged out (demo)'); show('feed'); return;}
    var srl=e.target.closest('.setrow.link'); if(srl){openStub(srl.getAttribute('data-stub')); return;}
    var lbx=e.target.closest('#lb-close'); if(lbx||e.target.id==='lightbox'){closeLightbox(); return;}
    var tile=e.target.closest('.coll-tile'); if(tile){openLightbox(tile.getAttribute('data-grad'),tile.getAttribute('data-lb')); return;}
    var cb=e.target.closest('#coll-back'); if(cb){goBack(); return;}
    var tlb=e.target.closest('#tl-back'); if(tlb){goBack(); return;}
    var tlm=e.target.closest('#d-sigmore'); if(tlm){openTimeline(currentId); return;}
    var col=e.target.closest('[data-collection]'); if(col){openCollection(currentId,+col.getAttribute('data-collection')); return;}
    var sw=e.target.closest('.switch'); if(sw){var son=sw.getAttribute('aria-pressed')!=='true';sw.setAttribute('aria-pressed',son?'true':'false');
      if(sw.id==='set-pro'){proMode=son;document.getElementById('phone').classList.toggle('pro',proMode);renderFeed(feedKind);kickVideos();if(currentScreenKey()==='explore')renderExplore();}
      if(sw.id==='tpsl-on')document.getElementById('tpsl-fields').style.display=son?'':'none';
      return;}
    var vt=e.target.closest('.pr.vote'); if(vt){var pid=vt.getAttribute('data-pid'),d=vt.getAttribute('data-vote');postVotes[pid]=(postVotes[pid]===d)?'':d;renderPosts();if(currentScreenKey()==='postdetail')renderPostDetail(); return;}
    var flw=e.target.closest('.cb-follow'); if(flw){if(flw.id==='pf-follow'&&flw.dataset.self==='1'){openEdit();return;}var on=flw.classList.toggle('on');flw.textContent=on?'Following':'Follow'; return;}
    var ac=e.target.closest('[data-addcredits]'); if(ac){openAdd(); return;}
    var rs=e.target.closest('[data-resolve]'); if(rs){resolvePos(+rs.getAttribute('data-resolve')); return;}
    var sigb=e.target.closest('[data-signal]'); if(sigb){openSignal(+sigb.getAttribute('data-signal')); return;}
    var fadd=e.target.closest('#fc-add'); if(fadd){openAdd(); return;}
    var ftab=e.target.closest('#fc-tabs [data-fctab]'); if(ftab){fcTab=ftab.getAttribute('data-fctab');
      document.querySelectorAll('#fc-tabs .fc-tab').forEach(function(b){b.setAttribute('aria-current',b===ftab?'true':'false');});
      renderForecasts(); return;}
    var msrt=e.target.closest('#mkt-bar button'); if(msrt){proMarketSort=msrt.getAttribute('data-sort');renderExplore();return;}
    var fchip=e.target.closest('[data-filtersheet]'); if(fchip){openFilterSheet(fchip.getAttribute('data-filtersheet'));return;}
    var pchip=e.target.closest('[data-postsheet]'); if(pchip){openPostSheet(pchip.getAttribute('data-postsheet'));return;}
    var psopt=e.target.closest('#psort-list .fopt'); if(psopt){postsSort=psopt.getAttribute('data-val');syncPostsLabels();renderPostSheets();closeAll();renderPosts();return;}
    var pwopt=e.target.closest('#pwhen-list .fopt'); if(pwopt){postsWhen=pwopt.getAttribute('data-val');syncPostsLabels();renderPostSheets();closeAll();renderPosts();return;}
    var wopt=e.target.closest('#fwhen-list .fopt'); if(wopt){exFilters.when=wopt.getAttribute('data-val');syncFilterLabels();renderFilterSheets();closeAll();renderExplore();return;}
    var sopt=e.target.closest('#fsort-list .fopt'); if(sopt){exFilters.sort=sopt.getAttribute('data-val');syncFilterLabels();renderFilterSheets();closeAll();renderExplore();return;}
    var fcback=e.target.closest('#floc-back'); if(fcback){locView=null;renderLocSheet();return;}
    var ctopt=e.target.closest('#floc-list .fopt[data-city]'); if(ctopt){exFilters.country=ctopt.getAttribute('data-country');exFilters.city=ctopt.getAttribute('data-city');syncFilterLabels();renderFilterSheets();closeAll();renderExplore();return;}
    var copt=e.target.closest('#floc-list .fopt[data-country]'); if(copt){locView=copt.getAttribute('data-country');renderLocSheet();return;}
    var alb=e.target.closest('#pd-alert-btn'); if(alb){var bx=document.getElementById('pd-alertbox');bx.style.display=(bx.style.display==='none'||!bx.style.display)?'flex':'none';return;}
    var ald=e.target.closest('.al-dir'); if(ald){alDir=ald.getAttribute('data-aldir');document.querySelectorAll('.al-dir').forEach(function(x){x.classList.toggle('on',x===ald);});return;}
    var als=e.target.closest('#al-save'); if(als){var av=parseInt(document.getElementById('al-val').value,10);if(!isNaN(av)){alerts[currentId]={dir:alDir,val:av};showToast('Alert set · '+T[currentId].name+' '+alDir+' '+av+'°');document.getElementById('pd-alertbox').style.display='none';}return;}
    var fv=e.target.closest('[data-fav]'); if(fv){var fid=fv.getAttribute('data-fav');toggleFav(fid);fv.classList.toggle('on',isFav(fid));
      document.querySelectorAll('[data-fav="'+fid+'"]').forEach(function(s){s.classList.toggle('on',isFav(fid));});
      document.querySelectorAll('.pd-act[data-fav="'+fid+'"]').forEach(function(a){a.innerHTML='<b class="star">★</b> '+(isFav(fid)?'Watching':'Watchlist');});
      var dfb2=document.querySelector('.dh-follow[data-fav="'+fid+'"]');if(dfb2)dfb2.classList.toggle('on',isFav(fid));
      showToast(isFav(fid)?'Added to watchlist':'Removed from watchlist');
      if(currentScreenKey()==='explore'&&proMarketSort==='watch')renderExplore();
      if(currentScreenKey()==='saved')renderWatchlist(); return;}
    var gt=e.target.closest('[data-go-trend]'); if(gt){openDetail(gt.getAttribute('data-go-trend')); return;}
    var u=e.target.closest('[data-user]'); if(u){closeDrawer();openProfile(u.getAttribute('data-user')||T[currentId].user); return;}
    var f=e.target.closest('[data-forecast]'); if(f){var tp2=f.closest('.topic'); if(tp2)currentId=tp2.getAttribute('data-id'); openSheet(); return;}
    var go=e.target.closest('[data-go]'); if(go){var tp3=go.closest('.topic'); openDetail(tp3?tp3.getAttribute('data-id'):currentId); return;}
    var sh=e.target.closest('[data-share]'); if(sh){showToast('Link copied'); return;}
    var po=e.target.closest('.post[data-post]'); if(po){openPost(+po.getAttribute('data-post')); return;}
    var tb=e.target.closest('[data-tab]'); if(tb){show(tb.getAttribute('data-tab')); return;}
  });

  // ---- forecast sheet ----
  var sheet=document.getElementById('sheet'),addsheet=document.getElementById('addsheet'),scrim=document.getElementById('scrim'),cmpsheet=document.getElementById('cmpsheet');
  var sel={dir:'rise',s:100,lev:1,amt:null};
  var proMode=false; // global default from Settings
  // resolved stake in credits: custom amount if entered, else the chosen amount
  function stakeAmt(){var v=parseInt(document.getElementById('amt').value,10);return (isNaN(v)||v<0)?0:v;}
  var MOVE=0.20; // reference move for the displayed target; payout scales with the real move at lock
  function openSheet(){var t=T[currentId];
    document.getElementById('amt').value='';
    document.getElementById('sheet-name').textContent=t.name;
    document.getElementById('m-rise').textContent=t.sent+'% backing';
    document.getElementById('m-cool').textContent=(100-t.sent)+'% backing';
    document.getElementById('sheet-bal').textContent=fmt(balance);
    setPro(proMode); // default follows the global Pro/Simple setting
    sheet.classList.toggle('proticket',proMode);
    out(); sheet.classList.add('open'); scrim.classList.add('open');}
  function setPro(on){
    document.getElementById('levwrap').style.display=on?'':'none';
    if(!on){sel.lev=1;document.querySelectorAll('#lev .chip').forEach(function(x){x.setAttribute('aria-pressed',x.getAttribute('data-l')==='1'?'true':'false');});
      document.getElementById('tpsl-on').setAttribute('aria-pressed','false');document.getElementById('tpsl-fields').style.display='none';}
    out();}
  // Pro mode is set globally in Settings; tpsl-on and the Settings switches use the delegated '.switch' handler above.
  var settingsReturn='feed';
  document.getElementById('open-settings').addEventListener('click',function(){settingsReturn=currentScreenKey();show('settings');});
  function closeAll(){releaseMediaIn(cmpsheet);sheet.classList.remove('open');addsheet.classList.remove('open');cmpsheet.classList.remove('open');scrim.classList.remove('open');
    ['fsheet-when','fsheet-sort','fsheet-loc','psheet-sort','psheet-when','csheet-sort'].forEach(function(idd){var el=document.getElementById(idd);if(el)el.classList.remove('open');});}
  scrim.addEventListener('click',closeAll);
  document.querySelectorAll('.diropt').forEach(function(b){b.addEventListener('click',function(){
    document.querySelectorAll('.diropt').forEach(function(x){x.classList.remove('active');});b.classList.add('active');sel.dir=b.getAttribute('data-dir');out();});});
  document.querySelectorAll('#lev .chip').forEach(function(c){c.addEventListener('click',function(){
    document.querySelectorAll('#lev .chip').forEach(function(x){x.setAttribute('aria-pressed','false');});c.setAttribute('aria-pressed','true');sel.lev=+c.getAttribute('data-l');out();});});
  document.querySelectorAll('#stake .amt-add').forEach(function(c){c.addEventListener('click',function(){
    var cur=parseInt(document.getElementById('amt').value,10);if(isNaN(cur)||cur<0)cur=0;
    document.getElementById('amt').value=cur+(+c.getAttribute('data-add'));out();});});
  document.getElementById('amt').addEventListener('input',out);
  document.getElementById('tp').addEventListener('input',updateTPSL);
  document.getElementById('sl').addEventListener('input',updateTPSL);
  document.getElementById('sheet-add').addEventListener('click',openAdd);
  function targetDeg(t,dir){return Math.round(t.deg*(dir==='rise'?1+MOVE:1-MOVE));}
  // PnL in credits if the trend reaches degree g (signed: + in your favour, - against)
  function pnlAtDeg(g){var t=T[currentId],stake=stakeAmt(),entry=t.deg;
    if(!stake||!entry||isNaN(g))return null;
    var fav=(sel.dir==='rise')?(g-entry)/entry:(entry-g)/entry;
    return stake*sel.lev*fav;}
  function updateTPSL(){
    var stake=stakeAmt();
    var tp=parseFloat(document.getElementById('tp').value),sl=parseFloat(document.getElementById('sl').value);
    var to=document.getElementById('tp-out'),so=document.getElementById('sl-out');
    if(!to||!so)return;
    // take profit -> win
    if(stake>0&&!isNaN(tp)){var w=pnlAtDeg(tp);
      if(w>0){to.className='tpsl-out win';to.textContent='Win +'+fmt(Math.round(w))+' ◇ (+'+Math.round(w/stake*100)+'%)';}
      else{to.className='tpsl-out muted';to.textContent='Set above entry';}
    }else{to.className='tpsl-out muted';to.textContent='Win —';}
    if(stake>0&&!isNaN(tp)&&sel.dir==='cool'&&pnlAtDeg(tp)<=0)to.textContent='Set below entry';
    // stop loss -> loss (capped at stake = liquidation)
    if(stake>0&&!isNaN(sl)){var l=pnlAtDeg(sl);
      if(l<0){var loss=Math.min(stake,-l),liq=(-l>=stake);so.className='tpsl-out loss';
        so.textContent=(liq?'Liq · ':'')+'Lose -'+fmt(Math.round(loss))+' ◇ (-'+Math.round(loss/stake*100)+'%)';}
      else{so.className='tpsl-out muted';so.textContent=(sel.dir==='rise')?'Set below entry':'Set above entry';}
    }else{so.className='tpsl-out muted';so.textContent='Loss —';}
  }
  function out(){var t=T[currentId],stake=stakeAmt(),profit=Math.round(stake*sel.lev*MOVE),tg=targetDeg(t,sel.dir);
    document.getElementById('out').textContent=fmt(stake>0?stake+profit:0);
    document.getElementById('out-cond').textContent=(sel.dir==='rise'?'reaches ':'falls to ')+tg+'°';
    document.getElementById('sheet-bal').textContent=fmt(balance);
    var pl=document.getElementById('place');
    if(stake<=0){pl.textContent='Signal';pl.dataset.mode='disabled';pl.style.opacity='.5';}
    else if(stake>balance){pl.textContent='Add credits';pl.dataset.mode='add';pl.style.opacity='1';}
    else{pl.textContent='Signal';pl.dataset.mode='place';pl.style.opacity='1';}
    if(proMode){
      document.getElementById('os-entry').textContent=t.deg+'°';
      document.getElementById('os-liq').textContent=sel.lev>1?Math.round(t.deg*(sel.dir==='rise'?(1-0.9/sel.lev):(1+0.9/sel.lev)))+'°':'—';
      document.getElementById('os-cost').textContent=fmt(stake*sel.lev)+' ◇';
      document.getElementById('os-pay').textContent=fmt(stake>0?stake+profit:0)+' ◇';
    }
    pl.classList.remove('side-rise','side-cool');
    if(proMode&&pl.dataset.mode==='place'){
      pl.classList.add(sel.dir==='rise'?'side-rise':'side-cool');
      pl.textContent=(sel.dir==='rise'?'Rise':'Cool')+' '+sel.lev+'× · '+fmt(stake)+' ◇';
    }
    updateTPSL();}
  document.getElementById('place').addEventListener('click',function(){
    if(this.dataset.mode==='disabled')return;
    if(this.dataset.mode==='add'){openAdd();return;}
    var t=T[currentId],stake=stakeAmt(),profit=Math.round(stake*sel.lev*MOVE),tg=targetDeg(t,sel.dir);
    ledgerAdd('stake','Placed · '+t.name, -stake);
    positions.unshift({id:currentId,dir:sel.dir,stake:stake,lev:sel.lev,entry:t.deg,target:tg,profit:profit,payout:stake+profit,status:'open',day:LOCK,placedAt:Date.now()});
    setBal();closeAll();show('forecasts');});

  // ---- add credits sheet ----
  var addsel=5000, addCustom=null;
  document.querySelectorAll('#addamt .chip').forEach(function(c){c.addEventListener('click',function(){
    document.querySelectorAll('#addamt .chip').forEach(function(x){x.setAttribute('aria-pressed','false');});c.setAttribute('aria-pressed','true');
    addsel=+c.getAttribute('data-a');addCustom=null;document.getElementById('addamt-custom').value='';updateAddCTA();});});
  document.getElementById('addamt-custom').addEventListener('input',function(){
    var v=parseInt(this.value,10);addCustom=(isNaN(v)||v<=0)?null:v;
    document.querySelectorAll('#addamt .chip').forEach(function(x){x.setAttribute('aria-pressed',(addCustom==null&&+x.getAttribute('data-a')===addsel)?'true':'false');});updateAddCTA();});
  function addAmt(){return (addCustom!=null&&addCustom>0)?addCustom:addsel;}
  function updateAddCTA(){document.getElementById('addconfirm').textContent='Add '+fmt(addAmt())+' ◇';}
  function openAdd(){addCustom=null;document.getElementById('addamt-custom').value='';updateAddCTA();
    sheet.classList.remove('open');addsheet.classList.add('open');scrim.classList.add('open');}
  document.getElementById('addconfirm').addEventListener('click',function(){var amt=addAmt();ledgerAdd('add','Added credits',amt);setBal();closeAll();if(currentScreenKey()==='forecasts')renderForecasts();});

  // ---- compose + reply inputs ----
  document.getElementById('cmp-text').addEventListener('input',setCmpPost);
  document.getElementById('cmp-search').addEventListener('input',function(){cmpRenderOpts(this.value);});
  document.getElementById('pd-reply').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();sendReply();}});

  // ---- forecasts (lifecycle) ----
  var fcTab='open';
  function fmtSigned(n){return (n>=0?'+':'−')+fmt(Math.abs(n));}
  function timeAgoMs(ms){var s=(Date.now()-ms)/1000;var d=Math.floor(s/86400);if(d>0)return d+'d ago';var h=Math.floor(s/3600);if(h>0)return h+'h ago';var m=Math.floor(s/60);if(m>0)return m+'m ago';return 'just now';}
  function renderForecasts(){
    var openStake=0;positions.forEach(function(p){if(p.status==='open')openStake+=p.stake;});
    var bb=document.getElementById('fc-bal');if(bb)bb.textContent=fmt(balance);
    document.getElementById('fc-stake').textContent=fmt(openStake);
    var pl=netPL(),ple=document.getElementById('fc-pl');ple.textContent=fmtSigned(pl);ple.className='ws-v '+(pl>0?'up':pl<0?'dn':'');
    document.getElementById('fc-rec').textContent=record.won+'–'+record.lost;
    // OPEN positions
    var open=positions.filter(function(p){return p.status==='open';});
    var oh='';
    if(!open.length){oh='<div class="fc-blank"><p>No open signals.<br><span>Find a topic you have a read on and forecast where it\'s heading.</span></p><button class="cta-place" data-tab="feed" style="width:auto;padding:11px 18px;border-radius:var(--r-md);">Open Feed</button></div>';}
    positions.forEach(function(p,idx){ if(p.status!=='open')return; var t=T[p.id],ahead=(p.dir==='rise')===t.up,
      cond=(p.dir==='rise'?'Rise from ':'Cool from ')+(p.entry!=null?p.entry:p.target)+'° → '+p.target+'°';
      oh+='<div class="pcard"><span class="pos-th" data-go-trend="'+p.id+'"'+(vcount(p.id)?clipAttrs(p.id,1,true):'')+' style="background-image:'+(t.img?'url('+t.img+'),':'')+'linear-gradient(135deg,'+t.theme[0]+','+t.theme[2]+')"></span><div class="pos-body" data-signal="'+idx+'"><div class="prow"><h3>'+t.name+'</h3><span class="dirchip '+p.dir+'">'+(p.dir==='rise'?'Rise ▲':'Cool ▼')+'</span></div>'+
        '<div class="pmeta">'+p.stake+' credits · '+((p.lev||1)>1?(p.lev+'× · '):'')+cond+' · wins ~'+fmt(p.profit!=null?p.profit:(p.payout-p.stake))+'</div>'+
        '<div class="pstate"><span class="when">resolves in '+p.day+'d · '+(ahead?'currently ahead':'currently behind')+'</span>'+
        '<button class="btn-resolve" data-resolve="'+idx+'">Resolve now</button></div></div></div>';
    });
    releaseMediaIn(document.getElementById('fc-open'));
    document.getElementById('fc-open').innerHTML=oh;
    refreshActiveMedia(document.getElementById('fc-open'));
    // HISTORY (ledger, newest first)
    var hh='';
    ledger.slice().reverse().forEach(function(e){
      var cls=e.kind==='win'?'up':(e.kind==='loss'||e.kind==='stake')?(e.kind==='loss'?'dn':''):'';
      var sign=e.delta>0?'up':e.delta<0?'dn':'';
      hh+='<div class="ledrow"><div class="led-ic '+e.kind+'">'+ledIcon(e.kind)+'</div>'+
        '<div class="led-main"><div class="led-lbl">'+e.label+'</div><div class="led-sub">'+timeAgoMs(e.t)+' · balance '+fmt(e.bal)+' ◇</div></div>'+
        '<div class="led-delta '+sign+'">'+(e.delta===0?'—':fmtSigned(e.delta))+'</div></div>';
    });
    document.getElementById('fc-history').innerHTML=hh;
    // tab visibility
    document.getElementById('fc-open').hidden=(fcTab!=='open');
    document.getElementById('fc-history').hidden=(fcTab!=='history');
  }
  function ledIcon(kind){
    if(kind==='add')return '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
    if(kind==='win')return '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>';
    if(kind==='loss')return '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    if(kind==='stake')return '<svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" opacity=".0"/><circle cx="12" cy="12" r="7"/></svg>';
    return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/></svg>';
  }
  function resolvePos(i){var p=positions[i];if(!p||p.status!=='open')return;var t=T[p.id];var win=(p.dir==='rise')===t.up;
    if(win){ledgerAdd('win','Won · '+t.name, p.payout - p.stake);record.won++;p.status='won';p.settledAt=Date.now();}
    else{ledgerAdd('loss','Lost · '+t.name, -p.stake);record.lost++;p.status='lost';p.settledAt=Date.now();}
    setBal();renderForecasts();
    if(curSignal===i&&currentScreenKey()==='signaldetail')openSignal(i);}

  // ===== Single signal (position) detail — built for a trader, simplified =====
  var curSignal=null, signalReturn='forecasts';
  function openSignal(idx){
    var p=positions[idx]; if(!p)return; var t=T[p.id];
    curSignal=idx; signalReturn=currentScreenKey();
    var rise=p.dir==='rise';
    var entry=(p.entry!=null?p.entry:p.target);
    var nowDeg=Math.round(t.deg);
    var target=p.target;
    var profit=(p.profit!=null?p.profit:(p.payout-p.stake));
    var payout=p.stake+profit;
    var lev=p.lev||1;
    var roi=Math.round(profit/p.stake*100);
    // progress from entry -> target, clamped 0..100
    var span=Math.abs(target-entry)||1;
    var moved=rise?(nowDeg-entry):(entry-nowDeg);
    var prog=Math.max(0,Math.min(100,Math.round(moved/span*100)));
    var ahead=(p.dir==='rise')===t.up;
    // unrealized: simple model — fraction of profit earned by progress, or -stake risk
    var unreal=ahead?Math.round(profit*(prog/100)):-Math.round(p.stake*Math.min(1,(100-prog)/100)*0.5);
    var dirColor=rise?'var(--up)':'var(--down)';
    var statusTxt=ahead?'On track':'Off track';
    var html=''+
      '<div class="sig-hero">'+
        '<span class="sig-th" data-go-trend="'+p.id+'"'+(vcount(p.id)?clipAttrs(p.id,1,true):'')+' style="background-image:'+(t.img?'url('+t.img+'),':'')+'linear-gradient(135deg,'+t.theme[0]+','+t.theme[2]+')"></span>'+
        '<div class="sig-htext">'+
          '<div class="sig-trend" data-go-trend="'+p.id+'">'+t.name+'</div>'+
          '<div class="sig-chips"><span class="dirchip '+p.dir+'">'+(rise?'Rise ▲':'Cool ▼')+'</span>'+
            (lev>1?'<span class="sig-lev">'+lev+'×</span>':'')+
            '<span class="sig-status '+(ahead?'up':'dn')+'">'+statusTxt+'</span></div>'+
        '</div>'+
      '</div>'+
      // headline P&L
      '<div class="sig-pnl">'+
        '<div class="sig-pnl-k">Unrealized P&amp;L</div>'+
        '<div class="sig-pnl-v '+(unreal>=0?'up':'dn')+'">'+(unreal>=0?'+':'−')+fmt(Math.abs(unreal))+' <span>◇</span></div>'+
        '<div class="sig-pnl-sub">'+(ahead?'Currently ahead of your call':'Currently behind your call')+'</div>'+
      '</div>'+
      // the call: entry -> now -> target with progress
      '<div class="sig-card">'+
        '<div class="sig-card-h">The call</div>'+
        '<div class="sig-degs">'+
          '<div class="sig-deg"><span class="k">Entry</span><span class="v">'+entry+'°</span></div>'+
          '<svg class="sig-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg>'+
          '<div class="sig-deg"><span class="k">Target</span><span class="v" style="color:'+dirColor+'">'+target+'°</span></div>'+
        '</div>'+
        '<div class="sig-track"><div class="sig-track-fill '+(ahead?'up':'dn')+'" style="width:'+prog+'%"></div>'+
          '<div class="sig-track-now" style="left:'+prog+'%"><span>now '+nowDeg+'°</span></div></div>'+
        '<div class="sig-track-meta"><span>'+prog+'% to target</span><span>'+(rise?'needs +':'needs −')+Math.max(0,Math.abs(target-nowDeg))+'°</span></div>'+
      '</div>'+
      // trade stats grid
      '<div class="sig-grid">'+
        '<div class="sig-stat"><div class="k">Stake</div><div class="v">'+fmt(p.stake)+' ◇</div></div>'+
        '<div class="sig-stat"><div class="k">To win</div><div class="v up">+'+fmt(profit)+' ◇</div></div>'+
        '<div class="sig-stat"><div class="k">Payout</div><div class="v">'+fmt(payout)+' ◇</div></div>'+
        '<div class="sig-stat"><div class="k">Return</div><div class="v up">+'+roi+'%</div></div>'+
      '</div>'+
      // resolution
      '<div class="sig-card">'+
        '<div class="sig-card-h">Resolution</div>'+
        '<div class="sig-rrow"><span>Resolves in</span><b>'+p.day+' day'+(p.day===1?'':'s')+'</b></div>'+
        '<div class="sig-rrow"><span>If it resolves now</span><b class="'+(ahead?'up':'dn')+'">'+(ahead?'Win +'+fmt(profit):'Lose −'+fmt(p.stake))+' ◇</b></div>'+
        '<div class="sig-rrow"><span>Direction</span><b>'+(rise?'Rise — degree climbs':'Cool — degree falls')+'</b></div>'+
      '</div>'+
      // actions
      '<div class="sig-actions">'+
        '<button class="cta-place" data-resolve="'+idx+'">Resolve now</button>'+
        '<button class="sig-viewtrend" data-go-trend="'+p.id+'">View trend</button>'+
      '</div>';
    releaseMediaIn(document.getElementById('sig-content'));
    document.getElementById('sig-content').innerHTML=html;
    refreshActiveMedia(document.getElementById('sig-content'));
    show('signaldetail');
    var sa=document.getElementById('sig-scroll'); if(sa)sa.scrollTop=0;
  }

  function renderTaste(){var resolved=record.won+record.lost,open=positions.filter(function(p){return p.status==='open';}).length;
    var rk=document.getElementById('t-rank'),acc=document.getElementById('t-acc'),pos=document.getElementById('t-pos'),sub=document.getElementById('t-sub');
    if(resolved>0){var a=(record.won/resolved),rank=Math.max(4,312-record.won*55);
      rk.innerHTML='#'+rank+' <small>of 1,312</small>';
      acc.innerHTML='<b>'+a.toFixed(2)+'</b> accuracy · '+record.won+' won · '+record.lost+' lost';
      pos.textContent=String(rank).padStart(2,'0');sub.textContent=a.toFixed(2)+' accuracy · '+resolved+' settled';
    }else if(open>0){rk.innerHTML='—';acc.textContent=open+' open call'+(open>1?'s':'')+' — resolve them to build your record.';pos.textContent='—';sub.textContent=open+' open, none settled';}
    else{rk.innerHTML='—';acc.textContent='Forecast to start your track record.';pos.textContent='—';sub.textContent='unranked';}}

  function kickVideos(){document.querySelectorAll('.screen.active video').forEach(function(v){v.muted=true;var q=v.play&&v.play();if(q&&q.catch)q.catch(function(){});});}
  document.addEventListener('pointerdown',kickVideos);document.addEventListener('click',kickVideos);

  // ===== All / Trending / Niche switcher =====
  function moveSeg(){} // seamless switcher uses a CSS underline on the active label; no sliding pill to position
  function openDrawer(){document.getElementById('drawer').classList.add('open');document.getElementById('drawer-scrim').classList.add('open');}
  function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('drawer-scrim').classList.remove('open');}
  document.getElementById('feed-menu').addEventListener('click',openDrawer);
  function setSwitcher(kind){
    if(['trending','niche'].indexOf(kind)<0)kind='trending';
    document.querySelectorAll('.feedseg button').forEach(function(b){
      b.setAttribute('aria-current',b.getAttribute('data-kind')===kind?'true':'false');});
    var seg=document.querySelector('.feedseg'); if(seg)seg.setAttribute('data-active',kind);
    moveSeg();
    renderFeed(kind);
    kickVideos();
  }
  document.querySelectorAll('.feedseg button').forEach(function(b){
    b.addEventListener('click',function(){setSwitcher(b.getAttribute('data-kind'));});});

  renderFeed('trending');
  // Match the phone to Safari's true visible area (kills the black bars; updates as toolbars resize)
  // ===== Pull-to-refresh (posts + feed) =====
  function attachPTR(scrollEl, ptrEl, onRefresh){
    if(!scrollEl||!ptrEl)return;
    var THRESH=64, MAX=96, startY=0, pulling=false, dist=0, busy=false;
    function setH(h){ptrEl.style.height=h+'px';}
    function begin(y){ if(busy)return; if(scrollEl.scrollTop>2)return; startY=y; pulling=true; dist=0; ptrEl.classList.add('show'); }    function move(y,ev){
      if(!pulling||busy)return;
      var d=y-startY;
      if(d<=0){ // user scrolling up/normal — cancel
        if(dist===0){pulling=false;ptrEl.classList.remove('show');setH(0);}
        return;
      }
      if(scrollEl.scrollTop>2){pulling=false;setH(0);ptrEl.classList.remove('show');return;}
      dist=Math.min(MAX, d*0.5); // rubber-band damping
      scrollEl.classList.add('ptr-pulling');
      setH(dist);
      ptrEl.querySelector('.ptr-spin').style.transform='rotate('+(dist/MAX*270)+'deg)';
      if(ev&&ev.cancelable)ev.preventDefault();
    }
    function end(){
      if(!pulling||busy){return;}
      pulling=false; scrollEl.classList.remove('ptr-pulling');
      if(dist>=THRESH){
        busy=true; setH(THRESH); ptrEl.classList.add('spinning');
        setTimeout(function(){
          try{onRefresh&&onRefresh();}catch(e){}
          ptrEl.classList.remove('spinning');
          ptrEl.style.transition='height .26s ease';
          setH(0);
          setTimeout(function(){ptrEl.style.transition='';ptrEl.classList.remove('show');busy=false;},300);
        },820);
      }else{
        ptrEl.style.transition='height .2s ease'; setH(0);
        setTimeout(function(){ptrEl.style.transition='';ptrEl.classList.remove('show');},220);
      }
      dist=0;
    }
    // touch
    scrollEl.addEventListener('touchstart',function(e){begin(e.touches[0].clientY);},{passive:true});
    scrollEl.addEventListener('touchmove',function(e){move(e.touches[0].clientY,e);},{passive:false});
    scrollEl.addEventListener('touchend',end);
    scrollEl.addEventListener('touchcancel',end);
    // mouse (desktop preview)
    var mdown=false;
    scrollEl.addEventListener('mousedown',function(e){if(scrollEl.scrollTop>2)return;mdown=true;begin(e.clientY);});
    window.addEventListener('mousemove',function(e){if(mdown)move(e.clientY,e);});
    window.addEventListener('mouseup',function(){if(mdown){mdown=false;end();}});
  }
  function flashRefresh(){ /* tiny visual nudge that content reloaded */ }
  attachPTR(document.getElementById('posts-scroll'), document.getElementById('posts-ptr'), function(){renderPosts();});
  attachPTR(document.getElementById('feed'), document.getElementById('feed-ptr'), function(){renderFeed(feedKind);});

  function setAppHeight(){document.documentElement.style.setProperty('--app-height',window.innerHeight+'px');}
  setAppHeight();
  window.addEventListener('resize',setAppHeight);
  window.addEventListener('orientationchange',function(){setTimeout(setAppHeight,200);});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',setAppHeight);
  updateBellDot();
  window.addEventListener('load',function(){moveInd();moveSeg();setBal();kickVideos();updateBellDot();setAppHeight();syncFilterLabels();renderFilterSheets();syncPostsLabels();renderPostSheets();});setTimeout(function(){moveInd();moveSeg();setBal();setAppHeight();},60);
})();
