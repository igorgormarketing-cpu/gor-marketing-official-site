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
    document.querySelectorAll('a[href*="gormarketing.netlify.app"], .btn-app-action').forEach(link => {
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

                // 3. Interactive Target Lead Goal & Marketing Budget Simulator (כדי לקבל X לידים - כמה תקציב פרסום Y צריך לשלם?)
    const channelPresets = {
        omnichannel: {
            name: 'מערך 360° Omnichannel',
            badge: '🌐 מערך 360° Omnichannel',
            icon: 'fa-network-wired',
            color: '#00ff88',
            baseCpl: 65,
            baseConvRate: 0.22,
            aiBoostFactor: 0.40,
            insight: 'השילוב האולטימטיבי של GOR MARKETING: חיבור גוגל, מטא, תוכן ו-CRM עם מענה AI תוך 60 שניות מבטיח סגירה הרמטית בעלות המשתלמת ביותר.'
        },
        google_ppc: {
            name: 'גוגל ממומן (Google Ads)',
            badge: '🎯 גוגל ממומן (PPC / Shopping)',
            icon: 'fab fa-google',
            color: '#4285F4',
            baseCpl: 92,
            baseConvRate: 0.17,
            aiBoostFactor: 0.35,
            insight: 'תנועת חיפוש ממוקדת של לקוחות בעלי כוונת רכישה גבוהה ("High Intent"). איכות לידים מעולה עם יחס סגירה מהיר.'
        },
        google_seo: {
            name: 'קידום אורגני (SEO)',
            badge: '📈 קידום אורגני (SEO Top Rank)',
            icon: 'fa-magnifying-glass-chart',
            color: '#34A853',
            baseCpl: 45,
            baseConvRate: 0.15,
            aiBoostFactor: 0.30,
            insight: 'השקעה נכונה בנכס דיגיטלי מניב לאורך זמן. עלות לליד הנמוכה ביותר שממשיכה לייצר פניות גם ללא תשלום יומי לקליקים.'
        },
        meta_ads: {
            name: 'מטא (פייסבוק ואינסטגרם)',
            badge: '📢 קמפיין מטא (Facebook & IG)',
            icon: 'fa-bullhorn',
            color: '#0081FB',
            baseCpl: 70,
            baseConvRate: 0.13,
            aiBoostFactor: 0.45,
            insight: 'חשיפה רחבה וטירגוט מדויק לפי תחומי עניין והתנהגות. מתאים במיוחד לפניות ממוקדות ב-B2C ו-B2B.'
        },
        tiktok_ads: {
            name: 'טיקטוק ממומן (TikTok Ads)',
            badge: '📱 טיקטוק ממומן (TikTok Ads)',
            icon: 'fab fa-tiktok',
            color: '#00f2fe',
            baseCpl: 50,
            baseConvRate: 0.12,
            aiBoostFactor: 0.45,
            insight: 'הפלטפורמה הצומחת ביותר עם עלות חשיפה זולה משמעותית. מצוין לווידאו קצר שמייצר נפח פניות גבוה.'
        },
        youtube: {
            name: 'פרסום וידאו ביוטיוב',
            badge: '🎬 פרסום וידאו (YouTube Ads)',
            icon: 'fab fa-youtube',
            color: '#FF0000',
            baseCpl: 68,
            baseConvRate: 0.20,
            aiBoostFactor: 0.40,
            insight: 'בניית אמון וסמכות מקצועית באמצעות סרטוני ערך. הלקוחות מגיעים מחוממים ומוכנים לסגירה בעסקה גבוהה.'
        },
        instagram: {
            name: 'אינסטגרם ומשפיענים',
            badge: '✨ אינסטגרם ומיתוג ויזואלי',
            icon: 'fab fa-instagram',
            color: '#E1306C',
            baseCpl: 62,
            baseConvRate: 0.14,
            aiBoostFactor: 0.35,
            insight: 'מיתוג פרימיום ומיצוב יוקרתי שמושך לקוחות שמעריכים איכות. מחזק את המותג ומעלה את השווי הממוצע לעסקה.'
        },
        native_news: {
            name: 'כתבות תוכן וטאבולה',
            badge: '📰 תוכן ממומן (Native Ads)',
            icon: 'fa-newspaper',
            color: '#00bcd4',
            baseCpl: 110,
            baseConvRate: 0.18,
            aiBoostFactor: 0.35,
            insight: 'כתבות תוכן מעמיקות באתרי חדשות מובילים. מתאים לעסקאות יקרות (High-Ticket) ומחקר מעמיק של הרוכשים.'
        },
        whatsapp_retention: {
            name: 'מועדון וואטסאפ ושימור',
            badge: '💬 מועדון לקוחות וסוכני AI',
            icon: 'fab fa-whatsapp',
            color: '#25D366',
            baseCpl: 20,
            baseConvRate: 0.25,
            aiBoostFactor: 0.50,
            insight: 'הרווחיות הגבוהה ביותר: מעל 95% אחוזי פתיחה בוואטסאפ עם סוכני AI שמבצעים שימור ומכירה חוזרת ללקוחות קיימים.'
        }
    };

    // SEO Position Matrix Data
    const seoPosConfig = {
        current: {
            unranked: { label: 'אתר חדש / מיקום 50+', factor: 1.40, timeMin: 5, timeMax: 7, effortText: 'בניית תשתית מקיפה, 8-12 מאמרים וקישורים חזקים' },
            page3_5: { label: 'עמודים 3-5 (21-50)', factor: 1.20, timeMin: 4, timeMax: 6, effortText: 'אופטימיזציית תוכן, שיפור טכני וחיזוק פרופיל קישורים' },
            page2: { label: 'עמוד 2 (11-20)', factor: 1.00, timeMin: 3, timeMax: 4, effortText: 'דחיפת מילות מפתח, שיפור Core Web Vitals וקישורים סמכותיים' },
            page1_bottom: { label: 'תחתית עמוד 1 (7-10)', factor: 0.85, timeMin: 2, timeMax: 3, effortText: 'אופטימיזציית On-Page ממוקדת והרחבת סמכות דומיין' }
        },
        target: {
            top3: { label: '🥇 מקומות 1-3 (פודיום גוגל)', baseCpl: 42, ctr: '~32% (מקומות 1-3)', convBoost: 0.22, note: 'כיבוש שלישיית הצמרת של גוגל: מייצר מעל 60% מכלל התנועה והפניות האורגניות בתחום.' },
            top6: { label: '🥈 מקומות 4-6 (עמוד 1 מרכזי)', baseCpl: 52, ctr: '~14% (מקומות 4-6)', convBoost: 0.16, note: 'נוכחות יציבה במרכז העמוד הראשון של גוגל עם זרימת לידים שוטפת.' },
            top10: { label: '🥉 מקומות 7-10 (חדירה לעמוד 1)', baseCpl: 65, ctr: '~6% (מקומות 7-10)', convBoost: 0.12, note: 'חדירה ראשונית לעמוד התוצאות הראשון של גוגל.' },
            top3_maps: { label: '🗺️ מקומות 1-3 + Google Maps', baseCpl: 36, ctr: '~38% (פודיום + מפות)', convBoost: 0.25, note: 'שליטה לוקאלית מלאה: תוצאה אורגנית עליונה יחד עם נוכחות בולטת ב-Google Maps.' }
        }
    };

    // Social Media Growth Config
    const socialGrowthConfig = {
        strategy: {
            hybrid: { label: 'שילוב 8-12 פוסטים + מאיץ ממומן', costPerFollower: 2.0, postText: '8-12 פוסטים/חודש', timeText: '7-14 ימים', note: 'האסטרטגיה המנצחת: שילוב סמכות ומיתוג עם מאיץ ממומן זעיר להשגת עוקבים מדויקים ומהירים.' },
            organic_only: { label: 'אורגני בלבד (ללא מימון)', costPerFollower: 0, postMultiplier: 0.25, timeText: '4-8 שבועות', note: 'פעילות אורגנית טהורה: 20-30 פוסטים/רילס איכותיים לשיתוף בקבוצות וקהילות.' },
            boost_heavy: { label: 'מאיץ ממומן אגרסיבי', costPerFollower: 2.5, postText: '4-6 פוסטים ממוקדים', timeText: '3-7 ימים', note: 'צמיחה מואצת: קמפיין ממומן ממוקד המקפיץ את מספר העוקבים והחשיפה בזמן שיא.' }
        }
    };

    let activeChannelKey = 'omnichannel';

    const targetLeadsInput = document.getElementById('calc-target-leads-input');
    const targetLeadsSlider = document.getElementById('calc-target-leads');
    const titleLeadsDisp = document.getElementById('calc-title-leads-disp');
    const gridLeadsLabel = document.getElementById('calc-grid-leads-label');

    const dealInput = document.getElementById('calc-deal-input');
    const dealSlider = document.getElementById('calc-deal');
    const aiBoostCheckbox = document.getElementById('calc-ai-boost');

    const channelBtns = document.querySelectorAll('.calc-channel-btn');
    const channelBadge = document.getElementById('calc-current-channel-badge');

    // SEO Rank Target Elements
    const seoRankWrapper = document.getElementById('calc-seo-rank-wrapper');
    const seoCurrentPosSelect = document.getElementById('calc-seo-current-pos');
    const seoTargetPosSelect = document.getElementById('calc-seo-target-pos');
    const seoCtrValDisp = document.getElementById('calc-seo-ctr-val');
    const seoTimelineValDisp = document.getElementById('calc-seo-timeline-val');
    const seoEffortValDisp = document.getElementById('calc-seo-effort-val');

    // Social Media Growth Elements
    const socialGrowthWrapper = document.getElementById('calc-social-growth-wrapper');
    const socialFollowersTargetSelect = document.getElementById('calc-social-followers-target');
    const socialStrategySelect = document.getElementById('calc-social-strategy');
    const socialPostsValDisp = document.getElementById('calc-social-posts-val');
    const socialBoostValDisp = document.getElementById('calc-social-boost-val');
    const socialTimeValDisp = document.getElementById('calc-social-time-val');

    const reversePlatformsGrid = document.getElementById('calc-reverse-platforms-grid');

    // Output Result Elements
    const resRequiredBudget = document.getElementById('calc-res-required-budget');
    const resCplBadge = document.getElementById('calc-res-cpl-badge');
    const resRevenue = document.getElementById('calc-res-revenue');
    const resDeals = document.getElementById('calc-res-deals');
    const resRoas = document.getElementById('calc-res-roas');
    const resTimeSaved = document.getElementById('calc-res-time');
    const resProfit = document.getElementById('calc-res-profit');
    const resInsight = document.getElementById('calc-res-insight');
    const calcCtaBtn = document.getElementById('calc-cta-btn');

    // Quick Pill Presets
    const leadPills = document.querySelectorAll('#calc-lead-pills .calc-pill');
    const dealPills = document.querySelectorAll('#calc-deal-pills .calc-pill');

    function applyChannel(key) {
        if (!channelPresets[key]) key = 'omnichannel';
        activeChannelKey = key;
        const preset = channelPresets[key];

        channelBtns.forEach(btn => {
            if (btn.getAttribute('data-channel') === key) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (channelBadge) {
            channelBadge.innerHTML = preset.badge;
        }

        // Show/Hide SEO Rank Box
        if (seoRankWrapper) {
            if (key === 'google_seo' || key === 'omnichannel') {
                seoRankWrapper.style.display = 'block';
            } else {
                seoRankWrapper.style.display = 'none';
            }
        }

        // Show/Hide Social Media Growth Box
        if (socialGrowthWrapper) {
            if (key === 'meta_ads' || key === 'tiktok_ads' || key === 'instagram') {
                socialGrowthWrapper.style.display = 'block';
            } else {
                socialGrowthWrapper.style.display = 'none';
            }
        }

        updateCalculator();
    }

    function renderReversePlatformCards(targetLeads, dealVal, isAiBoost) {
        if (!reversePlatformsGrid) return;
        let html = '';
        Object.keys(channelPresets).forEach(key => {
            const p = channelPresets[key];
            let baseCplVal = p.baseCpl;
            
            if (key === 'google_seo' && seoTargetPosSelect && seoPosConfig.target[seoTargetPosSelect.value]) {
                baseCplVal = seoPosConfig.target[seoTargetPosSelect.value].baseCpl;
            }

            const effCpl = isAiBoost ? Math.round(baseCplVal * 0.85) : baseCplVal;
            const reqBudget = Math.round(targetLeads * effCpl);
            const effConv = p.baseConvRate * (isAiBoost ? (1 + p.aiBoostFactor) : 1);
            const deals = Math.max(1, Math.round(targetLeads * effConv));
            const isSelected = key === activeChannelKey ? 'selected' : '';

            html += '<div class="calc-platform-cost-card ' + isSelected + '" onclick="window.selectReversePlatform(\'' + key + '\')">' +
                    '<div class="calc-platform-header"><i class="' + (p.icon.includes('fa-') ? (p.icon.startsWith('fab') ? p.icon : 'fas ' + p.icon) : 'fas fa-check') + '" style="color: ' + p.color + '"></i> ' + p.name + '</div>' +
                    '<div class="calc-platform-budget-val">₪' + reqBudget.toLocaleString('he-IL') + '</div>' +
                    '<div class="calc-platform-cpl-label">~₪' + effCpl + ' לליד (' + deals + ' עסקאות)</div>' +
                    '</div>';
        });
        reversePlatformsGrid.innerHTML = html;
    }

    window.selectReversePlatform = function(key) {
        applyChannel(key);
    };

    function updateCalculator() {
        const preset = channelPresets[activeChannelKey] || channelPresets.omnichannel;
        const targetLeads = targetLeadsInput ? Math.max(1, parseInt(targetLeadsInput.value, 10) || 1) : (targetLeadsSlider ? parseInt(targetLeadsSlider.value, 10) : 100);
        const dealVal = dealInput ? Math.max(100, parseInt(dealInput.value, 10) || 100) : (dealSlider ? parseInt(dealSlider.value, 10) : 6000);
        const isAiBoost = aiBoostCheckbox ? aiBoostCheckbox.checked : true;

        if (titleLeadsDisp) titleLeadsDisp.textContent = targetLeads.toLocaleString('he-IL');
        if (gridLeadsLabel) gridLeadsLabel.textContent = targetLeads.toLocaleString('he-IL') + ' לידים';

        // 1. Calculate Channel CPL & Efficiencies
        let baseCpl = preset.baseCpl;
        let baseConv = preset.baseConvRate;
        let channelInsight = preset.insight;

        // SEO Custom Rank Calculation
        let seoCurInfo = null;
        let seoTgtInfo = null;
        if (activeChannelKey === 'google_seo' || activeChannelKey === 'omnichannel') {
            const curPosKey = seoCurrentPosSelect ? seoCurrentPosSelect.value : 'page2';
            const tgtPosKey = seoTargetPosSelect ? seoTargetPosSelect.value : 'top3';
            seoCurInfo = seoPosConfig.current[curPosKey] || seoPosConfig.current.page2;
            seoTgtInfo = seoPosConfig.target[tgtPosKey] || seoPosConfig.target.top3;

            if (activeChannelKey === 'google_seo') {
                baseCpl = Math.round(seoTgtInfo.baseCpl * seoCurInfo.factor);
                baseConv = seoTgtInfo.convBoost;
                channelInsight = 'יעד מיקום ' + seoTgtInfo.label + ': ' + seoTgtInfo.note;
            }

            if (seoCtrValDisp) seoCtrValDisp.textContent = seoTgtInfo.ctr;
            if (seoTimelineValDisp) seoTimelineValDisp.textContent = seoCurInfo.timeMin + '-' + seoCurInfo.timeMax + ' חודשים';
            if (seoEffortValDisp) seoEffortValDisp.textContent = seoCurInfo.effortText;
        }

        // Social Media Custom Growth Calculation
        let socialTargetVal = 100;
        let socialStratInfo = null;
        if (activeChannelKey === 'meta_ads' || activeChannelKey === 'tiktok_ads' || activeChannelKey === 'instagram') {
            socialTargetVal = socialFollowersTargetSelect ? parseInt(socialFollowersTargetSelect.value, 10) : 100;
            const stratKey = socialStrategySelect ? socialStrategySelect.value : 'hybrid';
            socialStratInfo = socialGrowthConfig.strategy[stratKey] || socialGrowthConfig.strategy.hybrid;

            const boostBudget = Math.round(socialTargetVal * socialStratInfo.costPerFollower);
            const postsDisplay = stratKey === 'organic_only' ? Math.max(15, Math.round(socialTargetVal * 0.22)) + ' פוסטים/רילס' : (socialStratInfo.postText || '8-12 פוסטים');

            if (socialPostsValDisp) socialPostsValDisp.textContent = postsDisplay;
            if (socialBoostValDisp) socialBoostValDisp.textContent = boostBudget > 0 ? '~₪' + boostBudget.toLocaleString('he-IL') : '₪0 (אורגני)';
            if (socialTimeValDisp) socialTimeValDisp.textContent = socialStratInfo.timeText;

            channelInsight = 'יעד ' + socialTargetVal + ' עוקבים: ' + socialStratInfo.note;
        }

        const effCpl = isAiBoost ? Math.round(baseCpl * 0.85) : baseCpl;
        const requiredBudget = Math.round(targetLeads * effCpl);

        // 2. Calculate Deals & Revenue
        const effectiveConvRate = baseConv * (isAiBoost ? (1 + preset.aiBoostFactor) : 1);
        const estimatedDeals = Math.max(1, Math.round(targetLeads * effectiveConvRate));
        const estimatedRevenue = estimatedDeals * dealVal;
        const roas = requiredBudget > 0 ? Math.round((estimatedRevenue / requiredBudget) * 100) : 0;
        const netProfit = Math.max(0, estimatedRevenue - requiredBudget);
        const timeSavedHours = Math.round(targetLeads * (isAiBoost ? 1.5 : 0.6) + estimatedDeals * (isAiBoost ? 2.0 : 1.0));

        // 3. Update DOM
        if (resRequiredBudget) resRequiredBudget.textContent = '₪' + requiredBudget.toLocaleString('he-IL');
        if (resCplBadge) {
            const aiSaveText = isAiBoost ? ' (כולל חיסכון של 15% במאיץ AI)' : '';
            resCplBadge.innerHTML = 'לפי עלות ממוצעת של <strong style="color: #fff;">₪' + effCpl + '</strong> לפנייה בערוץ הנבחר' + aiSaveText;
        }

        if (resRevenue) resRevenue.textContent = '₪' + estimatedRevenue.toLocaleString('he-IL');
        if (resDeals) resDeals.textContent = estimatedDeals.toLocaleString('he-IL') + ' עסקאות (' + Math.round(effectiveConvRate * 100) + '% סגירה)';
        if (resRoas) resRoas.textContent = roas.toLocaleString('he-IL') + '%';
        if (resTimeSaved) resTimeSaved.textContent = timeSavedHours + ' שעות/חודש';
        if (resProfit) resProfit.textContent = '₪' + netProfit.toLocaleString('he-IL');
        if (resInsight) resInsight.textContent = channelInsight;

        // 4. Render Cross-Channel Comparison Grid
        renderReversePlatformCards(targetLeads, dealVal, isAiBoost);

        // 5. Update WhatsApp CTA
        if (calcCtaBtn) {
            const aiText = isAiBoost ? 'כולל מאיץ AI ו-GOR CRM' : 'ללא מאיץ AI';
            let extraDetail = '';
            if (activeChannelKey === 'google_seo' && seoCurInfo && seoTgtInfo) {
                extraDetail = '\n🎯 מיקום נוכחי: ' + seoCurInfo.label + ' ➡️ יעד מבוקש: ' + seoTgtInfo.label + ' (' + seoTgtInfo.ctr + ')';
            } else if ((activeChannelKey === 'meta_ads' || activeChannelKey === 'tiktok_ads' || activeChannelKey === 'instagram') && socialStratInfo) {
                extraDetail = '\n👥 יעד עוקבים: ' + socialTargetVal + ' עוקבים (' + socialStratInfo.label + ')';
            }

            const msgLines = [
                'היי איגור, ביצעתי תחזית במחשבון הלידים של GOR MARKETING:',
                '🎯 יעד מבוקש (X): ' + targetLeads.toLocaleString('he-IL') + ' לידים/פניות בחודש',
                '🌐 ערוץ שיווק: ' + preset.name + ' (' + aiText + ')' + extraDetail,
                '💰 תקציב פרסום/השקעה נדרש (Y): ₪' + requiredBudget.toLocaleString('he-IL') + ' (~₪' + effCpl + ' לליד)',
                '🤝 צפי עסקאות: ' + estimatedDeals + ' עסקאות',
                '📈 מחזור הכנסות משוער: ₪' + estimatedRevenue.toLocaleString('he-IL') + ' (ROAS ' + roas.toLocaleString('he-IL') + '%)',
                '💎 רווח נקי משוער: ₪' + netProfit.toLocaleString('he-IL'),
                'אשמח שנתאם שיחה לבניית תוכנית עבודה מנצחת!'
            ];
            calcCtaBtn.href = 'https://wa.me/972525155598?text=' + encodeURIComponent(msgLines.join('\n'));
        }

        if (window.trackGorEvent) {
            window.trackGorEvent('roi_target_leads_calculated', { targetLeads: targetLeads, channel: activeChannelKey, budget: requiredBudget });
        }
    }

    // Event Listeners for Target Leads
    if (targetLeadsInput && targetLeadsSlider) {
        targetLeadsInput.addEventListener('input', () => {
            const val = parseInt(targetLeadsInput.value, 10) || 5;
            targetLeadsSlider.value = Math.min(1000, Math.max(5, val));
            updateActiveLeadPill(val);
            updateCalculator();
        });
        targetLeadsSlider.addEventListener('input', () => {
            targetLeadsInput.value = targetLeadsSlider.value;
            updateActiveLeadPill(parseInt(targetLeadsSlider.value, 10));
            updateCalculator();
        });
    }

    // Event Listeners for Deal Value
    if (dealInput && dealSlider) {
        dealInput.addEventListener('input', () => {
            const val = parseInt(dealInput.value, 10) || 500;
            dealSlider.value = Math.min(50000, Math.max(500, val));
            updateActiveDealPill(val);
            updateCalculator();
        });
        dealSlider.addEventListener('input', () => {
            dealInput.value = dealSlider.value;
            updateActiveDealPill(parseInt(dealSlider.value, 10));
            updateCalculator();
        });
    }

    if (seoCurrentPosSelect) seoCurrentPosSelect.addEventListener('change', updateCalculator);
    if (seoTargetPosSelect) seoTargetPosSelect.addEventListener('change', updateCalculator);

    if (socialFollowersTargetSelect) socialFollowersTargetSelect.addEventListener('change', updateCalculator);
    if (socialStrategySelect) socialStrategySelect.addEventListener('change', updateCalculator);

    function updateActiveLeadPill(val) {
        leadPills.forEach(p => {
            if (parseInt(p.getAttribute('data-val'), 10) === val) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });
    }

    function updateActiveDealPill(val) {
        dealPills.forEach(p => {
            if (parseInt(p.getAttribute('data-deal'), 10) === val) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });
    }

    leadPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const val = parseInt(pill.getAttribute('data-val'), 10);
            if (targetLeadsInput) targetLeadsInput.value = val;
            if (targetLeadsSlider) targetLeadsSlider.value = Math.min(1000, val);
            updateActiveLeadPill(val);
            updateCalculator();
        });
    });

    dealPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const val = parseInt(pill.getAttribute('data-deal'), 10);
            if (dealInput) dealInput.value = val;
            if (dealSlider) dealSlider.value = Math.min(50000, val);
            updateActiveDealPill(val);
            updateCalculator();
        });
    });

    if (aiBoostCheckbox) {
        aiBoostCheckbox.addEventListener('change', updateCalculator);
    }

    channelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const channelKey = btn.getAttribute('data-channel');
            applyChannel(channelKey);
        });
    });

    // Initialize Calculator
    applyChannel('omnichannel');

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
            btnHref: 'https://gormarketing.netlify.app/'
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


