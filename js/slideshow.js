// ======================
// Gallery/Slideshow Functionality
// ======================

// Track current slide index for each gallery
const galleryStates = {};

// Initialize gallery states
function initGalleries() {
    const galleries = document.querySelectorAll('.gallery-container');

    galleries.forEach(gallery => {
        const id = gallery.id;
        galleryStates[id] = { currentIndex: 0 };
    });
}

// Update counter display
function updateCounter(galleryId) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;

    const state = galleryStates[galleryId];
    const slides = gallery.querySelectorAll('.gallery-slide');
    const currentNum = state.currentIndex + 1;
    const total = slides.length;

    // Update counter based on gallery ID
    if (galleryId === 'liveShowsGallery') {
        const counter = document.getElementById('liveShowsCurrent');
        if (counter) {
            counter.textContent = String(currentNum).padStart(2, '0');
        }
    } else if (galleryId === 'artPortfolioGallery') {
        const counter = document.getElementById('artPortfolioCurrent');
        if (counter) {
            counter.textContent = String(currentNum).padStart(2, '0');
        }
    }
}

// Change gallery slide (direction: 1 for next, -1 for previous)
function changeGallery(galleryId, direction) {
    const container = document.getElementById(galleryId);
    if (!container) return;

    const slides = container.querySelectorAll('.gallery-slide');
    const indicators = container.querySelectorAll('.indicator');
    const state = galleryStates[galleryId];

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

    // Update counter
    updateCounter(galleryId);
}

// Go to specific gallery slide
function setGallery(galleryId, index) {
    const container = document.getElementById(galleryId);
    if (!container) return;

    const slides = container.querySelectorAll('.gallery-slide');
    const indicators = container.querySelectorAll('.indicator');
    const state = galleryStates[galleryId];

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

    // Update counter
    updateCounter(galleryId);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Get gallery containers
    const galleries = document.querySelectorAll('.gallery-container');

    if (galleries.length === 0) return;

    // Use the first visible gallery
    let activeGallery = null;
    galleries.forEach(gallery => {
        const rect = gallery.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (isVisible && !activeGallery) {
            activeGallery = gallery.id;
        }
    });

    if (!activeGallery && galleries.length > 0) {
        activeGallery = galleries[0].id;
    }

    // Arrow key navigation
    if (e.key === 'ArrowLeft') {
        changeGallery(activeGallery, -1);
    } else if (e.key === 'ArrowRight') {
        changeGallery(activeGallery, 1);
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initGalleries();

    // Initialize counters
    Object.keys(galleryStates).forEach(galleryId => {
        updateCounter(galleryId);
    });
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gallery-container').forEach(container => {
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(container.id);
        }, { passive: true });
    });
});

function handleSwipe(galleryId) {
    const swipeThreshold = 50; // Minimum distance for a swipe

    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next slide
        changeGallery(galleryId, 1);
    }

    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        changeGallery(galleryId, -1);
    }
}
