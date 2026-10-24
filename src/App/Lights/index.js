import * as THREE from 'three';

export function createLights(scene) {
  // Soft sky/ground fill — liminal haze
  const hemi = new THREE.HemisphereLight(0xc8b8f0, 0x4a3868, 0.9);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xb0a0d8, 0.55);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xe8e0ff, 0.85);
  dirLight.position.set(4, 12, 6);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.camera.left = -15;
  dirLight.shadow.camera.right = 15;
  dirLight.shadow.camera.top = 15;
  dirLight.shadow.camera.bottom = -15;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  const p1 = new THREE.PointLight(0x9080e8, 1.4, 22);
  p1.position.set(0, 2, 2);
  const p2 = new THREE.PointLight(0x80c8e8, 1.2, 20);
  p2.position.set(-3, 3, -5);
  const p3 = new THREE.PointLight(0xe0a0d0, 1.3, 20);
  p3.position.set(3, 1, -12);
  const p4 = new THREE.PointLight(0xffc090, 1.1, 20);
  p4.position.set(0, 2, -18);
  const p5 = new THREE.PointLight(0x90b8ff, 1.4, 24);
  p5.position.set(0, -1, -25);

  scene.add(p1, p2, p3, p4, p5);

  return { hemi, ambient, dirLight, p1, p2, p3, p4, p5 };
}
