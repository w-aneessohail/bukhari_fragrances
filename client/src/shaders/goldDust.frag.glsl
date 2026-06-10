varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);
  if (dist > 0.5) discard;

  float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
  vec3 gold = vec3(0.83, 0.69, 0.22);
  vec3 lightGold = vec3(0.95, 0.82, 0.42);
  vec3 color = mix(gold, lightGold, dist * 2.0);

  gl_FragColor = vec4(color, alpha);
}