/* Interactive Quote & Package Builder Logic */
(function initQuoteBuilder() {
    const grid = document.getElementById('quote-services-grid');
    if (!grid) return;

    const checkboxes = grid.querySelectorAll('.quote-checkbox');
    const totalMonthlyEl = document.getElementById('quote-total-monthly');
    const totalOnetimeEl = document.getElementById('quote-total-onetime');
    const onetimeContainer = document.getElementById('quote-total-onetime-container');
    const discountBadge = document.getElementById('quote-discount-badge');
    const selectedCountEl = document.getElementById('quote-selected-count');
    const whatsappBtn = document.getElementById('quote-whatsapp-btn');
    const gmailBtn = document.getElementById('quote-gmail-btn');

    function calculateQuote() {
        let monthlyTotal = 0;
        let onetimeTotal = 0;
        let selectedServices = [];
        let monthlyCount = 0;

        checkboxes.forEach(cb => {
            const card = cb.closest('.quote-service-card');
            if (cb.checked) {
                const price = parseFloat(cb.getAttribute('data-price')) || 0;
                const type = cb.getAttribute('data-type');
                const name = cb.getAttribute('data-service');

                selectedServices.push({ name, price, type });

                if (type === 'monthly') {
                    monthlyTotal += price;
                    monthlyCount++;
                } else {
                    onetimeTotal += price;
                }

                if (card) card.style.borderColor = 'var(--gold-bright)';
            } else {
                if (card) card.style.borderColor = 'rgba(255,255,255,0.08)';
            }
        });

        // Apply discount if 2 or more monthly services selected
        let discountRate = 0;
        if (monthlyCount >= 3) {
            discountRate = 0.15; // 15% discount
            discountBadge.textContent = '15% הנחת חבילה מוחלת!';
            discountBadge.style.display = 'inline-block';
        } else if (monthlyCount === 2) {
            discountRate = 0.10; // 10% discount
            discountBadge.textContent = '10% הנחת חבילה מוחלת!';
            discountBadge.style.display = 'inline-block';
        } else {
            discountBadge.style.display = 'none';
        }

        const discountedMonthly = Math.round(monthlyTotal * (1 - discountRate));

        totalMonthlyEl.innerHTML = '₪' + discountedMonthly.toLocaleString() + ' <span style="font-size: 0.95rem; color: #94a3b8; font-weight: 400;">/ חודש</span>';
        selectedCountEl.textContent = 'נבחרו ' + selectedServices.length + ' שירותים מותאמים';

        if (onetimeTotal > 0) {
            onetimeContainer.style.display = 'block';
            totalOnetimeEl.textContent = '₪' + onetimeTotal.toLocaleString();
        } else {
            onetimeContainer.style.display = 'none';
        }

        // WhatsApp trigger
        whatsappBtn.onclick = function() {
            let msg = 'היי איגור, הרכבתי חבילת שיווק מותאמת באתר GOR MARKETING:%0A%0A';
            selectedServices.forEach((s, idx) => {
                msg += (idx + 1) + '. ' + s.name + ' (₪' + s.price.toLocaleString() + ')%0A';
            });
            if (discountRate > 0) {
                msg += '%0A🎁 הנחת חבילה: ' + (discountRate * 100) + '%%0A';
            }
            msg += '💰 סה"כ חודשי משוער: ₪' + discountedMonthly.toLocaleString() + '%0A';
            if (onetimeTotal > 0) {
                msg += '⚡ הקמה חד-פעמית: ₪' + onetimeTotal.toLocaleString() + '%0A';
            }
            msg += '%0Aאשמח לקבוע פגישת אפיון ולסגור את החבילה!';
            window.open('https://wa.me/972525155598?text=' + msg, '_blank');
        };

                // Gmail trigger
        gmailBtn.onclick = function() {
            let body = 'היי איגור,\n\nהרכבתי חבילת שיווק באתר GOR MARKETING:\n\n';
            selectedServices.forEach((s, idx) => {
                body += (idx + 1) + '. ' + s.name + ' (₪' + s.price.toLocaleString() + ')\n';
            });
            body += '\nסה"כ חודשי משוער: ₪' + discountedMonthly.toLocaleString() + '\n';
            if (onetimeTotal > 0) body += 'הקמה חד-פעמית: ₪' + onetimeTotal.toLocaleString() + '\n';
            body += '\nאשמח לתאם פגישת אפיון ביומן.\nשם:\nטלפון:\nשם העסק:';
            const url = 'mailto:igorgor.marketing@gmail.com?subject=' + encodeURIComponent('הצעת מחיר מותאמת מחשבון GOR MARKETING') + '&body=' + encodeURIComponent(body);
            window.location.href = url;
        };
    }

    checkboxes.forEach(cb => cb.addEventListener('change', calculateQuote));
    calculateQuote();
})();



