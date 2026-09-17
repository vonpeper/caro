/**
 * Carolina Villegas | Terapia Física y Rehabilitación
 * Lógica del sitio web - Interactividad Premium y Animaciones
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. MOBILE NAVIGATION MENU
    // ==========================================================================
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Crear el overlay de fondo para móviles de forma diferida tras la carga inicial (evita forced reflow)
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    window.addEventListener('load', () => {
        document.body.appendChild(navOverlay);
    });
    
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.toggle('open');
        mobileNavToggle.classList.toggle('open');
        mobileNavToggle.setAttribute('aria-expanded', isOpen);
        navOverlay.classList.toggle('active', isOpen);
        
        // Bloquear/desbloquear scroll del body
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    
    mobileNavToggle.addEventListener('click', toggleMobileMenu);
    
    // Cerrar menú móvil al hacer clic en un enlace de navegación
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // ==========================================================================
    // 2. STICKY HEADER ON SCROLL (Optimizado con requestAnimationFrame)
    // ==========================================================================
    const header = document.getElementById('header');
    
    function handleHeaderScroll() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });
    
    // Ejecución diferida para el primer scroll check para evitar bloquear la carga del DOM
    window.addEventListener('load', () => {
        setTimeout(handleHeaderScroll, 50);
        // Adjuntar clic del overlay después de cargarse en el body
        navOverlay.addEventListener('click', toggleMobileMenu);
    });

    // ==========================================================================
    // 3. INTERACTIVE HERO CANVAS (Ondas Biomecánicas Fluidas)
    // ==========================================================================
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Adjust canvas dimensions on load without causing layout thrashing
    // Use requestAnimationFrame to ensure paint has occurred
    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    });
    
    // Parámetros de ondas biomecánicas
    const waves = [
        {
            y: height * 0.5,
            length: 0.003,
            amplitude: 45,
            frequency: 0.008,
            color: 'rgba(13, 173, 185, 0.22)',
            phase: 0
        },
        {
            y: height * 0.52,
            length: 0.002,
            amplitude: 60,
            frequency: 0.006,
            color: 'rgba(14, 165, 233, 0.16)',
            phase: Math.PI / 4
        },
        {
            y: height * 0.48,
            length: 0.004,
            amplitude: 30,
            frequency: 0.01,
            color: 'rgba(13, 173, 185, 0.12)',
            phase: Math.PI / 2
        }
    ];
    
    // Partículas flotando suavemente
    const particles = [];
    const particleCount = 28;
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1.5;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Rebotar en los bordes
            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = `rgba(13, 173, 185, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Inicializar partículas
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Interactividad con el mouse
    let mouse = { x: null, y: null, radius: 180 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Dibujar ondas
        waves.forEach((wave) => {
            ctx.beginPath();
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 1.5;
            
            for (let i = 0; i < width; i += 2) {
                // Cálculo de la deformación por posición horizontal y tiempo (fase)
                let yOffset = Math.sin(i * wave.length + wave.phase) * wave.amplitude;
                
                // Modificación interactiva al acercar el cursor del mouse
                if (mouse.x !== null) {
                    let dx = i - mouse.x;
                    let dy = (wave.y + yOffset) - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        // Empujar o jalar suavemente la onda biomecánica para simular tacto/biología
                        let force = (mouse.radius - distance) / mouse.radius;
                        yOffset += Math.sin(distance * 0.05 - wave.phase * 2) * 15 * force;
                    }
                }
                
                let x = i;
                let y = wave.y + yOffset;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            wave.phase += wave.frequency; // Actualizar fase para el movimiento fluido continuo
        });
        
        // Dibujar y actualizar partículas
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler debounced to avoid layout trashing and forced sync reads
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            width = canvas.width = canvas.offsetWidth || window.innerWidth;
            height = canvas.height = canvas.offsetHeight || window.innerHeight;

            // Update central wave lines proportionally
            waves[0].y = height * 0.5;
            waves[1].y = height * 0.52;
            waves[2].y = height * 0.48;
        }, 100);
    });

    // ==========================================================================
    // 4. SCROLL REVEAL (Intersection Observer para animaciones fluidas)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Se activa ligeramente antes de entrar por completo
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // ========================================================================
    // 5. ROADMAP PROGRESS TRACKER (Optimized with IntersectionObserver)
    // ========================================================================
    const roadmapSteps = document.querySelectorAll('.roadmap-step');
    const roadmapProgressBar = document.getElementById('roadmap-progress');
    const roadmapObserverOptions = {
        root: null,
        rootMargin: '0px 0px -35% 0px', // Activar cuando el paso alcanza ~65% del viewport height
        threshold: 0
    };

    const roadmapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const step = entry.target;
            if (entry.isIntersecting) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
            // Update progress bar based on the highest active index
            const activeSteps = Array.from(roadmapSteps).filter(s => s.classList.contains('active'));
            const activeIndex = activeSteps.length - 1;
            const totalSteps = roadmapSteps.length;
            if (roadmapProgressBar) {
                const percent = totalSteps > 1 ? (activeIndex / (totalSteps - 1)) * 100 : 0;
                roadmapProgressBar.style.height = `${Math.max(0, percent)}%`;
            }
        });
    }, roadmapObserverOptions);

    roadmapSteps.forEach(step => roadmapObserver.observe(step));

    // ========================================================================
    // 7. ACTIVE NAVIGATION MENU ITEM ON SCROLL (ScrollSpy via IntersectionObserver)
    // ========================================================================
    const sections = document.querySelectorAll('section[id]');
    const sectionObserverOptions = {
        root: null,
        rootMargin: '-100px 0px -100px 0px', // Match header offset
        threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            if (!navLink) return;

            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // ==========================================================================
    // 8. CONTACT FORM VALIDATION & WHATSAPP REDIRECTION
    // ==========================================================================
    const bookingForm = document.getElementById('booking-form');
    const btnSubmit = document.getElementById('btn-submit-form');
    const formResponseAlert = document.getElementById('form-response-alert');
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validatePhone(phone) {
        // Validación básica mexicana (10 dígitos numéricos)
        const re = /^\d{10}$/;
        return re.test(phone.replace(/\s+/g, '').replace(/[-()]/g, ''));
    }
    
    function showInputError(inputEl, errorElId) {
        const group = inputEl.closest('.form-group');
        group.classList.add('invalid');
    }
    
    function clearInputError(inputEl) {
        const group = inputEl.closest('.form-group');
        group.classList.remove('invalid');
    }
    
    // Limpieza de estados de error al escribir
    const inputs = bookingForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearInputError(input);
        });
    });
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('form-name');
        const phoneInput = document.getElementById('form-phone');
        const emailInput = document.getElementById('form-email');
        const dateInput = document.getElementById('form-date');
        const messageInput = document.getElementById('form-message');
        
        let isValid = true;
        
        // Validar nombre
        if (nameInput.value.trim().length < 3) {
            showInputError(nameInput);
            isValid = false;
        } else {
            clearInputError(nameInput);
        }
        
        // Validar teléfono
        if (!validatePhone(phoneInput.value)) {
            showInputError(phoneInput);
            isValid = false;
        } else {
            clearInputError(phoneInput);
        }
        
        // Validar correo
        if (!validateEmail(emailInput.value)) {
            showInputError(emailInput);
            isValid = false;
        } else {
            clearInputError(emailInput);
        }
        
        if (!isValid) {
            return; // Detener flujo si hay errores
        }
        
        // Estado de carga premium
        btnSubmit.classList.add('loading');
        btnSubmit.disabled = true;
        
        // Simulación de envío por API
        setTimeout(() => {
            btnSubmit.classList.remove('loading');
            btnSubmit.disabled = false;
            
            // Construir el mensaje formateado para WhatsApp
            const nombre = encodeURIComponent(nameInput.value.trim());
            const telefono = encodeURIComponent(phoneInput.value.trim());
            const email = encodeURIComponent(emailInput.value.trim());
            const fecha = encodeURIComponent(dateInput.value ? dateInput.value : 'No especificada');
            const mensajeOriginal = messageInput.value.trim();
            const mensaje = encodeURIComponent(mensajeOriginal ? mensajeOriginal : 'Ninguno');
            
            const textoWhatsApp = `Hola,%20quisiera%20agendar%20una%20cita%20con%20la%20Dra.%20Carolina%20Villegas.%0A%0A*Mis%20Datos:*%0A%E2%80%A2%20*Nombre:*%20${nombre}%0A%E2%80%A2%20*Tel%C3%A9fono:*%20${telefono}%0A%E2%80%A2%20*Email:*%20${email}%0A%E2%80%A2%20*Fecha%20tentativa:*%20${fecha}%0A%E2%80%A2%20*Padecimiento:*%20${mensaje}`;
            
            // Link de WhatsApp de la Dra. Carolina Villegas
            const urlWhatsApp = `https://wa.me/5217225714265?text=${textoWhatsApp}`;
            
            // Mostrar mensaje de éxito
            formResponseAlert.className = 'form-alert success';
            formResponseAlert.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>¡Datos procesados! Redirigiéndote a WhatsApp para agendar tu cita...</span>
            `;
            formResponseAlert.hidden = false;
            
            // Limpiar formulario
            bookingForm.reset();
            
            // Redirigir a WhatsApp en pestaña nueva después de 1.8 segundos
            setTimeout(() => {
                window.open(urlWhatsApp, '_blank');
                formResponseAlert.hidden = true;
            }, 1800);
            
        }, 1500); // 1.5 segundos de retraso realista
    });


    // ==========================================================================
    // ==========================================================================
    // 9. CTA CANVAS: NERVOUS-MUSCULAR CONNECTION ANIMATION (White & Red)
    // ==========================================================================
    const ctaCanvas = document.getElementById('cta-canvas');
    if (ctaCanvas) {
        const ctaCtx = ctaCanvas.getContext('2d');
        let ctaWidth = ctaCanvas.width = window.innerWidth;
        let ctaHeight = ctaCanvas.height = 360; // Altura aproximada inicial segura
        
        window.addEventListener('load', () => {
            // Use viewport dimensions instead of offset properties to avoid forced reflow
            ctaWidth = ctaCanvas.width = window.innerWidth;
            ctaHeight = ctaCanvas.height = 360; // maintain consistent height
        });

        const ctaNodes = [];
        const maxNodes = 36;
        const maxDist = 120;

        class CtaNode {
            constructor() {
                this.x = Math.random() * ctaWidth;
                this.y = Math.random() * ctaHeight;
                this.size = Math.random() * 2 + 1.2;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.colorType = Math.random() > 0.35 ? 'white' : 'red';
                this.pulseSpeed = Math.random() * 0.04 + 0.015;
                this.pulsePhase = Math.random() * Math.PI;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0) this.x = ctaWidth;
                if (this.x > ctaWidth) this.x = 0;
                if (this.y < 0) this.y = ctaHeight;
                if (this.y > ctaHeight) this.y = 0;

                this.pulsePhase += this.pulseSpeed;
            }

            draw() {
                const sizeMult = 1 + Math.sin(this.pulsePhase) * 0.25;
                const r = this.size * sizeMult;

                // Dibujar halo exterior translúcido
                ctaCtx.beginPath();
                ctaCtx.arc(this.x, this.y, r * 2.8, 0, Math.PI * 2);
                if (this.colorType === 'white') {
                    ctaCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                } else {
                    ctaCtx.fillStyle = 'rgba(239, 68, 68, 0.07)';
                }
                ctaCtx.fill();

                // Dibujar núcleo brillante
                ctaCtx.beginPath();
                ctaCtx.arc(this.x, this.y, r, 0, Math.PI * 2);
                if (this.colorType === 'white') {
                    ctaCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                    ctaCtx.shadowColor = 'rgba(255, 255, 255, 0.6)';
                } else {
                    ctaCtx.fillStyle = 'rgba(248, 113, 113, 0.95)';
                    ctaCtx.shadowColor = 'rgba(239, 68, 68, 0.8)';
                }
                ctaCtx.shadowBlur = 6;
                ctaCtx.fill();
                ctaCtx.shadowBlur = 0;
            }
        }

        // Inicializar nodos
        for (let i = 0; i < maxNodes; i++) {
            ctaNodes.push(new CtaNode());
        }

        // Definir auroras dinámicas de fondo en el canvas
        const auroraGlows = [
            {
                x: ctaWidth * 0.25,
                y: ctaHeight * 0.5,
                baseRadius: Math.min(ctaWidth, ctaHeight) * 0.45,
                radius: Math.min(ctaWidth, ctaHeight) * 0.45,
                angle: 0,
                speed: 0.002,
                colorInner: 'rgba(255, 255, 255, 0.08)',
                colorOuter: 'rgba(255, 255, 255, 0.02)'
            },
            {
                x: ctaWidth * 0.75,
                y: ctaHeight * 0.5,
                baseRadius: Math.min(ctaWidth, ctaHeight) * 0.5,
                radius: Math.min(ctaWidth, ctaHeight) * 0.5,
                angle: Math.PI,
                speed: 0.0015,
                colorInner: 'rgba(239, 68, 68, 0.06)',
                colorOuter: 'rgba(239, 68, 68, 0.015)'
            }
        ];

        function drawAurora() {
            auroraGlows.forEach(glow => {
                glow.angle += glow.speed;
                const offsetX = Math.cos(glow.angle) * (ctaWidth * 0.1);
                const offsetY = Math.sin(glow.angle * 1.4) * (ctaHeight * 0.1);
                const x = glow.x + offsetX;
                const y = glow.y + offsetY;
                const radius = glow.baseRadius * (1 + Math.sin(glow.angle * 0.8) * 0.12);

                const grad = ctaCtx.createRadialGradient(x, y, 0, x, y, radius);
                grad.addColorStop(0, glow.colorInner);
                grad.addColorStop(0.5, glow.colorOuter);
                grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

                ctaCtx.beginPath();
                ctaCtx.arc(x, y, radius, 0, Math.PI * 2);
                ctaCtx.fillStyle = grad;
                ctaCtx.fill();
            });
        }

        const impulses = [];

        function drawConnections() {
            for (let i = 0; i < ctaNodes.length; i++) {
                for (let j = i + 1; j < ctaNodes.length; j++) {
                    const dx = ctaNodes[i].x - ctaNodes[j].x;
                    const dy = ctaNodes[i].y - ctaNodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDist) {
                        const alpha = (maxDist - distance) / maxDist * 0.18;
                        ctaCtx.beginPath();
                        ctaCtx.moveTo(ctaNodes[i].x, ctaNodes[i].y);
                        ctaCtx.lineTo(ctaNodes[j].x, ctaNodes[j].y);
                        
                        if (ctaNodes[i].colorType === 'red' || ctaNodes[j].colorType === 'red') {
                            ctaCtx.strokeStyle = `rgba(239, 68, 68, ${alpha * 1.4})`;
                        } else {
                            ctaCtx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        }
                        
                        ctaCtx.lineWidth = 0.8;
                        ctaCtx.stroke();

                        // Disparar impulsos nerviosos aleatorios a lo largo de las conexiones activas
                        if (Math.random() < 0.0004) {
                            impulses.push({
                                from: ctaNodes[i],
                                to: ctaNodes[j],
                                progress: 0,
                                speed: Math.random() * 0.015 + 0.008,
                                colorType: ctaNodes[i].colorType
                            });
                        }
                    }
                }
            }
        }

        function animateCta() {
            ctaCtx.clearRect(0, 0, ctaWidth, ctaHeight);
            
            // 1. Dibujar el fondo aurora suave
            drawAurora();
            
            // 2. Dibujar las conexiones neuronales
            drawConnections();

            // 3. Actualizar y dibujar las células/nodos sinápticos
            ctaNodes.forEach(node => {
                node.update();
                node.draw();
            });

            // 4. Dibujar impulsos en tránsito (estilo estela láser brillante)
            for (let i = impulses.length - 1; i >= 0; i--) {
                const imp = impulses[i];
                imp.progress += imp.speed;

                if (imp.progress >= 1) {
                    // La señal llega a su destino y hace parpadear el nodo
                    imp.to.pulsePhase = Math.PI / 2; // Hace brillar el nodo destino instantáneamente
                    impulses.splice(i, 1);
                    continue;
                }

                // Posición actual
                const x1 = imp.from.x + (imp.to.x - imp.from.x) * imp.progress;
                const y1 = imp.from.y + (imp.to.y - imp.from.y) * imp.progress;

                // Posición de la cola de la estela
                const tailProgress = Math.max(0, imp.progress - 0.16);
                const x0 = imp.from.x + (imp.to.x - imp.from.x) * tailProgress;
                const y0 = imp.from.y + (imp.to.y - imp.from.y) * tailProgress;

                // Dibujar línea de gradiente para el impulso
                ctaCtx.beginPath();
                ctaCtx.moveTo(x0, y0);
                ctaCtx.lineTo(x1, y1);
                
                const grad = ctaCtx.createLinearGradient(x0, y0, x1, y1);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                if (imp.colorType === 'red') {
                    grad.addColorStop(1, 'rgba(239, 68, 68, 0.95)');
                    ctaCtx.shadowColor = 'rgba(239, 68, 68, 0.8)';
                } else {
                    grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
                    ctaCtx.shadowColor = 'rgba(255, 255, 255, 0.7)';
                }
                
                ctaCtx.strokeStyle = grad;
                ctaCtx.lineWidth = 2.0;
                ctaCtx.lineCap = 'round';
                ctaCtx.shadowBlur = 8;
                ctaCtx.stroke();
                ctaCtx.shadowBlur = 0;
            }

            requestAnimationFrame(animateCta);
        }

        animateCta();

        window.addEventListener('resize', () => {
            if (ctaCanvas) {
                ctaWidth = ctaCanvas.width = ctaCanvas.offsetWidth;
                ctaHeight = ctaCanvas.height = ctaCanvas.offsetHeight;
                
                // Recalcular dimensiones de auroras
                auroraGlows[0].x = ctaWidth * 0.25;
                auroraGlows[0].y = ctaHeight * 0.5;
                auroraGlows[0].baseRadius = Math.min(ctaWidth, ctaHeight) * 0.45;
                
                auroraGlows[1].x = ctaWidth * 0.75;
                auroraGlows[1].y = ctaHeight * 0.5;
                auroraGlows[1].baseRadius = Math.min(ctaWidth, ctaHeight) * 0.5;
            }
        });
    }

    // ==========================================================================
    // 10. AUTOMATIC COPYRIGHT YEAR
    // ==========================================================================
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // 11. GALLERY SWIPER INITIALIZATION
    // ==========================================================================
    if (document.querySelector('.gallery-swiper') && typeof Swiper !== 'undefined') {
        new Swiper('.gallery-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: '.gallery-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '.gallery-btn-next',
                prevEl: '.gallery-btn-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                },
                1280: {
                    slidesPerView: 4,
                    spaceBetween: 28,
                }
            }
        });
    }
    
});
