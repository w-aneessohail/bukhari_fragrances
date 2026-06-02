import type { ScentNote } from "../../types/product.types";

type ScentNoteWheelProps = {
  notes: ScentNote[];
};

const LAYERS: { type: ScentNote["noteType"]; label: string }[] = [
  { type: "TOP", label: "Top" },
  { type: "HEART", label: "Heart" },
  { type: "BASE", label: "Base" }
];

export default function ScentNoteWheel({ notes }: ScentNoteWheelProps) {
  if (notes.length === 0) {
    return <p className="text-sm text-text-secondary">Scent profile coming soon.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="relative mx-auto h-48 w-48">
        <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
          <circle cx="100" cy="100" r="88" fill="none" stroke="var(--border-color)" strokeWidth="1" />
          <circle cx="100" cy="100" r="62" fill="none" stroke="var(--border-color)" strokeWidth="1" />
          <circle cx="100" cy="100" r="36" fill="none" stroke="var(--border-color)" strokeWidth="1" />
          {LAYERS.map((layer, index) => {
            const layerNotes = notes.filter((note) => note.noteType === layer.type);
            const avgIntensity =
              layerNotes.length > 0
                ? layerNotes.reduce((sum, note) => sum + note.intensity, 0) / layerNotes.length
                : 0;
            const radius = 88 - index * 26;
            const strokeWidth = 6 + (avgIntensity / 10) * 10;
            const opacity = 0.35 + (avgIntensity / 10) * 0.55;

            return (
              <circle
                key={layer.type}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="var(--accent-gold)"
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                strokeDasharray={`${(avgIntensity / 10) * 180} 360`}
                transform={`rotate(${index * 40} 100 100)`}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase tracking-widest text-text-secondary">Pyramid</span>
          <span className="font-heading text-lg text-accent-gold">Notes</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {LAYERS.map((layer) => {
          const layerNotes = notes.filter((note) => note.noteType === layer.type);

          return (
            <div key={layer.type} className="rounded-lg border border-border bg-card p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-accent-gold">{layer.label}</h4>
              <ul className="mt-2 space-y-2">
                {layerNotes.length === 0 ? (
                  <li className="text-xs text-text-secondary">—</li>
                ) : (
                  layerNotes.map((note) => (
                    <li key={note.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{note.ingredientName}</span>
                        <span className="text-xs text-text-secondary">{note.intensity}/10</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-secondary">
                        <div
                          className="h-full rounded-full bg-accent-gold"
                          style={{ width: `${(note.intensity / 10) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
