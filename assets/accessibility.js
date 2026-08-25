/**
 * GOR MARKETING - Accessibility Plugin (תקן ת"י 5568 ברמה AA)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create Skip to Content
    if (!document.querySelector('.skip-to-content')) {
        const skip = document.createElement('a');
        skip.href = '#main-content';
        skip.className = 'skip-to-content';
        skip.innerText = 'דלג לתוכן המרכזי ↵';
        document.body.prepend(skip);
    }

    // Set id for main
    const mainEl = document.querySelector('main');
    if (mainEl && !mainEl.id) {
        mainEl.id = 'main-content';
    }

    // 2. Create Floating Accessibility Trigger & Modal
    const modalHtml = `
    <button class="accessibility-trigger" aria-label="פתח תפריט נגישות" title="תפריט נגישות (תקן AA)">
        <i class="fas fa-wheelchair" aria-hidden="true"></i>
    </button>

    <div class="accessibility-modal" role="dialog" aria-modal="true" aria-labelledby="a11y-title" tabindex="-1">
        <div class="a11y-header">
            <h3 id="a11y-title"><i class="fas fa-universal-access"></i> תפריט נגישות (ת"י 5568)</h3>
            <button class="a11y-close" aria-label="סגור תפריט נגישות">&times;</button>
        </div>

        <div class="a11y-grid">
            <button class="a11y-btn" data-action="font-plus"><i class="fas fa-text-height"></i> הגדל טקסט (+)</button>
            <button class="a11y-btn" data-action="font-minus"><i class="fas fa-text-width"></i> הקטן טקסט (-)</button>
            <button class="a11y-btn" data-action="high-contrast"><i class="fas fa-adjust"></i> ניגודיות כהה</button>
            <button class="a11y-btn" data-action="bright-contrast"><i class="fas fa-sun"></i> ניגודיות בהירה</button>
            <button class="a11y-btn" data-action="highlight-links"><i class="fas fa-link"></i> הדגשת קישורים</button>
            <button class="a11y-btn" data-action="readable-font"><i class="fas fa-font"></i> גופן קריא</button>
            <button class="a11y-btn" data-action="stop-animations"><i class="fas fa-ban"></i> עצירת אנימציות</button>
            <button class="a11y-btn" data-action="big-cursor"><i class="fas fa-mouse-pointer"></i> סמן מוגדל</button>
        </div>

        <button class="a11y-btn" data-action="reset" style="width: 100%; margin-bottom: 12px; background: rgba(255,255,255,0.08); border-color: var(--border-gold);"><i class="fas fa-undo"></i> איפוס כל ההגדרות</button>

        <div class="a11y-footer-links">
            <a href="accessibility.html"><i class="fas fa-file-contract"></i> הצהרת נגישות מלאה</a>
            <a href="sitemap.html"><i class="fas fa-sitemap"></i> מפת אתר נגישה</a>
            <span style="color: #94a3b8; font-size: 0.78rem;">רכז נגישות: איגור גורלקין | 052-515-5598</span>
        </div>
    </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.id = 'gor-accessibility-widget';
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper);

    const trigger = wrapper.querySelector('.accessibility-trigger');
    const modal = wrapper.querySelector('.accessibility-modal');
    const closeBtn = wrapper.querySelector('.a11y-close');

    function toggleModal() {
        modal.classList.toggle('active');
        if (modal.classList.contains('active')) {
            modal.focus();
        }
    }

    trigger.addEventListener('click', toggleModal);
    closeBtn.addEventListener('click', toggleModal);

    // Keyboard shortcut (Alt + A)
    window.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ש')) {
            e.preventDefault();
            toggleModal();
        }
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            toggleModal();
        }
    });

    // Handle Actions
    const buttons = wrapper.querySelectorAll('.a11y-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const act = btn.getAttribute('data-action');
            if (act === 'font-plus') {
                if (document.body.classList.contains('a11y-font-large')) {
                    document.body.classList.remove('a11y-font-large');
                    document.body.classList.add('a11y-font-xlarge');
                } else if (!document.body.classList.contains('a11y-font-xlarge')) {
                    document.body.classList.add('a11y-font-large');
                }
            } else if (act === 'font-minus') {
                document.body.classList.remove('a11y-font-xlarge');
                document.body.classList.remove('a11y-font-large');
            } else if (act === 'high-contrast') {
                document.body.classList.remove('a11y-bright-contrast');
                document.body.classList.toggle('a11y-high-contrast');
            } else if (act === 'bright-contrast') {
                document.body.classList.remove('a11y-high-contrast');
                document.body.classList.toggle('a11y-bright-contrast');
            } else if (act === 'highlight-links') {
                document.body.classList.toggle('a11y-highlight-links');
            } else if (act === 'readable-font') {
                document.body.classList.toggle('a11y-readable-font');
            } else if (act === 'stop-animations') {
                document.body.classList.toggle('a11y-stop-animations');
            } else if (act === 'big-cursor') {
                document.body.classList.toggle('a11y-big-cursor');
            } else if (act === 'reset') {
                document.body.className = '';
            }
        });
    });
});
