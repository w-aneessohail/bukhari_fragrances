/** Shared classes for the modern homepage — follow active light/dark theme tokens. */
export const m = {
  section: "border-b border-border py-16 md:py-20",
  sectionInner: "mx-auto max-w-7xl px-4 md:px-6",
  eyebrow: "text-[11px] uppercase tracking-[0.4em] text-text-secondary",
  h2: "mt-3 font-heading text-3xl text-text-primary md:text-4xl",
  h3: "font-heading text-2xl text-text-primary",
  body: "text-sm leading-relaxed text-text-secondary md:text-base",
  card: "rounded-2xl border border-border bg-card backdrop-blur-md shadow-luxury",
  cardFlat: "border border-border bg-card backdrop-blur-md",
  muted: "text-text-secondary",
  faint: "text-text-secondary/80",
  gold: "text-accent-gold",
  divider: "border-border"
} as const;
