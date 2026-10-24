import * as THREE from 'three';

export function createWarpMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x8060e8) },
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.x += sin(pos.y * 3.0 + uTime * 0.5) * 0.08;
        pos.y += cos(pos.x * 4.0 + uTime * 0.3) * 0.05;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float t = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
        vec3 col = mix(uColor, uColor * 2.0, t);
        float alpha = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
        alpha *= smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
        gl_FragColor = vec4(col, alpha * 0.65);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });
}
