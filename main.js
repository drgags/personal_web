import * as THREE from 'https://esm.sh/three@0.160.0';
// If OrbitControls is needed: import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThreeJSGlobe();
});

// --- Navigation Logic ---
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Toggle Mobile Menu
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Simple hamburger animation style swap could go here
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Sticky Header Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = 'none';
        }
    });
}

// --- Three.js Globe Visualization ---
function initThreeJSGlobe() {
    const container = document.getElementById('globe-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Geometry - A "Network" Globe
    // 1. Base Sphere (Iconic Blue/Gray)
    const sphereGeometry = new THREE.SphereGeometry(1.2, 50, 50);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x34495e, // Dark Blue-Gray
        opacity: 0.1,
        transparent: true,
        wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // 2. Wireframe / Grid Layer (Scientific look)
    const wireframeGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(1.21, 24, 24));
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x3498db, transparent: true, opacity: 0.3 });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // 3. Particles / Atmosphere
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        // Random points in sphere volume (rough approximation for atmosphere effect)
        posArray[i] = (Math.random() - 0.5) * 4; 
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x85c1e9, // Light Blue
        transparent: true,
        opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);


    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotation
        sphere.rotation.y += 0.002;
        wireframe.rotation.y += 0.002;
        particlesMesh.rotation.y -= 0.0005;

        // Subtle mouse interaction could be added here
        
        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
