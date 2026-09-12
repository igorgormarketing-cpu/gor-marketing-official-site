/* GOR MARKETING - Accessibility High-Performance Lightweight Engine */
(function(){
    var initialized = false;
    function initA11y() {
        if (initialized) return;
        initialized = true;
        
        var S = { fontSize: 0, contrast: false, invert: false, grayscale: false, dyslexia: false, links: false, animations: false };
        try { Object.assign(S, JSON.parse(localStorage.getItem('gor-a11y-prefs') || localStorage.getItem('gor-a11y') || '{}')); } catch(e){}
        
        var css = document.getElementById('ga-custom-css') || document.getElementById('ga-css') || document.createElement('style');
        css.id = 'ga-custom-css';
        if (!document.head.contains(css)) document.head.appendChild(css);

        function apply() {
            var c = '';
            if (S.fontSize) c += 'html { font-size: ' + (100 + S.fontSize * 10) + '% !important; } ';
            if (S.contrast) c += 'body, div, section, p, h1, h2, h3, h4, h5, span, li, article { background: #000000 !important; color: #ffffff !important; border-color: #ffffff !important; } a { color: #ffff00 !important; } ';
            if (S.invert) c += 'html { filter: invert(100%) hue-rotate(180deg) !important; background: #000 !important; } img, video { filter: invert(100%) hue-rotate(180deg) !important; } ';
            if (S.grayscale) c += 'html { filter: grayscale(100%) !important; } ';
            if (S.dyslexia) c += '* { font-family: Arial, sans-serif !important; letter-spacing: .04em !important; line-height: 1.8 !important; } ';
            if (S.links) c += 'a { text-decoration: underline !important; text-underline-offset: 4px !important; } ';
            if (S.animations) c += '*, *::before, *::after { animation: none !important; transition: none !important; } ';
            css.textContent = c;
            try { 
                localStorage.setItem('gor-a11y-prefs', JSON.stringify(S)); 
                localStorage.setItem('gor-a11y', JSON.stringify(S)); 
            } catch(e){}
        }

        window.toggleA11yFeature = function(feature, val) {
            if (feature === 'fontSize') {
                S.fontSize = Math.max(-2, Math.min(3, S.fontSize + (val || 1)));
            } else {
                S[feature] = !S[feature];
            }
            apply();
        };

        window.resetA11y = function() {
            S = { fontSize: 0, contrast: false, invert: false, grayscale: false, dyslexia: false, links: false, animations: false };
            apply();
        };

        window.toggleA11yPanel = function(open) {
            var panel = document.getElementById('accessibilityPanel');
            if (!panel) return;
            if (open === undefined) {
                panel.classList.toggle('active');
            } else if (open) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        };

        if (Object.values(S).some(Boolean)) {
            apply();
        }

        document.addEventListener('click', function(e) {
            var toggleBtn = e.target.closest('#gor-a11y-fab, #accessibilityToggleBtn, .accessibility-trigger');
            var closeBtn = e.target.closest('#a11yCloseBtn, .a11y-close');
            if (toggleBtn) {
                e.preventDefault();
                window.toggleA11yPanel();
            } else if (closeBtn) {
                e.preventDefault();
                window.toggleA11yPanel(false);
            }
        });
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(initA11y);
    } else {
        setTimeout(initA11y, 100);
    }
})();
