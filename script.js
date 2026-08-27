// ==========================================================================
// GOR MARKETING - OFFICIAL CORE INTERACTIVE SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // GOR Analytics & Conversion Event Engine (GTM / GA4 / Meta)
    // ========================================================
    window.trackGorEvent = function(eventName, params = {}) {
        const payload = {
            event: eventName,
            page_title: document.title,
            page_location: window.location.href,
            timestamp: new Date().toISOString(),
            ...params
        };

        // 1. Google Tag Manager DataLayer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(payload);

        // 2. Google Analytics 4 gtag
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }

        // 3. Meta / Facebook Pixel fbq
        if (typeof fbq === 'function') {
            fbq('trackCustom', eventName, params);
        }

        // Console debug in dev
        // console.log('[GOR Analytics]', eventName, payload);
    };

    // Auto-track WhatsApp Clicks
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            window.trackGorEvent('whatsapp_lead_click', {
                destination: 'whatsapp',
                button_text: link.innerText.trim().substring(0, 40)
            });
        });
    });

    // Auto-track App Launches & Downloads
    document.querySelectorAll('a[href*="gorcrm.netlify.app"], .btn-app-action').forEach(link => {
        link.addEventListener('click', () => {
            window.trackGorEvent('saas_app_action', {
                target_url: link.getAttribute('href'),
                action_text: link.innerText.trim().substring(0, 40)
            });
        });
    });

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

        // 3. Advanced Multi-Channel Growth & ROI Simulator Logic
    const channelPresets = {
        omnichannel: {
            name: 'שילוב 360° Omnichannel',
            badge: '🌐 שילוב 360° Omnichannel',
            minBudget: 10000, maxBudget: 250000, stepBudget: 2500, defaultBudget: 25000,
            minDeal: 1000, maxDeal: 60000, stepDeal: 500, defaultDeal: 6000,
            minLeads: 50, maxLeads: 1500, stepLeads: 10, defaultLeads: 380,
            baseConvRate: 0.22,
            aiBoostFactor: 0.45,
            volumeLabel: 'צפי פניות / לידים איכותיים בחודש:',
            insight: 'המערך השלם של GOR MARKETING: סינרגיה מושלמת בין גוגל, מטא, יוטיוב, אוטומציות וואטסאפ וסוכני AI לסגירה הרמטית של לקוחות בכל נקודת מגע.'
        },
        google_ppc: {
            name: 'גוגל ממומן (Google Ads)',
            badge: '🎯 גוגל ממומן (PPC / Shopping)',
            minBudget: 3000, maxBudget: 120000, stepBudget: 1000, defaultBudget: 12000,
            minDeal: 800, maxDeal: 50000, stepDeal: 500, defaultDeal: 4500,
            minLeads: 25, maxLeads: 800, stepLeads: 5, defaultLeads: 130,
            baseConvRate: 0.17,
            aiBoostFactor: 0.40,
            volumeLabel: 'צפי הקלקות ופניות מחיפוש ממוקד:',
            insight: 'תנועת חיפוש ממוקדת של לקוחות בעלי כוונת רכישה מיידית (High Commercial Intent). היתרון המרכזי: תוצאות מהירות וסגירה מיידית.'
        },
        google_seo: {
            name: 'גוגל אורגני (SEO)',
            badge: '🔍 גוגל אורגני (SEO & Top Rank)',
            minBudget: 3500, maxBudget: 60000, stepBudget: 500, defaultBudget: 8000,
            minDeal: 1000, maxDeal: 50000, stepDeal: 500, defaultDeal: 5000,
            minLeads: 30, maxLeads: 900, stepLeads: 10, defaultLeads: 180,
            baseConvRate: 0.15,
            aiBoostFactor: 0.35,
            volumeLabel: 'צפי פניות חודשיות מתנועה אורגנית:',
            insight: 'אפקט "הריבית דריבית" של השיווק הדיגיטלי: עלות הליד הולכת ופוחתת לאורך זמן ללא תשלום על כל קליק, ויוצרת נכס דיגיטלי בעל ערך מצטבר.'
        },
        meta_ads: {
            name: 'קמפיין פייסבוק ממומן (Meta Ads)',
            badge: '🚀 קמפיין ממומן מטא / פייסבוק',
            minBudget: 3000, maxBudget: 100000, stepBudget: 1000, defaultBudget: 10000,
            minDeal: 500, maxDeal: 40000, stepDeal: 500, defaultDeal: 3800,
            minLeads: 30, maxLeads: 1000, stepLeads: 10, defaultLeads: 145,
            baseConvRate: 0.13,
            aiBoostFactor: 0.45,
            volumeLabel: 'צפי לידים ממשפכי המרה ממומנים:',
            insight: 'ווליום לידים מהיר באמצעות פילוח קהלים מדויק, Lookalike ומשפכי המרה מדורגים (Retargeting) להבשלת מתעניינים.'
        },
        fb_organic: {
            name: 'ניהול עמוד וקהילה בפייסבוק',
            badge: '📘 עמוד וקהילה בפייסבוק',
            minBudget: 2500, maxBudget: 40000, stepBudget: 500, defaultBudget: 6000,
            minDeal: 500, maxDeal: 30000, stepDeal: 500, defaultDeal: 3000,
            minLeads: 20, maxLeads: 600, stepLeads: 5, defaultLeads: 120,
            baseConvRate: 0.12,
            aiBoostFactor: 0.30,
            volumeLabel: 'צפי פניות מאינטראקציה וקהילה:',
            insight: 'בניית נאמנות, Social Proof ושימור קהילה לאורך זמן: מענה מושלם לחיזוק המותג, לקוחות חוזרים והפניות מפה לאוזן.'
        },
        youtube: {
            name: 'ניהול ושיווק ערוץ יוטיוב',
            badge: '🎥 ערוץ יוטיוב (YouTube Video)',
            minBudget: 4000, maxBudget: 80000, stepBudget: 1000, defaultBudget: 9000,
            minDeal: 1500, maxDeal: 70000, stepDeal: 500, defaultDeal: 7500,
            minLeads: 20, maxLeads: 700, stepLeads: 5, defaultLeads: 135,
            baseConvRate: 0.20,
            aiBoostFactor: 0.45,
            volumeLabel: 'צפי פניות חמות מתוכן וידאו:',
            insight: 'עוצמת האמון בווידאו: לידים שמגיעים מתוכן יוטיוב מגיעים "חמים" ומוכנים לרכישה, ומאפשרים סגירת עסקאות בשווי גבוה (High-Ticket) בהרבה.'
        },
        instagram: {
            name: 'אינסטגרם ומיתוג ויזואלי',
            badge: '📸 אינסטגרם ומיתוג ויזואלי',
            minBudget: 3000, maxBudget: 70000, stepBudget: 1000, defaultBudget: 8000,
            minDeal: 500, maxDeal: 40000, stepDeal: 500, defaultDeal: 3200,
            minLeads: 25, maxLeads: 800, stepLeads: 5, defaultLeads: 130,
            baseConvRate: 0.14,
            aiBoostFactor: 0.35,
            volumeLabel: 'צפי פניות והמרות מרילס ומיתוג:',
            insight: 'מיתוג ויזואלי סוחף, Reels ויראליים ומשיכת קהל פרימיום: מושלם לעסקי B2C, לייפסטייל, עיצוב, נדל"ן ושירותי בוטיק.'
        },
        native_news: {
            name: 'אתרי חדשות וטאבולה/אאוטבריין',
            badge: '📰 אתרי חדשות ויח"צ (Native Ads)',
            minBudget: 6000, maxBudget: 150000, stepBudget: 1000, defaultBudget: 15000,
            minDeal: 2000, maxDeal: 100000, stepDeal: 1000, defaultDeal: 9000,
            minLeads: 20, maxLeads: 600, stepLeads: 5, defaultLeads: 135,
            baseConvRate: 0.18,
            aiBoostFactor: 0.40,
            volumeLabel: 'צפי מתעניינים מכתבות תוכן:',
            insight: 'סמכות עיתונאית יוקרתית: כתבות תוכן ממומנות מחנכות את השוק והופכות קהל קר ללקוחות פרימיום בעסקאות גדולות במיוחד.'
        },
        whatsapp_retention: {
            name: 'שיווק בוואטסאפ וניוזלטרים',
            badge: '💬 שיווק בוואטסאפ וניוזלטרים',
            minBudget: 2000, maxBudget: 40000, stepBudget: 500, defaultBudget: 5000,
            minDeal: 500, maxDeal: 35000, stepDeal: 500, defaultDeal: 3500,
            minLeads: 40, maxLeads: 1200, stepLeads: 10, defaultLeads: 250,
            baseConvRate: 0.25,
            aiBoostFactor: 0.45,
            volumeLabel: 'צפי פניות ממאגר לקוחות קיים:',
            insight: 'מיצוי מקסימלי של הדאטה הקיימת: 98% אחוזי פתיחה בוואטסאפ ואפס עלות על רכישת מדיה חיצונית מייצרים את ה-ROI הגבוה ביותר בעסק.'
        }
    };

    let activeChannelKey = 'omnichannel';

    const channelBtns = document.querySelectorAll('.calc-channel-btn');
    const currentChannelBadge = document.getElementById('calc-current-channel-badge');

    const budgetSlider = document.getElementById('calc-budget');
    const dealSlider = document.getElementById('calc-deal');
    const leadsSlider = document.getElementById('calc-leads');
    const aiBoostCheckbox = document.getElementById('calc-ai-boost');

    const budgetDisplay = document.getElementById('calc-budget-val');
    const dealDisplay = document.getElementById('calc-deal-val');
    const leadsDisplay = document.getElementById('calc-leads-val');

    const budgetMinDisp = document.getElementById('calc-budget-min');
    const budgetMaxDisp = document.getElementById('calc-budget-max');
    const leadsMinDisp = document.getElementById('calc-leads-min');
    const leadsMaxDisp = document.getElementById('calc-leads-max');
    const volumeLabelDisp = document.getElementById('calc-volume-label');

    const resRevenue = document.getElementById('calc-res-revenue');
    const resDeals = document.getElementById('calc-res-deals');
    const resRoas = document.getElementById('calc-res-roas');
    const resTimeSaved = document.getElementById('calc-res-time');
    const resProfit = document.getElementById('calc-res-profit');
    const resInsight = document.getElementById('calc-res-insight');
    const calcCtaBtn = document.getElementById('calc-cta-btn');

    function applyChannelPreset(channelKey) {
        const preset = channelPresets[channelKey];
        if (!preset) return;
        activeChannelKey = channelKey;

        channelBtns.forEach(btn => {
            if (btn.dataset.channel === channelKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (currentChannelBadge) {
            currentChannelBadge.textContent = preset.badge;
        }

        if (volumeLabelDisp && preset.volumeLabel) {
            volumeLabelDisp.textContent = preset.volumeLabel;
        }

        if (budgetSlider) {
            budgetSlider.min = preset.minBudget;
            budgetSlider.max = preset.maxBudget;
            budgetSlider.step = preset.stepBudget;
            budgetSlider.value = preset.defaultBudget;
            if (budgetMinDisp) budgetMinDisp.textContent = '₪' + preset.minBudget.toLocaleString('he-IL');
            if (budgetMaxDisp) budgetMaxDisp.textContent = '₪' + preset.maxBudget.toLocaleString('he-IL');
        }

        if (dealSlider) {
            dealSlider.min = preset.minDeal;
            dealSlider.max = preset.maxDeal;
            dealSlider.step = preset.stepDeal;
            dealSlider.value = preset.defaultDeal;
        }

        if (leadsSlider) {
            leadsSlider.min = preset.minLeads;
            leadsSlider.max = preset.maxLeads;
            leadsSlider.step = preset.stepLeads;
            leadsSlider.value = preset.defaultLeads;
            if (leadsMinDisp) leadsMinDisp.textContent = preset.minLeads.toLocaleString('he-IL');
            if (leadsMaxDisp) leadsMaxDisp.textContent = preset.maxLeads.toLocaleString('he-IL');
        }

        updateCalculator();
    }

    function updateCalculator() {
        if (!budgetSlider || !dealSlider || !leadsSlider) return;

        const preset = channelPresets[activeChannelKey] || channelPresets.omnichannel;
        const budget = parseInt(budgetSlider.value, 10);
        const dealVal = parseInt(dealSlider.value, 10);
        const leads = parseInt(leadsSlider.value, 10);
        const isAiBoost = aiBoostCheckbox ? aiBoostCheckbox.checked : true;

        if (budgetDisplay) budgetDisplay.textContent = '₪' + budget.toLocaleString('he-IL');
        if (dealDisplay) dealDisplay.textContent = '₪' + dealVal.toLocaleString('he-IL');
        if (leadsDisplay) leadsDisplay.textContent = leads.toLocaleString('he-IL') + ' פניות';

        const effectiveConvRate = preset.baseConvRate * (isAiBoost ? (1 + preset.aiBoostFactor) : 1);
        const estimatedDeals = Math.max(1, Math.round(leads * effectiveConvRate));
        const estimatedRevenue = estimatedDeals * dealVal;
        const roas = budget > 0 ? Math.round((estimatedRevenue / budget) * 100) : 0;
        const netProfit = Math.max(0, estimatedRevenue - budget);

        const timeSavedHours = Math.round(leads * (isAiBoost ? 1.8 : 0.8) + estimatedDeals * (isAiBoost ? 2.5 : 1.2));

        if (resRevenue) resRevenue.textContent = '₪' + estimatedRevenue.toLocaleString('he-IL');
        if (resDeals) resDeals.textContent = estimatedDeals.toLocaleString('he-IL') + ' עסקאות';
        if (resRoas) resRoas.textContent = roas.toLocaleString('he-IL') + '%';
        if (resTimeSaved) resTimeSaved.textContent = timeSavedHours + ' שעות/חודש';
        if (resProfit) resProfit.textContent = '₪' + netProfit.toLocaleString('he-IL');
        if (resInsight) resInsight.textContent = preset.insight;

        if (window.trackGorEvent) {
            window.trackGorEvent('roi_calculated', { channel: activeChannelKey, budget: budget, deals: estimatedDeals, revenue: estimatedRevenue });
        }

        if (calcCtaBtn) {
            const aiText = isAiBoost ? 'כולל מערך סוכני AI ו-CRM' : 'ללא שדרוג AI';
            const msg = 'היי איגור, ביצעתי סימולציה במחשבון ה-ROI של GOR MARKETING:' + '\n' +
                        '• ערוץ נבחר: ' + preset.name + ' (' + aiText + ')' + '\n' +
                        '• תקציב חודשי: ₪' + budget.toLocaleString('he-IL') + '\n' +
                        '• שווי ממוצע לעסקה: ₪' + dealVal.toLocaleString('he-IL') + '\n' +
                        '• צפי פניות: ' + leads.toLocaleString('he-IL') + '\n' +
                        '• צפי הכנסות: ₪' + estimatedRevenue.toLocaleString('he-IL') + ' (ROAS ' + roas.toLocaleString('he-IL') + '%)' + '\n' +
                        '• צפי עסקאות: ' + estimatedDeals + ' עסקאות' + '\n' +
                        'אשמח לבנות יחד תוכנית עבודה מותאמת להזנקת הפעילות!';
            calcCtaBtn.href = 'https://wa.me/972525155598?text=' + encodeURIComponent(msg);
        }
    }

    if (channelBtns.length > 0) {
        channelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const ch = btn.dataset.channel;
                if (ch) applyChannelPreset(ch);
            });
        });
    }

    if (budgetSlider) budgetSlider.addEventListener('input', updateCalculator);
    if (dealSlider) dealSlider.addEventListener('input', updateCalculator);
    if (leadsSlider) leadsSlider.addEventListener('input', updateCalculator);
    if (aiBoostCheckbox) aiBoostCheckbox.addEventListener('change', updateCalculator);

    updateCalculator();

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

    // 5. Smart Lead Form Engine
    const leadForm = document.getElementById('gor-lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name')?.value || '';
            const phone = document.getElementById('form-phone')?.value || '';
            const service = document.getElementById('form-service')?.value || '';
            const msg = document.getElementById('form-msg')?.value || '';

            // Save lead to local storage backup
            try {
                const storedLeads = JSON.parse(localStorage.getItem('gor_leads_backup') || '[]');
                storedLeads.push({ name, phone, service, msg, date: new Date().toISOString() });
                localStorage.setItem('gor_leads_backup', JSON.stringify(storedLeads));
            } catch (err) {
                console.error('Storage error', err);
            }

            // Visual feedback
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> הפנייה התקבלה! פותח וואטסאפ...';
                submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00b0ff)';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 4000);
            }

            window.trackGorEvent('lead_form_submit', { service: service, name: name });
            const formattedMsg = `היי איגור, השארתי פנייה באתר GOR MARKETING:\n👤 שם מלא: ${name}\n📞 טלפון: ${phone}\n🛠️ שירות מבוקש: ${service}\n📝 פירוט: ${msg ? msg : 'ללא הודעה נוספת'}`;
            window.open(`https://wa.me/972525155598?text=${encodeURIComponent(formattedMsg)}`, '_blank');
        });
    }

    // 6. GOR-Bot AI Concierge Widget Logic
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