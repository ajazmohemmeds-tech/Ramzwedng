// 0. Auto-Scroll for Mobile Inactivity (Tour Mode)
function initAutoScroll() {
    if (window.innerWidth > 768) return; 

    const sections = [
        '#verse-card',
        '#schedule',
        '#venue',
        '#countdown-section',
        '.luxury-footer'
    ];
    let currentStep = 0;
    let autoScrollTimeout;
    let isTourActive = false;

    const startTour = () => {
        if (currentStep >= sections.length) {
            isTourActive = false;
            return;
        }
        
        isTourActive = true;
        lenis.scrollTo(sections[currentStep], { 
            duration: 2.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            onComplete: () => {
                currentStep++;
                if (currentStep < sections.length) {
                    autoScrollTimeout = setTimeout(startTour, 3000);
                } else {
                    isTourActive = false;
                }
            }
        });
    };

    const cancelAutoScroll = (e) => {
        clearTimeout(autoScrollTimeout);
        isTourActive = false;
        window.removeEventListener('touchstart', cancelAutoScroll);
        window.removeEventListener('wheel', cancelAutoScroll);
        window.removeEventListener('mousedown', cancelAutoScroll);
    };

    autoScrollTimeout = setTimeout(() => {
        if (window.scrollY < 50) {
            startTour();
        }
    }, 4000);

    window.addEventListener('touchstart', cancelAutoScroll, { passive: true });
    window.addEventListener('wheel', cancelAutoScroll, { passive: true });
    window.addEventListener('mousedown', cancelAutoScroll, { passive: true });
}

// 1. Loading Screen Handler
const loader = document.getElementById('loading-screen');
if (loader) {
    setTimeout(() => {
        loader.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), visibility 1.5s';
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        const heroVid = document.querySelector('.hero-video');
        if (heroVid) {
            heroVid.muted = true;
            heroVid.defaultMuted = true;
            heroVid.play().catch(e => console.warn("Video autoplay failed (Low Power mode?):", e));
        }
        lenis.start();
        document.body.classList.remove('is-loading');
        initAutoScroll();
        setTimeout(() => {
            loader.style.display = 'none';
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
            }, { threshold: 0.1 });
            document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
        }, 1500);
    }, 5500);
}

// 2. Lenis Scroll
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8,
    lerp: 0.06,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
lenis.stop();

document.addEventListener('DOMContentLoaded', () => {
    // Venue Image Double Click / Double Tap Map (Unified)
    const venueImg = document.getElementById('venue-img');
    if (venueImg) {
        let lastClick = 0;
        const openMap = () => {
            console.log("Opening Map...");
            window.location.href = 'https://maps.app.goo.gl/HiKVKsMaU8eRgSUN8';
        };

        venueImg.addEventListener('click', (e) => {
            openMap();
        });
    }

    const targetDate = new Date('July 12, 2026 11:00:00').getTime();
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const fill = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val.toString().padStart(2, '0'); };
        fill('days', days); 
        fill('hours', hours); 
        fill('minutes', minutes); 
        fill('seconds', seconds); 
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();



    const smartCalBtn = document.getElementById('smart-calendar-btn');
    if (smartCalBtn) {
        smartCalBtn.addEventListener('click', () => {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) {
                // Serve real .ics file via a hidden iframe so the page doesn't navigate/refresh
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = 'event.ics';
                document.body.appendChild(iframe);
                setTimeout(() => document.body.removeChild(iframe), 2000);
            } else {
                // Google Calendar
                const googleUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ramees+%26+Anziya+Reception+day&dates=20260712T053000Z/20260712T083000Z&details=Join+us+to+celebrate+the+reception+of+Ramees+and+Anziya!&location=KMR+Convention+Center,+Kerala,+India";
                window.open(googleUrl, '_blank');
            }
        });
    }

});
