import * as THREE from 'three';

// CLOCK CYCLE PROOF OF CONCEPT
let pulseHz = 1.6;     // pulses per second (visible “clock”)
let base = 1.0;        // baseline scale
let amp  = 0.18;       // how much it grows/shrinks around baseline
let t0 = performance.now();

function setPulseHz(hz) {
  pulseHz = hz;
  console.log(`pulseHz set to ${hz}`);
}

window.setPulseHz = setPulseHz;

/*
  ===== UTILITY HELPERS
*/
import { loadTexture } from './utils/loadTexture';

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Set global color management
THREE.ColorManagement.enabled = true;

/*
  ===== GLOBAL VARIABLES
*/
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

const FOV = 75
const ASPECT = WIDTH / HEIGHT
const NEAR = 0.1
const FAR = 100

/*
  ===== SCENE
*/
const scene = new THREE.Scene();

/*
  ===== CAMERA
*/
const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);

/*
  ===== GRID HELPER
*/
const size = 20;
const divisions = 20;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

/*
  ===== RENDERER
*/
const renderer = new THREE.WebGLRenderer({ antialias: true });
// set the size
renderer.setSize( WIDTH, HEIGHT );
// enable webXR on the renderer
renderer.xr.enabled = true;
// add automatically created canvas element to the webpage
document.body.appendChild(renderer.domElement);

// add VRButton/ARButton to enter XR
const xrButtonContainer = document.getElementById('xr-button-container') || document.body;
xrButtonContainer.appendChild(VRButton.createButton(renderer));

// orbit controls --> zoom in/out with scroll, pan with right-click, and drag to orbit
const controls = new OrbitControls(camera, renderer.domElement);
// Optional controls configuration
controls.enableDamping = true; // Gives a smooth animation feel
controls.dampingFactor = 0.05;
controls.enableZoom = true;

/*
  ===== GEOMETRY -> CUBE
*/
const cubeGeometry = new THREE.BoxGeometry( 2, 2, 2 );
// create a material
const cubeMaterial = new THREE.MeshStandardMaterial( { color: 0x8F6D2E } );
// create mesh with geometry and material
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
// position the cube in the scene
cube.position.y = 2;
// cast shadow onto floor
cube.castShadow = true;
// pass cube mesh to the scene
scene.add(cube)

/*
  ===== LIGHTING
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 4. Enable shadows for better depth perception
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// set the x, y, z position of the camera
camera.position.set(2, 2, 5);
camera.lookAt(0, 0, 0);

/*
  ===== WINDOW RESIZE HANDLER
*/
function onWindowResize() {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add event listener for window resize
window.addEventListener('resize', onWindowResize);

/*
  ===== FLOOR & TEXTURE
*/
loadTexture('./assets/cgaxis_raw_cracked_white_concrete_46_42_4K/raw_cracked_white_concrete_46_42_ao.jpg').then((texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20); // tile texture 4x4
  texture.colorSpace = THREE.SRGBColorSpace;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
      map: texture,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide
    })
  );
  
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  // receive shadow from the cube
  floor.receiveShadow = true;
  scene.add(floor);
});


/*
  ===== RENDER LOOP
*/
function animate() {
    // call the animate() function every frame - creates a loop
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // increase the cube's rotation each frame
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    // cube.rotation.z += 0

    const t = (performance.now() - t0) / 1000;
    const s = base + amp * Math.sin(2 * Math.PI * pulseHz * t);
    // cube.scale.set(s, s, s); 

    // render the updated scene and camera
    renderer.render(scene, camera)
}
// call the animate() function
animate();