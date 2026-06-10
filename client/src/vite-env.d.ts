/// <reference types="vite/client" />

declare module "*.vert.glsl" {
  const source: string;
  export default source;
}

declare module "*.frag.glsl" {
  const source: string;
  export default source;
}

declare module "*.glsl?raw" {
  const source: string;
  export default source;
}
