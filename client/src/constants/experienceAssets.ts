export const EXPERIENCE_MODELS = {
  heroBottle: "/models/perfume_bottle_elegant_glass.glb",
  purpleBottle: "/models/purple_perfume_bottle.glb",
  rose: "/models/papa_meilland_rose.glb",
  rosePetal: "/models/rose_petal.glb",
  roseInRain: "/models/rose_in_the_rain.glb"
} as const;

export const EXPERIENCE_TEXTURES = {
  hdri: "/textures/belfast_sunset_puresky_1k.hdr",
  sandDiffuse: "/textures/sand_01_diff_1k.jpg",
  sandAo: "/textures/sand_01_ao_1k.jpg",
  glassRoughness: "/others/rough_glass_seamless_texture.png",
  brandLabel: "/others/text_logo.png",
  brandIcon: "/others/icon.png",
  mistWhite: "/others/mist_white.png",
  rosePetalAlpha: "/others/rose-petal.png",
  silkGold: "/others/silk_fabric_golden.png"
} as const;

/** Models skipped for web performance (very large file size). */
export const SKIPPED_MODELS = [
  "/models/blue_flowers.glb",
  "/models/day_231_houseleek_-_1scanaday.glb",
  "/models/white_flowers_1.glb",
  "/models/pink_rose.glb",
  "/models/perfume_bottle_elegant_glass (1).glb",
  "/models/rose_in_the_rain (1).glb"
] as const;

export const PRELOAD_MODELS = [
  EXPERIENCE_MODELS.heroBottle,
  EXPERIENCE_MODELS.purpleBottle,
  EXPERIENCE_MODELS.rose,
  EXPERIENCE_MODELS.rosePetal,
  EXPERIENCE_MODELS.roseInRain
];
