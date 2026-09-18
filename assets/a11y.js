/**
 * GOR MARKETING - WCAG 2.1 AA & ISRAELI STANDARD 1918 ACCESSIBILITY ENGINE
 */
(function() {
    function initA11y() {
        if (document.getElementById('gor-accessibility-widget')) return;

        // 1. Create Skip-to-content
        if (!document.querySelector('.skip-to-content')) {
            const skip = document.createElement('a');
            skip.href = '#main-content';
            skip.className = 'skip-to-content';
            skip.innerText = 'דלג לתוכן המרכזי ⬇';
            document.body.prepend(skip);
        }

        const main = document.querySelector('main');
        if (main && !main.id) main.id = 'main-content';

        // 2. Accessibility Widget DOM
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'gor-accessibility-widget';
        widgetContainer.innerHTML = `
            <button type="button" class="accessibility-trigger" id="gorA11yTriggerBtn" aria-label="פתח תפריט נגישות (תקן ישראלי 1918 - קיצור Alt+A)" title="תפריט נגישות (Alt+A)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4" r="2"></circle><path d="M18 9h-4V7a2 2 0 0 0-4 0v2H6a2 2 0 0 0-2 2v2h2v7a2 2 0 0 0 2 2h2v-6h4v6h2a2 2 0 0 0 2-2v-7h2v-2a2 2 0 0 0-2-2z"></path></svg>
            </button>
            <div class="accessibility-panel" id="gorA11yPanel" role="dialog" aria-modal="true" aria-label="תפריט התאמת נגישות" style="display:none;">
                <div class="a11y-header">
                    <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4M12 16h.01"></path></svg> כלי נגישות (תקן 1918)</h3>
                    <button type="button" class="a11y-close" id="gorA11yCloseBtn" aria-label="סגור תפריט נגישות">✕</button>
                </div>
                <div class="a11y-grid">
                    <button type="button" class="a11y-btn" data-a11y="contrast-high" aria-pressed="false"><span class="icon">🌓</span> <span>ניגודיות גבוהה</span></button>
                    <button type="button" class="a11y-btn" data-a11y="contrast-invert" aria-pressed="false"><span class="icon">🔄</span> <span>היפוך צבעים</span></button>
                    <button type="button" class="a11y-btn" data-a11y="contrast-mono" aria-pressed="false"><span class="icon">⬛</span> <span>גווני אפור</span></button>
                    <button type="button" class="a11y-btn" data-a11y="font-inc"><span class="icon">A+</span> <span>הגדל טקסט</span></button>
                    <button type="button" class="a11y-btn" data-a11y="font-dec"><span class="icon">A-</span> <span>הקטן טקסט</span></button>
                    <button type="button" class="a11y-btn" data-a11y="readable-font" aria-pressed="false"><span class="icon">🔤</span> <span>גופן קריא</span></button>
                    <button type="button" class="a11y-btn" data-a11y="highlight-links" aria-pressed="false"><span class="icon">🔗</span> <span>הדגש קישורים</span></button>
                    <button type="button" class="a11y-btn" data-a11y="big-cursor" aria-pressed="false"><span class="icon">🖱️</span> <span>סמן מוגדל</span></button>
                    <button type="button" class="a11y-btn" data-a11y="stop-animations" aria-pressed="false"><span class="icon">⏹️</span> <span>עצור אנימציות</span></button>
                    <button type="button" class="a11y-btn a11y-btn-reset" data-a11y="reset"><span class="icon">↺</span> <span>איפוס הגדרות</span></button>
                </div>
                <div class="a11y-footer">
                    <a href="/accessibility.html" class="a11y-statement-link">הצהרת נגישות מפורטת ←</a>
                </div>
            </div>
        `;
        document.body.appendChild(widgetContainer);

        // 3. Logic & State Management
        const trigger = document.getElementById('gorA11yTriggerBtn');
        const panel = document.getElementById('gorA11yPanel');
        const close = document.getElementById('gorA11yCloseBtn');

        function togglePanel(open) {
            const isVisible = open !== undefined ? open : panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'block';
            trigger.setAttribute('aria-expanded', !isVisible);
        }

        trigger.onclick = () => togglePanel();
        close.onclick = () => togglePanel(false);

        // Keyboard Shortcut Alt+A
        document.addEventListener('keydown', (e) => {
            if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ש')) {
                e.preventDefault();
                togglePanel();
            } else if (e.key === 'Escape' && panel.style.display === 'block') {
                togglePanel(false);
            }
        });

        // Button Handlers
        let fontScale = 100;
        widgetContainer.querySelectorAll('.a11y-btn').forEach(btn => {
            btn.onclick = () => {
                const action = btn.dataset.a11y;
                const html = document.documentElement;

                if (action === 'contrast-high') {
                    html.classList.toggle('a11y-contrast-high');
                    btn.setAttribute('aria-pressed', html.classList.contains('a11y-contrast-high'));
                } else if (action === 'contrast-invert') {
                    html.classList.toggle('a11y-contrast-invert');
                    btn.setAttribute('aria-pressed', html.classList.contains('a11y-contrast-invert'));
                } else if (action === 'contrast-mono') {
                    html.classList.toggle('a11y-contrast-mono');
                    btn.setAttribute('aria-pressed', html.classList.contains('a11y-contrast-mono'));
                } else if (action === 'font-inc') {
                    if (fontScale < 130) fontScale += 10;
                    document.body.style.fontSize = fontScale + '%';
                } else if (action === 'font-dec') {
                    if (fontScale > 90) fontScale -= 10;
                    document.body.style.fontSize = fontScale + '%';
                } else if (action === 'readable-font') {
                    html.classList.toggle('a11y-readable-font');
                    btn.setAttribute('aria-pressed', html.classList.contains('a11y-readable-font'));
                } else if (action === 'highlight-links') {
                    html.classList.toggle('a11y-highlight-links');
                    btn.setAttribute('aria-pressed', html.classList.contains('a11y-highlight-links'));
                } else if (action === 'big-cursor') {
                    html.classList.toggle('a11y-big-cursor');
                    btn.setAttribute('aria-pressed', html.classList.contains('a11y-big-cursor'));
                } else if (action === 'stop-animations') {
                    html.classList.toggle('a11y-stop-animations');
                    btn.setAttribute('aria-pressed', html.classList.contains('a11y-stop-animations'));
                } else if (action === 'reset') {
                    html.classList.remove('a11y-contrast-high', 'a11y-contrast-invert', 'a11y-contrast-mono', 'a11y-readable-font', 'a11y-highlight-links', 'a11y-big-cursor', 'a11y-stop-animations');
                    fontScale = 100;
                    document.body.style.fontSize = '';
                    widgetContainer.querySelectorAll('.a11y-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
                }
            };
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initA11y);
    } else {
        initA11y();
    }
})();
