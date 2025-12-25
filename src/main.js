// ? Imports
import "./style.css";
// import * as THREE from "three";
import * as THREE from "../node_modules/three/build/three.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
// Camera parameters
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10; // Controls zoom level
const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2, // left
  (frustumSize * aspect) / 2, // right
  frustumSize / 2, // top
  frustumSize / -2, // bottom
  41, // near
  1000 // far
);
camera.zoom = 0.85;
camera.position.setZ(50);

camera.updateProjectionMatrix();
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const textureLoader = new THREE.TextureLoader();

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 1, // Fully transmissive
  thickness: 0.5, // Glass thickness
  roughness: 0.5, // Smooth surface
  ior: 2, // Index of refraction for glass
  attenuationDistance: 2,
  attenuationColor: 0xffffff,
});
const flatMaterial = new THREE.MeshStandardMaterial({
  color: 0x01e5c00,
  emissive: 0xffff88, // Glow color
  emissiveIntensity: 1, // Glow strength
});
let model;
let sring, mring, lring;
const loader = new GLTFLoader();
loader.load(
  "rings.glb",
  function (gltf) {
    model = gltf.scene;
    sring = model.getObjectByName("path4");
    sring.material = flatMaterial;
    mring = model.getObjectByName("path1");
    mring.material = flatMaterial;
    lring = model.getObjectByName("path2");
    lring.material = flatMaterial;
    model.rotateY(Math.PI / 2);
    model.position.y = -4.5;
    model.position.x = 2;
    // model.rotateY(-Math.PI / 12);
    model.traverse((child) => {
      if (child.isMesh && child.name === "path378") {
        console.log(child.name);
        child.material = glassMaterial;
      }
    });
    model.scale.set(25, 25, 25);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
const squareGeo = new THREE.BoxGeometry(4, 4, 4);
const cubeTextures = [
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("img1.jpeg"),
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("img2.jpeg"),
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("img3.jpeg"),
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("img1.jpeg"),
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("img2.jpeg"),
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("img3.jpeg"),
  }),
];
cubeTextures.colorSpace = THREE.SRGBColorSpace;
const cube = new THREE.Mesh(squareGeo, cubeTextures);
cube.rotateY(Math.PI / 2);
cube.position.y = -19;
cube.position.x = 0;
scene.add(cube);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(1, -7, 8);
light.target.position.set(0, -19, 0);
scene.add(light);

scene.background = new THREE.Color(0x121212);
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sring.rotateY(0.01);
  mring.rotateY(0.01);
  lring.rotateY(-0.01);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.005;
  cube.rotation.z += 0.01;
}
function moveCamera() {
  const t = window.scrollY;
  camera.position.y = t * -0.028;
}
document.body.onscroll = moveCamera;

animate();
