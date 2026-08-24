/* GOR MARKETING i18n v1 */
var DICT={he:{title:'GOR MARKETING — שיווק דיגיטלי שעובד בשבילך',dir:'rtl',lang:'he','hero-line1':'שיווק דיגיטלי','hero-line2':'שעובד בשבילך.','hero-sub':'אנחנו לא סוכנות שיווק — אנחנו עובד החברה הנוסף שלך.','hero-desc':'שיווק 360° שמוריד עומס ומייצר תוצאות מדידות.','hero-talk':'בואו נדבר ←','hero-design':'✦ יותר עיצוב','hero-content':'✚ יותר תוכן','stat-years':'שנות ניסיון','stat-fields':'תחומי שיווק','stat-full':'פתרון מלא','stat-proven':'מדיד ומוכח','about-lbl':'// אודות','about-h2':'מי עומד מאחורי GOR?','services-lbl':'// שירותים שלנו','services-h2':'מה אנחנו עושים בשבילך','svc-web':'בניית אתרים','svc-seo':'קידום בגוגל','svc-social':'רשתות חברתיות','svc-ai':'AI Marketing','svc-prompt':'Prompt Engineering','svc-crm':'מכירות ו-CRM','reviews-lbl':'// ביקורות','reviews-h2':'אומרים עלינו','articles-lbl':'// מאמרים','articles-h2':'ידע מקצועי','contact-lbl':'// דברו איתנו','contact-h2':'צור קשר','btn-meeting':'קבע פגישה 📅','topbar-cta':'קבע גם אתה →'},
en:{title:'GOR MARKETING — Digital Marketing That Works for You',dir:'ltr',lang:'en','hero-line1':'Digital Marketing','hero-line2':'That Works for You.','hero-sub':"We're not a marketing agency — we're your company's extra team member.",'hero-desc':'360° marketing that reduces workload and delivers measurable results.','hero-talk':"Let's Talk →",'hero-design':'✦ Better Design','hero-content':'✚ More Content','stat-years':'Years of Experience','stat-fields':'Marketing Channels','stat-full':'Full Solution','stat-proven':'Measured & Proven','about-lbl':'// About','about-h2':'Who is behind GOR?','services-lbl':'// Our Services','services-h2':'What We Do for You','svc-web':'Website Development','svc-seo':'Google SEO','svc-social':'Social Media','svc-ai':'AI Marketing','svc-prompt':'Prompt Engineering','svc-crm':'Sales & CRM','reviews-lbl':'// Reviews','reviews-h2':'What They Say About Us','articles-lbl':'// Articles','articles-h2':'Professional Knowledge','contact-lbl':'// Contact Us','contact-h2':'Get in Touch','btn-meeting':'Book Meeting 📅','topbar-cta':'Book yours →'},
ru:{title:'GOR MARKETING — Цифровой Маркетинг, Который Работает',dir:'rtl',lang:'ru','hero-line1':'Цифровой маркетинг,','hero-line2':'который работает для вас.','hero-sub':'Мы не маркетинговое агентство — мы дополнительный сотрудник вашей компании.','hero-desc':'Маркетинг 360°, который снижает нагрузку и даёт измеримые результаты.','hero-talk':'Поговорим →','hero-design':'✦ Лучший дизайн','hero-content':'✚ Больше контента','stat-years':'лет опыта','stat-fields':'направлений','stat-full':'Полное решение','stat-proven':'Измеримо и доказано','about-lbl':'// О нас','about-h2':'Кто стоит за GOR?','services-lbl':'// Наши услуги','services-h2':'Что мы делаем для вас','svc-web':'Разработка сайтов','svc-seo':'Продвижение в Google','svc-social':'Социальные сети','svc-ai':'AI Маркетинг','svc-prompt':'Prompt Engineering','svc-crm':'Продажи и CRM','reviews-lbl':'// Отзывы','reviews-h2':'Что говорят о нас','articles-lbl':'// Статьи','articles-h2':'Профессиональные знания','contact-lbl':'// Свяжитесь','contact-h2':'Связаться','btn-meeting':'Записаться 📅','topbar-cta':'Записаться →'}};

function setLang(lang){
  var d=DICT[lang];if(!d)return;
  localStorage.setItem('gor-lang',lang);
  document.documentElement.setAttribute('dir',d.dir);
  document.documentElement.setAttribute('lang',d.lang);
  document.title=d.title;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k=el.getAttribute('data-i18n');
    if(d[k]!==undefined)el.textContent=d[k];
  });
  var tba=document.querySelector('#gor-topbar a');
  if(tba)tba.textContent=d['topbar-cta'];
  var MAP={he:'עב',en:'EN',ru:'РУ'};
  document.querySelectorAll('.flag-btn,.mobile-lang-switcher button').forEach(function(b){
    b.classList.toggle('active',b.textContent.trim()===MAP[lang]);
  });
}
window.setLang=setLang;
(function(){
  var l=localStorage.getItem('gor-lang')||'he';
  if(l!=='he'){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setLang(l);});}else{setLang(l);}}
})();