/**
 * GOR MARKETING - Interactive Motion Engine
 * Adds: Cursor Spotlight, 3D Card Tilt, Number Counters, and Live Floating Badges
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mouse Spotlight Light (Strict pointer-events: none)
    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    spotlight.style.cssText = 'position: fixed; width: 350px; height: 350px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 255, 136, 0.05), transparent 70%); pointer-events: none !important; transform: translate(-50%, -50%); z-index: 1;';
    document.body.appendChild(spotlight);

    window.addEventListener('mousemove', (e) => {
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
    });

    // 2. 3D Card Tilt on Mouse Move
    const cards = document.querySelectorAll('.bento-card, .bento-subcard, .mockup-frame');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // 3. Smooth Scroll ONLY for internal anchors with valid target
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});