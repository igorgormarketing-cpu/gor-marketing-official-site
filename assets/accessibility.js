/**
 * GOR MARKETING - Accessibility Plugin (תקן ת"י 5568 ברמה AA)
 * Bottom-Right Positioned Widget with Full Accessibility Toolset
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
            <h3 id="a11y-title"><i class="fas fa-universal-access" style="color: var(--cyan-accent);"></i> תפריט נגישות (ת"י 5568)</h3>
            <button class="a11y-close" aria-label="סגור תפריט נגישות">&times;</button>
        </div>

        <div class="a11y-grid">
            <button type="button" class="a11y-btn" data-action="font-plus"><i class="fas fa-text-height"></i> הגדל טקסט</button>
            <button type="button" class="a11y-btn" data-action="font-minus"><i class="fas fa-text-width"></i> הקטן טקסט</button>
            <button type="button" class="a11y-btn" data-action="high-contrast"><i class="fas fa-adjust"></i> ניגודיות כהה</button>
            <button type="button" class="a11y-btn" data-action="bright-contrast"><i class="fas fa-sun"></i> ניגודיות בהירה</button>
            <button type="button" class="a11y-btn" data-action="highlight-links"><i class="fas fa-link"></i> הדגש קישורים</button>
            <button type="button" class="a11y-btn" data-action="readable-font"><i class="fas fa-font"></i> גופן קריא</button>
            <button type="button" class="a11y-btn" data-action="stop-animations"><i class="fas fa-ban"></i> עצור אנימציה</button>
            <button type="button" class="a11y-btn" data-action="big-cursor"><i class="fas fa-mouse-pointer"></i> סמן מוגדל</button>
        </div>

        <button type="button" class="a11y-btn a11y-btn-reset" data-action="reset"><i class="fas fa-undo"></i> איפוס כל ההגדרות</button>

        <div class="a11y-footer-links">
            <div style="display: flex; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
                <a href="accessibility.html" style="color: var(--cyan-accent); font-size: 0.82rem; text-decoration: none; font-weight: 700;">
                    <i class="fas fa-file-contract"></i> הצהרת נגישות
                </a>
                <a href="sitemap.html" style="color: var(--gold-bright); font-size: 0.82rem; text-decoration: none; font-weight: 700;">
                    <i class="fas fa-sitemap"></i> מפת אתר
                </a>
            </div>
            <div style="color: #94a3b8; font-size: 0.75rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;">
                רכז נגישות: <strong>איגור גורלקין</strong> | 052-515-5598
            </div>
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

    function toggleModal(e) {
        if (e) e.stopPropagation();
        modal.classList.toggle('active');
        if (modal.classList.contains('active')) {
            modal.focus();
        }
    }

    trigger.addEventListener('click', toggleModal);
    closeBtn.addEventListener('click', toggleModal);

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (modal.classList.contains('active') && !modal.contains(e.target) && !trigger.contains(e.target)) {
            modal.classList.remove('active');
        }
    });

    // Keyboard shortcut (Alt + A)
    window.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ש')) {
            e.preventDefault();
            toggleModal();
        }
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Handle Actions
    const buttons = wrapper.querySelectorAll('.a11y-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
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
