import * as THREE from 'three';

export function createWaterMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vUv = uv;
        vec3 pos = position;

        float wave1 = sin(pos.x * 3.0 + uTime * 0.8) * 0.08;
        float wave2 = sin(pos.z * 2.0 + uTime * 0.6) * 0.06;
        float wave3 = sin((pos.x + pos.z) * 4.0 + uTime * 1.2) * 0.03;
        pos.y += wave1 + wave2 + wave3;
        vElevation = pos.y;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uProgress;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vec3 deepColor = vec3(0.08, 0.14, 0.32);
        vec3 shallowColor = vec3(0.18, 0.42, 0.62);

        float depth = smoothstep(-0.1, 0.1, vElevation);
        vec3 col = mix(deepColor, shallowColor, depth);

        float caustic = sin(vUv.x * 40.0 + uTime) * sin(vUv.y * 40.0 + uTime * 0.7);
        caustic = pow(max(0.0, caustic), 2.5) * 0.4;
        col += vec3(0.05, caustic * 0.6, caustic * 1.1);

        float edge = smoothstep(0.45, 0.5, abs(vUv.x - 0.5));
        edge += smoothstep(0.45, 0.5, abs(vUv.y - 0.5));
        col += edge * 0.1 * vec3(0.5, 0.7, 1.0);

        gl_FragColor = vec4(col, 0.88 * uProgress);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });
}
