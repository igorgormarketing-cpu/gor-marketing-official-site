/**
 * GOR MARKETING - Interactive Motion Engine (Optimized)
 */
document.addEventListener('DOMContentLoaded', () => {
    // Only enable mouse cursor spotlights on desktop devices with a fine pointer
    if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768) {
        const spotlight = document.createElement('div');
        spotlight.className = 'cursor-spotlight';
        spotlight.style.cssText = 'position: fixed; width: 350px; height: 350px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 255, 136, 0.05), transparent 70%); pointer-events: none !important; transform: translate(-50%, -50%); z-index: 1;';
        document.body.appendChild(spotlight);

        let ticking = false;
        window.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    spotlight.style.left = e.clientX + 'px';
                    spotlight.style.top = e.clientY + 'px';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
});
