// 3D Animated Portfolio Script - Optimized
let currentSection = 'home';
let mouseX = 0, mouseY = 0;
let mouseFollower;

// Cached DOM elements for performance
let cachedElements = {};

function init() {
    // Cache frequently accessed elements
    cacheElements();

    // Initialize mouse follower
    mouseFollower = cachedElements.mouseFollower;

    // Set up navigation
    setupNavigation();

    // Set up mouse tracking with debouncing
    setupMouseTracking();

    // Show initial section
    showSection('home');

    // Set initial 3D morph shape
    const nav3DMorph = cachedElements.nav3DMorph;
    if (nav3DMorph) {
        nav3DMorph.setAttribute('data-shape', 'home');
    }

    // Start optimized animation loop
    animate();
}

function cacheElements() {
    cachedElements = {
        mouseFollower: document.querySelector('.mouse-follower'),
        nav3DMorph: document.querySelector('.nav-3d-morph'),
        morph3DShape: document.querySelector('.morph-3d-shape'),
        vortexCore: document.querySelector('.vortex-core'),
        gridLines: document.querySelectorAll('.grid-line'),
        floatingSpheres: document.querySelectorAll('.floating-sphere'),
        floatingCubes: document.querySelectorAll('.floating-cube'),
        floatingRings: document.querySelectorAll('.floating-ring'),
        socialIcons: document.querySelectorAll('.social-icon'),
        projectCards: document.querySelectorAll('.project-card-3d'),
        particles3D: document.querySelectorAll('.particle-3d')
    };
}

function setupNavigation() {
    const navNodes3D = document.querySelectorAll('.nav-node-3d');
    const nav3DMorph = cachedElements.nav3DMorph;

    navNodes3D.forEach(node => {
        node.addEventListener('click', () => {
            const section = node.getAttribute('data-section');
            if (section) {
                showSection(section);
                // Update 3D morphing shape
                if (nav3DMorph) {
                    nav3DMorph.setAttribute('data-shape', section);
                }
            }
        });

        // Enhanced 3D hover effects
        node.addEventListener('mouseenter', () => {
            // Add magnetic effect with 3D transforms
            node.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        node.addEventListener('mouseleave', () => {
            // Reset transition
            node.style.transition = '';
        });
    });

    // Add 3D morphing system hover effects
    const morph3DContainer = document.querySelector('.morph-3d-container');
    if (morph3DContainer) {
        morph3DContainer.addEventListener('mouseenter', () => {
            morph3DContainer.style.transform = 'scale3d(1.05, 1.05, 1.05) rotateY(5deg)';
        });

        morph3DContainer.addEventListener('mouseleave', () => {
            morph3DContainer.style.transform = '';
        });
    }
}

function setupMouseTracking() {
    // Debounced mouse tracking for better performance
    let mouseTrackingTimeout;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update mouse follower position
        if (mouseFollower) {
            mouseFollower.style.left = mouseX - 10 + 'px';
            mouseFollower.style.top = mouseY - 10 + 'px';
        }

        // Debounce parallax updates
        clearTimeout(mouseTrackingTimeout);
        mouseTrackingTimeout = setTimeout(() => {
            updateParallax(mouseX, mouseY);
        }, 16); // ~60fps
    });
}

function updateParallax(x, y) {
    // Use cached elements for better performance
    const { floatingSpheres, floatingCubes, floatingRings } = cachedElements;

    floatingSpheres.forEach((sphere, index) => {
        const speed = (index + 1) * 0.005;
        const xOffset = (x - window.innerWidth / 2) * speed;
        const yOffset = (y - window.innerHeight / 2) * speed;
        sphere.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
    });

    floatingCubes.forEach((cube, index) => {
        const speed = (index + 1) * 0.003;
        const xOffset = (x - window.innerWidth / 2) * speed;
        const yOffset = (y - window.innerHeight / 2) * speed;
        cube.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
    });

    floatingRings.forEach((ring, index) => {
        const speed = (index + 1) * 0.002;
        const xOffset = (x - window.innerWidth / 2) * speed;
        const yOffset = (y - window.innerHeight / 2) * speed;
        ring.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
    });
}

function showSection(sectionId) {
    // Update current section tracking
    currentSection = sectionId;

    // Scroll to the target section smoothly
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Add entrance animation
        targetSection.style.animation = 'none';
        setTimeout(() => {
            targetSection.style.animation = 'cardEntrance 1s ease-out';
        }, 10);
    }

    // Update navigation highlight
    updateNavHighlight(sectionId);
}

