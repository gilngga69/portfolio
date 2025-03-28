document.addEventListener('DOMContentLoaded', () => {
    // Initialize main element reference
    const main = document.querySelector('main');
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const getCurrentTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return prefersDarkScheme.matches ? 'dark' : 'light';
    };
    
    // Apply the current theme
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Fix button text color in dark mode
        const submitButton = document.querySelector('#simple-contact-form button[type="submit"]');
        if (submitButton) {
            if (theme === 'dark') {
                submitButton.style.backgroundColor = 'var(--accent-color)';
                submitButton.style.color = '#ffffff';
            } else {
                submitButton.style.backgroundColor = 'var(--primary-color)';
                submitButton.style.color = '#ffffff';
            }
        }
    };
    
    // Initial theme setup
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
    
    // Smooth scrolling for navigation links with custom duration
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const startPosition = window.pageYOffset;
                const targetPosition = targetElement.offsetTop - 80;
                const distance = targetPosition - startPosition;
                const duration = 1500; // Increased duration for smoother scroll
                let start = null;
                
                // Add scrolling class for blur effect
                if (main) main.classList.add('scrolling');
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    // Easing function for smooth movement
                    const ease = t => t < 0.5 
                        ? 4 * t * t * t 
                        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                    
                    window.scrollTo(0, startPosition + (distance * ease(progress)));
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    } else {
                        // Remove scrolling class after animation
                        if (main) {
                            setTimeout(() => {
                                main.classList.remove('scrolling');
                            }, 300);
                        }
                    }
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
    
    // Add scroll listener for motion blur effect on normal scrolling
    window.addEventListener('scroll', () => {
        if (main && !main.classList.contains('scrolling')) {
            main.classList.add('scrolling');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (main) {
                main.classList.remove('scrolling');
            }
        }, 150); // Delay before removing blur effect
    }, { passive: true });
    
    // Add active class to navigation links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY + 100; // Add offset for better accuracy
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSection && link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Call highlightNavLink initially and on scroll
    highlightNavLink();
    window.addEventListener('scroll', highlightNavLink);
    
    // Update highlight when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initialize reveal elements with enhanced setup
    function initializeRevealElements() {
        // Add reveal-element class to elements we want to animate
        const elementsToReveal = [
            '.hero h1',
            '.hero-description',
            '.about-content h2',
            '.about-content p',
            '.skill-category',
            '.project-card',
            '.contact h2',
            '.contact > p',
            '.contact-card',
            '.contact-method',
            '.social-simple'
        ];

        // Initialize work section
        const workSection = document.querySelector('.work');
        if (workSection) {
            workSection.style.opacity = '1';
            workSection.style.visibility = 'visible';
            workSection.style.display = 'block';
        }

        // Initialize work container
        const workContainer = document.querySelector('.work .container');
        if (workContainer) {
            workContainer.style.opacity = '1';
            workContainer.style.visibility = 'visible';
            workContainer.style.display = 'block';
        }

        // Initialize project cards with responsive animations
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.display = 'block';
            
            // Add animation class
            card.classList.add('animate');
            
            // Set initial transform based on screen size
            if (window.innerWidth <= 768) {
                card.style.transform = 'translateY(30px)';
            } else {
                card.style.transform = index % 2 === 0 ? 'translateX(-100px)' : 'translateX(100px)';
            }
        });

        // Initialize other elements
        elementsToReveal.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (!element.classList.contains('project-card')) {
                    element.classList.add('reveal-element');
                }
            });
        });
    }

    // Enhanced scroll animation with staggered reveal
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('section, .reveal-element, .project-card, .work .container');
        const triggerBottom = window.innerHeight * 0.85;

        elements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;

            // Check if element is in viewport with some buffer
            if (elementTop < triggerBottom && elementBottom > 0) {
                if (!element.classList.contains('visible')) {
                    requestAnimationFrame(() => {
                        element.classList.add('visible');
                    });
                }
            }
        });
    };

    // Initialize reveal elements
    initializeRevealElements();

    // Initial animation check with delay for smoother page load
    window.addEventListener('load', () => {
        // Delay the initial animation for smoother loading
        setTimeout(() => {
            requestAnimationFrame(animateOnScroll);
        }, 300);
    });

    // Throttle scroll events for better performance
    let scrollTimeout;
    let resizeTimeout;
    let lastScrollPosition = window.pageYOffset;
    const scrollThreshold = 30; // Reduced threshold for more responsive animations

    // Add scroll listener with throttling and direction detection
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset;
        const scrollDistance = Math.abs(currentScrollPosition - lastScrollPosition);

        // Only trigger animation if we've scrolled a significant amount
        if (scrollDistance > scrollThreshold) {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    requestAnimationFrame(animateOnScroll);
                    scrollTimeout = null;
                    lastScrollPosition = currentScrollPosition;
                }, 50); // Reduced throttle time for smoother animations
            }
        }

        // Handle motion blur effect
        if (main && !main.classList.contains('scrolling')) {
            main.classList.add('scrolling');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (main) {
                main.classList.remove('scrolling');
            }
            animateOnScroll();
        }, 100); // Reduced delay for more responsive animations
    }, { passive: true });

    // Update animations on resize with debouncing
    window.addEventListener('resize', () => {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(() => {
                // Update project card animations based on screen size
                const projectCards = document.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    if (!card.classList.contains('visible')) {
                        if (window.innerWidth <= 768) {
                            card.style.transform = 'translateY(30px)';
                        } else {
                            card.style.transform = index % 2 === 0 ? 'translateX(-100px)' : 'translateX(100px)';
                        }
                    }
                });
                
                requestAnimationFrame(animateOnScroll);
                resizeTimeout = null;
            }, 100);
        }
    });
    
    // Handle simplified contact form
    const simpleContactForm = document.getElementById('simple-contact-form');
    if (simpleContactForm) {
        simpleContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const formInputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            // Simple validation
            formInputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                    input.style.animation = 'shake 0.5s ease';
                    
                    // Remove animation after it completes
                    setTimeout(() => {
                        input.style.animation = '';
                    }, 500);
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'form-error';
                errorMessage.textContent = 'Please fill in all required fields';
                errorMessage.style.color = '#e74c3c';
                errorMessage.style.fontSize = '0.9rem';
                errorMessage.style.marginTop = '-10px';
                errorMessage.style.marginBottom = '15px';
                
                // Remove any existing error messages
                const existingError = this.querySelector('.form-error');
                if (existingError) {
                    existingError.remove();
                }
                
                // Add error message after the first input
                this.insertBefore(errorMessage, formInputs[1]);
                return;
            }
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                submitButton.textContent = 'Message Sent!';
                submitButton.style.backgroundColor = '#27ae60';
                
                // Add success animation
                const successAnimation = document.createElement('style');
                successAnimation.textContent = `
                    @keyframes success-bounce {
                        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                        40% {transform: translateY(-10px);}
                        60% {transform: translateY(-5px);}
                    }
                    .success-anim {
                        animation: success-bounce 1s ease;
                    }
                `;
                document.head.appendChild(successAnimation);
                submitButton.classList.add('success-anim');
                
                this.reset();
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                    submitButton.classList.remove('success-anim');
                }, 2000);
            }, 1500);
        });
    }
    
    // Add shake animation for validation
    const shakeAnimation = document.createElement('style');
    shakeAnimation.textContent = `
        @keyframes shake {
            0%, 100% {transform: translateX(0);}
            10%, 30%, 50%, 70%, 90% {transform: translateX(-5px);}
            20%, 40%, 60%, 80% {transform: translateX(5px);}
        }
    `;
    document.head.appendChild(shakeAnimation);
    
    // Reset event listeners to ensure no conflicts
    console.log('Main script loaded - attaching card animations');
    
    // Fix project card clicks with animations
    setTimeout(() => {
        const cards = document.querySelectorAll('.project-card');
        console.log(`Found ${cards.length} project cards to attach events to`);
        
        cards.forEach((card, index) => {
            // Remove any existing listeners (to avoid duplicates)
            const cardClone = card.cloneNode(true);
            card.parentNode.replaceChild(cardClone, card);
            
            // Add hover animations
            cardClone.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
            });
            
            cardClone.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
            
            // Add click animation and modal open
            cardClone.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Card ${index} clicked`);
                
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.className = 'ripple-effect';
                ripple.style.position = 'absolute';
                ripple.style.width = '10px';
                ripple.style.height = '10px';
                ripple.style.borderRadius = '50%';
                ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                ripple.style.transform = 'scale(1)';
                ripple.style.opacity = '1';
                ripple.style.transition = 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
                
                // Position ripple at click point
                const rect = this.getBoundingClientRect();
                ripple.style.left = (e.clientX - rect.left) + 'px';
                ripple.style.top = (e.clientY - rect.top) + 'px';
                this.appendChild(ripple);
                
                // Scale ripple
                setTimeout(() => {
                    ripple.style.transform = 'scale(100)';
                    ripple.style.opacity = '0';
                }, 0);
                
                // Get project data
                const img = this.querySelector('img');
                const title = this.querySelector('h3');
                const category = this.querySelector('p');
                
                // Open modal with animation sequence
                const modal = document.getElementById('project-modal');
                if (modal && img && title && category) {
                    // Position modal initially invisible
                    modal.style.display = 'flex';
                    modal.style.visibility = 'visible';
                    modal.style.opacity = '0';
                    
                    // Set modal content
                    document.getElementById('modal-image').src = img.src;
                    document.getElementById('modal-title').textContent = title.textContent.toUpperCase();
                    document.getElementById('modal-category').textContent = category.textContent.toUpperCase();
                    
                    // Set year from data attribute
                    const year = this.getAttribute('data-year') || '2024'; // Default to 2024 if not set
                    document.getElementById('modal-date').textContent = year;
                    
                    // Set description
                    const description = document.getElementById('modal-description');
                    if (description) {
                        // Get description from data attribute
                        const projectDescription = this.getAttribute('data-description') || 'Project description coming soon.';
                        description.textContent = projectDescription;
                    }
                    
                    // Animate modal opening
                    requestAnimationFrame(() => {
                        document.body.style.overflow = 'hidden';
                        modal.classList.add('show');
                    });
                    
                    // Remove ripple after animation completes
                    setTimeout(() => {
                        if (ripple && ripple.parentNode) {
                            ripple.parentNode.removeChild(ripple);
                        }
                    }, 800);
                }
            });
        });
        
        // Animate modal close
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button clicked');
                
                const modal = document.getElementById('project-modal');
                if (modal) {
                    // Animate content out first
                    const modalContent = modal.querySelector('.modal-content');
                    const modalImage = document.getElementById('modal-image');
                    const modalDetails = modal.querySelector('.modal-details');
                    
                    if (modalDetails) modalDetails.style.opacity = '0';
                    if (modalImage) modalImage.style.opacity = '0';
                    if (modalContent) modalContent.style.opacity = '0';
                    
                    // Then remove show class after short delay
                    setTimeout(() => {
                        modal.classList.remove('show');
                        
                        // Re-enable scrolling after animation completes
                        setTimeout(() => {
                            document.body.style.overflow = '';
                        }, 400);
                    }, 200);
                }
            });
        }
        
        // Close modal when clicking outside content
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    const closeBtn = document.querySelector('.close-modal');
                    if (closeBtn) {
                        closeBtn.click();
                    }
                }
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('project-modal');
                if (modal && modal.classList.contains('show')) {
                    const closeBtn = document.querySelector('.close-modal');
                    if (closeBtn) {
                        closeBtn.click();
                    }
                }
            }
        });
        
        console.log('Animations and event listeners attached');
    }, 500);
}); 