const revealItems = document.querySelectorAll('[data-reveal]');
const tiltItems = document.querySelectorAll('[data-tilt]');
const navLinks = document.querySelectorAll('.nav-link');
const canvas = document.getElementById('webgl-canvas');
const sections = [
  document.getElementById('home'),
  document.getElementById('projects'),
  document.getElementById('contact')
].filter(Boolean);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
let scene;
let camera;
let modelGroup;
let fallbackGroup;
let mouseTargetX = 0;
let mouseTargetY = 0;
let rafId;

function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('active', isActive);
  });
}

function initReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function initSectionTracking() {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    {
      threshold: 0.42
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function initTilt() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  tiltItems.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 12;
      const rotateX = ((y / rect.height) - 0.5) * -12;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function initSoftParallax() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const heroText = document.querySelector('.hero-text');
  if (!heroText) {
    return;
  }

  let softRafId = null;
  document.addEventListener('pointermove', (event) => {
    if (softRafId) {
      cancelAnimationFrame(softRafId);
    }

    softRafId = requestAnimationFrame(() => {
      const xRatio = (event.clientX / window.innerWidth - 0.5) * 2;
      const yRatio = (event.clientY / window.innerHeight - 0.5) * 2;
      heroText.style.transform = `translate3d(${xRatio * 6}px, ${yRatio * 4}px, 0)`;
      mouseTargetX = xRatio;
      mouseTargetY = yRatio;
    });
  });
}

function addLights() {
  const ambient = new THREE.AmbientLight(0x9ec6ff, 1.3);
  const key = new THREE.DirectionalLight(0x73f8d8, 1.1);
  const fill = new THREE.DirectionalLight(0x6ea6ff, 1);

  key.position.set(4, 5, 3);
  fill.position.set(-4, -2, -2);

  scene.add(ambient, key, fill);
}

function createFallbackObjects() {
  fallbackGroup = new THREE.Group();

  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x6df5d3, metalness: 0.55, roughness: 0.32 }),
    new THREE.MeshStandardMaterial({ color: 0x58b9ff, metalness: 0.65, roughness: 0.28 }),
    new THREE.MeshStandardMaterial({ color: 0x93a4ff, wireframe: true })
  ];

  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.52, 0.16, 210, 30), materials[0]);
  knot.position.set(-1.55, 0.7, -0.2);

  const icosa = new THREE.Mesh(new THREE.IcosahedronGeometry(0.76, 1), materials[1]);
  icosa.position.set(1.65, -0.35, -0.45);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.045, 20, 120), materials[2]);
  ring.rotation.x = Math.PI * 0.65;
  ring.position.set(0.05, -0.18, -1.35);

  fallbackGroup.add(knot, icosa, ring);
  scene.add(fallbackGroup);
}

function loadMainModel() {
  if (!THREE.GLTFLoader) {
    createFallbackObjects();
    return;
  }

  const loader = new THREE.GLTFLoader();
  loader.load(
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Astronaut/glTF-Binary/Astronaut.glb',
    (gltf) => {
      modelGroup = gltf.scene;
      modelGroup.scale.set(1.4, 1.4, 1.4);
      modelGroup.position.set(0.35, -1.28, -0.45);
      modelGroup.rotation.y = -0.6;
      scene.add(modelGroup);
      createFallbackObjects();
      fallbackGroup.visible = true;
    },
    undefined,
    () => {
      createFallbackObjects();
    }
  );
}

function initThreeScene() {
  if (!canvas || prefersReducedMotion || typeof THREE === 'undefined') {
    return;
  }

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);

  addLights();
  loadMainModel();

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 480;
  const points = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i += 1) {
    points[i * 3] = (Math.random() - 0.5) * 24;
    points[i * 3 + 1] = (Math.random() - 0.5) * 16;
    points[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xb8ddff, size: 0.017, transparent: true, opacity: 0.65 })
  );
  scene.add(stars);

  const clock = new THREE.Clock();
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (modelGroup) {
      modelGroup.rotation.y += 0.0024;
      modelGroup.rotation.x = Math.sin(t * 0.6) * 0.08;
      modelGroup.position.y = -1.28 + Math.sin(t * 0.9) * 0.07;
    }

    if (fallbackGroup) {
      fallbackGroup.children[0].rotation.x += 0.004;
      fallbackGroup.children[0].rotation.y += 0.005;

      fallbackGroup.children[1].rotation.y -= 0.004;
      fallbackGroup.children[1].rotation.z += 0.003;

      fallbackGroup.children[2].rotation.z += 0.0022;
      fallbackGroup.position.y = Math.sin(t * 0.8) * 0.06;
    }

    camera.position.x += ((mouseTargetX * 0.42) - camera.position.x) * 0.03;
    camera.position.y += ((-mouseTargetY * 0.3) - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    stars.rotation.y += 0.0007;
    renderer.render(scene, camera);
  };

  animate();
}

function handleResize() {
  if (!renderer || !camera) {
    return;
  }

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

document.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
  initReveal();
  initSectionTracking();
  initTilt();
  initSoftParallax();
  setActiveNav('home');
});

window.addEventListener('resize', handleResize);

window.addEventListener('beforeunload', () => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  if (renderer) {
    renderer.dispose();
  }
});