import * as THREE from 'three';
import { lerp, lerpVec3 } from '../Utils/index.js';

export const SCENE_COUNT = 5;

// One waypoint per scene — camera position + lookAt target
const WAYPOINTS = [
  { pos: new THREE.Vector3(0, 0, 5), target: new THREE.Vector3(0, 0, -5) }, // 0 corridor
  {
    pos: new THREE.Vector3(0, 0.5, -4),
    target: new THREE.Vector3(0, 0.2, -10),
  }, // 1 float room
  { pos: new THREE.Vector3(0.5, 0, -12), target: new THREE.Vector3(0, 0, -16) }, // 2 mirror
  { pos: new THREE.Vector3(0, 0.5, -20), target: new THREE.Vector3(0, 0, -24) }, // 3 VHS
  {
    pos: new THREE.Vector3(0, 1.5, -28),
    target: new THREE.Vector3(0, -0.5, -32),
  }, // 4 pool
];

export class Camera {
  constructor() {
    this.instance = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      200
    );
    this.instance.position.copy(WAYPOINTS[0].pos);

    // Mouse parallax — raw and smoothed
    this._mouse = { x: 0, y: 0 };
    this._target = { x: 0, y: 0 };

    // Reusable lookAt vector (avoids per-frame allocation)
    this._lookAtVec = new THREE.Vector3();

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onResize = this._onResize.bind(this);

    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('resize', this._onResize);
  }

  _onMouseMove(e) {
    this._target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    this._target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  _onResize() {
    this.instance.aspect = window.innerWidth / window.innerHeight;
    this.instance.updateProjectionMatrix();
  }

  /**
   * Call once per frame from the animation loop.
   * @param {number} scrollProgress  0–1
   */
  update(scrollProgress) {
    // Smooth mouse
    this._mouse.x = lerp(this._mouse.x, this._target.x, 0.04);
    this._mouse.y = lerp(this._mouse.y, this._target.y, 0.04);

    // Fractional scene index
    const sceneFloat = scrollProgress * (SCENE_COUNT - 1);
    const idx = Math.min(Math.floor(sceneFloat), SCENE_COUNT - 2);
    const t = sceneFloat - idx;
    const ease = t * t * (3 - 2 * t); // smoothstep

    const wp0 = WAYPOINTS[idx];
    const wp1 = WAYPOINTS[idx + 1];

    lerpVec3(this.instance.position, wp0.pos, wp1.pos, ease);
    lerpVec3(this._lookAtVec, wp0.target, wp1.target, ease);

    // Parallax nudge
    this.instance.position.x += this._mouse.x * 0.25;
    this.instance.position.y += -this._mouse.y * 0.15;

    this.instance.lookAt(this._lookAtVec);
  }

  dispose() {
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('resize', this._onResize);
  }
}
