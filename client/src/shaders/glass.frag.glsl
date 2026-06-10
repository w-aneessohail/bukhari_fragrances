uniform vec3 uColor;
uniform float uTransmission;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
  vec3 color = mix(uColor, vec3(1.0, 0.95, 0.85), fresnel * 0.5);
  gl_FragColor = vec4(color, uTransmission);
}
