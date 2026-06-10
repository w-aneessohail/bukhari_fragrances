attribute float aSize;
attribute float aSeed;

uniform float uTime;
uniform float uIntensity;

varying float vAlpha;

void main() {
  vec3 pos = position;
  pos.x += sin(uTime * 0.2 + aSeed * 10.0) * 0.15;
  pos.y += cos(uTime * 0.15 + aSeed * 8.0) * 0.1;
  pos.z += sin(uTime * 0.18 + aSeed * 6.0) * 0.12;

  vAlpha = uIntensity * (0.4 + 0.6 * sin(aSeed * 20.0 + uTime));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (200.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
