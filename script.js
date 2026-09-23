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
       HERO SERVICE CONTROLLER
       ═══════════════════════════════════ */
    const heroSection  = document.getElementById('home');
    const laserScanner = document.getElementById('laserScanner');

    // HUD Elements
    const hudMetric1 = document.getElementById('hud-metric-1');
    const hudMetric2 = document.getElementById('hud-metric-2');
    const hudMetric3 = document.getElementById('hud-metric-3');
    const hudMetric4 = document.getElementById('hud-metric-4');

    // Hero text elements
    const heroEyebrow    = document.getElementById('heroEyebrow');
    const heroTitle      = document.getElementById('heroTitle');
    const heroTitleAccent = document.getElementById('heroTitleAccent');
    const heroSubtitle   = document.getElementById('heroSubtitle');

    // Service data map
    const serviceData = {
        'peliculas': {
            eyebrowIcon: 'fa-sun',
            eyebrow:     'Películas Nano-Cerâmicas',
            titleLine1:  'Proteção Térmica &',
            accent:      'Clareza HD',
            titleLine3:  'Nano-Cerâmica.',
            subtitle:    '99% Rejeição de Calor · 99.9% Bloqueio UV · Sem Escurecer Vidros',
            slideId:     'slide-peliculas',
            scanColor:   '#00d2ff',
            scanRgb:     '0, 210, 255',
            hudIcons:    ['fa-fire-flame-curved', 'fa-sun', 'fa-temperature-arrow-down', 'fa-microchip'],
            hudColors:   ['#00d2ff', '#00d2ff', '#00d2ff', '#6aff2e'],
            metrics:     ['99% Rejeição IR', '99.9% Bloqueio UV', '-15°C no Interior', 'Nano-Cerâmica Carbon'],
        },
        'ppf': {
            eyebrowIcon: 'fa-shield-halved',
            eyebrow:     'Proteção PPF',
            titleLine1:  'Blindagem Invisível &',
            accent:      'Auto-Regenerativa',
            titleLine3:  'PPF Premium.',
            subtitle:    'Self-Healing Térmico · Anti-Impacto · Hidrofobia Extrema',
            slideId:     'slide-ppf',
            scanColor:   '#6aff2e',
            scanRgb:     '106, 255, 46',
            hudIcons:    ['fa-shield-halved', 'fa-droplet', 'fa-star', 'fa-certificate'],
            hudColors:   ['#6aff2e', '#6aff2e', '#6aff2e', '#6aff2e'],
            metrics:     ['Self-Healing Ativo', 'Hidrofóbico Extremo', 'Anti-Impacto / Pedras', '10 Anos de Garantia'],
        },
    };

    let currentService   = 'peliculas';
    let isTransitioning  = false;

    function updateHudChip(chipEl, icon, color, text) {
        const iconEl = chipEl.querySelector('i');
        const textEl = chipEl.querySelector('span');
        if (iconEl) {
            iconEl.className = `fa-solid ${icon}`;
            iconEl.style.color = color;
        }
        if (textEl) textEl.textContent = text;
    }

    function switchService(key) {
        if (key === currentService || isTransitioning) return;
        const data = serviceData[key];
        if (!data) return;

        isTransitioning = true;

        // --- Button active state ---
        document.querySelectorAll('.svc-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById('svc-btn-' + key);
        if (activeBtn) activeBtn.classList.add('active');

        // --- CSS vars for laser & ambient ---
        document.documentElement.style.setProperty('--scan-color', data.scanColor);
        if (heroSection) heroSection.style.setProperty('--car-ambient', `rgba(${data.scanRgb}, 0.12)`);

        // --- Slide transition ---
        const prevSlide = document.getElementById(serviceData[currentService].slideId);
        const nextSlide = document.getElementById(data.slideId);

        if (prevSlide) {
            prevSlide.classList.remove('active');
            prevSlide.classList.add('slide-exit');
            setTimeout(() => prevSlide.classList.remove('slide-exit'), 800);
        }

        // Fire laser scanner
        if (laserScanner) {
            laserScanner.classList.remove('scanning');
            void laserScanner.offsetWidth;
            laserScanner.classList.add('scanning');
            setTimeout(() => laserScanner.classList.remove('scanning'), 720);
        }

        // Activate next slide with slight delay for drama
        setTimeout(() => {
            if (nextSlide) {
                nextSlide.classList.add('active');
                // Make sure video in next slide plays
                const vid = nextSlide.querySelector('video');
                if (vid) {
                    vid.currentTime = 0;
                    vid.play().catch(() => {});
                }
            }
        }, 80);

        // --- LED Canopy pulse ---
        const ledCanopy = document.getElementById('ledCanopy');
        if (ledCanopy) {
            ledCanopy.style.filter = 'brightness(1.8) hue-rotate(30deg)';
            setTimeout(() => { ledCanopy.style.filter = 'brightness(1)'; }, 700);
        }

        // --- HUD update ---
        const hudChips = [
            document.getElementById('hud-chip-1'),
            document.getElementById('hud-chip-2'),
            document.getElementById('hud-chip-3'),
            document.getElementById('hud-chip-4'),
        ];
        hudChips.forEach((chip, i) => {
            if (!chip) return;
            chip.style.opacity = '0';
            chip.style.transform = 'translateY(-8px)';
            setTimeout(() => {
                updateHudChip(chip, data.hudIcons[i], data.hudColors[i], data.metrics[i]);
                chip.style.opacity = '1';
                chip.style.transform = 'translateY(0)';
            }, 200 + i * 80);
        });

        // --- Hero text update ---
        if (heroEyebrow) {
            heroEyebrow.style.opacity = '0';
            setTimeout(() => {
                heroEyebrow.innerHTML = `<i class="fa-solid ${data.eyebrowIcon}"></i> ${data.eyebrow}`;
                heroEyebrow.style.opacity = '1';
            }, 180);
        }
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            setTimeout(() => {
                heroTitle.innerHTML = `${data.titleLine1}<br><span class="text-green" id="heroTitleAccent">${data.accent}</span><br>${data.titleLine3}`;
                heroTitle.style.opacity = '1';
            }, 200);
        }
        if (heroSubtitle) {
            heroSubtitle.style.opacity = '0';
            setTimeout(() => {
                heroSubtitle.textContent = data.subtitle;
                heroSubtitle.style.opacity = '1';
            }, 240);
        }

        currentService = key;
        setTimeout(() => { isTransitioning = false; }, 820);
    }

    // Attach click handlers to service buttons
    document.querySelectorAll('.svc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const svc = btn.getAttribute('data-service');
            switchService(svc);
        });
    });

    // Auto-rotate services every 8 seconds
    const serviceKeys = ['peliculas', 'ppf'];
    let autoRotateIdx = 0;
    let autoRotateTimer = setInterval(() => {
        autoRotateIdx = (autoRotateIdx + 1) % serviceKeys.length;
        switchService(serviceKeys[autoRotateIdx]);
    }, 8000);

    // Pause auto-rotate on user interaction
    document.querySelectorAll('.svc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            clearInterval(autoRotateTimer);
            autoRotateIdx = serviceKeys.indexOf(btn.getAttribute('data-service'));
            // Restart after 20s of inactivity
            autoRotateTimer = setInterval(() => {
                autoRotateIdx = (autoRotateIdx + 1) % serviceKeys.length;
                switchService(serviceKeys[autoRotateIdx]);
            }, 8000);
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
       HERO SLIDE VIDEOS AUTOPLAY
       ═══════════════════════════════════ */
    // Ensure all hero slide videos are muted and try to play
    document.querySelectorAll('.hero-service-slide video').forEach(v => {
        v.muted = true;
        v.play().catch(() => {
            document.addEventListener('touchstart', () => v.play(), { once: true });
            document.addEventListener('click', () => v.play(), { once: true });
        });
    });

    /* ═══════════════════════════════════
       GALLERY VIDEOS AUTOPLAY
       ═══════════════════════════════════ */
    document.querySelectorAll('.video-placeholder video').forEach(v => {
        v.muted = true;
        v.play().catch(() => {
            document.addEventListener('touchstart', () => v.play(), { once: true });
            document.addEventListener('click', () => v.play(), { once: true });
        });
    });

    /* ═══════════════════════════════════
       HERO AMBIENT GRADIENT (dynamic)
       ═══════════════════════════════════ */
    const heroStyle = document.getElementById('home');
    heroStyle.style.setProperty('--car-ambient', 'rgba(0, 210, 255, 0.10)');

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
    document.querySelector('.hero-section').appendChild(ambientEl);

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
