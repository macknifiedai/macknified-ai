lucide.createIcons();
        window.addEventListener('load', () => { 
            setTimeout(() => { document.getElementById('loadingScreen').classList.add('hidden'); }, 2500);
            // Add shimmer animation to hero titles after reveal
            setTimeout(() => {
                document.querySelectorAll('.hero h1 .word').forEach(word => {
                    word.classList.add('revealed');
                });
            }, 2800);
        });
        
        const cursor = document.getElementById('cursor');
        const cursorDot = document.getElementById('cursorDot');
        document.addEventListener('mousemove', (e) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; cursorDot.style.left = e.clientX + 'px'; cursorDot.style.top = e.clientY + 'px'; });
        document.querySelectorAll('a, button, .service-card, .bento-card, .faq-item, .portfolio-card, .testimonial-card').forEach(el => { el.addEventListener('mouseenter', () => cursor.classList.add('hover')); el.addEventListener('mouseleave', () => cursor.classList.remove('hover')); });
        
        document.querySelectorAll('.bento-card').forEach(card => { card.addEventListener('mousemove', (e) => { const rect = card.getBoundingClientRect(); const x = ((e.clientX - rect.left) / rect.width) * 100; const y = ((e.clientY - rect.top) / rect.height) * 100; card.style.setProperty('--mouse-x', x + '%'); card.style.setProperty('--mouse-y', y + '%'); }); });
        
        const particlesContainer = document.getElementById('particles-container');
        for (let i = 0; i < 50; i++) { const particle = document.createElement('div'); particle.className = 'particle'; particle.style.left = Math.random() * 100 + '%'; particle.style.top = Math.random() * 100 + '%'; particle.style.animationDelay = Math.random() * 20 + 's'; particle.style.animationDuration = (15 + Math.random() * 20) + 's'; particle.style.opacity = 0.1 + Math.random() * 0.3; particle.style.width = (2 + Math.random() * 4) + 'px'; particle.style.height = particle.style.width; particlesContainer.appendChild(particle); }
        
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
            dropdown.classList.remove('active');
            btn.classList.remove('active');
        }
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                closeNavDropdown();
            }
        });
        
        document.querySelectorAll('.faq-question').forEach(button => { button.addEventListener('click', () => { const faqItem = button.parentElement; const isActive = faqItem.classList.contains('active'); document.querySelectorAll('.faq-item').forEach(item => { item.classList.remove('active'); }); if (!isActive) { faqItem.classList.add('active'); } }); });
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => { anchor.addEventListener('click', function(e) { e.preventDefault(); const target = document.querySelector(this.getAttribute('href')); if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }); });
        
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.service-card').forEach((card, i) => { gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 85%' }, y: 80, opacity: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out' }); });
        gsap.utils.toArray('.portfolio-card').forEach((card, i) => { gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 85%' }, y: 80, opacity: 0, duration: 0.8, delay: i * 0.12, ease: 'power3.out' }); });
        gsap.utils.toArray('.bento-card').forEach((card, i) => { gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 85%' }, y: 60, opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out' }); });
        gsap.utils.toArray('.process-step').forEach((step, i) => { gsap.from(step, { scrollTrigger: { trigger: step, start: 'top 85%' }, y: 50, opacity: 0, duration: 0.6, delay: i * 0.12, ease: 'power3.out' }); });
        gsap.utils.toArray('.faq-item').forEach((item, i) => { gsap.from(item, { scrollTrigger: { trigger: item, start: 'top 90%' }, x: -40, opacity: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out' }); });
        gsap.utils.toArray('.section-header').forEach(header => { gsap.from(header, { scrollTrigger: { trigger: header, start: 'top 80%' }, y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }); });
        gsap.from('.about-visual', { scrollTrigger: { trigger: '.about-container', start: 'top 70%' }, x: -100, opacity: 0, duration: 1, ease: 'power3.out' });
        gsap.from('.about-content', { scrollTrigger: { trigger: '.about-container', start: 'top 70%' }, x: 100, opacity: 0, duration: 1, ease: 'power3.out' });
        gsap.from('.contact-info', { scrollTrigger: { trigger: '.contact-container', start: 'top 70%' }, x: -80, opacity: 0, duration: 0.9, ease: 'power3.out' });
        gsap.from('.contact-form', { scrollTrigger: { trigger: '.contact-container', start: 'top 70%' }, x: 80, opacity: 0, duration: 0.9, ease: 'power3.out' });
        gsap.from('.cta-content', { scrollTrigger: { trigger: '.cta-section', start: 'top 75%' }, y: 60, opacity: 0, duration: 0.9, ease: 'power3.out' });
        gsap.from('.testimonials-container', { scrollTrigger: { trigger: '.testimonials-container', start: 'top 80%' }, opacity: 0, duration: 1, ease: 'power3.out' });
        
        // Logo hover animation with GSAP
        const logoLinks = document.querySelectorAll('.logo');
        logoLinks.forEach(logo => {
            const letters = logo.querySelectorAll('.logo-letter');
            logo.addEventListener('mouseenter', () => {
                letters.forEach((letter, i) => {
                    gsap.to(letter, {
                        y: -8,
                        scale: 1.15,
                        duration: 0.3,
                        delay: i * 0.03,
                        ease: 'power2.out'
                    });
                    gsap.to(letter, {
                        y: 0,
                        scale: 1,
                        duration: 0.4,
                        delay: i * 0.03 + 0.3,
                        ease: 'bounce.out'
                    });
                });
            });
        });

        // Typewriter Effect
        const typewriterWords = [
            'Work For You',
            'Save You Time',
            'Drive Growth',
            'Scale Fast',
            'Boost Sales',
            'Cut Costs',
            'Never Sleep',
            'Get Results',
            'Make Sense',
            'Just Work'
        ];
        
        const typewriterEl = document.getElementById('typewriter');
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;
        
        function typeWriter() {
            const currentWord = typewriterWords[wordIndex];
            
            if (isDeleting) {
                typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % typewriterWords.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeWriter, typeSpeed);
        }
        
        setTimeout(typeWriter, 1500);

(function(){
      function showTransition(e){
        var el=e.currentTarget;
        var href=el.getAttribute('href');
        if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:'))return;
        if(el.getAttribute('target')==='_blank')return;
        e.preventDefault();
        document.getElementById('pageTransition').classList.add('show');
        setTimeout(function(){window.location.href=href;},2000);
      }
      document.addEventListener('DOMContentLoaded',function(){
        document.querySelectorAll('a[href]').forEach(function(a){
          a.addEventListener('click',showTransition);
        });
      });
    })();