// ? Imports
import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
// Camera parameters
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10; // Controls zoom level
const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2, // left
    (frustumSize * aspect) / 2,  // right
    frustumSize / 2,             // top
    frustumSize / -2,            // bottom
    0.1,                         // near
    1000                         // far
);
camera.zoom = 0.85;
camera.position.setZ(50);

camera.updateProjectionMatrix();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

// camera.lookAt(0, 0, 0);
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 1,   // Fully transmissive
  thickness: `1`,    // Glass thickness
  roughness: 0.0,      // Smooth surface
  ior: 1.5,          // Index of refraction for glass
  attenuationDistance: 2,
  attenuationColor: 0xffffff,
});
const flatMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
var model;
var rings;
const loader = new GLTFLoader();
loader.load( 'public/rings.glb', function ( gltf ) {
  model = gltf.scene;
  model.rotateY((Math.PI / 2)); 
  model.position.y = -4;
  model.position.x = 2;
  model.traverse( ( child ) => {
    if ( child.isMesh && child.name === 'path378' ) {
      console.log(child.name);
      child.material = glassMaterial;
    }

  });
  model.scale.set(25, 25, 25);
  scene.add( model );

}, undefined, function ( error ) {

  console.error( error );

} );

const light = new THREE.AmbientLight(0xffffff);
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(light);
scene.background = new THREE.Color(0x121212);
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera);
  controls.update();

}
animate();