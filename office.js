const THREE = window.THREE;
const start = document.getElementById('start');
const play = document.getElementById('play');

if (!THREE) {
  document.querySelector('#tip').textContent = 'Three.js gagal dimuat. Refresh halaman.';
  throw new Error('Three.js gagal dimuat');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc8e5ff);
scene.fog = new THREE.Fog(0xc8e5ff, 22, 65);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
document.querySelector('#game').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x666666, 2));
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(10, 20, 10);
scene.add(sun);

const mats = {
  floor: new THREE.MeshLambertMaterial({ color: 0x777b82 }),
  wall: new THREE.MeshLambertMaterial({ color: 0xd8dadd }),
  desk: new THREE.MeshLambertMaterial({ color: 0x8a5a35 }),
  shirt: new THREE.MeshLambertMaterial({ color: 0x4676b9 }),
  skin: new THREE.MeshLambertMaterial({ color: 0xe1a47f }),
  pants: new THREE.MeshLambertMaterial({ color: 0x242832 }),
  screen: new THREE.MeshLambertMaterial({ color: 0x4db6d7 }),
  plant: new THREE.MeshLambertMaterial({ color: 0x4d9a50 })
};

const geo = new THREE.BoxGeometry(1, 1, 1);
function cube(x, y, z, s, material) {
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.scale.set(s.x, s.y, s.z);
  scene.add(mesh);
}

cube(0, -0.5, 0, { x: 24, y: 1, z: 18 }, mats.floor);
cube(-12, 4, 0, { x: 1, y: 9, z: 18 }, mats.wall);
cube(12, 4, 0, { x: 1, y: 9, z: 18 }, mats.wall);
cube(0, 4, -9, { x: 24, y: 9, z: 1 }, mats.wall);
cube(0, 8.5, 0, { x: 24, y: 1, z: 18 }, mats.wall);

for (let x = -8; x <= 8; x += 4) {
  for (let z = -5; z <= 5; z += 5) {
    cube(x, 1, z, { x: 3, y: 2, z: 1.5 }, mats.desk);
    cube(x, 2.25, z, { x: 1.5, y: 1, z: 0.12 }, mats.screen);
  }
}

for (const [x, z] of [[-9, -7], [9, -7], [-9, 7], [9, 7]]) {
  cube(x, 1, z, { x: 1.2, y: 2, z: 1.2 }, mats.plant);
}

const worker = new THREE.Group();
scene.add(worker);
worker.position.set(-8, 0, -5);
function part(x, y, z, s, material) {
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.scale.set(s[0], s[1], s[2]);
  worker.add(mesh);
}
part(0, 2.8, 0, [0.8, 1, 0.55], mats.shirt);
part(0, 3.8, 0, [0.65, 0.7, 0.65], mats.skin);
part(-0.25, 1.65, 0, [0.28, 1.2, 0.35], mats.pants);
part(0.25, 1.65, 0, [0.28, 1.2, 0.35], mats.pants);
part(-0.62, 2.65, 0, [0.2, 0.9, 0.2], mats.skin);
part(0.62, 2.65, 0, [0.2, 0.9, 0.2], mats.skin);

camera.position.set(0, 9, 14);
camera.lookAt(0, 2, 0);

const path = [
  [-8, -5], [-8, 0], [-8, 5], [-4, 5], [-4, 0], [-4, -5],
  [0, -5], [0, 0], [0, 5], [4, 5], [4, 0], [4, -5],
  [8, -5], [8, 0], [8, 5], [-8, 5]
];

let target = 1;
let started = false;
let sim = 0;
let last = performance.now();
const $ = id => document.getElementById(id);

function beginDemo(event) {
  if (event) event.preventDefault();
  started = true;
  start.classList.add('hidden');
  play.blur();
  last = performance.now();
}

play.addEventListener('click', beginDemo);
play.addEventListener('touchend', beginDemo, { passive: false });

function work(dt) {
  if (!started) return;
  const [tx, tz] = path[target];
  const dx = tx - worker.position.x;
  const dz = tz - worker.position.z;
  const distance = Math.hypot(dx, dz);
  if (distance < 0.1) {
    target = (target + 1) % path.length;
    return;
  }
  worker.position.x += (dx / distance) * 1.7 * dt;
  worker.position.z += (dz / distance) * 1.7 * dt;
  worker.rotation.y = Math.atan2(dx, dz);

  const task = target % 5;
  $('task').textContent = task === 0 ? 'Mengambil dokumen' :
    task === 1 ? 'Mengirim laporan' :
    task === 2 ? 'Bekerja di komputer' :
    task === 3 ? 'Rapat' : 'Istirahat singkat';
}

function loop(time) {
  const dt = Math.min((time - last) / 1000, 0.05);
  last = time;
  if (started) {
    sim += dt;
    work(dt);
    const total = 8 * 3600 + sim * 20;
    const hours = Math.floor(total / 3600) % 24;
    const minutes = Math.floor(total / 60) % 60;
    $('clock').textContent = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
    $('day').textContent = 1 + Math.floor(sim / 180);
    $('money').textContent = 100 + Math.floor(sim / 8);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
