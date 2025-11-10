// ======================
// Slideshow Functionality
// ======================

// Track current slide index for each slideshow
const slideshowStates = {};

// Initialize slideshow states
function initSlideshows() {
    const slideshows = document.querySelectorAll('.slideshow-container');

    slideshows.forEach(slideshow => {
        const id = slideshow.id;
        slideshowStates[id] = { currentIndex: 0 };
    });
}

// Change slide (direction: 1 for next, -1 for previous)
function changeSlide(slideshowId, direction) {
    const container = document.getElementById(slideshowId);
    if (!container) return;

    const slides = container.querySelectorAll('.slide');
    const indicators = container.querySelectorAll('.indicator');
    const state = slideshowStates[slideshowId];

    // Hide current slide
    slides[state.currentIndex].classList.remove('active');
    indicators[state.currentIndex].classList.remove('active');

    // Calculate new index
    state.currentIndex += direction;

    // Wrap around
    if (state.currentIndex >= slides.length) {
        state.currentIndex = 0;
    } else if (state.currentIndex < 0) {
        state.currentIndex = slides.length - 1;
    }

    // Show new slide
    slides[state.currentIndex].classList.add('active');
    indicators[state.currentIndex].classList.add('active');
}

// Go to specific slide
function goToSlide(slideshowId, index) {
    const container = document.getElementById(slideshowId);
    if (!container) return;

    const slides = container.querySelectorAll('.slide');
    const indicators = container.querySelectorAll('.indicator');
    const state = slideshowStates[slideshowId];

    // Validate index
    if (index < 0 || index >= slides.length) return;

    // Hide current slide
    slides[state.currentIndex].classList.remove('active');
    indicators[state.currentIndex].classList.remove('active');

    // Update index
    state.currentIndex = index;

    // Show new slide
    slides[state.currentIndex].classList.add('active');
    indicators[state.currentIndex].classList.add('active');
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Get the first slideshow container (for simplicity, you can make this more sophisticated)
    const slideshows = document.querySelectorAll('.slideshow-container');

    if (slideshows.length === 0) return;

    // Use the first visible slideshow
    let activeSlideshow = null;
    slideshows.forEach(slideshow => {
        const rect = slideshow.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (isVisible && !activeSlideshow) {
            activeSlideshow = slideshow.id;
        }
    });

    if (!activeSlideshow) {
        activeSlideshow = slideshows[0].id;
    }

    // Arrow key navigation
    if (e.key === 'ArrowLeft') {
        changeSlide(activeSlideshow, -1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(activeSlideshow, 1);
    }
});

// Auto-advance slideshows (optional - uncomment to enable)
/*
function autoAdvanceSlideshows() {
    Object.keys(slideshowStates).forEach(slideshowId => {
        changeSlide(slideshowId, 1);
    });
}

// Auto-advance every 5 seconds
setInterval(autoAdvanceSlideshows, 5000);
*/

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initSlideshows();
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.querySelectorAll('.slideshow-container').forEach(container => {
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(container.id);
    }, { passive: true });
});

function handleSwipe(slideshowId) {
    const swipeThreshold = 50; // Minimum distance for a swipe

    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next slide
        changeSlide(slideshowId, 1);
    }

    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        changeSlide(slideshowId, -1);
    }
}
