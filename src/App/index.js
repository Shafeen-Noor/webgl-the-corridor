import * as THREE from 'three';

import { Renderer } from './Renderer/index.js';
import { Camera, SCENE_COUNT } from './Camera/index.js';
import { createLights } from './Lights/index.js';
import { PostProcessing } from './PostProcessing/index.js';
import { UI } from './UI/index.js';
import { lerp } from './Utils/index.js';

import {
  createCorridor,
  createFloatRoom,
  createMirrorScene,
  createVHSScene,
  createPool,
} from './Scenes/index.js';

export class App {
  constructor() {
    // ── Core three.js objects ──────────────────────────────
    this._scene = new THREE.Scene();
    this._renderer = new Renderer(document.getElementById('c'));
    this._camera = new Camera();
    this._clock = new THREE.Timer();

    // ── Lighting ───────────────────────────────────────────
    createLights(this._scene);

    // ── Background + fog ───────────────────────────────────
    this._post = new PostProcessing(this._scene);

    // ── Scenes ─────────────────────────────────────────────
    this._corridor = createCorridor();
    this._floatRoom = createFloatRoom();
    this._mirror = createMirrorScene();
    this._vhs = createVHSScene();
    this._pool = createPool();

    this._scene.add(
      this._corridor,
      this._floatRoom,
      this._mirror,
      this._vhs,
      this._pool
    );

    // ── Convenient handles to animated sub-objects ─────────
    const { dreamMat, particles, particleCount } = this._corridor.userData;
    this._dreamMat = dreamMat;
    this._particles = particles;
    this._particleCount = particleCount;

    const { chair1, chair2, chair3, tableTop } = this._floatRoom.userData;
    this._chairs = [chair1, chair2, chair3];
    this._tableTop = tableTop;

    const { mirrorFrame, orbitCubes } = this._mirror.userData;
    this._mirrorFrame = mirrorFrame;
    this._orbitCubes = orbitCubes;

    this._tv = this._vhs.userData.tv;
    this._waterMat = this._pool.userData.waterMat;

    // ── UI ─────────────────────────────────────────────────
    this._ui = new UI();

    // ── Scroll state ───────────────────────────────────────
    this._scrollProgress = 0;
    this._targetScroll = 0;
    this._currentScene = 0;

    window.addEventListener('scroll', this._onScroll.bind(this));
  }

  // ── Scroll handler ───────────────────────────────────────
  _onScroll() {
    const el = document.getElementById('scroll-container');
    const maxScroll = el.scrollHeight - window.innerHeight;
    this._targetScroll = window.scrollY / maxScroll;

    if (this._targetScroll > 0.05) this._ui.hideScrollHint();
  }

  // ── Public boot ──────────────────────────────────────────
  start() {
    this._animate();
  }

  // ── Animation loop ───────────────────────────────────────
  _animate() {
    requestAnimationFrame(this._animate.bind(this));
    this._clock.update();
    const t = this._clock.getElapsed();
    // Smooth scroll
    this._scrollProgress = lerp(this._scrollProgress, this._targetScroll, 0.05);

    // Scene switching
    const nextScene = Math.round(this._scrollProgress * (SCENE_COUNT - 1));
    if (nextScene !== this._currentScene) {
      this._currentScene = nextScene;
      this._ui.setScene(this._currentScene);
    }

    // Camera
    this._camera.update(this._scrollProgress);

    // Post-processing (fog)
    this._post.update(this._currentScene);

    // ── Shader uniforms ────────────────────────────────────

    // Corridor dream walls
    this._dreamMat.uniforms.uTime.value = t;

    // Water
    this._waterMat.uniforms.uTime.value = t;
    this._waterMat.uniforms.uProgress.value = Math.min(
      1,
      Math.max(0, (this._scrollProgress - 0.7) * 4)
    );

    // Mirror warp panels (children with uTime uniform)
    this._mirror.children.forEach((child) => {
      if (child.material?.uniforms?.uTime)
        child.material.uniforms.uTime.value = t;
    });

    // TV screen
    this._tv.children.forEach((child) => {
      if (child.material?.userData?.isScreenMat)
        child.material.uniforms.uTime.value = t;
    });

    // VHS cassettes (index 0 is the TV group, rest are cassettes)
    this._vhs.children.forEach((child) => {
      if (child.material?.uniforms?.uTime) {
        child.material.uniforms.uTime.value = t;
        child.material.uniforms.uIntensity.value = Math.min(
          1,
          Math.max(0, (this._scrollProgress - 0.5) * 4)
        );
      }
    });

    // ── Procedural animation ───────────────────────────────

    // Mirror orbiting cubes
    this._orbitCubes.forEach((cube) => {
      const a = t * cube.userData.orbitSpeed + cube.userData.orbitOffset;
      const r = cube.userData.orbitRadius;
      cube.position.set(
        Math.cos(a) * r,
        Math.sin(a * 0.7 + cube.userData.orbitTilt) * r * 0.5,
        Math.sin(a) * r * 0.3
      );
      cube.rotation.x = t * 0.5;
      cube.rotation.y = t * 0.3;
    });

    // Floating furniture
    this._chairs.forEach((c, i) => {
      c.position.y = 0.5 + Math.sin(t * 0.4 + i * 1.2) * 0.12;
      c.rotation.y = Math.sin(t * 0.15 + i) * 0.08;
    });
    this._tableTop.position.y = 0.3 + Math.sin(t * 0.35) * 0.09;

    // Corridor dust — drift upward and wrap
    const pAttr = this._particles.geometry.attributes.position;
    for (let i = 0; i < this._particleCount; i++) {
      pAttr.array[i * 3 + 1] += 0.001;
      if (pAttr.array[i * 3 + 1] > 2) pAttr.array[i * 3 + 1] = -2;
    }
    pAttr.needsUpdate = true;

    // VHS cassettes — float & spin (skip child[0] which is the TV)
    this._vhs.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && i > 0) {
        child.position.y += Math.sin(t * 0.3 + i) * 0.001;
        child.rotation.y += 0.003;
      }
    });

    // Mirror frame — slow sway
    this._mirrorFrame.rotation.z = Math.sin(t * 0.1) * 0.05;

    // Pool debris — gentle sway
    this._pool.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && i > 1)
        child.position.y += Math.sin(t * 0.2 + i) * 0.0005;
    });

    // ── Render ─────────────────────────────────────────────
    this._renderer.render(this._scene, this._camera.instance);
  }
}
