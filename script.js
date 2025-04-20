// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

// Immediately set up the mobile menu when the script loads
(function() {
    const burgerMenu = document.querySelector('.burger-menu');
    if (burgerMenu) {
        console.log('Initializing burger menu on script load');
        burgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            document.body.classList.toggle('mobile-nav-active');
            console.log('Mobile menu toggled:', document.body.classList.contains('mobile-nav-active'));
        });
    }
})();

// Loading screen
const loadingScreen = document.querySelector('.loading-screen');
const loadingDuration = 2000; // 2 seconds minimum for loading animation

window.addEventListener('load', () => {
    // Hide body scrollbar during loading
    document.body.style.overflow = 'hidden';
    
    // Minimum duration for the loading screen
    setTimeout(() => {
        // Hide the loading screen with animation
        loadingScreen.classList.add('hidden');
        
        // Re-enable scrolling
        document.body.style.overflow = '';
        
        // Start page animations after loading screen is hidden
        setTimeout(() => {
            initPageAnimations();
        }, 500);
    }, loadingDuration);
});

// Function to initialize all page animations
const initPageAnimations = () => {
    // Animate hero section elements
    const heroTl = gsap.timeline();
    
    heroTl.to('.hero-content h1', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    })
    .to('.hero-content p', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5')
    .to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5');
    
    // Apply split text animation to titles
    createSplitTextAnimation('.section-title');
    animateSplitText();
    
    // Add 3D hover effect to cards
    add3DHoverEffect();
    
    // Add staggered animations
    createStaggeredAnimation('.footer-column li', 0.05);
    createStaggeredAnimation('.info-item', 0.2);
    
    // Start the section reveal animations
    revealSections();
    
    // Initialize all other animations
    createParticleAnimation();
    createFloatingElements();
    setupFormAnimation();
    setupButtonEffects();
    addInteractiveTextHighlight();
    addMagneticEffect();
    animateContactCards();
    
    // Setup modal functionality
    setupModal();
};

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button, .feature-card, .social-link');

document.addEventListener('mousemove', e => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
    
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3
    });
});

// Cursor effects on interactive elements
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'transparent';
        cursor.style.border = '2px solid var(--primary-color)';
        cursorFollower.style.width = '50px';
        cursorFollower.style.height = '50px';
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursor.style.backgroundColor = 'var(--primary-color)';
        cursor.style.border = 'none';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
    });
});

// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// Text animation - split text into individual characters for animation
const createSplitTextAnimation = (selector) => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        // Get the original text
        const text = element.innerText;
        
        // Clear the element
        element.innerHTML = '';
        
        // Create spans for each character
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px) rotate(5deg)';
            span.style.transition = `all 0.3s ease ${i * 0.03}s`;
            
            // Handle spaces
            if (text[i] === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = text[i];
            }
            
            element.appendChild(span);
        }
        
        // Add a class to the element to mark it as processed
        element.classList.add('split-text-processed');
    });
};

// Animate split text when in view
const animateSplitText = () => {
    const processedElements = document.querySelectorAll('.split-text-processed');
    
    processedElements.forEach(element => {
        ScrollTrigger.create({
            trigger: element,
            start: 'top 80%',
            onEnter: () => {
                const spans = element.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0) rotate(0)';
                });
            }
        });
    });
};

// 3D hover effect for cards
const add3DHoverEffect = () => {
    console.log('Adding 3D hover effects to cards');
    const cards = document.querySelectorAll('.feature-card');
    
    // Add mousemove and mouseleave events without removing click events
    cards.forEach(card => {
        // First remove any existing hover events to prevent duplicates
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
        
        // Add new event listeners
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
    });
};

