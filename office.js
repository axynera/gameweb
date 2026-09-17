const THREE = window.THREE;
const tip = document.querySelector('#tip');

if (!THREE) {
  tip.textContent = 'Three.js gagal dimuat. Refresh halaman.';
  throw new Error('Three.js gagal dimuat');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb9d9ed);
scene.fog = new THREE.Fog(0xb9d9ed, 24, 60);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
document.querySelector('#game').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x66707a, 2.2));
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(8, 18, 10);
scene.add(sun);

const mats = {
  floor: new THREE.MeshLambertMaterial({ color: 0x686d73 }),
  floor2: new THREE.MeshLambertMaterial({ color: 0x7e8388 }),
  wall: new THREE.MeshLambertMaterial({ color: 0xe7e5df }),
  glass: new THREE.MeshLambertMaterial({ color: 0x8fc9dd, transparent: true, opacity: 0.55 }),
  desk: new THREE.MeshLambertMaterial({ color: 0x765038 }),
  deskTop: new THREE.MeshLambertMaterial({ color: 0x9b6b45 }),
  chair: new THREE.MeshLambertMaterial({ color: 0x293849 }),
  shirt: new THREE.MeshLambertMaterial({ color: 0x3474b9 }),
  shirt2: new THREE.MeshLambertMaterial({ color: 0x2f8b72 }),
  skin: new THREE.MeshLambertMaterial({ color: 0xe0a27d }),
  pants: new THREE.MeshLambertMaterial({ color: 0x252a35 }),
  shoes: new THREE.MeshLambertMaterial({ color: 0x17191d }),
  screen: new THREE.MeshLambertMaterial({ color: 0x43b9d4 }),
  screenDark: new THREE.MeshLambertMaterial({ color: 0x174b62 }),
  plant: new THREE.MeshLambertMaterial({ color: 0x3f9251 }),
  pot: new THREE.MeshLambertMaterial({ color: 0xb46b3e }),
  white: new THREE.MeshLambertMaterial({ color: 0xf5f2e9 }),
  yellow: new THREE.MeshLambertMaterial({ color: 0xf0c64b }),
  red: new THREE.MeshLambertMaterial({ color: 0xd9584f })
};

const box = new THREE.BoxGeometry(1, 1, 1);
function cube(x, y, z, sx, sy, sz, material, parent = scene) {
  const m = new THREE.Mesh(box, material);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  parent.add(m);
  return m;
}

// Open-top office room so the player clearly sees the workspace.
cube(0, -0.5, 0, 24, 1, 18, mats.floor);
cube(0, -0.02, 0, 23, 0.08, 17, mats.floor2);
cube(-12, 4, 0, 0.6, 8, 18, mats.wall);
cube(12, 4, 0, 0.6, 8, 18, mats.wall);
cube(0, 4, -9, 24, 8, 0.6, mats.wall);

// Windows on the back wall.
for (const x of [-7, -2.5, 2.5, 7]) {
  cube(x, 5.1, -8.64, 3.4, 2.8, 0.08, mats.glass);
  cube(x, 3.7, -8.72, 3.5, 0.12, 0.15, mats.white);
  cube(x, 6.5, -8.72, 3.5, 0.12, 0.15, mats.white);
}

