/**
 * Evolution Custom SC — Script Principal
 * LED Canopy · Color Switcher · UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ═══════════════════════════════════
       NAVBAR SCROLL
       ═══════════════════════════════════ */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    /* ═══════════════════════════════════
       MOBILE MENU
       ═══════════════════════════════════ */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks   = document.getElementById('navLinks');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    /* ═══════════════════════════════════
       SMOOTH SCROLL
       ═══════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ═══════════════════════════════════
       LED CANOPY GENERATOR
       ═══════════════════════════════════ */
    const ledGrid   = document.getElementById('ledGrid');
    const ROWS      = 4;
    const COLS      = 12;
    const TOTAL     = ROWS * COLS;

    for (let i = 0; i < TOTAL; i++) {
        const dot = document.createElement('div');
        dot.className = 'led-dot';
        // Stagger delays for organic look
        const delay = (Math.random() * 3 + 1).toFixed(2) + 's';
        dot.style.setProperty('--delay', delay);
        // Vary brightness for depth
        const scale = (0.5 + Math.random() * 0.8).toFixed(2);
        dot.style.transform = `scale(${scale})`;
        ledGrid.appendChild(dot);
    }

    /* ═══════════════════════════════════
       CAR COLOR SWITCHER
       ═══════════════════════════════════ */
    /* ═══════════════════════════════════
       CAR COLOR SWITCHER & WRAP SCANNER
       ═══════════════════════════════════ */
    const carLayers    = document.querySelectorAll('.car-layer');
    const colorBtns    = document.querySelectorAll('.color-btn');
    const laserScanner = document.getElementById('laserScanner');
    const heroSection  = document.getElementById('home');

    // Map button data-car to car layer IDs
    const layerMap = {
        silver: document.getElementById('car-silver'),
        black:  document.getElementById('car-black'),
        red:    document.getElementById('car-red'),
        blue:   document.getElementById('car-blue'),
        green:  document.getElementById('car-green'),
        gold:   document.getElementById('car-gold'),
    };

    const colorMeta = {
        silver: { hex: '#d0d0d0', rgb: '200, 200, 200', glow: 'rgba(200, 200, 200, 0.4)' },
        black:  { hex: '#6aff2e', rgb: '106, 255, 46',   glow: 'rgba(106, 255, 46, 0.4)' },
        red:    { hex: '#ff2a2a', rgb: '255, 42, 42',    glow: 'rgba(255, 42, 42, 0.4)' },
        blue:   { hex: '#00a2ff', rgb: '0, 162, 255',    glow: 'rgba(0, 162, 255, 0.4)' },
        green:  { hex: '#6aff2e', rgb: '106, 255, 46',   glow: 'rgba(106, 255, 46, 0.4)' },
        gold:   { hex: '#ffd700', rgb: '255, 215, 0',    glow: 'rgba(255, 215, 0, 0.4)' },
    };

    let currentColor = 'silver';
    let isTransitioning = false;

    function switchColor(colorKey) {
        if (colorKey === currentColor || isTransitioning) return;

        const prevLayer   = layerMap[currentColor];
        const targetLayer = layerMap[colorKey];
        const targetBtn   = document.getElementById('btn-' + colorKey);
        const meta        = colorMeta[colorKey] || colorMeta.silver;

        if (!targetLayer) return;

        isTransitioning = true;

        // Update buttons immediately
        colorBtns.forEach(b => b.classList.remove('active'));
        if (targetBtn) {
            targetBtn.classList.add('active');
            targetBtn.style.setProperty('--active-color', meta.hex);
        }

        // Set CSS variables for laser color & ambient lighting
        document.documentElement.style.setProperty('--scan-color', meta.hex);
        document.documentElement.style.setProperty('--scan-glow', meta.glow);
        heroSection.style.setProperty('--car-ambient', `rgba(${meta.rgb}, 0.16)`);

        // Keep current layer visible underneath
        carLayers.forEach(l => {
            l.classList.remove('prev-layer', 'wrap-transition');
        });
        if (prevLayer) {
            prevLayer.classList.add('prev-layer');
            prevLayer.classList.remove('active');
        }

        // Prepare target layer
        targetLayer.classList.remove('active');
        // Force browser reflow to restart CSS keyframe animation
        void targetLayer.offsetWidth;
        targetLayer.classList.add('active', 'wrap-transition');

        // Trigger laser scanner line
        if (laserScanner) {
            laserScanner.classList.remove('scanning');
            void laserScanner.offsetWidth;
            laserScanner.classList.add('scanning');
        }

        // Subtle LED Canopy pulse
        const ledCanopy = document.getElementById('ledCanopy');
        if (ledCanopy) {
            ledCanopy.style.filter = 'brightness(1.5)';
            setTimeout(() => {
                ledCanopy.style.filter = 'brightness(1)';
            }, 700);
        }

        currentColor = colorKey;

        // Cleanup after transition finishes
        setTimeout(() => {
            if (prevLayer) prevLayer.classList.remove('prev-layer');
            targetLayer.classList.remove('wrap-transition');
            if (laserScanner) laserScanner.classList.remove('scanning');
            isTransitioning = false;
        }, 720);
    }

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const colorKey = btn.getAttribute('data-car');
            switchColor(colorKey);
        });

        // Keyboard support
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const colorKey = btn.getAttribute('data-car');
                switchColor(colorKey);
            }
        });
    });

    /* ═══════════════════════════════════
       SCROLL REVEAL (IntersectionObserver)
       ═══════════════════════════════════ */
    const revealEls = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger siblings
                const siblings = entry.target.parentElement.querySelectorAll('.scroll-reveal:not(.visible)');
                siblings.forEach((el, idx) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, idx * 120);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));

    /* ═══════════════════════════════════
       COUPON FORM → WHATSAPP
       ═══════════════════════════════════ */
    const couponForm  = document.getElementById('couponForm');
    const couponInput = document.getElementById('couponInput');

    couponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const coupon = couponInput.value.trim().toUpperCase();

        if (!coupon) {
            // Shake animation for empty input
            couponInput.style.animation = 'none';
            couponInput.offsetHeight; // reflow
            couponInput.parentElement.style.animation = 'shakeInput 0.4s ease';
            setTimeout(() => { couponInput.parentElement.style.animation = ''; }, 400);
            couponInput.placeholder = 'Por favor, insira um cupom válido';
            couponInput.focus();
            return;
        }

        const msg = encodeURIComponent(
            `Olá! Vim pelo site e gostaria de usar o cupom de desconto: *${coupon}* 🏷️`
        );
        window.open(`https://wa.me/5548988016270?text=${msg}`, '_blank');
    });

    /* ═══════════════════════════════════
       WHATSAPP FLOAT HIDE ON FOOTER
       ═══════════════════════════════════ */
    const wppFloat = document.getElementById('whatsapp-float');
    const footer   = document.querySelector('footer');

    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Adjust position when footer is visible
            if (entry.isIntersecting) {
                wppFloat.style.bottom = (footer.offsetHeight + 16) + 'px';
            } else {
                wppFloat.style.bottom = '32px';
            }
        });
    }, { threshold: 0 });

    if (footer) footerObserver.observe(footer);

    /* ═══════════════════════════════════
       AUTOPLAY & VIDEO TIMING CONTROL
       ═══════════════════════════════════ */
    const videos = document.querySelectorAll('.video-placeholder video');
    videos.forEach(v => {
        v.muted = true;
        const playPromise = v.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.addEventListener('touchstart', () => v.play(), { once: true });
                document.addEventListener('click', () => v.play(), { once: true });
            });
        }
    });

    const videoServico2 = document.getElementById('video-servico-2');
    if (videoServico2) {
        videoServico2.currentTime = 2;
        videoServico2.addEventListener('loadedmetadata', () => {
            videoServico2.currentTime = 2;
        });
        videoServico2.addEventListener('timeupdate', () => {
            if (videoServico2.currentTime < 1.8 && !videoServico2.seeking) {
                videoServico2.currentTime = 2;
            }
        });
    }

    /* ═══════════════════════════════════
       HERO AMBIENT GRADIENT (dynamic)
       ═══════════════════════════════════ */
    // Add CSS variable support for ambient car glow
    const heroStyle = document.getElementById('home');
    heroStyle.style.setProperty('--car-ambient', 'rgba(200,200,200,0.08)');

    // Dynamically add ambient radial overlay
    const ambientEl = document.createElement('div');
    ambientEl.style.cssText = `
        position: absolute;
        bottom: 0; left: 50%; right: 0;
        transform: translateX(0);
        width: 100%; height: 50%;
        background: radial-gradient(ellipse at 65% 100%, var(--car-ambient, transparent), transparent 70%);
        z-index: 5;
        pointer-events: none;
        transition: background 0.8s ease;
    `;
    document.getElementById('heroReveal') || document.querySelector('.hero-section').appendChild(ambientEl);

    /* ═══════════════════════════════════
       CUSTOM CURSOR GREEN HIGHLIGHT LOGIC
       ═══════════════════════════════════ */
    const cursorDot  = document.getElementById('cursorDot');
    const cursorGlow = document.getElementById('cursorGlow');

    if (cursorDot && cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = -100, mouseY = -100;
        let glowX  = -100, glowY  = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        function animateCursor() {
            glowX += (mouseX - glowX) * 0.18;
            glowY += (mouseY - glowY) * 0.18;
            cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Expand cursor glow over interactive elements
        const hoverTargetSelector = 'a, button, input, .color-btn, .service-card, .video-card, .award-card, .review-card, .logo';
        document.querySelectorAll(hoverTargetSelector).forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Hide cursor when pointer leaves window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity  = '0';
            cursorGlow.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity  = '1';
            cursorGlow.style.opacity = '1';
        });
    }

});

/* ═══════════════════════════════════
   CSS ANIMATION — shake (injected)
   ═══════════════════════════════════ */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shakeInput {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-8px); }
        40%       { transform: translateX(8px); }
        60%       { transform: translateX(-5px); }
        80%       { transform: translateX(5px); }
    }
`;
document.head.appendChild(styleSheet);
