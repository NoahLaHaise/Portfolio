// ============================================
// GLITCH EFFECTS & PARTICLES
// ============================================

// Particle System for Background
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.colors = ['#FF006E', '#00F5FF', '#CCFF00'];

        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    update() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Random glitch effect
            if (Math.random() < 0.01) {
                particle.x += (Math.random() - 0.5) * 20;
                particle.y += (Math.random() - 0.5) * 20;
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        });

        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system on home page
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles');
    if (canvas) {
        const particleSystem = new ParticleSystem(canvas);
        particleSystem.animate();
    }

    // Random glitch effect on glitch-text elements
    const glitchElements = document.querySelectorAll('.glitch-text');
    glitchElements.forEach(element => {
        setInterval(() => {
            if (Math.random() < 0.1) {
                element.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    element.style.transform = '';
                }, 100);
            }
        }, 3000);
    });

    // Add random glitch to nav blocks on hover
    const navBlocks = document.querySelectorAll('.nav-block');
    navBlocks.forEach(block => {
        block.addEventListener('mouseenter', () => {
            const glitch = block.querySelector('.block-glitch');
            if (glitch) {
                glitch.style.animation = 'glitchSlide 0.5s linear';
                setTimeout(() => {
                    glitch.style.animation = '';
                }, 500);
            }
        });
    });
});

// Add glitch slide animation via CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes glitchSlide {
        0% { transform: translateX(-100%); opacity: 0; }
        50% { opacity: 0.2; }
        100% { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