// Desks, monitors and chairs.
const deskPositions = [];
for (const x of [-7, -2.4, 2.4, 7]) {
  for (const z of [-4.8, 2.2]) {
    deskPositions.push([x, z]);
    cube(x, 1.05, z, 3.2, 0.35, 1.55, mats.deskTop);
    cube(x - 1.25, 0.5, z, 0.22, 1.0, 1.25, mats.desk);
    cube(x + 1.25, 0.5, z, 0.22, 1.0, 1.25, mats.desk);
    cube(x, 1.75, z - 0.05, 0.18, 1.25, 0.18, mats.screenDark);
    cube(x, 2.35, z - 0.05, 1.35, 0.9, 0.16, mats.screen);
    cube(x, 1.8, z + 1.65, 1.05, 0.12, 0.9, mats.chair);
    cube(x, 2.35, z + 2.05, 1.0, 1.2, 0.16, mats.chair);
}

// Meeting table and chairs.
cube(0, 0.95, 6.1, 5.5, 0.35, 2.2, mats.deskTop);
for (const x of [-3.2, -1.1, 1.1, 3.2]) cube(x, 0.7, 6.1, 0.8, 0.12, 0.8, mats.chair);

// Printer/cabinet corner.
cube(9.2, 1.2, 5.8, 2.2, 2.4, 1.4, mats.white);
cube(9.2, 2.35, 5.05, 1.5, 0.25, 0.55, mats.screenDark);
cube(9.2, 1.65, 5.0, 1.6, 0.18, 0.65, mats.white);

// Plants.
for (const [x, z] of [[-10, 7], [10, -6.8], [-10, -7]]) {
  cube(x, 0.7, z, 1.0, 1.4, 1.0, mats.pot);
  cube(x, 2.0, z, 1.45, 1.7, 1.45, mats.plant);
  cube(x + 0.45, 2.7, z, 0.8, 1.0, 0.8, mats.plant);
}

// Voxel employee.
function createWorker(material) {
  const worker = new THREE.Group();
  const body = cube(0, 2.7, 0, 0.9, 1.25, 0.6, material, worker);
  cube(0, 4.0, 0, 0.72, 0.78, 0.72, mats.skin, worker);
  cube(-0.23, 1.45, 0, 0.3, 1.25, 0.38, mats.pants, worker);
  cube(0.23, 1.45, 0, 0.3, 1.25, 0.38, mats.pants, worker);
  cube(-0.23, 0.72, -0.02, 0.36, 0.25, 0.52, mats.shoes, worker);
  cube(0.23, 0.72, -0.02, 0.36, 0.25, 0.52, mats.shoes, worker);
  cube(-0.68, 2.65, 0, 0.22, 0.95, 0.22, mats.skin, worker);
  cube(0.68, 2.65, 0, 0.22, 0.95, 0.22, mats.skin, worker);
  return worker;
}

const worker = createWorker(mats.shirt);
scene.add(worker);
worker.position.set(-7, 0, -4.2);

// A second coworker makes the room feel alive.
const coworker = createWorker(mats.shirt2);
scene.add(coworker);
coworker.scale.setScalar(0.9);
coworker.position.set(2.4, 0, 2.2);

camera.position.set(15, 12, 18);
camera.lookAt(0, 2.0, 0);

// Main worker route: desk -> printer -> meeting table -> other desks.
const path = [
  [-7, -4.2], [-7, -1.2], [-7, 2.2], [-4.5, 2.2], [-4.5, -1.2],
  [-2.4, -1.2], [2.4, -1.2], [7, -1.2], [9.0, 2.0], [9.0, 5.0],
  [4.0, 6.1], [0, 6.1], [-4.0, 6.1], [-7, 4.0], [-7, -4.2]
];

let target = 1;
let sim = 0;
let last = performance.now();
const $ = id => document.getElementById(id);

function updateTask() {
  const task = target % 5;
  $('task').textContent = task === 0 ? 'Mengambil dokumen' :
    task === 1 ? 'Bekerja di komputer' :
    task === 2 ? 'Mengirim laporan' :
    task === 3 ? 'Rapat tim' : 'Istirahat singkat';
}

function moveWorker(dt) {
  const [tx, tz] = path[target];
  const dx = tx - worker.position.x;
  const dz = tz - worker.position.z;
  const distance = Math.hypot(dx, dz);
  if (distance < 0.12) {
    target = (target + 1) % path.length;
    updateTask();
    return;
  }
  const speed = 1.45;
  worker.position.x += dx / distance * speed * dt;
  worker.position.z += dz / distance * speed * dt;
  worker.rotation.y = Math.atan2(dx, dz);

  // Small walking animation.
  const step = Math.sin(sim * 9) * 0.08;
  worker.position.y = Math.max(0, step);
}

function animateCoworker() {
  // Coworker stays at the desk and subtly moves like they are typing.
  coworker.rotation.y = Math.PI;
  coworker.position.y = Math.sin(sim * 2.5) * 0.025;
}

function loop(time) {
  const dt = Math.min((time - last) / 1000, 0.05);
  last = time;
  sim += dt;

  moveWorker(dt);
  animateCoworker();

  const total = 8 * 3600 + sim * 20;
  const hours = Math.floor(total / 3600) % 24;
  const minutes = Math.floor(total / 60) % 60;
  $('clock').textContent = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  $('day').textContent = 1 + Math.floor(sim / 180);
  $('money').textContent = 100 + Math.floor(sim / 8);

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

updateTask();
requestAnimationFrame(loop);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});