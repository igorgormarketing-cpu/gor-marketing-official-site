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

            // 3. Advanced Multi-Channel & Dual-Mode ROI Simulator Logic
    const channelPresets = {
        omnichannel: {
            name: 'שילוב 360° Omnichannel',
            badge: '🌐 שילוב 360° Omnichannel',
            minBudget: 10000, maxBudget: 250000, stepBudget: 2500, defaultBudget: 25000,
            minDeal: 1000, maxDeal: 60000, stepDeal: 500, defaultDeal: 6000,
            minLeads: 50, maxLeads: 1500, stepLeads: 10, defaultLeads: 380,
            baseCpl: 65,
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
            baseCpl: 92,
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
            baseCpl: 45,
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
            baseCpl: 70,
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
            baseCpl: 50,
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
            baseCpl: 68,
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
            baseCpl: 62,
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
            baseCpl: 110,
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
            baseCpl: 20,
            baseConvRate: 0.25,
            aiBoostFactor: 0.45,
            volumeLabel: 'צפי פניות ממאגר לקוחות קיים:',
            insight: 'מיצוי מקסימלי של הדאטה הקיימת: 98% אחוזי פתיחה בוואטסאפ ואפס עלות על רכישת מדיה חיצונית מייצרים את ה-ROI הגבוה ביותר בעסק.'
        }
    };

    let activeChannelKey = 'omnichannel';
    let currentCalcMode = 'forward'; // 'forward' or 'reverse'

    const modeForwardBtn = document.getElementById('mode-forward-btn');
    const modeReverseBtn = document.getElementById('mode-reverse-btn');

    const channelWrapper = document.getElementById('calc-channel-wrapper');
    const budgetGroup = document.getElementById('calc-budget-group');
    const targetLeadsGroup = document.getElementById('calc-target-leads-group');
    const leadsGroup = document.getElementById('calc-leads-group');
    const reversePlatformsWrap = document.getElementById('calc-reverse-platforms-wrap');
    const reversePlatformsGrid = document.getElementById('calc-reverse-platforms-grid');

    const controlsHeading = document.getElementById('calc-controls-heading');
    const resultsHeading = document.getElementById('calc-results-heading');
    const summaryBannerLabel = document.getElementById('calc-summary-banner-label');
    const ctaBtnText = document.getElementById('calc-cta-btn-text');

    const metric1Lbl = document.getElementById('calc-metric-1-lbl');
    const metric2Lbl = document.getElementById('calc-metric-2-lbl');
    const metric3Lbl = document.getElementById('calc-metric-3-lbl');
    const metric4Lbl = document.getElementById('calc-metric-4-lbl');

    const channelBtns = document.querySelectorAll('.calc-channel-btn');
    const currentChannelBadge = document.getElementById('calc-current-channel-badge');

    const budgetSlider = document.getElementById('calc-budget');
    const targetLeadsSlider = document.getElementById('calc-target-leads');
    const dealSlider = document.getElementById('calc-deal');
    const leadsSlider = document.getElementById('calc-leads');
    const aiBoostCheckbox = document.getElementById('calc-ai-boost');

    const budgetDisplay = document.getElementById('calc-budget-val');
    const targetLeadsDisplay = document.getElementById('calc-target-leads-val');
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

    function setCalcMode(mode) {
        currentCalcMode = mode;
        if (mode === 'forward') {
            if (modeForwardBtn) modeForwardBtn.classList.add('active');
            if (modeReverseBtn) modeReverseBtn.classList.remove('active');
            if (channelWrapper) channelWrapper.style.display = 'block';
            if (budgetGroup) budgetGroup.style.display = 'block';
            if (leadsGroup) leadsGroup.style.display = 'block';
            if (targetLeadsGroup) targetLeadsGroup.style.display = 'none';
            if (reversePlatformsWrap) reversePlatformsWrap.style.display = 'none';

            if (controlsHeading) controlsHeading.textContent = 'התאמת פרמטרים לפעילות';
            if (resultsHeading) resultsHeading.textContent = 'תחזית ביצועים ותשואה חודשית';
            if (metric1Lbl) metric1Lbl.textContent = 'צפי הכנסות חודשיות';
            if (metric2Lbl) metric2Lbl.textContent = 'עסקאות סגורות משוערות';
            if (metric3Lbl) metric3Lbl.textContent = 'תשואה על השקעה (ROAS)';
            if (metric4Lbl) metric4Lbl.textContent = 'חיסכון זמן עבודה חודשי';
            if (summaryBannerLabel) summaryBannerLabel.textContent = 'רווח גולמי משוער מפעילות (לאחר ניכוי הוצאות שיווק):';
            if (ctaBtnText) ctaBtnText.textContent = 'קבל תוכנית פעולה לערוץ זה בוואטסאפ';
        } else {
            if (modeForwardBtn) modeForwardBtn.classList.remove('active');
            if (modeReverseBtn) modeReverseBtn.classList.add('active');
            if (channelWrapper) channelWrapper.style.display = 'block';
            if (budgetGroup) budgetGroup.style.display = 'none';
            if (leadsGroup) leadsGroup.style.display = 'none';
            if (targetLeadsGroup) targetLeadsGroup.style.display = 'block';
            if (reversePlatformsWrap) reversePlatformsWrap.style.display = 'block';

            if (controlsHeading) controlsHeading.textContent = 'הגדרת יעד שיחות ופניות מבוקש';
            if (resultsHeading) resultsHeading.textContent = 'תקציב השקעה נדרש ותחזית תוצאות';
            if (metric1Lbl) metric1Lbl.textContent = 'תקציב חודשי נדרש (לערוץ הנבחר)';
            if (metric2Lbl) metric2Lbl.textContent = 'צפי עסקאות שיסגרו מהיעד';
            if (metric3Lbl) metric3Lbl.textContent = 'צפי הכנסות כולל מהיעד';
            if (metric4Lbl) metric4Lbl.textContent = 'עלות ממוצעת לפנייה (CPL)';
            if (summaryBannerLabel) summaryBannerLabel.textContent = 'רווח נקי משוער לאחר ניכוי התקציב הנדרש:';
            if (ctaBtnText) ctaBtnText.textContent = 'קבל תוכנית תקציב ליעד זה בוואטסאפ';
        }
        updateCalculator();
    }

    if (modeForwardBtn) modeForwardBtn.addEventListener('click', () => setCalcMode('forward'));
    if (modeReverseBtn) modeReverseBtn.addEventListener('click', () => setCalcMode('reverse'));

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

    function renderReversePlatformCards(targetLeads, dealVal, isAiBoost) {
        if (!reversePlatformsGrid) return;
        let html = '';
        Object.keys(channelPresets).forEach(key => {
            const p = channelPresets[key];
            const effCpl = isAiBoost ? Math.round(p.baseCpl * 0.85) : p.baseCpl;
            const reqBudget = Math.round(targetLeads * effCpl);
            const effConv = p.baseConvRate * (isAiBoost ? (1 + p.aiBoostFactor) : 1);
            const deals = Math.max(1, Math.round(targetLeads * effConv));
            const isSelected = key === activeChannelKey ? 'selected' : '';

            html += '<div class="calc-platform-cost-card ' + isSelected + '" onclick="window.selectReversePlatform(\'' + key + '\')">' +
                    '<div class="calc-platform-header">' + p.name + '</div>' +
                    '<div class="calc-platform-budget-val">₪' + reqBudget.toLocaleString('he-IL') + '</div>' +
                    '<div class="calc-platform-cpl-label">עלות משוערת: ~₪' + effCpl + ' לפנייה (' + deals + ' עסקאות)</div>' +
                    '</div>';
        });
        reversePlatformsGrid.innerHTML = html;
    }

    window.selectReversePlatform = function(key) {
        applyChannelPreset(key);
    };

    function updateCalculator() {
        const preset = channelPresets[activeChannelKey] || channelPresets.omnichannel;
        const dealVal = dealSlider ? parseInt(dealSlider.value, 10) : 6000;
        const isAiBoost = aiBoostCheckbox ? aiBoostCheckbox.checked : true;

        if (dealDisplay) dealDisplay.textContent = '₪' + dealVal.toLocaleString('he-IL');

        if (currentCalcMode === 'forward') {
            if (!budgetSlider || !leadsSlider) return;
            const budget = parseInt(budgetSlider.value, 10);
            const leads = parseInt(leadsSlider.value, 10);

            if (budgetDisplay) budgetDisplay.textContent = '₪' + budget.toLocaleString('he-IL');
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
        } else {
            // REVERSE TARGET GOAL MODE
            const targetLeads = targetLeadsSlider ? parseInt(targetLeadsSlider.value, 10) : 120;
            if (targetLeadsDisplay) targetLeadsDisplay.textContent = targetLeads.toLocaleString('he-IL') + ' שיחות/פניות';

            const effCpl = isAiBoost ? Math.round(preset.baseCpl * 0.85) : preset.baseCpl;
            const requiredBudget = Math.round(targetLeads * effCpl);
            const effectiveConvRate = preset.baseConvRate * (isAiBoost ? (1 + preset.aiBoostFactor) : 1);
            const estimatedDeals = Math.max(1, Math.round(targetLeads * effectiveConvRate));
            const estimatedRevenue = estimatedDeals * dealVal;
            const netProfit = Math.max(0, estimatedRevenue - requiredBudget);

            if (resRevenue) resRevenue.textContent = '₪' + requiredBudget.toLocaleString('he-IL');
            if (resDeals) resDeals.textContent = estimatedDeals.toLocaleString('he-IL') + ' עסקאות';
            if (resRoas) resRoas.textContent = '₪' + estimatedRevenue.toLocaleString('he-IL');
            if (resTimeSaved) resTimeSaved.textContent = '₪' + effCpl + ' לפנייה';
            if (resProfit) resProfit.textContent = '₪' + netProfit.toLocaleString('he-IL');
            if (resInsight) resInsight.textContent = 'עבור יעד של ' + targetLeads + ' פניות ב-' + preset.name + ', התקציב הנדרש הוא כ-₪' + requiredBudget.toLocaleString('he-IL') + '. תוכנית זו צפויה להניב ' + estimatedDeals + ' עסקאות סגורות בשווי כולל של ₪' + estimatedRevenue.toLocaleString('he-IL') + '.';

            renderReversePlatformCards(targetLeads, dealVal, isAiBoost);

            if (calcCtaBtn) {
                const aiText = isAiBoost ? 'כולל מערך סוכני AI ו-CRM' : 'ללא שדרוג AI';
                const msg = 'היי איגור, הגדרתי יעד במחשבון של GOR MARKETING:' + '\n' +
                            '• יעד מבוקש: ' + targetLeads + ' שיחות/פניות בחודש' + '\n' +
                            '• ערוץ נבחר: ' + preset.name + ' (' + aiText + ')' + '\n' +
                            '• תקציב מחושב נדרש: ₪' + requiredBudget.toLocaleString('he-IL') + '\n' +
                            '• שווי עסקה: ₪' + dealVal.toLocaleString('he-IL') + '\n' +
                            '• צפי סגירות: ' + estimatedDeals + ' עסקאות (₪' + estimatedRevenue.toLocaleString('he-IL') + ' הכנסות)' + '\n' +
                            'אשמח לבנות איתך תוכנית פעולה להשגת יעד זה!';
                calcCtaBtn.href = 'https://wa.me/972525155598?text=' + encodeURIComponent(msg);
            }
        }

        if (window.trackGorEvent) {
            window.trackGorEvent('roi_calculated', { mode: currentCalcMode, channel: activeChannelKey });
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
    if (targetLeadsSlider) targetLeadsSlider.addEventListener('input', updateCalculator);
    if (dealSlider) dealSlider.addEventListener('input', updateCalculator);
    if (leadsSlider) leadsSlider.addEventListener('input', updateCalculator);
    if (aiBoostCheckbox) aiBoostCheckbox.addEventListener('change', updateCalculator);

    updateCalculator();

    
    // Toggle All 19 Google Reviews
    const toggleReviewsBtn = document.getElementById('toggle-all-reviews-btn');
    if (toggleReviewsBtn) {
        let isExpanded = false;
        toggleReviewsBtn.addEventListener('click', () => {
            const hiddenReviews = document.querySelectorAll('.review-card-gmb.hidden-review');
            isExpanded = !isExpanded;
            hiddenReviews.forEach(card => {
                if (isExpanded) {
                    card.classList.add('show-all');
                } else {
                    card.classList.remove('show-all');
                }
            });
            toggleReviewsBtn.innerHTML = isExpanded 
                ? '<i class="fas fa-chevron-up"></i> הצג פחות ביקורות' 
                : '<i class="fas fa-chevron-down"></i> הצג את כל 19 הביקורות המלאות';
        });
    }


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

        // 6. Intelligent Proactive GOR-Bot AI Concierge Engine
    const botTrigger = document.getElementById('gor-bot-trigger');
    const botModal = document.getElementById('gor-bot-modal');
    const botClose = document.getElementById('gor-bot-close');
    const botBody = document.getElementById('gor-bot-body');
    const botInput = document.getElementById('gor-bot-input');
    const botSendBtn = document.getElementById('gor-bot-send-btn');

    function toggleBotModal(open) {
        if (!botModal) return;
        if (open === undefined) {
            botModal.classList.toggle('active');
        } else if (open) {
            botModal.classList.add('active');
        } else {
            botModal.classList.remove('active');
        }
        const bubble = document.getElementById('gor-bot-bubble');
        if (bubble) bubble.classList.remove('show');
        if (botModal.classList.contains('active') && botInput) {
            setTimeout(() => botInput.focus(), 200);
        }
    }

    if (botTrigger) botTrigger.addEventListener('click', () => toggleBotModal());
    if (botClose) botClose.addEventListener('click', () => toggleBotModal(false));

    setTimeout(() => {
        if (!botModal || botModal.classList.contains('active')) return;
        let bubble = document.getElementById('gor-bot-bubble');
        if (!bubble) {
            bubble = document.createElement('div');
            bubble.id = 'gor-bot-bubble';
            bubble.className = 'gor-bot-proactive-bubble';
            bubble.innerHTML = '<span style="font-size: 1.2rem;">👋</span><div><strong>היי! יש לך שאלה?</strong><br><span style="color: var(--text-muted); font-size: 0.78rem;">אני כאן לעזור לך להגדיל מכירות בלייב.</span></div>';
            bubble.addEventListener('click', () => toggleBotModal(true));
            document.body.appendChild(bubble);
        }
        bubble.classList.add('show');
        setTimeout(() => bubble && bubble.classList.remove('show'), 12000);
    }, 8000);

    const knowledgeBase = [
        {
            keywords: ['מחיר', 'עלות', 'מחירון', 'כמה עולה', 'אפיון', 'פגישה', 'תשלום', 'זום'],
            text: 'פגישת אפיון אסטרטגית אישית עם איגור (פרונטלית או ב-Zoom) עולה <strong>150 ₪ + מע"מ</strong>. לאחר הפגישה נבנה תוכנית מותאמת בדיוק לתקציב וליעדי העסק שלך.',
            wa: 'היי איגור, אשמח לתאם פגישת אפיון אסטרטגית אישית (150 ש"ח + מע"מ).',
            btnText: 'תאם פגישת אפיון בוואטסאפ',
            btnIcon: 'fa-calendar-check',
            btnClass: 'btn-gold',
            btnHref: 'https://wa.me/972525155598?text=%D7%94%D7%99%D7%99%20%D7%90%D7%99%D7%92%D7%95%D7%A8%2C%20%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%AA%D7%90%D7%9D%20%D7%A4%D7%92%D7%99%D7%A9%D7%AA%20%D7%90%D7%A4%D7%99%D7%95%D7%9F%20%D7%95%D7%99%D7%99%D7%A2%D7%95%D7%A5%20%D7%90%D7%99%D7%A9%D7%99%D7%AA%20(150%20%D7%A9%D7%97)'
        },
        {
            keywords: ['crm', 'סי אר אם', 'לידים', 'אוטומציה', 'בוט', 'מערכת'],
            text: '<strong>GOR CRM</strong> היא מערכת מתקדמת לניהול לידים, אוטומציית מענה תוך 60 שניות, חיבור לסוכני AI ומקסום יחס סגירה לעסקים.',
            wa: 'היי איגור, אשמח לקבל פרטים ודמו על מערכת GOR CRM.',
            btnText: 'כניסה ל-GOR CRM / פתיחת דמו',
            btnIcon: 'fa-crown',
            btnClass: 'btn-emerald',
            btnHref: 'https://gorcrm.netlify.app/'
        },
        {
            keywords: ['roi', 'מחשבון', 'תקציב', 'תחזית', 'כדאיות', 'חישוב'],
            text: 'מחשבון ה-ROI הרב-ערוצי שלנו מאפשר לך לחשב צפי הכנסות, עסקאות ו-ROAS עבור 8 ערוצי שיווק שונים.',
            wa: 'היי איגור, ביצעתי תחזית במחשבון ה-ROI ואשמח לתוכנית פעולה.',
            btnText: 'מעבר למחשבון ה-ROI באתר',
            btnIcon: 'fa-calculator',
            btnClass: 'btn-gold',
            btnHref: 'index.html#roi-calculator',
            isAnchor: true
        },
        {
            keywords: ['גוגל', 'קידום', 'seo', 'ppc', 'ממומן', 'אורגני', 'פרסום בגוגל'],
            text: 'אנחנו מנהלים קמפיינים בגוגל ממומן (Google Ads) וקידום אורגני (SEO) ששמים את העסק שלך במקום הראשון ומביאים לקוחות בכוונת רכישה מיידית.',
            wa: 'היי איגור, אני רוצה לקבל הצעה לפרסום וקידום בגוגל.'
        },
        {
            keywords: ['פייסבוק', 'אינסטגרם', 'מטא', 'טיקטוק', 'סושיאל', 'רילס'],
            text: 'קמפיינים ממומנים במטא (פייסבוק ואינסטגרם) עם קריאייטיב ממיר, פילוח קהלים מדויק ומשפכי מכירה (Funnels) שמייצרים לידים איכותיים.',
            wa: 'היי איגור, אשמח להצעה לקמפיין פייסבוק/אינסטגרם ממיר.'
        },
        {
            keywords: ['אפליקציה', 'אפליקציות', 'תוכנה', 'saas', 'פיתוח', 'קוד', 'אתר', 'חנות'],
            text: 'צוות הפיתוח של GOR בונה מערכות SaaS, חנויות איקומרס מורכבות ואפליקציות מותאמות אישית עם דגש על ביצועים ואבטחה.',
            wa: 'היי איגור, אני רוצה לפתח אפליקציה / אתר מותאם אישית.',
            btnText: 'צפייה בפורטפוליו האפליקציות',
            btnIcon: 'fa-laptop-code',
            btnClass: 'btn-cyan',
            btnHref: 'apps.html',
            isAnchor: true
        },
        {
            keywords: ['קבלנים', 'contech', 'am building', 'בנייה', 'שיפוצים'],
            text: 'פלטפורמת <strong>הקבלנים (AM BUILDING)</strong> היא מערכת ConTech חדשנית לחיבור ישיר בין קבלנים, יזמים ואנשי מקצוע מובילים.',
            wa: 'היי איגור, אשמח לפרטים על פלטפורמת הקבלנים ConTech.',
            btnText: 'מעבר לעמוד הקבלנים',
            btnIcon: 'fa-hard-hat',
            btnClass: 'btn-gold',
            btnHref: 'hakablanim.html',
            isAnchor: true
        },
        {
            keywords: ['איגור', 'טלפון', 'נייד', 'וואטסאפ', 'דואל', 'מייל', 'קשר', 'ליצור קשר'],
            text: 'איגור גורלקין זמין ישירות בטלפון <strong>052-515-5598</strong>, בדוא"ל <strong>igorgor.marketing@gmail.com</strong> או ישירות בוואטסאפ!',
            wa: 'היי איגור, הגעתי מסוכן ה-AI באתר ואשמח לשוחח איתך.',
            btnText: 'שלח הודעה ישירה לאיגור',
            btnIcon: 'fa-whatsapp',
            btnClass: 'btn-gold',
            btnHref: 'https://wa.me/972525155598?text=%D7%94%D7%99%D7%99%20%D7%90%D7%99%D7%92%D7%95%D7%A8%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%9E%D7%A1%D7%95%D7%9B%D7%9F%20GOR%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%93%D7%91%D7%A8%20%D7%90%D7%99%D7%AA%D7%9A'
        }
    ];

    function renderBotResponse(responseText, waMsg, ctaObj) {
        if (!botBody) return;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'gor-msg bot';
        typingDiv.innerHTML = '<div class="gor-typing-dots"><div class="gor-typing-dot"></div><div class="gor-typing-dot"></div><div class="gor-typing-dot"></div></div>';
        botBody.appendChild(typingDiv);
        botBody.scrollTop = botBody.scrollHeight;

        setTimeout(() => {
            typingDiv.remove();
            const msgDiv = document.createElement('div');
            msgDiv.className = 'gor-msg bot';

            let ctaHtml = '';
            if (ctaObj && ctaObj.btnHref) {
                const target = ctaObj.isAnchor ? '' : 'target="_blank" rel="noopener noreferrer"';
                ctaHtml = '<div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">' +
                          '<a href="' + ctaObj.btnHref + '" ' + target + ' class="' + (ctaObj.btnClass || 'btn-gold') + '" style="padding: 6px 14px; font-size: 0.8rem; text-decoration: none; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;">' +
                          '<i class="fas ' + (ctaObj.btnIcon || 'fa-arrow-left') + '"></i> ' + ctaObj.btnText +
                          '</a>' +
                          '</div>';
            } else if (waMsg) {
                ctaHtml = '<div style="margin-top: 10px;">' +
                          '<a href="https://wa.me/972525155598?text=' + encodeURIComponent(waMsg) + '" target="_blank" class="btn-gold" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 0.8rem; text-decoration: none; border-radius: 8px;">' +
                          '<i class="fab fa-whatsapp"></i> המשך שיחה ישירה עם איגור' +
                          '</a>' +
                          '</div>';
            }

            msgDiv.innerHTML = responseText + ctaHtml;
            botBody.appendChild(msgDiv);
            botBody.scrollTop = botBody.scrollHeight;
        }, 450);
    }

    function handleUserMessage(queryText) {
        if (!queryText || !queryText.trim() || !botBody) return;
        const q = queryText.trim();

        const userDiv = document.createElement('div');
        userDiv.className = 'gor-msg user';
        userDiv.textContent = q;
        botBody.appendChild(userDiv);
        botBody.scrollTop = botBody.scrollHeight;
        if (botInput) botInput.value = '';

        const lowerQ = q.toLowerCase();
        let matched = null;
        for (const item of knowledgeBase) {
            if (item.keywords.some(k => lowerQ.includes(k))) {
                matched = item;
                break;
            }
        }

        if (matched) {
            renderBotResponse(matched.text, matched.wa, matched);
        } else {
            const fallbackText = 'היוצר שלי יוכל לענות לך על השאלה הזו הכי טוב ומדויק.<br>מעביר אותך להתכתבות בוואטסאפ איתו:';
            const fallbackWa = 'היי איגור, הגעתי מסוכן GOR באתר ויש לי שאלה בנושא: ' + q;
            renderBotResponse(fallbackText, fallbackWa, null);
        }
    }

    if (botSendBtn && botInput) {
        botSendBtn.addEventListener('click', () => handleUserMessage(botInput.value));
        botInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleUserMessage(botInput.value);
            }
        });
    }

    window.askGorBot = function(topic) {
        if (topic === 'services') {
            renderBotResponse('<strong>GOR MARKETING</strong> מספקת מעטפת שיווק 360° הכוללת: פרסום בגוגל וברשתות החברתיות, פיתוח אפליקציות ו-SaaS, סוכני AI ואוטומציות מתקדמות.', 'היי איגור, אשמח לשמוע על חבילת שיווק 360°.');
        } else if (topic === 'pricing') {
            renderBotResponse('פגישת אפיון אסטרטגית אישית עם איגור (פרונטלית או ב-Zoom) עולה <strong>150 ₪ + מע"מ</strong>. לאחר הפגישה נבנה תוכנית מותאמת לתקציב שלך.', 'היי איגור, אני רוצה לתאם פגישת אפיון (150 ש"ח + מע"מ).');
        } else if (topic === 'crm') {
            renderBotResponse('<strong>GOR CRM</strong> היא מערכת ניהול לידים ואוטומציה המבצעת מענה תוך 60 שניות ומקפיצה את אחוזי הסגירה בעסק.', 'היי איגור, אשמח לפרטים על מערכת GOR CRM.');
        } else if (topic === 'apps') {
            renderBotResponse('אנחנו מפתחים מערכות SaaS ואפליקציות מותאמות: <strong>TWIN PropTech</strong> לניהול בניינים, <strong>AM BUILDING</strong> לניהול בנייה ו-ConTech, וחנויות איקומרס.', 'היי איגור, מעניין אותי לפתח מערכת / אפליקציה מותאמת.');
        }
    };
});