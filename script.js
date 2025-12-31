// 🚀 optimized script for conversion & performance

// 1. Mobile & Device Detection
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isMobile = window.innerWidth < 768;

// 2. Silk Ribbon Reveal Loader (Optimized for Mobile)
function initLoader() {
    const loader = document.querySelector('.loader');
    const content = document.querySelector('.loader-content');
    const letters = document.querySelectorAll('.entrance-letter');
    const tagline = document.querySelector('.loader-tagline');
    const progressWrap = document.querySelector('.progress-wrap');
    const progressBar = document.querySelector('.progress-bar-fill');
    const percentText = document.querySelector('.percent-val');
    const statusText = document.querySelector('.loading-status');

    // Initial Appearance & Stop Scroll
    if (typeof lenis !== 'undefined') lenis.stop();
    gsap.to(content, { opacity: 1, scale: 1, duration: 1.5, ease: "power4.out" });

    // Staggered Letter Reveal (DAE)
    gsap.to(letters, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.5
    });

    // Speed up loader for mobile
    const speedMultiplier = isMobile ? 2 : 1;
    let progress = 0;
    const statuses = ["Designing...", "Curating...", "Setting Stage...", "Ready."];

    const interval = setInterval(() => {
        progress += (Math.floor(Math.random() * 5) + 2) * speedMultiplier;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(finishLoading, isMobile ? 300 : 600);
        }

        if (progressBar) progressBar.style.width = progress + "%";
        if (percentText) percentText.innerText = progress + "%";

        const statusIdx = Math.floor((progress / 100) * (statuses.length - 1));
        if (statusText) statusText.innerText = statuses[statusIdx];
    }, 80);

    function finishLoading() {
        const tl = gsap.timeline();
        tl.to(content, {
            scale: 1.1,
            opacity: 0,
            duration: 0.8,
            ease: "power4.inOut"
        })
            .add(() => loader.classList.add('active'))
            .to(loader, {
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: "power2.inOut"
            })
            .to(loader, { display: "none" })
            .from(".hero-text-area h1, .gallery-hero h1", {
                y: 100,
                opacity: 0,
                filter: "blur(10px)",
                duration: 1.5,
                stagger: 0.1,
                ease: "expo.out"
            }, "-=0.2");

        // Start Lenis & Refresh ScrollTrigger
        if (typeof lenis !== 'undefined') {
            lenis.start();
            lenis.scrollTo(0, { immediate: true });
        }
        ScrollTrigger.refresh();
    }
}

window.addEventListener('DOMContentLoaded', initLoader);

// 3. Initialize Lenis (High-Performance Smooth Scroll)
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    smoothTouch: true, // Enabled for consistent premium feel on mobile
    touchMultiplier: 1.5,
    wheelMultiplier: 1,
    infinite: false,
});

// Synchronize GSAP with Lenis Ticker for maximum smoothness
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// Disable GSAP's internal ticker to avoid conflicts
gsap.ticker.lagSmoothing(0);

// Anchor link smooth scroll integration
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: -100,
                duration: 1.5,
            });
        }
    });
});



// 4. GSAP Plugins (Safely register)
const plugins = [ScrollTrigger];
if (typeof MotionPathPlugin !== 'undefined') plugins.push(MotionPathPlugin);
gsap.registerPlugin(...plugins);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);

// 5. Parallax & Reveal Effects
if (!isMobile) {
    gsap.utils.toArray('.img-float, .gallery-item-full img').forEach(img => {
        gsap.to(img, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5
            }
        });
    });
}

// Stats counting
document.querySelectorAll('.stat-item strong').forEach(stat => {
    gsap.from(stat, {
        scrollTrigger: {
            trigger: stat,
            start: "top 90%",
        },
        innerHTML: 0,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: "power1.out"
    });
});

// 6. Header Logic (Synced with Lenis)
const header = document.getElementById('header');
const isGalleryPage = window.location.pathname.includes('gallery.html');

if (isGalleryPage && header) {
    header.classList.add('scrolled');
}

// Use Lenis scroll event for perfectly synced header transitions
if (lenis) {
    lenis.on('scroll', ({ scroll }) => {
        if (!header) return;

        if (scroll > 50 || isGalleryPage) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Refresh on resize for layout stability
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// 7. Custom Cursor (Disabled on Mobile/Touch)
if (!isTouchDevice) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorSetter = {
        x: gsap.quickSetter(cursor, "left", "px"),
        y: gsap.quickSetter(cursor, "top", "px")
    };

    window.addEventListener('mousemove', (e) => {
        cursorSetter.x(e.clientX);
        cursorSetter.y(e.clientY);
    });

    document.querySelectorAll('.btn, a, .service-card, .faq-question').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// 8. FAQ Toggle
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');

        const icon = question.querySelector('i');
        document.querySelectorAll('.faq-question i').forEach(idx => idx.setAttribute('data-lucide', 'plus'));
        if (!isActive) icon.setAttribute('data-lucide', 'minus');
        lucide.createIcons();
    });
});

