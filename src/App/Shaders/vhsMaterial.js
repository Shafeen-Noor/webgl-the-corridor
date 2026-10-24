import * as THREE from 'three';

export function createVhsMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uColor: { value: new THREE.Color(0xff6030) },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uIntensity;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);

        vec3 pos = position;
        float glitch = step(0.98, sin(uTime * 20.0 + pos.y * 10.0)) * uIntensity;
        pos.x += glitch * 0.3 * sin(uTime * 50.0);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying vec3 vNormal;

      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        float scanline = step(0.5, mod(vUv.y * 80.0 + uTime * 5.0, 1.0));
        float scan = mix(1.0, 0.85, scanline * uIntensity);

        float noise = rand(vUv + vec2(uTime * 0.1, 0.0)) * 0.15 * uIntensity;

        vec3 viewDir = normalize(cameraPosition - vec3(0.0));
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);

        vec3 base = uColor * 0.35 + vec3(0.45, 0.38, 0.55);
        vec3 col = mix(base, uColor, uIntensity);
        col.r += fresnel * 0.3 * uIntensity;
        col.b -= fresnel * 0.15 * uIntensity;
        col += noise;
        col *= scan;

        gl_FragColor = vec4(col, 0.88);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });
}
