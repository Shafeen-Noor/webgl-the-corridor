import * as THREE from 'three';
import { createDreamMaterial } from '../Shaders/index.js';

export function createCorridor() {
  const group = new THREE.Group();

  const dreamMaterial = createDreamMaterial();

  // Floor
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x282040,
    roughness: 0.85,
    metalness: 0.15,
    envMapIntensity: 0.5,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(6, 40), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -1.5, -18);
  floor.receiveShadow = true;
  group.add(floor);

  // Ceiling
  const ceiling = floor.clone();
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 2.5, -18);
  ceiling.receiveShadow = true;
  group.add(ceiling);

  // Walls
  const wallGeo = new THREE.PlaneGeometry(40, 4);
  const leftWall = new THREE.Mesh(wallGeo, dreamMaterial.clone());
  leftWall.position.set(-3, 0.5, -18);
  leftWall.rotation.y = Math.PI / 2;
  group.add(leftWall);

  const rightWall = leftWall.clone();
  rightWall.position.set(3, 0.5, -18);
  rightWall.rotation.y = -Math.PI / 2;
  group.add(rightWall);

  // Door arches
  const archGeo = new THREE.TorusGeometry(1.2, 0.06, 8, 20, Math.PI);
  const archMat = new THREE.MeshStandardMaterial({
    color: 0x504080,
    emissive: 0x7060c0,
    emissiveIntensity: 0.35,
    roughness: 0.65,
  });
  const sideGeo = new THREE.BoxGeometry(0.1, 2.4, 0.1);

  for (let i = 0; i < 8; i++) {
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 0.2, -2 - i * 4.5);
    arch.rotation.z = Math.PI;
    arch.castShadow = true;
    group.add(arch);

    const leftSide = new THREE.Mesh(sideGeo, archMat);
    leftSide.position.set(-1.2, -0.8, -2 - i * 4.5);
    group.add(leftSide);

    const rightSide = leftSide.clone();
    rightSide.position.x = 1.2;
    group.add(rightSide);
  }

  // Floating dust particles
  const particleCount = 300;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = -Math.random() * 35;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xb0a0f0,
    size: 0.018,
    transparent: true,
    opacity: 0.5,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  // Expose particles so App/index.js can animate them
  group.userData.particles = particles;
  group.userData.particleCount = particleCount;
  group.userData.dreamMat = dreamMaterial;

  return group;
}
