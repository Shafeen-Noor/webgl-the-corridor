import * as THREE from 'three';

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function lerpVec3(out, a, b, t) {
  out.x = lerp(a.x, b.x, t);
  out.y = lerp(a.y, b.y, t);
  out.z = lerp(a.z, b.z, t);
}

export function makeMesh(geo, mat, x, y, z) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function makeChair(x, y, z) {
  const chairGroup = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0x584878,
    roughness: 0.75,
    metalness: 0.1,
    emissive: 0x403060,
    emissiveIntensity: 0.25,
  });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.8), mat);
  seat.castShadow = true;
  chairGroup.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.08), mat);
  back.position.set(0, 0.49, -0.36);
  back.castShadow = true;
  chairGroup.add(back);

  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6);
  [
    [-0.33, -0.33],
    [-0.33, 0.33],
    [0.33, -0.33],
    [0.33, 0.33],
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, mat.clone());
    leg.position.set(lx, -0.34, lz);
    leg.castShadow = true;
    chairGroup.add(leg);
  });

  chairGroup.position.set(x, y, z);
  return chairGroup;
}
