import * as THREE from 'three';
import { createWaterMaterial } from '../Shaders/index.js';
import { makeChair } from '../Utils/index.js';

export function createPool() {
  const group = new THREE.Group();
  group.position.z = -32;

  // Water surface
  const waterMaterial = createWaterMaterial();
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 40, 40),
    waterMaterial
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = -1.5;
  water.receiveShadow = true;
  group.add(water);

  // Submerged chair
  const sinkChair = makeChair(0.5, -0.8, 0.5);
  group.add(sinkChair);

  // Submerged debris
  const subMat = new THREE.MeshStandardMaterial({
    color: 0x283858,
    emissive: 0x3060a0,
    emissiveIntensity: 0.35,
    roughness: 0.6,
    metalness: 0.3,
    transparent: true,
    opacity: 0.8,
  });
  const debrisGeos = [
    () => new THREE.OctahedronGeometry(0.1 + Math.random() * 0.2),
    () => new THREE.IcosahedronGeometry(0.1 + Math.random() * 0.15, 0),
    () => new THREE.BoxGeometry(0.1, 0.3 + Math.random() * 0.4, 0.1),
  ];
  for (let i = 0; i < 12; i++) {
    const obj = new THREE.Mesh(debrisGeos[i % 3](), subMat.clone());
    obj.position.set(
      (Math.random() - 0.5) * 8,
      -1.2 + Math.random() * 0.6,
      (Math.random() - 0.5) * 6
    );
    obj.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    obj.castShadow = true;
    group.add(obj);
  }

  // Pool walls
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x282848,
    roughness: 0.95,
    metalness: 0,
    emissive: 0x383060,
    emissiveIntensity: 0.15,
  });
  const wallDefs = [
    { pos: [0, 0.5, -10], rot: [0, 0, 0] },
    { pos: [0, 0.5, 10], rot: [0, Math.PI, 0] },
    { pos: [-10, 0.5, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [10, 0.5, 0], rot: [0, -Math.PI / 2, 0] },
  ];
  wallDefs.forEach(({ pos, rot }) => {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(20, 4), wallMat);
    w.position.set(...pos);
    w.rotation.set(...rot);
    w.receiveShadow = true;
    group.add(w);
  });

  // Surface lotus particles
  const lotusCount = 80;
  const lotusPos = new Float32Array(lotusCount * 3);
  for (let i = 0; i < lotusCount; i++) {
    lotusPos[i * 3] = (Math.random() - 0.5) * 16;
    lotusPos[i * 3 + 1] = -1.4 + Math.random() * 0.3;
    lotusPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
  }
  const lotusGeo = new THREE.BufferGeometry();
  lotusGeo.setAttribute('position', new THREE.BufferAttribute(lotusPos, 3));
  group.add(
    new THREE.Points(
      lotusGeo,
      new THREE.PointsMaterial({
        color: 0x80b8ff,
        size: 0.045,
        transparent: true,
        opacity: 0.55,
      })
    )
  );

  group.userData.waterMat = waterMaterial;

  return group;
}
