/**
 * GOR MARKETING - Accessibility Plugin (תקן נגישות ת"י 5568 / 1918 ברמת AA)
 * רכיב נגישות צף מונגש עם תפריט כלים מתקדם וקיצורי מקלדת
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create Skip to Content
    if (!document.querySelector('.skip-to-content')) {
        const skip = document.createElement('a');
        skip.href = '#main-content';
        skip.className = 'skip-to-content';
        skip.innerText = 'דלג לתוכן המרכזי ⬇';
        document.body.prepend(skip);
    }

    // Set id for main
    const mainEl = document.querySelector('main');
    if (mainEl && !mainEl.id) {
        mainEl.id = 'main-content';
    }

    // 2. Remove any existing widget to prevent duplicates
    const existing = document.getElementById('gor-accessibility-widget');
    if (existing) existing.remove();

    // 3. Create Floating Accessibility Trigger & Modal
    const modalHtml = `
    <button class="accessibility-trigger" aria-label="פתח תפריט נגישות" title="תפריט נגישות (תקן AA - Alt+A)">
        <i class="fas fa-universal-access" aria-hidden="true"></i>
    </button>

    <div class="accessibility-modal" role="dialog" aria-modal="true" aria-labelledby="a11y-title" tabindex="-1">
        <div class="a11y-header">
            <h3 id="a11y-title"><i class="fas fa-universal-access" style="color: var(--cyan-accent);"></i> תפריט נגישות (תקן 5568)</h3>
            <button class="a11y-close" aria-label="סגור תפריט נגישות">&times;</button>
        </div>

        <div class="a11y-grid">
            <button type="button" class="a11y-btn" data-action="font-plus"><i class="fas fa-text-height"></i> הגדל טקסט</button>
            <button type="button" class="a11y-btn" data-action="font-minus"><i class="fas fa-text-width"></i> הקטן טקסט</button>
            <button type="button" class="a11y-btn" data-action="high-contrast"><i class="fas fa-adjust"></i> ניגודיות גבוהה</button>
            <button type="button" class="a11y-btn" data-action="invert-colors"><i class="fas fa-eye"></i> ניגודיות הפוכה</button>
            <button type="button" class="a11y-btn" data-action="highlight-links"><i class="fas fa-link"></i> הדגש קישורים</button>
            <button type="button" class="a11y-btn" data-action="readable-font"><i class="fas fa-font"></i> גופן קריא</button>
            <button type="button" class="a11y-btn" data-action="stop-animations"><i class="fas fa-pause"></i> עצור אנימציות</button>
            <button type="button" class="a11y-btn" data-action="big-cursor"><i class="fas fa-mouse-pointer"></i> סמן מוגדל</button>
        </div>

        <div class="a11y-footer">
            <button type="button" class="a11y-btn a11y-reset" data-action="reset"><i class="fas fa-redo"></i> איפוס הגדרות</button>
            <a href="accessibility.html" class="a11y-statement-link"><i class="fas fa-file-alt"></i> הצהרת נגישות</a>
        </div>
    </div>`;

    const widgetWrap = document.createElement('div');
    widgetWrap.id = 'gor-accessibility-widget';
    widgetWrap.innerHTML = modalHtml;
    document.body.appendChild(widgetWrap);

    const trigger = widgetWrap.querySelector('.accessibility-trigger');
    const modal = widgetWrap.querySelector('.accessibility-modal');
    const closeBtn = widgetWrap.querySelector('.a11y-close');
    const buttons = widgetWrap.querySelectorAll('.a11y-btn');

    let currentFontSize = 100;

    function toggleModal() {
        const isOpen = modal.classList.toggle('active');
        trigger.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
            modal.focus();
        } else {
            trigger.focus();
        }
    }

    trigger.addEventListener('click', toggleModal);
    closeBtn.addEventListener('click', toggleModal);

    // Keyboard Shortcut Alt+A
    document.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ש')) {
            e.preventDefault();
            toggleModal();
        }
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            toggleModal();
        }
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleAction(action, btn);
        });
    });

    function handleAction(action, btn) {
        const body = document.body;
        const html = document.documentElement;

        switch (action) {
            case 'font-plus':
                if (currentFontSize < 130) {
                    currentFontSize += 10;
                    html.style.fontSize = currentFontSize + '%';
                }
                break;
            case 'font-minus':
                if (currentFontSize > 80) {
                    currentFontSize -= 10;
                    html.style.fontSize = currentFontSize + '%';
                }
                break;
            case 'high-contrast':
                body.classList.toggle('a11y-high-contrast');
                btn.classList.toggle('active');
                break;
            case 'invert-colors':
                body.classList.toggle('a11y-invert');
                btn.classList.toggle('active');
                break;
            case 'highlight-links':
                body.classList.toggle('a11y-highlight-links');
                btn.classList.toggle('active');
                break;
            case 'readable-font':
                body.classList.toggle('a11y-readable-font');
                btn.classList.toggle('active');
                break;
            case 'stop-animations':
                body.classList.toggle('a11y-stop-animations');
                btn.classList.toggle('active');
                break;
            case 'big-cursor':
                body.classList.toggle('a11y-big-cursor');
                btn.classList.toggle('active');
                break;
            case 'reset':
                currentFontSize = 100;
                html.style.fontSize = '';
                body.className = body.className.replace(/a11y-[\w-]+/g, '').trim();
                buttons.forEach(b => b.classList.remove('active'));
                break;
        }
    }
});