// Handlers for mouse events
function handleMouseMove(e) {
    const card = this;
    
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    
    // Calculate mouse position relative to card center
    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;
    
    // Calculate rotation values (max 10 degrees)
    const rotateY = mouseX * 0.05;
    const rotateX = -mouseY * 0.05;
    
    // Apply the 3D effect
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    
    // Add highlight effect based on mouse position
    const highlight = document.createElement('div');
    highlight.classList.add('card-highlight');
    highlight.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 20px;
        background: radial-gradient(
            circle at ${e.clientX - cardRect.left}px ${e.clientY - cardRect.top}px,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0) 50%
        );
        pointer-events: none;
        z-index: 2;
    `;
    
    // Remove existing highlights
    const existingHighlight = card.querySelector('.card-highlight');
    if (existingHighlight) {
        existingHighlight.remove();
    }
    
    card.appendChild(highlight);
}

function handleMouseLeave() {
    const card = this;
    
    // Reset the transform
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    
    // Remove highlight
    const highlight = card.querySelector('.card-highlight');
    if (highlight) {
        highlight.remove();
    }
}

// Staggered animation for elements
const createStaggeredAnimation = (selector, staggerAmount = 0.1) => {
    const elements = document.querySelectorAll(selector);
    
    gsap.from(elements, {
        scrollTrigger: {
            trigger: elements[0],
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: staggerAmount,
        ease: 'power3.out'
    });
};

// Reveal animation for sections
const revealSections = () => {
    // Reveal section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.to(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
    
    // Reveal paragraphs with delay
    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.to(text, {
            scrollTrigger: {
                trigger: text,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
    
    // Animate feature cards
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        const row = Math.floor(i / 4);
        const column = i % 4;
        
        gsap.to(card, {
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.1 * i,  // Sequential animation based on card index
            ease: 'power3.out'
        });
    });
    
    // Parallax effect for hero section
    gsap.to('.hero-visual', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 200,
        ease: 'none'
    });
};

// Animated background particle effect
const createParticleAnimation = () => {
    const particleContainer = document.querySelector('.particle-background');
    
    if (!particleContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 10 + 5;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Style the particle
        particle.style.cssText = `
            position: absolute;
            top: ${posY}%;
            left: ${posX}%;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(255, 255, 255, ${opacity});
            border-radius: 50%;
            animation: particleFloat ${duration}s infinite linear;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        particleContainer.appendChild(particle);
    }
};

// Interactive text highlight effect
const addInteractiveTextHighlight = () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4');
    
    headings.forEach(heading => {
        heading.addEventListener('mousemove', e => {
            const rect = heading.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            heading.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    var(--primary-color) 0%,
                    var(--secondary-color) 50%,
                    var(--accent-color) 100%
                )
            `;
            heading.style.backgroundClip = 'text';
            heading.style.webkitBackgroundClip = 'text';
            heading.style.webkitTextFillColor = 'transparent';
            heading.style.color = 'transparent';
        });
        
        heading.addEventListener('mouseleave', () => {
            // Reset to default gradient for elements that should have gradient
            if (heading.classList.contains('gradient-text')) {
                heading.style.background = 'var(--gradient)';
            } else {
                heading.style.background = 'none';
                heading.style.webkitTextFillColor = 'initial';
                heading.style.color = 'initial';
            }
        });
    });
};

// Create floating elements animation
const createFloatingElements = () => {
    const floatingItems = document.querySelectorAll('.floating-item');
    
    floatingItems.forEach(item => {
        const speed = item.getAttribute('data-speed') || 1;
        
        gsap.to(item, {
            y: `+=${30 * speed}`,
            x: `+=${20 * speed}`,
            rotation: 5 * speed,
            duration: 3 * speed,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
};

// Mobile Menu Toggle
const setupMobileMenu = () => {
    const burgerMenu = document.querySelector('.burger-menu');
    
    if (burgerMenu) {
        console.log('Burger menu found, setting up click listener');
        
        // Remove any existing click listeners to prevent conflicts
        burgerMenu.removeEventListener('click', toggleMobileMenu);
        
        // Add click event with stopPropagation to prevent document click handler from interfering
        burgerMenu.addEventListener('click', toggleMobileMenu);
    } else {
        console.error('Burger menu not found in the DOM');
    }
    
    // Function to toggle mobile menu
    function toggleMobileMenu(e) {
        e.stopPropagation(); // Stop event from bubbling to document
        console.log('Burger menu clicked, toggling mobile menu');
        document.body.classList.toggle('mobile-nav-active');
    }
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log('Nav link clicked, closing mobile menu');
            document.body.classList.remove('mobile-nav-active');
        });
    });
    
    // Close menu when clicking outside, but only if menu is active
    document.addEventListener('click', (e) => {
        const isMenuActive = document.body.classList.contains('mobile-nav-active');
        const isClickInsideNav = e.target.closest('.main-nav');
        const isClickOnBurger = e.target.closest('.burger-menu');
        
        if (isMenuActive && !isClickInsideNav && !isClickOnBurger) {
            console.log('Clicked outside menu, closing mobile menu');
            document.body.classList.remove('mobile-nav-active');
        }
    });
    
    // Ensure menu works on mobile devices with touch events
    burgerMenu.addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleMobileMenu(e);
    });
};

// Form animation
const setupFormAnimation = () => {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (input.value === '') {
                group.classList.remove('focused');
            }
        });
    });
};

// Button hover effects
const setupButtonEffects = () => {
    const buttons = document.querySelectorAll('.button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3
            });
        });
    });
};

// Page transitions
const setupPageTransitions = () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetElement,
                        offsetY: 80
                    },
                    ease: 'power3.out'
                });
            }
        });
    });
};

// Magnetic button effect
const addMagneticEffect = () => {
    const buttons = document.querySelectorAll('.button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', e => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Magnetic pull effect (max 10px)
            const magneticPull = 10;
            
            gsap.to(button, {
                x: x * magneticPull / rect.width,
                y: y * magneticPull / rect.height,
                duration: 0.3,
                ease: 'power3.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
};

// Add CSS styles for elements created in JS
const addDynamicStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .burger-menu {
            display: none;
            width: 30px;
            height: 20px;
            position: relative;
            z-index: 102;
        }
        
        .bar {
            width: 100%;
            height: 3px;
            background-color: var(--text-color);
            position: absolute;
            transition: var(--transition);
        }
        
        .bar:nth-child(1) {
            top: 0;
        }
        
        .bar:nth-child(2) {
            top: 50%;
            transform: translateY(-50%);
        }
        
        .bar:nth-child(3) {
            bottom: 0;
        }
        
        .burger-menu.active .bar:nth-child(1) {
            transform: translateY(8.5px) rotate(45deg);
        }
        
        .burger-menu.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .burger-menu.active .bar:nth-child(3) {
            transform: translateY(-8.5px) rotate(-45deg);
        }
        
        .particle {
            position: absolute;
            border-radius: 50%;
        }
        
        @keyframes particleFloat {
            0% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(20px, -30px) rotate(90deg);
            }
            50% {
                transform: translate(-20px, -50px) rotate(180deg);
            }
            75% {
                transform: translate(-30px, -20px) rotate(270deg);
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
            }
        }
        
        @media screen and (max-width: 768px) {
            .burger-menu {
                display: block;
            }
        }
    `;
    
    document.head.appendChild(style);
};

// Call this function on page load
window.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupPageTransitions();
    addDynamicStyles();
    
    // Initialize modal immediately to ensure it's ready
    if (document.querySelector('.modal-overlay')) {
        console.log('Initializing modal on DOMContentLoaded');
        setupModal();
    }
});

