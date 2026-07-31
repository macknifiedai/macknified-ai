(function() {
            function killLoader() {
                var ls = document.getElementById('loadingScreen');
                if (ls) { ls.style.opacity = '0'; ls.style.visibility = 'hidden'; ls.style.pointerEvents = 'none'; }
            }
            // Hard kill after 3 seconds no matter what
            setTimeout(killLoader, 3000);
            // Also try on DOMContentLoaded
            document.addEventListener('DOMContentLoaded', function() { setTimeout(killLoader, 2500); });
            // Also try on load
            window.addEventListener('load', function() { setTimeout(killLoader, 2500); });
        })();

lucide.createIcons();

        function dismissLoader() {
            const ls = document.getElementById('loadingScreen');
            if (ls && !ls.classList.contains('hidden')) {
                ls.classList.add('hidden');
            }
        }

        function revealHero() {
            document.querySelectorAll('.hero h1 .word').forEach(word => {
                word.classList.add('revealed');
            });
        }

        // Primary: fire on window load
        window.addEventListener('load', () => {
            setTimeout(dismissLoader, 2500);
            setTimeout(revealHero, 2800);
        });

        // Fallback: force dismiss after 4s no matter what
        setTimeout(() => {
            dismissLoader();
            setTimeout(revealHero, 300);
        }, 4000);
        
        const cursor = document.getElementById('cursor');
        const cursorDot = document.getElementById('cursorDot');
        document.addEventListener('mousemove', (e) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; cursorDot.style.left = e.clientX + 'px'; cursorDot.style.top = e.clientY + 'px'; });
        document.querySelectorAll('a, button, .service-card, .bento-card, .faq-item, .portfolio-card, .testimonial-card').forEach(el => { el.addEventListener('mouseenter', () => cursor.classList.add('hover')); el.addEventListener('mouseleave', () => cursor.classList.remove('hover')); });
        
        document.querySelectorAll('.bento-card').forEach(card => { card.addEventListener('mousemove', (e) => { const rect = card.getBoundingClientRect(); const x = ((e.clientX - rect.left) / rect.width) * 100; const y = ((e.clientY - rect.top) / rect.height) * 100; card.style.setProperty('--mouse-x', x + '%'); card.style.setProperty('--mouse-y', y + '%'); }); });
        
        // Background parallax scroll effect
        const bgParallax = document.getElementById('bgParallax');
        let lastScrollY = 0;
        let ticking = false;
        function updateBgParallax() {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const progress = scrollY / maxScroll;
            // Fade in/out based on scroll position for a transition feel
            const opacity = 0.05 + Math.sin(progress * Math.PI) * 0.12;
            bgParallax.style.opacity = opacity;
            // Subtle parallax shift
            bgParallax.style.backgroundPositionY = (50 + progress * 20) + '%';
            ticking = false;
        }
        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                requestAnimationFrame(updateBgParallax);
                ticking = true;
            }
        }, { passive: true });
        
        window.addEventListener('scroll', () => { const navbar = document.getElementById('navbar'); if (window.scrollY > 100) { navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); } });
        
        function toggleNavDropdown() { 
            const dropdown = document.getElementById('navDropdown');
            const btn = document.querySelector('.nav-dropdown-btn');
            dropdown.classList.toggle('active');
            btn.classList.toggle('active');
        }
        function closeNavDropdown() {
            const dropdown = document.getElementById('navDropdown');
            const btn = document.querySelector('.nav-dropdown-btn');
            if (dropdown) dropdown.classList.remove('active');
            if (btn) btn.classList.remove('active');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('navDropdown');
            const btn = document.querySelector('.nav-dropdown-btn');
            if (dropdown && btn && !btn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                btn.classList.remove('active');
            }
        });

        // FAQ accordion
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.parentElement;
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        });

        // Typewriter effect
        const typewriterEl = document.getElementById('typewriter');
        if (typewriterEl) {
            const phrases = ['Work For You', 'Scale Your Business', 'Save You Time', 'Drive Real Results', 'Work Smarter'];
            let phraseIndex = 0, charIndex = 0, isDeleting = false;
            function typeWriter() {
                const current = phrases[phraseIndex];
                if (isDeleting) {
                    typewriterEl.textContent = current.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typewriterEl.textContent = current.substring(0, charIndex + 1);
                    charIndex++;
                }
                if (!isDeleting && charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(typeWriter, 1800);
                    return;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }
                setTimeout(typeWriter, isDeleting ? 60 : 100);
            }
            typeWriter();
        }

        // GSAP scroll animations
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            gsap.utils.toArray('section').forEach(section => {
                gsap.fromTo(section.querySelectorAll('.service-card, .portfolio-card, .bento-card, .process-step, .faq-item, .value-item, .contact-method'),
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
                      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' }
                    }
                );
            });
        }