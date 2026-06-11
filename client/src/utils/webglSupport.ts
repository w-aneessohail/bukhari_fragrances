type WebGLState = "trying" | "active" | "unavailable";

export function detectWebGLSupport(): boolean {
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const contextOptions = { failIfMajorPerformanceCaveat: false };

    const gl = (canvas.getContext("webgl2", contextOptions) ??
      canvas.getContext("webgl", contextOptions) ??
      canvas.getContext("experimental-webgl" as "webgl", contextOptions)) as WebGLRenderingContext | null;

    if (!gl) return false;

    const loseContext = gl.getExtension("WEBGL_lose_context");
    loseContext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function isWebGLContextError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /webgl|WebGL|GL_VENDOR|GL_RENDERER|BindToCurrentSequence/i.test(message);
}

export type { WebGLState };
