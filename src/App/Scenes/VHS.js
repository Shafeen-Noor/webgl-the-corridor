import * as THREE from 'three';
import { createVhsMaterial } from '../Shaders/index.js';
import { createTvScreenMaterial } from '../Shaders/index.js';

function makeTV() {
  const tvGroup = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x383050,
    roughness: 0.75,
    metalness: 0.12,
    emissive: 0x201830,
    emissiveIntensity: 0.2,
  });

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(2, 1.6, 0.8), bodyMat);
  body.castShadow = true;
  tvGroup.add(body);

  // Screen
  const screenMat = createTvScreenMaterial();
  screenMat.userData.isScreenMat = true;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.2), screenMat);
  screen.position.z = 0.41;
  tvGroup.add(screen);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.5, 6);
  const leg1 = new THREE.Mesh(legGeo, bodyMat.clone());
  leg1.position.set(-0.6, -1.05, 0);
  const leg2 = leg1.clone();
  leg2.position.x = 0.6;
  tvGroup.add(leg1, leg2);

  // Antennae
  const antGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.8, 5);
  const ant1 = new THREE.Mesh(antGeo, bodyMat.clone());
  ant1.position.set(-0.3, 1.2, 0);
  ant1.rotation.z = 0.3;
  const ant2 = ant1.clone();
  ant2.position.x = 0.3;
  ant2.rotation.z = -0.3;
  tvGroup.add(ant1, ant2);

  return tvGroup;
}

export function createVHSScene() {
  const group = new THREE.Group();
  group.position.z = -24;

  const tv = makeTV();
  tv.position.set(0, 0, 0);
  tv.castShadow = true;
  group.add(tv);

  // Floating VHS cassettes
  for (let i = 0; i < 4; i++) {
    const cassette = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.3, 0.15),
      createVhsMaterial()
    );
    cassette.position.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 2
    );
    cassette.rotation.set(
      Math.random() * 0.5,
      Math.random() * Math.PI,
      Math.random() * 0.3
    );
    cassette.castShadow = true;
    group.add(cassette);
  }

  group.userData.tv = tv;

  return group;
}