function updateNavHighlight(sectionId) {
    const navNodes3D = document.querySelectorAll('.nav-node-3d');
    navNodes3D.forEach(node => {
        node.classList.remove('active');
        if (node.getAttribute('data-section') === sectionId) {
            node.classList.add('active');
        }
    });
}

// Enhanced animations - Optimized
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;
    const { floatingSpheres, floatingCubes, floatingRings, socialIcons, projectCards, morph3DShape, particles3D, vortexCore, gridLines } = cachedElements;

    // Batch floating element updates
    floatingSpheres.forEach((sphere, index) => {
        const rotation = time * (index + 1) * 30;
        sphere.style.transform += ` rotate(${rotation}deg)`;
    });

    floatingCubes.forEach((cube, index) => {
        const rotationX = time * (index + 1) * 20;
        const rotationY = time * (index + 1) * 25;
        cube.style.transform += ` rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    });

    floatingRings.forEach((ring, index) => {
        const scale = 1 + Math.sin(time * 2 + index) * 0.1;
        ring.style.transform = `scale(${scale})`;
    });

    // Pulse effect on social icons
    socialIcons.forEach((icon, index) => {
        const pulse = 1 + Math.sin(time * 3 + index * 0.5) * 0.05;
        icon.style.transform = `scale(${pulse})`;
    });

    // 3D hover effects on project cards - throttled
    if (time % 2 < 0.1) { // Only update every ~2 seconds
        projectCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (mouseX - centerX) / (rect.width / 2);
            const deltaY = (mouseY - centerY) / (rect.height / 2);

            const rotateX = deltaY * -10;
            const rotateY = deltaX * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    }

    // 3D Navigation System Animations - optimized
    if (morph3DShape) {
        const subtleRotation = Math.sin(time * 0.5) * 2;
        morph3DShape.style.transform += ` rotateY(${subtleRotation}deg)`;
    }

    // Dynamic particle field animation - optimized
    particles3D.forEach((particle, index) => {
        const orbitSpeed = 0.5 + index * 0.1;
        const orbitRadius = 40 + index * 5;
        const x = Math.cos(time * orbitSpeed) * orbitRadius;
        const z = Math.sin(time * orbitSpeed) * orbitRadius;
        particle.style.transform = `translate3d(${x}px, 0, ${z}px)`;
    });

    // Energy vortex dynamic scaling
    if (vortexCore) {
        const vortexScale = 1 + Math.sin(time * 2) * 0.2;
        vortexCore.style.transform = `scale(${vortexScale})`;
    }

    // Holographic grid pulsing - optimized
    if (time % 1 < 0.1) { // Only update every second
        gridLines.forEach((line, index) => {
            const pulseOpacity = 0.2 + Math.sin(time * 2 + index) * 0.3;
            line.style.opacity = pulseOpacity;
        });
    }
}

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();
let fps = 60;

function monitorPerformance() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // Log performance if FPS drops below 30
        if (fps < 30) {
            console.warn(`Performance warning: FPS dropped to ${fps}`);
        }
    }
}

// Cleanup function for better memory management
function cleanup() {
    // Clear any running timeouts/intervals
    if (window.performanceMonitor) {
        clearInterval(window.performanceMonitor);
    }

    // Remove event listeners if needed
    cachedElements = {};
}

// Initialize performance monitoring
window.addEventListener('load', () => {
    window.performanceMonitor = setInterval(monitorPerformance, 100);
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Typewriter effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typewriter effects
function initTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        const text = element.textContent;
        typeWriter(element, text);
    });
}

// Particle system for background
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particleContainer.appendChild(particle);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    init();
    initTypewriter();
    createParticles();
});

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', () => {
    // Handle resize if needed
});

// Add CSS for additional animations
const additionalStyles = `
<style>
.nav-face.active {
    background: var(--text-color) !important;
    color: var(--accent-color) !important;
    box-shadow: 0 0 20px var(--shadow-color);
}

.animate-in {
    animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
}

.particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: var(--accent-color);
    border-radius: 50%;
    animation: floatParticle 20s linear infinite;
    opacity: 0.3;
}

@keyframes floatParticle {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 0.6;
    }
    90% {
        opacity: 0.6;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .mouse-follower {
        display: none;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);