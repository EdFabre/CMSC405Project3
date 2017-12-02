/**
 *
 *
 * @Author: Fabre Ed
 * @Date:   2017-12-02T11:50:07-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: shapes.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-02T17:35:03-05:00
 */

import * as THREE from 'three';

// Used to create a cube object
export var createCube = function createCube(opts) {
  var temp = new THREE.Mesh(
    new THREE.BoxGeometry(
      opts.width,
      opts.height,
      opts.depth),
    opts.material);
  opts.scene.add(temp);
  temp.position.x += opts.position.x
  temp.position.y += opts.position.y
  temp.position.z += opts.position.z
  return temp;
}

// Used to create a sphere object
export var createSphereOrDome = function createSphereOrDome(opts) {
  var temp = new THREE.Mesh(
    new THREE.SphereGeometry(
      opts.radius || 1,
      opts.widthSeg || 8,
      opts.heightSeg || 6,
      opts.phiStart || 0,
      opts.phiLength || Math.PI * 2,
      opts.thetaStart || 0,
      opts.thetaLength || Math.PI),
    opts.material);
  opts.scene.add(temp);
  temp.position.x += opts.position.x
  temp.position.y += opts.position.y
  temp.position.z += opts.position.z
  return temp;
}

// Used to create a pyramid object
export var createPyramid = function createPyramid(opts) {
  var temp = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0,
      opts.baseRad,
      opts.height,
      4,
      4),
    opts.material);
  opts.scene.add(temp);
  temp.position.x += opts.position.x
  temp.position.y += opts.position.y
  temp.position.z += opts.position.z
  return temp;
}

// Used to create a ring object
export var createRing = function createRing(opts) {
  var temp = new THREE.Mesh(
    new THREE.RingGeometry(
      opts.innerRadius,
      opts.outterRadius,
      opts.thetaSegments),
    opts.material);
  opts.scene.add(temp);
  temp.position.x += opts.position.x
  temp.position.y += opts.position.y
  temp.position.z += opts.position.z
  return temp;
}

// Used to create a torus(donut) object
export var createTorus = function createTorus(opts) {
  var temp = new THREE.Mesh(
    new THREE.TorusGeometry(
      opts.radius,
      opts.tube,
      opts.radialSegments,
      opts.tubularSegments,
      opts.arc),
    opts.material);
  opts.scene.add(temp);
  temp.position.x += opts.position.x
  temp.position.y += opts.position.y
  temp.position.z += opts.position.z
  return temp;
}

/**
 * Creates a TorusKnot
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
export var createTorusKnot = function createTorusKnot(opts) {
  var temp = new THREE.Mesh(
    new THREE.TorusKnotGeometry(
      opts.radius,
      opts.tube,
      opts.tubularSegments,
      opts.radialSegments,
      opts.p,
      opts.q),
    opts.material);
  opts.scene.add(temp);
  temp.position.x += opts.position.x
  temp.position.y += opts.position.y
  temp.position.z += opts.position.z
  return temp;
}
