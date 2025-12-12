// ? Imports
import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
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
    1000 ,                        // far
);
camera.zoom = 0.85;
camera.position.setZ(50);

camera.updateProjectionMatrix();
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
   antialias: true,
  
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.antialias = true;
// camera.lookAt(0, 0, 0);
const textureLoader = new THREE.TextureLoader();

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 1,   // Fully transmissive
  thickness: 0.1,    // Glass thickness
  roughness: 0.2,      // Smooth surface
  ior: 1.5,          // Index of refraction for glass
  attenuationDistance: 2,
  attenuationColor: 0xffffff,

});
const flatMaterial = new THREE.MeshStandardMaterial(
  {
  color: 0x01E5C00,
  emissive: 0xffffaa,    // Glow color
  emissiveIntensity: 1,  // Glow strength

});
let model;
let rings;
let sring,mring,lring;
const loader = new GLTFLoader();
loader.load( '/rings.glb', function ( gltf ) {
  model = gltf.scene;
  sring = model.getObjectByName('path4');
  sring.material = flatMaterial;
  mring = model.getObjectByName('path1');
  mring.material = flatMaterial;
  lring = model.getObjectByName('path2');
    lring.material = flatMaterial;
  model.rotateY((Math.PI / 2)); 
  model.position.y = -4.5;
  model.position.x = 2;
  model.rotateY(-Math.PI / 12);
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

const controls = new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.Color(0x121212);
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera);
  controls.update();
  sring.rotateY(0.01);
  mring.rotateY(0.01);
  lring.rotateY(-0.01);

}
animate();