// Add animation for contact cards
const animateContactCards = () => {
    gsap.utils.toArray('.contact-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2 * i, // Stagger effect
            ease: 'power3.out'
        });
    });
    
    // Animate social container
    gsap.to('.social-container', {
        scrollTrigger: {
            trigger: '.social-container',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0.5,
        scale: 0.9,
        duration: 0,
        onComplete: () => {
            gsap.to('.social-container', {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
        }
    });
};

// Function to set up click listeners on all cards
const setupCardClickListeners = () => {
    const featureCards = document.querySelectorAll('.feature-card');
    console.log(`Setting up click listeners on ${featureCards.length} cards`);
    
    featureCards.forEach(card => {
        // First remove any existing click listeners by cloning the node
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        // Add click event handler directly, without any other handlers
        newCard.addEventListener('click', function(e) {
            console.log('Card clicked!', this);
            if (typeof openModal === 'function') {
                openModal(this);
            } else {
                console.error('openModal function not found!');
            }
        });
    });
};

// Create a global openModal function to ensure it's accessible
let openModal;

// Modal functionality for feature cards
const setupModal = () => {
    console.log('Setting up modal...');
    const modal = document.querySelector('.modal-overlay');
    const modalImage = document.querySelector('.modal-image');
    const modalContainer = document.querySelector('.modal-container');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const closeButton = document.querySelector('.modal-close');
    
    if (!modal) {
        console.error('Modal overlay not found!');
        return;
    }
    
    // Define the openModal function globally
    openModal = (card) => {
        console.log('Opening modal for card:', card);
        
        // Get data from the clicked card
        const cardImage = card.querySelector('.feature-img img');
        const cardTitle = card.querySelector('h3');
        const cardDescription = card.querySelector('p');
        
        if (!cardImage || !cardTitle || !cardDescription) {
            console.error("Card doesn't have required elements");
            return;
        }
        
        // Add loading indicator before image loads
        modalContainer.classList.add('loading');
        
        // Reset previous image state
        modalImage.classList.remove('loaded', 'error');
        modalImage.src = ''; // Clear previous image
        
        // Get the image source directly from the src attribute of the img element
        const originalSrc = cardImage.getAttribute('src');
        console.log('Original image src:', originalSrc);
        
        // Use the original title directly
        const fullTitle = cardTitle.textContent;
        
        // If it's an actual image path (not a placeholder)
        if (originalSrc && !originalSrc.includes('placeholder')) {
            // Try to load the image
            const tempImg = new Image();
            tempImg.onload = () => {
                // Image exists and loaded successfully
                modalImage.src = originalSrc;
                modalImage.alt = `Full image of ${cardTitle.textContent}`;
                modalImage.classList.add('loaded');
                modalContainer.classList.remove('loading');
                console.log('Image loaded successfully:', originalSrc);
            };
            
            tempImg.onerror = () => {
                // Image failed to load, use fallback
                modalImage.classList.add('error');
                modalContainer.classList.remove('loading');
                console.error('Failed to load image:', originalSrc);
            };
            
            // Start loading the image
            tempImg.src = originalSrc;
        } else {
            // It's a placeholder, just show the fallback
            modalImage.classList.add('error');
            modalContainer.classList.remove('loading');
        }
        
        // Set modal content text
        modalTitle.textContent = fullTitle;
        modalDescription.textContent = cardDescription.textContent;
        
        // Open modal with animation
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Animate modal with GSAP
        gsap.fromTo(
            '.modal-container',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );
    };
    
    // Close modal function
    const closeModal = () => {
        gsap.to('.modal-container', {
            opacity: 0,
            y: 50,
            duration: 0.3,
            ease: 'power3.in',
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
                modalImage.src = ''; // Clear the image source when closing
                
                // Setup card click listeners again to ensure they work after closing
                setTimeout(() => {
                    setupCardClickListeners();
                    add3DHoverEffect();
                }, 100);
            }
        });
    };
    
    // Initial setup of card click listeners
    setupCardClickListeners();
    
    // Close modal when close button is clicked
    closeButton.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal when Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
};

// Main initialization order
window.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupPageTransitions();
    addDynamicStyles();
    
    // Initialize modal immediately to ensure it's ready
    if (document.querySelector('.modal-overlay')) {
        console.log('Initializing modal on DOMContentLoaded');
        setupModal();
    }
});