// ==========================================================================
// GOR CRM - UNIVERSAL AUTH & USER PROFILE ENGINE (Gmail / SaaS Style)
// ==========================================================================
(function initGorCrmAuthEngine() {
    const STORAGE_KEY = 'gor_crm_session_v1';

    function getSession() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setSession(userData) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        } catch (e) {
            console.error('Failed to save CRM session', e);
        }
    }

    function clearSession() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error('Failed to clear CRM session', e);
        }
    }

    // 1. Ensure Modal Exists in DOM
    function ensureModal() {
        if (document.getElementById('gorCrmModal')) return;

        const modalHtml = `
        <div class="crm-modal-backdrop" id="gorCrmModal" role="dialog" aria-modal="true" aria-labelledby="crmModalTitle">
            <div class="crm-modal-card">
                <button type="button" class="crm-modal-close" id="gorCrmModalClose" aria-label="סגור חלון">
                    <i class="fas fa-times"></i>
                </button>
                <div class="crm-modal-header">
                    <div class="crm-modal-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3 class="crm-modal-title" id="crmModalTitle">כניסה למערכת GOR CRM</h3>
                    <p class="crm-modal-subtitle">פורטל ניהול לקוחות, לידים, פרויקטים ואוטומציות</p>
                </div>

                <div class="crm-login-alert" id="crmLoginAlert"></div>

                <form id="gorCrmLoginForm">
                    <div class="crm-form-group">
                        <label class="crm-form-label" for="crmInputEmail">דוא״ל / שם משתמש</label>
                        <div class="crm-input-wrapper">
                            <i class="fas fa-envelope crm-field-icon"></i>
                            <input type="text" id="crmInputEmail" class="crm-input" placeholder="igor@gormarketing.com / משתמש" required autocomplete="username">
                        </div>
                    </div>

                    <div class="crm-form-group">
                        <label class="crm-form-label" for="crmInputPassword">סיסמת כניסה</label>
                        <div class="crm-input-wrapper">
                            <i class="fas fa-lock crm-field-icon"></i>
                            <input type="password" id="crmInputPassword" class="crm-input" placeholder="••••••••" required autocomplete="current-password">
                            <button type="button" class="crm-toggle-password" id="crmTogglePassword" aria-label="הצג סיסמה">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>

                    <div class="crm-form-options">
                        <label class="crm-remember-label">
                            <input type="checkbox" id="crmRememberMe" checked>
                            <span>זכור אותי במכשיר זה</span>
                        </label>
                        <a href="https://wa.me/972525155598?text=%D7%94%D7%99%D7%99%20%D7%90%D7%99%D7%92%D7%95%D7%A8%2C%20%D7%A9%D7%9B%D7%97%D7%AA%D7%99%20%D7%A1%D7%99%D7%A1%D7%9E%D7%94%20%D7%9C-GOR%20CRM" target="_blank" rel="noopener" class="crm-forgot-link">שכחת סיסמה?</a>
                    </div>

                    <button type="submit" class="btn-crm-submit" id="crmSubmitBtn">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>כניסה מאובטחת ל-CRM</span>
                    </button>

                    <button type="button" class="btn-crm-quick-admin" id="crmQuickAdminBtn">
                        <i class="fas fa-bolt" style="color: var(--gold-bright);"></i>
                        <span>כניסה מהירה כמנהל (איגור גורלקין)</span>
                    </button>
                </form>

                <div class="crm-modal-footer">
                    <span>פלטפורמת GOR CRM פועלת בענן מאובטח. </span>
                    <a href="https://gormarketing.netlify.app/" target="_blank" rel="noopener">פתיחה ישירה בטאב נפרד ←</a>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        setupModalEvents();
    }

    function openModal() {
        ensureModal();
        const modal = document.getElementById('gorCrmModal');
        if (modal) {
            modal.classList.add('active');
            const alertBox = document.getElementById('crmLoginAlert');
            if (alertBox) {
                alertBox.className = 'crm-login-alert';
                alertBox.style.display = 'none';
            }
            setTimeout(() => {
                const emailInput = document.getElementById('crmInputEmail');
                if (emailInput) emailInput.focus();
            }, 100);
        }
    }

    function closeModal() {
        const modal = document.getElementById('gorCrmModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    function setupModalEvents() {
        const modal = document.getElementById('gorCrmModal');
        const closeBtn = document.getElementById('gorCrmModalClose');
        const togglePass = document.getElementById('crmTogglePassword');
        const passInput = document.getElementById('crmInputPassword');
        const form = document.getElementById('gorCrmLoginForm');
        const quickAdminBtn = document.getElementById('crmQuickAdminBtn');

        if (closeBtn) closeBtn.onclick = closeModal;

        if (modal) {
            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeModal();
            }
        });

        if (togglePass && passInput) {
            togglePass.onclick = () => {
                const isPass = passInput.type === 'password';
                passInput.type = isPass ? 'text' : 'password';
                togglePass.innerHTML = isPass ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
            };
        }

        if (quickAdminBtn) {
            quickAdminBtn.onclick = () => {
                const emailInput = document.getElementById('crmInputEmail');
                if (emailInput) emailInput.value = 'igor@gormarketing.com';
                if (passInput) passInput.value = '••••••••';
                handleSuccessfulLogin({
                    name: 'איגור גורלקין',
                    email: 'igor@gormarketing.com',
                    role: 'מנהל מערכת ראשי',
                    initials: 'אי'
                });
            };
        }

        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('crmInputEmail');
                const emailVal = emailInput ? emailInput.value.trim() : '';

                if (!emailVal) return;

                const nameVal = emailVal.includes('@') ? emailVal.split('@')[0] : emailVal;
                const initials = nameVal.length >= 2 ? nameVal.substring(0, 2).toUpperCase() : nameVal.toUpperCase();

                const isIgor = emailVal.toLowerCase().includes('igor') || emailVal.toLowerCase().includes('admin');

                handleSuccessfulLogin({
                    name: isIgor ? 'איגור גורלקין' : nameVal,
                    email: emailVal.includes('@') ? emailVal : emailVal + '@gormarketing.com',
                    role: isIgor ? 'מנהל מערכת ראשי' : 'משתמש מורשה',
                    initials: isIgor ? 'אי' : initials
                });
            };
        }
    }

    function handleSuccessfulLogin(user) {
        const alertBox = document.getElementById('crmLoginAlert');
        const submitBtn = document.getElementById('crmSubmitBtn');

        if (alertBox) {
            alertBox.className = 'crm-login-alert success';
            alertBox.innerHTML = '<i class="fas fa-check-circle"></i> <span>התחברת בהצלחה! מעביר ל-GOR CRM...</span>';
            alertBox.style.display = 'flex';
        }

        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>טוען פרופיל...</span>';
        }

        user.loginTime = Date.now();
        user.isLoggedIn = true;
        setSession(user);

        setTimeout(() => {
            closeModal();
            renderNavbarAuth();
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>כניסה מאובטחת ל-CRM</span>';
            }
            // Prompt to open CRM or direct tab
            window.open('https://gormarketing.netlify.app/', '_blank');
        }, 700);
    }

    function handleLogout() {
        clearSession();
        renderNavbarAuth();
        const tray = document.getElementById('gorCrmUserTray');
        if (tray) tray.classList.remove('active');
    }

    // 2. Render Auth Controls in Navbar (Gmail Avatar & Login Button)
    function renderNavbarAuth() {
        ensureModal();
        const session = getSession();
        const navContainers = document.querySelectorAll('.nav-links');

        navContainers.forEach(nav => {
            // Remove previous instances if any
            const existingBtn = nav.querySelector('.btn-crm-nav');
            const existingWidget = nav.querySelector('.crm-user-profile-widget');
            if (existingBtn) existingBtn.remove();
            if (existingWidget) existingWidget.remove();

            if (session && session.isLoggedIn) {
                // Render Gmail-Style User Profile Avatar (Top Left / Nav)
                const widget = document.createElement('div');
                widget.className = 'crm-user-profile-widget';
                widget.id = 'gorCrmUserWidget';
                widget.innerHTML = `
                    <button type="button" class="crm-user-avatar-btn" id="gorCrmAvatarBtn" aria-label="תפריט משתמש ${session.name}" aria-expanded="false">
                        <div class="crm-avatar-circle">
                            <span>${session.initials || 'G'}</span>
                            <span class="crm-online-dot" title="מחובר ל-CRM"></span>
                        </div>
                        <div class="crm-user-info-text">
                            <span class="crm-user-name">${session.name}</span>
                            <span class="crm-user-status-text">GOR CRM</span>
                        </div>
                        <i class="fas fa-chevron-down" style="font-size: 0.65rem; color: var(--gold-bright); margin-right: 4px;"></i>
                    </button>
                    <div class="crm-user-tray" id="gorCrmUserTray">
                        <div class="crm-tray-header">
                            <div class="crm-tray-avatar">${session.initials || 'G'}</div>
                            <div class="crm-tray-user-details">
                                <span class="crm-tray-name">${session.name}</span>
                                <span class="crm-tray-email">${session.email}</span>
                                <span class="crm-tray-badge"><i class="fas fa-bolt"></i> ${session.role || 'משתמש מורשה'}</span>
                            </div>
                        </div>
                        <div class="crm-tray-actions">
                            <a href="https://gormarketing.netlify.app/" target="_blank" rel="noopener" class="crm-tray-btn crm-tray-btn-primary">
                                <span><i class="fas fa-external-link-alt"></i> כניסה לאפליקציית GOR CRM</span>
                                <i class="fas fa-arrow-left"></i>
                            </a>
                            <a href="https://gormarketing.netlify.app/" target="_blank" rel="noopener" class="crm-tray-btn">
                                <span><i class="fas fa-users-cog"></i> ניהול לידים ופרויקטים</span>
                                <i class="fas fa-chevron-left"></i>
                            </a>
                            <button type="button" class="crm-tray-btn crm-tray-logout" id="gorCrmLogoutAction">
                                <span><i class="fas fa-sign-out-alt"></i> התנתקות מהמערכת</span>
                                <i class="fas fa-power-off"></i>
                            </button>
                        </div>
                    </div>
                `;

                // Insert at the beginning or end of nav
                const contactBtn = nav.querySelector('.btn-nav');
                if (contactBtn) {
                    nav.insertBefore(widget, contactBtn);
                } else {
                    nav.appendChild(widget);
                }

                // Setup Tray toggle
                const avatarBtn = widget.querySelector('#gorCrmAvatarBtn');
                const tray = widget.querySelector('#gorCrmUserTray');
                const logoutBtn = widget.querySelector('#gorCrmLogoutAction');

                if (avatarBtn && tray) {
                    avatarBtn.onclick = (e) => {
                        e.stopPropagation();
                        const isActive = tray.classList.toggle('active');
                        avatarBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
                    };
                }

                if (logoutBtn) {
                    logoutBtn.onclick = (e) => {
                        e.stopPropagation();
                        handleLogout();
                    };
                }
            } else {
                // Render "כניסה ל-CRM" Button
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-crm-nav';
                btn.id = 'gorCrmTrigger';
                btn.setAttribute('aria-label', 'כניסה למערכת GOR CRM');
                btn.innerHTML = '<i class="fas fa-user-shield"></i> <span>כניסה ל-CRM</span>';

                btn.onclick = (e) => {
                    e.preventDefault();
                    openModal();
                };

                const contactBtn = nav.querySelector('.btn-nav');
                if (contactBtn) {
                    nav.insertBefore(btn, contactBtn);
                } else {
                    nav.appendChild(btn);
                }
            }
        });
    }

    // Close user tray on outside click
    document.addEventListener('click', (e) => {
        const tray = document.getElementById('gorCrmUserTray');
        const avatarBtn = document.getElementById('gorCrmAvatarBtn');
        if (tray && tray.classList.contains('active')) {
            if (!tray.contains(e.target) && (!avatarBtn || !avatarBtn.contains(e.target))) {
                tray.classList.remove('active');
            }
        }
    });

    // Expose Global Helper
    window.openGorCrmLogin = openModal;
    window.gorCrmLogout = handleLogout;

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            renderNavbarAuth();
        });
    } else {
        renderNavbarAuth();
    }
})();
