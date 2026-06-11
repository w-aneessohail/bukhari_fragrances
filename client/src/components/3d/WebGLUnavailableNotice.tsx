import { detectWebGLSupport } from "../../utils/webglSupport";

type Props = {
  onRetry: () => void;
};

export default function WebGLUnavailableNotice({ onRetry }: Props) {
  return (
    <div className="pointer-events-auto fixed bottom-20 left-1/2 z-[140] w-[min(92vw,28rem)] -translate-x-1/2 rounded border border-[#D4AF37]/30 bg-black/85 px-4 py-3 text-center backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/80">3D experience paused</p>
      <p className="mt-2 text-sm text-white/75">
        Your browser blocked WebGL, so the bottle and floral 3D scene cannot render. Text and scroll still work.
      </p>
      <ul className="mt-3 space-y-1 text-left text-xs text-white/55">
        <li>• Open in Chrome or Edge (not an embedded preview)</li>
        <li>• Enable hardware acceleration in browser settings</li>
        <li>• Visit chrome://settings/system and turn it on, then restart</li>
      </ul>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 border border-[#D4AF37]/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
      >
        Retry 3D
      </button>
    </div>
  );
}

export function getInitialWebGLState(): "trying" | "unavailable" {
  return detectWebGLSupport() ? "trying" : "unavailable";
}
