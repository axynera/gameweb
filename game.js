import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const scene=new THREE.Scene();scene.background=new THREE.Color(0x8bd3ff);scene.fog=new THREE.Fog(0x8bd3ff,18,48);
const camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.1,100);camera.position.set(0,5,8);camera.lookAt(0,1,0);
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;document.querySelector('#game').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x567044,2.2));const sun=new THREE.DirectionalLight(0xffffff,2.5);sun.position.set(10,20,8);sun.castShadow=true;scene.add(sun);
const mats={grass:new THREE.MeshLambertMaterial({color:0x4fa83d}),dirt:new THREE.MeshLambertMaterial({color:0x87552f}),stone:new THREE.MeshLambertMaterial({color:0x777b7d}),wood:new THREE.MeshLambertMaterial({color:0x9b642f}),leaf:new THREE.MeshLambertMaterial({color:0x2f8438})};
const blocks=[];const geo=new THREE.BoxGeometry(1,1,1);
function addBlock(x,y,z,type){const m=new THREE.Mesh(geo,mats[type]);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);blocks.push(m);return m}
for(let x=-12;x<=12;x++)for(let z=-12;z<=12;z++){const h=1+Math.floor(Math.sin(x*.65)*.45+Math.cos(z*.5)*.4);for(let y=0;y<=h;y++)addBlock(x,y,z,y===h?'grass':y>h-3?'dirt':'stone')}
for(let i=0;i<14;i++){const x=Math.floor(Math.random()*20)-10,z=Math.floor(Math.random()*20)-10;if(Math.abs(x)<3&&Math.abs(z)<3)continue;for(let y=2;y<5;y++)addBlock(x,y,z,'wood');for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=4;dy<=6;dy++)if(Math.abs(dx)+Math.abs(dz)+Math.abs(dy-5)<4)addBlock(x+dx,dy,z+dz,'leaf')}
const player=new THREE.Object3D();player.position.set(0,3,6);scene.add(player);player.add(camera);camera.position.set(0,2.2,0);
const keys={};let started=false,hp=100,coins=0,broken=0;addEventListener('keydown',e=>keys[e.code]=true);addEventListener('keyup',e=>keys[e.code]=false);
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();keys[b.dataset.key]=true};b.onpointerup=b.onpointercancel=()=>keys[b.dataset.key]=false});
const ray=new THREE.Raycaster();const center=new THREE.Vector2(0,0);
function mine(){ray.setFromCamera(center,camera);const hits=ray.intersectObjects(blocks);if(!hits.length||hits[0].distance>8)return;const b=hits[0].object;scene.remove(b);blocks.splice(blocks.indexOf(b),1);broken++;coins+=Math.random()<.25?1:0;document.querySelector('#blocks').textContent=broken;document.querySelector('#coins').textContent=coins}
renderer.domElement.addEventListener('pointerdown',e=>{if(started&&e.target===renderer.domElement)mine()});document.querySelector('#mine').onclick=mine;
document.querySelector('#play').onclick=()=>{started=true;document.querySelector('#start').style.display='none';renderer.domElement.requestPointerLock?.()};
function update(dt){if(!started)return;const speed=5*dt;const dir=new THREE.Vector3();if(keys.KeyW||keys.ArrowUp)dir.z-=1;if(keys.KeyS||keys.ArrowDown)dir.z+=1;if(keys.KeyA||keys.ArrowLeft)dir.x-=1;if(keys.KeyD||keys.ArrowRight)dir.x+=1;if(dir.lengthSq()){dir.normalize();player.position.x+=dir.x*speed;player.position.z+=dir.z*speed}player.position.x=THREE.MathUtils.clamp(player.position.x,-11,11);player.position.z=THREE.MathUtils.clamp(player.position.z,-11,11);player.position.y=3.1+Math.sin(performance.now()*.006)*.04}
let last=performance.now();function loop(t){const dt=Math.min((t-last)/1000,.05);last=t;update(dt);renderer.render(scene,camera);requestAnimationFrame(loop)}requestAnimationFrame(loop);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)})
