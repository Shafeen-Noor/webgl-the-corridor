import * as THREE from 'three';
import { lerp } from '../Utils/index.js';

const FOG_DENSITIES = [0.035, 0.028, 0.042, 0.05, 0.032];

export class PostProcessing {
  constructor(scene) {
    scene.background = new THREE.Color(0x221e40);
    scene.fog = new THREE.FogExp2(0x1e1838, 0.035);
    this._fog = scene.fog;

    const count = 800;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -Math.random() * 40;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(
      new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          color: 0xd8c8ff,
          size: 0.01,
          transparent: true,
          opacity: 0.35,
        })
      )
    );
  }

  update(sceneIndex) {
    const from = FOG_DENSITIES[Math.max(0, sceneIndex - 1)] ?? 0.035;
    const to = FOG_DENSITIES[sceneIndex] ?? 0.035;
    this._fog.density = lerp(from, to, 0.05);
  }
}
