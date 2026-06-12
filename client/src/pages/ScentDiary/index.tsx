import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  createScentDiaryEntry,
  deleteScentDiaryEntry,
  fetchScentDiary,
  type ScentDiaryInput
} from "../../services/scentDiaryService";
import PageLoadingScreen from "../../components/ui/PageLoadingScreen";
import { fetchProducts } from "../../services/productService";

export default function ScentDiaryPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ScentDiaryInput>({
    productId: "",
    dateWorn: new Date().toISOString().slice(0, 10),
    rating: 5,
    mood: "",
    occasion: "",
    notes: ""
  });

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["scent-diary"],
    queryFn: fetchScentDiary
  });

  const { data: productsResponse } = useQuery({
    queryKey: ["scent-diary-products"],
    queryFn: () => fetchProducts({ limit: 100 })
  });

  const products = productsResponse?.data ?? [];

  const createMutation = useMutation({
    mutationFn: createScentDiaryEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scent-diary"] });
      setShowForm(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteScentDiaryEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scent-diary"] })
  });

  if (isLoading) {
    return <PageLoadingScreen label="Loading diary" />;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl text-accent-gold">Scent diary</h1>
          <p className="mt-2 text-text-secondary">Track when you wear each Bukhari fragrance.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((open) => !open)}
          className="rounded-lg bg-accent-gold px-5 py-2 text-sm font-medium text-bg-primary"
        >
          {showForm ? "Close" : "Log wear"}
        </button>
      </div>

      {showForm ? (
        <form
          className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6"
          onSubmit={(event) => {
            event.preventDefault();
            createMutation.mutate(form);
          }}
        >
          <label className="block text-sm">
            <span className="text-text-secondary">Fragrance</span>
            <select
              required
              value={form.productId}
              onChange={(event) => setForm((current) => ({ ...current, productId: event.target.value }))}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-text-secondary">Date worn</span>
            <input
              type="date"
              required
              value={form.dateWorn.slice(0, 10)}
              onChange={(event) => setForm((current) => ({ ...current, dateWorn: event.target.value }))}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="text-text-secondary">Rating</span>
            <select
              value={form.rating ?? 5}
              onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} stars
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-text-secondary">Mood</span>
              <input
                value={form.mood ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, mood: event.target.value }))}
                className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-text-secondary">Occasion</span>
              <input
                value={form.occasion ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, occasion: event.target.value }))}
                className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-text-secondary">Notes</span>
            <textarea
              rows={3}
              value={form.notes ?? ""}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
            />
          </label>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-accent-gold px-6 py-2 text-sm font-medium text-bg-primary disabled:opacity-50"
          >
            Save entry
          </button>
        </form>
      ) : null}

      {entries.length === 0 ? (
        <p className="mt-8 text-text-secondary">No entries yet. Log your first wear above.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link to={`/product/${entry.product.slug}`} className="font-heading text-xl hover:text-accent-gold">
                    {entry.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-text-secondary">
                    {new Date(entry.dateWorn).toLocaleDateString()}
                    {entry.rating ? ` · ${entry.rating} ★` : ""}
                    {entry.mood ? ` · ${entry.mood}` : ""}
                    {entry.occasion ? ` · ${entry.occasion}` : ""}
                  </p>
                  {entry.notes ? <p className="mt-2 text-sm text-text-secondary">{entry.notes}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(entry.id)}
                  className="text-sm text-text-secondary underline hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
