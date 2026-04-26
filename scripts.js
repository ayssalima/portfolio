/* ═══════════════════════════════════════════════════════════════
   AYSSA LIMA — PORTFOLIO
   Scripts: Scroll effects, mobile menu, animations
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─────────────────────────────────────
    // DOM References
    // ─────────────────────────────────────
    const header         = document.getElementById('site-header');
    const hamburger      = document.getElementById('hamburger');
    const mobileNav      = document.getElementById('mobile-nav');
    const mobileOverlay  = document.getElementById('mobile-nav-overlay');
    const mobileClose    = document.getElementById('mobile-nav-close');
    const mobileLinks    = document.querySelectorAll('.mobile-nav-link');
    const navLinks       = document.querySelectorAll('.nav-link');
    const timelineLine   = document.getElementById('timeline-line');
    const fadeUpElements = document.querySelectorAll('.fade-up');

    // ─────────────────────────────────────
    // 1. STICKY HEADER — Scroll Detection
    // ─────────────────────────────────────
    let lastScroll = 0;
    let headerScrolled = false;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50 && !headerScrolled) {
            header.classList.add('scrolled');
            headerScrolled = true;
        } else if (scrollY <= 50 && headerScrolled) {
            header.classList.remove('scrolled');
            headerScrolled = false;
        }

        lastScroll = scrollY;
    }

    // ─────────────────────────────────────
    // 2. MOBILE MENU
    // ─────────────────────────────────────
    function openMobileNav() {
        mobileNav.classList.add('active');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileOverlay.classList.add('active');
        mobileOverlay.setAttribute('aria-hidden', 'false');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        mobileNav.classList.remove('active');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileOverlay.classList.remove('active');
        mobileOverlay.setAttribute('aria-hidden', 'true');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            const isOpen = mobileNav.classList.contains('active');
            isOpen ? closeMobileNav() : openMobileNav();
        });
    }

    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileNav);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileNav);
    }

    // Close on mobile link click
    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMobileNav();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });

    // ─────────────────────────────────────
    // 3. ACTIVE NAV LINK — Scroll Spy
    // ─────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Desktop nav
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });

                // Mobile nav
                mobileLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ─────────────────────────────────────
    // 4. FADE-UP SCROLL ANIMATIONS
    // ─────────────────────────────────────
    const fadeObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        }
    );

    fadeUpElements.forEach(function (el) {
        fadeObserver.observe(el);
    });

    // ─────────────────────────────────────
    // 5. TIMELINE DRAW-IN ANIMATION
    // ─────────────────────────────────────
    if (timelineLine) {
        const timelineObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        timelineLine.classList.add('animate');
                        timelineObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2
            }
        );

        timelineObserver.observe(timelineLine.parentElement);
    }

    // ─────────────────────────────────────
    // 6. SMOOTH SCROLL (Enhanced)
    // ─────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const headerOffset = parseInt(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--header-height')
            ) || 72;

            const offsetTop = target.offsetTop - headerOffset;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // ─────────────────────────────────────
    // 7. EVENT LISTENERS
    // ─────────────────────────────────────
    // Use passive listeners for scroll performance
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                handleHeaderScroll();
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial calls
    handleHeaderScroll();
    updateActiveNav();

    // ─────────────────────────────────────
    // 8. PHOTO FADE CAROUSEL (Invisible transitions)
    // ─────────────────────────────────────
    const photoCarousel = document.getElementById('photo-carousel');
    if (photoCarousel) {
        const photos = photoCarousel.querySelectorAll('.carousel-photo');
        let currentPhoto = 0;
        const photoInterval = 4500; // 4.5 seconds per photo

        function nextPhoto() {
            photos[currentPhoto].classList.remove('active');
            currentPhoto = (currentPhoto + 1) % photos.length;
            photos[currentPhoto].classList.add('active');
        }

        setInterval(nextPhoto, photoInterval);
    }

    // ─────────────────────────────────────
    // 9. VIDEO MARQUEE — Autoplay on viewport
    // ─────────────────────────────────────
    const videoMarquee = document.getElementById('destaque-videos');

    if (videoMarquee) {
        var allMarqueeVideos = videoMarquee.querySelectorAll('.marquee-video');

        var marqueeObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        // Play all videos
                        allMarqueeVideos.forEach(function (v) {
                            v.play().catch(function () {});
                        });
                    } else {
                        // Pause all when out of view
                        allMarqueeVideos.forEach(function (v) {
                            v.pause();
                        });
                    }
                });
            },
            { threshold: 0.15 }
        );

        marqueeObserver.observe(videoMarquee);
    }

    // ─────────────────────────────────────
    // 10. RESIZE HANDLER — Close menu on desktop
    // ─────────────────────────────────────
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 1024 && mobileNav.classList.contains('active')) {
                closeMobileNav();
            }
        }, 150);
    }, { passive: true });

})();
