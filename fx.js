/* Fifty X — interaction layer */
(function(){
  var doc=document, root=doc.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $$=function(s,c){return Array.prototype.slice.call((c||doc).querySelectorAll(s));};

  /* ---------- scroll progress ---------- */
  var bar=doc.createElement('div'); bar.className='fx-progress'; bar.innerHTML='<b></b>'; doc.body.appendChild(bar);
  var barb=bar.firstChild;
  function prog(){var h=root.scrollHeight-innerHeight; barb.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')';}

  /* ---------- reveal on scroll ---------- */
  var RV=['.head','.hero .wrap>*','.cred .cell','.cap','.ind>*','.svc>*','.tech-grid article','.tech-photo','.quote','.timeline li','.about-grid>*','.namechange','.wallshot','.contact-grid>*','.careers',
    '.capgrid article','.materials>*','.banner','.mosaic>*','.fac-note>div','.qgrid>*','.qlist>div','.turnkey-d>*','.svc-dark li','.ways article','.send',
    '.stats>div','.pillars>*','.platforms>article','.remold-grid>*','.swatches li','.caps>*','.fleet>*','.faq details','.closer .wrap>*',
    '.twoup>*','.families a','.fam>*','.feature','.trio figure','.spear>*','.housings>*','.alloys','.callout','.welds-head>*','.welds figure','.ms-head>*','.parts li',
    '.fx-gallery figure','.fx-diptych figure','.integrated>*','.turnkey>*','.svc-list li'];
  if(!reduce && 'IntersectionObserver' in window){
    root.classList.add('fx');
    var seen=new Set();
    $$(RV.join(',')).forEach(function(el){
      if(seen.has(el)||el.closest('[data-rv]')) return; seen.add(el);
      var p=el.parentElement, i=0;
      if(p){ var sib=$$(':scope>*',p); i=Math.max(0,sib.indexOf(el)); }
      el.setAttribute('data-rv','y');
      el.style.setProperty('--d', Math.min(i,7)*70+'ms');
      var r=el.getBoundingClientRect(); if(r.top<innerHeight*0.92&&r.bottom>0){ el.classList.add('in'); seen.add(el); }
    });
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    $$('[data-rv]:not(.in)').forEach(function(el){io.observe(el);});
  }

  /* ---------- tilt + spotlight ---------- */
  var TILT=['.cap','.ind>*','.svc>*','.tech-grid article','.capgrid article','.qlist>div','.ways article','.fac-note>div','.families a','.roles li','.stats>div','.pillars>article','.platforms>article','.swatches li','.fx-gallery figure','.fx-diptych figure','.mosaic>figure','.trio figure','.welds figure','.housings>figure','.hero-photo','.feature','.svc-dark li','.spec>div','.callout','.send','.alloys'];
  if(fine && !reduce){
    $$(TILT.join(',')).forEach(function(el){
      if(el.closest('.fx-tilt')&&el.closest('.fx-tilt')!==el) return;
      el.classList.add('fx-tilt');
      if(el.closest('.light')) el.classList.add('fx-light');
      var max=el.matches('.fx-gallery figure,.mosaic>figure,.trio figure,.hero-photo,.fx-diptych figure,.feature')?4:7;
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
        el.classList.add('on');
        el.style.setProperty('--mx',(x*100).toFixed(1)+'%'); el.style.setProperty('--my',(y*100).toFixed(1)+'%');
        el.style.transform='perspective(900px) rotateX('+((.5-y)*max).toFixed(2)+'deg) rotateY('+((x-.5)*max).toFixed(2)+'deg) translateZ(0)';
      });
      el.addEventListener('pointerleave',function(){el.classList.remove('on'); el.style.transform='';});
    });
  }

  /* ---------- magnetic buttons ---------- */
  if(fine && !reduce){
    $$('.btn,.hire-pill,.links .cta').forEach(function(b){
      b.classList.add('fx-mag');
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect(); b.classList.add('on'); b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px)';});
      b.addEventListener('pointerleave',function(){b.classList.remove('on'); b.style.transform='';});
    });
  }

  /* ---------- hero mark: plates track the cursor ---------- */
  var hm=doc.querySelector('.hero-mark');
  if(hm && fine && !reduce){
    var plates=$$('.plate',hm), hero=hm.closest('.hero')||hm;
    hero.addEventListener('pointermove',function(e){
      var r=hero.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      hm.classList.add('live');
      plates.forEach(function(p,i){var k=(i-3.5)/3.5; p.style.transform='translate('+(x*k*22).toFixed(1)+'px,'+(y*10*k).toFixed(1)+'px)';});
    });
    hero.addEventListener('pointerleave',function(){hm.classList.remove('live'); plates.forEach(function(p){p.style.transform='';});});
  }

  /* ---------- ghost words drift ---------- */
  var ghosts=$$('.ghost');
  function drift(){ghosts.forEach(function(g){var r=g.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight) return; var t=(r.top+r.height/2)/innerHeight; g.style.transform='translate3d('+((.5-t)*90).toFixed(1)+'px,0,0)';});}

  /* ---------- hero photo parallax ---------- */
  var hp=doc.querySelector('.hero-photo img, .mwd-hero-bg img, .hero-bg img');
  function para(){ if(!hp) return; var r=hp.parentElement.getBoundingClientRect(); if(r.bottom<0) return; hp.style.transform='translate3d(0,'+(Math.max(-r.top,0)*.12).toFixed(1)+'px,0) scale(1.06)'; }

  /* ---------- stat tick-up ---------- */
  if(!reduce && 'IntersectionObserver' in window){
    $$('.stats>div>b').forEach(function(b){
      var m=b.textContent.match(/^(\d+(?:\.\d+)?)(.*)$/); if(!m) return;
      var end=parseFloat(m[1]), dec=(m[1].split('.')[1]||'').length, suf=m[2]; b.classList.add('fx-count'); b.textContent='0'+(dec?'.'+'0'.repeat(dec):'')+suf;
      var o=new IntersectionObserver(function(es){ if(!es[0].isIntersecting) return; o.disconnect(); var t0=performance.now();
        (function tick(now){var p=Math.min(1,(now-t0)/1100); var v=end*(1-Math.pow(1-p,3)); b.textContent=v.toFixed(dec)+suf; if(p<1) requestAnimationFrame(tick);})(t0);
      },{threshold:.6}); o.observe(b);
    });
  }

  /* ---------- lightbox ---------- */
  var lb=doc.createElement('figure'); lb.className='fx-lbox'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
  lb.innerHTML='<button type="button" aria-label="Close">Close ✕</button><img alt=""><figcaption></figcaption>'; doc.body.appendChild(lb);
  var lbi=lb.querySelector('img'), lbc=lb.querySelector('figcaption');
  function openLb(img,cap){lbi.src=img.currentSrc||img.src; lbi.alt=img.alt||''; lbc.textContent=cap||img.alt||''; lb.classList.add('open'); doc.body.style.overflow='hidden';}
  function closeLb(){lb.classList.remove('open'); doc.body.style.overflow='';}
  lb.addEventListener('click',closeLb); doc.addEventListener('keydown',function(e){if(e.key==='Escape') closeLb();});
  $$('.mosaic img,.banner img,.trio img,.welds img,.housings img,.feature img,.fx-gallery img,.fx-diptych img,.tech-photo img,.wallshot img,.fx-lb img,.hero-photo img,.spear img,.strip-photo img,.ms-part img').forEach(function(img){
    var fig=img.closest('figure'); var wrap=img.parentElement;
    if(!wrap.classList.contains('fx-img')){ var w=doc.createElement('span'); w.className='fx-img'; img.replaceWith(w); w.appendChild(img); wrap=w; }
    if(!img.closest('.ms-part,.spear')&&!wrap.querySelector('.fx-wm')){ var wm=doc.createElement('span'); wm.className='fx-wm'; wm.setAttribute('aria-hidden','true'); wm.innerHTML='<svg viewBox="0 0 100 100"><use href="#mark-layer"/></svg>FXT'; wrap.appendChild(wm); }
    if(img.closest('.hero-photo,.ms-part,.spear')) return;
    wrap.classList.add('fx-lb');
    wrap.addEventListener('click',function(){var c=fig&&fig.querySelector('figcaption'); openLb(img,c?c.textContent.replace(/\s+/g,' ').trim():'');});
  });

  /* ---------- frame ---------- */
  var ticking=false;
  function onScroll(){ if(ticking) return; ticking=true; requestAnimationFrame(function(){prog(); if(!reduce){drift(); para();} ticking=false;}); }
  addEventListener('scroll',onScroll,{passive:true}); addEventListener('resize',onScroll); onScroll();
})();
