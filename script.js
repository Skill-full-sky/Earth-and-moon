// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the Earth
const earthTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/300px-The_Earth_seen_from_Apollo_17.jpg');
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Create the Moon
const moonTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/280px-FullMoon2010.jpg');
const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(10, 0, 0);
scene.add(moon);

// Create the light source
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 0, 0);
scene.add(light);

// Animate the scene
let lastTime = 0;
function animate(now) {
  requestAnimationFrame(animate);

  // Rotate the Earth
  const timeDelta = now - lastTime;
  const earthRotationSpeed = 0.0001; // radians per millisecond
  const earthRotationAngle = earthRotationSpeed * timeDelta;
  earth.rotation.y += earthRotationAngle;

  // Rotate the Moon around its axis
  const moonRotationSpeed = 0.001; // radians per millisecond
  const moonRotationAngle = moonRotationSpeed * timeDelta;
  moon.rotation.y += moonRotationAngle;

  // Orbit the Moon around the Earth
  const moonOrbitSpeed = 0.00005; // radians per millisecond
  const moonOrbitAngle = moonOrbitSpeed * timeDelta;
  moon.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), moonOrbitAngle);

  // Check for eclipse
  const distance = moon.position.distanceTo(earth.position);
  const angleToLight = moon.position.angleTo(light.position.clone().sub(earth.position));
  const angleToEarth = moon.position.angleTo(earth.position.clone().sub(light.position));
  if (angleToLight > Math.PI / 2 && angleToEarth > Math.PI / 2 && distance < 6) {
    earth.material.opacity = 0.5;
  } else {
    earth.material.opacity = 1;
  }

  lastTime = now;

  // Render the scene
  renderer.render(scene, camera);
}

animate(0);
