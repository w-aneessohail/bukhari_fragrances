/** Warm light backdrop — pairs with the experience dark shell. */
export default function LightSiteBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#faf7f2]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/12 via-[#faf7f2] to-[#f2ede4]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#D4AF37]/8" />
      <div className="pointer-events-none absolute inset-0 experience-grain opacity-[0.06]" />
    </div>
  );
}
