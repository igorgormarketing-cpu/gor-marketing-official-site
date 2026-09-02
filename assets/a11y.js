/* GOR MARKETING - Accessibility High-Performance Lightweight Engine */
(function(){
    var initialized = false;
    function initA11y() {
        if (initialized) return;
        initialized = true;
        
        var S = { fontSize: 0, contrast: false, invert: false, grayscale: false, dyslexia: false, links: false, animations: false, open: false };
        try { Object.assign(S, JSON.parse(localStorage.getItem('gor-a11y') || '{}')); } catch(e){}
        
        var css = document.getElementById('ga-css') || document.createElement('style');
        css.id = 'ga-css';
        if (!document.head.contains(css)) document.head.appendChild(css);

        function apply() {
            var c = '';
            if (S.fontSize) c += 'html { font-size: ' + (100 + S.fontSize * 10) + '% !important; } ';
            if (S.contrast) c += 'body, div, section, p, h1, h2, h3, h4, h5, span, li, article { background: #000000 !important; color: #ffffff !important; } a { color: #ffff00 !important; } ';
            if (S.invert) c += 'html { filter: invert(1) hue-rotate(180deg) !important; background: #000 !important; } img, video, iframe { filter: invert(1) hue-rotate(180deg) !important; } ';
            if (S.grayscale) c += 'html { filter: grayscale(1) !important; } ';
            if (S.dyslexia) c += '* { font-family: Arial, sans-serif !important; letter-spacing: .05em !important; line-height: 1.8 !important; } ';
            if (S.links) c += 'a { text-decoration: underline !important; text-decoration-thickness: 2px !important; text-underline-offset: 4px !important; } ';
            if (S.animations) c += '*, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; } ';
            css.textContent = c;
            try { localStorage.setItem('gor-a11y', JSON.stringify(S)); } catch(e){}
        }

        // Apply saved preferences without heavy layout queries
        if (Object.values(S).some(Boolean)) {
            apply();
        }

        var btn = document.getElementById('accessibilityToggleBtn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var panel = document.getElementById('accessibilityPanel');
                if (panel) {
                    panel.classList.toggle('active');
                }
            });
        }
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(initA11y);
    } else {
        setTimeout(initA11y, 250);
    }
})();
