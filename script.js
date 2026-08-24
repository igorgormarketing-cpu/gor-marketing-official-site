// Reveal Animations on Scroll
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

// Reviews Carousel Logic - Updated for 6 items
const track = document.getElementById('review-carousel');
if (track) {
    const slides = Array.from(track.children);
    let index = 0;

    function moveCarousel() {
        const slideWidth = slides[0].getBoundingClientRect().width + 14; // width + gap (1rem approx 14px in our scale)
        index++;
        
        // Loop back to start if at the end
        // visibleItems: 5 for desktop, 3 for tablet, 1 for mobile
        let visibleItems = 5;
        if (window.innerWidth <= 768) visibleItems = 1;
        else if (window.innerWidth <= 1200) visibleItems = 3;

        if (index > slides.length - visibleItems) {
            index = 0;
        }

        track.style.transform = `translateX(${index * slideWidth}px)`;
    }

    // Auto-play every 4 seconds
    setInterval(moveCarousel, 4000);
}

// Chat CTA Interaction
const chatInput = document.querySelector('.chat-cta input');
const chatBtn = document.querySelector('.btn-chat');

if (chatBtn && chatInput) {
    chatBtn.addEventListener('click', () => {
        const val = chatInput.value;
        if (val) {
            window.location.href = `https://wa.me/972525155598?text=${encodeURIComponent('היי, אשמח לקבל פרטים נוספים לגבי: ' + val)}`;
        } else {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    });
}
