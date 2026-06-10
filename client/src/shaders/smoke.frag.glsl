uniform sampler2D uMistMap;
uniform float uUseMistMap;

varying float vLife;
varying float vOpacity;

void main() {
  vec2 uv = gl_PointCoord;
  float dist = length(uv - vec2(0.5));

  float alpha;
  vec3 color;

  if (uUseMistMap > 0.5) {
    vec4 mist = texture2D(uMistMap, uv);
    alpha = mist.a * vOpacity;
    color = mix(vec3(0.96, 0.94, 0.9), vec3(0.9, 0.82, 0.65), vLife);
  } else {
    if (dist > 0.5) discard;
    alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
    vec3 bottomColor = vec3(0.96, 0.94, 0.9);
    vec3 midColor = vec3(0.9, 0.82, 0.65);
    color = mix(bottomColor, midColor, smoothstep(0.0, 0.6, vLife));
  }

  gl_FragColor = vec4(color, alpha);
}
