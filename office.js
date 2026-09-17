const THREE = window.THREE;
const tip = document.querySelector('#tip');

if (!THREE) {
  tip.textContent = 'Three.js gagal dimuat. Refresh halaman.';
  throw new Error('Three.js gagal dimuat');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaecde2);
scene.fog = new THREE.Fog(0xaecde2, 28, 75);

const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 120);
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.querySelector('#game').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x59636b, 2.1));
const sun = new THREE.DirectionalLight(0xffffff, 2.7);
sun.position.set(8, 18, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const mats = {
  floor: new THREE.MeshLambertMaterial({ color: 0x60666d }),
  carpet: new THREE.MeshLambertMaterial({ color: 0x3f4851 }),
  wall: new THREE.MeshLambertMaterial({ color: 0xe5e1d8 }),
  glass: new THREE.MeshLambertMaterial({ color: 0x80bfd4, transparent: true, opacity: 0.48 }),
  frame: new THREE.MeshLambertMaterial({ color: 0xf3eee3 }),
  wood: new THREE.MeshLambertMaterial({ color: 0x815637 }),
  woodLight: new THREE.MeshLambertMaterial({ color: 0xa8754d }),
  metal: new THREE.MeshLambertMaterial({ color: 0x69727a }),
  chair: new THREE.MeshLambertMaterial({ color: 0x263545 }),
  shirt: new THREE.MeshLambertMaterial({ color: 0x3476ba }),
  shirt2: new THREE.MeshLambertMaterial({ color: 0x278b72 }),
  shirt3: new THREE.MeshLambertMaterial({ color: 0xb85c49 }),
  skin: new THREE.MeshLambertMaterial({ color: 0xe0a17c }),
  pants: new THREE.MeshLambertMaterial({ color: 0x272b34 }),
  shoes: new THREE.MeshLambertMaterial({ color: 0x15171b }),
  monitor: new THREE.MeshLambertMaterial({ color: 0x4bbbd5 }),
  monitorDark: new THREE.MeshLambertMaterial({ color: 0x173f50 }),
  white: new THREE.MeshLambertMaterial({ color: 0xf4f0e7 }),
  green: new THREE.MeshLambertMaterial({ color: 0x41904e }),
  pot: new THREE.MeshLambertMaterial({ color: 0xb36b3e }),
  yellow: new THREE.MeshLambertMaterial({ color: 0xf0c74d }),
  red: new THREE.MeshLambertMaterial({ color: 0xd65b52 }),
  blue: new THREE.MeshLambertMaterial({ color: 0x4777bd })
};

const box = new THREE.BoxGeometry(1, 1, 1);
function cube(x, y, z, sx, sy, sz, material, parent = scene) {
  const m = new THREE.Mesh(box, material);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

// Main office shell: open roof for a clear game-camera view.
cube(0, -0.5, 0, 26, 1, 20, mats.floor);
cube(0, -0.02, 0, 25, 0.08, 19, mats.carpet);
cube(-13, 4, 0, 0.6, 8, 20, mats.wall);
cube(13, 4, 0, 0.6, 8, 20, mats.wall);
cube(0, 4, -10, 26, 8, 0.6, mats.wall);

// Glass windows with frames.
for (const x of [-8.5, -3, 3, 8.5]) {
  cube(x, 5.2, -9.62, 4.3, 2.9, 0.08, mats.glass);
  cube(x - 2.15, 5.2, -9.7, 0.12, 3.1, 0.14, mats.frame);
  cube(x + 2.15, 5.2, -9.7, 0.12, 3.1, 0.14, mats.frame);
  cube(x, 3.75, -9.7, 4.4, 0.12, 0.14, mats.frame);
  cube(x, 6.65, -9.7, 4.4, 0.12, 0.14, mats.frame);
}

// Reception desk.
cube(-9.2, 1.05, 7.4, 5.0, 0.45, 1.5, mats.woodLight);
cube(-11.2, 0.5, 7.4, 0.25, 1.1, 1.2, mats.wood);
cube(-7.2, 0.5, 7.4, 0.25, 1.1, 1.2, mats.wood);
cube(-9.2, 1.7, 7.1, 0.18, 1.2, 0.18, mats.monitorDark);
cube(-9.2, 2.3, 7.1, 1.5, 0.9, 0.15, mats.monitor);

// Reusable workstation.
function workstation(x, z) {
  cube(x, 1.05, z, 3.15, 0.35, 1.5, mats.woodLight);
  cube(x - 1.25, 0.5, z, 0.22, 1.0, 1.2, mats.wood);
  cube(x + 1.25, 0.5, z, 0.22, 1.0, 1.2, mats.wood);
  cube(x, 1.72, z - 0.08, 0.16, 1.2, 0.16, mats.monitorDark);
  cube(x, 2.34, z - 0.08, 1.35, 0.9, 0.15, mats.monitor);
  cube(x, 1.78, z + 1.6, 1.0, 0.12, 0.9, mats.chair);
  cube(x, 2.32, z + 2.0, 1.0, 1.15, 0.16, mats.chair);
}

for (const x of [-7, -2.35, 2.35, 7]) {
  workstation(x, -4.8);
  workstation(x, 1.8);
}

// Large meeting area.
cube(0, 0.95, 6.4, 6.2, 0.35, 2.25, mats.woodLight);
for (const x of [-3.7, -1.25, 1.25, 3.7]) {
  cube(x, 0.7, 6.4, 0.8, 0.12, 0.8, mats.chair);
  cube(x, 0.7, 9.0, 0.8, 0.12, 0.8, mats.chair);
}
cube(0, 2.0, 4.95, 0.15, 1.3, 0.15, mats.monitorDark);
cube(0, 2.7, 4.95, 2.8, 1.5, 0.12, mats.monitor);

// Break room / coffee corner.
cube(9.6, 1.0, 7.3, 4.5, 0.35, 1.35, mats.white);
cube(8.3, 1.8, 7.3, 1.2, 1.8, 1.1, mats.metal);
cube(10.8, 1.5, 7.3, 0.7, 1.2, 0.8, mats.red);
cube(9.6, 1.7, 6.6, 1.3, 0.25, 0.45, mats.monitorDark);

// Filing cabinets / printer station.
cube(10.4, 1.2, 2.5, 2.7, 2.4, 1.2, mats.white);
cube(10.4, 2.15, 1.85, 1.7, 0.25, 0.6, mats.monitorDark);
cube(10.4, 1.5, 1.8, 1.8, 0.18, 0.7, mats.white);

// Plants and office props.
function plant(x, z, scale = 1) {
  cube(x, 0.65 * scale, z, 0.9 * scale, 1.3 * scale, 0.9 * scale, mats.pot);
  cube(x, 1.9 * scale, z, 1.25 * scale, 1.55 * scale, 1.25 * scale, mats.green);
  cube(x + 0.42 * scale, 2.55 * scale, z, 0.75 * scale, 0.9 * scale, 0.75 * scale, mats.green);
}
plant(-11, -7.5, 1.1);
plant(11, -7.4, 1.1);
plant(-11, 3.8, 0.85);
plant(11, 3.8, 0.85);

// Office divider / glass meeting booth.
cube(-9.7, 3.2, 2.0, 0.12, 5.5, 7.0, mats.glass);
cube(-9.7, 3.2, -1.5, 0.2, 5.7, 0.12, mats.frame);
cube(-9.7, 3.2, 5.5, 0.2, 5.7, 0.12, mats.frame);

// Voxel people with separate limbs for animation.
function createWorker(shirtMaterial, scale = 1) {
  const g = new THREE.Group();
  g.userData.walkParts = [];
  const body = cube(0, 2.65, 0, 0.9, 1.25, 0.62, shirtMaterial, g);
  const head = cube(0, 4.0, 0, 0.72, 0.78, 0.72, mats.skin, g);
  const leftLeg = cube(-0.23, 1.35, 0, 0.3, 1.3, 0.38, mats.pants, g);
  const rightLeg = cube(0.23, 1.35, 0, 0.3, 1.3, 0.38, mats.pants, g);
  const leftArm = cube(-0.68, 2.65, 0, 0.22, 0.95, 0.22, mats.skin, g);
  const rightArm = cube(0.68, 2.65, 0, 0.22, 0.95, 0.22, mats.skin, g);
  cube(-0.23, 0.58, -0.03, 0.36, 0.25, 0.55, mats.shoes, g);
  cube(0.23, 0.58, -0.03, 0.36, 0.25, 0.55, mats.shoes, g);
  g.userData.leftLeg = leftLeg;
  g.userData.rightLeg = rightLeg;
  g.userData.leftArm = leftArm;
  g.userData.rightArm = rightArm;
  g.scale.setScalar(scale);
  return g;
}

const worker = createWorker(mats.shirt, 1);
worker.position.set(-7, 0, -4.8);
scene.add(worker);

const coworker1 = createWorker(mats.shirt2, 0.92);
coworker1.position.set(2.35, 0, 1.8);
coworker1.rotation.y = Math.PI;
scene.add(coworker1);

const coworker2 = createWorker(mats.shirt3, 0.88);
coworker2.position.set(-2.35, 0, -4.8);
coworker2.rotation.y = Math.PI;
scene.add(coworker2);

// A small boss character near the meeting room.
const boss = createWorker(mats.blue, 0.98);
boss.position.set(5.8, 0, 6.4);
boss.rotation.y = Math.PI;
scene.add(boss);

// Isometric-style camera. It slowly pans around the office.
let cameraAngle = 0;
const cameraRadius = 24;
function updateCamera() {
  const x = Math.sin(cameraAngle) * cameraRadius;
  const z = Math.cos(cameraAngle) * cameraRadius;
  camera.position.set(x, 15, z);
  camera.lookAt(0, 1.8, 0);
}
updateCamera();

// Main employee route with meaningful destinations.
const path = [
  [-7, -4.8], [-7, -1.2], [-7, 1.8], [-4.6, 1.8], [-4.6, -1.2],
  [-2.35, -1.2], [2.35, -1.2], [7, -1.2], [10, 2.5], [10, 7.0],
  [6.0, 7.0], [3.0, 6.4], [0, 6.4], [-3.0, 6.4], [-6.0, 6.4],
  [-7, 3.8], [-7, -4.8]
];

let target = 1;
let sim = 0;
let last = performance.now();
const $ = id => document.getElementById(id);

function taskForTarget() {
  const t = target % 7;
  return t === 0 ? 'Mengambil dokumen' :
    t === 1 ? 'Bekerja di komputer' :
    t === 2 ? 'Membaca email' :
    t === 3 ? 'Mengirim laporan' :
    t === 4 ? 'Ke ruang meeting' :
    t === 5 ? 'Rapat tim' : 'Istirahat & kopi';
}

function moveWorker(dt) {
  const [tx, tz] = path[target];
  const dx = tx - worker.position.x;
  const dz = tz - worker.position.z;
  const distance = Math.hypot(dx, dz);
  if (distance < 0.14) {
    target = (target + 1) % path.length;
    $('task').textContent = taskForTarget();
    return;
  }
  const speed = 1.55;
  worker.position.x += dx / distance * speed * dt;
  worker.position.z += dz / distance * speed * dt;
  worker.rotation.y = Math.atan2(dx, dz);
  const walk = Math.sin(sim * 10) * 0.32;
  worker.userData.leftLeg.rotation.x = walk;
  worker.userData.rightLeg.rotation.x = -walk;
  worker.userData.leftArm.rotation.x = -walk * 0.55;
  worker.userData.rightArm.rotation.x = walk * 0.55;
  worker.position.y = Math.abs(Math.sin(sim * 10)) * 0.035;
}

function animateDeskWorker(g, phase) {
  g.position.y = Math.sin(sim * 2.2 + phase) * 0.025;
  g.userData.leftArm.rotation.x = Math.sin(sim * 5 + phase) * 0.08;
  g.userData.rightArm.rotation.x = -Math.sin(sim * 5 + phase) * 0.08;
}

function loop(time) {
  const dt = Math.min((time - last) / 1000, 0.05);
  last = time;
  sim += dt;

  moveWorker(dt);
  animateDeskWorker(coworker1, 1);
  animateDeskWorker(coworker2, 2);
  animateDeskWorker(boss, 3);

  // Gentle camera movement keeps the scene alive without requiring controls.
  cameraAngle = Math.sin(sim * 0.045) * 0.55;
  updateCamera();

  const total = 8 * 3600 + sim * 20;
  const hours = Math.floor(total / 3600) % 24;
  const minutes = Math.floor(total / 60) % 60;
  $('clock').textContent = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  $('day').textContent = 1 + Math.floor(sim / 180);
  $('money').textContent = 100 + Math.floor(sim / 8);

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

$('task').textContent = taskForTarget();
requestAnimationFrame(loop);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});