// ======================
// Mobile Navigation Toggle
// ======================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Close menu when link is clicked
function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

hamburger.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ======================
// Smooth Scrolling
// ======================

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Only prevent default and smooth scroll for anchor links (starting with #)
        if (href && href.startsWith('#')) {
            e.preventDefault();

            const targetSection = document.querySelector(href);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
        // For regular page links (.html files), let the default behavior happen
    });
});

// ======================
// Navbar Background on Scroll
// ======================

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// ======================
// Intersection Observer for Fade-in Animations
// ======================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// ======================
// Contact Form Handling with Formspree
// ======================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formStatus = document.getElementById('form-status');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);

        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        formStatus.textContent = '';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                formStatus.style.color = 'var(--primary-color)';
                formStatus.style.marginTop = '1rem';
                contactForm.reset();
            } else {
                // Error from server
                formStatus.textContent = 'Oops! There was a problem sending your message. Please try again.';
                formStatus.style.color = 'var(--accent-color)';
                formStatus.style.marginTop = '1rem';
            }
        } catch (error) {
            // Network error
            formStatus.textContent = 'Network error. Please check your connection and try again.';
            formStatus.style.color = 'var(--accent-color)';
            formStatus.style.marginTop = '1rem';
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

// ======================
// Project Card Hover Effects
// ======================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ======================
// Lazy Loading for Images (Optional Enhancement)
// ======================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    // If you add data-src attributes to images, they'll lazy load
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// ======================
// Console Welcome Message
// ======================

console.log('%cWelcome to my Portfolio!', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the repository!', 'color: #6b7280; font-size: 14px;');
