/**
 * @Author: Fabre Ed
 * @Date:   2017-12-01T11:52:05-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: app.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-02T17:40:21-05:00
 */



import '../css/app.css';
import * as THREE from 'three';
// Imports specific controls since this is an NPM project
THREE.OrbitControls = require(
  'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!../../node_modules\/three\/examples\/js\/controls\/OrbitControls'
);

// Imports my shape generators to maintain clean code
import * as SHAPES from "./shapes.js";
const path = require('path');

// Global variables
var camera,
  scene,
  renderer,
  light,
  light1,
  light2,
  light3;

// Shapes which will be used in this scene
var pyramid,
  cube,
  sphere,
  ring,
  dome,
  torus,
  torusKnot;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight,
    .1, 20);
  camera.position.z = 1;

  // Create the Scene
  scene = new THREE.Scene();

  // Grid Helper to help with building
  var size = 10;
  var divisions = 10;

  var gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  // Add Lights
  light = new THREE.PointLight(0xf2ff00, 1, 1000);
  light.position.set(0, 0, 0);
  scene.add(light);

  // light1 = new THREE.PointLight(0xffffff, 1, 1000);
  // light1.position.set(0, 0, 50);
  // scene.add(light1);
  //
  // light2 = new THREE.PointLight(0xffffff, 1, 1000);
  // light2.position.set(0, 50, 0);
  // scene.add(light2);
  //
  // light3 = new THREE.PointLight(0xffffff, 1, 1000);
  // light3.position.set(50, 0, 0);
  // scene.add(light3);

  // Define Materials, MeshPhongMaterials can interact with light.
  var reflectableGreenSolidMaterial = new THREE.MeshPhongMaterial({
    color: 0x72ee23
  });
  var greenWireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x42e7c5,
    wireframe: true
  });

  // Attaches the light to an object so that we can visualize light effects
  var lightbulb = new THREE.Mesh(
    new THREE.SphereGeometry(.1, 16, 8),
    new THREE.MeshBasicMaterial({
      color: 0xf2ff00
    })
  );
  scene.add(lightbulb);
  lightbulb.position.x = light.position.x;
  lightbulb.position.y = light.position.y;
  lightbulb.position.z = light.position.z;

  // Creates a cube as per given options
  cube = SHAPES.createCube({
    scene: scene,
    width: .1,
    height: .1,
    depth: .1,
    material: greenWireframeMaterial,
    position: {
      x: 1,
      y: 1,
      z: 0
    }
  });

  // Creates a sphere as per given options
  sphere = SHAPES.createSphereOrDome({
    scene: scene,
    radius: .1,
    widthSeg: 30,
    heightSeg: 20,
    material: reflectableGreenSolidMaterial,
    position: {
      x: -1,
      y: 1,
      z: 0
    }
  });

  // Creates a 2D Ring to act as sphere's ring
  ring = SHAPES.createRing({
    scene: scene,
    innerRadius: .15,
    outterRadius: .2,
    thetaSegments: 16,
    material: greenWireframeMaterial,
    position: {
      x: -1,
      y: 1,
      z: 0
    }
  });

  // Creates a dome as per given options
  dome = SHAPES.createSphereOrDome({
    scene: scene,
    radius: .1,
    widthSeg: 8,
    heightSeg: 6,
    phiStart: 0,
    phiLength: 2 * Math.PI,
    thetaStart: 0,
    thetaLength: Math.PI / 2,
    material: greenWireframeMaterial,
    position: {
      x: 0,
      y: 1,
      z: 0
    }
  });

  // Creates a Pyramid as per given options
  pyramid = SHAPES.createPyramid({
    scene: scene,
    baseRad: .1,
    height: .2,
    material: greenWireframeMaterial,
    position: {
      x: -1,
      y: -1,
      z: 0
    }
  });

  // Creates a Torus shape which looks like a donut
  torus = SHAPES.createTorus({
    scene: scene,
    radius: .1,
    tube: .05,
    radialSegments: 8,
    tubularSegments: 6,
    arc: Math.PI * 2,
    material: reflectableGreenSolidMaterial,
    position: {
      x: 0,
      y: -1,
      z: 0
    }
  });

  // Creates a TorusKnot shape which looks like a twisted donuts
  torusKnot = SHAPES.createTorusKnot({
    scene: scene,
    radius: .1,
    tube: .05,
    radialSegments: 8,
    tubularSegments: 64,
    p: 2,
    q: 3,
    material: reflectableGreenSolidMaterial,
    position: {
      x: 1,
      y: -1,
      z: 0
    }
  });



  // Updates the canvas on initial run
  updateCanvas({
    antialias: true,
    clearColor: 0x304850
  })
}

/**
 * This function is used to initialize and update the canvas. Like most of my
 * custom code, it takes a JSON obj parameter
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
function updateCanvas(opts) {
  // Sets the renderer canvas
  renderer = new THREE.WebGLRenderer({
    antialias: opts.antialias
  });
  renderer.setClearColor(opts.clearColor, 1.0);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add event Listeners
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', function() {
    renderer.render(scene, camera);
  });
}

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.02;

  dome.rotation.x += 0.01;

  pyramid.rotation.x += 0.01;
  pyramid.rotation.y += 0.02;

  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.02;

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.02;

  ring.rotation.x += 0.01;
  renderer.render(scene, camera);
}
