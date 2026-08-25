// ==========================================================================
// GOR MARKETING - OFFICIAL CORE INTERACTIVE SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Animations on Scroll
    const reveals = document.querySelectorAll('.reveal');
    function reveal() {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', reveal);
    reveal(); // Run once on load

    // 2. Reviews Carousel Logic
    const track = document.getElementById('review-carousel');
    if (track && track.children.length > 0) {
        const slides = Array.from(track.children);
        let index = 0;

        function moveCarousel() {
            const slideWidth = slides[0].getBoundingClientRect().width + 16;
            index++;
            let visibleItems = 5;
            if (window.innerWidth <= 768) visibleItems = 1;
            else if (window.innerWidth <= 1200) visibleItems = 3;

            if (index > slides.length - visibleItems) {
                index = 0;
            }
            track.style.transform = `translateX(${index * slideWidth}px)`;
        }
        setInterval(moveCarousel, 4500);
    }

    // 3. Growth & ROI Calculator Logic
    const budgetSlider = document.getElementById('calc-budget');
    const dealSlider = document.getElementById('calc-deal');
    const leadsSlider = document.getElementById('calc-leads');

    const budgetDisplay = document.getElementById('calc-budget-val');
    const dealDisplay = document.getElementById('calc-deal-val');
    const leadsDisplay = document.getElementById('calc-leads-val');

    const resRevenue = document.getElementById('calc-res-revenue');
    const resDeals = document.getElementById('calc-res-deals');
    const resRoas = document.getElementById('calc-res-roas');
    const resTimeSaved = document.getElementById('calc-res-time');
    const calcCtaBtn = document.getElementById('calc-cta-btn');

    function updateCalculator() {
        if (!budgetSlider || !dealSlider || !leadsSlider) return;

        const budget = parseInt(budgetSlider.value, 10);
        const dealVal = parseInt(dealSlider.value, 10);
        const leads = parseInt(leadsSlider.value, 10);

        if (budgetDisplay) budgetDisplay.textContent = '₪' + budget.toLocaleString('he-IL');
        if (dealDisplay) dealDisplay.textContent = '₪' + dealVal.toLocaleString('he-IL');
        if (leadsDisplay) leadsDisplay.textContent = leads.toLocaleString('he-IL') + ' לידים';

        // Conversion benchmark: average 12% lead-to-deal closing rate with GOR qualified funnels
        const conversionRate = 0.12; 
        const estimatedDeals = Math.max(1, Math.round(leads * conversionRate));
        const estimatedRevenue = estimatedDeals * dealVal;
        const roas = budget > 0 ? Math.round((estimatedRevenue / budget) * 100) : 0;
        
        // Time saved calculation with AI agents and automations (approx 1.5 hrs per lead + 2 hrs per deal)
        const timeSavedHours = Math.round(leads * 1.5 + estimatedDeals * 2);

        if (resRevenue) resRevenue.textContent = '₪' + estimatedRevenue.toLocaleString('he-IL');
        if (resDeals) resDeals.textContent = estimatedDeals.toLocaleString('he-IL') + ' עסקאות';
        if (resRoas) resRoas.textContent = roas + '%';
        if (resTimeSaved) resTimeSaved.textContent = timeSavedHours + ' שעות/חודש';

        if (calcCtaBtn) {
            const msg = `היי איגור, ביצעתי תחזית במחשבון ה-ROI באתר GOR MARKETING:\n• תקציב חודשי: ₪${budget.toLocaleString('he-IL')}\n• שווי ממוצע לעסקה: ₪${dealVal.toLocaleString('he-IL')}\n• צפי לידים: ${leads}\n• צפי הכנסות: ₪${estimatedRevenue.toLocaleString('he-IL')} (ROAS ${roas}%)\nאשמח לבנות תוכנית פעולה מותאמת אישית!`;
            calcCtaBtn.href = `https://wa.me/972525155598?text=${encodeURIComponent(msg)}`;
        }
    }

    if (budgetSlider) budgetSlider.addEventListener('input', updateCalculator);
    if (dealSlider) dealSlider.addEventListener('input', updateCalculator);
    if (leadsSlider) leadsSlider.addEventListener('input', updateCalculator);
    updateCalculator(); // Initialize on load

    // 4. Case Studies Category Filter Logic
    const filterBtns = document.querySelectorAll('.case-filter-btn');
    const caseCards = document.querySelectorAll('.case-study-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                caseCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 5. GOR-Bot AI Concierge Widget Logic
    const botTrigger = document.getElementById('gor-bot-trigger');
    const botModal = document.getElementById('gor-bot-modal');
    const botClose = document.getElementById('gor-bot-close');
    const botBody = document.getElementById('gor-bot-body');

    if (botTrigger && botModal) {
        botTrigger.addEventListener('click', () => {
            botModal.classList.toggle('active');
        });
    }

    if (botClose && botModal) {
        botClose.addEventListener('click', () => {
            botModal.classList.remove('active');
        });
    }

    window.askGorBot = function(topic) {
        if (!botBody) return;
        let response = '';
        let whatsappMsg = '';

        if (topic === 'services') {
            response = '<strong>GOR MARKETING</strong> מעניקה מעטפת 360° מלאה: קידום אורגני SEO, פרסום ממומן PPC ב-Google וב-Meta, פיתוח מערכות ואפליקציות SaaS, אוטומציות וסוכני AI, והפקות וידאו.';
            whatsappMsg = 'היי איגור, אשמח לקבל פרטים נוספים על מעטפת שירותי השיווק 360 של GOR MARKETING.';
        } else if (topic === 'pricing') {
            response = 'פגישת אפיון ואסטרטגיה אישית עולה <strong>150 ₪ + מע"מ לשעה</strong>. בנוסף, יש לנו חבילות שיווק ופיתוח מותאמות אישית לגודל העסק והיעדים.';
            whatsappMsg = 'היי איגור, אני מעוניין לתאם פגישת אפיון ואסטרטגיה אישית (150 ש"ח + מע"מ).';
        } else if (topic === 'crm') {
            response = 'מערכת <strong>GOR CRM</strong> היא מערכת ניהול לקוחות, משימות, הצעות מחיר ומשפכי מכירה מתקדמת שמותאמת במיוחד לעסקים ישראליים.';
            whatsappMsg = 'היי איגור, אשמח לראות דמו של מערכת GOR CRM.';
        } else if (topic === 'apps') {
            response = 'אנחנו מפתחים פלטפורמות בהתאמה אישית מלאה: כולל אפליקציית <strong>TWIN PropTech</strong> לניהול בניינים ו-<strong>AM BUILDING ConTech</strong> לחברות בנייה.';
            whatsappMsg = 'היי איגור, מעניין אותי לפתח מערכת / אפליקציה מותאמת אישית לעסק שלי.';
        }

        const msgDiv = document.createElement('div');
        msgDiv.className = 'gor-msg bot';
        msgDiv.innerHTML = `
            ${response}
            <div style="margin-top: 10px;">
                <a href="https://wa.me/972525155598?text=${encodeURIComponent(whatsappMsg)}" target="_blank" class="btn-gold" style="display: inline-block; padding: 6px 14px; font-size: 0.8rem; text-decoration: none; border-radius: 8px;">
                    <i class="fab fa-whatsapp"></i> המשך שיחה בוואטסאפ עם איגור
                </a>
            </div>
        `;
        botBody.appendChild(msgDiv);
        botBody.scrollTop = botBody.scrollHeight;
    };
});