/* GOR MARKETING - Accessibility v4 - Enhanced Left Stack & Perfect Controls */
(function(){
  function init(){
    var S = { fontSize: 0, contrast: false, invert: false, grayscale: false, dyslexia: false, links: false, animations: false, open: false };
    try { Object.assign(S, JSON.parse(localStorage.getItem('gor-a11y') || '{}')); } catch(e){}
    
    var css = document.getElementById('ga-css') || document.createElement('style');
    css.id = 'ga-css';
    if (!document.head.contains(css)) document.head.appendChild(css);

    function apply(){
      var c = '';
      if (S.fontSize) c += 'html { font-size: ' + (100 + S.fontSize * 10) + '% !important; } ';
      if (S.contrast) c += 'body, div, section, p, h1, h2, h3, h4, h5, span, li, article { background: #000000 !important; color: #ffffff !important; } a { color: #ffff00 !important; } ';
      if (S.invert) c += 'html { filter: invert(1) hue-rotate(180deg) !important; background: #000 !important; } img, video, iframe { filter: invert(1) hue-rotate(180deg) !important; } ';
      if (S.grayscale) c += 'html { filter: grayscale(1) !important; } ';
      if (S.dyslexia) c += '* { font-family: Arial, sans-serif !important; letter-spacing: .05em !important; line-height: 1.8 !important; } ';
      if (S.links) c += 'a { text-decoration: underline !important; text-decoration-thickness: 2px !important; text-underline-offset: 4px !important; } ';
      if (S.animations) c += '*, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; } ';
      css.textContent = c;
      try { localStorage.setItem('gor-a11y', JSON.stringify(S)); } catch(e){}
    }

    function mkBtn(txt, cb, style, id){
      var b = document.createElement('button');
      b.textContent = txt;
      if (id) b.id = id;
      b.onclick = function(e){ e.stopPropagation(); cb(e); };
      b.style.cssText = style || '';
      return b;
    }

    function mkToggle(key, txt){
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:8px;cursor:pointer;user-select:none;margin-bottom:6px;';
      var lbl = document.createElement('span');
      lbl.textContent = txt;
      lbl.style.cssText = 'font-size:13px;font-weight:600;color:#e2e8f0;';
      var sw = document.createElement('button');
      sw.setAttribute('type', 'button');
      sw.style.cssText = 'width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;transition:background .2s;font-size:0;position:relative;';
      
      function refresh(){
        sw.style.background = S[key] ? '#0077ff' : 'rgba(255,255,255,.25)';
      }
      refresh();

      function toggleAction(e){
        if (e) e.stopPropagation();
        S[key] = !S[key];
        apply();
        refresh();
      }

      wrap.onclick = toggleAction;
      sw.onclick = toggleAction;
      wrap.appendChild(lbl);
      wrap.appendChild(sw);
      return wrap;
    }

    var panel = null;
    var ov = null;

    function buildPanel(){
      var p = document.createElement('div');
      p.id = 'ga-panel';
      p.setAttribute('role', 'dialog');
      p.setAttribute('aria-modal', 'true');
      p.setAttribute('dir', 'rtl');
      p.style.cssText = 'position:fixed;top:0;left:0;width:300px;max-width:85vw;height:100vh;background:#0b0f19;color:#e8e8f0;z-index:1000000;overflow-y:auto;transform:translateX(-110%);transition:transform .3s cubic-bezier(0.16,1,0.3,1);font-family:Arial,sans-serif;font-size:14px;box-shadow:5px 0 30px rgba(0,0,0,.8);border-right:1px solid rgba(255,255,255,.1);';
      
      // header
      var hdr = document.createElement('div');
      hdr.style.cssText = 'background:linear-gradient(135deg,#0056b3,#0077ff);padding:14px 18px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:2;';
      var htxt = document.createElement('strong');
      htxt.style.cssText = 'font-size:16px;color:#fff;font-weight:700;display:flex;align-items:center;gap:8px;';
      htxt.innerHTML = '♿ הגדרות נגישות';
      
      var cls = document.createElement('button');
      cls.id = 'ga-close';
      cls.setAttribute('aria-label', 'סגור תפריט נגישות');
      cls.innerHTML = '✕';
      cls.style.cssText = 'background:rgba(255,255,255,.15);border:none;color:#fff;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;';
      cls.onclick = function(e){
        e.preventDefault();
        e.stopPropagation();
        close();
      };
      cls.onmouseenter = function(){ cls.style.background = 'rgba(255,255,255,.3)'; };
      cls.onmouseleave = function(){ cls.style.background = 'rgba(255,255,255,.15)'; };

      hdr.appendChild(htxt);
      hdr.appendChild(cls);
      p.appendChild(hdr);
      
      // body
      var body = document.createElement('div');
      body.style.padding = '16px';
      
      // font size
      var fl = document.createElement('p');
      fl.style.cssText = 'font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px;font-weight:700;';
      fl.textContent = 'גודל טקסט';
      var fr = document.createElement('div');
      fr.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:16px;';
      var fd = mkBtn('A−', function(){ if (S.fontSize > -2) { S.fontSize--; apply(); fp.textContent = (100 + S.fontSize * 10) + '%'; } },
        'flex:1;height:40px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#fff;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;');
      var fp = document.createElement('span');
      fp.style.cssText = 'min-width:48px;text-align:center;font-weight:700;color:#00ff88;font-size:14px;';
      fp.textContent = (100 + S.fontSize * 10) + '%';
      var fu = mkBtn('A+', function(){ if (S.fontSize < 4) { S.fontSize++; apply(); fp.textContent = (100 + S.fontSize * 10) + '%'; } },
        'flex:1;height:40px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#fff;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;');
      fr.appendChild(fd);
      fr.appendChild(fp);
      fr.appendChild(fu);
      body.appendChild(fl);
      body.appendChild(fr);
      
      // toggles
      var tl = document.createElement('p');
      tl.style.cssText = 'font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px;font-weight:700;';
      tl.textContent = 'התאמות תצוגה וצבעים';
      body.appendChild(tl);

      var tw = document.createElement('div');
      tw.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-bottom:16px;';
      tw.appendChild(mkToggle('contrast', '🌓 ניגודיות גבוהה'));
      tw.appendChild(mkToggle('invert', '🔄 ניגודיות הפוכה (אינוורסיה)'));
      tw.appendChild(mkToggle('grayscale', '🔲 גווני אפור'));
      tw.appendChild(mkToggle('dyslexia', '📖 גופן קריא לדיסלקציה'));
      tw.appendChild(mkToggle('links', '🔗 הדגשת קישורים'));
      tw.appendChild(mkToggle('animations', '⏸ עצירת אנימציות'));
      body.appendChild(tw);
      
      // reset
      var rst = mkBtn('↺ איפוס כל ההגדרות', function(){
        Object.assign(S, { fontSize: 0, contrast: false, invert: false, grayscale: false, dyslexia: false, links: false, animations: false });
        apply();
        fp.textContent = '100%';
        var toggles = tw.querySelectorAll('div');
        toggles.forEach(function(t){
          var btn = t.querySelector('button');
          if (btn) btn.style.background = 'rgba(255,255,255,.25)';
        });
      }, 'width:100%;height:42px;background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.4);color:#fca5a5;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;margin-bottom:16px;');
      body.appendChild(rst);
      
      // declaration
      var decl = document.createElement('div');
      decl.style.cssText = 'border-top:1px solid rgba(255,255,255,.1);padding-top:12px;font-size:12px;color:#94a3b8;line-height:1.7;';
      decl.innerHTML = '<p style="font-weight:700;color:#cbd5e1;margin:0 0 4px;">הצהרת נגישות</p><p style="margin:0 0 4px;">אתר זה פועל לעמידה בתקן ת"י 5568 / WCAG 2.1 AA.</p><p style="margin:0;">רכז נגישות: איגור גורלקין | <a href="tel:052-515-5598" style="color:#00ff88;text-decoration:none;">052-515-5598</a></p>';
      body.appendChild(decl);
      p.appendChild(body);
      document.body.appendChild(p);
      return p;
    }

    // overlay
    ov = document.getElementById('ga-overlay') || document.createElement('div');
    ov.id = 'ga-overlay';
    ov.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(3px);z-index:999998;';
    if (!document.body.contains(ov)) document.body.appendChild(ov);

    // remove old fab
    document.querySelectorAll('.a11y-btn,#gor-a11y-fab').forEach(function(e){ e.remove(); });

    // FAB (Left Stack - directly above WhatsApp)
    var fab = document.createElement('button');
    fab.id = 'gor-a11y-fab';
    fab.setAttribute('aria-label', 'פתח הגדרות נגישות');
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.setAttribute('aria-expanded', 'false');
    fab.style.cssText='position:fixed;bottom:24px;left:24px;right:auto;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#0056b3,#0077ff);border:2px solid #ffffff;color:#fff;font-size:26px;cursor:pointer;z-index:999999;box-shadow:0 8px 25px rgba(0,86,179,.6),0 0 15px rgba(0,191,255,.4);display:flex;align-items:center;justify-content:center;transition:transform .25s ease,box-shadow .25s ease;';
    fab.textContent = '♿';
    document.body.appendChild(fab);

    function openPanel(){
      if (!panel) panel = buildPanel();
      S.open = true;
      panel.style.transform = 'translateX(0)';
      ov.style.display = 'block';
      fab.setAttribute('aria-expanded', 'true');
      setTimeout(function(){
        var c = document.getElementById('ga-close');
        if (c) c.focus();
      }, 100);
    }

    function close(){
      if (panel) panel.style.transform = 'translateX(-110%)';
      if (ov) ov.style.display = 'none';
      S.open = false;
      fab.setAttribute('aria-expanded', 'false');
      fab.focus();
    }

    function toggle(e){
      if (e) e.stopPropagation();
      if (S.open) close(); else openPanel();
    }

    fab.onclick = toggle;
    ov.onclick = close;
    window.openA11yPanel = toggle;

    document.addEventListener('keydown', function(e){
      if (e.altKey && e.key === '1') { e.preventDefault(); toggle(); }
      if (e.key === 'Escape' && S.open) close();
    });

    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
