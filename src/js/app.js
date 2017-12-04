/**
 * @Author: Fabre Ed
 * @Date:   2017-12-01T11:52:05-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: app.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-03T23:29:35-05:00
 */

import '../css/app.css';
import * as THREE from 'three';
import * as dat from 'dat.gui/build/dat.gui.min.js';
var convert = require('color-convert');

// Imports specific controls since this is an NPM project
THREE.OrbitControls = require(
  'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!../../node_modules\/three\/examples\/js\/controls\/OrbitControls'
);

// Imports my shapes file to maintain clean code
import * as SHAPES from "./shapes.js";
const path = require('path');

// Global variables
var camera,
  origCamera,
  scene,
  renderer,
  canvasColor,
  lightBulb,
  sceneLightY,
  sceneLightZ,
  sceneLightX,
  gVelx,
  gVely;

// Shapes and materials which will be used in this scene
var pyramid,
  cube,
  sphere,
  ring,
  dome,
  torus,
  torusKnot;


// Runs the App with(true) or without(false) helpers.
run(false);

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

/**
 * This function is where the creation and rendering of the scene occurs.
 *
 * @param  {[type]} useHelpers [description]
 * @return {[type]}            [description]
 */
function init(useHelpers) {
  // Initialize some of our globals
  gVelx = 0.01;
  gVely = 0.02;
  canvasColor = '#304850';

  // Initialize and setup the Camera
  camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight,
    .1, 20);
  camera.position.z = 1;

  // Save the camera original position
  origCamera = camera.clone();

  // Create the Scene
  scene = new THREE.Scene();

  // Grid Helper to help with building the scene
  if (useHelpers) {
    var size = 10;
    var divisions = 10;

    var gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
  }

  // Adds a light bulb to the current scene
  lightBulb = addLightBulb({
    scene,
    color: '#ffffff',
    intensity: 2,
    distance: 100,
    position: {
      x: 0,
      y: 0,
      z: 0
    }
  });

  // var light = new THREE.AmbientLight(0x404040, 5); // soft white light
  // scene.add(light);

  // sceneLightX = new THREE.PointLight(0xffffff, 1, 1000);
  // sceneLightX.position.set(50, 0, 0);
  // scene.add(sceneLightX);
  //
  // sceneLightY = new THREE.PointLight(0xffffff, 1, 1000);
  // sceneLightY.position.set(0, 50, 0);
  // scene.add(sceneLightY);
  //
  // sceneLightZ = new THREE.PointLight(0xffffff, 1, 1000);
  // sceneLightZ.position.set(0, 0, 50);
  // scene.add(sceneLightZ);

  // Creates a cube as per given options
  cube = SHAPES.createCube({
    scene: scene,
    width: .1,
    height: .1,
    depth: .1,
    color: '#ff000f',
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
    color: '#0c6163',
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
    color: '#750a82',
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
    color: '#385b0d',
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
    color: '#cb4d17',
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
    color: '#4a778f',
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
    color: '#706a1b',
    position: {
      x: 1,
      y: -1,
      z: 0
    }
  });

  // Updates the canvas on initial run
  createCanvas({
    antialias: true,
    clearColor: canvasColor
  })
}

/**
 * This function is used to initialize and update the canvas. Like most of my
 * custom code, it takes a JSON obj parameter
 *
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
function createCanvas(opts) {
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

/**
 * Adds basic rotating animation to the scene
 *
 * @return {[type]} [description]
 */
function animate() {
  requestAnimationFrame(animate);

  cube.mesh.rotation.x += gVelx;
  cube.mesh.rotation.y += gVely;

  sphere.mesh.rotation.x += gVelx;
  sphere.mesh.rotation.y += gVely;

  dome.mesh.rotation.x += gVelx;
  dome.mesh.rotation.y += gVelx;

  pyramid.mesh.rotation.x += gVelx;
  pyramid.mesh.rotation.y += gVely;

  torusKnot.mesh.rotation.x += gVelx;
  torusKnot.mesh.rotation.y += gVely;

  torus.mesh.rotation.x += gVelx;
  torus.mesh.rotation.y += gVely;

  ring.mesh.rotation.x += gVelx;
  ring.mesh.rotation.y += gVely;
  renderer.render(scene, camera);
}

