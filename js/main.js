document.addEventListener('DOMContentLoaded', () => {
    console.log('SYSTEM_INIT: ONLINE');

    // Navigation Active State
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });

    // Glitch Effect Randomizer
    const glitchTexts = document.querySelectorAll('.glitch-text');

    glitchTexts.forEach(text => {
        setInterval(() => {
            const originalText = text.getAttribute('data-text');
            if (Math.random() > 0.95) {
                text.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    text.style.transform = 'none';
                }, 50);
            }
        }, 2000);
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form Submission Simulation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'TRANSMITTING...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.innerText = 'DATA_SENT';
                btn.style.color = 'var(--acid-green)';
                btn.style.borderColor = 'var(--acid-green)';

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.color = '';
                    btn.style.borderColor = '';
                    btn.style.opacity = '1';
                    form.reset();
                }, 2000);
            }, 1500);
        });
    });

    // Slideshow Logic
    if (document.querySelector('.slideshow-container')) {
        showSlides(slideIndex);
    }
});

let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (slides.length === 0) return;

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-dot", "");
    }

    slides[slideIndex - 1].style.display = "block";
    if (dots.length > 0) {
        dots[slideIndex - 1].className += " active-dot";
    }
}
