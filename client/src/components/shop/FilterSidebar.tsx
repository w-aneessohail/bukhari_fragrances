import type { Category } from "../../types/product.types";

type FilterSidebarProps = {
  categories: Category[];
  filters: {
    category?: string;
    gender?: string;
    scentFamily?: string;
    concentration?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: boolean;
    onSale?: boolean;
  };
  onChange: (key: string, value: string | boolean | undefined) => void;
  onClear: () => void;
};

const genders = ["MEN", "WOMEN", "UNISEX"];
const scentFamilies = ["FLORAL", "ORIENTAL", "WOODY", "FRESH", "CITRUS", "GOURMAND", "CHYPRE", "FOUGERE", "AQUATIC"];
const concentrations = ["EAU_DE_COLOGNE", "EAU_DE_TOILETTE", "EAU_DE_PARFUM", "PARFUM", "ATTAR"];

export default function FilterSidebar({ categories, filters, onChange, onClear }: FilterSidebarProps) {
  return (
    <aside className="space-y-6 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl text-accent-gold">Filters</h2>
        <button type="button" onClick={onClear} className="text-xs text-text-secondary hover:text-accent-gold">
          Clear all
        </button>
      </div>

      <div>
        <label className="mb-2 block text-sm text-text-secondary">Category</label>
        <select
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
          value={filters.category ?? ""}
          onChange={(event) => onChange("category", event.target.value || undefined)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-text-secondary">Gender</label>
        <select
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
          value={filters.gender ?? ""}
          onChange={(event) => onChange("gender", event.target.value || undefined)}
        >
          <option value="">All</option>
          {genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-text-secondary">Scent family</label>
        <select
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
          value={filters.scentFamily ?? ""}
          onChange={(event) => onChange("scentFamily", event.target.value || undefined)}
        >
          <option value="">All</option>
          {scentFamilies.map((family) => (
            <option key={family} value={family}>
              {family}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-text-secondary">Concentration</label>
        <select
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
          value={filters.concentration ?? ""}
          onChange={(event) => onChange("concentration", event.target.value || undefined)}
        >
          <option value="">All</option>
          {concentrations.map((item) => (
            <option key={item} value={item}>
              {item.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Min price"
          value={filters.minPrice ?? ""}
          onChange={(event) => onChange("minPrice", event.target.value || undefined)}
          className="rounded-md border border-border bg-input px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice ?? ""}
          onChange={(event) => onChange("maxPrice", event.target.value || undefined)}
          className="rounded-md border border-border bg-input px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={Boolean(filters.inStock)}
          onChange={(event) => onChange("inStock", event.target.checked ? true : undefined)}
        />
        In stock only
      </label>

      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={Boolean(filters.onSale)}
          onChange={(event) => onChange("onSale", event.target.checked ? true : undefined)}
        />
        On sale only
      </label>
    </aside>
  );
}
