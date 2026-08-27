/* GOR MARKETING - Accessibility v3 - with DOM guard */
(function(){
  function init(){
    
var S={fontSize:0,contrast:false,grayscale:false,dyslexia:false,links:false,animations:false};
try{Object.assign(S,JSON.parse(localStorage.getItem('gor-a11y')||'{}'));}catch(e){}
var css=document.createElement('style');css.id='ga-css';document.head.appendChild(css);
function apply(){
  var c='';
  if(S.fontSize)c+='html{font-size:'+(100+S.fontSize*10)+'%!important}';
  if(S.contrast)c+='body,div,section,p,h1,h2,h3,h4,h5,span,li{background:#000!important;color:#fff!important}a{color:#ff0!important}';
  if(S.grayscale)c+='html{filter:grayscale(1)!important}';
  if(S.dyslexia)c+='*{font-family:Arial,sans-serif!important;letter-spacing:.05em!important;line-height:1.8!important}';
  if(S.links)c+='a{text-decoration:underline!important;text-decoration-thickness:2px!important}';
  if(S.animations)c+='*,*::before,*::after{animation-duration:.001ms!important;transition-duration:.001ms!important}';
  css.textContent=c;
  try{localStorage.setItem('gor-a11y',JSON.stringify(S));}catch(e){}
}
function label(he){return he;}
function mkBtn(txt,cb,style){
  var b=document.createElement('button');
  b.textContent=txt;b.onclick=cb;
  b.style.cssText=style||'';
  return b;
}
function mkToggle(key,txt){
  var wrap=document.createElement('div');
  wrap.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:8px;';
  var lbl=document.createElement('span');lbl.textContent=txt;
  var sw=document.createElement('button');
  sw.style.cssText='width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;transition:background .2s;font-size:0;';
  function refresh(){sw.style.background=S[key]?'#7c3aed':'rgba(255,255,255,.25)';}
  refresh();
  sw.onclick=function(){S[key]=!S[key];apply();refresh();};
  wrap.appendChild(lbl);wrap.appendChild(sw);
  return wrap;
}
function buildPanel(){
  var p=document.createElement('div');
  p.id='ga-panel';
  p.setAttribute('role','dialog');p.setAttribute('aria-modal','true');p.setAttribute('dir','rtl');
  p.style.cssText='position:fixed;top:0;left:0;width:280px;height:100vh;background:#0d0d1f;color:#e8e8f0;z-index:99999;overflow-y:auto;transform:translateX(-110%);transition:transform .3s;font-family:Arial,sans-serif;font-size:14px;box-shadow:4px 0 20px rgba(0,0,0,.6);';
  
  // header
  var hdr=document.createElement('div');
  hdr.style.cssText='background:#7c3aed;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;';
  var htxt=document.createElement('strong');htxt.style.fontSize='15px';htxt.textContent='♿ הגדרות נגישות';
  var cls=mkBtn('✕',close,'background:none;border:none;color:#fff;font-size:22px;cursor:pointer;');
  cls.id='ga-close';
  hdr.appendChild(htxt);hdr.appendChild(cls);p.appendChild(hdr);
  
  // body
  var body=document.createElement('div');body.style.padding='14px';
  
  // font size
  var fl=document.createElement('p');fl.style.cssText='font-size:11px;color:#a0a0c0;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px;font-weight:700;';fl.textContent='גודל טקסט';
  var fr=document.createElement('div');fr.style.cssText='display:flex;gap:8px;align-items:center;margin-bottom:14px;';
  var fd=mkBtn('A−',function(){if(S.fontSize>-2){S.fontSize--;apply();fp.textContent=(100+S.fontSize*10)+'%';}},
    'flex:1;height:40px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#fff;border-radius:8px;font-size:18px;cursor:pointer;');
  var fp=document.createElement('span');fp.style.cssText='min-width:44px;text-align:center;font-weight:700;';fp.textContent=(100+S.fontSize*10)+'%';
  var fu=mkBtn('A+',function(){if(S.fontSize<4){S.fontSize++;apply();fp.textContent=(100+S.fontSize*10)+'%';}},
    'flex:1;height:40px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#fff;border-radius:8px;font-size:18px;cursor:pointer;');
  fr.appendChild(fd);fr.appendChild(fp);fr.appendChild(fu);
  body.appendChild(fl);body.appendChild(fr);
  
  // toggles
  var tl=document.createElement('p');tl.style.cssText='font-size:11px;color:#a0a0c0;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px;font-weight:700;';tl.textContent='תצוגה';
  body.appendChild(tl);
  var tw=document.createElement('div');tw.style.cssText='display:flex;flex-direction:column;gap:6px;margin-bottom:14px;';
  tw.appendChild(mkToggle('contrast','🌓 ניגודיות גבוהה'));
  tw.appendChild(mkToggle('grayscale','🔲 גווני אפור'));
  tw.appendChild(mkToggle('dyslexia','📖 גופן דיסלקציה'));
  tw.appendChild(mkToggle('links','🔗 הדגשת קישורים'));
  tw.appendChild(mkToggle('animations','⏸ עצור אנימציות'));
  body.appendChild(tw);
  
  // reset
  var rst=mkBtn('↺ איפוס',function(){
    Object.assign(S,{fontSize:0,contrast:false,grayscale:false,dyslexia:false,links:false,animations:false});
    apply();fp.textContent='100%';
  },'width:100%;height:40px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:8px;font-size:14px;cursor:pointer;margin-bottom:14px;');
  body.appendChild(rst);
  
  // declaration
  var decl=document.createElement('div');
  decl.style.cssText='border-top:1px solid rgba(255,255,255,.1);padding-top:12px;font-size:12px;color:#7070a0;line-height:1.7;';
  decl.innerHTML='<p style="font-weight:700;color:#a0a0c0;margin:0 0 4px;">הצהרת נגישות</p><p style="margin:0 0 4px;">אתר זה פועל לעמידה בתקן SI 5568 / WCAG 2.1 AA.</p><a href="mailto:igorgor.marketing@gmail.com" style="color:#a78bfa;">אייגור גורלקין</a><br><a href="tel:052-515-5598" style="color:#a78bfa;">052-515-5598</a><p style="margin:8px 0 0;font-size:11px;">מאי 2026 | Alt+1</p>';
  body.appendChild(decl);
  p.appendChild(body);
  document.body.appendChild(p);
  return p;
}

// overlay
var ov=document.createElement('div');
ov.id='ga-overlay';
ov.style.cssText='display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99998;';
document.body.appendChild(ov);

// remove old
document.querySelectorAll('.a11y-btn,#gor-a11y-fab').forEach(function(e){e.remove();});

// FAB
var fab=document.createElement('button');
fab.id='gor-a11y-fab';
fab.setAttribute('aria-label','פתח הגדרות נגישות');
fab.setAttribute('aria-haspopup','dialog');
fab.setAttribute('aria-expanded','false');
fab.style.cssText='position:fixed;bottom:80px;left:16px;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#2563eb);border:none;color:#fff;font-size:20px;cursor:pointer;z-index:9998;box-shadow:0 4px 16px rgba(124,58,237,.5);display:flex;align-items:center;justify-content:center;';
fab.textContent='♿';
document.body.appendChild(fab);

var panel=null;
function open2(){
  if(!panel)panel=buildPanel();
  S.open=true;panel.style.transform='translateX(0)';ov.style.display='block';
  fab.setAttribute('aria-expanded','true');
  setTimeout(function(){var c=document.getElementById('ga-close');if(c)c.focus();},320);
}
function close(){
  if(panel)panel.style.transform='translateX(-110%)';
  ov.style.display='none';
  if(S.open){S.open=false;}
  fab.setAttribute('aria-expanded','false');fab.focus();
}
function toggle(){if(S.open)close();else open2();}
fab.onclick=toggle;
ov.onclick=close;
window.openA11yPanel=toggle;

// patch mob-bottom
document.querySelectorAll('#mob-bottom a').forEach(function(a){
  if(a.textContent.indexOf('♿')!==-1||a.textContent.indexOf('נגישות')!==-1){
    a.removeAttribute('onclick');a.href='#';
    a.addEventListener('click',function(e){e.preventDefault();toggle();});
  }
});

document.addEventListener('keydown',function(e){
  if(e.altKey&&e.key==='1'){e.preventDefault();toggle();}
  if(e.key==='Escape'&&S.open)close();
});

// skip link
if(!document.getElementById('gor-skip')){
  var sk=document.createElement('a');sk.id='gor-skip';sk.href='#main';
  sk.textContent='דלג לתוכן הראשי';
  sk.style.cssText='position:absolute;top:-100px;right:16px;background:#7c3aed;color:#fff;padding:8px 14px;border-radius:0 0 8px 8px;font-weight:700;font-size:14px;z-index:99999;text-decoration:none;transition:top .2s;';
  sk.onfocus=function(){sk.style.top='0';};sk.onblur=function(){sk.style.top='-100px';};
  document.body.prepend(sk);
}

apply();

  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();