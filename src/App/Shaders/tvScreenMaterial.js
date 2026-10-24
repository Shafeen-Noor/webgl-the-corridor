import * as THREE from 'three';

export function createTvScreenMaterial() {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uStatic: { value: 0.8 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uStatic;
      varying vec2 vUv;

      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        float noise = rand(vUv + vec2(uTime * 10.0, 0.0));
        float scan = step(0.5, mod(vUv.y * 60.0, 1.0)) * 0.1;

        float tear = step(0.99, rand(vec2(floor(vUv.y * 20.0), floor(uTime * 3.0))));
        float offset = tear * 0.05 * sin(uTime * 100.0);

        vec2 uv2 = vUv + vec2(offset, 0.0);

        float r = rand(uv2 + vec2(0.002, 0.0) + uTime * 0.01);
        float g = rand(uv2 + uTime * 0.01);
        float b = rand(uv2 - vec2(0.002, 0.0) + uTime * 0.01);

        vec3 col = vec3(r, g, b) * uStatic;

        float ghost = sin(vUv.y * 8.0 - uTime * 0.3) * 0.5 + 0.5;
        ghost *= sin(vUv.x * 5.0 + uTime * 0.2) * 0.5 + 0.5;
        col = mix(col, vec3(0.35, 0.22, 0.55) * ghost, 0.4);
        col += vec3(0.08, 0.06, 0.12);

        col -= scan;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  // Tag so animation loop can find it
  mat.userData.isScreenMat = true;
  return mat;
}