// 9. Simple Lazy Loading
const lazyImages = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});
lazyImages.forEach(img => {
    img.classList.add('lazy-load');
    imageObserver.observe(img);
});

// 10. Form Handling (Cinematic Feedback)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        btn.disabled = true;
        btn.innerHTML = 'Sending... <i data-lucide="loader-2" class="spin"></i>';
        lucide.createIcons();

        setTimeout(() => {
            btn.innerHTML = 'Message Sent! <i data-lucide="check-circle"></i>';
            btn.style.background = '#25D366';
            lucide.createIcons();
            contactForm.reset();

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = 'Get Free Consultation <i data-lucide="send"></i>';
                btn.style.background = '';
                lucide.createIcons();
            }, 3000);
        }, 2000);
    });
}

// 11. Timed Services (Auto-Cycle)
const timedCards = document.querySelectorAll(".service-card.timed");
let serviceIndex = 0;
if (timedCards.length > 0) {
    setInterval(() => {
        timedCards.forEach(c => c.classList.remove('active'));
        serviceIndex = (serviceIndex + 1) % timedCards.length;
        timedCards[serviceIndex].classList.add('active');
    }, 4000);
}
// 12. Magic Gallery Marquee (Running Images)
function initMagicMarquee() {
    const track = document.querySelector('.magic-track');
    if (!track) return;

    // Get original items
    const originalItems = Array.from(track.querySelectorAll('.magic-item'));
    if (originalItems.length === 0) return;

    const calculateAndAnimate = () => {
        // 1. cleanup: keep only original items
        // We find current children and remove those that are not in our original list
        const currentChildren = Array.from(track.children);
        currentChildren.forEach(child => {
            if (!originalItems.includes(child)) {
                child.remove();
            }
        });

        // 2. Clone sufficient items to fill screen width multiple times
        // Measure one item including gap (approximation for count calculation)
        const itemWidth = originalItems[0].getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const setWidth = (itemWidth + gap) * originalItems.length;

        // Ensure we cover viewport + buffer. 
        // We need at least one full set cloned to establish the loop period.
        const clonesNeeded = Math.ceil((window.innerWidth * 2) / setWidth) + 1;

        for (let i = 0; i < clonesNeeded; i++) {
            originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true'); // Accessibility
                track.appendChild(clone);
            });
        }

        // 3. Measure Precise LOOP STRIDE
        // The loop must reset exactly when the first CLONED item hits the position where 
        // the first ORIGINAL item started.
        // Distance = (First Clone Left) - (First Original Left)

        // Force layout recalc just in case
        void track.offsetWidth;

        const firstOriginal = originalItems[0];
        // The first clone of the first original is at index `originalItems.length`
        const firstClone = track.children[originalItems.length];

        if (!firstClone) return; // safety

        const startX = firstOriginal.getBoundingClientRect().left;
        const endX = firstClone.getBoundingClientRect().left;
        const stride = endX - startX;

        // 4. Animate
        gsap.killTweensOf(track);

        // Speed: 60 pixels per second
        const duration = stride / 60;

        // Reset to 0 immediately to start fresh
        gsap.set(track, { x: 0 });

        gsap.to(track, {
            x: -stride,
            duration: duration,
            ease: "none",
            repeat: -1,
            overwrite: true,
            modifiers: {
                x: gsap.utils.unitize(x => {
                    // Force x to stay in range [-stride, 0]
                    // When it goes past -stride, it wraps back closer to 0
                    return parseFloat(x) % stride;
                })
            }
        });
    };

    // Initial run
    // Wait for images if needed, or just run (images have dimension via CSS aspect-ratio/min-width)
    if (document.readyState === 'complete') {
        calculateAndAnimate();
    } else {
        window.addEventListener('load', calculateAndAnimate);
    }

    // Handle Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(calculateAndAnimate, 200);
    });

    // Pause on hover
    track.addEventListener('mouseenter', () => gsap.to(track, { timeScale: 0, duration: 0.5 }));
    track.addEventListener('mouseleave', () => gsap.to(track, { timeScale: 1, duration: 0.5 }));
}

// Initialize
initMagicMarquee();
