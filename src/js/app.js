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

// Imports my shapes file to maintain clean code
import * as SHAPES from "./shapes.js";
const path = require('path');

// Global variables
var camera,
  scene,
  renderer,
  bulbLight,
  bulbLightObject,
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


// Runs the App
run(true);

/**
 * Runs the Three.JS app. Specifiy true or false to indicate whether you want to
 * use grid lines or not.
 *
 * @param  {[type]} useHelpers [description]
 * @return {[type]}            [description]
 */
function run(useHelpers) {
  // Initializes the scene camera and other objects used
  init(useHelpers);

  // Includes animation within this scene
  animate();

  // Includes a GUI which dynamically alters the scene
  generateDatGUI();
}

function init(useHelpers) {
  // Initialize and setup the Camera
  camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight,
    .1, 20);
  camera.position.z = 1;

  // Create the Scene
  scene = new THREE.Scene();

  // Grid Helper to help with building
  if (useHelpers) {
    var size = 10;
    var divisions = 10;

    var gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
  }

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
  bulbLightObject = new THREE.Mesh(
    new THREE.SphereGeometry(.1, 16, 8),
    new THREE.MeshBasicMaterial({
      color: bulbColor
    })
  );
  scene.add(bulbLightObject);
  bulbLightObject.position.x = bulbLight.position.x;
  bulbLightObject.position.y = bulbLight.position.y;
  bulbLightObject.position.z = bulbLight.position.z;
  function updateBulb(bulb, opts) {
    var newBulb = new THREE.Mesh(
      new THREE.SphereGeometry(.1, 16, 8),
      new THREE.MeshBasicMaterial({
        color: bulbColor
      })
    );
  }
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

function generateDatGUI() {
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
      bulbLight.intensity = value;
    });
  fLights.addColor(datOpts, 'bulbColor').onChange(function(
    value) {
    bulbLight.color.set(value);
    bulbLightObject.material.setValues({
      color: value
    });
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
}
