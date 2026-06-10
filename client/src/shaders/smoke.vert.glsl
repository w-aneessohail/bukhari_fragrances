attribute float aLife;
attribute float aSize;
attribute float aSeed;

uniform float uTime;
uniform float uIntensity;

varying float vLife;
varying float vOpacity;

void main() {
  vLife = mod(aLife + uTime * 0.15, 1.0);
  vOpacity = (1.0 - vLife) * uIntensity;

  vec3 pos = position;
  float wobble = sin(uTime * 0.8 + aSeed * 6.28) * 0.08;
  pos.x += wobble;
  pos.z += cos(uTime * 0.6 + aSeed * 4.0) * 0.06;
  pos.y += uTime * 0.12 * (0.5 + aSeed);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (1.2 - vLife) * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
