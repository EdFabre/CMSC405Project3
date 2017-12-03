/**
 * @Author: Fabre Ed
 * @Date:   2017-12-01T11:52:05-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: app.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-03T10:38:46-05:00
 */



import '../css/app.css';
import * as THREE from 'three';
import * as dat from 'dat.gui/build/dat.gui.min.js';

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
  bulbLight,
  light1,
  light2,
  light3,
  gVelx = 0.01,
  gVely = 0.02,
  bulbIntensity = 1,
  bulbColor = '#e0db09';

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

var datOpts = {
  bulbIntensity,
  bulbColor,
  gVelx,
  gVely,
  stop: function() {
    gVelx = 0;
    gVely = 0;
  },
  reset: function() {
    this.gVelx = 0.01;
    this.gVely = 0.02;
    gVelx = 0.01;
    gVely = 0.02;
    camera.position.z = 1;
    cube.material.wireframe = true;
  }
};

var gui = new dat.GUI();

var velocity = gui.addFolder('Velocity');
velocity.add(datOpts, 'gVelx', -.1, .1).name('X').onChange(function(
  value) {
  gVelx = value;
});
velocity.add(datOpts, 'gVely', -.1, .1).name('Y').onChange(function(
  value) {
  gVely = value;
});
velocity.open();

var fLights = gui.addFolder('Lights');
fLights.add(datOpts, 'bulbIntensity', 0, 10).name('intensity').onChange(
  function(
    value) {
    console.log(value);
    bulbIntensity = value;
  });
fLights.addColor(datOpts, 'bulbColor').onChange(function(
  value) {
  bulbColor = value;
});
fLights.open();


var box = gui.addFolder('Cube');
box.add(cube.scale, 'x', 0, 3).name('Width').listen();
box.add(cube.scale, 'y', 0, 3).name('Height').listen();
box.add(cube.scale, 'z', 0, 3).name('Length').listen();
box.add(cube.material, 'wireframe').listen();
box.open();

gui.add(datOpts, 'stop');
gui.add(datOpts, 'reset');
// var fAnim = gui.addFolder('Animations');
// fLights.add('text', 'speed', {
//   Stopped: 0,
//   Slow: gVelx,
//   Fast: 0.05
// });

// fAnim.open();

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
  bulbLight = new THREE.PointLight(bulbColor, bulbIntensity, 1000);
  bulbLight.position.set(0, 0, 0);
  scene.add(bulbLight);

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
    color: '#f50101',
    wireframe: true
  });
  var greenWireframeMaterial = new THREE.MeshPhongMaterial({
    color: '#42e7c5',
    wireframe: true
  });

  // Attaches the light to an object so that we can visualize light effects
  var lightbulb = new THREE.Mesh(
    new THREE.SphereGeometry(.1, 16, 8),
    new THREE.MeshBasicMaterial({
      color: bulbColor
    })
  );
  scene.add(lightbulb);
  lightbulb.position.x = bulbLight.position.x;
  lightbulb.position.y = bulbLight.position.y;
  lightbulb.position.z = bulbLight.position.z;

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
    clearColor: '#304850'
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

  cube.rotation.x += gVelx;
  cube.rotation.y += gVely;

  sphere.rotation.x += gVelx;
  sphere.rotation.y += gVely;

  dome.rotation.x += gVelx;
  dome.rotation.y += gVelx;

  pyramid.rotation.x += gVelx;
  pyramid.rotation.y += gVely;

  torusKnot.rotation.x += gVelx;
  torusKnot.rotation.y += gVely;

  torus.rotation.x += gVelx;
  torus.rotation.y += gVely;

  ring.rotation.x += gVelx;
  ring.rotation.y += gVely;
  renderer.render(scene, camera);
}