// Call this function on page load with a small delay to ensure everything is ready
window.addEventListener('load', () => {
    console.log('Window loaded, setting up feature cards');
    
    // Ensure feature cards are visible
    ensureFeatureCardsVisible();
    
    // Make sure 3D effects are initialized
    if (typeof add3DHoverEffect === 'function') {
        add3DHoverEffect();
    }
    
    // Ensure click listeners are set up for all cards
    if (typeof setupCardClickListeners === 'function') {
        console.log('Setting up card click listeners on load');
        setupCardClickListeners();
    }
    
    // Reinitialize modal as a fallback
    if (typeof setupModal === 'function') {
        console.log('Reinitializing modal on load');
        setupModal();
    }
});

// Function to check if cards have click handlers
const checkCardsClickable = () => {
    const cards = document.querySelectorAll('.feature-card');
    console.log(`Checking ${cards.length} feature cards for click handlers`);
    
    // If we don't have cards with click handlers, set them up
    if (cards.length > 0 && typeof setupCardClickListeners === 'function') {
        setupCardClickListeners();
    }
};

// Run a check after a reasonable time to ensure cards are clickable
setTimeout(() => {
    checkCardsClickable();
}, 3000);

// Ensure feature cards are visible
const ensureFeatureCardsVisible = () => {
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
        console.log(`Found ${featureCards.length} feature cards, ensuring visibility`);
        
        // Make feature cards visible by removing any transform and changing opacity
        featureCards.forEach(card => {
            card.style.opacity = '1';
            // Don't reset transform here as it would conflict with 3D effects
            // Just reset it if there's no transform already
            if (!card.style.transform || card.style.transform === 'none') {
                card.style.transform = 'translateY(0)';
            }
        });
        
        // Also make sure the feature section is visible
        const featuresSection = document.querySelector('.features-section');
        if (featuresSection) {
            featuresSection.style.zIndex = '10';
            featuresSection.style.position = 'relative';
        }
    }
};

// Call this on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        ensureFeatureCardsVisible();
        window.forceReinitializeEffects();
    }, 500);
});

// Call this after animation
setTimeout(() => {
    ensureFeatureCardsVisible();
}, 2500);

// Create a global function to force reinitialize all effects
window.forceReinitializeEffects = () => {
    console.log("Reinitializing all effects");
    
    // Remove all card-highlight elements first
    document.querySelectorAll('.card-highlight').forEach(el => el.remove());
    
    // Reset any transform that might be stuck
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
    
    // Reinitialize all effects
    add3DHoverEffect();
    setupButtonEffects();
    addMagneticEffect();
    
}; 