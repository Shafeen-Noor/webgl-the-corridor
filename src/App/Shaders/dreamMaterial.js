import * as THREE from 'three';

export function createDreamMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0x2a2248) },
      uColor2: { value: new THREE.Color(0x4a3870) },
      uEmissive: { value: new THREE.Color(0x9070e0) },
      uEmissiveIntensity: { value: 0.65 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uEmissive;
      uniform float uEmissiveIntensity;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        float t = sin(vUv.y * 3.14159 + uTime * 0.3) * 0.5 + 0.5;
        vec3 col = mix(uColor1, uColor2, t);

        float band = sin(vUv.y * 20.0 + uTime * 0.1) * 0.5 + 0.5;
        col += uColor2 * band * 0.12;

        vec3 view = normalize(cameraPosition - vPosition);
        float rim = 1.0 - max(0.0, dot(vNormal, view));
        rim = pow(rim, 2.0);
        col += uEmissive * rim * uEmissiveIntensity * 1.8;

        col += uEmissive * 0.22 * uEmissiveIntensity;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.DoubleSide,
  });
}
