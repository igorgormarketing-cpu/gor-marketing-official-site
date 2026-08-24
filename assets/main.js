(function(){if(!localStorage.getItem('gor-theme-user-set')){localStorage.setItem('gor-theme','dark');document.documentElement.setAttribute('data-theme','dark');}})();
'use strict';const navbar=document.querySelector('.nav');const burgerBtn=document.querySelector('.hamburger');const mobileMenu=document.getElementById('mm');function initNavbar(){if(!navbar)return;const onScroll=()=>{navbar.classList.toggle('scrolled',window.scrollY>40)};window.addEventListener('scroll',onScroll,{passive:true});onScroll();if(burgerBtn&&mobileMenu){burgerBtn.addEventListener('click',()=>{const isOpen=mobileMenu.classList.toggle('open');burgerBtn.setAttribute('aria-expanded',isOpen);document.body.style.overflow=isOpen?'hidden':''});mobileMenu.querySelectorAll('.mobile-menu-link').forEach(link=>{link.addEventListener('click',()=>{mobileMenu.classList.remove('open');burgerBtn.setAttribute('aria-expanded','false');document.body.style.overflow=''})});document.addEventListener('click',e=>{if(mobileMenu.classList.contains('open')&&!mobileMenu.contains(e.target)&&!burgerBtn.contains(e.target)){mobileMenu.classList.remove('open');burgerBtn.setAttribute('aria-expanded','false');document.body.style.overflow=''}})}}function closeMobileMenu(){if(mobileMenu)mobileMenu.classList.remove('open');if(burgerBtn)burgerBtn.setAttribute('aria-expanded','false');document.body.style.overflow=''}function initSmoothScroll(){document.querySelectorAll('a[href^="#"]').forEach(anchor=>{const id=anchor.getAttribute('href');if(id==='#')return;const target=document.querySelector(id);if(!target)return;anchor.addEventListener('click',e=>{e.preventDefault();closeMobileMenu();window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-72,behavior:'smooth'})})})}function initActiveNav(){const sections=document.querySelectorAll('section[id]');const navLinks=document.querySelectorAll('.navbar__link[href^="#"]');if(!sections.length||!navLinks.length)return;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>{link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id)})}})},{threshold:0.4});sections.forEach(s=>observer.observe(s))}function initContactForm(){const form=document.getElementById('contact-form');if(!form)return;form.addEventListener('submit',async e=>{e.preventDefault();const btn=form.querySelector('[type="submit"]');const required=form.querySelectorAll('[required]');let valid=true;required.forEach(field=>{const isEmpty=!field.value.trim();field.classList.toggle('error',isEmpty);if(isEmpty)valid=false});if(!valid){btn.disabled=false;btn.textContent='נא מלא שדות חובה';setTimeout(()=>{btn.textContent='שלח הודעה ←'},2000);return}btn.disabled=true;btn.textContent='שולח...';const data=Object.fromEntries(new FormData(form));const msg=`שם: ${data.name}\nאימייל: ${data.email}\nטלפון: ${data.phone||'-'}\nשירות: ${data.service||'-'}\nהודעה: ${data.message}`;try{window.open('https://wa.me/972525155598?text='+encodeURIComponent(msg))}catch(err){}form.innerHTML='<div style="font-size:3rem;margin-bottom:1rem">✅</div><h3 style="color:var(--clr-text)">תודה! נחזור אליך בקרוב</h3><p style="color:var(--text2);margin-top:.5rem">בדרך כלל עונים תוך שעה</p>'})}function initServiceCards(){document.querySelectorAll('.service-card[data-href]').forEach(card=>{card.addEventListener('click',()=>{window.location.href=card.dataset.href});card.style.cursor='pointer'})}function initCounters(){const counters=document.querySelectorAll('[data-count]');if(!counters.length)return;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){animateCounter(entry.target);observer.unobserve(entry.target)}})},{threshold:0.5});counters.forEach(c=>observer.observe(c))}function animateCounter(el){const target=parseInt(el.dataset.count);const suffix=el.dataset.suffix||'';const duration=1500;const start=Date.now();const tick=()=>{const elapsed=Date.now()-start;const progress=Math.min(elapsed/duration,1);const ease=1-Math.pow(1-progress,3);el.textContent=Math.round(ease*target)+suffix;if(progress<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}function initScrollReveal(){const elements=document.querySelectorAll('.reveal');if(!elements.length)return;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){const siblings=entry.target.closest('[data-stagger]');const delay=Array.from(siblings?.querySelectorAll?.('.reveal')??[]).indexOf(entry.target)*80;setTimeout(()=>entry.target.classList.add('visible'),delay);observer.unobserve(entry.target)}})},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});elements.forEach(el=>observer.observe(el))}function initLangSwitcher(){const LANGS={he:{dir:'rtl'},en:{dir:'ltr'},ru:{dir:'ltr'},ar:{dir:'rtl'}};document.querySelectorAll('[data-lang]').forEach(btn=>{btn.addEventListener('click',()=>{const lang=btn.dataset.lang;localStorage.setItem('gor-lang',lang);document.documentElement.lang=lang;document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang))})});const saved='he';document.documentElement.lang=saved;document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===saved))}
function initDarkMode(){
  const btn=document.querySelector('.nav-status');
  if(!btn)return;
  const dot=btn.querySelector('.nav-status-dot');
  const label=btn.querySelector('span:last-child');
  const saved=localStorage.getItem('gor-theme')||'dark';
  const apply=(t)=>{
    document.documentElement.setAttribute('data-theme',t);
    if(label)label.textContent=t==='dark'?'מצב לילה':'מצב יום';
    if(dot)dot.style.background=t==='dark'?'#7c3aed':'#22c55e';
    localStorage.setItem('gor-theme',t);localStorage.setItem('gor-theme-user-set','1');
  };
  apply(saved);
  btn.style.cursor='pointer';
  btn.onclick=()=>{
    const cur=document.documentElement.getAttribute('data-theme')||'light';
    apply(cur==='dark'?'light':'dark');
  };
}
document.addEventListener('DOMContentLoaded',function(){initDarkMode();initScrollReveal();initSmoothScroll();initActiveNav();initContactForm();initServiceCards();initCounters();initLangSwitcher()});
// ── Mobile reveal fix: show all cards immediately on touch devices ──
(function(){
  if(!window.matchMedia('(pointer:coarse)').matches) return;
  function showAll(){
    document.querySelectorAll('.reveal').forEach(function(el){
      el.classList.add('visible');
      el.style.opacity='1';
      el.style.transform='none';
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', showAll);
  } else {
    showAll();
  }
  // Also run after any scroll (catches lazy-loaded items)
  window.addEventListener('scroll', showAll, {once:true, passive:true});
})();