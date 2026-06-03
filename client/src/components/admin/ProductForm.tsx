import { useState } from "react";
import type { Category } from "../../types/product.types";
import type { AdminProductInput } from "../../services/adminProductService";

const GENDERS = ["MEN", "WOMEN", "UNISEX"] as const;
const CONCENTRATIONS = ["EAU_DE_COLOGNE", "EAU_DE_TOILETTE", "EAU_DE_PARFUM", "PARFUM", "ATTAR"] as const;
const SCENT_FAMILIES = [
  "FLORAL",
  "ORIENTAL",
  "WOODY",
  "FRESH",
  "CITRUS",
  "GOURMAND",
  "CHYPRE",
  "FOUGERE",
  "AQUATIC"
] as const;

type ProductFormProps = {
  categories: Category[];
  onSubmit: (input: AdminProductInput) => Promise<void>;
  onCancel?: () => void;
  initial?: Partial<AdminProductInput>;
  submitLabel?: string;
};

const defaultValues: AdminProductInput = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  sku: "",
  categoryId: "",
  gender: "UNISEX",
  concentration: "EAU_DE_PARFUM",
  scentFamily: "ORIENTAL",
  isActive: true,
  isFeatured: false
};

function formatLabel(value: string) {
  return value.replace(/_/g, " ");
}

export default function ProductForm({
  categories,
  onSubmit,
  onCancel,
  initial,
  submitLabel = "Save product"
}: ProductFormProps) {
  const [form, setForm] = useState<AdminProductInput>({ ...defaultValues, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof AdminProductInput>(key: K, value: AdminProductInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        salePrice: form.salePrice ? Number(form.salePrice) : null
      });
    } catch {
      setError("Could not save product. Check required fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="text-text-secondary">Name</span>
          <input
            required
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="text-text-secondary">Description</span>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">SKU</span>
          <input
            required
            value={form.sku}
            onChange={(event) => update("sku", event.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Category</span>
          <select
            required
            value={form.categoryId}
            onChange={(event) => update("categoryId", event.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Price (PKR)</span>
          <input
            required
            type="number"
            min={1}
            value={form.price || ""}
            onChange={(event) => update("price", Number(event.target.value))}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Sale price (PKR)</span>
          <input
            type="number"
            min={0}
            value={form.salePrice ?? ""}
            onChange={(event) =>
              update("salePrice", event.target.value ? Number(event.target.value) : null)
            }
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Stock</span>
          <input
            required
            type="number"
            min={0}
            value={form.stock || ""}
            onChange={(event) => update("stock", Number(event.target.value))}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Gender</span>
          <select
            value={form.gender}
            onChange={(event) => update("gender", event.target.value as AdminProductInput["gender"])}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          >
            {GENDERS.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="text-text-secondary">Concentration</span>
          <select
            value={form.concentration}
            onChange={(event) =>
              update("concentration", event.target.value as AdminProductInput["concentration"])
            }
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          >
            {CONCENTRATIONS.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="text-text-secondary">Scent family</span>
          <select
            value={form.scentFamily}
            onChange={(event) =>
              update("scentFamily", event.target.value as AdminProductInput["scentFamily"])
            }
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          >
            {SCENT_FAMILIES.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={form.isActive ?? true}
            onChange={(event) => update("isActive", event.target.checked)}
          />
          Active on shop
        </label>

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={form.isFeatured ?? false}
            onChange={(event) => update("isFeatured", event.target.checked)}
          />
          Featured on homepage
        </label>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent-gold px-6 py-2 text-sm font-medium text-bg-primary disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-6 py-2 text-sm text-text-secondary"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
