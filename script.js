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

    // Hero text elements
    const heroEyebrow     = document.getElementById('heroEyebrow');
    const heroTitle       = document.getElementById('heroTitle');
    const heroTitleAccent = document.getElementById('heroTitleAccent');
    const heroSubtitle    = document.getElementById('heroSubtitle');

    // Service data map
    const serviceData = {
        'ppf': {
            eyebrowIcon: 'fa-shield-halved',
            eyebrow:     'Proteção PPF',
            titleLine1:  'Proteja seu patrimônio',
            accent:      'contra pedras,',
            titleLine3:  'riscos e sol.',
            subtitle:    'Self Healing, hidrofóbico, brilho extremo.',
            slideId:     'slide-ppf',
            scanColor:   '#6aff2e',
            scanRgb:     '106, 255, 46',
        },
        'peliculas': {
            eyebrowIcon: 'fa-sun',
            eyebrow:     'Películas Nano-Cerâmicas',
            titleLine1:  'Proteção Térmica,',
            accent:      'Visibilidade',
            titleLine3:  'e Privacidade.',
            subtitle:    'Corte computadorizado, Cuidado nos detalhes',
            slideId:     'slide-peliculas',
            scanColor:   '#00d2ff',
            scanRgb:     '0, 210, 255',
        },
    };

    let currentService  = 'ppf';
    let isTransitioning = false;

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
    const serviceKeys = ['ppf', 'peliculas'];
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
       GALLERY CAROUSEL
       ═══════════════════════════════════ */
    const galleryCarousel = document.getElementById('galleryCarousel');
    if (galleryCarousel) {
        const track       = document.getElementById('carouselTrack');
        const prevBtn     = document.getElementById('carouselPrev');
        const nextBtn     = document.getElementById('carouselNext');
        const dotsBox     = document.getElementById('carouselDots');
        const slides      = track ? track.querySelectorAll('.carousel-slide') : [];
        const totalSlides = slides.length;
        let currentIndex  = 0;

        function getVisibleCount() {
            return window.innerWidth <= 900 ? 1 : 2;
        }

        function getMaxIndex() {
            return Math.max(0, totalSlides - getVisibleCount());
        }

        function renderDots() {
            if (!dotsBox) return;
            dotsBox.innerHTML = '';
            const maxIdx = getMaxIndex();
            for (let i = 0; i <= maxIdx; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
                dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsBox.appendChild(dot);
            }
        }

        function updateSlideVideos() {
            const visibleCount = getVisibleCount();
            slides.forEach((slide, idx) => {
                const vid = slide.querySelector('video');
                if (!vid) return;
                const isVisible = idx >= currentIndex && idx < currentIndex + visibleCount;
                if (isVisible) {
                    vid.play().catch(() => {});
                } else {
                    vid.pause();
                }
            });
        }

        function goToSlide(index) {
            const maxIdx = getMaxIndex();
            currentIndex = Math.max(0, Math.min(index, maxIdx));

            if (slides[0] && track) {
                const slideWidth = slides[0].getBoundingClientRect().width;
                const gap = 24;
                const offset = currentIndex * (slideWidth + gap);
                track.style.transform = `translateX(-${offset}px)`;
            }

            if (dotsBox) {
                const dots = dotsBox.querySelectorAll('.carousel-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }

            updateSlideVideos();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const maxIdx = getMaxIndex();
                goToSlide(currentIndex === 0 ? maxIdx : currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const maxIdx = getMaxIndex();
                goToSlide(currentIndex >= maxIdx ? 0 : currentIndex + 1);
            });
        }

        // Navegação por setas do teclado (Esquerda / Direita)
        window.addEventListener('keydown', (e) => {
            const rect = galleryCarousel.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!isInView) return;

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const maxIdx = getMaxIndex();
                goToSlide(currentIndex === 0 ? maxIdx : currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const maxIdx = getMaxIndex();
                goToSlide(currentIndex >= maxIdx ? 0 : currentIndex + 1);
            }
        });

        // Suporte a swipe no celular
        let touchStartX = 0;
        let touchEndX   = 0;

        if (track) {
            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 45) {
                    const maxIdx = getMaxIndex();
                    if (diff > 0) {
                        goToSlide(currentIndex >= maxIdx ? 0 : currentIndex + 1);
                    } else {
                        goToSlide(currentIndex === 0 ? maxIdx : currentIndex - 1);
                    }
                }
            }, { passive: true });
        }

        window.addEventListener('resize', () => {
            renderDots();
            goToSlide(currentIndex);
        });

        renderDots();
        goToSlide(0);
    }

    /* ═══════════════════════════════════
       WHATSAPP FLOAT HIDE ON FOOTER
       ═══════════════════════════════════ */
    const wppFloat = document.getElementById('whatsapp-float');
    const footer   = document.querySelector('footer');

    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
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
    document.querySelectorAll('.hero-service-slide video').forEach(v => {
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
    if (heroStyle) {
        heroStyle.style.setProperty('--car-ambient', 'rgba(106, 255, 46, 0.12)');

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
        heroStyle.appendChild(ambientEl);
    }

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
        const hoverTargetSelector = 'a, button, input, .carousel-nav-btn, .carousel-dot, .service-card, .award-card, .review-card, .logo, .service-link, .lightbox-trigger, .lightbox-close';
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

    /* ═══════════════════════════════════
       LIGHTBOX CONTROLLER
       ═══════════════════════════════════ */
    const lightboxModal    = document.getElementById('lightboxModal');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const lightboxClose    = document.getElementById('lightboxClose');
    const lightboxImg      = document.getElementById('lightboxImg');
    const lightboxCaption  = document.getElementById('lightboxCaption');

    function openLightbox(src, caption) {
        if (!lightboxModal || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = caption || 'Visualização em alta resolução';
        if (lightboxCaption) {
            lightboxCaption.textContent = caption || '';
            lightboxCaption.style.display = caption ? 'inline-block' : 'none';
        }
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lightboxImg) lightboxImg.src = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

    document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const fullSrc = trigger.getAttribute('data-full') || trigger.querySelector('img')?.getAttribute('src');
            const caption = trigger.getAttribute('data-caption') || trigger.querySelector('img')?.getAttribute('alt') || '';
            if (fullSrc) openLightbox(fullSrc, caption);
        });
    });

});
