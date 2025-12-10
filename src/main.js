// ? Imports
import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
camera.position.setZ(30);
camera.lookAt(0, 0, 0);
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 1,   // Fully transmissive
  thickness: `1`,    // Glass thickness
  roughness: 0.0,      // Smooth surface
  ior: 1.5,          // Index of refraction for glass
  attenuationDistance: 2,
  attenuationColor: 0xffffff,
});

const loader = new GLTFLoader();
loader.load( 'public/yaka_model.glb', function ( gltf ) {
  const model = gltf.scene;
 model.position.set(0, 0, 20);
  model.rotateY((Math.PI / 2)); 
  model.traverse( ( child ) => {
    if ( child.isMesh && child.name === 'path378' ) {
      console.log(child.name);
      child.material = glassMaterial;
    }
  } );
  model.scale.set(25, 25, 25);
  scene.add( model );

}, undefined, function ( error ) {

  console.error( error );

} );

const light = new THREE.AmbientLight(0xffffff);
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(light);
scene.background = new THREE.Color(0xfffafa);
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera);
  controls.update();
}
animate();