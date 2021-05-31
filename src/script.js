import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector(".webgl");

// loading manager
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("onStart");
};

loadingManager.onLoaded = () => {
  console.log("onLoaded");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
loadingManager.onError = () => {
  console.log("onError");
};

//textures

const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("/textures/door.jpg");

//// DEBUG:
const gui = new dat.GUI({
  closed: true,
  width: 400,
});
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, {
      duration: 1,
      y: mesh.rotation.y + 10,
    });
  },
};

//scene

const scene = new THREE.Scene();

//object
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const geometry = new THREE.BufferGeometry()
// const count = 400
// const positionArray = new Float32Array(count * 3 *3)
//
// for (var i = 0; i < count*3*3; i++) {
//   positionArray[i] = (Math.random()- .5)*4
// }
// const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
// geometry.setAttribute('position', positionAttribute)
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
  //wireframe: true
});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// DEBUG:
gui.add(mesh.position, "y").min(-3).max(3).step(0.01);
gui.add(mesh, "visible");

gui.add(material, "wireframe");

gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});

gui.add(parameters, "spin");

//sizes

const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

//resize

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitfullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else {
      canvas.webkitRequestFullscreen;
    }
  } else {
    if (document.existFullscreen) {
      document.existFullscreen;
    } else {
      document.webkitExistFullscreen;
    }
  }
});

//camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

//control
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//cursors

const cursor = {
  x: 0,
  y: 0,
};

const cursors = window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX;
  cursor.y = -event.clientY;
});

//renderer

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

//animation
//gsap.to(mesh.position, {duration: 1, delay:1, x: 2})
const tick = () => {
  // camera.position.x = Math.sin(cursor.x*Math.PI*2)*3
  // camera.position.z = Math.cos(cursor.x*Math.PI*2)*3
  // camera.position.y = cursor.y
  controls.update();
  // camera.lookAt(mesh.position)
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
