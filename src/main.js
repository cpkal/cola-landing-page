import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let loader, camera, model, scene, renderer, mixer;

const fov = 65;
const near = 1;
const far = 10;

function main() {
  init();

  camera.position.z = 6;

  loader = new GLTFLoader();

  loader.load(
    // resource URL
    '/3d-pemweb/model/can10jul.glb',
    // called when the resource is loaded
    function (gltf) {
      gltf.scene.scale.set(3.3, 3.3, 3.3);
      gltf.scene.position.y = -1;

      model = gltf.scene;

      model.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.DoubleSide; // Render both front and back
        }
      });

      model.traverse((child) => {
        if (child.isMesh) {
          child.geometry.computeVertexNormals();
        }
      });


      scene.add(gltf.scene);

      changeTexture(model, '/3d-pemweb/texture/coke3.jpg');

      const animations = gltf.animations;

      mixer = new THREE.AnimationMixer(gltf.scene);
      let action = mixer.clipAction(animations[0]);
      console.log(action);
      action.play();

      onScrollAction();

      animateText();

      function animate() {
        mixer.update(0.015);
        renderer.render(scene, camera);
      }
      renderer.setAnimationLoop(animate);
    },
    // called while loading is progressing
    function (xhr) {

      console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    },
    // called when loading has errors
    function (error) {

      console.log('An error happened');

    }
  );

};

function init() {
  gsap.registerPlugin(ScrollTrigger);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.prepend(renderer.domElement);

  setupLights();
}

function changeTexture(model, texturePath) {
  const textureLoader = new THREE.TextureLoader();

  textureLoader.load(texturePath, (texture) => {
    texture.flipY = false;
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    });
  });
}

function onScrollAction() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.trigger1',
      start: 'top top',
      end: '50% top',
      scrub: true
    }
  })

  tl.to(model.rotation, {
    x: model.rotation.x + Math.PI * 2,  // One full roll (360 degrees)
    y: model.rotation.y + 0.3, // Slight tilt
    z: model.rotation.z - - 0.5,
    duration: 1, // 1-second animation
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: '.trigger2',
      start: '40% bottom',
      end: 'bottom bottom',
      scrub: true
    }
  })

  tl2.to(model.rotation, {
    // x: model.rotation.x + Math.PI * 2,  // Reverse full roll
    y: 5, // Reverse slight tilt
    z: 0,
    x: 0,
    duration: 3, // Same duration
  });

  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: '.trigger3',
      start: '10% bottom',
      end: '100% bottom',
      scrub: true,
    }
  })

  tl3.to(model.rotation, {
    z: model.rotation.z + Math.PI * 2 - 0.2, // 360 degrees
    duration: 5,
    ease: "power2.inOut"
  });

  tl3.to(model.position, {
    x: 2.5,     // Move on x-axis
    y: -0.5,     // Move on y-axis
    z: 1.6,    // Move on z-axis
    duration: 5,
  }, "<");

  const targetPosition = camera.position.clone();
  targetPosition.z -= 3

  const tl4 = gsap.timeline({
    scrollTrigger: {
      trigger: '.trigger4',
      start: '5% bottom',
      end: '50% bottom',
      scrub: true,
    }
  })

  tl4.to(model.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: 5,
  });


  tl4.to(model.rotation, {
    x: "+=6.28", // 1 putaran penuh (2 * Math.PI)
    z: "+=6.28", // Bisa juga putar di sumbu Z
    duration: 5,
  }, "<"); // Memulai animasi rotasi bersamaan


  // parallax
  gsap.to("#parallaxShare", {
    y: "-5%",
    ease: "none",
    scale: 1.2,
    scrollTrigger: {
      trigger: "#parallaxShare",
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    }
  });

}

function setupLights() {
  const light1 = new THREE.DirectionalLight(0xffffff, 10);
  light1.position.set(5, 10, 5); // Pastikan cahaya ada di posisi yang sesuai
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 10);
  light2.position.set(-5, 10, 5); // Pastikan cahaya ada di posisi yang sesuai
  scene.add(light2);

  const light3 = new THREE.DirectionalLight(0xffffff, 10);
  light2.position.set(0, -10, 5); // Pastikan cahaya ada di posisi yang sesuai
  scene.add(light3);
}

function animateText() {
  const textTl = gsap.timeline();

  textTl.to(".brand1", {
    y: "-=15",
    duration: 0.5,
    ease: "power2.inOut"
  }).to(".tagline1", {
    y: "-=15",
    duration: 0.5,
    ease: "power2.inOut"
  }).to(".tagline2", {
    y: "-=15",
    duration: 0.5,
    ease: "power2.inOut"
  });
}

if (window.matchMedia("(min-width: 1024px)").matches) {
  main();
}
