import * as THREE from 'three';
import { createWarpMaterial } from '../Shaders/index.js';

export function createMirrorScene() {
  const group = new THREE.Group();
  group.position.z = -16;

  // Frame
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x403060,
    emissive: 0x9080e0,
    emissiveIntensity: 0.35,
    roughness: 0.45,
    metalness: 0.55,
  });
  const mirrorFrame = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.12, 8, 50),
    frameMat
  );
  mirrorFrame.castShadow = true;
  group.add(mirrorFrame);

  // Mirror surface
  const mirrorSurface = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 50),
    new THREE.MeshStandardMaterial({
      color: 0x9088b8,
      metalness: 0.95,
      roughness: 0.05,
      envMapIntensity: 1.2,
    })
  );
  group.add(mirrorSurface);

  // Warp panels
  for (let i = 0; i < 5; i++) {
    const wp = new THREE.Mesh(
      new THREE.PlaneGeometry(1 + Math.random(), 1 + Math.random()),
      createWarpMaterial()
    );
    const angle = (i / 5) * Math.PI * 2;
    wp.position.set(
      Math.cos(angle) * 2.5,
      Math.sin(angle) * 2.5,
      -0.5 - Math.random() * 1
    );
    wp.rotation.z = angle;
    group.add(wp);
  }

  // Orbiting cubes
  const orbitMat = new THREE.MeshStandardMaterial({
    color: 0x7060c8,
    emissive: 0x5040b0,
    emissiveIntensity: 0.5,
    roughness: 0.3,
    metalness: 0.7,
  });
  const orbitCubes = [];
  for (let i = 0; i < 8; i++) {
    const size = 0.1 + Math.random() * 0.2;
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      orbitMat.clone()
    );
    cube.castShadow = true;
    cube.userData.orbitRadius = 2 + Math.random() * 1;
    cube.userData.orbitSpeed = 0.2 + Math.random() * 0.3;
    cube.userData.orbitOffset = (i / 8) * Math.PI * 2;
    cube.userData.orbitTilt = (Math.random() - 0.5) * 0.8;
    group.add(cube);
    orbitCubes.push(cube);
  }

  group.userData.mirrorFrame = mirrorFrame;
  group.userData.orbitCubes = orbitCubes;

  return group;
}