/**
 * Creates a light for the scene.
 *
 * @param  {[type]} lightType [description]
 * @param  {[type]} opts      [description]
 * @return {[type]}           [description]
 */
function addLight(opts) {
  var tempLight;
  switch (opts.type) {
    case 'point':
      tempLight = new THREE.PointLight(
        opts.color || '#ffffff',
        opts.intensity || 1,
        opts.distance || 100,
        opts.decay || 1);
      tempLight.position.set(
        opts.position.x,
        opts.position.y,
        opts.position.z);
      opts.scene.add(tempLight);
      return tempLight;
    default:
  }
}

/**
 * Updates the bulbs position based on where the light is. This is only Used
 * once, but when i revisit this project i will be using this more often.
 *
 * @param {[type]} inBulb  [description]
 * @param {[type]} inLight [description]
 */
function updateBulbPosition(inBulb, inLight) {
  inBulb.position.x = inLight.position.x;
  inBulb.position.y = inLight.position.y;
  inBulb.position.z = inLight.position.z;
}

/**
 * Creates a light bulb and returns a reference to the bulb and light object.
 *
 * @param  {[type]} inColor [description]
 * @param  {[type]} inScene [description]
 * @return {[type]}         [description]
 */
function addLightBulb(opts) {
  var tempBulb = new THREE.Mesh(
    new THREE.SphereGeometry(.2, 20, 10),
    new THREE.MeshBasicMaterial({
      color: opts.color || '#ffffff'
    })
  );
  opts.scene.add(tempBulb);

  var tempLight = addLight({
    scene,
    type: 'point',
    color: opts.color,
    intensity: opts.intensity,
    distance: opts.distance,
    position: {
      x: opts.position.x,
      y: opts.position.y,
      z: opts.position.z
    }
  });

  updateBulbPosition(tempBulb, tempLight);

  return {
    bulb: tempBulb,
    light: tempLight,
    color: opts.color,
    intensity: opts.intensity
  }
}

/**
 * Creates a dat.GUI object on the screen.
 *
 * @return {[type]} [description]
 */
