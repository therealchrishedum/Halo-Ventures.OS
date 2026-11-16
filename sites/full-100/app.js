/* Halo Ventures · shared script. The page is complete without it. */
(function(){
'use strict';
var D=document, root=D.documentElement;
function $(s,c){return (c||D).querySelector(s);}
function $$(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s));}
var EMAIL='chris@halovpartners.com';
var RM=false;
try{ RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
var T0=Date.now();
function revealAll(){
  root.classList.remove('anim');
  try{ $$('[data-rv],[data-lines],.sec,.hero').forEach(function(el){ el.classList.add('in','ready'); }); }catch(e){}
}

/* ========== copy (email + notes) with toast ========== */
(function(){
  try{
    var status=$('#copyStatus'), addr=$('#addr');
    var toast=D.createElement('div'); toast.className='toast'; toast.setAttribute('aria-hidden','true');
    toast.innerHTML='<span class="sq"></span><span></span>'; D.body.appendChild(toast);
    function showToast(t){ toast.lastChild.textContent=t; toast.classList.add('on'); clearTimeout(toast._t); toast._t=setTimeout(function(){ toast.classList.remove('on'); },2400); }
    function fallbackCopy(txt){
      var ok=false;
      try{
        var ta=D.createElement('textarea'); ta.value=txt; ta.setAttribute('readonly','');
        ta.style.position='fixed'; ta.style.top='0'; ta.style.left='0'; ta.style.width='1px'; ta.style.height='1px'; ta.style.opacity='0';
        D.body.appendChild(ta); ta.select(); try{ ta.setSelectionRange(0,txt.length); }catch(e){}
        ok=D.execCommand('copy'); D.body.removeChild(ta);
      }catch(e){ ok=false; }
      return ok;
    }
    function selectEl(el){ try{ var r=D.createRange(); r.selectNodeContents(el); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r); }catch(e){} }
    function textFor(btn){
      if(btn.getAttribute('data-copy')==='note'){ var n=D.getElementById(btn.getAttribute('data-src')); return n?n.textContent.replace(/’/g,"'"):EMAIL; }
      return EMAIL;
    }
    function result(btn,ok){
      clearTimeout(btn._t);
      var isNote=btn.getAttribute('data-copy')==='note';
      if(ok){
        btn.classList.add('ok');
        if(status) status.textContent=isNote?'Copied. The note is on your clipboard. Send it to '+EMAIL+'.':'Copied. '+EMAIL+' is on your clipboard.';
        showToast(isNote?'Copied ✓ The note':'Copied ✓ '+EMAIL);
      } else {
        if(status) status.textContent=isNote?'The copy did not work. We selected the note for you.':'The copy did not work. We selected the address for you: '+EMAIL+'.';
        var el=isNote?D.getElementById(btn.getAttribute('data-src')):(btn.querySelector('.pt .a')||addr);
        if(el) selectEl(el);
      }
      btn._t=setTimeout(function(){ btn.classList.remove('ok'); },2400);
    }
    function go(btn){
      var txt=textFor(btn);
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(txt).then(function(){ result(btn,true); },function(){ result(btn,fallbackCopy(txt)); });
        } else result(btn,fallbackCopy(txt));
      }catch(e){ result(btn,fallbackCopy(txt)); }
    }
    $$('[data-copy]').forEach(function(b){ b.addEventListener('click',function(){ go(b); }); });
  }catch(e){}
})();

/* ========== questions: open without JS; with JS, keep the first one open ========== */
(function(){
  try{ $$('.faq details').forEach(function(d,i){ if(i>0) d.removeAttribute('open'); }); }catch(e){}
})();

/* ========== money counter + cube ========== */
(function(){
  try{
    var sec=$('#runway'); if(!sec) return;
    var RATE=147.2e9/(5*365.25*86400); /* about $933 a second */
    var el=$('#rv'), bx=$('#rvBoxes'), bills=$$('#runway .bill');
    var shown=false, startShow=0, lastStacks=-1, lastTxt='';
    function fmt(v){ var s=String(Math.floor(v)); return '$'+s.replace(/\B(?=(\d{3})+(?!\d))/g,','); }
    function draw(v){
      var t=fmt(v); if(t!==lastTxt){ el.textContent=t; lastTxt=t; }
      var n=Math.floor(v/1000)%100, boxes=Math.floor(v/100000);
      if(n!==lastStacks){ for(var i=0;i<bills.length;i++){ bills[i].classList.toggle('on',i<n); } lastStacks=n; bx.textContent=String(boxes); }
    }
    function value(){ return (Date.now()-T0)/1000*RATE; }
    el.classList.remove('nojs'); el.textContent='$0'; el.removeAttribute('aria-label');
    for(var i=0;i<bills.length;i++) bills[i].classList.remove('on');
    function visible(){ var r=sec.getBoundingClientRect(); return r.top<window.innerHeight&&r.bottom>0; }
    if(RM||!window.requestAnimationFrame){
      setInterval(function(){ try{ draw(value()); }catch(e){} },1000); draw(value());
      return;
    }
    function frame(){
      try{
        if(visible()){
          if(!shown){ shown=true; startShow=Date.now(); }
          var k=Math.min(1,(Date.now()-startShow)/1400), e=1-Math.pow(1-k,3);
          draw(value()*e);
        }
      }catch(e){}
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }catch(e){ try{ var r=$('#rv'); r.className='rv nojs'; r.textContent='≈ $933 a second'; $$('#runway .bill').forEach(function(b,i){ b.classList.toggle('on',i<40); }); }catch(e2){} }
})();

try{
/* ========== reveals ========== */
var revs=$$('[data-rv],[data-lines],.sec');
function inView(el,f){ var r=el.getBoundingClientRect(); return r.top<window.innerHeight*(f||.92)&&r.bottom>0; }
function check(){
  for(var i=0;i<revs.length;i++){ var el=revs[i]; if(!el.classList.contains('in')&&inView(el)) el.classList.add('in'); }
}

/* ========== where am I (phone header) ========== */
var loc=$('#loc'), prog=$('#prog'), located=$$('[data-loc]'), lastLoc='';
function navState(){
  if(!loc||!located.length) return;
  var mid=window.innerHeight*.4, c=located[0];
  for(var i=0;i<located.length;i++){ if(located[i].getBoundingClientRect().top<=mid) c=located[i]; }
  var txt=c.getAttribute('data-loc');
  if(txt!==lastLoc){
    lastLoc=txt; var p=txt.split('|');
    loc.innerHTML='<span class="n"></span><span></span>';
    loc.firstChild.textContent=p.length>1?p[0]+' · ':''; loc.lastChild.textContent=p[p.length-1];
  }
  var max=(D.documentElement.scrollHeight-window.innerHeight)||1;
  prog.style.transform='scaleX('+Math.max(0,Math.min(1,window.pageYOffset/max)).toFixed(4)+')';
}
var ticking=false;
function onScroll(){ if(ticking) return; ticking=true; requestAnimationFrame(function(){ ticking=false; try{ navState(); check(); }catch(e){ revealAll(); } }); }

/* ========== init ========== */
var hero=$('.hero,.phero');
if(!RM){
  revs.forEach(function(el){ if(inView(el,1)) el.classList.add('in'); });
  root.classList.add('anim');
  if(hero){
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ hero.classList.add('ready'); }); });
    setTimeout(function(){ hero.classList.add('ready'); },700);
  }
}
navState(); check();
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',function(){ try{ onScroll(); }catch(e){} });
setTimeout(function(){ try{ check(); }catch(e){ revealAll(); } },1500);
}catch(err){
  revealAll();
  if(window.console) console.error(err);
}
})();