function generateDatGUI() {
  // These are the options for the dat.GUI object
  var DATOpts = function() {
    this.canvasColor = canvasColor;
    this.bulbIntensity = lightBulb.intensity;
    this.bulbColor = lightBulb.color;
    this.gVelx = gVelx;
    this.gVely = gVely;
    this.tempVelx = this.gVelx;
    this.tempVely = this.gVely;
    this.pause = function() {
      this.tempVelx = gVelx;
      this.tempVely = gVely;
      this.gVelx = 0;
      this.gVely = 0;
      gVelx = 0;
      gVely = 0;
    }

    this.resume = function() {
      this.gVelx = this.tempVelx;
      this.gVely = this.tempVely;
      gVelx = this.tempVelx;
      gVely = this.tempVely;
    }

    this.reset = function() {
      this.gVelx = 0.01;
      this.gVely = 0.02;
      gVelx = 0.01;
      gVely = 0.02;
      camera.copy(origCamera);
    }
  };

  // Creates Base GUI
  var gui = new dat.GUI();
  var datOpts = new DATOpts();
  // Adds Canvas Folder and creates values then opens that folder
  var fCanvas = gui.addFolder('Canvas');
  fCanvas.addColor(datOpts, 'canvasColor').name('color').onChange(function(
    value) {
    renderer.setClearColor(value, 1.0);
  });

  // Adds Animation Folder and creates values then opens that folder
  var fAnimation = gui.addFolder('Animation');
  fAnimation.add(datOpts, 'gVelx', -.1, .1).name('X-Speed').onChange(
    function(
      value) {
      gVelx = value;
    }).listen();
  fAnimation.add(datOpts, 'gVely', -.1, .1).name('Y-Speed').onChange(
    function(
      value) {
      this.gVely = value;
      gVely = value;
    }).listen();
  fAnimation.add(datOpts, 'pause');
  fAnimation.add(datOpts, 'resume');
  fAnimation.add(datOpts, 'reset');

  // Adds Lights Folder and creates values then opens that folder
  var fLights = gui.addFolder('Lights');
  var fBulb = fLights.addFolder('Center Bulb');
  fBulb.add(datOpts, 'bulbIntensity', 0, 10).name('intensity').onChange(
    function(
      value) {
      lightBulb.light.intensity = value;
    });
  fBulb.addColor(datOpts, 'bulbColor').name('color').onChange(function(
    value) {
    lightBulb.light.color.set(value);
    lightBulb.bulb.material.setValues({
      color: value
    });
  });

  // Adds Transform Folder and creates values then opens that folder
  var fTransforms = gui.addFolder('Transforms');
  var fCube = fTransforms.addFolder('Cube');
  fCube.addColor(cube, 'color').onChange(
    function(value) {
      cube.mesh.material.setValues({
        color: value
      });
    });
  fCube.add(cube.mesh.scale, 'x', 0, 3).name('X').listen();
  fCube.add(cube.mesh.scale, 'y', 0, 3).name('Y').listen();
  fCube.add(cube.mesh.scale, 'z', 0, 3).name('Z').listen();
  fCube.add(cube.mesh.material, 'wireframe').listen();

  var fDome = fTransforms.addFolder('Dome');
  fDome.addColor(dome, 'color').onChange(
    function(value) {
      dome.mesh.material.setValues({
        color: value
      });
    });
  fDome.add(dome.mesh.scale, 'x', 0, 3).name('X').listen();
  fDome.add(dome.mesh.scale, 'y', 0, 3).name('Y').listen();
  fDome.add(dome.mesh.scale, 'z', 0, 3).name('Z').listen();
  fDome.add(dome.mesh.material, 'wireframe').listen();

  var fSphere = fTransforms.addFolder('Sphere');
  fSphere.addColor(sphere, 'color').onChange(
    function(value) {
      sphere.mesh.material.setValues({
        color: value
      });
    });
  fSphere.add(sphere.mesh.scale, 'x', 0, 3).name('X').listen();
  fSphere.add(sphere.mesh.scale, 'y', 0, 3).name('Y').listen();
  fSphere.add(sphere.mesh.scale, 'z', 0, 3).name('Z').listen();
  fSphere.add(sphere.mesh.material, 'wireframe').listen();

  var fRing = fSphere.addFolder('Ring');
  fRing.addColor(ring, 'color').onChange(
    function(value) {
      ring.mesh.material.setValues({
        color: value
      });
    });
  fRing.add(ring.mesh.scale, 'x', 0, 3).name('X').listen();
  fRing.add(ring.mesh.scale, 'y', 0, 3).name('Y').listen();
  fRing.add(ring.mesh.scale, 'z', 0, 3).name('Z').listen();
  fRing.add(ring.mesh.material, 'wireframe').listen();

  var fTorus = fTransforms.addFolder('Torus');
  fTorus.addColor(torus, 'color').onChange(
    function(value) {
      torus.mesh.material.setValues({
        color: value
      });
    });
  fTorus.add(torus.mesh.scale, 'x', 0, 3).name('X').listen();
  fTorus.add(torus.mesh.scale, 'y', 0, 3).name('Y').listen();
  fTorus.add(torus.mesh.scale, 'z', 0, 3).name('Z').listen();
  fTorus.add(torus.mesh.material, 'wireframe').listen();

  var fTorusKnot = fTransforms.addFolder('TorusKnot');
  fTorusKnot.addColor(torusKnot, 'color').onChange(
    function(value) {
      torusKnot.mesh.material.setValues({
        color: value
      });
    });
  fTorusKnot.add(torusKnot.mesh.scale, 'x', 0, 3).name('X').listen();
  fTorusKnot.add(torusKnot.mesh.scale, 'y', 0, 3).name('Y').listen();
  fTorusKnot.add(torusKnot.mesh.scale, 'z', 0, 3).name('Z').listen();
  fTorusKnot.add(torusKnot.mesh.material, 'wireframe').listen();
}
